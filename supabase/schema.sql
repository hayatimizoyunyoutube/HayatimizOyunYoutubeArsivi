-- Hayatımız Oyun v2.5.3 FIX5 - Hızlı / Takılmayan Supabase Schema
-- Bu dosya uzun süren DELETE/UPDATE işlemlerini kaldırır.
-- Mevcut oyunları, kapakları, kullanıcıları, bakım ayarlarını ve manuel takvim kayıtlarını SİLMEZ.
-- SQL Editor'da Running'de kalmaması için lock ve statement timeout eklenmiştir.

set lock_timeout = '3s';
set statement_timeout = '25s';

create extension if not exists pgcrypto;

create table if not exists public.site_runtime_config (
  key text primary key,
  value jsonb,
  updated_at timestamptz default now()
);

create table if not exists public.site_calendar_events (
  id uuid primary key default gen_random_uuid(),
  title text,
  event_date date,
  event_time text,
  event_type text default 'Yayın',
  game_id text,
  game_title text,
  episode_number integer,
  episode_title text,
  cover_url text,
  video_url text,
  note text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.site_calendar_events add column if not exists title text;
alter table public.site_calendar_events add column if not exists event_date date;
alter table public.site_calendar_events add column if not exists event_time text;
alter table public.site_calendar_events add column if not exists event_type text default 'Yayın';
alter table public.site_calendar_events add column if not exists game_id text;
alter table public.site_calendar_events add column if not exists game_title text;
alter table public.site_calendar_events add column if not exists episode_number integer;
alter table public.site_calendar_events add column if not exists episode_title text;
alter table public.site_calendar_events add column if not exists cover_url text;
alter table public.site_calendar_events add column if not exists video_url text;
alter table public.site_calendar_events add column if not exists note text;
alter table public.site_calendar_events add column if not exists is_active boolean default true;
alter table public.site_calendar_events add column if not exists created_at timestamptz default now();
alter table public.site_calendar_events add column if not exists updated_at timestamptz default now();

create table if not exists public.site_update_notes (
  id bigserial primary key,
  version text,
  title text,
  summary text,
  note text,
  description text,
  image_url text,
  status text default 'published',
  pinned boolean default false,
  planned boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.site_update_notes add column if not exists version text;
alter table public.site_update_notes add column if not exists title text;
alter table public.site_update_notes add column if not exists summary text;
alter table public.site_update_notes add column if not exists note text;
alter table public.site_update_notes add column if not exists description text;
alter table public.site_update_notes add column if not exists image_url text;
alter table public.site_update_notes add column if not exists status text default 'published';
alter table public.site_update_notes add column if not exists pinned boolean default false;
alter table public.site_update_notes add column if not exists planned boolean default false;
alter table public.site_update_notes add column if not exists created_at timestamptz default now();
alter table public.site_update_notes add column if not exists updated_at timestamptz default now();

create table if not exists public.site_schema_versions (
  id bigserial primary key,
  version text,
  note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.site_schema_versions add column if not exists version text;
alter table public.site_schema_versions add column if not exists note text;
alter table public.site_schema_versions add column if not exists created_at timestamptz default now();
alter table public.site_schema_versions add column if not exists updated_at timestamptz default now();

-- Takılmayı önlemek için eski kayıtları DELETE etmiyoruz. Aynı sürüm tekrar eklenirse çoğalmasın diye yalnızca zaten yoksa ekliyoruz.
insert into public.site_update_notes (version, title, summary, note, description, status, pinned, planned, created_at, updated_at)
select
  'v2.5.3 FIX5',
  'Hızlı Schema ve Manuel Takvim Düzeltmesi',
  'schema.sql dosyasının Supabase SQL Editor içinde Running durumunda kalmaması için ağır işlemler kaldırıldı. Manuel yayın takvimi ve puan önizleme ayarları korunur.',
  'DELETE/UPDATE taramaları kaldırıldı; timeout eklendi; mevcut veriler korunur.',
  'Bu schema sadece gerekli tabloları/kolonları ve runtime ayarlarını güvenli şekilde hazırlar.',
  'published',
  true,
  false,
  now(),
  now()
where not exists (
  select 1 from public.site_update_notes where version = 'v2.5.3 FIX5' and title = 'Hızlı Schema ve Manuel Takvim Düzeltmesi'
);

insert into public.site_runtime_config (key, value, updated_at)
values (
  'calendar_settings',
  jsonb_build_object(
    'version','v2.5.3 FIX5',
    'auto_generate',false,
    'manual_only',true,
    'live_preview',true,
    'updated_at',now()
  ),
  now()
)
on conflict (key) do update set
  value = coalesce(public.site_runtime_config.value, '{}'::jsonb) || excluded.value,
  updated_at = now();

insert into public.site_runtime_config (key, value, updated_at)
values (
  'update_notes_center',
  jsonb_build_object(
    'enabled',true,
    'version','v2.5.3 FIX5',
    'show_on_homepage',false,
    'admin_page_only',true,
    'stable_page',true,
    'planned_until','v3.0.0',
    'updated_at',now()
  ),
  now()
)
on conflict (key) do update set
  value = coalesce(public.site_runtime_config.value, '{}'::jsonb) || excluded.value,
  updated_at = now();

-- Bakım modu mevcutsa açık/kapalı, mesaj, yüzde ve tarih alanları korunur. Sadece updateNotes boşsa doldurulur.
insert into public.site_runtime_config (key, value, updated_at)
select
  'maintenance_mode',
  jsonb_build_object(
    'enabled',false,
    'message','Hayatımız Oyun kısa süreli bakımda. Yeni güncellemeler hazırlanıyor.',
    'eta','',
    'percent',0,
    'progress',0,
    'notesText','v2.5.3 FIX5 • Hızlı Schema ve Manuel Takvim Düzeltmesi: schema.sql artık uzun süre Running durumunda kalmayacak şekilde sadeleştirildi.',
    'updateNotes',jsonb_build_array(jsonb_build_object('version','v2.5.3 FIX5','title','Hızlı Schema ve Manuel Takvim Düzeltmesi','summary','schema.sql hızlı ve güvenli hale getirildi.')),
    'version','v2.5.3 FIX5'
  ),
  now()
where not exists (select 1 from public.site_runtime_config where key = 'maintenance_mode');

insert into public.site_runtime_config (key, value, updated_at)
values (
  'schema_version',
  jsonb_build_object(
    'version','v2.5.3 FIX5',
    'status','Hayatımız Oyun v2.5.3 FIX5 schema hazır. Hızlı schema ve manuel takvim düzeltmesi eklendi.',
    'updated_at',now()
  ),
  now()
)
on conflict (key) do update set
  value = excluded.value,
  updated_at = now();

insert into public.site_schema_versions (version, note, created_at, updated_at)
select
  'v2.5.3 FIX5',
  'Hızlı schema ve manuel takvim düzeltmesi eklendi. DELETE/UPDATE taramaları kaldırıldı.',
  now(),
  now()
where not exists (select 1 from public.site_schema_versions where version = 'v2.5.3 FIX5');

select 'Hayatımız Oyun v2.5.3 FIX5 schema hazır. Hızlı schema ve manuel takvim düzeltmesi eklendi.' as status;
