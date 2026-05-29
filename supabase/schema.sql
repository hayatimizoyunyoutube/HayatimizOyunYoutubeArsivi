-- Hayatımız Oyun v2.5.4 FIX10 - Temiz Kurtarma Stabil
-- Güvenli / hızlı migration: mevcut oyun, kullanıcı, bakım ve takvim kayıtlarını SİLMEZ.
set statement_timeout = '20s';
set lock_timeout = '3s';

create extension if not exists pgcrypto;

create table if not exists public.site_runtime_config (
  key text primary key,
  value jsonb,
  updated_at timestamptz default now()
);

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

create table if not exists public.site_calendar_events (
  id uuid primary key default gen_random_uuid(),
  title text,
  event_date date,
  event_time text,
  event_type text default 'Yayın',
  game_id text,
  game_title text,
  cover_url text,
  video_url text,
  note text,
  source text default 'manual',
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.site_schema_versions (
  id bigserial primary key,
  version text,
  note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

insert into public.site_update_notes (version, title, summary, note, description, status, pinned, planned, created_at, updated_at)
select
  'v2.5.4 FIX10',
  'Temiz Kurtarma Stabil',
  'Bozan patch zinciri kaldırıldı; yönetim paneli butonları, bakım modu, oyun ekleme, takvim ve güncelleme notları stabil tabana alındı.',
  'v2.5.3 FIX6 sağlam taban alındı; üstüne güvenli FIX10 düzeltmeleri eklendi.',
  'Açılış öncesi güvenli kurtarma paketi.',
  'published', true, false, now(), now()
where not exists (select 1 from public.site_update_notes where version = 'v2.5.4 FIX10');

insert into public.site_runtime_config (key, value, updated_at)
values
('schema_version', jsonb_build_object('version','v2.5.4 FIX10','status','Hayatımız Oyun v2.5.4 FIX10 schema hazır. Temiz kurtarma stabil uygulandı.','updated_at',now()), now()),
('update_notes_center', jsonb_build_object('enabled',true,'version','v2.5.4 FIX10','admin_page_only',true,'clean_rescue',true,'updated_at',now()), now()),
('calendar_events_standard', jsonb_build_object('enabled',true,'version','v2.5.4 FIX10','mode','manual','auto_create',false,'clean_rescue',true,'updated_at',now()), now())
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into public.site_schema_versions (version, note, created_at, updated_at)
select 'v2.5.4 FIX10', 'Temiz kurtarma stabil paketi.', now(), now()
where not exists (select 1 from public.site_schema_versions where version = 'v2.5.4 FIX10');

select 'Hayatımız Oyun v2.5.4 FIX10 schema hazır. Temiz kurtarma stabil uygulandı.' as status;
