-- Hayatımız Oyun v2.1.2 - Public Yayın Öncesi Stabilite
-- GÜNCELLEME TİPİ: GÜVENLİ / SIFIRLAMAZ
-- Bu schema.sql tablo DROP yapmaz, mevcut verileri silmez.
-- Bu sürümde yeni tablo/kolon yoktur; status, sürüm ve güncelleme notları güncellenir.

-- Hayatımız Oyun v2.1.1 - Takvim, Güncelleme Notları ve Bakım Modu
-- GÜNCELLEME TİPİ: GÜVENLİ / SIFIRLAMAZ
-- Bu schema.sql tablo DROP yapmaz, mevcut verileri silmez.
-- Eksik tablo/kolon varsa oluşturur; sürüm, status ve güncelleme notunu günceller.
-- Bu sürümde takvim, güncelleme notları ve bakım modu için Supabase kalıcı veri bağlantıları güvenli şekilde eklenir.

create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.site_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  display_name text,
  role text not null default 'user',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.site_users add column if not exists display_name text;
alter table public.site_users add column if not exists role text not null default 'user';
alter table public.site_users add column if not exists is_active boolean not null default true;
alter table public.site_users add column if not exists created_at timestamptz not null default now();
alter table public.site_users add column if not exists updated_at timestamptz not null default now();
alter table public.site_users add column if not exists full_name text;
alter table public.site_users add column if not exists avatar_url text;
alter table public.site_users add column if not exists password_hash text;
alter table public.site_users add column if not exists password_salt text;
alter table public.site_users add column if not exists banned_at timestamptz;
alter table public.site_users add column if not exists ban_reason text;
alter table public.site_users add column if not exists last_login_at timestamptz;
drop trigger if exists trg_site_users_updated_at on public.site_users;
create trigger trg_site_users_updated_at before update on public.site_users for each row execute function public.set_updated_at();

