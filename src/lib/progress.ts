"use client";

import { useSyncExternalStore } from "react";

/*
 * Learning progress, saved in this browser's localStorage.
 * Temporary until Supabase accounts arrive: then this module's functions
 * will read and write the user_progress table instead, and components
 * using useProgress() won't need to change.
 */

export type QuizResult = { score: number; total: number };
export type GameResult = { score: number; max: number };

export type ProgressState = {
  /** lessonId -> ISO date completed */
  completed: Record<string, string>;
  /** lessonId -> best quiz result */
  quiz: Record<string, QuizResult>;
  /** scenarioId -> best diagnostic game result */
  games: Record<string, GameResult>;
};

const STORAGE_KEY = "phonelab.progress.v1";
const EMPTY: ProgressState = { completed: {}, quiz: {}, games: {} };

let cache: ProgressState | null = null;
const listeners = new Set<() => void>();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function load(): ProgressState {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    if (isRecord(parsed) && isRecord(parsed.completed) && isRecord(parsed.quiz)) {
      // Saves from before the diagnostic game have no "games" entry.
      return { ...(parsed as ProgressState), games: isRecord(parsed.games) ? (parsed.games as ProgressState["games"]) : {} };
    }
  } catch {
    // Storage blocked or corrupted: start fresh.
  }
  return EMPTY;
}

function getSnapshot() {
  cache ??= load();
  return cache;
}

function getServerSnapshot() {
  return EMPTY;
}

function save(next: ProgressState) {
  cache = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Still works for this visit even if it can't be saved.
  }
  listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  // Keep other open tabs in sync.
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = null;
      notify();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(notify);
    window.removeEventListener("storage", onStorage);
  };
}

export function useProgress() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function setLessonComplete(lessonId: string, complete: boolean) {
  const state = getSnapshot();
  const next = { ...state.completed };
  if (complete) next[lessonId] = new Date().toISOString();
  else delete next[lessonId];
  save({ ...state, completed: next });
}

/** Keeps the best score for each lesson. */
export function recordQuizResult(lessonId: string, result: QuizResult) {
  const state = getSnapshot();
  const best = state.quiz[lessonId];
  if (best && best.score >= result.score) return;
  save({ ...state, quiz: { ...state.quiz, [lessonId]: result } });
}

/** Keeps the best score for each scenario. */
export function recordGameResult(scenarioId: string, result: GameResult) {
  const state = getSnapshot();
  const best = state.games[scenarioId];
  if (best && best.score >= result.score) return;
  save({ ...state, games: { ...state.games, [scenarioId]: result } });
}

export function resetProgress() {
  save(EMPTY);
}
