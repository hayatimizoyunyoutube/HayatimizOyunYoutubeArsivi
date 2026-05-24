-- Hayatımız Oyun v2.1.3 temiz Supabase schema
-- Bu dosya tekrar tekrar çalıştırılabilir.
-- Normal kurulumda önce sadece bu dosyayı çalıştır.
-- Sonra gerekirse YETKI-ORNEK-SQL-v213.sql ile kendi hesabını kurucu yap.
-- RLS/güvenlik ve sıfırlama dosyaları opsiyonel klasöründedir; normal güncellemede çalıştırma.

create extension if not exists pgcrypto;

-- Kullanıcılar
create table if not exists public.site_users (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  email text,
  password_hash text,
  password_salt text,
  role text not null default 'user',
  avatar_url text,
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
alter table public.site_users add column if not exists avatar_url text;
alter table public.site_users add column if not exists is_active boolean not null default true;
alter table public.site_users add column if not exists banned_at timestamptz;
alter table public.site_users add column if not exists ban_reason text;
alter table public.site_users add column if not exists last_login_at timestamptz;
alter table public.site_users add column if not exists created_at timestamptz not null default now();
alter table public.site_users add column if not exists updated_at timestamptz not null default now();
update public.site_users set role = 'yonetici' where lower(role) = 'admin';
update public.site_users set role = 'kurucu' where lower(role) in ('owner','founder','sahip');
delete from public.site_users a using public.site_users b where a.ctid < b.ctid and lower(a.email) = lower(b.email);
drop index if exists public.site_users_email_unique_idx;
create unique index if not exists site_users_email_unique_idx on public.site_users (lower(email));

-- Oyunlar
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
  source text default 'manual',
  series_name text,
  playlist_url text,
  description text,
  episode_titles jsonb default '[]'::jsonb,
  favorite_count integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.games add column if not exists title text;
alter table public.games add column if not exists genre text default 'Genel';
alter table public.games add column if not exists status text default 'Devam Ediyor';
alter table public.games add column if not exists episode_count integer default 0;
alter table public.games add column if not exists score numeric default 0;
alter table public.games add column if not exists cover_url text;
alter table public.games add column if not exists release_date text;
alter table public.games add column if not exists tags text;
alter table public.games add column if not exists rawg_slug text;
alter table public.games add column if not exists source text default 'manual';
alter table public.games add column if not exists series_name text;
alter table public.games add column if not exists playlist_url text;
alter table public.games add column if not exists description text;
alter table public.games add column if not exists episode_titles jsonb default '[]'::jsonb;
alter table public.games add column if not exists favorite_count integer default 0;
alter table public.games add column if not exists created_at timestamptz not null default now();
alter table public.games add column if not exists updated_at timestamptz not null default now();

-- Özellik / bakım / plan / not tabloları
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
drop index if exists public.site_features_key_unique_idx;
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
drop index if exists public.site_runtime_config_key_unique_idx;
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
  summary text,
  note text,
  image_url text,
  status text default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.site_update_notes add column if not exists version text;
alter table public.site_update_notes add column if not exists title text;
alter table public.site_update_notes add column if not exists summary text;
alter table public.site_update_notes add column if not exists note text;
alter table public.site_update_notes add column if not exists image_url text;
alter table public.site_update_notes add column if not exists status text default 'published';
alter table public.site_update_notes add column if not exists created_at timestamptz not null default now();
alter table public.site_update_notes add column if not exists updated_at timestamptz not null default now();
delete from public.site_update_notes a using public.site_update_notes b where a.ctid < b.ctid and coalesce(a.version,'') = coalesce(b.version,'') and coalesce(a.title,'') = coalesce(b.title,'');
drop index if exists public.site_update_notes_version_title_unique_idx;
create unique index if not exists site_update_notes_version_title_unique_idx on public.site_update_notes (version, title);

-- v2.1.3 bölüm, favori ve düzenleme geçmişi tabloları
create table if not exists public.game_episodes (
  id uuid primary key default gen_random_uuid(),
  game_id text,
  title text not null,
  episode_index integer default 0,
  source_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
do $$ begin
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='game_episodes' and column_name='game_id' and udt_name='uuid'
  ) then
    alter table public.game_episodes alter column game_id type text using game_id::text;
  end if;
end $$;
alter table public.game_episodes add column if not exists game_id text;
alter table public.game_episodes add column if not exists title text;
alter table public.game_episodes add column if not exists episode_index integer default 0;
alter table public.game_episodes add column if not exists source_url text;
alter table public.game_episodes add column if not exists created_at timestamptz default now();
alter table public.game_episodes add column if not exists updated_at timestamptz default now();

create table if not exists public.site_favorites (
  id uuid primary key default gen_random_uuid(),
  user_email text not null,
  game_id text not null,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.site_favorites add column if not exists user_email text;
alter table public.site_favorites add column if not exists game_id text;
alter table public.site_favorites add column if not exists active boolean default true;
alter table public.site_favorites add column if not exists created_at timestamptz default now();
alter table public.site_favorites add column if not exists updated_at timestamptz default now();
delete from public.site_favorites a using public.site_favorites b where a.ctid < b.ctid and lower(a.user_email) = lower(b.user_email) and a.game_id = b.game_id;
drop index if exists public.site_favorites_user_game_unique_idx;
create unique index if not exists site_favorites_user_game_unique_idx on public.site_favorites (lower(user_email), game_id);

create table if not exists public.game_edit_history (
  id uuid primary key default gen_random_uuid(),
  game_id text,
  snapshot jsonb,
  reason text,
  actor_email text,
  created_at timestamptz default now()
);
alter table public.game_edit_history add column if not exists game_id text;
alter table public.game_edit_history add column if not exists snapshot jsonb;
alter table public.game_edit_history add column if not exists reason text;
alter table public.game_edit_history add column if not exists actor_email text;
alter table public.game_edit_history add column if not exists created_at timestamptz default now();

-- Supabase Storage bucket hazırlığı. Bucket varsa günceller, yoksa oluşturur.
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema='storage' and table_name='buckets') then
    insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    values ('cover-images', 'cover-images', true, 5242880, array['image/png','image/jpeg','image/webp','image/gif'])
    on conflict (id) do update set public = true, file_size_limit = 5242880, allowed_mime_types = array['image/png','image/jpeg','image/webp','image/gif'];

    insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    values ('profile-photos', 'profile-photos', true, 5242880, array['image/png','image/jpeg','image/webp','image/gif'])
    on conflict (id) do update set public = true, file_size_limit = 5242880, allowed_mime_types = array['image/png','image/jpeg','image/webp','image/gif'];
  end if;
end $$;

-- Storage public read policy: varsa tekrar oluşturmaz.
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema='storage' and table_name='objects') then
    if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='cover images public read') then
      create policy "cover images public read" on storage.objects for select using (bucket_id = 'cover-images');
    end if;
    if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='profile photos public read') then
      create policy "profile photos public read" on storage.objects for select using (bucket_id = 'profile-photos');
    end if;
  end if;
