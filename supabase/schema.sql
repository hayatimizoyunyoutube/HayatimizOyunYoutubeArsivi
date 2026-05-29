-- Hayatımız Oyun v2.5.4 FIX11 - Admin Panel Son Kurtarma
-- Güvenli migration: mevcut oyun/kullanıcı/bakım/takvim verilerini SİLMEZ.
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
  'v2.5.4 FIX11',
  'Admin Panel Son Kurtarma',
  'Seri Geçmişi ve Bildirim Kuyruğu kaldırıldı; Oyun Ekle, Yayın Takvimi, Güncelleme Notları ve Bakım Modu stabil hale getirildi.',
  'Bakım modu mevcut değerleri korunur; yüzde yazarken sıfırlanmaz.',
  'Açılış öncesi yönetim paneli son kurtarma paketi.',
  'published', true, false, now(), now()
where not exists (select 1 from public.site_update_notes where version = 'v2.5.4 FIX11');

insert into public.site_runtime_config (key, value, updated_at)
values
('schema_version', jsonb_build_object('version','v2.5.4 FIX11','status','Hayatımız Oyun v2.5.4 FIX11 schema hazır. Admin panel son kurtarma uygulandı.','updated_at',now()), now()),
('admin_recovery_fix', jsonb_build_object('version','v2.5.4 FIX11','remove_pages',jsonb_build_array('Seri Geçmişi','Bildirim Kuyruğu'),'safe_maintenance',true,'updated_at',now()), now())
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into public.site_schema_versions (version, note, created_at, updated_at)
select 'v2.5.4 FIX11', 'Admin panel son kurtarma; boş sayfalar ve bakım modu sıfırlanması düzeltildi.', now(), now()
where not exists (select 1 from public.site_schema_versions where version = 'v2.5.4 FIX11');

select 'Hayatımız Oyun v2.5.4 FIX11 schema hazır. Admin panel son kurtarma uygulandı.' as status;
