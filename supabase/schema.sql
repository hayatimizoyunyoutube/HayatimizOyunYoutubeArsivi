-- Hayatımız Oyun v2.0.4 FIX - Sıfırdan Boş Supabase Şeması
-- Bu dosya tabloları yeniden kurar ama demo oyun eklemez.
-- Amaç: status/tür/etiket/seri/auth/bakım tablolarını temiz ve tutarlı başlatmak.
-- DİKKAT: Run yapılırsa mevcut tablo verileri silinir.

create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

drop table if exists public.site_activity_logs cascade;
drop table if exists public.site_health_checks cascade;
drop table if exists public.site_status_logs cascade;
drop table if exists public.site_game_requests cascade;
drop table if exists public.site_recovery_snapshots cascade;
drop table if exists public.site_admin_notes cascade;
drop table if exists public.site_admin_planner cascade;
drop table if exists public.site_features cascade;
drop table if exists public.site_calendar_events cascade;
drop table if exists public.site_update_notes cascade;
drop table if exists public.site_runtime_config cascade;
drop table if exists public.game_episodes cascade;
drop table if exists public.games cascade;
drop table if exists public.game_tags cascade;
drop table if exists public.game_statuses cascade;
drop table if exists public.game_genres cascade;
drop table if exists public.game_series cascade;
drop table if exists public.site_admin_profiles cascade;
drop table if exists public.site_users cascade;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table public.site_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  display_name text,
  role text not null default 'user',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_site_users_updated_at before update on public.site_users for each row execute function public.set_updated_at();

