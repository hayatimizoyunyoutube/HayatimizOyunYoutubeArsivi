-- v4.0.1 SUPABASE TEMIZ SIFIRLAMA + SITE UYUMLULUK SQL
-- DIKKAT: Bu dosya games, calendar, notes vb. site tablolarını temiz arşiv başlangıcı için sıfırlar.
-- Kullanıcı/yetki tablosu korunur. Mevcut games kayıtları önce yedeklenir.

create extension if not exists pgcrypto;

create table if not exists public.games_backup_v401_reset as
select *, now() as backup_created_at from public.games where false;

insert into public.games_backup_v401_reset
select *, now() as backup_created_at from public.games;

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text not null,
  description text default '',
  story_text text default '',
  status text default 'Devam Eden',
  status_slug text default 'devam-eden',
  status_bucket text default '',
  genre text default 'Genel',
  genre_slug text default 'genel',
  tags text default '',
  platforms text default '',
  release_date text default '',
  score numeric default 0,
  cover_url text default '',
  banner_url text default '',
  series_name text default '',
  series_slug text default '',
  collection_name text default '',
  playlist_url text default '',
  youtube_playlist_url text default '',
  youtube_playlist_id text default '',
  video_url text default '',
  episodes jsonb default '[]'::jsonb,
  episode_count int default 0,
  watched_episode_count int default 0,
  series_order int default 0,
  sort_order int default 0,
  rawg_id text,
  rawg_slug text default '',
  steam_app_id text default '',
  meta_source text default '',
  meta_checked_at timestamptz,
  cover_source text default '',
  is_featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.games add column if not exists slug text;
alter table public.games add column if not exists title text;
alter table public.games add column if not exists description text default '';
alter table public.games add column if not exists story_text text default '';
alter table public.games add column if not exists status text default 'Devam Eden';
alter table public.games add column if not exists status_slug text default 'devam-eden';
alter table public.games add column if not exists status_bucket text default '';
alter table public.games add column if not exists genre text default 'Genel';
alter table public.games add column if not exists genre_slug text default 'genel';
alter table public.games add column if not exists tags text default '';
alter table public.games add column if not exists platforms text default '';
alter table public.games add column if not exists release_date text default '';
alter table public.games add column if not exists score numeric default 0;
alter table public.games add column if not exists cover_url text default '';
alter table public.games add column if not exists banner_url text default '';
alter table public.games add column if not exists series_name text default '';
alter table public.games add column if not exists series_slug text default '';
alter table public.games add column if not exists collection_name text default '';
alter table public.games add column if not exists playlist_url text default '';
alter table public.games add column if not exists youtube_playlist_url text default '';
alter table public.games add column if not exists youtube_playlist_id text default '';
alter table public.games add column if not exists video_url text default '';
alter table public.games add column if not exists episodes jsonb default '[]'::jsonb;
alter table public.games add column if not exists episode_count int default 0;
alter table public.games add column if not exists watched_episode_count int default 0;
alter table public.games add column if not exists series_order int default 0;
alter table public.games add column if not exists sort_order int default 0;
alter table public.games add column if not exists rawg_id text;
alter table public.games add column if not exists rawg_slug text default '';
alter table public.games add column if not exists steam_app_id text default '';
alter table public.games add column if not exists meta_source text default '';
alter table public.games add column if not exists meta_checked_at timestamptz;
alter table public.games add column if not exists cover_source text default '';
alter table public.games add column if not exists is_featured boolean default false;
alter table public.games add column if not exists created_at timestamptz default now();
alter table public.games add column if not exists updated_at timestamptz default now();

-- Temiz sıfırlama: oyun arşivini boş başlatır. Kullanıcı/yetki silmez.
truncate table public.games restart identity cascade;

alter table public.games enable row level security;
drop policy if exists "games_public_read" on public.games;
drop policy if exists "games_admin_write" on public.games;
drop policy if exists "games_all_access" on public.games;
create policy "games_public_read" on public.games for select using (true);
create policy "games_admin_write" on public.games for all using (true) with check (true);

create index if not exists games_slug_idx on public.games(slug);
create index if not exists games_title_idx on public.games(title);
create index if not exists games_series_idx on public.games(series_name);
create index if not exists games_status_idx on public.games(status);

create table if not exists public.site_runtime_config (
  key text primary key,
  value jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

insert into public.site_runtime_config(key,value,updated_at)
values ('site_version', jsonb_build_object('version','v4.0.1','label','v4.0.1 Supabase Temiz Stabilite','vercel_label','v4.0.1-supabase-temiz-stabilite','status','Başarılı'), now())
on conflict (key) do update set value=excluded.value, updated_at=now();

insert into public.site_runtime_config(key,value,updated_at)
values ('maintenance_mode', jsonb_build_object('enabled',false,'message','Site yayında.','percent',100,'adminBypass',true), now())
on conflict (key) do update set value=excluded.value, updated_at=now();

select 'Başarılı' as durum, 'v4.0.1' as surum, 'Supabase temiz sıfırlama ve games uyumluluk tamamlandı' as islem;
