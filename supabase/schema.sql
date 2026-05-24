-- Hayatımız Oyun v2.1.3 Fix-5 Supabase Kurulum Dosyası
-- Bu dosya tekrar çalıştırılabilir. Eski verileri silmez.
-- Supabase SQL Editor içinde komple çalıştır.

create extension if not exists pgcrypto;

create table if not exists public.site_users (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  email text,
  password_hash text,
  password_salt text,
  role text not null default 'user',
  is_active boolean not null default true,
  avatar_url text,
  banned_at timestamptz,
  ban_reason text,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.site_users add column if not exists full_name text;
alter table public.site_users add column if not exists email text;
alter table public.site_users add column if not exists password_hash text;
alter table public.site_users add column if not exists password_salt text;
alter table public.site_users add column if not exists role text not null default 'user';
alter table public.site_users add column if not exists is_active boolean not null default true;
alter table public.site_users add column if not exists avatar_url text;
alter table public.site_users add column if not exists banned_at timestamptz;
alter table public.site_users add column if not exists ban_reason text;
alter table public.site_users add column if not exists last_login_at timestamptz;
alter table public.site_users add column if not exists created_at timestamptz not null default now();
alter table public.site_users add column if not exists updated_at timestamptz not null default now();

update public.site_users set role='yonetici' where lower(coalesce(role,''))='admin';
update public.site_users set role='kurucu' where lower(coalesce(role,'')) in ('owner','founder','sahip');
delete from public.site_users a using public.site_users b where a.ctid < b.ctid and lower(a.email)=lower(b.email) and a.email is not null;
create unique index if not exists site_users_email_unique_idx on public.site_users (lower(email));

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  genre text default 'Genel',
  status text default 'Devam Ediyor',
  episode_count integer default 0,
  score numeric default 0,
  cover_url text,
  release_date text,
  tags text,
  rawg_slug text,
  series_name text,
  playlist_url text,
  description text,
  episode_titles jsonb default '[]'::jsonb,
  favorite_count integer default 0,
  source text default 'manual',
  auto_cover_source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.games add column if not exists genre text default 'Genel';
alter table public.games add column if not exists status text default 'Devam Ediyor';
alter table public.games add column if not exists episode_count integer default 0;
alter table public.games add column if not exists score numeric default 0;
alter table public.games add column if not exists cover_url text;
alter table public.games add column if not exists release_date text;
alter table public.games add column if not exists tags text;
alter table public.games add column if not exists rawg_slug text;
alter table public.games add column if not exists series_name text;
alter table public.games add column if not exists playlist_url text;
alter table public.games add column if not exists description text;
alter table public.games add column if not exists episode_titles jsonb default '[]'::jsonb;
alter table public.games add column if not exists favorite_count integer default 0;
alter table public.games add column if not exists source text default 'manual';
alter table public.games add column if not exists auto_cover_source text;
alter table public.games add column if not exists created_at timestamptz not null default now();
alter table public.games add column if not exists updated_at timestamptz not null default now();
create index if not exists games_title_idx on public.games (title);
create index if not exists games_series_name_idx on public.games (series_name);
create index if not exists games_created_at_idx on public.games (created_at desc);

create table if not exists public.site_features (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  title text,
  description text,
  enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.site_runtime_config (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.site_admin_planner (
  id uuid primary key default gen_random_uuid(),
  group_name text default 'Siteye Gelmesi Gerekenler',
  title text not null,
  status text default 'plan',
  feature_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.site_admin_planner add column if not exists feature_key text;

create table if not exists public.site_admin_notes (
  id uuid primary key default gen_random_uuid(),
  note text not null,
  actor_email text,
  created_at timestamptz not null default now()
);

create table if not exists public.site_update_notes (
  id uuid primary key default gen_random_uuid(),
  version text not null,
  title text not null,
  summary text,
  note text,
  image_url text,
  status text default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists site_update_notes_version_idx on public.site_update_notes (version);
create index if not exists site_update_notes_created_at_idx on public.site_update_notes (created_at desc);

create table if not exists public.site_favorites (
  id uuid primary key default gen_random_uuid(),
  user_email text not null,
  game_id uuid,
  active boolean not null default true,
  updated_at timestamptz not null default now(),
  unique(user_email, game_id)
);

create table if not exists public.game_episodes (
  id uuid primary key default gen_random_uuid(),
  game_id uuid,
  episode_index integer default 0,
  title text,
  source_url text,
  updated_at timestamptz not null default now(),
  unique(game_id, episode_index)
);

insert into public.site_runtime_config (key, value, updated_at)
values ('maintenance', jsonb_build_object('enabled', false, 'message', 'Hayatımız Oyun yayında.'), now())
on conflict (key) do nothing;

insert into public.site_features (key, title, description, enabled, updated_at) values
('admin_games_add_button','Oyunlar sekmesine Oyun Ekle butonu ekle','Oyun ekleme formunu açar.',true,now()),
('auto_cover_fetch','Otomatik kapak resmi çekme sistemini aç','Kapaksız oyunlara kapak önerisi getirir.',true,now()),
('update_notes_editor','Güncelleme notu editörünü Supabase site_update_notes tablosuna bağla','Güncelleme notu ekleme/düzenleme/silme alanını açar.',true,now()),
('profile_photo_upload','Profil fotoğrafı yükleme alanı ekle','Profil fotoğrafı yükleme alanını açar.',true,now()),
('game_auto_meta_fetch','Oyun adından tür, etiket ve açıklama otomatik çekme','Oyun adıyla meta önerisi verir.',true,now()),
('feature_edit_delete','Akıllı özelliklerde düzenleme ve silme sistemi','Özellik düzenleme/silme butonlarını aktif eder.',true,now()),
('game_edit_delete_buttons','Oyunları düzenle ve sil butonlarını aktif et','Oyun kartlarında düzenleme/silme işlemlerini açar.',true,now()),
('missing_cover_warning','Oyun kartında eksik kapak sarı uyarısını otomatik göster','Eksik kapak raporunu gösterir.',true,now()),
('maintenance_message_editor','Bakım modu yazısını panelden düzenleme alanı ekle','Bakım modu mesajını panelden düzenler.',true,now())
on conflict (key) do update set title=excluded.title, description=excluded.description, enabled=excluded.enabled, updated_at=now();

insert into public.site_admin_planner (group_name, title, status, feature_key) values
('Tamamlananlar','Supabase Storage gerçek kapak yükleme', 'tamam', 'auto_cover_fetch'),
('Tamamlananlar','Güncelleme notları düzenleme ve silme', 'tamam', 'update_notes_editor'),
('Tamamlananlar','Profil fotoğrafı yükleme ve profil düzeni', 'tamam', 'profile_photo_upload'),
('Tamamlananlar','Oyun kartı profesyonel görünüm ve eksik meta raporu', 'tamam', 'missing_cover_warning'),
('Planlananlar','v2.1.4 seri detay sayfası ve izle butonu', 'plan', null)
on conflict do nothing;

insert into public.site_update_notes (version, title, summary, note, image_url, status) values
('v2.1.3','Storage + Güncelleme Notları + Seri Fix','Kapak yükleme, güncelleme notları, profil fotoğrafı, eksik meta, seri/alfabetik görünüm ve playlist bölüm yazma sistemi eklendi.','v2.1.3 planındaki maddeler tamamlandı. Bu Fix-5 dosyası boş ekran ve Supabase schema sorununu düzeltir.','previews/hayatimiz-oyun-v213-storage-notes-series-preview.png','published'),
('v2.1.4','Planlanan Sürüm','İzle butonu, seri detay sayfası, gerçek crop koordinatı, profil bucket ayrımı, düzenleme geçmişi geri alma ve toplu meta yenileme planlandı.','Sıradaki sürüm planı hazırlandı.','previews/hayatimiz-oyun-v214-plan-preview.png','published')
on conflict do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
('cover-images','cover-images',true,5242880,array['image/jpeg','image/png','image/webp','image/gif']),
('profile-photos','profile-photos',true,5242880,array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public=excluded.public, file_size_limit=excluded.file_size_limit, allowed_mime_types=excluded.allowed_mime_types;

alter table public.site_users disable row level security;
alter table public.games disable row level security;
alter table public.site_features disable row level security;
alter table public.site_runtime_config disable row level security;
alter table public.site_admin_planner disable row level security;
alter table public.site_admin_notes disable row level security;
alter table public.site_update_notes disable row level security;
alter table public.site_favorites disable row level security;
alter table public.game_episodes disable row level security;

notify pgrst, 'reload schema';
select 'Hayatımız Oyun v2.1.3 Fix-5 schema tamam. Şimdi GitHub temiz yükleme + Vercel redeploy cache kapalı yap.' as status;
