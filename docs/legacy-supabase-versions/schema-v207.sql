-- v2.0.7 Supabase hazırlık şeması
-- İstersen Supabase SQL Editor içinde çalıştırıp oyunları otomatik çekilecek hale getirebilirsin.
create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  genre text default 'Genel',
  status text default 'Yakında',
  episodes integer default 0,
  source text default 'Manuel Panel',
  cover text,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists public.update_notes (
  id uuid primary key default gen_random_uuid(),
  version text not null,
  title text not null,
  items jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

alter table public.games enable row level security;
alter table public.update_notes enable row level security;

create policy if not exists "games public read" on public.games for select using (true);
create policy if not exists "update notes public read" on public.update_notes for select using (true);
