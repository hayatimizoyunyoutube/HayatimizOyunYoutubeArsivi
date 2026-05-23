-- Hayatımız Oyun v2.1.4.3 tek Supabase schema
-- Tekrar çalıştırılabilir güvenli kurulum dosyasıdır.
-- Sıra: gerekirse 00-TUM-TABLOLARI-SIFIRLA.sql -> schema.sql -> YETKI-ORNEK-SQL-v2141.sql

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
drop index if exists public.site_users_email_unique_idx;
create unique index site_users_email_unique_idx on public.site_users (lower(email));

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
drop index if exists public.site_features_key_unique_idx;
create unique index site_features_key_unique_idx on public.site_features (key);

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
create unique index site_runtime_config_key_unique_idx on public.site_runtime_config (key);

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
alter table public.site_update_notes add column if not exists summary text;
alter table public.site_update_notes add column if not exists image_url text;
alter table public.site_update_notes add column if not exists status text default 'published';
alter table public.site_update_notes add column if not exists created_at timestamptz not null default now();

insert into public.site_runtime_config (key, value, updated_at)
select 'maintenance_mode', '{"enabled":false,"message":"Hayatımız Oyun kısa süreli bakımda."}'::jsonb, now()
where not exists (select 1 from public.site_runtime_config where key = 'maintenance_mode');

-- Hazır uygulanabilir özellikler
insert into public.site_features (key, title, description, enabled, updated_at)
select 'admin_games_add_button', 'Oyunlar sekmesine Oyun Ekle butonu ekle', 'Yönetim Paneli > Oyunlar içine Oyun Ekle butonu ve Supabase games formu gelir.', false, now()
where not exists (select 1 from public.site_features where key = 'admin_games_add_button');
insert into public.site_features (key, title, description, enabled, updated_at)
select 'auto_cover_fetch', 'Otomatik kapak resmi çekme sistemini aç', 'Oyunlar sekmesine Otomatik Kapak Çek butonu gelir.', false, now()
where not exists (select 1 from public.site_features where key = 'auto_cover_fetch');
insert into public.site_features (key, title, description, enabled, updated_at)
select 'update_notes_editor', 'Güncelleme notu editörünü Supabase site_update_notes tablosuna bağla', 'Güncelleme notu editörü modülünü açar.', false, now()
where not exists (select 1 from public.site_features where key = 'update_notes_editor');
insert into public.site_features (key, title, description, enabled, updated_at)
select 'profile_photo_upload', 'Profil fotoğrafı yükleme alanı ekle', 'Profil bölümünde fotoğraf yükleme alanını görünür yapar.', false, now()
where not exists (select 1 from public.site_features where key = 'profile_photo_upload');
insert into public.site_features (key, title, description, enabled, updated_at)
select 'missing_cover_warning', 'Oyun kartında eksik kapak sarı uyarısını otomatik göster', 'Kapak olmayan oyunlara uyarı gösterir.', false, now()
where not exists (select 1 from public.site_features where key = 'missing_cover_warning');
insert into public.site_features (key, title, description, enabled, updated_at)
select 'maintenance_message_editor', 'Bakım modu yazısını panelden düzenleme alanı ekle', 'Bakım modu mesaj alanını güçlendirir.', false, now()
where not exists (select 1 from public.site_features where key = 'maintenance_message_editor');

-- Varsayılan plan maddeleri
insert into public.site_admin_planner (group_name, title, status, feature_key)
select 'Siteye Gelmesi Gerekenler', 'Oyunlar sekmesine Oyun Ekle butonu ekle', 'plan', 'admin_games_add_button'
where not exists (select 1 from public.site_admin_planner where title = 'Oyunlar sekmesine Oyun Ekle butonu ekle');
insert into public.site_admin_planner (group_name, title, status, feature_key)
select 'Siteye Gelmesi Gerekenler', 'Otomatik kapak resmi çekme sistemini aç', 'plan', 'auto_cover_fetch'
where not exists (select 1 from public.site_admin_planner where title = 'Otomatik kapak resmi çekme sistemini aç');
insert into public.site_admin_planner (group_name, title, status, feature_key)
select 'Siteye Gelmesi Gerekenler', 'Güncelleme notu editörünü Supabase site_update_notes tablosuna bağla', 'plan', 'update_notes_editor'
where not exists (select 1 from public.site_admin_planner where title = 'Güncelleme notu editörünü Supabase site_update_notes tablosuna bağla');
insert into public.site_admin_planner (group_name, title, status, feature_key)
select 'Gözden Kaçanlar', 'Oyun kartında eksik kapak sarı uyarısını otomatik göster', 'plan', 'missing_cover_warning'
where not exists (select 1 from public.site_admin_planner where title = 'Oyun kartında eksik kapak sarı uyarısını otomatik göster');
insert into public.site_admin_planner (group_name, title, status)
select 'Adminin Önerileri', 'Benim yazdığım özelliği anlayıp onay sorarak Siteye Uygula sistemine bağla', 'plan'
where not exists (select 1 from public.site_admin_planner where title = 'Benim yazdığım özelliği anlayıp onay sorarak Siteye Uygula sistemine bağla');

