-- Hayatımız Oyun v2.0.4 - Sıfırdan Supabase Şeması
-- ÖNEMLİ: Bu dosya tabloları sıfırdan kurar. Mevcut tablo verileri silinir.
-- Kullanım: Supabase SQL Editor içine tamamını yapıştırıp Run çalıştır.

create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

-- Sıfırdan kurulum için eski tabloları kaldır.
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

-- Ortak updated_at tetikleyicisi.
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
  description text,
  next_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_site_features_updated_at before update on public.site_features for each row execute function public.set_updated_at();

create table public.site_admin_planner (
  id uuid primary key default gen_random_uuid(),
  group_name text,
  title text not null,
  status text not null default 'plan',
  feature_key text,
  target text,
  description text,
  next_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_site_admin_planner_updated_at before update on public.site_admin_planner for each row execute function public.set_updated_at();

create table public.site_admin_notes (
  id uuid primary key default gen_random_uuid(),
  note text not null,
  actor_email text,
  created_at timestamptz not null default now()
);

create table public.site_recovery_snapshots (
  id uuid primary key default gen_random_uuid(),
  source text,
  note text,
  snapshot jsonb,
  created_at timestamptz not null default now()
);

create table public.site_game_requests (
  id uuid primary key default gen_random_uuid(),
  game_title text not null,
  series_name text,
  requester_email text,
  note text,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_site_game_requests_updated_at before update on public.site_game_requests for each row execute function public.set_updated_at();

create table public.site_status_logs (
  id uuid primary key default gen_random_uuid(),
  status_type text not null,
  status_value text not null,
  message text,
  source text default 'system',
  created_at timestamptz not null default now()
);
create index site_status_logs_type_idx on public.site_status_logs(status_type, created_at desc);

create table public.site_health_checks (
  id uuid primary key default gen_random_uuid(),
  check_key text not null,
  check_label text not null,
  status text not null default 'ok',
  message text,
  payload jsonb default '{}'::jsonb,
  checked_at timestamptz not null default now()
);
create index site_health_checks_key_idx on public.site_health_checks(check_key, checked_at desc);

create table public.site_activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_email text,
  action text not null,
  target_type text,
  target_id text,
  detail jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index site_activity_logs_action_idx on public.site_activity_logs(action, created_at desc);

-- Varsayılan durum, tür, etiket ve sürüm verileri.
insert into public.site_admin_profiles(email, display_name, role)
values ('mertdundaroyunda@gmail.com','Hayatımız Oyun','owner')
on conflict(email) do nothing;

insert into public.game_statuses(slug,label,color,sort_order) values
('devam-eden','Devam Eden','blue',10),
('tamamlanan','Tamamlanan','green',20),
('yakinda','Yakında','amber',30),
('planlandi','Planlandı','purple',40),
('ara-verildi','Ara Verildi','red',50)
on conflict(slug) do update set label=excluded.label,color=excluded.color,sort_order=excluded.sort_order,updated_at=now();

insert into public.game_genres(slug,label,icon,sort_order) values
('aksiyon','Aksiyon','⚔️',10),
('macera','Macera','🧭',20),
('korku','Korku','🌑',30),
('rpg','RPG','🛡️',40),
('bilim-kurgu','Bilim Kurgu','🚀',50),
('youtube-arsivi','YouTube Arşivi','▶️',60),
('genel','Genel','🎮',90)
on conflict(slug) do update set label=excluded.label,icon=excluded.icon,sort_order=excluded.sort_order,updated_at=now();

insert into public.game_tags(slug,label,group_name,sort_order) values
('turkce-altyazili','Türkçe Altyazılı','dil',10),
('turkce','Türkçe','dil',20),
('hikaye','Hikaye','tur',30),
('seri','Seri','tur',40),
('canli-yayin','Canlı Yayın','kaynak',50),
('arsiv','Arşiv','kaynak',60),
('plan','Plan','durum',70)
on conflict(slug) do update set label=excluded.label,group_name=excluded.group_name,sort_order=excluded.sort_order,updated_at=now();

insert into public.game_series(slug,title,description,status_slug,sort_order) values
('alan-wake','Alan Wake','Korku ve hikaye odaklı Remedy serisi.','devam-eden',10),
('assassins-creed','Assassin’s Creed','Tarihi aksiyon serisi arşivi.','tamamlanan',20),
('genel-arsiv','Genel Arşiv','Hayatımız Oyun genel YouTube arşivi.','yakinda',90)
on conflict(slug) do update set title=excluded.title,description=excluded.description,status_slug=excluded.status_slug,sort_order=excluded.sort_order,updated_at=now();

insert into public.games(slug,title,description,status_slug,genre_slug,series_slug,series_order,tags,cover_url,release_date,episode_count,watched_episode_count,is_featured,score)
values
('alan-wake-remastered','Alan Wake Remastered','Korku ve hikaye odaklı yayın arşivi.','devam-eden','korku','alan-wake',1,array['Türkçe Altyazılı','Hikaye','Korku'],'/assets/alan-wake-night-springs.png','2010',8,3,true,8.5),
('assassins-creed-directors-cut','Assassin’s Creed Director’s Cut','Tamamlanan seri arşivi ve bölüm takibi.','tamamlanan','aksiyon','assassins-creed',1,array['Türkçe','Seri','Tarihi'],'/assets/assassins-creed-directors-cut.png','2008',14,14,false,8.0),
('hayatimiz-oyun-arsiv','Hayatımız Oyun Arşivi','YouTube playlist, bölüm ve oyun koleksiyonu merkezi.','yakinda','youtube-arsivi','genel-arsiv',1,array['Arşiv','Plan','YouTube'],'/assets/hayatimiz-kapak.png','2026',0,0,false,0)
on conflict(slug) do update set title=excluded.title,description=excluded.description,status_slug=excluded.status_slug,genre_slug=excluded.genre_slug,series_slug=excluded.series_slug,series_order=excluded.series_order,tags=excluded.tags,cover_url=excluded.cover_url,release_date=excluded.release_date,episode_count=excluded.episode_count,watched_episode_count=excluded.watched_episode_count,is_featured=excluded.is_featured,score=excluded.score,updated_at=now();

insert into public.site_runtime_config(key,value) values
('schema_version', jsonb_build_object('version','v2.0.4','note','Sıfırdan status/oyun/arşiv şeması','updated_at',now())),
('maintenance_mode', jsonb_build_object('enabled',false,'percent',0,'message','Hayatımız Oyun yayında.','eta','')),
('site_status', jsonb_build_object('status','ok','version','v2.0.4','public_ready',false))
on conflict(key) do update set value=excluded.value,updated_at=now();

insert into public.site_update_notes(version,title,summary,status,pinned,planned,sort_order) values
('v2.0.4','Oyun Arşivi, Kartlar ve Filtreler','Profesyonel kartlar, arama, durum, tür, etiket, seri filtreleri, koleksiyon ve sonuç sayıları geri eklendi.','published',true,false,10),
('v2.0.5','Admin Panel Geri Dönüş','Yönetim paneli eski güçlü görünümüne kontrollü şekilde yaklaştırılacak.','planned',false,true,20)
;

insert into public.site_admin_planner(group_name,title,status,target,description,next_text,sort_order) values
('Geri Dönüş Planı','v2.0.5 Admin Panel Geri Dönüş','plan','v2.0.5','Admin dashboard, metrikler ve hızlı işlemler kontrollü şekilde geri eklenecek.','Önce site açılışı korunacak, sonra panel güçlendirilecek.',10),
('Geri Dönüş Planı','v2.0.6 Oyun Ekle/Düzenle Formu','plan','v2.0.6','Form alanları, etiket/tür ayrımı ve profesyonel kayıt akışı geri gelecek.','RAWG/YouTube sonraki adımlara bırakılacak.',20)
;

insert into public.site_health_checks(check_key,check_label,status,message,payload) values
('schema','Schema','ok','v2.0.4 sıfırdan schema kuruldu.',jsonb_build_object('version','v2.0.4')),
('public_app','Public Uygulama','ok','Boş ekran koruması ve arşiv filtreleri aktif.',jsonb_build_object('route','/ana-sayfa')),
('archive_filters','Oyun Arşivi Filtreleri','ok','Durum, tür, seri, etiket ve arama filtreleri hazır.',jsonb_build_object('version','v2.0.4'))
;

-- Public okuma politikaları için şimdilik RLS kapalı bırakıldı.
alter table public.site_users disable row level security;
alter table public.site_admin_profiles disable row level security;
alter table public.game_statuses disable row level security;
alter table public.game_genres disable row level security;
alter table public.game_series disable row level security;
alter table public.game_tags disable row level security;
alter table public.games disable row level security;
alter table public.game_episodes disable row level security;
alter table public.site_runtime_config disable row level security;
alter table public.site_update_notes disable row level security;
alter table public.site_calendar_events disable row level security;
alter table public.site_features disable row level security;
alter table public.site_admin_planner disable row level security;
alter table public.site_admin_notes disable row level security;
alter table public.site_recovery_snapshots disable row level security;
alter table public.site_game_requests disable row level security;
alter table public.site_status_logs disable row level security;
alter table public.site_health_checks disable row level security;
alter table public.site_activity_logs disable row level security;
