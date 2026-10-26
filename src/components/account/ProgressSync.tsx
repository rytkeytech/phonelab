"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  claimLocalProgress,
  mergeProgress,
  replaceProgress,
  setRemoteWriter,
  type ProgressState,
} from "@/lib/progress";

type ProgressRow = { lesson_id: string; completed_at: string | null; quiz_score: number | null; quiz_total: number | null };
type GameRow = { scenario_id: string; best_score: number; max_score: number };

function fromRows(lessons: ProgressRow[], games: GameRow[]): ProgressState {
  const state: ProgressState = { completed: {}, quiz: {}, games: {} };
  for (const r of lessons) {
    if (r.completed_at) state.completed[r.lesson_id] = r.completed_at;
    if (r.quiz_score !== null && r.quiz_total) state.quiz[r.lesson_id] = { score: r.quiz_score, total: r.quiz_total };
  }
  for (const r of games) state.games[r.scenario_id] = { score: r.best_score, max: r.max_score };
  return state;
}

const lessonRow = (userId: string, lessonId: string, s: ProgressState) => ({
  user_id: userId,
  lesson_id: lessonId,
  completed_at: s.completed[lessonId] ?? null,
  quiz_score: s.quiz[lessonId]?.score ?? null,
  quiz_total: s.quiz[lessonId]?.total ?? null,
});

const gameRow = (userId: string, scenarioId: string, s: ProgressState) => ({
  user_id: userId,
  scenario_id: scenarioId,
  best_score: s.games[scenarioId].score,
  max_score: s.games[scenarioId].max,
});

const same = (a: object | undefined, b: object | undefined) => JSON.stringify(a) === JSON.stringify(b);

/**
 * Keeps the signed-in user's progress in their account.
 * Rendered once in the app layout, only when someone is signed in.
 */
export function ProgressSync({ userId }: { userId: string }) {
  useEffect(() => {
    const supabase = createClient();
    let active = true;

    const report = (what: string, error: { message: string } | null) => {
      if (error) console.warn(`PhoneLab: couldn't save ${what} to your account: ${error.message}`);
    };
    const saveLesson = async (id: string, s: ProgressState) =>
      report("lesson progress", (await supabase.from("user_progress").upsert(lessonRow(userId, id, s))).error);
    const saveGame = async (id: string, s: ProgressState) =>
      report("challenge score", (await supabase.from("game_results").upsert(gameRow(userId, id, s))).error);

    (async () => {
      const local = claimLocalProgress(userId);
      const [lessons, games] = await Promise.all([
        supabase.from("user_progress").select("lesson_id, completed_at, quiz_score, quiz_total"),
        supabase.from("game_results").select("scenario_id, best_score, max_score"),
      ]);
      if (!active) return;
      if (lessons.error || games.error) {
        report("progress", lessons.error ?? games.error);
        return; // Keep working from this browser's copy.
      }

      const remote = fromRows(lessons.data, games.data);
      const merged = mergeProgress(local, remote);
      replaceProgress(merged);

      // Upload whatever the account doesn't have yet (e.g. progress made before signing in).
      const lessonIds = new Set([...Object.keys(merged.completed), ...Object.keys(merged.quiz)]);
      await Promise.all([
        ...[...lessonIds]
          .filter((id) => merged.completed[id] !== remote.completed[id] || !same(merged.quiz[id], remote.quiz[id]))
          .map((id) => saveLesson(id, merged)),
        ...Object.keys(merged.games)
          .filter((id) => !same(merged.games[id], remote.games[id]))
          .map((id) => saveGame(id, merged)),
      ]);
      if (!active) return;

      // From now on, save each change as it happens.
      setRemoteWriter((change, state) => {
        if (change.kind === "lesson") void saveLesson(change.lessonId, state);
        else void saveGame(change.scenarioId, state);
      });
    })();

    return () => {
      active = false;
      setRemoteWriter(null);
    };
  }, [userId]);

  return null;
}
