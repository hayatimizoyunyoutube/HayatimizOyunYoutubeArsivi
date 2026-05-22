-- =========================================================
-- HAYATIMIZ OYUN - TEK SUPABASE SCHEMA
-- Birleşik sürüm: v2.0.7 + v2.0.8 + v2.0.9 + v2.1.0 + v2.1.1
-- Kullanım: Supabase SQL Editor içine SADECE BU DOSYAYI yapıştırıp Run çalıştır.
-- Eski schema-v207/v208/v209/v210/v211 dosyalarını ayrıca çalıştırma.
-- Bu dosya mevcut veriyi silmez, tablo varsa güvenli şekilde kolon ekler.
-- =========================================================

create extension if not exists pgcrypto;

-- -------------------------
-- Ana oyun tablosu
-- -------------------------
create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  external_id text,
  title text not null,
  slug text unique,
  genre text default 'Genel',
  status text default 'Devam Ediyor',
  episodes integer default 0,
  season integer default 1,
  next_episode text,
  source text default 'Manuel Panel',
  cover text,
  cover_url text,
  progress integer default 0 check (progress >= 0 and progress <= 100),
  score numeric default 0,
  quality_score integer default 0 check (quality_score >= 0 and quality_score <= 100),
  priority text default 'Normal',
  platform text default 'YouTube',
  watch_state text default 'Listede',
  tags text[] default '{}',
  description text,
  youtube_playlist_id text,
  youtube_channel_id text,
  last_synced_at timestamptz,
  is_featured boolean default false,
  is_active boolean default true,
  metadata jsonb default '{}'::jsonb,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table public.games add column if not exists external_id text;
alter table public.games add column if not exists slug text;
alter table public.games add column if not exists genre text default 'Genel';
alter table public.games add column if not exists status text default 'Devam Ediyor';
alter table public.games add column if not exists episodes integer default 0;
alter table public.games add column if not exists season integer default 1;
alter table public.games add column if not exists next_episode text;
alter table public.games add column if not exists source text default 'Manuel Panel';
alter table public.games add column if not exists cover text;
alter table public.games add column if not exists cover_url text;
alter table public.games add column if not exists progress integer default 0;
alter table public.games add column if not exists score numeric default 0;
alter table public.games add column if not exists quality_score integer default 0;
alter table public.games add column if not exists priority text default 'Normal';
alter table public.games add column if not exists platform text default 'YouTube';
alter table public.games add column if not exists watch_state text default 'Listede';
alter table public.games add column if not exists tags text[] default '{}';
alter table public.games add column if not exists description text;
alter table public.games add column if not exists youtube_playlist_id text;
alter table public.games add column if not exists youtube_channel_id text;
alter table public.games add column if not exists last_synced_at timestamptz;
alter table public.games add column if not exists is_featured boolean default false;
alter table public.games add column if not exists is_active boolean default true;
alter table public.games add column if not exists metadata jsonb default '{}'::jsonb;
alter table public.games add column if not exists updated_at timestamptz default now();
alter table public.games add column if not exists created_at timestamptz default now();

create index if not exists games_status_idx on public.games(status);
create index if not exists games_priority_idx on public.games(priority);
create index if not exists games_watch_state_idx on public.games(watch_state);
create index if not exists games_slug_idx on public.games(slug);

-- v2.0.7 Güncelleme notları
create table if not exists public.update_notes (
  id uuid primary key default gen_random_uuid(),
  version text not null,
  title text not null,
  items jsonb default '[]'::jsonb,
  date text,
  created_at timestamptz default now()
);

alter table public.update_notes add column if not exists version text;
alter table public.update_notes add column if not exists title text;
alter table public.update_notes add column if not exists items jsonb default '[]'::jsonb;
alter table public.update_notes add column if not exists date text;
alter table public.update_notes add column if not exists created_at timestamptz default now();

