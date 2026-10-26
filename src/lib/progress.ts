"use client";

import { useSyncExternalStore } from "react";

/*
 * Learning progress and scores.
 *
 * Always kept in this browser's localStorage so the app works signed out.
 * When signed in, <ProgressSync> merges it with the user's account and
 * connects a remote writer here, so every change is also saved to Supabase.
 * Components only use useProgress() and the functions below.
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

/** What changed, so the remote writer saves only that record. */
export type ProgressChange = { kind: "lesson"; lessonId: string } | { kind: "game"; scenarioId: string };
type RemoteWriter = (change: ProgressChange, state: ProgressState) => void;

const STORAGE_KEY = "phonelab.progress.v1";
/** Which account the stored progress belongs to; absent while signed out. */
const OWNER_KEY = "phonelab.progress.owner";
const EMPTY: ProgressState = { completed: {}, quiz: {}, games: {} };

let cache: ProgressState | null = null;
let remoteWriter: RemoteWriter | null = null;
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

export function getProgressSnapshot() {
  cache ??= load();
  return cache;
}

function getServerSnapshot() {
  return EMPTY;
}

function save(next: ProgressState, change?: ProgressChange) {
  cache = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Still works for this visit even if it can't be saved.
  }
  listeners.forEach((notify) => notify());
  if (change) remoteWriter?.(change, next);
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
  return useSyncExternalStore(subscribe, getProgressSnapshot, getServerSnapshot);
}

export function setLessonComplete(lessonId: string, complete: boolean) {
  const state = getProgressSnapshot();
  const next = { ...state.completed };
  if (complete) next[lessonId] = new Date().toISOString();
  else delete next[lessonId];
  save({ ...state, completed: next }, { kind: "lesson", lessonId });
}

/** Keeps the best score for each lesson. */
export function recordQuizResult(lessonId: string, result: QuizResult) {
  const state = getProgressSnapshot();
  const best = state.quiz[lessonId];
  if (best && best.score >= result.score) return;
  save({ ...state, quiz: { ...state.quiz, [lessonId]: result } }, { kind: "lesson", lessonId });
}

/** Keeps the best score for each scenario. */
export function recordGameResult(scenarioId: string, result: GameResult) {
  const state = getProgressSnapshot();
  const best = state.games[scenarioId];
  if (best && best.score >= result.score) return;
  save({ ...state, games: { ...state.games, [scenarioId]: result } }, { kind: "game", scenarioId });
}

/** Clears progress in this browser (the account copy, if any, is kept). */
export function resetProgress() {
  try {
    localStorage.removeItem(OWNER_KEY);
  } catch {
    // ignore
  }
  save(EMPTY);
}

// ---- Account sync (used by <ProgressSync>) ----

const earlier = (a?: string, b?: string) => (!a ? b : !b ? a : a < b ? a : b);
const better = <T extends { score: number }>(a?: T, b?: T) => (!a ? b : !b ? a : b.score > a.score ? b : a);

/** Combines two progress records, keeping completions from both and the best scores. */
export function mergeProgress(a: ProgressState, b: ProgressState): ProgressState {
  const merged: ProgressState = { completed: {}, quiz: {}, games: {} };
  for (const id of new Set([...Object.keys(a.completed), ...Object.keys(b.completed)])) {
    merged.completed[id] = earlier(a.completed[id], b.completed[id])!;
  }
  for (const id of new Set([...Object.keys(a.quiz), ...Object.keys(b.quiz)])) {
    merged.quiz[id] = better(a.quiz[id], b.quiz[id])!;
  }
  for (const id of new Set([...Object.keys(a.games), ...Object.keys(b.games)])) {
    merged.games[id] = better(a.games[id], b.games[id])!;
  }
  return merged;
}

/**
 * Prepares this browser's progress for a signed-in user and returns it.
 * Progress made while signed out is kept (it gets added to the account);
 * progress left by a different account on this browser is discarded.
 */
export function claimLocalProgress(userId: string): ProgressState {
  let owner: string | null = null;
  try {
    owner = localStorage.getItem(OWNER_KEY);
    localStorage.setItem(OWNER_KEY, userId);
  } catch {
    // ignore
  }
  if (owner && owner !== userId) save(EMPTY);
  return getProgressSnapshot();
}

/** Replaces this browser's progress (after merging with the account). */
export function replaceProgress(state: ProgressState) {
  save(state);
}

export function setRemoteWriter(writer: RemoteWriter | null) {
  remoteWriter = writer;
}
