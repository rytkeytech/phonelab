"use client";

import { useSyncExternalStore } from "react";

/*
 * Saved bookmarks (lessons, repair cases and Chipset Explorer blocks).
 *
 * Bookmarks live in the signed-in user's account only. <BookmarkSync>
 * loads them once per visit and connects a writer here, so every change
 * is saved to Supabase. Components only use useBookmarks() and the
 * functions below.
 */

export type BookmarkKind = "lesson" | "case" | "block";

export type BookmarkState = {
  /** "loading" until <BookmarkSync> knows whether someone is signed in. */
  status: "loading" | "signed-out" | "ready";
  /** Keys made with bookmarkKey() */
  saved: ReadonlySet<string>;
};

type RemoteWriter = (kind: BookmarkKind, itemId: string, save: boolean) => Promise<boolean>;

const LOADING: BookmarkState = { status: "loading", saved: new Set() };

let state = LOADING;
let remoteWriter: RemoteWriter | null = null;
const listeners = new Set<() => void>();

export const bookmarkKey = (kind: BookmarkKind, itemId: string) => `${kind}:${itemId}`;

function set(next: BookmarkState) {
  state = next;
  listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  return () => {
    listeners.delete(notify);
  };
}

export function useBookmarks() {
  return useSyncExternalStore(subscribe, () => state, () => LOADING);
}

/** Saves or removes a bookmark. The change shows at once and is undone if the account can't be updated. */
export async function setBookmarked(kind: BookmarkKind, itemId: string, save: boolean) {
  if (state.status !== "ready" || !remoteWriter) return;
  const key = bookmarkKey(kind, itemId);
  const update = (add: boolean) => {
    const saved = new Set(state.saved);
    if (add) saved.add(key);
    else saved.delete(key);
    set({ ...state, saved });
  };

  update(save);
  if (!(await remoteWriter(kind, itemId, save))) update(!save);
}

// ---- Account sync (used by <BookmarkSync>) ----

export function setSignedOut() {
  remoteWriter = null;
  set({ status: "signed-out", saved: new Set() });
}

export function setAccountBookmarks(keys: string[], writer: RemoteWriter) {
  remoteWriter = writer;
  set({ status: "ready", saved: new Set(keys) });
}

export function resetBookmarks() {
  remoteWriter = null;
  set(LOADING);
}