end $$;

-- Varsayılan bakım ayarı
insert into public.site_runtime_config (key, value, updated_at)
values ('maintenance_mode', '{"enabled":false,"message":"Hayatımız Oyun kısa süreli bakımda."}'::jsonb, now())
on conflict (key) do nothing;

-- Hazır özellik kayıtları: AI Özellik Merkezi yok; sadece panel modülleri korunur.
insert into public.site_features (key, title, description, enabled, updated_at) values
('admin_games_add_button', 'Oyunlar sekmesine Oyun Ekle butonu ekle', 'Yönetim Paneli > Oyunlar içine Oyun Ekle formu gelir.', true, now()),
('auto_cover_fetch', 'Otomatik kapak resmi çekme sistemini aç', 'Oyun adından kapak/tür/tarih önerisi doldurma altyapısı.', true, now()),
('update_notes_editor', 'Güncelleme notu editörünü Supabase site_update_notes tablosuna bağla', 'Güncelleme notu ekleme, düzenleme ve silme paneli.', true, now()),
('profile_photo_upload', 'Profil fotoğrafı yükleme alanı ekle', 'Profil fotoğrafı Storage yükleme alanı.', true, now()),
('game_auto_meta_fetch', 'Oyun adından tür, etiket ve açıklama otomatik çekme', 'Oyun adı yazınca meta alanlarını doldurur; oyun eklemez/silmez.', true, now()),
('game_edit_delete_buttons', 'Oyunları düzenle ve sil butonlarını aktif et', 'Oyun kartlarında düzenleme ve silme işlemleri.', true, now()),
('missing_cover_warning', 'Oyun kartında eksik kapak uyarısı', 'Kapak eksikse yönetim panelinde raporlar.', true, now())
on conflict (key) do update set title=excluded.title, description=excluded.description, updated_at=now();

