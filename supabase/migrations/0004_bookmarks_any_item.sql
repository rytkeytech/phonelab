-- =====================================================================
-- 0004: Bookmarks for any saved item.
--
-- The first bookmarks table could only point at database repair cases
-- and lessons. PhoneLab also lets people save the sample cases (which
-- live in the app's code, not the database) and Chipset Explorer blocks,
-- so each bookmark now records a kind and the item's id as text:
--
--   kind 'lesson' -> lesson id      e.g. 'power/power-path'
--   kind 'case'   -> case URL id    (a database slug or a sample id)
--   kind 'block'  -> explorer block id, e.g. 'pmic'
--
-- Nothing has saved bookmarks yet, so the table is rebuilt. The app skips
-- bookmarks whose item no longer exists and offers to remove them.
-- =====================================================================

drop table public.bookmarks;

create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null check (kind in ('lesson', 'case', 'block')),
  item_id text not null check (char_length(item_id) between 1 and 200),
  created_at timestamptz not null default now(),
  unique (user_id, kind, item_id)
);
create index bookmarks_user_idx on public.bookmarks (user_id);

alter table public.bookmarks enable row level security;

-- Bookmarks are only ever added or removed, never edited.
grant select, insert, delete on public.bookmarks to authenticated;

create policy "Own bookmarks" on public.bookmarks
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
