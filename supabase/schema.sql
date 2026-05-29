-- Hayatımız Oyun v2.5.4 FIX4 - Admin Takvim / Bakım / Güncelleme Notları Final
-- Güvenli migration: mevcut oyun, kullanıcı, bakım ve takvim kayıtlarını SİLMEZ.
set statement_timeout = '25s';
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

alter table if exists public.site_update_notes add column if not exists version text;
alter table if exists public.site_update_notes add column if not exists title text;
alter table if exists public.site_update_notes add column if not exists summary text;
alter table if exists public.site_update_notes add column if not exists note text;
alter table if exists public.site_update_notes add column if not exists description text;
alter table if exists public.site_update_notes add column if not exists image_url text;
alter table if exists public.site_update_notes add column if not exists status text default 'published';
alter table if exists public.site_update_notes add column if not exists pinned boolean default false;
alter table if exists public.site_update_notes add column if not exists planned boolean default false;
alter table if exists public.site_update_notes add column if not exists created_at timestamptz default now();
alter table if exists public.site_update_notes add column if not exists updated_at timestamptz default now();

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

create index if not exists site_calendar_events_date_idx on public.site_calendar_events (event_date asc);

create table if not exists public.site_schema_versions (
  id bigserial primary key,
  version text,
  note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table if exists public.site_schema_versions add column if not exists version text;
alter table if exists public.site_schema_versions add column if not exists note text;
alter table if exists public.site_schema_versions add column if not exists created_at timestamptz default now();
alter table if exists public.site_schema_versions add column if not exists updated_at timestamptz default now();

insert into public.site_update_notes (version, title, summary, note, description, status, pinned, planned, created_at, updated_at)
select
  'v2.5.4 FIX4',
  'Admin Takvim / Bakım / Güncelleme Notları Final Fix',
  'Yayın Takvimi’ne karışan Kapak Galerisi kartları engellendi, Bakım Modu notları düzeltildi, Güncelleme Notları ekle/düzenle/sil paneli eklendi.',
  'Açılış öncesi admin paneli sade ve stabil hale getirildi.',
  'Takvim manuel kayıt sistemiyle çalışır; bakım modu gerçek güncelleme notlarını çeker.',
  'published',
  true,
  false,
  now(),
  now()
where not exists (select 1 from public.site_update_notes where version = 'v2.5.4 FIX4');

insert into public.site_runtime_config (key, value, updated_at)
values
(
  'update_notes_center',
  jsonb_build_object('enabled', true, 'version','v2.5.4 FIX4', 'show_on_homepage', false, 'admin_page_only', true, 'editable', true, 'updated_at', now()),
  now()
),
(
  'calendar_events_standard',
  jsonb_build_object('enabled', true, 'version','v2.5.4 FIX4', 'mode','manual', 'auto_create', false, 'suggestion_only', true, 'cover_tools_blocked', true, 'updated_at', now()),
  now()
),
(
  'schema_version',
  jsonb_build_object('version','v2.5.4 FIX4', 'status','Hayatımız Oyun v2.5.4 FIX4 schema hazır. Admin takvim, bakım ve güncelleme notları final fix uygulandı.', 'updated_at', now()),
  now()
)
on conflict (key) do update set
  value = excluded.value,
  updated_at = now();

-- Bakım modu varsa açık/kapalı, mesaj, yüzde ve tarih korunur; sadece bozuk [object Object] not varsa temizlenir.
update public.site_runtime_config
set value = jsonb_set(
  coalesce(value, '{}'::jsonb),
  '{notesText}',
  to_jsonb('v2.5.4 FIX4 • Admin Takvim / Bakım / Güncelleme Notları Final Fix: Yayın Takvimi, Bakım Modu ve Güncelleme Notları düzeltildi.'::text),
  true
),
updated_at = now()
where key = 'maintenance_mode'
  and (
    value->>'notesText' is null
    or value->>'notesText' = ''
    or value->>'notesText' like '%[object Object]%'
  );

insert into public.site_schema_versions (version, note, created_at, updated_at)
select 'v2.5.4 FIX4', 'Admin takvim, bakım ve güncelleme notları final fix.', now(), now()
where not exists (select 1 from public.site_schema_versions where version = 'v2.5.4 FIX4');

select 'Hayatımız Oyun v2.5.4 FIX4 schema hazır. Admin takvim, bakım ve güncelleme notları final fix uygulandı.' as status;