create table if not exists public.site_admin_profiles (
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
alter table public.site_admin_profiles add column if not exists display_name text;
alter table public.site_admin_profiles add column if not exists role text not null default 'owner';
alter table public.site_admin_profiles add column if not exists can_manage_games boolean not null default true;
alter table public.site_admin_profiles add column if not exists can_manage_updates boolean not null default true;
alter table public.site_admin_profiles add column if not exists can_manage_calendar boolean not null default true;
alter table public.site_admin_profiles add column if not exists can_manage_settings boolean not null default true;
alter table public.site_admin_profiles add column if not exists is_active boolean not null default true;
alter table public.site_admin_profiles add column if not exists created_at timestamptz not null default now();
alter table public.site_admin_profiles add column if not exists updated_at timestamptz not null default now();
drop trigger if exists trg_site_admin_profiles_updated_at on public.site_admin_profiles;
create trigger trg_site_admin_profiles_updated_at before update on public.site_admin_profiles for each row execute function public.set_updated_at();

create table if not exists public.game_statuses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  color text not null default 'slate',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.game_statuses add column if not exists color text not null default 'slate';
alter table public.game_statuses add column if not exists sort_order integer not null default 0;
alter table public.game_statuses add column if not exists is_active boolean not null default true;
alter table public.game_statuses add column if not exists created_at timestamptz not null default now();
alter table public.game_statuses add column if not exists updated_at timestamptz not null default now();
drop trigger if exists trg_game_statuses_updated_at on public.game_statuses;
create trigger trg_game_statuses_updated_at before update on public.game_statuses for each row execute function public.set_updated_at();

create table if not exists public.game_genres (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  icon text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.game_genres add column if not exists icon text;
alter table public.game_genres add column if not exists sort_order integer not null default 0;
alter table public.game_genres add column if not exists is_active boolean not null default true;
alter table public.game_genres add column if not exists created_at timestamptz not null default now();
alter table public.game_genres add column if not exists updated_at timestamptz not null default now();
drop trigger if exists trg_game_genres_updated_at on public.game_genres;
create trigger trg_game_genres_updated_at before update on public.game_genres for each row execute function public.set_updated_at();

create table if not exists public.game_series (
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
alter table public.game_series add column if not exists description text;
alter table public.game_series add column if not exists cover_url text;
alter table public.game_series add column if not exists status_slug text default 'devam-eden';
alter table public.game_series add column if not exists sort_order integer not null default 0;
alter table public.game_series add column if not exists created_at timestamptz not null default now();
alter table public.game_series add column if not exists updated_at timestamptz not null default now();
drop trigger if exists trg_game_series_updated_at on public.game_series;
create trigger trg_game_series_updated_at before update on public.game_series for each row execute function public.set_updated_at();

create table if not exists public.game_tags (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  group_name text default 'genel',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.game_tags add column if not exists group_name text default 'genel';
alter table public.game_tags add column if not exists sort_order integer not null default 0;
alter table public.game_tags add column if not exists is_active boolean not null default true;
alter table public.game_tags add column if not exists created_at timestamptz not null default now();
alter table public.game_tags add column if not exists updated_at timestamptz not null default now();
drop trigger if exists trg_game_tags_updated_at on public.game_tags;
create trigger trg_game_tags_updated_at before update on public.game_tags for each row execute function public.set_updated_at();

create table if not exists public.games (
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
alter table public.games add column if not exists description text;
alter table public.games add column if not exists story_text text;
alter table public.games add column if not exists status_slug text not null default 'devam-eden';
alter table public.games add column if not exists genre_slug text default 'genel';
alter table public.games add column if not exists series_slug text;
alter table public.games add column if not exists series_order integer not null default 0;
alter table public.games add column if not exists tags text[] not null default '{}';
alter table public.games add column if not exists cover_url text;
alter table public.games add column if not exists banner_url text;
alter table public.games add column if not exists release_date text;
alter table public.games add column if not exists platforms text[] not null default '{}';
alter table public.games add column if not exists rawg_id integer;
alter table public.games add column if not exists rawg_slug text;
alter table public.games add column if not exists steam_app_id text;
alter table public.games add column if not exists youtube_playlist_url text;
alter table public.games add column if not exists youtube_playlist_id text;
alter table public.games add column if not exists video_url text;
alter table public.games add column if not exists episode_count integer not null default 0;
alter table public.games add column if not exists watched_episode_count integer not null default 0;
alter table public.games add column if not exists score numeric(4,1) not null default 0;
alter table public.games add column if not exists is_featured boolean not null default false;
alter table public.games add column if not exists is_public boolean not null default true;
alter table public.games add column if not exists created_at timestamptz not null default now();
alter table public.games add column if not exists updated_at timestamptz not null default now();
-- v2.1.0 frontend/API uyumluluk kolonları: güvenli, veri silmez.
alter table public.games add column if not exists genre text;
alter table public.games add column if not exists status text;
alter table public.games add column if not exists series_name text;
alter table public.games add column if not exists collection_name text;
alter table public.games add column if not exists playlist_url text;
alter table public.games add column if not exists episodes jsonb not null default '[]'::jsonb;
alter table public.games add column if not exists sort_order integer not null default 0;
alter table public.games add column if not exists meta_source text;
alter table public.games add column if not exists meta_checked_at timestamptz;
alter table public.games add column if not exists cover_source text;
alter table public.games add column if not exists rawg_rating numeric(4,1) not null default 0;
alter table public.games add column if not exists steam_store_url text;
alter table public.games add column if not exists steam_header_url text;
alter table public.games add column if not exists episode_sync_source text;
alter table public.games add column if not exists episode_synced_at timestamptz;
create index if not exists games_genre_text_idx on public.games(genre);
create index if not exists games_status_text_idx on public.games(status);
create index if not exists games_collection_text_idx on public.games(collection_name);
drop trigger if exists trg_games_updated_at on public.games;
create trigger trg_games_updated_at before update on public.games for each row execute function public.set_updated_at();
create index if not exists games_status_slug_idx on public.games(status_slug);
create index if not exists games_genre_slug_idx on public.games(genre_slug);
create index if not exists games_series_slug_idx on public.games(series_slug, series_order);
create index if not exists games_title_trgm_idx on public.games using gin (title gin_trgm_ops);

-- v2.0.6 profesyonel oyun formu alanları: güvenli, veri silmez.
alter table public.games add column if not exists story_text text;
alter table public.games add column if not exists banner_url text;
alter table public.games add column if not exists platforms text[] not null default '{}';
alter table public.games add column if not exists rawg_id integer;
alter table public.games add column if not exists steam_app_id text;
alter table public.games add column if not exists youtube_playlist_url text;
alter table public.games add column if not exists watched_episode_count integer not null default 0;


create table if not exists public.game_episodes (
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
alter table public.game_episodes add column if not exists description text;
alter table public.game_episodes add column if not exists youtube_video_id text;
alter table public.game_episodes add column if not exists video_url text;
alter table public.game_episodes add column if not exists thumbnail_url text;
alter table public.game_episodes add column if not exists published_at timestamptz;
alter table public.game_episodes add column if not exists duration_text text;
alter table public.game_episodes add column if not exists is_watched boolean not null default false;
alter table public.game_episodes add column if not exists sort_order integer not null default 0;
alter table public.game_episodes add column if not exists created_at timestamptz not null default now();
alter table public.game_episodes add column if not exists updated_at timestamptz not null default now();
drop trigger if exists trg_game_episodes_updated_at on public.game_episodes;
create trigger trg_game_episodes_updated_at before update on public.game_episodes for each row execute function public.set_updated_at();
create index if not exists game_episodes_game_idx on public.game_episodes(game_id, sort_order);

create table if not exists public.site_runtime_config (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.site_runtime_config add column if not exists value jsonb not null default '{}'::jsonb;
alter table public.site_runtime_config add column if not exists created_at timestamptz not null default now();
alter table public.site_runtime_config add column if not exists updated_at timestamptz not null default now();
drop trigger if exists trg_site_runtime_config_updated_at on public.site_runtime_config;
create trigger trg_site_runtime_config_updated_at before update on public.site_runtime_config for each row execute function public.set_updated_at();

create table if not exists public.site_update_notes (
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
alter table public.site_update_notes add column if not exists summary text;
alter table public.site_update_notes add column if not exists note text;
alter table public.site_update_notes add column if not exists image_url text;
alter table public.site_update_notes add column if not exists status text not null default 'published';
alter table public.site_update_notes add column if not exists pinned boolean not null default false;
alter table public.site_update_notes add column if not exists planned boolean not null default false;
alter table public.site_update_notes add column if not exists sort_order integer not null default 0;
alter table public.site_update_notes add column if not exists created_at timestamptz not null default now();
alter table public.site_update_notes add column if not exists updated_at timestamptz not null default now();
drop trigger if exists trg_site_update_notes_updated_at on public.site_update_notes;
create trigger trg_site_update_notes_updated_at before update on public.site_update_notes for each row execute function public.set_updated_at();
create index if not exists site_update_notes_version_idx on public.site_update_notes(version);
create index if not exists site_update_notes_status_idx on public.site_update_notes(status, planned);

create table if not exists public.site_calendar_events (
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
alter table public.site_calendar_events add column if not exists event_date date;
alter table public.site_calendar_events add column if not exists event_time text;
alter table public.site_calendar_events add column if not exists event_type text not null default 'Yayın';
alter table public.site_calendar_events add column if not exists game_title text;
alter table public.site_calendar_events add column if not exists episode_number text;
alter table public.site_calendar_events add column if not exists episode_title text;
alter table public.site_calendar_events add column if not exists cover_url text;
alter table public.site_calendar_events add column if not exists video_url text;
alter table public.site_calendar_events add column if not exists note text;
alter table public.site_calendar_events add column if not exists source text not null default 'manual';
alter table public.site_calendar_events add column if not exists is_active boolean not null default true;
alter table public.site_calendar_events add column if not exists created_at timestamptz not null default now();
alter table public.site_calendar_events add column if not exists updated_at timestamptz not null default now();
drop trigger if exists trg_site_calendar_events_updated_at on public.site_calendar_events;
create trigger trg_site_calendar_events_updated_at before update on public.site_calendar_events for each row execute function public.set_updated_at();
create index if not exists site_calendar_events_date_idx on public.site_calendar_events(event_date asc, event_time asc);
create index if not exists site_calendar_events_active_idx on public.site_calendar_events(is_active);

create table if not exists public.site_status_logs (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'ok',
  scope text not null default 'site',
  message text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.site_status_logs add column if not exists details jsonb not null default '{}'::jsonb;
alter table public.site_status_logs add column if not exists created_at timestamptz not null default now();
create index if not exists site_status_logs_scope_idx on public.site_status_logs(scope, created_at desc);

create table if not exists public.site_health_checks (
  id uuid primary key default gen_random_uuid(),
  check_key text not null,
  status text not null default 'ok',
  message text,
  checked_at timestamptz not null default now(),
  details jsonb not null default '{}'::jsonb
);
alter table public.site_health_checks add column if not exists details jsonb not null default '{}'::jsonb;
create index if not exists site_health_checks_key_idx on public.site_health_checks(check_key, checked_at desc);

create table if not exists public.site_activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_email text,
  action text not null,
  target_type text,
  target_id text,
  message text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.site_activity_logs add column if not exists details jsonb not null default '{}'::jsonb;
alter table public.site_activity_logs add column if not exists created_at timestamptz not null default now();
create index if not exists site_activity_logs_created_idx on public.site_activity_logs(created_at desc);

insert into public.site_admin_profiles(email, display_name, role, can_manage_games, can_manage_updates, can_manage_calendar, can_manage_settings, is_active)
values ('mertdundaroyunda@gmail.com', 'Hayatımız Oyun Owner', 'owner', true, true, true, true, true)
on conflict (email) do update set
  display_name = excluded.display_name,
  role = excluded.role,
  can_manage_games = true,
  can_manage_updates = true,
  can_manage_calendar = true,
  can_manage_settings = true,
  is_active = true,
  updated_at = now();

insert into public.game_statuses(slug,label,color,sort_order) values
('devam-eden','Devam Eden','green',10),
('tamamlanan','Tamamlanan','blue',20),
('yakinda','Yakında','amber',30),
('planlandi','Planlandı','purple',40),
('ara-verildi','Ara Verildi','red',50)
on conflict (slug) do update set label=excluded.label,color=excluded.color,sort_order=excluded.sort_order,is_active=true,updated_at=now();

insert into public.game_genres(slug,label,icon,sort_order) values
('genel','Genel','🎮',0),
('aksiyon','Aksiyon','⚔️',10),
('macera','Macera','🧭',20),
('korku','Korku','👻',30),
('rpg','RPG','🛡️',40),
('youtube-arsivi','YouTube Arşivi','▶️',50)
on conflict (slug) do update set label=excluded.label,icon=excluded.icon,sort_order=excluded.sort_order,is_active=true,updated_at=now();

insert into public.game_tags(slug,label,group_name,sort_order) values
('turkce-altyazili','Türkçe Altyazılı','dil',10),
('hikaye','Hikaye','icerik',20),
('seri','Seri','arsiv',30),
('canli-yayin','Canlı Yayın','youtube',40),
('playlist','Playlist','youtube',50)
on conflict (slug) do update set label=excluded.label,group_name=excluded.group_name,sort_order=excluded.sort_order,is_active=true,updated_at=now();

insert into public.site_runtime_config(key,value) values
('site_version', jsonb_build_object('version','v2.0.6','status','Tamamlandı','title','Oyun Ekle / Düzenle Formu','schema_mode','safe-no-reset'))
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into public.site_runtime_config(key,value) values
('maintenance_mode', jsonb_build_object('enabled',false,'message','Hayatımız Oyun yayında.','percent',0,'adminBypass',true,'managedBy','v2.0.6'))
on conflict (key) do nothing;

insert into public.site_update_notes(version,title,summary,status,pinned,planned,sort_order) values
('v2.0.5','Admin Panel Geri Dönüş','Admin panel eski dolu yapıya kontrollü şekilde yaklaştırıldı. Buton taşması, beyaz/görünmez yazı ve güvenli hata ekranı düzeltildi. Schema artık tablo/veri sıfırlamaz.','published',true,false,1),
('v2.0.7','RAWG / Steam / Kapak / Meta Geri Dönüş','Sıradaki adımda RAWG ve Steam bilgileri, kapak/banner/meta çekme sistemi kontrollü şekilde geri eklenecek.','planned',false,true,2)
on conflict do nothing;

insert into public.site_status_logs(status,scope,message,details) values
('ok','version','v2.0.5 Admin Panel Geri Dönüş tamamlandı.', jsonb_build_object('version','v2.0.5','schema_mode','safe-no-reset','reset',false)),
('ok','schema','v2.0.5 güvenli schema çalıştırıldı. Mevcut veriler sıfırlanmadı.', jsonb_build_object('version','v2.0.5','drop_tables',false));


-- v2.0.6 sürüm, güncelleme notu ve status güncellemesi. Sıfırlama yapmaz.
insert into public.site_runtime_config(key,value) values
('site_version', jsonb_build_object('version','v2.0.6','status','Tamamlandı','title','Oyun Ekle / Düzenle Formu','schema_mode','safe-no-reset','reset',false))
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into public.site_update_notes(version,title,summary,status,pinned,planned,sort_order) values
('v2.0.6','Oyun Ekle / Düzenle Formu','Oyun ekle ve düzenle formu profesyonel kartlı yapıya alındı. Tür, etiket ve durum alanları ayrıldı; kapak, banner, platform, seri, hikaye, RAWG/Steam ve YouTube alanları okunabilir hale getirildi.','published',true,false,1),
('v2.0.7','RAWG / Steam / Kapak / Meta Geri Dönüş','Sıradaki adımda RAWG ve Steam bilgileri, kapak/banner/meta çekme sistemi kontrollü şekilde geri eklenecek.','planned',false,true,2)
on conflict do nothing;

insert into public.site_status_logs(status,scope,message,details) values
('ok','version','v2.0.6 Oyun Ekle / Düzenle Formu tamamlandı.', jsonb_build_object('version','v2.0.6','schema_mode','safe-no-reset','reset',false)),
('ok','schema','v2.0.6 güvenli schema çalıştırıldı. Mevcut veriler sıfırlanmadı.', jsonb_build_object('version','v2.0.6','drop_tables',false,'drop_triggers_only',true));


-- v2.0.7 RAWG / Steam / Kapak / Meta Geri Dönüş
-- GÜVENLİ / SIFIRLAMAZ: DROP TABLE yoktur, mevcut verileri silmez.
alter table public.games add column if not exists rawg_slug text;
alter table public.games add column if not exists rawg_id integer;
alter table public.games add column if not exists steam_app_id text;
alter table public.games add column if not exists meta_source text;
alter table public.games add column if not exists meta_checked_at timestamptz;
alter table public.games add column if not exists cover_source text;
alter table public.games add column if not exists rawg_rating numeric(4,1) not null default 0;
alter table public.games add column if not exists steam_store_url text;
alter table public.games add column if not exists steam_header_url text;
alter table public.games add column if not exists banner_url text;
alter table public.games add column if not exists platforms text[] not null default '{}';
create index if not exists games_rawg_slug_idx on public.games(rawg_slug);
create index if not exists games_steam_app_id_idx on public.games(steam_app_id);
create index if not exists games_meta_checked_at_idx on public.games(meta_checked_at desc);

insert into public.site_runtime_config(key,value) values
('site_version', jsonb_build_object('version','v2.0.7','status','Tamamlandı','title','RAWG / Steam / Kapak / Meta Geri Dönüş','schema_mode','safe-no-reset','reset',false,'schema_required',true))
on conflict (key) do update set value = excluded.value, updated_at = now();

update public.site_update_notes
set status='published', planned=false, pinned=true, summary='RAWG / Steam / kapak / meta paneli oyun ekle/düzenle formuna kontrollü şekilde eklendi. Oyun adından tür, çıkış tarihi, kapak, banner, puan, RAWG slug ve Steam App ID önerileri alınabilir.', updated_at=now()
where version='v2.0.7';

insert into public.site_update_notes(version,title,summary,status,pinned,planned,sort_order) values
('v2.0.7','RAWG / Steam / Kapak / Meta Geri Dönüş','RAWG / Steam / kapak / meta paneli oyun ekle/düzenle formuna kontrollü şekilde eklendi. Oyun adından tür, çıkış tarihi, kapak, banner, puan, RAWG slug ve Steam App ID önerileri alınabilir.','published',true,false,1),
('v2.0.8','YouTube Playlist ve Bölüm Takibi','Sıradaki adımda YouTube playlist otomasyonu, bölüm listesi ve kaldığımız bölüm takibi kontrollü şekilde geri eklenecek.','planned',false,true,2)
on conflict do nothing;

insert into public.site_status_logs(status,scope,message,details) values
('ok','version','v2.0.7 RAWG / Steam / Kapak / Meta Geri Dönüş tamamlandı.', jsonb_build_object('version','v2.0.7','schema_mode','safe-no-reset','reset',false,'schema_required',true)),
('ok','schema','v2.0.7 güvenli schema çalıştırıldı. Mevcut veriler sıfırlanmadı; meta kolonları eklendi.', jsonb_build_object('version','v2.0.7','drop_tables',false,'new_columns',jsonb_build_array('meta_source','meta_checked_at','cover_source','rawg_rating','steam_store_url','steam_header_url')));

-- v2.0.8 YouTube Playlist ve Bölüm Takibi
-- GÜVENLİ / SIFIRLAMAZ: DROP TABLE yoktur, mevcut verileri silmez.
-- Gereklidir: playlist/bölüm alanlarını, sürüm/status ve güncelleme notlarını güvenli şekilde günceller.
alter table public.games add column if not exists youtube_playlist_url text;
alter table public.games add column if not exists youtube_playlist_id text;
alter table public.games add column if not exists episode_count integer not null default 0;
alter table public.games add column if not exists watched_episode_count integer not null default 0;
alter table public.games add column if not exists episode_sync_source text;
alter table public.games add column if not exists episode_synced_at timestamptz;
create index if not exists games_youtube_playlist_id_idx on public.games(youtube_playlist_id);
create index if not exists games_episode_synced_at_idx on public.games(episode_synced_at desc);

create table if not exists public.game_episodes (
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
alter table public.game_episodes add column if not exists episode_number integer;
alter table public.game_episodes add column if not exists title text;
alter table public.game_episodes add column if not exists description text;
alter table public.game_episodes add column if not exists youtube_video_id text;
alter table public.game_episodes add column if not exists video_url text;
alter table public.game_episodes add column if not exists thumbnail_url text;
alter table public.game_episodes add column if not exists published_at timestamptz;
alter table public.game_episodes add column if not exists duration_text text;
alter table public.game_episodes add column if not exists is_watched boolean not null default false;
alter table public.game_episodes add column if not exists sort_order integer not null default 0;
alter table public.game_episodes add column if not exists created_at timestamptz not null default now();
alter table public.game_episodes add column if not exists updated_at timestamptz not null default now();
create index if not exists game_episodes_game_sort_idx on public.game_episodes(game_id, sort_order, episode_number);
create index if not exists game_episodes_youtube_video_idx on public.game_episodes(youtube_video_id);

insert into public.site_runtime_config(key,value) values
('site_version', jsonb_build_object('version','v2.0.8','status','Tamamlandı','title','YouTube Playlist ve Bölüm Takibi','schema_mode','safe-no-reset','reset',false,'schema_required',true))
on conflict (key) do update set value = excluded.value, updated_at = now();

update public.site_update_notes
set status='published', planned=false, pinned=true, summary='YouTube playlist otomasyonu, bölüm listesi, bölüm sayısı güncelleme ve kaldığımız bölüm takibi kontrollü şekilde geri eklendi.', updated_at=now()
where version='v2.0.8';

insert into public.site_update_notes(version,title,summary,status,pinned,planned,sort_order) values
('v2.0.8','YouTube Playlist ve Bölüm Takibi','YouTube playlist otomasyonu, bölüm listesi, bölüm sayısı güncelleme ve kaldığımız bölüm takibi kontrollü şekilde geri eklendi. API çalışmazsa site boş kalmaz; yerel güvenli bölüm listesi oluşturulur.','published',true,false,1),
('v2.0.9','Koleksiyon, Seri, Durum ve Sayaçlar','Sıradaki adımda koleksiyon, seri gruplama, durum sayaçları ve arşiv istatistikleri daha güçlü hale getirilecek.','planned',false,true,2)
on conflict do nothing;

insert into public.site_status_logs(status,scope,message,details) values
('ok','version','v2.0.8 YouTube Playlist ve Bölüm Takibi tamamlandı.', jsonb_build_object('version','v2.0.8','schema_mode','safe-no-reset','reset',false,'schema_required',true)),
('ok','schema','v2.0.8 güvenli schema çalıştırıldı. Mevcut veriler sıfırlanmadı; playlist ve bölüm takip alanları eklendi.', jsonb_build_object('version','v2.0.8','drop_tables',false,'new_columns',jsonb_build_array('youtube_playlist_id','episode_sync_source','episode_synced_at')));

-- v2.0.9 Koleksiyon, Seri, Durum ve Sayaçlar
-- GÜVENLİ / SIFIRLAMAZ: DROP TABLE yoktur, mevcut verileri silmez.
-- Gerekli: koleksiyon/sıralama alanlarını, sürüm/status ve güncelleme notlarını güvenli şekilde günceller.
alter table public.games add column if not exists collection_name text;
alter table public.games add column if not exists sort_order integer not null default 0;
alter table public.games add column if not exists status_bucket text;
alter table public.games add column if not exists is_featured boolean not null default false;
create index if not exists games_collection_name_idx on public.games(collection_name);
create index if not exists games_sort_order_idx on public.games(sort_order);
create index if not exists games_status_bucket_idx on public.games(status_bucket);

create table if not exists public.game_collections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  cover_url text,
  type text not null default 'manual',
  status_slug text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.game_collections add column if not exists description text;
alter table public.game_collections add column if not exists cover_url text;
alter table public.game_collections add column if not exists type text not null default 'manual';
alter table public.game_collections add column if not exists status_slug text;
alter table public.game_collections add column if not exists sort_order integer not null default 0;
alter table public.game_collections add column if not exists is_active boolean not null default true;
alter table public.game_collections add column if not exists created_at timestamptz not null default now();
alter table public.game_collections add column if not exists updated_at timestamptz not null default now();
create index if not exists game_collections_type_idx on public.game_collections(type);
create index if not exists game_collections_sort_idx on public.game_collections(sort_order);
drop trigger if exists trg_game_collections_updated_at on public.game_collections;
create trigger trg_game_collections_updated_at before update on public.game_collections for each row execute function public.set_updated_at();

create table if not exists public.game_collection_items (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid references public.game_collections(id) on delete cascade,
  game_id uuid references public.games(id) on delete cascade,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique(collection_id, game_id)
);
alter table public.game_collection_items add column if not exists sort_order integer not null default 0;
alter table public.game_collection_items add column if not exists created_at timestamptz not null default now();
create index if not exists game_collection_items_collection_sort_idx on public.game_collection_items(collection_id, sort_order);
create index if not exists game_collection_items_game_idx on public.game_collection_items(game_id);

insert into public.site_runtime_config(key,value) values
('site_version', jsonb_build_object('version','v2.0.9','status','Tamamlandı','title','Koleksiyon, Seri, Durum ve Sayaçlar','schema_mode','safe-no-reset','reset',false,'schema_required',true))
on conflict (key) do update set value = excluded.value, updated_at = now();

update public.site_update_notes
set status='published', planned=false, pinned=true, summary='Koleksiyonlar, seri grupları, durum sayaçları ve arşiv istatistikleri aynı veri kaynağından beslenen stabil yapıya alındı. Koleksiyonlar boş görünmez, durum ayrımı ve seri sayıları doğru hesaplanır.', updated_at=now()
where version='v2.0.9';

insert into public.site_update_notes(version,title,summary,status,pinned,planned,sort_order) values
('v2.0.9','Koleksiyon, Seri, Durum ve Sayaçlar','Koleksiyonlar, seri grupları, durum sayaçları ve arşiv istatistikleri aynı veri kaynağından beslenen stabil yapıya alındı. Koleksiyonlar boş görünmez, durum ayrımı ve seri sayıları doğru hesaplanır.','published',true,false,1),
('v2.1.0','Supabase Kalıcı Veri Geri Dönüş','Sıradaki adımda local stabil sistem korunarak Supabase kalıcı veri bağlantıları kontrollü şekilde geri eklenecek.','planned',false,true,2)
on conflict do nothing;

insert into public.site_status_logs(status,scope,message,details) values
('ok','version','v2.0.9 Koleksiyon, Seri, Durum ve Sayaçlar tamamlandı.', jsonb_build_object('version','v2.0.9','schema_mode','safe-no-reset','reset',false,'schema_required',true)),
('ok','schema','v2.0.9 güvenli schema çalıştırıldı. Mevcut veriler sıfırlanmadı; koleksiyon/sıralama alanları eklendi.', jsonb_build_object('version','v2.0.9','drop_tables',false,'new_columns',jsonb_build_array('collection_name','sort_order','status_bucket','is_featured')));


-- v2.1.0 Supabase Kalıcı Veri Geri Dönüş
-- GÜVENLİ / SIFIRLAMAZ: DROP TABLE yoktur, mevcut verileri silmez.
-- Gerekli: API/auth/oyun CRUD uyumluluk kolonlarını, sürüm/status ve güncelleme notlarını güvenli şekilde günceller.
alter table public.site_users add column if not exists full_name text;
alter table public.site_users add column if not exists avatar_url text;
alter table public.site_users add column if not exists password_hash text;
alter table public.site_users add column if not exists password_salt text;
alter table public.site_users add column if not exists banned_at timestamptz;
alter table public.site_users add column if not exists ban_reason text;
alter table public.site_users add column if not exists last_login_at timestamptz;

alter table public.games add column if not exists genre text;
alter table public.games add column if not exists status text;
alter table public.games add column if not exists series_name text;
alter table public.games add column if not exists collection_name text;
alter table public.games add column if not exists playlist_url text;
alter table public.games add column if not exists episodes jsonb not null default '[]'::jsonb;
alter table public.games add column if not exists sort_order integer not null default 0;
alter table public.games add column if not exists meta_source text;
alter table public.games add column if not exists meta_checked_at timestamptz;
alter table public.games add column if not exists cover_source text;
alter table public.games add column if not exists rawg_rating numeric(4,1) not null default 0;
alter table public.games add column if not exists steam_store_url text;
alter table public.games add column if not exists steam_header_url text;
alter table public.games add column if not exists episode_sync_source text;
alter table public.games add column if not exists episode_synced_at timestamptz;
create index if not exists games_genre_text_idx on public.games(genre);
create index if not exists games_status_text_idx on public.games(status);
create index if not exists games_collection_text_idx on public.games(collection_name);
create index if not exists games_updated_at_idx on public.games(updated_at desc);

insert into public.site_admin_profiles(email, display_name, role, can_manage_games, can_manage_updates, can_manage_calendar, can_manage_settings, is_active)
values ('mertdundaroyunda@gmail.com', 'Hayatımız Oyun Owner', 'owner', true, true, true, true, true)
on conflict (email) do update set
  display_name = excluded.display_name,
  role = excluded.role,
  can_manage_games = true,
  can_manage_updates = true,
  can_manage_calendar = true,
  can_manage_settings = true,
  is_active = true,
  updated_at = now();

insert into public.site_runtime_config(key,value) values
('site_version', jsonb_build_object('version','v2.1.0','status','Tamamlandı','title','Supabase Kalıcı Veri Geri Dönüş','schema_mode','safe-no-reset','reset',false,'schema_required',true,'drop_tables',false))
on conflict (key) do update set value = excluded.value, updated_at = now();

update public.site_update_notes
set status='published', planned=false, pinned=true, summary='Local stabil sistem bozulmadan Supabase kalıcı veri bağlantısı geri eklendi. Oyun listeleme, ekleme, düzenleme, silme ve toplu silme API üzerinden Supabase ile senkron çalışır; API/ENV hata verirse site local güvenli moda düşer.', updated_at=now()
where version='v2.1.0';

insert into public.site_update_notes(version,title,summary,status,pinned,planned,sort_order)
select 'v2.1.0','Supabase Kalıcı Veri Geri Dönüş','Local stabil sistem bozulmadan Supabase kalıcı veri bağlantısı geri eklendi. Oyun listeleme, ekleme, düzenleme, silme ve toplu silme API üzerinden Supabase ile senkron çalışır; API/ENV hata verirse site local güvenli moda düşer.','published',true,false,1
where not exists (select 1 from public.site_update_notes where version='v2.1.0' and title='Supabase Kalıcı Veri Geri Dönüş');

insert into public.site_update_notes(version,title,summary,status,pinned,planned,sort_order)
select 'v2.1.1','Takvim, Güncelleme Notları ve Bakım Modu','Sıradaki adımda yayın takvimi, güncelleme notları ve bakım modu Supabase kalıcı veri bağlantısına kontrollü şekilde taşınacak.','planned',false,true,2
where not exists (select 1 from public.site_update_notes where version='v2.1.1' and title='Takvim, Güncelleme Notları ve Bakım Modu');

insert into public.site_status_logs(status,scope,message,details) values
('ok','version','v2.1.0 Supabase Kalıcı Veri Geri Dönüş tamamlandı.', jsonb_build_object('version','v2.1.0','schema_mode','safe-no-reset','reset',false,'schema_required',true)),
('ok','schema','v2.1.0 güvenli schema çalıştırıldı. Mevcut veriler sıfırlanmadı; Supabase auth ve oyun CRUD uyumluluk kolonları eklendi.', jsonb_build_object('version','v2.1.0','drop_tables',false,'new_columns',jsonb_build_array('site_users.password_hash','site_users.password_salt','games.genre','games.status','games.collection_name','games.episodes','games.sort_order')));

-- v2.1.1 Takvim, Güncelleme Notları ve Bakım Modu
-- GÜVENLİ / SIFIRLAMAZ: DROP TABLE yoktur, mevcut verileri silmez.
-- Gerekli: Takvim, güncelleme notları ve bakım modu Supabase kalıcı veri bağlantıları için tablo/kolon/status kayıtlarını günceller.

alter table public.site_calendar_events add column if not exists game_id uuid;
alter table public.site_calendar_events add column if not exists game_title text;
alter table public.site_calendar_events add column if not exists episode_number text;
alter table public.site_calendar_events add column if not exists episode_title text;
alter table public.site_calendar_events add column if not exists video_url text;
alter table public.site_calendar_events add column if not exists cover_url text;
alter table public.site_calendar_events add column if not exists note text;
alter table public.site_calendar_events add column if not exists source text not null default 'manual';
alter table public.site_calendar_events add column if not exists is_active boolean not null default true;
create index if not exists site_calendar_events_date_idx on public.site_calendar_events(event_date asc, event_time asc);
create index if not exists site_calendar_events_active_idx on public.site_calendar_events(is_active);

alter table public.site_update_notes add column if not exists description text;
alter table public.site_update_notes add column if not exists planned boolean not null default false;
alter table public.site_update_notes add column if not exists pinned boolean not null default false;
alter table public.site_update_notes add column if not exists sort_order integer not null default 0;
create index if not exists site_update_notes_status_idx on public.site_update_notes(status, planned);
create index if not exists site_update_notes_version_idx on public.site_update_notes(version);

insert into public.site_runtime_config(key,value) values
('site_version', jsonb_build_object('version','v2.1.1','status','Tamamlandı','title','Takvim, Güncelleme Notları ve Bakım Modu','schema_mode','safe-no-reset','reset',false,'schema_required',true,'drop_tables',false)),
('schema_version', jsonb_build_object('version','v2.1.1','note','Takvim, notlar ve bakım modu Supabase kalıcı veri bağlantısı','updated_at',now(),'schema_mode','safe-no-reset','drop_tables',false)),
('maintenance_mode', jsonb_build_object('enabled',false,'message','Hayatımız Oyun kısa süreli bakımda.','eta','','percent',0,'adminBypass',true,'updatedBy','v2.1.1'))
on conflict (key) do update set
  value = case
    when public.site_runtime_config.key = 'maintenance_mode' then public.site_runtime_config.value
    else excluded.value
  end,
  updated_at = now();

update public.site_update_notes
set status='published', planned=false, pinned=true,
    summary='Yayın takvimi, güncelleme notları ve bakım modu Supabase kalıcı veri bağlantısına kontrollü şekilde taşındı. API/ENV hata verirse local güvenli mod korunur; admin bypass ve public bakım ekranı bozulmaz.',
    updated_at=now()
where version='v2.1.1' and title='Takvim, Güncelleme Notları ve Bakım Modu';

insert into public.site_update_notes(version,title,summary,status,pinned,planned,sort_order)
select 'v2.1.1','Takvim, Güncelleme Notları ve Bakım Modu','Yayın takvimi, güncelleme notları ve bakım modu Supabase kalıcı veri bağlantısına kontrollü şekilde taşındı. API/ENV hata verirse local güvenli mod korunur; admin bypass ve public bakım ekranı bozulmaz.','published',true,false,1
where not exists (select 1 from public.site_update_notes where version='v2.1.1' and title='Takvim, Güncelleme Notları ve Bakım Modu');

insert into public.site_update_notes(version,title,summary,status,pinned,planned,sort_order)
select 'v2.1.2','Public Yayın Öncesi Stabilite','Sıradaki adımda public site açılışı, mobil görünüm, SEO, hata ekranları ve genel yayın öncesi kontroller tamamlanacak.','planned',false,true,2
where not exists (select 1 from public.site_update_notes where version='v2.1.2' and title='Public Yayın Öncesi Stabilite');

insert into public.site_status_logs(status,scope,message,details) values
('ok','version','v2.1.1 Takvim, Güncelleme Notları ve Bakım Modu tamamlandı.', jsonb_build_object('version','v2.1.1','schema_mode','safe-no-reset','reset',false,'schema_required',true)),
('ok','schema','v2.1.1 güvenli schema çalıştırıldı. Mevcut veriler sıfırlanmadı; takvim, güncelleme notları ve bakım modu kalıcı veri bağlantısı güncellendi.', jsonb_build_object('version','v2.1.1','drop_tables',false,'new_columns',jsonb_build_array('site_calendar_events.video_url','site_update_notes.description','site_runtime_config.maintenance_mode')));


-- v2.1.2 Public Yayın Öncesi Stabilite
-- GÜVENLİ / SIFIRLAMAZ: DROP TABLE yoktur, mevcut verileri silmez.

insert into public.site_runtime_config(key,value) values
('site_version', jsonb_build_object('version','v2.1.2','status','Tamamlandı','title','Public Yayın Öncesi Stabilite','schema_mode','safe-no-reset','reset',false,'schema_required',true,'drop_tables',false)),
('schema_version', jsonb_build_object('version','v2.1.2','note','Public yayın öncesi stabilite status ve not güncellemesi','updated_at',now(),'schema_mode','safe-no-reset','drop_tables',false))
on conflict (key) do update set
  value = excluded.value,
  updated_at = now();

update public.site_update_notes
set status='published', planned=false, pinned=true,
    summary='Public yayın öncesi stabilite tamamlandı. Ana sayfa, oyun arşivi, seriler, koleksiyonlar, siteden izleme, rehberler, bakım modu ve boş ekran koruması kontrol edildi. /status site durum sayfası eklendi.',
    updated_at=now()
where version='v2.1.2' and title='Public Yayın Öncesi Stabilite';

insert into public.site_update_notes(version,title,summary,status,pinned,planned,sort_order)
select 'v2.1.2','Public Yayın Öncesi Stabilite','Public yayın öncesi stabilite tamamlandı. Ana sayfa, oyun arşivi, seriler, koleksiyonlar, siteden izleme, rehberler, bakım modu ve boş ekran koruması kontrol edildi. /status site durum sayfası eklendi.','published',true,false,1
where not exists (select 1 from public.site_update_notes where version='v2.1.2' and title='Public Yayın Öncesi Stabilite');

insert into public.site_update_notes(version,title,summary,status,pinned,planned,sort_order)
select 'v2.1.3','Supabase Veri Fix ve Admin Güçlendirme','Sıradaki adımda Supabase veri eşitleme, admin kayıtları, yetki kontrolleri ve yönetim paneli veri durumu güçlendirilecek.','planned',false,true,2
where not exists (select 1 from public.site_update_notes where version='v2.1.3' and title='Supabase Veri Fix ve Admin Güçlendirme');

insert into public.site_status_logs(status,scope,message,details) values
('ok','version','v2.1.2 Public Yayın Öncesi Stabilite tamamlandı.', jsonb_build_object('version','v2.1.2','schema_mode','safe-no-reset','reset',false,'schema_required',true)),
('ok','schema','v2.1.2 güvenli schema çalıştırıldı. Mevcut veriler sıfırlanmadı; sadece status, sürüm ve güncelleme notları güncellendi.', jsonb_build_object('version','v2.1.2','drop_tables',false,'new_tables',jsonb_build_array(),'new_columns',jsonb_build_array()));
