-- v2.0.3 STABIL CALISAN SITE - mevcut kayıtları silmez
-- Hayatımız Oyun v2.0.3 - Dolu eski taban schema
-- Güvenli migration: mevcut oyun, kullanıcı, bakım, takvim ve not kayıtlarını SİLMEZ.
set statement_timeout = '25s';
set lock_timeout = '3s';

create extension if not exists pgcrypto;

create table if not exists public.site_users (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  avatar_url text,
  email text unique not null,
  password_hash text,
  password_salt text,
  role text default 'user',
  is_active boolean default true,
  banned_at timestamptz,
  ban_reason text,
  last_login_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_users add column if not exists full_name text;
alter table if exists public.site_users add column if not exists avatar_url text;
alter table if exists public.site_users add column if not exists email text;
alter table if exists public.site_users add column if not exists password_hash text;
alter table if exists public.site_users add column if not exists password_salt text;
alter table if exists public.site_users add column if not exists role text default 'user';
alter table if exists public.site_users add column if not exists is_active boolean default true;
alter table if exists public.site_users add column if not exists banned_at timestamptz;
alter table if exists public.site_users add column if not exists ban_reason text;
alter table if exists public.site_users add column if not exists last_login_at timestamptz;
alter table if exists public.site_users add column if not exists created_at timestamptz default now();
alter table if exists public.site_users add column if not exists updated_at timestamptz default now();
create unique index if not exists site_users_email_unique_idx on public.site_users (email);
create index if not exists site_users_email_lower_idx on public.site_users (lower(email));

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  genre text default 'Genel',
  status text default 'Devam Ediyor',
  episode_count integer default 0,
  score numeric default 0,
  cover_url text,
  tags text,
  release_date text,
  rawg_slug text,
  series_name text,
  playlist_url text,
  video_url text,
  watched_episode_count integer default 0,
  series_order integer default 0,
  episodes jsonb default '[]'::jsonb,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.games add column if not exists title text;
alter table if exists public.games add column if not exists genre text default 'Genel';
alter table if exists public.games add column if not exists status text default 'Devam Ediyor';
alter table if exists public.games add column if not exists episode_count integer default 0;
alter table if exists public.games add column if not exists score numeric default 0;
alter table if exists public.games add column if not exists cover_url text;
alter table if exists public.games add column if not exists tags text;
alter table if exists public.games add column if not exists release_date text;
alter table if exists public.games add column if not exists rawg_slug text;
alter table if exists public.games add column if not exists series_name text;
alter table if exists public.games add column if not exists playlist_url text;
alter table if exists public.games add column if not exists video_url text;
alter table if exists public.games add column if not exists watched_episode_count integer default 0;
alter table if exists public.games add column if not exists series_order integer default 0;
alter table if exists public.games add column if not exists episodes jsonb default '[]'::jsonb;
alter table if exists public.games add column if not exists description text;
alter table if exists public.games add column if not exists created_at timestamptz default now();
alter table if exists public.games add column if not exists updated_at timestamptz default now();
create index if not exists games_title_idx on public.games (title);
create index if not exists games_status_idx on public.games (status);
create index if not exists games_series_idx on public.games (series_name, series_order);

create table if not exists public.site_runtime_config (
  key text primary key,
  value jsonb,
  updated_at timestamptz default now()
);

create table if not exists public.site_update_notes (
  id uuid primary key default gen_random_uuid(),
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
create index if not exists site_update_notes_version_idx on public.site_update_notes (version);
create index if not exists site_update_notes_status_idx on public.site_update_notes (status);

create table if not exists public.site_calendar_events (
  id uuid primary key default gen_random_uuid(),
  title text,
  event_date date,
  event_time text,
  event_type text default 'Yayın',
  game_id text,
  game_title text,
  episode_number text,
  episode_title text,
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
alter table if exists public.site_calendar_events add column if not exists episode_number text;
alter table if exists public.site_calendar_events add column if not exists episode_title text;
alter table if exists public.site_calendar_events add column if not exists cover_url text;
alter table if exists public.site_calendar_events add column if not exists video_url text;
alter table if exists public.site_calendar_events add column if not exists note text;
alter table if exists public.site_calendar_events add column if not exists source text default 'manual';
alter table if exists public.site_calendar_events add column if not exists is_active boolean default true;
alter table if exists public.site_calendar_events add column if not exists created_at timestamptz default now();
alter table if exists public.site_calendar_events add column if not exists updated_at timestamptz default now();
create index if not exists site_calendar_events_date_idx on public.site_calendar_events (event_date asc);
create index if not exists site_calendar_events_active_idx on public.site_calendar_events (is_active);

create table if not exists public.site_features (
  key text primary key,
  enabled boolean default false,
  title text,
  group_name text,
  target text,
  description text,
  next_text text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_features add column if not exists enabled boolean default false;
alter table if exists public.site_features add column if not exists title text;
alter table if exists public.site_features add column if not exists group_name text;
alter table if exists public.site_features add column if not exists target text;
alter table if exists public.site_features add column if not exists description text;
alter table if exists public.site_features add column if not exists next_text text;
alter table if exists public.site_features add column if not exists created_at timestamptz default now();
alter table if exists public.site_features add column if not exists updated_at timestamptz default now();

create table if not exists public.site_admin_planner (
  id uuid primary key default gen_random_uuid(),
  group_name text,
  title text,
  status text default 'plan',
  feature_key text,
  target text,
  description text,
  next_text text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_admin_planner add column if not exists group_name text;
alter table if exists public.site_admin_planner add column if not exists title text;
alter table if exists public.site_admin_planner add column if not exists status text default 'plan';
alter table if exists public.site_admin_planner add column if not exists feature_key text;
alter table if exists public.site_admin_planner add column if not exists target text;
alter table if exists public.site_admin_planner add column if not exists description text;
alter table if exists public.site_admin_planner add column if not exists next_text text;
alter table if exists public.site_admin_planner add column if not exists created_at timestamptz default now();
alter table if exists public.site_admin_planner add column if not exists updated_at timestamptz default now();

create table if not exists public.site_admin_notes (
  id uuid primary key default gen_random_uuid(),
  note text,
  actor_email text,
  created_at timestamptz default now()
);
alter table if exists public.site_admin_notes add column if not exists note text;
alter table if exists public.site_admin_notes add column if not exists actor_email text;
alter table if exists public.site_admin_notes add column if not exists created_at timestamptz default now();

create table if not exists public.site_recovery_snapshots (
  id uuid primary key default gen_random_uuid(),
  source text,
  note text,
  snapshot jsonb,
  created_at timestamptz default now()
);
alter table if exists public.site_recovery_snapshots add column if not exists source text;
alter table if exists public.site_recovery_snapshots add column if not exists note text;
alter table if exists public.site_recovery_snapshots add column if not exists snapshot jsonb;
alter table if exists public.site_recovery_snapshots add column if not exists created_at timestamptz default now();

create table if not exists public.site_game_requests (
  id uuid primary key default gen_random_uuid(),
  game_title text,
  series_name text,
  requester_email text,
  note text,
  status text default 'Yeni',
  admin_note text,
  converted_game_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_game_requests add column if not exists game_title text;
alter table if exists public.site_game_requests add column if not exists series_name text;
alter table if exists public.site_game_requests add column if not exists requester_email text;
alter table if exists public.site_game_requests add column if not exists note text;
alter table if exists public.site_game_requests add column if not exists status text default 'Yeni';
alter table if exists public.site_game_requests add column if not exists admin_note text;
alter table if exists public.site_game_requests add column if not exists converted_game_id text;
alter table if exists public.site_game_requests add column if not exists created_at timestamptz default now();
alter table if exists public.site_game_requests add column if not exists updated_at timestamptz default now();

create table if not exists public.site_bug_reports (
  id uuid primary key default gen_random_uuid(),
  title text,
  page_name text,
  reporter_email text,
  description text,
  screenshot_url text,
  status text default 'Yeni',
  admin_note text,
  solution_note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_bug_reports add column if not exists title text;
alter table if exists public.site_bug_reports add column if not exists page_name text;
alter table if exists public.site_bug_reports add column if not exists reporter_email text;
alter table if exists public.site_bug_reports add column if not exists description text;
alter table if exists public.site_bug_reports add column if not exists screenshot_url text;
alter table if exists public.site_bug_reports add column if not exists status text default 'Yeni';
alter table if exists public.site_bug_reports add column if not exists admin_note text;
alter table if exists public.site_bug_reports add column if not exists solution_note text;
alter table if exists public.site_bug_reports add column if not exists created_at timestamptz default now();
alter table if exists public.site_bug_reports add column if not exists updated_at timestamptz default now();

create table if not exists public.site_notifications (
  id uuid primary key default gen_random_uuid(),
  title text,
  message text,
  type text,
  is_read boolean default false,
  created_at timestamptz default now()
);
alter table if exists public.site_notifications add column if not exists title text;
alter table if exists public.site_notifications add column if not exists message text;
alter table if exists public.site_notifications add column if not exists type text;
alter table if exists public.site_notifications add column if not exists is_read boolean default false;
alter table if exists public.site_notifications add column if not exists created_at timestamptz default now();

create table if not exists public.site_bulk_operations (
  id uuid primary key default gen_random_uuid(),
  title text,
  details jsonb,
  actor_email text,
  created_at timestamptz default now()
);
alter table if exists public.site_bulk_operations add column if not exists title text;
alter table if exists public.site_bulk_operations add column if not exists details jsonb;
alter table if exists public.site_bulk_operations add column if not exists actor_email text;
alter table if exists public.site_bulk_operations add column if not exists created_at timestamptz default now();

create table if not exists public.site_episode_comments (
  id uuid primary key default gen_random_uuid(),
  game_id text,
  episode_index integer default 0,
  comment text,
  actor_email text,
  created_at timestamptz default now()
);
alter table if exists public.site_episode_comments add column if not exists game_id text;
alter table if exists public.site_episode_comments add column if not exists episode_index integer default 0;
alter table if exists public.site_episode_comments add column if not exists comment text;
alter table if exists public.site_episode_comments add column if not exists actor_email text;
alter table if exists public.site_episode_comments add column if not exists created_at timestamptz default now();

create table if not exists public.site_user_preferences (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  archive_view_mode text,
  preferences jsonb,
  updated_at timestamptz default now()
);
alter table if exists public.site_user_preferences add column if not exists email text;
alter table if exists public.site_user_preferences add column if not exists archive_view_mode text;
alter table if exists public.site_user_preferences add column if not exists preferences jsonb;
alter table if exists public.site_user_preferences add column if not exists updated_at timestamptz default now();
create unique index if not exists site_user_preferences_email_unique_idx on public.site_user_preferences (email);
create index if not exists site_user_preferences_email_lower_idx on public.site_user_preferences (lower(email));

create table if not exists public.site_calendar_reminders (
  id uuid primary key default gen_random_uuid(),
  email text,
  event_id text,
  title text,
  remind_at text,
  is_sent boolean default false,
  created_at timestamptz default now()
);
alter table if exists public.site_calendar_reminders add column if not exists email text;
alter table if exists public.site_calendar_reminders add column if not exists event_id text;
alter table if exists public.site_calendar_reminders add column if not exists title text;
alter table if exists public.site_calendar_reminders add column if not exists remind_at text;
alter table if exists public.site_calendar_reminders add column if not exists is_sent boolean default false;
alter table if exists public.site_calendar_reminders add column if not exists created_at timestamptz default now();

create table if not exists public.site_series_order_history (
  id uuid primary key default gen_random_uuid(),
  series_name text,
  game_ids jsonb,
  user_email text,
  restored_at timestamptz,
  created_at timestamptz default now()
);
alter table if exists public.site_series_order_history add column if not exists series_name text;
alter table if exists public.site_series_order_history add column if not exists game_ids jsonb;
alter table if exists public.site_series_order_history add column if not exists user_email text;
alter table if exists public.site_series_order_history add column if not exists restored_at timestamptz;
alter table if exists public.site_series_order_history add column if not exists created_at timestamptz default now();

create table if not exists public.site_notification_queue (
  id uuid primary key default gen_random_uuid(),
  email text,
  title text,
  message text,
  channel text default 'browser',
  status text default 'pending',
  created_at timestamptz default now()
);
alter table if exists public.site_notification_queue add column if not exists email text;
alter table if exists public.site_notification_queue add column if not exists title text;
alter table if exists public.site_notification_queue add column if not exists message text;
alter table if exists public.site_notification_queue add column if not exists channel text default 'browser';
alter table if exists public.site_notification_queue add column if not exists status text default 'pending';
alter table if exists public.site_notification_queue add column if not exists created_at timestamptz default now();

create table if not exists public.site_auto_fix_requests (
  id uuid primary key default gen_random_uuid(),
  version text,
  source text,
  error_text text,
  diagnosis jsonb,
  status text default 'new',
  fixed_files text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_auto_fix_requests add column if not exists version text;
alter table if exists public.site_auto_fix_requests add column if not exists source text;
alter table if exists public.site_auto_fix_requests add column if not exists error_text text;
alter table if exists public.site_auto_fix_requests add column if not exists diagnosis jsonb;
alter table if exists public.site_auto_fix_requests add column if not exists status text default 'new';
alter table if exists public.site_auto_fix_requests add column if not exists fixed_files text;
alter table if exists public.site_auto_fix_requests add column if not exists created_at timestamptz default now();
alter table if exists public.site_auto_fix_requests add column if not exists updated_at timestamptz default now();

create table if not exists public.site_schema_versions (
  id uuid primary key default gen_random_uuid(),
  version text,
  note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_schema_versions add column if not exists version text;
alter table if exists public.site_schema_versions add column if not exists note text;
alter table if exists public.site_schema_versions add column if not exists created_at timestamptz default now();
alter table if exists public.site_schema_versions add column if not exists updated_at timestamptz default now();

-- Varsayılan bakım kaydı sadece hiç yoksa eklenir. Mevcut bakım modu ASLA sıfırlanmaz.
insert into public.site_runtime_config (key, value, updated_at)
select 'maintenance_mode', jsonb_build_object('enabled', false, 'message', 'Hayatımız Oyun kısa süreli bakımda.', 'eta', '', 'progress', 0), now()
where not exists (select 1 from public.site_runtime_config where key = 'maintenance_mode');

insert into public.site_runtime_config (key, value, updated_at)
values
(
  'schema_version',
  jsonb_build_object('version','v2.0.3', 'status','Tam stabil site fix schema hazır.', 'updated_at', now()),
  now()
),
(
  'update_notes_center',
  jsonb_build_object('enabled', true, 'version','v2.0.3', 'editable', true, 'stable_layer', true, 'updated_at', now()),
  now()
),
(
  'calendar_events_standard',
  jsonb_build_object('enabled', true, 'version','v2.0.3', 'mode','manual', 'auto_create', false, 'updated_at', now()),
  now()
)
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into public.site_update_notes (version, title, summary, note, description, status, pinned, planned, created_at, updated_at)
select
  'v2.0.3',
  'Tam Stabil Site Fix',
  'Eksik Supabase tabloları, admin boş sayfaları, oyun ekleme, yayın takvimi, güncelleme notları, bakım modu ve Vercel dist senkronizasyonu düzeltildi.',
  'v2.0.3 ana sayfa boş ekran kesin çözüm geri dönüşü yapıldı; site boş/siyah ekrana düşmeyecek şekilde güvenli katman korundu.',
  'Oyun Ekle, Mevcut Oyunlar, Yayın Takvimi, Güncelleme Notları ve Bakım Modu local fallback + Supabase API ile çalışır.',
  'published',
  true,
  false,
  now(),
  now()
where not exists (select 1 from public.site_update_notes where version = 'v2.0.3');

insert into public.site_schema_versions (version, note, created_at, updated_at)
select 'v2.0.3', 'Dolu eski taban schema: eksik tablolar, takvim video URL, not alias, bakım koruması.', now(), now()
where not exists (select 1 from public.site_schema_versions where version = 'v2.0.3');

select 'Hayatımız Oyun v2.0.3 ana sayfa boş ekran kesin çözüm schema hazır. Mevcut bakım/oyun/kullanıcı kayıtları korunur.' as status;