create table public.site_admin_profiles (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  display_name text,
  role text not null default 'owner',
  can_manage_games boolean not null default true,
  can_manage_updates boolean not null default true,
  can_manage_calendar boolean not null default true,
  can_manage_settings boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_site_admin_profiles_updated_at before update on public.site_admin_profiles for each row execute function public.set_updated_at();

create table public.game_statuses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  color text not null default 'slate',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_game_statuses_updated_at before update on public.game_statuses for each row execute function public.set_updated_at();

create table public.game_genres (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  icon text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_game_genres_updated_at before update on public.game_genres for each row execute function public.set_updated_at();

create table public.game_series (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  cover_url text,
  status_slug text default 'devam-eden',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_game_series_updated_at before update on public.game_series for each row execute function public.set_updated_at();

create table public.game_tags (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  group_name text default 'genel',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_game_tags_updated_at before update on public.game_tags for each row execute function public.set_updated_at();

create table public.games (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  story_text text,
  status_slug text not null default 'devam-eden',
  genre_slug text default 'genel',
  series_slug text,
  series_order integer not null default 0,
  tags text[] not null default '{}',
  cover_url text,
  banner_url text,
  release_date text,
  platforms text[] not null default '{}',
  rawg_id integer,
  rawg_slug text,
  steam_app_id text,
  youtube_playlist_url text,
  youtube_playlist_id text,
  video_url text,
  episode_count integer not null default 0,
  watched_episode_count integer not null default 0,
  score numeric(4,1) not null default 0,
  is_featured boolean not null default false,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_games_updated_at before update on public.games for each row execute function public.set_updated_at();
create index games_status_slug_idx on public.games(status_slug);
create index games_genre_slug_idx on public.games(genre_slug);
create index games_series_slug_idx on public.games(series_slug, series_order);
create index games_title_trgm_idx on public.games using gin (title gin_trgm_ops);

create table public.game_episodes (
  id uuid primary key default gen_random_uuid(),
  game_id uuid references public.games(id) on delete cascade,
  episode_number integer,
  title text,
  description text,
  youtube_video_id text,
  video_url text,
  thumbnail_url text,
  published_at timestamptz,
  duration_text text,
  is_watched boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_game_episodes_updated_at before update on public.game_episodes for each row execute function public.set_updated_at();
create index game_episodes_game_idx on public.game_episodes(game_id, sort_order);

create table public.site_runtime_config (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_site_runtime_config_updated_at before update on public.site_runtime_config for each row execute function public.set_updated_at();

create table public.site_update_notes (
  id uuid primary key default gen_random_uuid(),
  version text not null,
  title text not null,
  summary text,
  note text,
  image_url text,
  status text not null default 'published',
  pinned boolean not null default false,
  planned boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_site_update_notes_updated_at before update on public.site_update_notes for each row execute function public.set_updated_at();
create index site_update_notes_version_idx on public.site_update_notes(version);
create index site_update_notes_status_idx on public.site_update_notes(status, planned);

create table public.site_calendar_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date date,
  event_time text,
  event_type text not null default 'Yayın',
  game_id uuid references public.games(id) on delete set null,
  game_title text,
  episode_number text,
  episode_title text,
  cover_url text,
  video_url text,
  note text,
  source text not null default 'manual',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_site_calendar_events_updated_at before update on public.site_calendar_events for each row execute function public.set_updated_at();
create index site_calendar_events_date_idx on public.site_calendar_events(event_date asc, event_time asc);
create index site_calendar_events_active_idx on public.site_calendar_events(is_active);

create table public.site_features (
  key text primary key,
  enabled boolean not null default false,
  title text,
  group_name text,
  target text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_site_features_updated_at before update on public.site_features for each row execute function public.set_updated_at();

create table public.site_status_logs (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'ok',
  scope text not null default 'site',
  message text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index site_status_logs_scope_idx on public.site_status_logs(scope, created_at desc);

create table public.site_health_checks (
  id uuid primary key default gen_random_uuid(),
  check_key text not null,
  status text not null default 'ok',
  message text,
  checked_at timestamptz not null default now(),
  details jsonb not null default '{}'::jsonb
);
create index site_health_checks_key_idx on public.site_health_checks(check_key, checked_at desc);

create table public.site_activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_email text,
  action text not null,
  target_type text,
  target_id text,
  message text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index site_activity_logs_created_idx on public.site_activity_logs(created_at desc);

insert into public.site_admin_profiles(email, display_name, role)
values ('mertdundaroyunda@gmail.com', 'Hayatımız Oyun Owner', 'owner')
on conflict (email) do update set role = excluded.role, display_name = excluded.display_name, updated_at = now();

insert into public.game_statuses(slug,label,color,sort_order) values
('devam-eden','Devam Eden','green',10),
('tamamlanan','Tamamlanan','blue',20),
('yakinda','Yakında','amber',30),
('planlandi','Planlandı','purple',40),
('ara-verildi','Ara Verildi','red',50)
on conflict (slug) do update set label=excluded.label,color=excluded.color,sort_order=excluded.sort_order,updated_at=now();

insert into public.game_genres(slug,label,icon,sort_order) values
('genel','Genel','🎮',0),
('aksiyon','Aksiyon','⚔️',10),
('macera','Macera','🧭',20),
('korku','Korku','👻',30),
('rpg','RPG','🛡️',40),
('youtube-arsivi','YouTube Arşivi','▶️',50)
on conflict (slug) do update set label=excluded.label,icon=excluded.icon,sort_order=excluded.sort_order,updated_at=now();

insert into public.game_tags(slug,label,group_name,sort_order) values
('turkce-altyazili','Türkçe Altyazılı','dil',10),
('hikaye','Hikaye','icerik',20),
('seri','Seri','arsiv',30),
('canli-yayin','Canlı Yayın','youtube',40),
('playlist','Playlist','youtube',50)
on conflict (slug) do update set label=excluded.label,group_name=excluded.group_name,sort_order=excluded.sort_order,updated_at=now();

insert into public.site_runtime_config(key,value) values
('site_version', jsonb_build_object('version','v2.0.4','fix','kalici-silme-auth-bakim')),
('maintenance_mode', jsonb_build_object('enabled',false,'message','Hayatımız Oyun yayında.','percent',0,'adminBypass',true))
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into public.site_update_notes(version,title,summary,status,pinned,planned,sort_order) values
('v2.0.4 FIX','Kalıcı Silme, Kayıt/Giriş ve Bakım Modu Fix','Demo oyunların son oyun silindikten sonra geri gelmesi düzeltildi. Kayıt ol/giriş yap geri eklendi. Bakım modu admin alanına alındı.','published',true,false,1)
on conflict do nothing;

insert into public.site_status_logs(status,scope,message,details) values
('ok','schema','v2.0.4 FIX boş şema başarıyla kuruldu. Demo oyun eklenmedi.', jsonb_build_object('version','v2.0.4','fix','kalici-silme-auth-bakim'));
