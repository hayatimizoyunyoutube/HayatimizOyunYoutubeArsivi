-- Hayatımız Oyun v2.0.9 Supabase hazırlık şeması
create table if not exists public.ho_collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  tag text,
  created_at timestamptz default now()
);

create table if not exists public.ho_episode_schedule (
  id uuid primary key default gen_random_uuid(),
  game_title text not null,
  season integer default 1,
  episode_title text,
  publish_day text,
  status text default 'Planlandı',
  created_at timestamptz default now()
);

alter table public.ho_games add column if not exists season integer default 1;
alter table public.ho_games add column if not exists next_episode text;
alter table public.ho_games add column if not exists quality_score integer default 0;
alter table public.ho_games add column if not exists watch_state text default 'Listede';
