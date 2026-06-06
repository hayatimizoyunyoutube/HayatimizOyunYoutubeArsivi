-- Hayatımız Oyun v4.0.1 Temiz Final Schema
-- Güvenlidir: Mevcut verileri silmez. DROP/TRUNCATE yoktur.
-- Amaç: Eksik kolonları eklemek, aktif sürüm/status/schema/maintenance kayıtlarını v4.0.1 yapmak.

create extension if not exists pgcrypto;

create table if not exists public.site_runtime_config (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_update_notes (
  id uuid primary key default gen_random_uuid(),
  version text not null,
  title text not null,
  summary text,
  description text,
  status text not null default 'published',
  pinned boolean not null default false,
  planned boolean not null default false,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  is_planned boolean not null default false,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.site_update_notes add column if not exists summary text;
alter table public.site_update_notes add column if not exists description text;
alter table public.site_update_notes add column if not exists status text not null default 'published';
alter table public.site_update_notes add column if not exists pinned boolean not null default false;
alter table public.site_update_notes add column if not exists planned boolean not null default false;
alter table public.site_update_notes add column if not exists sort_order integer not null default 0;
alter table public.site_update_notes add column if not exists is_published boolean not null default true;
alter table public.site_update_notes add column if not exists is_planned boolean not null default false;
alter table public.site_update_notes add column if not exists image_url text;
alter table public.site_update_notes add column if not exists updated_at timestamptz not null default now();

create table if not exists public.update_notes (
  id uuid primary key default gen_random_uuid(),
  version text not null,
  title text not null,
  summary text,
  description text,
  status text not null default 'published',
  is_published boolean not null default true,
  is_planned boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.update_notes add column if not exists summary text;
alter table public.update_notes add column if not exists description text;
alter table public.update_notes add column if not exists status text not null default 'published';
alter table public.update_notes add column if not exists is_published boolean not null default true;
alter table public.update_notes add column if not exists is_planned boolean not null default false;
alter table public.update_notes add column if not exists sort_order integer not null default 0;
alter table public.update_notes add column if not exists updated_at timestamptz not null default now();

create table if not exists public.site_status_logs (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'ok',
  scope text not null default 'schema',
  message text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.site_users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  display_name text,
  full_name text,
  role text not null default 'user',
  role_code text,
  is_active boolean not null default true,
  banned_at timestamptz,
  ban_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- site_users mevcut eski tablodan gelmişse eksik kolonları güvenli ekle.
alter table public.site_users add column if not exists email text;
alter table public.site_users add column if not exists display_name text;
alter table public.site_users add column if not exists full_name text;
alter table public.site_users add column if not exists role text not null default 'user';
alter table public.site_users add column if not exists role_code text;
alter table public.site_users add column if not exists is_active boolean not null default true;
alter table public.site_users add column if not exists banned_at timestamptz;
alter table public.site_users add column if not exists ban_reason text;
alter table public.site_users add column if not exists created_at timestamptz not null default now();
alter table public.site_users add column if not exists updated_at timestamptz not null default now();

create table if not exists public.games (
  id text primary key,
  title text not null,
  genre text,
  status text,
  series_name text,
  collection_name text,
  cover_url text,
  banner_url text,
  release_date text,
  description text,
  story_text text,
  tags text,
  platforms text,
  episodes jsonb not null default '[]'::jsonb,
  episode_count integer not null default 0,
  watched_episode_count integer not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.games add column if not exists genre text;
alter table public.games add column if not exists status text;
alter table public.games add column if not exists series_name text;
alter table public.games add column if not exists collection_name text;
alter table public.games add column if not exists cover_url text;
alter table public.games add column if not exists banner_url text;
alter table public.games add column if not exists release_date text;
alter table public.games add column if not exists description text;
alter table public.games add column if not exists story_text text;
alter table public.games add column if not exists tags text;
alter table public.games add column if not exists platforms text;
alter table public.games add column if not exists episodes jsonb not null default '[]'::jsonb;
alter table public.games add column if not exists episode_count integer not null default 0;
alter table public.games add column if not exists watched_episode_count integer not null default 0;
alter table public.games add column if not exists sort_order integer not null default 0;
alter table public.games add column if not exists updated_at timestamptz not null default now();

create table if not exists public.site_calendar_events (
  id uuid primary key default gen_random_uuid(),
  title text,
  game_title text,
  series_name text,
  event_date date,
  event_time text,
  cover_url text,
  video_url text,
  event_type text default 'video',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.site_calendar_events add column if not exists game_title text;
alter table public.site_calendar_events add column if not exists series_name text;
alter table public.site_calendar_events add column if not exists cover_url text;
alter table public.site_calendar_events add column if not exists video_url text;
alter table public.site_calendar_events add column if not exists event_type text default 'video';
alter table public.site_calendar_events add column if not exists updated_at timestamptz not null default now();

create table if not exists public.user_favorites (
  id uuid primary key default gen_random_uuid(),
  user_email text,
  target_type text not null default 'game',
  target_id text,
  target_title text,
  created_at timestamptz not null default now()
);

create table if not exists public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_email text,
  achievement_key text,
  title text,
  description text,
  unlocked_at timestamptz not null default now()
);

-- Tek kurucu hesabı güvenli oluştur/güncelle.
-- ON CONFLICT kullanmaz; eski tabloda email unique yoksa bile hata vermez.
do $$
begin
  update public.site_users
  set
    display_name='Hayatımız Oyun Kurucu',
    full_name='Hayatımız Oyun Kurucu',
    role='kurucu',
    role_code='kurucu',
    is_active=true,
    updated_at=now()
  where lower(coalesce(email,''))='mertdundaroyunda@gmail.com';

  if not exists (
    select 1 from public.site_users
    where lower(coalesce(email,''))='mertdundaroyunda@gmail.com'
  ) then
    insert into public.site_users(email, display_name, full_name, role, role_code, is_active, updated_at)
    values ('mertdundaroyunda@gmail.com','Hayatımız Oyun Kurucu','Hayatımız Oyun Kurucu','kurucu','kurucu',true,now());
  end if;
end $$;

-- Açılışta bakım kapalı; site ziyaretçilere açık.
insert into public.site_runtime_config(key,value) values
('site_version', jsonb_build_object('version','v4.0.1','status','Başarılı','title','Ana Açılış Final','vercel_label','v4.0.1-ana-acilis-final','opening_target','v4.0.1','updated_at',now())),
('schema_version', jsonb_build_object('version','v4.0.1','status','Başarılı','note','Temiz final schema çalıştırıldı','schema_required',true,'drop_tables',false,'updated_at',now())),
('maintenance_mode', jsonb_build_object('enabled',false,'message','Hayatımız Oyun yayında.','eta','','percent',100,'adminBypass',true,'updatedBy','v4.0.1-final','updated_at',now()))
on conflict (key) do update set value=excluded.value, updated_at=now();

-- Eski aktif/pinned v2/v3 notlarının bakım/status üstüne çıkmasını engelle.
update public.site_update_notes
set pinned=false, planned=false, status='archived', is_published=false, updated_at=now()
where version ~ '^v[23]\.';

update public.update_notes
set status='archived', is_published=false, is_planned=false, updated_at=now()
where version ~ '^v[23]\.';

-- Güncel v4.0.1 notları
insert into public.site_update_notes(version,title,summary,status,pinned,planned,sort_order,is_published,is_planned,updated_at) values
('v4.0.1','Ana Açılış Final','Site v4.0.1 ana açılışa hazırlandı. Ana sayfa, arşiv, seriler, kategoriler, profil, favoriler, başarımlar, yayın takvimi, yönetim paneli ve bakım/ban güvenliği güncellendi.','published',true,false,1,true,false,now()),
('v4.0.1','Profesyonel Tasarım Finali','Kategori butonları, yönetim paneli menüsü, arşiv kartları, seri görünümü, profil merkezi ve mobil/tablet düzeni profesyonel hale getirildi.','published',true,false,2,true,false,now()),
('v4.0.1','Açılış Sonrası Stabilite','Canlı kullanımdan sonra küçük görünüm, veri ve mobil düzeltmeleri yapılacak.','planned',false,true,10,true,true,now()),
('v4.1.0','Topluluk ve Bildirim Merkezi','Favori serilere yeni bölüm bildirimi, duyuru merkezi ve kullanıcı etkileşimleri geliştirilecek.','planned',false,true,11,true,true,now())
on conflict do nothing;

insert into public.update_notes(version,title,summary,status,is_published,is_planned,sort_order,updated_at) values
('v4.0.1','Ana Açılış Final','Site v4.0.1 ana açılışa hazırlandı.','published',true,false,1,now()),
('v4.0.1','Schema / Status Senkron','Supabase Results, Vercel etiketi, schema ve status v4.0.1 yapıldı.','published',true,false,2,now())
on conflict do nothing;

insert into public.site_status_logs(status,scope,message,details) values
('ok','version','v4.0.1 Ana Açılış Final başarılı.', jsonb_build_object('version','v4.0.1','vercel_label','v4.0.1-ana-acilis-final','opening_target','v4.0.1','schema_required',true,'drop_tables',false)),
('ok','schema','v4.0.1 temiz final schema çalıştırıldı. Mevcut veriler silinmedi.', jsonb_build_object('version','v4.0.1','drop_tables',false,'maintenance_enabled',false));


insert into public.site_status_logs(status,scope,message,details) values
('ok','schema','v4.0.1 site_users.role_code kolon fix uygulandı. Eksik kolonlar güvenli eklendi.', jsonb_build_object('version','v4.0.1','fix','site_users_role_code','drop_tables',false));

-- v4.0.1 Supabase oyun kaydetme kesin kolon/policy fix
alter table public.games add column if not exists slug text;
alter table public.games add column if not exists genre_slug text;
alter table public.games add column if not exists status_slug text;
alter table public.games add column if not exists series_slug text;
alter table public.games add column if not exists rawg_id text;
alter table public.games add column if not exists rawg_slug text;
alter table public.games add column if not exists steam_app_id text;
alter table public.games add column if not exists meta_source text;
alter table public.games add column if not exists meta_checked_at timestamptz;
alter table public.games add column if not exists cover_source text;
alter table public.games add column if not exists playlist_url text;
alter table public.games add column if not exists youtube_playlist_url text;
alter table public.games add column if not exists youtube_playlist_id text;
alter table public.games add column if not exists video_url text;
alter table public.games add column if not exists series_order integer not null default 0;
alter table public.games add column if not exists status_bucket text;
alter table public.games add column if not exists is_featured boolean not null default false;
alter table public.games add column if not exists created_at timestamptz not null default now();

create index if not exists games_slug_idx on public.games(slug);
create index if not exists games_series_name_idx on public.games(series_name);
create index if not exists games_sort_order_idx on public.games(sort_order);

alter table public.games enable row level security;
drop policy if exists games_select_all on public.games;
drop policy if exists games_insert_all on public.games;
drop policy if exists games_update_all on public.games;
drop policy if exists games_delete_all on public.games;
create policy games_select_all on public.games for select using (true);
create policy games_insert_all on public.games for insert with check (true);
create policy games_update_all on public.games for update using (true) with check (true);
create policy games_delete_all on public.games for delete using (true);

insert into public.site_status_logs(status, scope, message, details)
values ('ok','v4.0.1-games-save-fix','v4.0.1 oyun kaydetme Supabase kolon/policy fix uygulandı.', jsonb_build_object('version','v4.0.1','games_insert','enabled','node','20.x'))
on conflict do nothing;


-- v4.0.1 ARRAY/TEXT KESIN FIX
-- Eğer eski kurulumdan tags/platforms text[] kaldıysa, metin kolona çevirir. Veri silmez.
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='games' and column_name='platforms' and data_type='ARRAY') then
    alter table public.games alter column platforms type text using array_to_string(platforms, ', ');
  end if;
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='games' and column_name='tags' and data_type='ARRAY') then
    alter table public.games alter column tags type text using array_to_string(tags, ', ');
  end if;
exception when others then
  raise notice 'array/text conversion skipped: %', sqlerrm;
end $$;

alter table public.games add column if not exists slug text;
alter table public.games add column if not exists status_slug text;
alter table public.games add column if not exists genre_slug text;
alter table public.games add column if not exists series_slug text;
alter table public.games add column if not exists rawg_id text;
alter table public.games add column if not exists rawg_slug text;
alter table public.games add column if not exists steam_app_id text;
alter table public.games add column if not exists meta_source text;
alter table public.games add column if not exists meta_checked_at timestamptz;
alter table public.games add column if not exists cover_source text;
alter table public.games add column if not exists playlist_url text;
alter table public.games add column if not exists youtube_playlist_url text;
alter table public.games add column if not exists youtube_playlist_id text;
alter table public.games add column if not exists video_url text;
alter table public.games add column if not exists series_order integer default 0;
alter table public.games add column if not exists status_bucket text;
alter table public.games add column if not exists is_featured boolean default false;

-- v4.0.1 başarılı schema sonucu
insert into public.admin_activity_logs(action, detail, actor_email)
values ('schema_fix','v4.0.1 oyun kaydetme array/text ve Supabase kayıt fix uygulandı.','mertdundaroyunda@gmail.com')
on conflict do nothing;
