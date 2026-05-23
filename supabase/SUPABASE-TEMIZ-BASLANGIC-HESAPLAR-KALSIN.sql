-- Hayatımız Oyun v2.1.4 HESAPLAR KALSIN TEMİZ BAŞLANGIÇ
-- site_users silinmez. Açtığın hesaplar ve roller kalır.
-- Yönetim planı, notlar, özellik durumları, bakım ve oyun verisi sıfırlanır.

create extension if not exists pgcrypto;

create table if not exists public.site_features (
  id uuid primary key default gen_random_uuid(), key text not null, title text not null, description text, enabled boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create unique index if not exists site_features_key_unique_idx on public.site_features (key);
create table if not exists public.site_runtime_config (
  id uuid primary key default gen_random_uuid(), key text not null, value jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create unique index if not exists site_runtime_config_key_unique_idx on public.site_runtime_config (key);
create table if not exists public.site_admin_planner (
  id uuid primary key default gen_random_uuid(), group_name text not null, title text not null, status text not null default 'plan', feature_key text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.site_admin_notes (
  id uuid primary key default gen_random_uuid(), note text not null, actor_email text, created_at timestamptz not null default now()
);
create table if not exists public.site_update_notes (
  id uuid primary key default gen_random_uuid(), version text, title text, note text, created_at timestamptz not null default now()
);
create table if not exists public.games (
  id uuid primary key default gen_random_uuid(), title text not null, genre text default 'Genel', status text default 'Devam Ediyor', episode_count integer default 0, score numeric default 0, cover_url text, source text default 'manual', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

truncate table public.site_features restart identity cascade;
truncate table public.site_runtime_config restart identity cascade;
truncate table public.site_admin_planner restart identity cascade;
truncate table public.site_admin_notes restart identity cascade;
truncate table public.site_update_notes restart identity cascade;
truncate table public.games restart identity cascade;

insert into public.site_runtime_config (key, value) values
('maintenance_mode', '{"enabled":false,"message":"Hayatımız Oyun kısa süreli bakımda."}'::jsonb);

insert into public.site_features (key, title, description, enabled) values
('admin_games_add_button', 'Oyunlar sekmesine Oyun Ekle butonu ekle', 'Uygula deyince Yönetim Paneli > Oyunlar içine Oyun Ekle butonu ve Supabase games formu gelir.', false),
('update_notes_editor', 'Güncelleme notu editörünü Supabase site_update_notes tablosuna bağla', 'Panelde güncelleme notu editörü modülünü görünür yapar.', false),
('profile_photo_upload', 'Profil fotoğrafı yükleme alanı ekle', 'Profil bölümünde fotoğraf yükleme alanını görünür yapar.', false),
('missing_cover_warning', 'Oyun kartında eksik kapak sarı uyarısını otomatik göster', 'Kapak görseli olmayan oyunlara uyarı gösterir.', false);

insert into public.site_admin_planner (group_name, title, status, feature_key) values
('Siteye Gelmesi Gerekenler', 'Oyunlar sekmesine Oyun Ekle butonu ekle', 'plan', 'admin_games_add_button'),
('Siteye Gelmesi Gerekenler', 'Güncelleme notu editörünü Supabase site_update_notes tablosuna bağla', 'plan', 'update_notes_editor'),
('Gözden Kaçanlar', 'Oyun kartında eksik kapak sarı uyarısını otomatik göster', 'plan', 'missing_cover_warning'),
('Adminin Önerileri', 'Benim Notlarım alanından eksik/hata girişi ekle', 'kontrol', null);

insert into public.site_update_notes (version, title, note) values
('v2.1.4', 'Temiz başlangıç', 'Hesaplar korunarak yönetim ve oyun tabloları sıfırlandı.'),
('v2.1.4', 'Otomatik Uygulama Merkezi', 'Hazır özellikler panelden aktif edilebilir.');

notify pgrst, 'reload schema';
select 'v2.1.4 temiz baslangic tamam. site_users hesaplari korunur.' as status;
