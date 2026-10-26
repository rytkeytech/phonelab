"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { bookmarkKey, resetBookmarks, setAccountBookmarks, setSignedOut, type BookmarkKind } from "@/lib/bookmarks";

/**
 * Loads the signed-in user's bookmarks and saves changes to their account.
 * Rendered once in the app layout; userId is null when nobody is signed in.
 */
export function BookmarkSync({ userId }: { userId: string | null }) {
  useEffect(() => {
    if (!userId) {
      setSignedOut();
      return;
    }

    const supabase = createClient();
    let active = true;

    const write = async (kind: BookmarkKind, itemId: string, save: boolean) => {
      const { error } = save
        ? await supabase.from("bookmarks").upsert(
            { user_id: userId, kind, item_id: itemId },
            { onConflict: "user_id,kind,item_id", ignoreDuplicates: true },
          )
        : await supabase.from("bookmarks").delete().match({ kind, item_id: itemId });
      if (error) console.warn(`PhoneLab: couldn't ${save ? "save" : "remove"} the bookmark: ${error.message}`);
      return !error;
    };

    (async () => {
      const { data, error } = await supabase.from("bookmarks").select("kind, item_id");
      if (!active) return;
      if (error) {
        // Buttons stay disabled rather than showing everything as unsaved.
        console.warn(`PhoneLab: couldn't load your bookmarks: ${error.message}`);
        return;
      }
      setAccountBookmarks(
        data.map((r) => bookmarkKey(r.kind as BookmarkKind, r.item_id)),
        write,
      );
    })();

    return () => {
      active = false;
      resetBookmarks();
    };
  }, [userId]);

  return null;
}