-- Güncelleme notları: v2.1.3 doğru içerik, eski v2.1.4 notları schema ile basılmaz.
insert into public.site_update_notes (version, title, summary, note, image_url, status, updated_at) values
('v2.1.0', 'Oyun Ekle Meta Temeli', 'AI Özellik bölümü kaldırıldı; oyun ekleme, kapak, çıkış tarihi ve etiket butonları temel sisteme alındı.', 'Bundan sonra özellikler site içi AI merkezinden değil, bu sohbet üzerinden hazırlanacak.', 'previews/hayatimiz-oyun-v210-desktop-preview.png', 'published', now()),
('v2.1.1', 'Koleksiyon Fix', 'Koleksiyon sayacı gerçek oyun verisine bağlandı; boş koleksiyonlar sahte sayı göstermiyor.', 'Otomatik çekme oyun eklemez/silmez; sadece formu doldurur. Koleksiyonlar gerçek veriye göre hesaplanır.', 'previews/hayatimiz-oyun-v211-oyun-meta-preview.png', 'published', now()),
('v2.1.2', 'Oyun Yönetimi + Meta + Seriler', 'RAWG çoklu kapak onayı, formda oyun düzenleme, tür/etiket filtreleri, çıkış tarihi çipleri, playlist bölüm sayısı ve seri alanı eklendi.', 'v2.1.2 planındaki oyun yönetimi maddeleri tamamlananlara taşındı.', 'previews/hayatimiz-oyun-v212-games-meta-editor-preview.png', 'published', now()),
('v2.1.3', 'Storage + Güncelleme Notları + Seri Fix', 'Kapak yükleme, not düzenleme/silme, bakım notları, eksik meta raporu ve seri/alfabetik görünüm eklendi.', 'v2.1.3 planındaki kapak, profil, güncelleme notları, seri sayfası, eksik meta ve mobil kart düzeltmeleri tamamlananlara taşındı.', 'previews/hayatimiz-oyun-v213-storage-notes-series-preview.png', 'published', now())
on conflict (version, title) do update set summary=excluded.summary, note=excluded.note, image_url=excluded.image_url, status=excluded.status, updated_at=now();

-- API service role ile çalıştığı için normal kurulumda RLS kapalı bırakılır. Güvenlik ayarı istersen opsiyonel/02-SUPABASE-RLS-GUVENLIK.sql kullan.
alter table public.site_users disable row level security;
alter table public.games disable row level security;
alter table public.site_features disable row level security;
alter table public.site_runtime_config disable row level security;
alter table public.site_admin_planner disable row level security;
alter table public.site_admin_notes disable row level security;
alter table public.site_update_notes disable row level security;
alter table public.game_episodes disable row level security;
alter table public.site_favorites disable row level security;
alter table public.game_edit_history disable row level security;

notify pgrst, 'reload schema';
select 'Hayatimiz Oyun v2.1.3 temiz schema hazir. Sonra GitHub temiz kurulum ve Vercel Clear Build Cache yap.' as status;