-- Güncelleme notları / tüm sürümler
delete from public.site_update_notes where version in ('v2.0.6','v2.0.7','v2.0.8','v2.0.9','v2.1.0','v2.1.1','v2.1.2','v2.1.3','v2.1.4','v2.1.4.1','v2.1.4.2','v2.1.4.3');
insert into public.site_update_notes (version, title, summary, note, image_url, status) values
('v2.0.6','UI Safe Fix','Kategori taşma fixi, yönetim paneli düzeni ve kapak oranları düzenlendi.','Site bozulmadan uygulanabilecek ilk güvenli arayüz patch paketi hazırlandı.','previews/hayatimiz-oyun-v206-desktop-preview.png','published'),
('v2.0.7','Otomatik Çekme Altyapısı','JSON veri sistemi, otomatik çekme paneli ve fallback yapısı eklendi.','Veri gelmezse sitenin bozulmaması için güvenli katman hazırlandı.','previews/hayatimiz-oyun-v207-desktop-preview.png','published'),
('v2.0.8','Smart Archive','Akıllı filtre, kalite skoru, otomatik çekme geçmişi ve sağlık özeti eklendi.','Arşiv tarafında kontrol ve filtreleme kartları geliştirildi.','previews/hayatimiz-oyun-v208-desktop-preview.png','published'),
('v2.0.9','Control Hub','Kontrol merkezi, sezon/bölüm takibi, yayın takvimi ve koleksiyon alanı eklendi.','Arşiv yönetimi sezon ve koleksiyon odaklı hale getirildi.','previews/hayatimiz-oyun-v209-desktop-preview.png','published'),
('v2.1.0','AI Archive Studio','AI öneri paneli, bildirim merkezi, izleme ilerlemesi ve tema presetleri eklendi.','Kişiselleştirme ve otomasyon altyapısı genişletildi.','previews/hayatimiz-oyun-v210-desktop-preview.png','published'),
('v2.1.1','Test Center','Test merkezi, hata raporları, API/ENV paneli ve rollback planı eklendi.','Akşam testleri için hata yakalama ve kontrol merkezi oluşturuldu.','previews/hayatimiz-oyun-v211-desktop-preview.png','published'),
('v2.1.2','Kullanıcı Menüleri + Bakım','Teknik menüler kullanıcıdan kaldırıldı ve bakım modu güçlendirildi.','Yönetim paneli kullanıcı arayüzünden ayrıldı.','previews/hayatimiz-oyun-v212-desktop-preview.png','published'),
('v2.1.3','Supabase Kullanıcı + Yetki','Kayıtlar Supabase site_users tablosuna bağlandı, roller eklendi.','Rol yönetimi, banlama, silme ve global bakım modu altyapısı güçlendirildi.','previews/hayatimiz-oyun-v213-admin-preview.png','published'),
('v2.1.4','Otomatik Uygulama Merkezi','Özellik Planı içinden Siteye Uygula sistemi eklendi.','Hazır modüller panelden açılabilir hale getirildi.','previews/hayatimiz-oyun-v214-feature-apply-preview.png','published'),
('v2.1.4.1','Arayüz Yenileme + Resimli Kurulum','Yönetim kartları, mobil görünüm ve resimli kurulum rehberi yenilendi.','Kurulum görselleri ZIP içine alındı.','previews/hayatimiz-oyun-v2141-public-home-preview.png','published'),
('v2.1.4.2','Profesyonel Mobil + Güncelleme Notları','Profesyonel mobil arayüz ve admin güncelleme notu ekleme paneli eklendi.','Güncelleme notları kullanıcı ana sayfasından kaldırıldı; yönetim panelinde yazılı ve resimli not ekleme akışı oluşturuldu.','previews/hayatimiz-oyun-v2142-public-home-preview.png','published'),
('v2.1.4.3','Arayüz Fix + Güncelleme Notları','Kullanıcı ana sayfası sadeleştirildi, mobil görünüm güçlendirildi ve güncelleme notları sadece yönetim panelinde toplandı.','Hata düzeltme sürümü: beyaz ekran riskini azaltan güvenli başlangıç, temiz kullanıcı ana sayfası, admin güncelleme notu ekleme ve görsel/yazılı arşiv düzenlendi.','previews/hayatimiz-oyun-v2143-public-home-preview.png','published');

alter table public.site_users disable row level security;
alter table public.games disable row level security;
alter table public.site_features disable row level security;
alter table public.site_runtime_config disable row level security;
alter table public.site_admin_planner disable row level security;
alter table public.site_admin_notes disable row level security;
alter table public.site_update_notes disable row level security;

notify pgrst, 'reload schema';
select 'Hayatimiz Oyun v2.1.4.3 schema hazir. Sonra GitHub temiz kurulum ve Vercel Clear Build Cache yap.' as status;
