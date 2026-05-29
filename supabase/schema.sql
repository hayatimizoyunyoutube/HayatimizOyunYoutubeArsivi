-- Hayatımız Oyun v2.5.4 FIX9 - Ultra Fast SQL
-- Bu dosya connection timeout riskini azaltmak için kısa tutuldu.
-- Mevcut oyun, kullanıcı, bakım ve takvim kayıtlarını SİLMEZ.
set statement_timeout = '8s';
set lock_timeout = '2s';

create table if not exists public.site_runtime_config (
  key text primary key,
  value jsonb,
  updated_at timestamptz default now()
);

create table if not exists public.site_schema_versions (
  id bigserial primary key,
  version text,
  note text,
  created_at timestamptz default now(),
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
  id text primary key default ('cal_' || replace(md5(random()::text || clock_timestamp()::text), '-', '')),
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

-- Eksik kolon ihtimali için sadece kritik kolonları ekle.
alter table if exists public.site_runtime_config add column if not exists updated_at timestamptz default now();

alter table if exists public.site_update_notes add column if not exists version text;
alter table if exists public.site_update_notes add column if not exists title text;
alter table if exists public.site_update_notes add column if not exists summary text;
alter table if exists public.site_update_notes add column if not exists note text;
alter table if exists public.site_update_notes add column if not exists description text;
alter table if exists public.site_update_notes add column if not exists status text default 'published';
alter table if exists public.site_update_notes add column if not exists pinned boolean default false;
alter table if exists public.site_update_notes add column if not exists planned boolean default false;
alter table if exists public.site_update_notes add column if not exists created_at timestamptz default now();
alter table if exists public.site_update_notes add column if not exists updated_at timestamptz default now();

alter table if exists public.site_calendar_events add column if not exists title text;
alter table if exists public.site_calendar_events add column if not exists event_date date;
alter table if exists public.site_calendar_events add column if not exists event_time text;
alter table if exists public.site_calendar_events add column if not exists event_type text default 'Yayın';
alter table if exists public.site_calendar_events add column if not exists game_id text;
alter table if exists public.site_calendar_events add column if not exists game_title text;
alter table if exists public.site_calendar_events add column if not exists cover_url text;
alter table if exists public.site_calendar_events add column if not exists video_url text;
alter table if exists public.site_calendar_events add column if not exists note text;
alter table if exists public.site_calendar_events add column if not exists source text default 'manual';
alter table if exists public.site_calendar_events add column if not exists is_active boolean default true;
alter table if exists public.site_calendar_events add column if not exists created_at timestamptz default now();
alter table if exists public.site_calendar_events add column if not exists updated_at timestamptz default now();

insert into public.site_update_notes
(version, title, summary, note, description, status, pinned, planned, created_at, updated_at)
select
  'v2.5.4 FIX9',
  'Bakım Menü, Doğru Sürüm ve SQL Timeout Fix',
  'Bakım Modu tıklama sorunu düzeltildi, tarayıcıdaki görünür sürüm v2.5.4 FIX9 olarak sabitlendi, Supabase için ultra hızlı schema hazırlandı.',
  'Açılış öncesi yönetim paneli tıklama ve sürüm karışıklığı temizlendi.',
  'Yayın takvimi, güncelleme notları, bakım modu ve oyun ekleme tek stabil katmanda korunur.',
  'published',
  true,
  false,
  now(),
  now()
where not exists (
  select 1 from public.site_update_notes where version = 'v2.5.4 FIX9'
);

insert into public.site_runtime_config (key, value, updated_at)
values
(
  'schema_version',
  jsonb_build_object(
    'version','v2.5.4 FIX9',
    'status','Hayatımız Oyun v2.5.4 FIX9 schema hazır. Ultra fast SQL çalıştı.',
    'updated_at',now()
  ),
  now()
),
(
  'site_public_version',
  jsonb_build_object(
    'version','v2.5.4 FIX9',
    'updated_at',now()
  ),
  now()
),
(
  'update_notes_center',
  jsonb_build_object(
    'enabled',true,
    'version','v2.5.4 FIX9',
    'admin_page_only',true,
    'show_on_homepage',false,
    'updated_at',now()
  ),
  now()
),
(
  'calendar_events_standard',
  jsonb_build_object(
    'enabled',true,
    'version','v2.5.4 FIX9',
    'mode','manual',
    'auto_create',false,
    'updated_at',now()
  ),
  now()
)
on conflict (key) do update set
  value = excluded.value,
  updated_at = now();

insert into public.site_schema_versions (version, note, created_at, updated_at)
select 'v2.5.4 FIX9', 'Bakım Menü, Doğru Sürüm ve SQL Timeout Fix - Ultra Fast SQL.', now(), now()
where not exists (
  select 1 from public.site_schema_versions where version = 'v2.5.4 FIX9'
);

select 'Hayatımız Oyun v2.5.4 FIX9 schema hazır. Ultra fast SQL çalıştı.' as status;
