-- Hayatımız Oyun v2.1.9 - Profesyonel Yönetim Merkezi ve Takvim Sistemi
-- Mevcut verileri silmeden çalıştırılacak güvenli schema dosyası.

-- Hayatımız Oyun v2.1.2 FIX - Supabase Yetki Tablosu
-- GÜNCELLEME TİPİ: GÜVENLİ / SIFIRLAMAZ
-- Bu schema.sql tablo DROP yapmaz, mevcut verileri silmez.
-- Bu FIX, Supabase Table Editor veya SQL Editor üzerinden yetki verme altyapısını ekler.

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

-- v2.1.2 FIX - Supabase Yetki Tablosu ve SQL'den Yetki Verme
-- GÜVENLİ / SIFIRLAMAZ: DROP TABLE yoktur, mevcut kullanıcıları silmez.
-- Amaç: Supabase Table Editor veya SQL Editor üzerinden kullanıcıya Kurucu / Moderatör / İçerik Editörü / Üye / Banlı yetkisi verilebilmesi.

create or replace function public.normalize_site_role(input_role text)
returns text as $$
declare
  raw text := lower(trim(coalesce(input_role, 'user')));
begin
  raw := replace(raw, 'ı', 'i');
  raw := replace(raw, 'İ', 'i');
  raw := replace(raw, 'ö', 'o');
  raw := replace(raw, 'ü', 'u');
  raw := replace(raw, 'ğ', 'g');
  raw := replace(raw, 'ş', 's');
  raw := replace(raw, 'ç', 'c');

  if raw in ('kurucu','owner','founder','sahip','admin') then return 'kurucu'; end if;
  if raw in ('yonetici','yönetici','administrator') then return 'yonetici'; end if;
  if raw in ('moderator','moderatoru','mod','moderatör','moderator') then return 'moderator'; end if;
  if raw in ('editor','editoru','editör','icerik editoru','icerik_editoru','içerik editörü','content_editor') then return 'editor'; end if;
  if raw in ('banli','banlı','banned','yasakli','yasaklı') then return 'banned'; end if;
  return 'user';
end;
$$ language plpgsql immutable;

create or replace function public.site_role_label_tr(input_role text)
returns text as $$
declare
  r text := public.normalize_site_role(input_role);
begin
  if r = 'kurucu' then return '👑 Kurucu'; end if;
  if r = 'yonetici' then return '🛡️ Yönetici'; end if;
  if r = 'moderator' then return '🛡️ Moderatör'; end if;
  if r = 'editor' then return '✍️ İçerik Editörü'; end if;
  if r = 'banned' then return '🚫 Banlı'; end if;
  return '👤 Üye';
end;
$$ language plpgsql immutable;