-- v2.0.8 Otomatik çekme kaynak/log/ayar tabloları
create table if not exists public.sync_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  enabled boolean default false,
  priority integer default 99,
  last_sync timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.sync_logs (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  status text not null,
  item_count integer default 0,
  note text,
  payload jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Site ayarları tablosu
-- HOTFIX: Eski kurulumlarda public.site_settings tablosu farklı kolonlarla oluşmuş olabilir.
-- Bu blok tabloyu silmeden "key" + "value" yapısına güvenli şekilde yükseltir.
do $$
declare
  value_type text;
begin
  if to_regclass('public.site_settings') is null then
    create table public.site_settings (
      "key" text primary key,
      value jsonb not null default '{}'::jsonb,
      updated_at timestamptz default now()
    );
  else
    alter table public.site_settings add column if not exists "key" text;

    select data_type into value_type
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'site_settings'
      and column_name = 'value';

    if value_type is null then
      alter table public.site_settings add column value jsonb default '{}'::jsonb;
    elsif value_type <> 'jsonb' then
      execute 'alter table public.site_settings alter column value type jsonb using coalesce(to_jsonb(value), ''{}''::jsonb)';
    end if;

    alter table public.site_settings add column if not exists updated_at timestamptz default now();
  end if;
end $$;

create unique index if not exists site_settings_key_unique_idx on public.site_settings ("key");

-- v2.0.9 Kontrol merkezi / koleksiyon / sezon bölüm
create table if not exists public.ho_collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  tag text,
  count integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.ho_episode_schedule (
  id uuid primary key default gen_random_uuid(),
  game_id uuid references public.games(id) on delete set null,
  game_title text not null,
  season integer default 1,
  episode_title text,
  episode_no integer,
  publish_day text,
  publish_at timestamptz,
  status text default 'Planlandı',
  created_at timestamptz default now()
);

create table if not exists public.archive_analytics (
  id uuid primary key default gen_random_uuid(),
  metric_key text not null,
  metric_value jsonb default '{}'::jsonb,
  captured_at timestamptz default now()
);

-- Eski v2.0.9 dosyasında public.ho_games adı geçtiği için uyumluluk view'i.
-- Ana tablo public.games'tir. Kod tarafında public.games kullanılmalı.
create or replace view public.ho_games as select * from public.games;

-- v2.1.0 AI / bildirim / tema / otomasyon
create table if not exists public.watch_progress (
  id uuid primary key default gen_random_uuid(),
  game_id text not null,
  user_key text default 'default',
  episode text,
  percent integer default 0 check (percent >= 0 and percent <= 100),
  last_watched_at timestamptz default now(),
  next_episode text,
  created_at timestamptz default now()
);

create table if not exists public.ai_recommendations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  reason text,
  confidence integer default 0 check (confidence >= 0 and confidence <= 100),
  action text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.notification_feed (
  id uuid primary key default gen_random_uuid(),
  level text default 'bilgi',
  title text not null,
  body text,
  is_read boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.theme_presets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  preset_key text unique not null,
  accent text,
  description text,
  is_active boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.automation_rules (
  id uuid primary key default gen_random_uuid(),
  rule_key text unique not null,
  title text not null,
  is_enabled boolean default true,
  config jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- v2.1.1 Test merkezi
create table if not exists public.test_runs (
  id uuid primary key default gen_random_uuid(),
  version text not null default 'v2.1.1',
  score integer default 0,
  critical_count integer default 0,
  warning_count integer default 0,
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.error_reports (
  id uuid primary key default gen_random_uuid(),
  level text not null default 'info',
  area text,
  title text not null,
  detail text,
  status text default 'open',
  created_at timestamptz default now()
);

create table if not exists public.api_status_checks (
  id uuid primary key default gen_random_uuid(),
  service_name text not null,
  status text not null,
  detail text,
  checked_at timestamptz default now()
);

-- Sürüm tablosu: tüm versiyonları tek yerden takip eder.
create table if not exists public.ho_versions (
  id uuid primary key default gen_random_uuid(),
  version text not null unique,
  title text not null,
  features jsonb default '[]'::jsonb,
  is_current boolean default false,
  created_at timestamptz default now()
);

insert into public.ho_versions (version, title, features, is_current) values
('v2.0.7', 'Otomatik çekme altyapısı', '["JSON veri sistemi", "fallback", "auto-sync"]'::jsonb, false),
('v2.0.8', 'Akıllı arşiv', '["akıllı filtre", "kalite skoru", "kopya kontrol"]'::jsonb, false),
('v2.0.9', 'Kontrol merkezi', '["sezon/bölüm", "takvim", "koleksiyon"]'::jsonb, false),
('v2.1.0', 'AI Archive Studio', '["AI öneri", "bildirim", "izleme ilerleme", "tema"]'::jsonb, false),
('v2.1.1', 'Test Center + Supabase Tek Schema Fix', '["test merkezi", "hata raporu", "API durum", "tek schema"]'::jsonb, true)
on conflict (version) do update set
  title = excluded.title,
  features = excluded.features,
  is_current = excluded.is_current;

insert into public.sync_sources (name, enabled, priority) values
  ('Local JSON', true, 1),
  ('Supabase', false, 2),
  ('YouTube API', false, 3),
  ('Manuel Panel', true, 4),
  ('Akıllı Eşleştirme', true, 5)
on conflict (name) do update set enabled = excluded.enabled, priority = excluded.priority;

insert into public.site_settings ("key", value) values
  ('current_version', '{"version":"v2.1.1","name":"Full Merged Supabase Fix"}'::jsonb),
  ('safe_fallback', '{"enabled":true,"mode":"local-json"}'::jsonb),
  ('auto_fetch', '{"youtube":false,"supabase":false,"manual":true}'::jsonb)
on conflict ("key") do update set value = excluded.value, updated_at = now();

-- Örnek başlangıç kayıtları: veri varsa kopya oluşturmaz.
insert into public.games (slug, title, genre, status, episodes, season, next_episode, source, progress, score, quality_score, priority, platform, watch_state, tags, cover_url, is_featured)
values
  ('resident-evil-4-remake', 'Resident Evil 4 Remake', 'Korku / Aksiyon', 'Devam Ediyor', 14, 1, '15. Bölüm', 'Local JSON', 68, 9.2, 94, 'Haftalık', 'YouTube', 'İzleniyor', array['Korku','Aksiyon'], 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=900&auto=format&fit=crop', true),
  ('alan-wake-2', 'Alan Wake 2', 'Korku / Hikaye Odaklı', 'Devam Ediyor', 8, 1, '9. Bölüm', 'Local JSON', 42, 9.1, 91, 'Öncelikli', 'YouTube', 'İzleniyor', array['Korku','Hikaye'], 'https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=900&auto=format&fit=crop', true)
on conflict (slug) do update set
  title = excluded.title,
  genre = excluded.genre,
  status = excluded.status,
  episodes = excluded.episodes,
  next_episode = excluded.next_episode,
  progress = excluded.progress,
  score = excluded.score,
  quality_score = excluded.quality_score,
  updated_at = now();

insert into public.update_notes (version, title, items, date) values
  ('v2.1.1', 'Full Merged Supabase Tek Schema Fix', '["Vercel 404 için vercel.json eklendi", "Supabase schema-v207/v208/v209/v210/v211 tek schema.sql içine birleşti", "legacy SQL dosyaları docs altına alındı", "root-level ZIP hazırlandı"]'::jsonb, '2026-05-22')
;

-- Storage bucket hazırlığı: hata verirse Supabase panelden manuel oluşturulabilir.
insert into storage.buckets (id, name, public)
values
  ('game-covers', 'game-covers', true),
  ('profile-photos', 'profile-photos', true)
on conflict (id) do nothing;

-- RLS aç
alter table public.games enable row level security;
alter table public.update_notes enable row level security;
alter table public.sync_sources enable row level security;
alter table public.sync_logs enable row level security;
alter table public.site_settings enable row level security;
alter table public.ho_collections enable row level security;
alter table public.ho_episode_schedule enable row level security;
alter table public.archive_analytics enable row level security;
alter table public.watch_progress enable row level security;
alter table public.ai_recommendations enable row level security;
alter table public.notification_feed enable row level security;
alter table public.theme_presets enable row level security;
alter table public.automation_rules enable row level security;
alter table public.test_runs enable row level security;
alter table public.error_reports enable row level security;
alter table public.api_status_checks enable row level security;
alter table public.ho_versions enable row level security;

-- Public read policy helper: PostgreSQL CREATE POLICY IF NOT EXISTS desteklemediği için DO blok kullanıldı.
do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='games' and policyname='games public read') then
    create policy "games public read" on public.games for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='update_notes' and policyname='update notes public read') then
    create policy "update notes public read" on public.update_notes for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='sync_sources' and policyname='sync sources public read') then
    create policy "sync sources public read" on public.sync_sources for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='sync_logs' and policyname='sync logs public read') then
    create policy "sync logs public read" on public.sync_logs for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='site_settings' and policyname='site settings public read') then
    create policy "site settings public read" on public.site_settings for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='ho_collections' and policyname='ho collections public read') then
    create policy "ho collections public read" on public.ho_collections for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='ho_episode_schedule' and policyname='ho episode schedule public read') then
    create policy "ho episode schedule public read" on public.ho_episode_schedule for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='archive_analytics' and policyname='archive analytics public read') then
    create policy "archive analytics public read" on public.archive_analytics for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='watch_progress' and policyname='watch progress public read') then
    create policy "watch progress public read" on public.watch_progress for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='ai_recommendations' and policyname='ai recommendations public read') then
    create policy "ai recommendations public read" on public.ai_recommendations for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='notification_feed' and policyname='notification feed public read') then
    create policy "notification feed public read" on public.notification_feed for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='theme_presets' and policyname='theme presets public read') then
    create policy "theme presets public read" on public.theme_presets for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='automation_rules' and policyname='automation rules public read') then
    create policy "automation rules public read" on public.automation_rules for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='test_runs' and policyname='test runs public read') then
    create policy "test runs public read" on public.test_runs for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='error_reports' and policyname='error reports public read') then
    create policy "error reports public read" on public.error_reports for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='api_status_checks' and policyname='api status checks public read') then
    create policy "api status checks public read" on public.api_status_checks for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='ho_versions' and policyname='ho versions public read') then
    create policy "ho versions public read" on public.ho_versions for select using (true);
  end if;
end $$;

-- Supabase Storage public read policyleri
-- Not: Eğer storage.objects policy zaten varsa hata vermesin diye kontrol edilir.
do $$
begin
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='game covers public read') then
    create policy "game covers public read" on storage.objects for select using (bucket_id = 'game-covers');
  end if;
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='profile photos public read') then
    create policy "profile photos public read" on storage.objects for select using (bucket_id = 'profile-photos');
  end if;
end $$;

-- Son kontrol sorguları
select 'Hayatımız Oyun tek Supabase schema hazır' as status, 'v2.1.1-full-merged-supabase-fix' as version;
