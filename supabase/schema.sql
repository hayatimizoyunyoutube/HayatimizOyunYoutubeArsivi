-- Hayatımız Oyun v2.1.4 tek Supabase schema
-- Bu dosya tekrar çalıştırılabilir şekilde hazırlanmıştır.
-- Önce hata alırsan RUN-FIRST-v214-constraint-cleanup.sql çalıştır veya tam sıfır için 00-TUM-TABLOLARI-SIFIRLA.sql çalıştır.

create extension if not exists pgcrypto;

create table if not exists public.site_users (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  email text,
  password_hash text,
  password_salt text,
  role text not null default 'user',
  is_active boolean not null default true,
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
alter table public.site_users add column if not exists banned_at timestamptz;
alter table public.site_users add column if not exists ban_reason text;
alter table public.site_users add column if not exists last_login_at timestamptz;
alter table public.site_users add column if not exists created_at timestamptz not null default now();
alter table public.site_users add column if not exists updated_at timestamptz not null default now();
update public.site_users set role = 'yonetici' where lower(role) = 'admin';
update public.site_users set role = 'kurucu' where lower(role) in ('owner','founder','sahip');
delete from public.site_users a using public.site_users b where a.ctid < b.ctid and lower(a.email) = lower(b.email);
create unique index if not exists site_users_email_unique_idx on public.site_users (lower(email));

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  genre text default 'Genel',
  status text default 'Devam Ediyor',
  episode_count integer default 0,
  score numeric default 0,
  cover_url text,
  source text default 'manual',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.games add column if not exists title text;
alter table public.games add column if not exists genre text default 'Genel';
alter table public.games add column if not exists status text default 'Devam Ediyor';
alter table public.games add column if not exists episode_count integer default 0;
alter table public.games add column if not exists score numeric default 0;
alter table public.games add column if not exists cover_url text;
alter table public.games add column if not exists source text default 'manual';
alter table public.games add column if not exists created_at timestamptz not null default now();
alter table public.games add column if not exists updated_at timestamptz not null default now();

create table if not exists public.site_features (
  id uuid primary key default gen_random_uuid(),
  key text not null,
  title text not null,
  description text,
  enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.site_features add column if not exists key text;
alter table public.site_features add column if not exists title text;
alter table public.site_features add column if not exists description text;
alter table public.site_features add column if not exists enabled boolean not null default false;
alter table public.site_features add column if not exists created_at timestamptz not null default now();
alter table public.site_features add column if not exists updated_at timestamptz not null default now();
delete from public.site_features a using public.site_features b where a.ctid < b.ctid and a.key = b.key;
create unique index if not exists site_features_key_unique_idx on public.site_features (key);

create table if not exists public.site_runtime_config (
  id uuid primary key default gen_random_uuid(),
  key text not null,
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.site_runtime_config add column if not exists key text;
alter table public.site_runtime_config add column if not exists value jsonb not null default '{}'::jsonb;
alter table public.site_runtime_config add column if not exists created_at timestamptz not null default now();
alter table public.site_runtime_config add column if not exists updated_at timestamptz not null default now();
delete from public.site_runtime_config a using public.site_runtime_config b where a.ctid < b.ctid and a.key = b.key;
create unique index if not exists site_runtime_config_key_unique_idx on public.site_runtime_config (key);

create table if not exists public.site_admin_planner (
  id uuid primary key default gen_random_uuid(),
  group_name text not null,
  title text not null,
  status text not null default 'plan',
  feature_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.site_admin_planner add column if not exists group_name text;
alter table public.site_admin_planner add column if not exists title text;
alter table public.site_admin_planner add column if not exists status text not null default 'plan';
alter table public.site_admin_planner add column if not exists feature_key text;
alter table public.site_admin_planner add column if not exists created_at timestamptz not null default now();
alter table public.site_admin_planner add column if not exists updated_at timestamptz not null default now();

create table if not exists public.site_admin_notes (
  id uuid primary key default gen_random_uuid(),
  note text not null,
  actor_email text,
  created_at timestamptz not null default now()
);
alter table public.site_admin_notes add column if not exists note text;
alter table public.site_admin_notes add column if not exists actor_email text;
alter table public.site_admin_notes add column if not exists created_at timestamptz not null default now();

create table if not exists public.site_update_notes (
  id uuid primary key default gen_random_uuid(),
  version text,
  title text,
  note text,
  created_at timestamptz not null default now()
);
alter table public.site_update_notes add column if not exists version text;
alter table public.site_update_notes add column if not exists title text;
alter table public.site_update_notes add column if not exists note text;
alter table public.site_update_notes add column if not exists created_at timestamptz not null default now();

-- Varsayılan runtime ayarı
insert into public.site_runtime_config (key, value, updated_at)
select 'maintenance_mode', '{"enabled":false,"message":"Hayatımız Oyun kısa süreli bakımda."}'::jsonb, now()
where not exists (select 1 from public.site_runtime_config where key = 'maintenance_mode');

-- Hazır özellikler, kapalı başlatılır.
insert into public.site_features (key, title, description, enabled, updated_at)
select 'admin_games_add_button', 'Oyunlar sekmesine Oyun Ekle butonu ekle', 'Uygula deyince Yönetim Paneli > Oyunlar içine Oyun Ekle butonu ve Supabase games formu gelir.', false, now()
where not exists (select 1 from public.site_features where key = 'admin_games_add_button');
insert into public.site_features (key, title, description, enabled, updated_at)
select 'update_notes_editor', 'Güncelleme notu editörünü Supabase site_update_notes tablosuna bağla', 'Panelde güncelleme notu editörü modülünü görünür yapar.', false, now()
where not exists (select 1 from public.site_features where key = 'update_notes_editor');
insert into public.site_features (key, title, description, enabled, updated_at)
select 'profile_photo_upload', 'Profil fotoğrafı yükleme alanı ekle', 'Profil bölümünde fotoğraf yükleme alanını görünür yapar.', false, now()
where not exists (select 1 from public.site_features where key = 'profile_photo_upload');
insert into public.site_features (key, title, description, enabled, updated_at)
select 'missing_cover_warning', 'Oyun kartında eksik kapak sarı uyarısını otomatik göster', 'Kapak görseli olmayan oyunlara admin/kart tarafında uyarı gösterir.', false, now()
where not exists (select 1 from public.site_features where key = 'missing_cover_warning');

-- Varsayılan plan maddeleri tekrar eklenmesin diye NOT EXISTS kullanılır.
insert into public.site_admin_planner (group_name, title, status, feature_key)
select 'Siteye Gelmesi Gerekenler', 'Oyunlar sekmesine Oyun Ekle butonu ekle', 'plan', 'admin_games_add_button'
where not exists (select 1 from public.site_admin_planner where title = 'Oyunlar sekmesine Oyun Ekle butonu ekle');
insert into public.site_admin_planner (group_name, title, status, feature_key)
select 'Siteye Gelmesi Gerekenler', 'Güncelleme notu editörünü Supabase site_update_notes tablosuna bağla', 'plan', 'update_notes_editor'
where not exists (select 1 from public.site_admin_planner where title = 'Güncelleme notu editörünü Supabase site_update_notes tablosuna bağla');
insert into public.site_admin_planner (group_name, title, status, feature_key)
select 'Gözden Kaçanlar', 'Oyun kartında eksik kapak sarı uyarısını otomatik göster', 'plan', 'missing_cover_warning'
where not exists (select 1 from public.site_admin_planner where title = 'Oyun kartında eksik kapak sarı uyarısını otomatik göster');
insert into public.site_admin_planner (group_name, title, status)
select 'Adminin Önerileri', 'Benim Notlarım alanından eksik/hata girişi ekle', 'kontrol'
where not exists (select 1 from public.site_admin_planner where title = 'Benim Notlarım alanından eksik/hata girişi ekle');

-- Güncelleme notu tekrarını önlemek için önce bu sürüm silinir, sonra tekrar eklenir.
delete from public.site_update_notes where version = 'v2.1.4';
insert into public.site_update_notes (version, title, note) values
('v2.1.4', 'Otomatik Uygulama Merkezi', 'Hazır özellikler panelden Siteye Uygula ile aktif edilebilir.'),
('v2.1.4', 'Oyun Ekle özelliği', 'Oyunlar sekmesine Oyun Ekle butonu özellik planından aktif edilebilir.'),
('v2.1.4', 'Supabase games bağlantısı', 'Oyun ekleme formu games tablosuna kayıt gönderir.'),
('v2.1.4', 'Kurulum notları', 'Supabase, GitHub ve Vercel adımları madde madde güncellendi.');

-- RLS bu proje için servis role üzerinden API kullanıldığı için kapalı tutulur.
alter table public.site_users disable row level security;
alter table public.games disable row level security;
alter table public.site_features disable row level security;
alter table public.site_runtime_config disable row level security;
alter table public.site_admin_planner disable row level security;
alter table public.site_admin_notes disable row level security;
alter table public.site_update_notes disable row level security;

notify pgrst, 'reload schema';
select 'Hayatimiz Oyun v2.1.4 schema hazir. Sonra GitHub temiz kurulum ve Vercel Clear Build Cache yap.' as status;
