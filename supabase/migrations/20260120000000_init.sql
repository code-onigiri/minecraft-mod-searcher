create extension if not exists "pgcrypto";

create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mod_name text not null,
  mod_slug text,
  source_urls jsonb not null,
  icon_url text,
  memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mod_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mod_list_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  list_id uuid not null references public.mod_lists(id) on delete cascade,
  mod_name text not null,
  mod_slug text,
  source_urls jsonb not null,
  icon_url text,
  pinned_version text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bookmarks_user_id_idx on public.bookmarks(user_id);
create index if not exists mod_lists_user_id_idx on public.mod_lists(user_id);
create index if not exists mod_list_items_user_id_idx on public.mod_list_items(user_id);
create index if not exists mod_list_items_list_id_idx on public.mod_list_items(list_id);

alter table public.bookmarks enable row level security;
alter table public.mod_lists enable row level security;
alter table public.mod_list_items enable row level security;

create policy "bookmarks_select" on public.bookmarks
  for select using (auth.uid() = user_id);
create policy "bookmarks_insert" on public.bookmarks
  for insert with check (auth.uid() = user_id);
create policy "bookmarks_update" on public.bookmarks
  for update using (auth.uid() = user_id);
create policy "bookmarks_delete" on public.bookmarks
  for delete using (auth.uid() = user_id);

create policy "mod_lists_select" on public.mod_lists
  for select using (auth.uid() = user_id);
create policy "mod_lists_insert" on public.mod_lists
  for insert with check (auth.uid() = user_id);
create policy "mod_lists_update" on public.mod_lists
  for update using (auth.uid() = user_id);
create policy "mod_lists_delete" on public.mod_lists
  for delete using (auth.uid() = user_id);

create policy "mod_list_items_select" on public.mod_list_items
  for select using (auth.uid() = user_id);
create policy "mod_list_items_insert" on public.mod_list_items
  for insert with check (auth.uid() = user_id);
create policy "mod_list_items_update" on public.mod_list_items
  for update using (auth.uid() = user_id);
create policy "mod_list_items_delete" on public.mod_list_items
  for delete using (auth.uid() = user_id);