create table if not exists public.site_role_definitions (
  role_code text primary key,
  role_label_tr text not null,
  emoji text not null default '',
  description text,
  can_access_admin boolean not null default false,
  can_manage_users boolean not null default false,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.site_role_definitions add column if not exists role_label_tr text;
alter table public.site_role_definitions add column if not exists emoji text not null default '';
alter table public.site_role_definitions add column if not exists description text;
alter table public.site_role_definitions add column if not exists can_access_admin boolean not null default false;
alter table public.site_role_definitions add column if not exists can_manage_users boolean not null default false;
alter table public.site_role_definitions add column if not exists sort_order integer not null default 0;
alter table public.site_role_definitions add column if not exists is_active boolean not null default true;
alter table public.site_role_definitions add column if not exists created_at timestamptz not null default now();
alter table public.site_role_definitions add column if not exists updated_at timestamptz not null default now();
drop trigger if exists trg_site_role_definitions_updated_at on public.site_role_definitions;
create trigger trg_site_role_definitions_updated_at before update on public.site_role_definitions for each row execute function public.set_updated_at();

insert into public.site_role_definitions(role_code, role_label_tr, emoji, description, can_access_admin, can_manage_users, sort_order, is_active) values
('kurucu','👑 Kurucu','👑','Tüm site, kullanıcı, yetki, oyun, not, takvim ve bakım ayarlarını yönetebilir.',true,true,1,true),
('yonetici','🛡️ Yönetici','🛡️','Kurucuya yakın yönetim yetkisi; içerik ve site yönetiminde kullanılabilir.',true,true,2,true),
('moderator','🛡️ Moderatör','🛡️','İçerik kontrolü, oyun/seri düzeni ve temel yönetim alanlarına erişebilir.',true,false,3,true),
('editor','✍️ İçerik Editörü','✍️','Oyun, seri, bölüm, kapak, hikaye ve yayın içeriklerini düzenleyebilir.',true,false,4,true),
('user','👤 Üye','👤','Normal kullanıcıdır; public siteyi kullanır, yönetim paneline giremez.',false,false,5,true),
('banned','🚫 Banlı','🚫','Siteye giriş ve yönetim erişimi kapatılmış kullanıcıdır.',false,false,6,true)
on conflict (role_code) do update set
  role_label_tr=excluded.role_label_tr,
  emoji=excluded.emoji,
  description=excluded.description,
  can_access_admin=excluded.can_access_admin,
  can_manage_users=excluded.can_manage_users,
  sort_order=excluded.sort_order,
  is_active=excluded.is_active,
  updated_at=now();

create table if not exists public.site_authority_assignments (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  display_name text,
  role_code text not null default 'user',
  role_label_tr text,
  is_active boolean not null default true,
  note text,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.site_authority_assignments add column if not exists display_name text;
alter table public.site_authority_assignments add column if not exists role_code text not null default 'user';
alter table public.site_authority_assignments add column if not exists role_label_tr text;
alter table public.site_authority_assignments add column if not exists is_active boolean not null default true;
alter table public.site_authority_assignments add column if not exists note text;
alter table public.site_authority_assignments add column if not exists created_by text;
alter table public.site_authority_assignments add column if not exists created_at timestamptz not null default now();
alter table public.site_authority_assignments add column if not exists updated_at timestamptz not null default now();
create index if not exists site_authority_assignments_email_idx on public.site_authority_assignments(lower(email));
create index if not exists site_authority_assignments_role_idx on public.site_authority_assignments(role_code, is_active);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'site_authority_assignments_role_code_check'
  ) then
    alter table public.site_authority_assignments
      add constraint site_authority_assignments_role_code_check
      check (public.normalize_site_role(role_code) in ('kurucu','yonetici','moderator','editor','user','banned'));
  end if;
end $$;

create or replace function public.sync_site_authority_assignment()
returns trigger as $$
declare
  normalized_role text;
  clean_email text;
  clean_name text;
begin
  clean_email := lower(trim(new.email));
  normalized_role := public.normalize_site_role(new.role_code);
  clean_name := nullif(trim(coalesce(new.display_name, split_part(clean_email, '@', 1))), '');

  new.email := clean_email;
  new.role_code := normalized_role;
  new.role_label_tr := public.site_role_label_tr(normalized_role);
  if normalized_role = 'banned' then
    new.is_active := false;
  end if;
  new.updated_at := now();

  insert into public.site_users(email, display_name, full_name, role, is_active, banned_at, ban_reason, created_at, updated_at)
  values (
    clean_email,
    clean_name,
    clean_name,
    normalized_role,
    case when normalized_role = 'banned' then false else coalesce(new.is_active,true) end,
    case when normalized_role = 'banned' then now() else null end,
    case when normalized_role = 'banned' then coalesce(new.note,'Supabase yetki tablosundan banlandı') else null end,
    now(),
    now()
  )
  on conflict (email) do update set
    display_name = coalesce(excluded.display_name, public.site_users.display_name),
    full_name = coalesce(excluded.full_name, public.site_users.full_name),
    role = excluded.role,
    is_active = excluded.is_active,
    banned_at = excluded.banned_at,
    ban_reason = excluded.ban_reason,
    updated_at = now();

  if normalized_role in ('kurucu','yonetici','moderator','editor') and coalesce(new.is_active,true) then
    insert into public.site_admin_profiles(email, display_name, role, can_manage_games, can_manage_updates, can_manage_calendar, can_manage_settings, is_active, created_at, updated_at)
    values (
      clean_email,
      clean_name,
      normalized_role,
      true,
      true,
      true,
      normalized_role in ('kurucu','yonetici'),
      true,
      now(),
      now()
    )
    on conflict (email) do update set
      display_name = coalesce(excluded.display_name, public.site_admin_profiles.display_name),
      role = excluded.role,
      can_manage_games = excluded.can_manage_games,
      can_manage_updates = excluded.can_manage_updates,
      can_manage_calendar = excluded.can_manage_calendar,
      can_manage_settings = excluded.can_manage_settings,
      is_active = true,
      updated_at = now();
  else
    update public.site_admin_profiles
    set is_active = false,
        role = normalized_role,
        updated_at = now()
    where lower(email) = clean_email;
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_site_authority_assignment_sync on public.site_authority_assignments;
create trigger trg_site_authority_assignment_sync
before insert or update on public.site_authority_assignments
for each row execute function public.sync_site_authority_assignment();

create or replace function public.sync_site_admin_profile_to_user()
returns trigger as $$
declare
  normalized_role text;
  clean_email text;
  clean_name text;
begin
  clean_email := lower(trim(new.email));
  normalized_role := public.normalize_site_role(new.role);
  clean_name := nullif(trim(coalesce(new.display_name, split_part(clean_email, '@', 1))), '');
  new.email := clean_email;
  new.role := normalized_role;
  new.updated_at := now();

  insert into public.site_users(email, display_name, full_name, role, is_active, created_at, updated_at)
  values (clean_email, clean_name, clean_name, normalized_role, coalesce(new.is_active,true), now(), now())
  on conflict (email) do update set
    display_name = coalesce(excluded.display_name, public.site_users.display_name),
    full_name = coalesce(excluded.full_name, public.site_users.full_name),
    role = excluded.role,
    is_active = excluded.is_active,
    updated_at = now();

  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_site_admin_profile_sync_to_user on public.site_admin_profiles;
create trigger trg_site_admin_profile_sync_to_user
before insert or update on public.site_admin_profiles
for each row execute function public.sync_site_admin_profile_to_user();

create or replace function public.set_site_user_role(
  p_email text,
  p_role text,
  p_display_name text default null,
  p_note text default 'SQL Editor üzerinden yetki verildi',
  p_created_by text default 'supabase-sql-editor'
)
returns table(email text, role_code text, role_label_tr text, is_active boolean) as $$
declare
  clean_email text := lower(trim(p_email));
  normalized_role text := public.normalize_site_role(p_role);
begin
  if clean_email = '' then
    raise exception 'E-posta boş olamaz.';
  end if;

  insert into public.site_authority_assignments(email, display_name, role_code, is_active, note, created_by, updated_at)
  values (
    clean_email,
    coalesce(nullif(trim(p_display_name), ''), split_part(clean_email, '@', 1)),
    normalized_role,
    normalized_role <> 'banned',
    p_note,
    p_created_by,
    now()
  )
  on conflict (email) do update set
    display_name = coalesce(excluded.display_name, public.site_authority_assignments.display_name),
    role_code = excluded.role_code,
    is_active = excluded.is_active,
    note = excluded.note,
    created_by = excluded.created_by,
    updated_at = now();

  return query
  select a.email, a.role_code, a.role_label_tr, a.is_active
  from public.site_authority_assignments a
  where a.email = clean_email;
end;
$$ language plpgsql;

-- FIX: Mevcut view kolon isimleri eskiyse CREATE OR REPLACE hata verir.
-- Bu yüzden sadece view silinir; tablo/veri silinmez.
drop view if exists public.site_authority_panel;
create or replace view public.site_authority_panel as
select
  a.email,
  coalesce(a.display_name, u.full_name, u.display_name, split_part(a.email,'@',1)) as display_name,
  a.role_code,
  a.role_label_tr,
  a.is_active,
  r.can_access_admin,
  r.can_manage_users,
  a.note,
  a.created_by,
  a.updated_at
from public.site_authority_assignments a
left join public.site_users u on lower(u.email) = lower(a.email)
left join public.site_role_definitions r on r.role_code = a.role_code
order by r.sort_order asc, a.updated_at desc;

insert into public.site_authority_assignments(email, display_name, role_code, is_active, note, created_by)
values
('mertdundaroyunda@gmail.com', 'Hayatımız Oyun Kurucu', 'kurucu', true, 'Varsayılan kurucu hesap', 'schema-v2.1.2-fix'),
('mertdundar05@outlook.com', 'Mevlut Mert Dundar', 'kurucu', true, 'Varsayılan kurucu hesap', 'schema-v2.1.2-fix')
on conflict (email) do update set
  role_code = 'kurucu',
  role_label_tr = public.site_role_label_tr('kurucu'),
  is_active = true,
  note = excluded.note,
  updated_at = now();

-- Hızlı SQL örnekleri:
-- select * from public.set_site_user_role('ornek@mail.com','moderator','Yetkili Adı');
-- select * from public.set_site_user_role('editor@mail.com','editor','İçerik Editörü');
-- select * from public.set_site_user_role('uye@mail.com','user','Normal Üye');
-- select * from public.set_site_user_role('banli@mail.com','banned','Banlı Kullanıcı');

insert into public.site_runtime_config(key,value) values
('schema_version', jsonb_build_object('version','v2.1.2 FIX','note','Supabase üzerinden yetki verme tablosu ve SQL fonksiyonu eklendi','updated_at',now(),'schema_mode','safe-no-reset','drop_tables',false,'schema_required',true)),
('authority_schema', jsonb_build_object('version','v2.1.2 FIX','table','site_authority_assignments','helper_function','set_site_user_role','roles',jsonb_build_array('kurucu','yonetici','moderator','editor','user','banned'),'updated_at',now()))
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into public.site_update_notes(version,title,summary,status,pinned,planned,sort_order)
select 'v2.1.2 FIX','Supabase Yetki Tablosu ve SQL Yetki Verme Fix','Yeni sürüm yapılmadan schema.sql güvenli güncellendi. Supabase Table Editor üzerinden site_authority_assignments tablosuna e-posta ve rol girerek ya da SQL Editor içinde set_site_user_role fonksiyonunu kullanarak Kurucu, Moderatör, İçerik Editörü, Üye ve Banlı yetkisi verilebilir. DROP TABLE yoktur, mevcut veriler silinmez.','published',true,false,0
where not exists (select 1 from public.site_update_notes where version='v2.1.2 FIX' and title='Supabase Yetki Tablosu ve SQL Yetki Verme Fix');

insert into public.site_status_logs(status,scope,message,details) values
('ok','schema','v2.1.2 FIX güvenli schema çalıştırıldı. Supabase üzerinden yetki verme tablosu, rol sözlüğü ve SQL helper fonksiyonu eklendi; mevcut veriler silinmedi.', jsonb_build_object('version','v2.1.2 FIX','drop_tables',false,'schema_required',true,'new_tables',jsonb_build_array('site_role_definitions','site_authority_assignments'),'new_functions',jsonb_build_array('set_site_user_role','normalize_site_role','site_role_label_tr')));


-- =========================================================
-- v2.1.3 - Supabase Veri Fix ve Admin Güçlendirme
-- Güvenli schema güncellemesi: DROP TABLE yok, mevcut veriler silinmez.
-- =========================================================

create table if not exists public.site_sync_audit_logs (
  id uuid primary key default gen_random_uuid(),
  scope text not null default 'general',
  action text not null default 'sync',
  status text not null default 'ok',
  actor_email text,
  message text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_site_sync_audit_logs_scope_created on public.site_sync_audit_logs(scope, created_at desc);

-- FIX: View kolon yapısı değişirse Supabase/Postgres güvenli yeniden oluşturma.
drop view if exists public.site_admin_data_health;
create or replace view public.site_admin_data_health as
select
  (select count(*) from public.games) as games_count,
  (select count(*) from public.site_users) as users_count,
  (select count(*) from public.site_calendar_events) as calendar_events_count,
  (select count(*) from public.site_update_notes) as update_notes_count,
  coalesce((select value->>'enabled' from public.site_runtime_config where key='maintenance_mode' limit 1),'false') as maintenance_enabled,
  coalesce((select value->>'version' from public.site_runtime_config where key='schema_version' limit 1),'v2.1.3') as schema_version,
  now() as checked_at;

create or replace function public.set_site_user_role(
  p_email text,
  p_role text,
  p_display_name text default null,
  p_note text default 'SQL Editor üzerinden yetki verildi',
  p_created_by text default 'supabase-sql-editor'
)
returns table(email text, role_code text, role_label_tr text, is_active boolean) as $$
declare
  clean_email text := lower(trim(p_email));
  normalized_role text := public.normalize_site_role(p_role);
begin
  if clean_email = '' then
    raise exception 'E-posta boş olamaz.';
  end if;

  insert into public.site_users(email, display_name, full_name, role, is_active, created_at, updated_at)
  values (
    clean_email,
    coalesce(nullif(trim(p_display_name), ''), split_part(clean_email, '@', 1)),
    coalesce(nullif(trim(p_display_name), ''), split_part(clean_email, '@', 1)),
    normalized_role,
    normalized_role <> 'banned',
    now(),
    now()
  )
  on conflict (email) do update set
    display_name = coalesce(excluded.display_name, public.site_users.display_name),
    full_name = coalesce(excluded.full_name, public.site_users.full_name),
    role = excluded.role,
    is_active = excluded.is_active,
    banned_at = case when excluded.role = 'banned' then now() else null end,
    updated_at = now();

  insert into public.site_authority_assignments(email, display_name, role_code, is_active, note, created_by, updated_at)
  values (
    clean_email,
    coalesce(nullif(trim(p_display_name), ''), split_part(clean_email, '@', 1)),
    normalized_role,
    normalized_role <> 'banned',
    p_note,
    p_created_by,
    now()
  )
  on conflict (email) do update set
    display_name = coalesce(excluded.display_name, public.site_authority_assignments.display_name),
    role_code = excluded.role_code,
    role_label_tr = public.site_role_label_tr(excluded.role_code),
    is_active = excluded.is_active,
    note = excluded.note,
    created_by = excluded.created_by,
    updated_at = now();

  insert into public.site_sync_audit_logs(scope, action, status, actor_email, message, details)
  values ('authority', 'set_site_user_role', 'ok', clean_email, 'v2.1.3 SQL yetki verme işlemi uygulandı.', jsonb_build_object('role', normalized_role, 'display_name', p_display_name));

  return query
  select a.email, a.role_code, a.role_label_tr, a.is_active
  from public.site_authority_assignments a
  where a.email = clean_email;
end;
$$ language plpgsql;

insert into public.site_runtime_config(key,value) values
('schema_version', jsonb_build_object('version','v2.1.3','note','Supabase veri fix ve admin güçlendirme güvenli schema güncellemesi','updated_at',now(),'schema_mode','safe-no-reset','drop_tables',false,'schema_required',true)),
('admin_data_health', jsonb_build_object('version','v2.1.3','view','site_admin_data_health','audit_table','site_sync_audit_logs','updated_at',now()))
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into public.site_update_notes(version,title,summary,status,pinned,planned,sort_order)
select 'v2.1.3','Supabase Veri Fix ve Admin Güçlendirme','Supabase oyun ekle/düzenle/sil, kullanıcı yetkileri, admin veri sağlığı ve güvenli yenileme akışı güçlendirildi. Schema güvenli modda güncellendi; DROP TABLE yoktur, mevcut veriler silinmez.','published',true,false,0
where not exists (select 1 from public.site_update_notes where version='v2.1.3' and title='Supabase Veri Fix ve Admin Güçlendirme');

insert into public.site_status_logs(status,scope,message,details) values
('ok','schema','v2.1.3 güvenli schema çalıştırıldı. Supabase veri sağlığı görünümü, audit log tablosu ve yetki verme fonksiyonu güçlendirildi; mevcut veriler silinmedi.', jsonb_build_object('version','v2.1.3','drop_tables',false,'schema_required',true,'new_tables',jsonb_build_array('site_sync_audit_logs'),'new_views',jsonb_build_array('site_admin_data_health')));


-- =========================================================
-- v2.1.4 - Profesyonel Ana Sayfa Final Cila
-- Güvenli schema güncellemesi: DROP TABLE yok, mevcut veriler silinmez.
-- =========================================================

insert into public.site_runtime_config(key,value) values
('schema_version', jsonb_build_object('version','v2.1.4','note','Profesyonel ana sayfa final cila güvenli schema güncellemesi','updated_at',now(),'schema_mode','safe-no-reset','drop_tables',false,'schema_required',true)),
('public_homepage_status', jsonb_build_object('version','v2.1.4','homepage','professional-final-polish','updated_at',now()))
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into public.site_update_notes(version,title,summary,status,pinned,planned,sort_order)
select 'v2.1.4','Profesyonel Ana Sayfa Final Cila','Ana sayfa yayıncı/video arşivi havasına daha yakın hale getirildi. Büyük sinematik hero, akıllı arama, öne çıkan oyun, devam eden seriler, son eklenenler, hızlı erişimler ve yayın öncesi güven panelleri daha profesyonel yerleşime alındı.','published',true,false,0
where not exists (select 1 from public.site_update_notes where version='v2.1.4' and title='Profesyonel Ana Sayfa Final Cila');

insert into public.site_status_logs(status,scope,message,details) values
('ok','schema','v2.1.4 güvenli schema çalıştırıldı. Profesyonel ana sayfa final cila status ve güncelleme notu eklendi; mevcut veriler silinmedi.', jsonb_build_object('version','v2.1.4','drop_tables',false,'schema_required',true,'new_tables',jsonb_build_array(),'new_columns',jsonb_build_array()));


-- =========================================================
-- v2.1.5 - Oyun Detay ve Siteden İzleme Geliştirme
-- Güvenli schema güncellemesi: DROP TABLE yok, mevcut veriler silinmez.
-- Yeni tablo/kolon eklemez; status ve güncelleme notunu günceller.
-- =========================================================

insert into public.site_runtime_config(key,value) values
('schema_version', jsonb_build_object('version','v2.1.5','note','Oyun detay ve siteden izleme geliştirme güvenli schema güncellemesi','updated_at',now(),'schema_mode','safe-no-reset','drop_tables',false,'schema_required',true)),
('watch_detail_status', jsonb_build_object('version','v2.1.5','game_detail_page','/oyun-detay?id=...','watch_page','/izle?id=...','updated_at',now()))
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into public.site_update_notes(version,title,summary,status,pinned,planned,sort_order)
select 'v2.1.5','Oyun Detay ve Siteden İzleme Geliştirme','Oyun detay sayfası profesyonel kapak/banner, hikaye, bölüm ilerlemesi, etiketler ve izleme bağlantılarıyla güçlendirildi. Siteden izleme ekranına sıradaki bölüm, güvenli oynatıcı uyarısı ve izleme ilerlemesi eklendi.','published',true,false,0
where not exists (select 1 from public.site_update_notes where version='v2.1.5' and title='Oyun Detay ve Siteden İzleme Geliştirme');

insert into public.site_status_logs(status,scope,message,details) values
('ok','schema','v2.1.5 güvenli schema çalıştırıldı. Oyun detay ve siteden izleme status/güncelleme notu eklendi; mevcut veriler silinmedi.', jsonb_build_object('version','v2.1.5','drop_tables',false,'schema_required',true,'new_tables',jsonb_build_array(),'new_columns',jsonb_build_array()));


-- =========================================================
-- v2.1.5 FIX - Seri Adı ve Bakım Modu Kesin Düzeltme
-- Güvenli schema güncellemesi: DROP TABLE yok, mevcut veriler silinmez.
-- A Plague Tale kayıtlarında yanlışlıkla Avatar serisi yazıldıysa düzeltir.
-- =========================================================

update public.games
set
  series_name = 'A Plague Tale',
  series_slug = 'a-plague-tale',
  collection_name = case
    when collection_name is null or trim(collection_name) = '' or lower(collection_name) like '%avatar%' then 'A Plague Tale'
    else collection_name
  end,
  updated_at = now()
where
  lower(coalesce(title,'')) like '%plague%tale%'
  or lower(coalesce(slug,'')) like '%plague-tale%'
  or lower(coalesce(rawg_slug,'')) like '%plague-tale%'
  or lower(coalesce(title,'')) like '%innocence%';

insert into public.site_runtime_config(key,value) values
('series_maintenance_fix_status', jsonb_build_object('version','v2.1.5 FIX','series_fix','A Plague Tale kayıtları Avatar serisine bağlanmayacak şekilde düzeltildi.','maintenance_fix','Bakım modu Supabase yenileme sırasında eski kapalı/açık değerle ezilmeyecek.','updated_at',now(),'schema_mode','safe-no-reset','drop_tables',false,'schema_required',true))
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into public.site_update_notes(version,title,summary,status,pinned,planned,sort_order)
select 'v2.1.5 FIX','Seri Adı ve Bakım Modu Kesin Fix','A Plague Tale: Innocence gibi oyunlarda Supabase/RAWG tarafından gelen yanlış Avatar seri eşleşmesi temizlendi. Bakım modu açıldığında Supabase yenileme eski kapalı değerle bakım modunu kapatmayacak şekilde güçlendirildi.','published',true,false,0
where not exists (select 1 from public.site_update_notes where version='v2.1.5 FIX' and title='Seri Adı ve Bakım Modu Kesin Fix');

insert into public.site_status_logs(status,scope,message,details) values
('ok','fix','v2.1.5 FIX çalıştırıldı. A Plague Tale seri adı düzeltildi ve bakım modu yenileme davranışı güvene alındı.', jsonb_build_object('version','v2.1.5 FIX','drop_tables',false,'schema_required',true,'data_fix','a-plague-tale-series'));

-- =========================================================
-- v2.1.6 - Seri Yönetimi Gelişmiş Sıralama
-- Güvenli schema güncellemesi: DROP TABLE yok, mevcut veriler silinmez.
-- Yeni tablo/kolon eklemez; status ve güncelleme notunu günceller.
-- =========================================================

insert into public.site_runtime_config(key,value) values
('schema_version', jsonb_build_object('version','v2.1.6','note','Seri yönetimi gelişmiş sıralama güvenli schema güncellemesi','updated_at',now(),'schema_mode','safe-no-reset','drop_tables',false,'schema_required',true)),
('series_management_status', jsonb_build_object('version','v2.1.6','manager_page','/yonetim/seriler','public_series_page','/seriler','watch_series','/izle?series=...','features',jsonb_build_array('oyun seçme/çıkarma','sürükle-bırak sıralama','sayı ile sıralama','hızlı A-Z/bölüm/durum/tarih sıralama','Supabase kalıcı kayıt'),'updated_at',now()))
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into public.site_update_notes(version,title,summary,status,pinned,planned,sort_order)
select 'v2.1.6','Seri Yönetimi Gelişmiş Sıralama','Seri yönetimi ekranı profesyonelleştirildi. Seri içindeki oyunları seçme/çıkarma, sürükle-bırak, sayı ile düzenleme, hızlı A-Z/bölüm/durum/tarih sıralama, seri sırası önizleme ve Supabase kalıcı kayıt akışı güçlendirildi.','published',true,false,0
where not exists (select 1 from public.site_update_notes where version='v2.1.6' and title='Seri Yönetimi Gelişmiş Sıralama');

insert into public.site_status_logs(status,scope,message,details) values
('ok','schema','v2.1.6 güvenli schema çalıştırıldı. Seri yönetimi gelişmiş sıralama status/güncelleme notu eklendi; mevcut veriler silinmedi.', jsonb_build_object('version','v2.1.6','drop_tables',false,'schema_required',true,'new_tables',jsonb_build_array(),'new_columns',jsonb_build_array(),'series_fields',jsonb_build_array('games.series_name','games.series_order','games.sort_order','games.collection_name')));

-- =========================================================
-- v2.1.7 - Kullanıcı Profili ve İzleme Geçmişi
-- Güvenli schema güncellemesi: DROP TABLE yok, mevcut veriler silinmez.
-- Yeni izleme geçmişi tablosu ekler ve status/güncelleme notunu günceller.
-- =========================================================

create table if not exists public.site_user_watch_history (
  id uuid primary key default gen_random_uuid(),
  user_email text not null default 'ziyaretci',
  display_name text,
  game_id text not null,
  game_title text not null,
  series_name text,
  episode_number integer default 0,
  episode_title text,
  watched_episode_count integer default 0,
  total_episodes integer default 0,
  progress integer default 0,
  source text default 'site',
  metadata jsonb default '{}'::jsonb,
  watched_at timestamptz default now(),
  created_at timestamptz default now()
);

create index if not exists idx_site_user_watch_history_email on public.site_user_watch_history(user_email);
create index if not exists idx_site_user_watch_history_game on public.site_user_watch_history(game_id);
create index if not exists idx_site_user_watch_history_watched_at on public.site_user_watch_history(watched_at desc);

insert into public.site_runtime_config(key,value) values
('schema_version', jsonb_build_object('version','v2.1.7','note','Kullanıcı profili ve izleme geçmişi güvenli schema güncellemesi','updated_at',now(),'schema_mode','safe-no-reset','drop_tables',false,'schema_required',true)),
('profile_watch_history_status', jsonb_build_object('version','v2.1.7','profile_page','/hesabim','watch_history_table','site_user_watch_history','features',jsonb_build_array('profil özeti','devam et kartları','son izlenenler','yerel ve Supabase izleme geçmişi'),'updated_at',now()))
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into public.site_update_notes(version,title,summary,status,pinned,planned,sort_order)
select 'v2.1.7','Kullanıcı Profili ve İzleme Geçmişi','Profil sayfası profesyonel hale getirildi. Kullanıcı adı, rol, kayıt tarihi, izleme özeti, devam et kartları, son izlenenler ve güvenli izleme geçmişi altyapısı eklendi.','published',true,false,0
where not exists (select 1 from public.site_update_notes where version='v2.1.7' and title='Kullanıcı Profili ve İzleme Geçmişi');

insert into public.site_status_logs(status,scope,message,details) values
('ok','schema','v2.1.7 güvenli schema çalıştırıldı. Kullanıcı profili ve izleme geçmişi tablosu eklendi; mevcut veriler silinmedi.', jsonb_build_object('version','v2.1.7','drop_tables',false,'schema_required',true,'new_tables',jsonb_build_array('site_user_watch_history'),'new_columns',jsonb_build_array()));

-- =========================================================
-- v2.1.8 - Yetki Paneli ve Kullanıcı Yönetimi
-- Güvenli schema güncellemesi: DROP TABLE yok, mevcut veriler silinmez.
-- Kullanıcı rol değişiklikleri için audit tablosu ekler ve status/güncelleme notunu günceller.
-- =========================================================

create table if not exists public.site_user_role_audit (
  id uuid primary key default gen_random_uuid(),
  target_email text not null,
  previous_role text,
  new_role text not null,
  changed_by text,
  source text default 'yonetim-paneli',
  note text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_site_user_role_audit_target_email on public.site_user_role_audit(lower(target_email));
create index if not exists idx_site_user_role_audit_created_at on public.site_user_role_audit(created_at desc);

insert into public.site_runtime_config(key,value) values
('schema_version', jsonb_build_object('version','v2.1.8','note','Yetki paneli ve kullanıcı yönetimi güvenli schema güncellemesi','updated_at',now(),'schema_mode','safe-no-reset','drop_tables',false,'schema_required',true)),
('authority_panel_status', jsonb_build_object('version','v2.1.8','page','/yonetim/kullanicilar','roles',jsonb_build_array('Kurucu','Moderatör','İçerik Editörü','Üye','Banlı'),'audit_table','site_user_role_audit','updated_at',now()))
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into public.site_update_notes(version,title,summary,status,pinned,planned,sort_order)
select 'v2.1.8','Yetki Paneli ve Kullanıcı Yönetimi','Kullanıcılar ve Yetkiler ekranı profesyonel hale getirildi. Kayıtlı kullanıcılar, Supabase yetki kayıtları, rol özetleri, arama/filtreleme, Türkçe rol seçimi, kullanıcı ekleme ve yetki kaydetme akışı güçlendirildi.','published',true,false,0
where not exists (select 1 from public.site_update_notes where version='v2.1.8' and title='Yetki Paneli ve Kullanıcı Yönetimi');

insert into public.site_status_logs(status,scope,message,details) values
('ok','schema','v2.1.8 güvenli schema çalıştırıldı. Yetki paneli, kullanıcı yönetimi ve rol audit altyapısı güncellendi; mevcut veriler silinmedi.', jsonb_build_object('version','v2.1.8','drop_tables',false,'schema_required',true,'new_tables',jsonb_build_array('site_user_role_audit'),'roles',jsonb_build_array('kurucu','moderator','editor','user','banned')));


-- =========================================================
-- v2.1.8 FIX - Kullanıcı ve Yetki Tabloları Temiz Sıfırlama
-- GÜNCELLEME TİPİ: GÜVENLİ / TABLO DROP YOK
-- Bu FIX tablo silmez. Sadece kullanıcı/yetki kayıtlarını boşaltır.
-- Oyunlar, seriler, takvim, güncelleme notları ve bakım modu korunur.
-- =========================================================

create table if not exists public.site_reset_audit (
  id uuid primary key default gen_random_uuid(),
  reset_type text not null,
  affected_tables text[] not null default '{}',
  note text,
  created_at timestamptz not null default now()
);

-- =========================================================
-- Eski v2.1.8 kullanıcı/yetki temiz sıfırlama bloğu kaldırıldı.
-- ÖNEMLİ: Bundan sonra schema.sql kullanıcıları, yetkileri, oyunları, bakım modunu veya takvimi silmez.
-- Her yeni sürüm/fix sadece güvenli ALTER TABLE / INSERT ON CONFLICT / UPDATE kullanır.
-- =========================================================

-- =========================================================
-- v2.2.0 - Bakım ekranı, Supabase kalıcılık ve ban güvenliği
-- Güvenli ekleme: mevcut verileri silmez/sıfırlamaz.
-- =========================================================
alter table public.site_users add column if not exists banned_at timestamptz;
alter table public.site_users add column if not exists ban_reason text;
alter table public.site_users add column if not exists last_login_at timestamptz;
alter table public.site_users add column if not exists is_active boolean not null default true;

alter table public.site_runtime_config add column if not exists value jsonb not null default '{}'::jsonb;
alter table public.site_runtime_config add column if not exists updated_at timestamptz not null default now();

insert into public.site_runtime_config(key, value)
values (
  'schema_version',
  jsonb_build_object('version','v2.2.0','note','Bakım ekranı, Supabase kalıcılık ve ban güvenliği','updated_at',now())
)
on conflict (key) do update
set value = excluded.value,
    updated_at = now()
where public.site_runtime_config.key = 'schema_version';

-- ÖNEMLİ: maintenance_mode burada overwrite edilmez.
-- Bakım açık/kapalı değeri sadece yönetim panelinden kaydedilir.

-- =========================================================
-- v2.2.0 FIX - Sürüm / Vercel / Results Etiketi Düzeltmesi
-- GÜVENLİ: Veri silmez, bakım ayarını overwrite etmez.
-- =========================================================
insert into public.site_runtime_config(key, value)
values
(
  'site_version',
  jsonb_build_object(
    'version','v2.2.0',
    'status','Tamamlandı',
    'title','Bakım, Supabase Kalıcılık ve Ban Güvenliği',
    'schema_mode','safe-no-reset',
    'drop_tables',false,
    'schema_required',true,
    'vercel_label','v2.2.0-bakim-supabase-ban-guvenligi',
    'updated_at',now()
  )
),
(
  'schema_version',
  jsonb_build_object(
    'version','v2.2.0',
    'note','Sürüm etiketi, Vercel/GitHub etiketi, Results çıktısı ve Supabase runtime kayıtları v2.2.0 olarak eşitlendi.',
    'schema_mode','safe-no-reset',
    'drop_tables',false,
    'schema_required',true,
    'updated_at',now()
  )
)
on conflict (key) do update
set value = excluded.value,
    updated_at = now();

insert into public.site_update_notes(version,title,summary,status,pinned,planned,sort_order)
select
  'v2.2.0',
  '🛠️ Bakım, Supabase Kalıcılık ve Ban Güvenliği',
  'Bakım modu animasyonlu ziyaretçi ekranına taşındı. Oyun, kullanıcı, yetki, takvim ve bakım kayıtlarında Supabase kalıcılığı güçlendirildi. Banlı kullanıcıların siteye erişimi engellendi. Sürüm/Vercel/Results etiketleri v2.2.0 olarak eşitlendi.',
  'published',true,false,0
where not exists (
  select 1 from public.site_update_notes where version='v2.2.0' and title='🛠️ Bakım, Supabase Kalıcılık ve Ban Güvenliği'
);

insert into public.site_status_logs(status,scope,message,details)
values (
  'ok',
  'release',
  'v2.2.0 sürüm etiketi ve schema Results çıktısı güncellendi. Veri silinmedi.',
  jsonb_build_object('version','v2.2.0','schema_required',true,'drop_tables',false,'vercel_label','v2.2.0-bakim-supabase-ban-guvenligi','maintenance_overwrite',false)
);

select
  '✅ Başarılı'::text as "Durum",
  'v2.2.0'::text as "Sürüm",
  'Bakım, Supabase Kalıcılık ve Ban Güvenliği'::text as "İşlem",
  'Vercel/GitHub etiketi v2.2.0-bakim-supabase-ban-guvenligi olarak güncel.'::text as "Vercel Etiketi",
  'Oyunlar, kullanıcılar, yetkiler, takvim, bakım modu ve güncelleme notları silinmedi/sıfırlanmadı.'::text as "Veri Durumu",
  'Bundan sonraki sürüm/fix paketlerinde siteConfig, schema Results, update-notes, health/status ve commit etiketi aynı sürümü gösterecek.'::text as "Sürüm Kuralı",
  now() as "Çalışma Zamanı";


-- v2.2.1 Results / Sürüm senkronizasyonu
insert into site_runtime_config (key, value, updated_at)
values
  ('site_version', jsonb_build_object('version','v2.2.1','label','Premium Bakım Merkezi ve Sürüm Senkronizasyonu','updated_at',now()), now()),
  ('schema_version', jsonb_build_object('version','v2.2.1','label','Premium Bakım Merkezi ve Sürüm Senkronizasyonu','updated_at',now()), now())
on conflict (key) do update set value = excluded.value, updated_at = excluded.updated_at;

select
  '✅ Başarılı' as "Durum",
  'v2.2.1' as "Sürüm",
  'Premium Bakım Merkezi ve Sürüm Senkronizasyonu' as "İşlem",
  'Bakım/ban/Supabase kayıtları korunur; veriler silinmez.' as "Not";

-- =========================================================
-- v2.2.2 - Supabase Kullanıcı ve Yetki Stabilite Merkezi
-- Bu blok veri silmez. Sadece sürüm/status/results kayıtlarını günceller.
-- =========================================================

insert into public.site_runtime_config (key, value, updated_at)
values
  ('site_version', jsonb_build_object('version','v2.2.2','label','Supabase Kullanıcı ve Yetki Stabilite Merkezi','updated_at',now()), now()),
  ('schema_version', jsonb_build_object('version','v2.2.2','label','Supabase Kullanıcı ve Yetki Stabilite Merkezi','updated_at',now()), now()),
  ('vercel_label', jsonb_build_object('version','v2.2.2','label','v2.2.2-supabase-kullanici-yetki-stabilite','updated_at',now()), now())
on conflict (key) do update
set value = excluded.value,
    updated_at = now();

insert into public.site_update_notes (version, title, summary, status, created_at, updated_at)
select
  'v2.2.2',
  '👥 Supabase Kullanıcı ve Yetki Stabilite Merkezi',
  'Supabase Auth kullanıcı çekme, site_users kayıtları, tek kurucu kilidi, banlı kullanıcı kısıtı ve yetki kayıt senkronizasyonu güçlendirildi.',
  'Tamamlandı',
  now(),
  now()
where not exists (
  select 1 from public.site_update_notes where version='v2.2.2' and title='👥 Supabase Kullanıcı ve Yetki Stabilite Merkezi'
);

insert into public.site_update_notes (version, title, summary, status, created_at, updated_at)
select
  'v2.2.3',
  '🛠️ Bakım Modu Premium Deneyim Geliştirme',
  'Bakım ekranı mesajları, güncelleme notları ve ziyaretçi deneyimi daha sade ve profesyonel hale getirilecek.',
  'Planlandı',
  now(),
  now()
where not exists (
  select 1 from public.site_update_notes where version='v2.2.3' and title='🛠️ Bakım Modu Premium Deneyim Geliştirme'
);

select
  '✅ Başarılı'::text as "Durum",
  'v2.2.2'::text as "Sürüm",
  'Supabase Kullanıcı ve Yetki Stabilite Merkezi'::text as "İşlem",
  'Tek kurucu kilidi ve kullanıcı/yetki senkronizasyonu güçlendirildi.'::text as "Kullanıcı / Yetki",
  'Vercel/GitHub etiketi v2.2.2-supabase-kullanici-yetki-stabilite olarak güncel.'::text as "Vercel Etiketi",
  'Veri silinmez, bakım modu ve kullanıcı kayıtları sıfırlanmaz.'::text as "Koruma";
