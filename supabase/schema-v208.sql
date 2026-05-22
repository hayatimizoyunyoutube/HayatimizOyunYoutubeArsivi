-- Hayatımız Oyun v2.0.8 Supabase hazırlık şeması
-- SQL Editor içinde çalıştırılabilir. Mevcut tablo varsa bozmaz.

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  genre text,
  status text default 'Devam Ediyor',
  episodes int default 0,
  source text default 'Supabase',
  cover_url text,
  progress int default 0,
  score numeric default 0,
  priority text default 'Normal',
  platform text default 'YouTube',
  tags text[] default '{}',
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists public.sync_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  enabled boolean default false,
  priority int default 99,
  last_sync timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.sync_logs (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  status text not null,
  item_count int default 0,
  note text,
  created_at timestamptz default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

insert into public.sync_sources (name, enabled, priority)
values
  ('Local JSON', true, 1),
  ('Supabase', false, 2),
  ('YouTube API', false, 3),
  ('Manuel Panel', true, 4),
  ('Akıllı Eşleştirme', true, 5)
on conflict (name) do update set enabled = excluded.enabled, priority = excluded.priority;
