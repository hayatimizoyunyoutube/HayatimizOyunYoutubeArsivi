
-- v2.4.6 FIX9 - schema güvenlik başlangıcı
create table if not exists public.site_runtime_config (
  key text primary key,
  value jsonb,
  updated_at timestamptz default now()
);
create table if not exists public.site_update_notes (
  id bigserial primary key,
  version text,
  title text,
  summary text,
  note text,
  description text,
  status text default 'Tamamlandı',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_update_notes add column if not exists version text;
alter table if exists public.site_update_notes add column if not exists title text;
alter table if exists public.site_update_notes add column if not exists summary text;
alter table if exists public.site_update_notes add column if not exists note text;
alter table if exists public.site_update_notes add column if not exists description text;
alter table if exists public.site_update_notes add column if not exists status text default 'Tamamlandı';
alter table if exists public.site_update_notes add column if not exists updated_at timestamptz default now();
delete from public.site_update_notes a using public.site_update_notes b
where a.ctid < b.ctid
  and coalesce(a.version,'') = coalesce(b.version,'')
  and coalesce(a.title,'') = coalesce(b.title,'');
create unique index if not exists site_update_notes_version_title_unique_idx on public.site_update_notes(version, title);

-- Hayatımız Oyun v2.2.0 FIX - JSONB Schema Düzeltmesi
-- RLS ayarları opsiyonel/02-SUPABASE-RLS-GUVENLIK.sql dosyasındadır.
-- Tekrar çalıştırılabilir güvenli kurulum dosyasıdır.
-- Sıra: gerekirse opsiyonel/00-TUM-TABLOLARI-SIFIRLA.sql -> schema.sql -> YETKI-ORNEK-SQL-v212.sql
-- Profil fotoğrafı için Supabase Storage tarafında profile-photos bucket oluşturulabilir; uygulama avatar_url alanını kullanır.

create extension if not exists pgcrypto;

create table if not exists public.site_users (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  avatar_url text,
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
alter table public.site_users add column if not exists avatar_url text;
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
  release_date text,
  tags text,
  rawg_slug text,
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
alter table public.games add column if not exists release_date text;
alter table public.games add column if not exists tags text;
alter table public.games add column if not exists rawg_slug text;
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


-- v2.4.1 FIX 62 - site_settings uyumluluk tablosu
-- Eski FIX bloklarında kullanılan site_settings kaydı için tablo garanti oluşturulur.
-- Böylece schema.sql tekrar çalıştırıldığında relation "site_settings" does not exist hatası vermez.
create table if not exists public.site_settings (
  id uuid default gen_random_uuid(),
  key text not null,
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.site_settings add column if not exists id uuid default gen_random_uuid();
alter table public.site_settings add column if not exists key text;
alter table public.site_settings add column if not exists value jsonb not null default '{}'::jsonb;
alter table public.site_settings add column if not exists created_at timestamptz not null default now();
alter table public.site_settings add column if not exists updated_at timestamptz not null default now();
delete from public.site_settings a using public.site_settings b where a.ctid < b.ctid and a.key = b.key;
drop index if exists public.site_settings_key_unique_idx;
create unique index site_settings_key_unique_idx on public.site_settings (key);

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
alter table public.site_update_notes add column if not exists description text;
alter table public.site_update_notes add column if not exists summary text;
alter table public.site_update_notes add column if not exists written text;
alter table public.site_update_notes add column if not exists image_url text;
alter table public.site_update_notes add column if not exists status text default 'published';
alter table public.site_update_notes add column if not exists created_at timestamptz not null default now();

-- v2.1.5.1: Güncelleme notları aynı version+title ile tekrar çalıştırıldığında artık eski kayıt bırakılmaz; içerik güncellenir.
delete from public.site_update_notes a using public.site_update_notes b
where a.ctid < b.ctid
  and coalesce(a.version,'') = coalesce(b.version,'')
  and coalesce(a.title,'') = coalesce(b.title,'');
drop index if exists public.site_update_notes_version_title_unique_idx;
create unique index site_update_notes_version_title_unique_idx on public.site_update_notes (version, title);

-- Son çalıştırılan schema sürümünü Supabase içinde tutar.
insert into public.site_runtime_config (key, value, updated_at)
values ('schema_version', jsonb_build_object('version','v2.1.8','applied_at', now()), now())
on conflict (key) do update set value = excluded.value, updated_at = now();


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
-- v2.1.3: Kullanıcının panelden eklediği notları silmez. Aynı version+title varsa tekrar eklemez.
insert into public.site_update_notes (version, title, summary, note, image_url, status)
select 'v2.0.6', 'UI Safe Fix', 'Kategori taşma fixi, yönetim paneli düzeni ve kapak oranları düzenlendi.', 'Site bozulmadan uygulanabilecek ilk güvenli arayüz patch paketi hazırlandı.', 'previews/hayatimiz-oyun-v206-desktop-preview.png', 'published'
where not exists (select 1 from public.site_update_notes where version = 'v2.0.6' and title = 'UI Safe Fix')
on conflict (version,title) do update set
  summary = coalesce(excluded.summary, public.site_update_notes.summary),
  note = coalesce(excluded.note, public.site_update_notes.note),
  image_url = coalesce(excluded.image_url, public.site_update_notes.image_url),
  status = coalesce(excluded.status, public.site_update_notes.status);

insert into public.site_update_notes (version, title, summary, note, image_url, status)
select 'v2.0.7', 'Otomatik Çekme Altyapısı', 'JSON veri sistemi, otomatik çekme paneli ve fallback yapısı eklendi.', 'Veri gelmezse sitenin bozulmaması için güvenli katman hazırlandı.', 'previews/hayatimiz-oyun-v207-desktop-preview.png', 'published'
where not exists (select 1 from public.site_update_notes where version = 'v2.0.7' and title = 'Otomatik Çekme Altyapısı')
on conflict (version,title) do update set
  summary = coalesce(excluded.summary, public.site_update_notes.summary),
  note = coalesce(excluded.note, public.site_update_notes.note),
  image_url = coalesce(excluded.image_url, public.site_update_notes.image_url),
  status = coalesce(excluded.status, public.site_update_notes.status);

insert into public.site_update_notes (version, title, summary, note, image_url, status)
select 'v2.0.8', 'Smart Archive', 'Akıllı filtre, kalite skoru, otomatik çekme geçmişi ve sağlık özeti eklendi.', 'Arşiv tarafında kontrol ve filtreleme kartları geliştirildi.', 'previews/hayatimiz-oyun-v208-desktop-preview.png', 'published'
where not exists (select 1 from public.site_update_notes where version = 'v2.0.8' and title = 'Smart Archive')
on conflict (version,title) do update set
  summary = coalesce(excluded.summary, public.site_update_notes.summary),
  note = coalesce(excluded.note, public.site_update_notes.note),
  image_url = coalesce(excluded.image_url, public.site_update_notes.image_url),
  status = coalesce(excluded.status, public.site_update_notes.status);

insert into public.site_update_notes (version, title, summary, note, image_url, status)
select 'v2.0.9', 'Control Hub', 'Kontrol merkezi, sezon/bölüm takibi, yayın takvimi ve koleksiyon alanı eklendi.', 'Arşiv yönetimi sezon ve koleksiyon odaklı hale getirildi.', 'previews/hayatimiz-oyun-v209-desktop-preview.png', 'published'
where not exists (select 1 from public.site_update_notes where version = 'v2.0.9' and title = 'Control Hub')
on conflict (version,title) do update set
  summary = coalesce(excluded.summary, public.site_update_notes.summary),
  note = coalesce(excluded.note, public.site_update_notes.note),
  image_url = coalesce(excluded.image_url, public.site_update_notes.image_url),
  status = coalesce(excluded.status, public.site_update_notes.status);

insert into public.site_update_notes (version, title, summary, note, image_url, status)
select 'v2.1.0', 'AI Archive Studio', 'AI öneri paneli, bildirim merkezi, izleme ilerlemesi ve tema presetleri eklendi.', 'Kişiselleştirme ve otomasyon altyapısı genişletildi.', 'previews/hayatimiz-oyun-v210-desktop-preview.png', 'published'
where not exists (select 1 from public.site_update_notes where version = 'v2.1.0' and title = 'AI Archive Studio')
on conflict (version,title) do update set
  summary = coalesce(excluded.summary, public.site_update_notes.summary),
  note = coalesce(excluded.note, public.site_update_notes.note),
  image_url = coalesce(excluded.image_url, public.site_update_notes.image_url),
  status = coalesce(excluded.status, public.site_update_notes.status);

insert into public.site_update_notes (version, title, summary, note, image_url, status)
select 'v2.1.1', 'Test Center', 'Test merkezi, hata raporları, API/ENV paneli ve rollback planı eklendi.', 'Akşam testleri için hata yakalama ve kontrol merkezi oluşturuldu.', 'previews/hayatimiz-oyun-v211-desktop-preview.png', 'published'
where not exists (select 1 from public.site_update_notes where version = 'v2.1.1' and title = 'Test Center')
on conflict (version,title) do update set
  summary = coalesce(excluded.summary, public.site_update_notes.summary),
  note = coalesce(excluded.note, public.site_update_notes.note),
  image_url = coalesce(excluded.image_url, public.site_update_notes.image_url),
  status = coalesce(excluded.status, public.site_update_notes.status);

insert into public.site_update_notes (version, title, summary, note, image_url, status)
select 'v2.1.2', 'Kullanıcı Menüleri + Bakım', 'Teknik menüler kullanıcıdan kaldırıldı ve bakım modu güçlendirildi.', 'Yönetim paneli kullanıcı arayüzünden ayrıldı.', 'previews/hayatimiz-oyun-v212-desktop-preview.png', 'published'
where not exists (select 1 from public.site_update_notes where version = 'v2.1.2' and title = 'Kullanıcı Menüleri + Bakım')
on conflict (version,title) do update set
  summary = coalesce(excluded.summary, public.site_update_notes.summary),
  note = coalesce(excluded.note, public.site_update_notes.note),
  image_url = coalesce(excluded.image_url, public.site_update_notes.image_url),
  status = coalesce(excluded.status, public.site_update_notes.status);

insert into public.site_update_notes (version, title, summary, note, image_url, status)
select 'v2.1.3', 'Stabilizasyon + Koleksiyon Fix', 'Sürüm karışıklığı temizlendi, koleksiyon sistemi genişletildi ve kurulum notları düzenlendi.', 'v2.1.3 ile package, README, schema, update notes ve plan/tamamlanan klasörleri aynı sürüm çizgisine çekildi. Koleksiyonlar durum, tür, etiket, seri ve favoriye göre dinamik hesaplanır.', 'previews/hayatimiz-oyun-v213-stabilizasyon-preview.png', 'published'
where not exists (select 1 from public.site_update_notes where version = 'v2.1.3' and title = 'Stabilizasyon + Koleksiyon Fix')
on conflict (version,title) do update set
  summary = coalesce(excluded.summary, public.site_update_notes.summary),
  note = coalesce(excluded.note, public.site_update_notes.note),
  image_url = coalesce(excluded.image_url, public.site_update_notes.image_url),
  status = coalesce(excluded.status, public.site_update_notes.status);



alter table public.site_users disable row level security;
alter table public.games disable row level security;
alter table public.site_features disable row level security;
alter table public.site_runtime_config disable row level security;
alter table public.site_admin_planner disable row level security;
alter table public.site_admin_notes disable row level security;
alter table public.site_update_notes disable row level security;

notify pgrst, 'reload schema';


insert into public.site_update_notes (version, title, summary, note, image_url, status, created_at)
values ('v2.1.6', 'Büyük Arşiv Otomasyonu + Bölüm Yönetimi', 'Playlistten tüm bölümleri çekme, bölüm bazlı izleme, site içi seri oynatıcı ve admin sağlık paneli eklendi.', 'v2.1.6 ile YouTube playlist URL’sinden bölüm başlıkları/kapakları/video linkleri forma işlenir. Seriyi İzle ekranı ayrı site sayfası gibi açılır; solda oynatıcı, sağda bölüm listesi görünür. Bölüm bazlı izlendi işaretleme, kompakt/liste görünümü, seri gruplama, sıra numarası ve hatalı YouTube link sağlık paneli eklendi.', 'previews/hayatimiz-oyun-v216-bolum-yonetimi-preview.png', 'published', now())
on conflict (version, title) do update set summary = excluded.summary, note = excluded.note, image_url = excluded.image_url, status = excluded.status;

-- v2.1.3 ek güvenli kolonlar ve hazır modüller
alter table public.games add column if not exists tags text;
alter table public.games add column if not exists rawg_slug text;
alter table public.games add column if not exists auto_cover_source text;

insert into public.site_features (key, title, description, enabled, updated_at)
select 'game_auto_meta_fetch', 'Oyun adından tür, etiket ve açıklama otomatik çekme', 'Oyun adını yazınca tür, etiket ve önerilen kapak doldurma modülünü açar.', false, now()
where not exists (select 1 from public.site_features where key = 'game_auto_meta_fetch');

insert into public.site_features (key, title, description, enabled, updated_at)
select 'feature_edit_delete', 'Akıllı özelliklerde düzenleme ve silme sistemi', 'Özellik kartlarında düzenle, sil ve pasife al işlemlerini görünür yapar.', true, now()
where not exists (select 1 from public.site_features where key = 'feature_edit_delete');

insert into public.site_admin_planner (group_name, title, status, feature_key)
select 'Siteye Gelmesi Gerekenler', 'Oyun adından tür, etiket ve açıklama otomatik çekme', 'plan', 'game_auto_meta_fetch'
where not exists (select 1 from public.site_admin_planner where feature_key = 'game_auto_meta_fetch');

insert into public.site_admin_planner (group_name, title, status, feature_key)
select 'Eklenen Özellikler', 'Akıllı özelliklerde düzenleme ve silme sistemi', 'tamam', 'feature_edit_delete'
where not exists (select 1 from public.site_admin_planner where feature_key = 'feature_edit_delete');


-- v2.1.2 oyun yönetimi alanları
alter table public.games add column if not exists series_name text;
alter table public.games add column if not exists playlist_url text;
alter table public.games add column if not exists description text;
alter table public.games add column if not exists favorite_count integer default 0;


-- v2.1.5 gerçek Storage + gelişmiş izleme kolonları
alter table public.games add column if not exists watched_episode_count integer default 0;
alter table public.games add column if not exists series_order integer default 0;
alter table public.games add column if not exists video_url text;

-- v2.1.6 bölüm yönetimi ve playlist import kolonları
alter table public.games add column if not exists episodes jsonb not null default '[]'::jsonb;
alter table public.games add column if not exists last_playlist_import_at timestamptz;
alter table public.site_update_notes add column if not exists updated_at timestamptz;

-- Supabase Storage bucket: profile-photos
-- Supabase SQL Editor storage şeması açıksa bucket otomatik oluşturulur. Hata verirse Supabase Dashboard > Storage > New bucket > profile-photos > Public ile manuel oluştur.
insert into storage.buckets (id, name, public)
select 'profile-photos', 'profile-photos', true
where exists (select 1 from information_schema.tables where table_schema='storage' and table_name='buckets')
and not exists (select 1 from storage.buckets where id='profile-photos');

insert into public.site_update_notes (version, title, summary, note, image_url, status, updated_at)
values ('v2.1.5 FIX', 'Stabil Fix + Sürekli Güncellenen Schema', 'Site açılışındaki firstLetter hatası giderildi; schema.sql tekrar çalıştırıldığında güncelleme notları artık üstüne yazılarak güncellenir.', 'v2.1.5 FIX ile alfabetik arşiv, yönetim paneli oyun kartı, site içi seri izleme ve schema dönüş mesajı düzeltildi. Supabase güncelleme notları için version+title benzersiz indeksi ve upsert mantığı eklendi. schema_version kaydı her çalıştırmada en güncel sürüme çekilir.', 'previews/hayatimiz-oyun-v2151-fix-preview.png', 'published', now())
on conflict (version, title) do update set
  summary = excluded.summary,
  note = excluded.note,
  image_url = excluded.image_url,
  status = excluded.status,
  updated_at = now();

insert into public.site_update_notes (version, title, summary, note, image_url, status, updated_at)
values ('v2.1.5', 'Gerçek Storage + Gelişmiş İzleme', 'Profil fotoğrafı gerçek Storage yüklemeye bağlandı; seriyi izle ekranı, bölüm takibi ve aktif harf görünümü eklendi.', 'v2.1.5 ile profile-photos bucket, manuel/izlenen bölüm ayrımı, seri sıra no, YouTube izleme detay ekranı, güncelleme notu düzenle/sil API uçları ve admin kapak oranı düzeltmesi tamamlandı.', 'previews/hayatimiz-oyun-v215-storage-izleme-preview.png', 'published', now())
on conflict (version, title) do update set
  summary = excluded.summary,
  note = excluded.note,
  image_url = excluded.image_url,
  status = excluded.status,
  updated_at = now();


-- v2.1.8 yayın takvimi ve gelişmiş medya yönetimi
alter table public.games add column if not exists playlist_sync_hash text default '';
alter table public.games add column if not exists last_playlist_sync_at timestamptz;
alter table public.games add column if not exists episode_progress_updated_at timestamptz;

insert into public.site_runtime_config (key, value, updated_at)
values ('schema_version', jsonb_build_object('version','v2.1.8','applied_at', now(), 'note', 'Yayın takvimi ve gelişmiş medya yönetimi aktif'), now())
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into public.site_update_notes (version, title, summary, note, image_url, status, updated_at)
values ('v2.1.8', 'Tam Otomatik Yayın Takvimi + Gelişmiş Medya Yönetimi', 'Bölüm yayın tarihi, burada kaldım/geri al, sırayla izle, sinema modu, toplu playlist ve kapak yönetimi eklendi.', 'v2.1.8 ile bölümlere yayın tarihi ve not alanı, klavye kısayolları, tam ekran sinema modu, sıradaki oyuna geçiş, bölüm izlendi geri alma, ayrı seri sıralama paneli, toplu kapak yenileme, toplu playlist senkronizasyonu ve kullanıcıya özel bakım notları tamamlandı.', 'previews/hayatimiz-oyun-v218-yayin-takvimi-medya-preview.png', 'published', now())
on conflict (version, title) do update set summary = excluded.summary, note = excluded.note, image_url = excluded.image_url, status = excluded.status, updated_at = now();



-- v2.1.9 Bildirim Merkezi, bölüm yorumları ve toplu işlem geçmişi
create table if not exists public.site_notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text,
  type text default 'info',
  is_read boolean not null default false,
  target_game_id text,
  target_episode_index integer,
  created_at timestamptz not null default now()
);

create table if not exists public.site_episode_comments (
  id uuid primary key default gen_random_uuid(),
  game_id text not null,
  episode_index integer not null default 0,
  comment text not null,
  actor_email text,
  created_at timestamptz not null default now()
);

create table if not exists public.site_bulk_operations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  details jsonb default '{}'::jsonb,
  actor_email text,
  can_undo boolean not null default false,
  undone_at timestamptz,
  created_at timestamptz not null default now()
);

insert into public.site_runtime_config(key,value,updated_at)
values ('schema_version', jsonb_build_object('version','v2.1.9','applied_at', now(), 'note', 'Bildirim merkezi aktif'), now())
on conflict (key) do update set value=excluded.value, updated_at=now();

insert into public.site_update_notes(version,title,summary,note,status,created_at)
values ('v2.1.9','Yayın Otomasyonu + Bildirim Merkezi','Bildirim merkezi, daha büyük sitede izleme ekranı, bölüm yorumları ve izleme geçmişi eklendi.','YouTube yeni video kontrol altyapısı, yaklaşan bölüm bildirimi, rozetli/sesli bildirim merkezi, tümünü izle akışı, ayrı Seri İzleme yönetim kategorisi ve profesyonel medya raporu hazırlandı.','published',now())
on conflict (version,title) do update set summary=excluded.summary, note=excluded.note, status='published';




-- v2.2.0 Profesyonel arşiv UI + kullanıcı bazlı bildirim tercihleri
create table if not exists public.site_notification_preferences (
  id uuid primary key default gen_random_uuid(),
  user_email text not null,
  new_videos boolean not null default true,
  releases boolean not null default true,
  maintenance boolean not null default true,
  email_notifications boolean not null default false,
  updated_at timestamptz not null default now(),
  unique(user_email)
);

create table if not exists public.site_user_notification_reads (
  id uuid primary key default gen_random_uuid(),
  user_email text not null,
  notification_key text not null,
  read_at timestamptz not null default now(),
  unique(user_email, notification_key)
);

insert into public.site_runtime_config(key,value,updated_at)
values ('schema_version', jsonb_build_object('version','v2.2.0','applied_at', now(), 'note', 'Profesyonel arşiv UI ve bildirim tercihleri aktif'), now())
on conflict (key) do update set value=excluded.value, updated_at=now();

insert into public.site_update_notes(version,title,summary,note,status,created_at)
values ('v2.2.0','Tam Otomatik YouTube Senkron + Profesyonel Arşiv UI','Bildirim butonları düzeltildi, Seriyi İzle ekranı büyütüldü ve arayüz profesyonel oyun arşivi paneline çevrildi.','Sol kategori menüsü, üst navigasyon, sağ profil/istatistik paneli, öne çıkan oyunlar, devam eden seriler, yaklaşan yayınlar ve kullanıcı bildirim tercihleri eklendi.','published',now())
on conflict (version,title) do update set summary=excluded.summary, note=excluded.note, status='published';



-- v2.2.0 FIX 6 FINAL - profesyonel UI, doğru tarihli yayın takvimi ve yönetimden takvim düzenleme
create table if not exists public.site_calendar_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date date not null,
  event_time text default '20:00',
  event_type text default 'Ana Yayın',
  game_id text,
  cover_url text,
  note text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.site_calendar_events add column if not exists title text;
alter table public.site_calendar_events add column if not exists event_date date;
alter table public.site_calendar_events add column if not exists event_time text default '20:00';
alter table public.site_calendar_events add column if not exists event_type text default 'Ana Yayın';
alter table public.site_calendar_events add column if not exists game_id text;
alter table public.site_calendar_events add column if not exists cover_url text;
alter table public.site_calendar_events add column if not exists note text;
alter table public.site_calendar_events add column if not exists is_active boolean not null default true;
alter table public.site_calendar_events add column if not exists created_at timestamptz not null default now();
alter table public.site_calendar_events add column if not exists updated_at timestamptz not null default now();
create index if not exists site_calendar_events_event_date_idx on public.site_calendar_events(event_date);

insert into public.site_runtime_config(key,value,updated_at)
values ('schema_version', jsonb_build_object('version','v2.2.0 FIX 6 FINAL','applied_at', now(), 'note', 'Final profesyonel UI, otomatik kapak alanı ve yönetilebilir yayın takvimi aktif'), now())
on conflict (key) do update set value=excluded.value, updated_at=now();

insert into public.site_update_notes(version,title,summary,note,status,created_at)
values ('v2.2.0 FIX 6 FINAL','Referans UI Final Fix + Yayın Takvimi Yönetimi','Ana sayfa, seriler ve oyun ekleme ekranı profesyonelleştirildi; yayın takvimi yönetim panelinden düzenlenebilir hale getirildi.','Kapaklar kırpılmadan/bozulmadan gösterilir. Oyun formunda Meta + Kapakları Getir ve Kapakları Otomatik Çek butonları güçlendirildi. Çıkış tarihi gün.ay.yıl formatında görünür. Supabase tarafına site_calendar_events tablosu eklendi ve schema_version en güncel FIX 6 FINAL olarak güncellendi.','published',now())
on conflict (version,title) do update set summary=excluded.summary, note=excluded.note, status='published';

select 'Hayatimiz Oyun v2.2.0 FIX 6 FINAL schema hazir. Takvim tablosu, profesyonel UI ve otomatik kapak fixleri aktif.' as status;


-- v2.2.0 FIX 7 - alfabetik şerit, kapaklı seri sıralama, gelişmiş yayın takvimi
alter table public.site_calendar_events add column if not exists game_title text;
alter table public.site_calendar_events add column if not exists episode_number text;
alter table public.site_calendar_events add column if not exists episode_title text;
alter table public.site_calendar_events add column if not exists raw_meta jsonb default '{}'::jsonb;
create index if not exists site_calendar_events_game_id_idx on public.site_calendar_events(game_id);
create index if not exists site_calendar_events_event_type_idx on public.site_calendar_events(event_type);

insert into public.site_runtime_config(key,value,updated_at)
values ('schema_version', jsonb_build_object('version','v2.2.0 FIX 7','applied_at', now(), 'note', 'Alfabetik şeritler, kapaklı seri sıralama ve gelişmiş takvim yönetimi aktif'), now())
on conflict (key) do update set value=excluded.value, updated_at=now();

insert into public.site_update_notes(version,title,summary,note,status,created_at)
values ('v2.2.0 FIX 7','Alfabetik Şerit + Kapaklı Seri ve Takvim Fix','Seriler ve oyun arşivi alfabetik şerit/harfe git yapısına alındı; yönetim panelinde kapaklı seri sıralama ve oyun seçmeli yayın takvimi eklendi.','Oyun Arşivi ve Seriler sayfasında harf başlığı ve harfe git şeridi aktif. Yönetim panelindeki seri sıralama kapaklı kartlara çevrildi. Yayın Takvimi formunda oyun seçme, bölüm numarası, bölüm başlığı, otomatik kapak/meta çekme ve Supabase için ek takvim alanları eklendi. Gelecek güncelleme planı tamamlanan maddelerden temizlendi.','published',now())
on conflict (version,title) do update set summary=excluded.summary, note=excluded.note, status='published';

select 'Hayatimiz Oyun v2.2.0 FIX 7 schema hazir. Alfabetik seritler, kapakli seri siralama ve gelismis takvim alanlari aktif.' as status;

-- v2.2.0 FIX 8 - profesyonel panel, oyun isteği ve hata bildirimi
create table if not exists public.site_game_requests (
  id uuid primary key default gen_random_uuid(),
  game_title text not null,
  series_name text,
  requester_email text,
  note text,
  status text not null default 'Yeni',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists site_game_requests_status_idx on public.site_game_requests(status);
create index if not exists site_game_requests_created_at_idx on public.site_game_requests(created_at desc);

create table if not exists public.site_bug_reports (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  page_name text,
  reporter_email text,
  description text not null,
  status text not null default 'Yeni',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists site_bug_reports_status_idx on public.site_bug_reports(status);
create index if not exists site_bug_reports_created_at_idx on public.site_bug_reports(created_at desc);

alter table public.site_calendar_events add column if not exists game_title text;
alter table public.site_calendar_events add column if not exists episode_number text;
alter table public.site_calendar_events add column if not exists episode_title text;
alter table public.site_calendar_events add column if not exists raw_meta jsonb default '{}'::jsonb;

insert into public.site_runtime_config(key,value,updated_at)
values ('schema_version', jsonb_build_object('version','v2.2.0 FIX 8','applied_at', now(), 'note', 'Taşmayan arşiv kartları, ayrı oyun ekleme/mevcut oyunlar, seri sıralama arama, oyun isteği, hata bildirimi ve bakım modu fixleri aktif'), now())
on conflict (key) do update set value=excluded.value, updated_at=now();

insert into public.site_update_notes(version,title,summary,note,status,created_at)
values ('v2.2.0 FIX 8','Profesyonel Panel + İstek/Hata Sistemi Fix','Oyun arşivi ve seriler taşmayan grid yapısına alındı; yönetim panelinde oyun ekleme/mevcut oyunlar ayrıldı; oyun isteği, hata bildirimi ve bakım modu güçlendirildi.','Yayın takvimi sadece devam eden oyunları seçer, takvim kayıtları düzenlenip silinebilir. Seri sıralama arama kutusu ve seri seçme butonlarıyla düzenlendi. Oyun ekleme formuna durum butonları ve Türkçe tür önerisi eklendi. Gelecek güncelleme planından tamamlanan eski maddeler temizlendi.','published',now())
on conflict (version,title) do update set summary=excluded.summary, note=excluded.note, status='published';

select 'Hayatimiz Oyun v2.2.0 FIX 8 schema hazir. Oyun istegi, hata bildirimi, takvim ve panel fixleri aktif.' as status;

-- v2.2.0 FIX 9 - duzenleme, takvim, bakim yuzdesi ve seri siralama fixleri
create table if not exists public.site_maintenance_updates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  note text,
  percent integer default 0 check (percent >= 0 and percent <= 100),
  is_visible boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table if exists public.site_calendar_events add column if not exists is_manual boolean default true;
alter table if exists public.site_calendar_events add column if not exists updated_at timestamptz default now();
alter table if exists public.site_calendar_events add column if not exists game_status text;

insert into public.site_runtime_config (key,value,updated_at)
values ('schema_version', jsonb_build_object('version','v2.2.0 FIX 9 SCHEMA FIX','applied_at', now(), 'note', 'site_update_notes written kolon hatasi duzeltildi; note kolonu kullaniliyor'), now())
on conflict (key) do update set value=excluded.value, updated_at=now();

insert into public.site_update_notes (version,title,summary,note,status,created_at)
values ('v2.2.0 FIX 9','Düzenleme + Takvim + Bakım + Seri Sıralama Fix','Mevcut oyun düzenleme formu düzeltildi; yayın takviminde düzenle/sil akışı temizlendi; bakım moduna yüzde ve güncellenebilir notlar eklendi; seri sıralama sürükle-bırak otomatik kayıt yapar.','Bu fix yeni sürüm değildir. Güncellemelere geçmeden önce yönetim panelindeki bozuk düzenleme, takvim, bakım modu ve seri sıralama akışlarını stabil hale getirir.','published',now())
on conflict (version,title) do update set summary=excluded.summary, note=excluded.note, status='published';

select 'Hayatimiz Oyun v2.2.0 FIX 9 SCHEMA FIX hazir. written kolon hatasi duzeltildi, note kolonu kullaniliyor.' as status;

-- v2.2.0 FIX 10 - duzenleme, kompakt arsiv, detayli hikaye/tur ve istek/hata panel fixleri
alter table if exists public.site_game_requests add column if not exists updated_at timestamptz default now();
alter table if exists public.site_game_requests add column if not exists admin_note text;
alter table if exists public.site_bug_reports add column if not exists updated_at timestamptz default now();
alter table if exists public.site_bug_reports add column if not exists admin_note text;
alter table if exists public.games add column if not exists updated_at timestamptz default now();
alter table if exists public.games add column if not exists description text;
alter table if exists public.games add column if not exists genre text;

insert into public.site_runtime_config (key,value,updated_at)
values ('schema_version', jsonb_build_object('version','v2.2.0 FIX 10','applied_at', now(), 'note', 'Düzenleme butonları, detaylı hikaye, türleri tekrar çekme, kompakt arşiv/seri ve istek/hata paneli fixleri aktif'), now())
on conflict (key) do update set value=excluded.value, updated_at=now();

insert into public.site_update_notes (version,title,summary,note,status,created_at)
values ('v2.2.0 FIX 10','Düzenleme + Kompakt Arşiv + İstek/Hata Fix','Mevcut oyun düzenleme butonları güçlendirildi, hikayeyi tekrar çek ve türleri tekrar çek akışı eklendi, oyun arşivi/seriler kompakt hale getirildi, istek ve hata panelleri profesyonelleştirildi.','Bu fix yeni büyük güncelleme değildir. Güncellemelere geçmeden önce oyun ekleme/düzenleme, arşiv görünümü, seri görünümü, oyun isteği ve hata bildirimi tarafındaki stabilizasyonu tamamlar.','published',now())
on conflict (version,title) do update set summary=excluded.summary, note=excluded.note, status='published';

select 'Hayatimiz Oyun v2.2.0 FIX 10 schema hazir. Duzenleme, kompakt arsiv, istek ve hata panel fixleri aktif.' as status;

-- v2.2.0 FIX 13 - 4 kolon arsiv/seri, profesyonel form, bakım görselleri
alter table if exists public.games add column if not exists updated_at timestamptz default now();
alter table if exists public.site_runtime_config add column if not exists updated_at timestamptz default now();

insert into public.site_runtime_config (key,value,updated_at)
values ('schema_version', jsonb_build_object('version','v2.2.0 FIX 13','applied_at', now(), 'note', '4 kolon oyun arsivi/seriler, alfabetik harfe git, bos oyun ekleme formu, modal duzenleme ve profesyonel bakim/istek/hata gorunumu aktif'), now())
on conflict (key) do update set value=excluded.value, updated_at=now();

insert into public.site_update_notes (version,title,summary,note,status,created_at)
values ('v2.2.0 FIX 13','Kart Yazı Görünürlüğü + Form Butonları + İstek/Hata Fix','Oyun Arşivi ve Serilerde kart yazılarının tam görünmesi sağlandı; Tamamlanan/Devam Eden/Yakında butonları eklendi; Hikayeyi Tekrar Çek ve Türleri Tekrar Çek butonları formu silmeden çalışacak şekilde düzeltildi; Oyun İste ve Hata Bildir metin alanları profesyonelleştirildi.','Bu fix yeni büyük güncelleme değildir. Güncellemelere geçmeden önce kart görünürlüğü, oyun formu butonları, Türkçe hikaye/tür çekme ve kullanıcı istek/hata ekranları stabilize edilmiştir.','published',now())
on conflict (version,title) do update set summary=excluded.summary, note=excluded.note, status='published';

select 'Hayatimiz Oyun v2.2.0 FIX 13 schema hazir. Kart yazilari, durum butonlari, hikaye/tur cekme ve profesyonel istek/hata formlari aktif.' as status;

-- v2.2.0 FIX 14 - cikis tarihi g.a.y format fix
insert into public.site_runtime_config (key,value,updated_at)
values ('schema_version', jsonb_build_object('version','v2.2.0 FIX 14','applied_at', now(), 'note', 'Cikis tarihi cekme gun.ay.yil formatinda forma islenir'), now())
on conflict (key) do update set value=excluded.value, updated_at=now();

insert into public.site_update_notes (version,title,summary,note,status,created_at)
values ('v2.2.0 FIX 14','Çıkış Tarihi Format Fix','Oyun ekleme ve düzenleme ekranında tarih çekme gün.ay.yıl formatına sabitlendi.','Meta + Kapak Çek artık çıkış tarihini de forma işler. RAWG sonuçları ve yerel fallback tarihleri gün.ay.yıl formatında gösterilir.','published',now())
on conflict do nothing;

select 'Hayatimiz Oyun v2.2.0 FIX 14 schema hazir. Cikis tarihi gun.ay.yil format fix aktif.' as status;

-- v2.2.1 - plan uygulaması: feedback durumları, çözüm notu, görünüm ayarları, takvim ve seri sıralama
alter table if exists public.site_game_requests add column if not exists admin_note text;
alter table if exists public.site_game_requests add column if not exists updated_at timestamptz default now();
alter table if exists public.site_bug_reports add column if not exists admin_note text;
alter table if exists public.site_bug_reports add column if not exists solution_note text;
alter table if exists public.site_bug_reports add column if not exists updated_at timestamptz default now();
alter table if exists public.games add column if not exists series_order integer default 0;
alter table if exists public.games add column if not exists updated_at timestamptz default now();
alter table if exists public.site_calendar_events add column if not exists updated_at timestamptz default now();
alter table if exists public.site_runtime_config add column if not exists updated_at timestamptz default now();

insert into public.site_runtime_config (key,value,updated_at)
values ('schema_version', jsonb_build_object('version','v2.2.1 FIX 1','applied_at', now(), 'note', 'v2.2.1 FIX 1: kompakt kart görünümü düzeltildi, oyun arşivi ve seriler 4 kolon profesyonel kart yapısına alındı.'), now())
on conflict (key) do update set value=excluded.value, updated_at=now();

insert into public.site_update_notes (version,title,summary,note,status,created_at)
values ('v2.2.1','Plan Uygulaması','Oyun istekleri ve hata bildirimleri durum yönetimine bağlandı; takvimde ay/hafta/gün geçişi, sürükle-bırak seri sıralama, arşiv görünüm modları ve spoilersız hikaye çekme eklendi.','Bu sürüm v2.2.1 plan dosyasındaki maddeleri uygular. Yetkililer istek/hata durumlarını değiştirebilir, çözüm notu ekleyebilir, seri sıralamasını sürükle-bırak ile yapabilir ve kullanıcılar arşiv görünümünü kompakt/detaylı/poster/yatay kart olarak değiştirebilir.','published',now())
on conflict (version,title) do update set summary=excluded.summary, note=excluded.note, status='published';

select 'Hayatimiz Oyun v2.2.1 FIX 1 schema hazir. Kompakt kart gorunumu duzeltildi.' as status;


-- v2.2.1 FIX 2 - publicHighlights açılış hatası düzeltmesi
insert into public.site_runtime_config (key,value,updated_at)
values ('schema_version', jsonb_build_object('version','v2.2.1 FIX 2','applied_at', now(), 'note', 'publicHighlights undefined ilk acilis hatasi duzeltildi'), now())
on conflict (key) do update set value=excluded.value, updated_at=now();

insert into public.site_update_notes (version,title,summary,note,status,created_at)
values ('v2.2.1 FIX 2','İlk Açılış publicHighlights Hata Fix','Site ilk açılışta publicHighlights is not defined hatası vermeyecek şekilde düzeltildi.','v2.2.1 FIX 1 sonrası bazı tarayıcılarda ilk yüklemede publicHighlights isimli eski fonksiyona referans kalıyordu. Bu paket publicStats üzerinden güvenli fallback ekler ve hata ekranının çıkmasını engeller.','published',now())
on conflict do nothing;

select 'Hayatimiz Oyun v2.2.1 FIX 2 schema hazir. publicHighlights ilk acilis hatasi duzeltildi.' as status;

-- v2.2.2 - plan uygulaması
create table if not exists public.site_user_preferences (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  archive_view_mode text default 'compact',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.site_calendar_reminders (
  id uuid primary key default gen_random_uuid(),
  email text,
  event_id text,
  title text,
  remind_at text,
  is_sent boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.site_series_order_history (
  id uuid primary key default gen_random_uuid(),
  series_name text,
  game_ids jsonb default '[]'::jsonb,
  user_email text,
  created_at timestamptz default now()
);

alter table if exists public.site_game_requests add column if not exists admin_note text;
alter table if exists public.site_game_requests add column if not exists updated_at timestamptz default now();
alter table if exists public.site_bug_reports add column if not exists solution_note text;
alter table if exists public.site_bug_reports add column if not exists admin_note text;
alter table if exists public.site_bug_reports add column if not exists updated_at timestamptz default now();

insert into public.site_runtime_config (key,value,updated_at)
values ('schema_version', jsonb_build_object('version','v2.2.2','applied_at', now(), 'note', 'Tur onerileri guclendirildi, takvim hatirlatici, gorunum tercihi, seri siralama gecmisi, filtreli raporlar ve hikaye tekrar cek duzeltmesi aktif'), now())
on conflict (key) do update set value=excluded.value, updated_at=now();

insert into public.site_update_notes (version,title,summary,note,status,created_at)
values ('v2.2.2','Plan Uygulaması','Oyun türü önerileri güçlendirildi, takvim hatırlatıcıları eklendi, arşiv görünüm tercihleri Supabase profiline kaydedilir hale getirildi, seri sıralama işlem geçmişi ve istek/hata filtreli rapor ekranı eklendi.','Spoilersız hikaye butonu kaldırıldı. Hikayeyi Tekrar Çek artık oyunla ilgili daha doğru Türkçe hikaye/bilgi metni üretir.','published',now())
on conflict (version,title) do update set summary=excluded.summary, note=excluded.note, status='published';

select 'Hayatimiz Oyun v2.2.2 schema hazir. Plan uygulamasi aktif.' as status;


-- v2.2.3 - plan uygulaması
alter table if exists public.site_calendar_reminders add column if not exists channel text default 'browser';
alter table if exists public.site_calendar_reminders add column if not exists sent_at timestamptz;
alter table if exists public.site_calendar_reminders add column if not exists status text default 'pending';
alter table if exists public.site_series_order_history add column if not exists restored_at timestamptz;
alter table if exists public.site_game_requests add column if not exists converted_game_id text;
alter table if exists public.site_bug_reports add column if not exists screenshot_url text;

create table if not exists public.site_ai_feature_applications (
  id uuid primary key default gen_random_uuid(),
  version text,
  feature_key text,
  title text,
  target text,
  description text,
  next_feature text,
  actor_email text,
  created_at timestamptz default now()
);

create table if not exists public.site_notification_queue (
  id uuid primary key default gen_random_uuid(),
  email text,
  title text,
  message text,
  channel text default 'browser',
  status text default 'pending',
  created_at timestamptz default now(),
  sent_at timestamptz
);

insert into public.site_runtime_config (key,value,updated_at)
values ('schema_version', jsonb_build_object('version','v2.2.3','applied_at', now(), 'note', 'Hatirlatici bildirimi, seri siralama geri alma, oyun isteklerinden tek tikla oyun ekleme, hata ekran goruntusu ve AI ozellik merkezi aktif'), now())
on conflict (key) do update set value=excluded.value, updated_at=now();

insert into public.site_update_notes (version,title,summary,note,status,created_at)
values ('v2.2.3','Plan Uygulaması','Hatırlatıcıların tarayıcı/e-posta kuyruğu altyapısı, seri sıralama geçmişinde geri alma, oyun isteklerinden tek tıkla oyun ekleme, hata bildirimlerine ekran görüntüsü ve AI özellik merkezi eklendi.','Yönetim panelindeki AI Özellik Merkezi üzerinden versiyon versiyon özellik önerisi oluşturulabilir, uygulandı olarak işaretlenebilir ve gelecek versiyon planı güncellenebilir.','published',now())
on conflict (version,title) do update set summary=excluded.summary, note=excluded.note, status='published';

select 'Hayatimiz Oyun v2.2.3 schema hazir. Plan uygulamasi aktif.' as status;

-- v2.2.3 FIX 1 - açılış/UI stabil fix
insert into public.site_runtime_config (key,value,updated_at)
values ('schema_version', jsonb_build_object('version','v2.2.3 FIX 1','applied_at', now(), 'note', 'submitBugReportFix8 acilis hatasi duzeltildi; kompakt/yakinda kartlari ve AI Ozellik Merkezi menusu stabil hale getirildi'), now())
on conflict (key) do update set value=excluded.value, updated_at=now();

insert into public.site_update_notes (version,title,summary,note,status,created_at)
values ('v2.2.3 FIX 1','Acilis Hata Fix + UI Stabil','submitBugReportFix8 undefined acilis hatasi giderildi; kompakt kartlar, Yakinda pasif kartlari ve AI Ozellik Merkezi menusu stabil hale getirildi.','Site ilk acilista hata ekranina dusmeden acilir. Oyun arsivi/seriler kompakt kart yapisi korunur, Yakinda durumundaki kartlar gri ve tiklanamaz kalir. Yonetim panelinde AI Ozellik Merkezi menusu net gorunur.','published',now())
on conflict (version,title) do update set summary=excluded.summary, note=excluded.note, status='published';

select 'Hayatimiz Oyun v2.2.3 FIX 1 schema hazir. Acilis hatasi ve UI stabil fix aktif.' as status;

-- v2.2.3 FIX 3 - oyun ekleme ve AI özellik merkezi stabil fix
insert into public.site_runtime_config (key,value,updated_at)
values ('schema_version', jsonb_build_object('version','v2.2.3 FIX 3','applied_at', now(), 'note', 'Oyun ekleme formu, mevcut oyun düzenleme ve AI Özellik Merkezi yeni buton akışı stabil hale getirildi'), now())
on conflict (key) do update set value=excluded.value, updated_at=now();

insert into public.site_update_notes (version,title,summary,note,status,created_at)
values ('v2.2.3 FIX 3','Oyun Ekle + AI Özellik Merkezi Stabil Fix','Oyun ekleme formu ve AI Özellik Merkezi yeni buton hataları düzeltildi.','Oyun ekleme formu artık butonlara basınca sıfırlanmaz. Meta + Kapak Çek, Hikayeyi Tekrar Çek ve Türleri Tekrar Çek formu koruyarak çalışır. Mevcut oyun düzenleme modalı korunur. AI Özellik Merkezi menüsü ve versiyona uygula butonları hata vermeden plan/geçmiş kaydı üretir.','published',now())
on conflict (version,title) do update set summary=excluded.summary, note=excluded.note, status=excluded.status, created_at=excluded.created_at;

select 'Hayatimiz Oyun v2.2.3 FIX 3 schema hazir. Oyun ekleme ve AI Ozellik Merkezi stabil fix aktif.' as status;

-- v2.2.3 FIX 3 schema marker
insert into public.site_runtime_config (key,value,updated_at) values ('schema_version', jsonb_build_object('version','v2.2.3 FIX 3','note','AI Ozellik Ekle ayri panel ve oyun ekle stabil fix'), now()) on conflict (key) do update set value=excluded.value, updated_at=now();
select 'Hayatimiz Oyun v2.2.3 FIX 3 schema hazir. AI ayri panel ve oyun ekle stabil fix aktif.' as status;

-- v2.2.3 FIX 4 - Seri sıralama eski buton düzeni + AI özellik 10 öneri akışı
alter table if exists public.site_ai_feature_applications add column if not exists github_status text default 'pakete işlendi';
alter table if exists public.site_ai_feature_applications add column if not exists vercel_status text default 'redeploy gerekli';
alter table if exists public.site_ai_feature_applications add column if not exists supabase_status text default 'kaydedildi';
alter table if exists public.site_ai_feature_applications add column if not exists deployment_note text;
alter table if exists public.site_ai_feature_applications add column if not exists sql_patch text;

insert into public.site_runtime_config (key,value,updated_at)
values ('schema_version', jsonb_build_object('version','v2.2.3 FIX 4','applied_at', now(), 'note', 'Seri siralama ust butonlu eski duzene alindi; AI Ozellik Ekle sayfasina 10 onerili Yeni Ozellik Onerileri ve Siteye Uygulandi akisi eklendi'), now())
on conflict (key) do update set value=excluded.value, updated_at=now();

insert into public.site_update_notes (version,title,summary,note,status,created_at)
values ('v2.2.3 FIX 4','Seri Sıralama + AI Özellik Akışı Fix','Seri sıralama yönetimi üst butonlu eski düzene alındı. AI Özellik Ekle panelinde 10 profesyonel öneri, Siteye Uygulandı akışı ve Supabase kayıt alanları eklendi.','AI Özellik Ekle artık Oyun Ekle ekranından tamamen ayrıdır. Yeni Özellik Önerileri sekmesi her zaman en fazla 10 öneri gösterir. Öneri uygulanınca Siteye Uygulandı geçmişine alınır, listeden çıkar ve yerine yeni öneri gelir. Supabase kayıt alanları GitHub/Vercel/Supabase aktarım durumunu tutacak şekilde genişletildi.','published',now())
on conflict (version,title) do update set summary=excluded.summary, note=excluded.note, status=excluded.status, created_at=excluded.created_at;

select 'Hayatimiz Oyun v2.2.3 FIX 4 schema hazir. Seri siralama ve AI Ozellik akisi aktif.' as status;


select 'Hayatimiz Oyun v2.2.3 FIX 7 schema hazir. Vercel 404 final root fix aktif.' as status;


-- v2.2.3 FIX 8 - Oyun Ekle ve AI Ayrı Stabil
insert into public.site_runtime_config (key,value,updated_at) values ('schema_version', jsonb_build_object('version','v2.2.3 FIX 8','applied_at', now(), 'note', 'Oyun Ekle ile AI Özellik Ekle ayrıldı; v223FixAdminGames açılış hatası giderildi.'), now()) on conflict (key) do update set value=excluded.value, updated_at=now();
select 'Hayatimiz Oyun v2.2.3 FIX 8 schema hazir. Oyun Ekle ve AI Ozellik Ekle ayrimi aktif.' as status;

-- v2.2.3 FIX 9 - Oyun Ekle stabil + AI ayrı sayfa güvenli helper
insert into public.site_runtime_config (key,value,updated_at)
values ('schema_version', jsonb_build_object('version','v2.2.3 FIX 9','applied_at', now(), 'note', 'v223FixAdminGames undefined hatasi giderildi; Oyun Ekle sadece oyun ekleme/düzenleme, AI Özellik Ekle ayrı sayfa olarak sabitlendi.'), now())
on conflict (key) do update set value=excluded.value, updated_at=now();
select 'Hayatimiz Oyun v2.2.3 FIX 9 schema hazir. Oyun Ekle ve AI ayri sayfa stabil fix aktif.' as status;


-- v2.2.3 FIX 10 - Oyun Ekle stabil + AI Özellik Ekle ayrı panel gelişmiş akış
insert into public.site_runtime_config (key,value,updated_at)
values ('schema_version', jsonb_build_object('version','v2.2.3 FIX 10','applied_at', now(), 'note', 'V223_FIX3_GAME_TAB acilis hatasi giderildi; Oyun Ekle sadece oyun ekleme/düzenleme ekranı olarak sabitlendi; AI Özellik Ekle ayrı panelde silme ve nereye eklendiyse git akışı kazandı.'), now())
on conflict (key) do update set value=excluded.value, updated_at=now();

insert into public.site_update_notes (version,title,summary,note,status,created_at)
values ('v2.2.3 FIX 10','Oyun Ekle + AI Özellik Ayrı Panel Stabil Fix','Oyun ekleme butonu hatası giderildi, AI Özellik Ekle oyun formundan tamamen ayrıldı.','Oyun Ekle ekranı artık sadece oyun kaydı ve mevcut oyun düzenleme için çalışır. AI Özellik Ekle panelinde Yeni Özellik Önerileri ve Siteye Uygulandı sekmeleri ayrıdır. Uygulanan özellikler silinebilir ve hedef sayfaya git butonu ile ilgili alana geçilebilir. GitHub temiz gönder BAT dosyası package.json arama mantığıyla düzeltildi.','published',now())
on conflict do nothing;

select 'Hayatimiz Oyun v2.2.3 FIX 10 schema hazir. Oyun Ekle ve AI ayri panel stabil fix aktif.' as status;

-- v2.2.4 - Plan uygulaması: AI SQL onay, deploy kontrol ve rapor panelleri
create table if not exists public.site_ai_sql_drafts (
  id uuid primary key default gen_random_uuid(),
  feature_key text,
  title text,
  sql_text text,
  status text default 'taslak',
  actor_email text,
  approved_at timestamptz,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists public.site_deploy_checklist (
  id uuid primary key default gen_random_uuid(),
  step_key text,
  label text,
  done boolean default false,
  note text,
  actor_email text,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table if exists public.site_ai_feature_applications add column if not exists category text;
alter table if exists public.site_ai_feature_applications add column if not exists target_page text;
alter table if exists public.site_ai_feature_applications add column if not exists applied_status text default 'applied';
alter table if exists public.site_ai_feature_applications add column if not exists deleted_at timestamptz;
alter table if exists public.site_game_requests add column if not exists priority text default 'normal';
alter table if exists public.site_bug_reports add column if not exists priority text default 'normal';

insert into public.site_runtime_config (key,value,updated_at)
values ('schema_version', jsonb_build_object('version','v2.2.4','applied_at', now(), 'note','AI SQL taslak onay ekrani, deploy kontrol listesi, kategori filtreli AI uygulananlar, gelen oyun istekleri ve hata raporlari paneli aktif.'), now())
on conflict (key) do update set value=excluded.value, updated_at=now();

insert into public.site_update_notes (version,title,summary,note,status,created_at)
values ('v2.2.4','AI SQL Onay + Deploy Kontrol + Rapor Panelleri','AI Özellik Ekle paneli SQL taslak onay ekranı, GitHub/Vercel deploy kontrol listesi ve kategori filtreli uygulanan özellikler ile güçlendirildi.','Yönetim panelinde gelen oyun istekleri ve hata raporları görünür hale getirildi. Seri sıralama geçmişi büyütüldü. GELECEK GÜNCELLEMELER dosyası 15 sürüm planı içerecek şekilde güncellendi.','published',now())
on conflict do nothing;

select 'Hayatimiz Oyun v2.2.4 schema hazir. AI SQL onay, deploy kontrol ve rapor paneli aktif.' as status;

-- v2.2.5 - Güncelleme paketi: SQL syntax kontrol, deploy tanı, AI arama, istek/hata silme ve oyun isteği sihirbazı
alter table if exists public.site_ai_sql_drafts add column if not exists syntax_status text default 'kontrol bekliyor';
alter table if exists public.site_ai_sql_drafts add column if not exists syntax_issues jsonb default '[]'::jsonb;
alter table if exists public.site_ai_feature_applications add column if not exists search_text text;
alter table if exists public.site_game_requests add column if not exists deleted_at timestamptz;
alter table if exists public.site_bug_reports add column if not exists deleted_at timestamptz;
alter table if exists public.site_game_requests add column if not exists wizard_status text default 'bekliyor';
alter table if exists public.site_game_requests add column if not exists wizard_note text;

create table if not exists public.site_deploy_diagnostics (
  id uuid primary key default gen_random_uuid(),
  error_text text,
  diagnosis jsonb default '[]'::jsonb,
  actor_email text,
  created_at timestamptz default now()
);

insert into public.site_runtime_config (key,value,updated_at)
values ('schema_version', jsonb_build_object('version','v2.2.5','applied_at', now(), 'note','SQL syntax kontrolü, deploy hata tanı ekranı, uygulanan AI özelliklerinde arama, oyun isteği/hata silme ve otomatik kapaklı oyun oluşturma sihirbazı aktif.'), now())
on conflict (key) do update set value=excluded.value, updated_at=now();

insert into public.site_update_notes (version,title,summary,note,status,created_at)
values ('v2.2.5','SQL Kontrol + Deploy Tanı + Rapor Silme','AI SQL taslaklarına otomatik syntax kontrolü, deploy hatalarını otomatik tanı ekranı, uygulanan AI özelliklerinde arama ve kullanıcı istek/hata raporlarında silme eklendi.','Kullanıcıların gönderdiği oyun istekleri ve hata raporları yönetim panelinde Supabase + local kayıt olarak görünür. Oyun isteğinden otomatik kapaklı oyun oluşturma sihirbazı eklendi.','published',now())
on conflict do nothing;

select 'Hayatimiz Oyun v2.2.5 schema hazir. Guncelleme paketi aktif.' as status;

-- v2.4.0 - Tüm Yeni Özellikler Stabil Paket
-- v2.2.6 - v2.4.0 arası planlanan özellikler için güvenli, tekrar çalıştırılabilir schema ekleri.

create table if not exists public.site_notification_queue (
  id uuid primary key default gen_random_uuid(),
  title text,
  message text,
  channel text default 'browser',
  target_user_id uuid,
  target_email text,
  target_scope text default 'all',
  status text default 'pending',
  scheduled_at timestamptz,
  sent_at timestamptz,
  error_text text,
  payload jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.site_user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  email text,
  theme text default 'neon',
  card_density text default 'compact',
  archive_view text default 'compact',
  mobile_view text default 'compact',
  preferences jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.site_series_order_history (
  id uuid primary key default gen_random_uuid(),
  series_name text,
  before_order jsonb default '[]'::jsonb,
  after_order jsonb default '[]'::jsonb,
  actor_email text,
  restore_note text,
  restored_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.site_report_exports (
  id uuid primary key default gen_random_uuid(),
  export_type text,
  filters jsonb default '{}'::jsonb,
  row_count integer default 0,
  actor_email text,
  created_at timestamptz default now()
);

alter table if exists public.site_game_requests add column if not exists assigned_to text;
alter table if exists public.site_game_requests add column if not exists priority text default 'Düşük';
alter table if exists public.site_game_requests add column if not exists exported_at timestamptz;
alter table if exists public.site_bug_reports add column if not exists assigned_to text;
alter table if exists public.site_bug_reports add column if not exists priority text default 'Düşük';
alter table if exists public.site_bug_reports add column if not exists resolution_template text;
alter table if exists public.site_bug_reports add column if not exists user_notified_at timestamptz;
alter table if exists public.site_bug_reports add column if not exists exported_at timestamptz;

create table if not exists public.site_maintenance_public_notes (
  id uuid primary key default gen_random_uuid(),
  title text,
  note text,
  progress integer default 0,
  eta text,
  roadmap jsonb default '[]'::jsonb,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.site_ai_prompt_templates (
  id uuid primary key default gen_random_uuid(),
  category text,
  title text,
  prompt text,
  risk_level text default 'Düşük',
  impact_level text default 'Orta',
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table if exists public.site_ai_feature_applications add column if not exists risk_score text;
alter table if exists public.site_ai_feature_applications add column if not exists impact_score text;
alter table if exists public.site_ai_feature_applications add column if not exists public_summary text;
alter table if exists public.site_ai_feature_applications add column if not exists rollback_note text;

create table if not exists public.site_deploy_logs (
  id uuid primary key default gen_random_uuid(),
  provider text,
  log_url text,
  status text,
  error_text text,
  checklist jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.site_schema_history (
  id uuid primary key default gen_random_uuid(),
  version text,
  title text,
  sql_summary text,
  rollback_note text,
  status text default 'applied',
  created_at timestamptz default now()
);

create table if not exists public.site_admin_shortcuts (
  id uuid primary key default gen_random_uuid(),
  role text,
  page text,
  label text,
  is_pinned boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.site_health_reports (
  id uuid primary key default gen_random_uuid(),
  score integer,
  missing_env jsonb default '[]'::jsonb,
  broken_api jsonb default '[]'::jsonb,
  broken_covers jsonb default '[]'::jsonb,
  broken_videos jsonb default '[]'::jsonb,
  schema_status jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

insert into public.site_runtime_config (key,value,updated_at)
values ('schema_version', jsonb_build_object('version','v2.4.0','applied_at', now(), 'note','v2.2.6-v2.4.0 arasindaki tum yeni ozellikler stabil paket olarak eklendi.'), now())
on conflict (key) do update set value=excluded.value, updated_at=now();

insert into public.site_update_notes (version,title,summary,note,status,created_at)
values ('v2.4.0','Tüm Yeni Özellikler Stabil Paket','Takvim bildirim kuyruğu, seri geçmişi, kullanıcı tercihleri, rapor merkezi, bakım yol haritası, AI şablonları, deploy merkezi, schema geçmişi, yönetim kısayolları ve sistem sağlık paneli eklendi.','v2.2.6 - v2.4.0 arası planlanan özellikler siteyi bozmadan modüler yönetim panelleriyle eklendi.','published',now())
on conflict do nothing;

select 'Hayatimiz Oyun v2.4.0 schema hazir. Tum yeni ozellikler stabil paket aktif.' as status;

-- v2.4.0 FIX 4 - Hizli Deploy + Supabase Versiyon Takibi
-- Bu blok her calistirmada schema_version ve guncelleme notunu en son fix surumune gunceller.
insert into public.site_runtime_config (key,value,updated_at)
values ('schema_version', jsonb_build_object('version','v2.4.0 FIX 4','applied_at', now(), 'note','Hizli deploy icin hazir dist + bagimliliksiz package yapisi eklendi; Supabase kayitlari ve kompakt arayuz korunuyor.'), now())
on conflict (key) do update set value=excluded.value, updated_at=now();

insert into public.site_update_notes (version,title,summary,note,status,created_at)
values ('v2.4.0 FIX 4','Hizli Deploy + Supabase Versiyon Takibi','Vercel build suresini azaltmak icin hazir dist, bagimliliksiz package.json ve skip install/build ayari eklendi.','Supabase dinamik oyun kayitlari korunur. schema_version bundan sonra her surum/fix paketinde guncellenir.','published',now())
on conflict do nothing;

select 'Hayatimiz Oyun v2.4.0 FIX 4 schema hazir. Hizli deploy ve Supabase versiyon takibi aktif.' as status;


-- v2.4.0 FIX 5 - Kompakt Kart + Bakim Geri Sayim
insert into public.site_runtime_config (key,value,updated_at)
values ('schema_version', jsonb_build_object('version','v2.4.0 FIX 5','applied_at', now(), 'note','Kompakt oyun/seri kartlari genisletildi, gorunum degistirme guvenli hale getirildi, bakim moduna acilis geri sayimi eklendi.'), now())
on conflict (key) do update set value=excluded.value, updated_at=now();

insert into public.site_update_notes (version,title,summary,note,status,created_at)
values ('v2.4.0 FIX 5','Kompakt Kart + Bakim Geri Sayim','Oyun arsivi ve serilerde kompakt kartlar daha genis/okunabilir hale getirildi; gorunum degistirme butonlari guvenli hale getirildi; bakim ekranina acilis geri sayimi eklendi.','Supabase kayitlari korunur, 4 kolon masaustu duzeni devam eder, bakim modunda yuzde ve acilis zamani daha profesyonel gorunur.','published',now())
on conflict do nothing;

select 'Hayatimiz Oyun v2.4.0 FIX 5 schema hazir. Kompakt kart ve bakim geri sayim fix aktif.' as status;


-- v2.4.0 FIX 6 - Site Ici Redeploy + AI/Supabase Tani
create table if not exists public.site_redeploy_requests (
  id uuid primary key default gen_random_uuid(),
  provider text default 'vercel',
  status text default 'pending',
  message text,
  version text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.site_deploy_events (
  id uuid primary key default gen_random_uuid(),
  provider text,
  status text,
  message text,
  version text,
  created_at timestamptz default now()
);

create table if not exists public.site_schema_feedback (
  id uuid primary key default gen_random_uuid(),
  version text,
  source text,
  message text,
  status text default 'new',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.site_ai_feature_registry (
  id uuid primary key default gen_random_uuid(),
  feature_key text unique,
  title text,
  target text,
  table_name text,
  status text default 'tanindi',
  version text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table if exists public.site_ai_feature_applications add column if not exists redeploy_status text;
alter table if exists public.site_ai_feature_applications add column if not exists github_uploaded_at timestamptz;
alter table if exists public.site_ai_feature_applications add column if not exists vercel_deployed_at timestamptz;
alter table if exists public.site_ai_feature_applications add column if not exists supabase_applied_at timestamptz;

insert into public.site_runtime_config (key,value,updated_at)
values ('schema_version', jsonb_build_object('version','v2.4.0 FIX 6','applied_at', now(), 'note','Site ici Redeploy / AI Tani merkezi eklendi; GitHub, Vercel ve Supabase durumlari panelden takip edilebilir.'), now())
on conflict (key) do update set value=excluded.value, updated_at=now();

insert into public.site_update_notes (version,title,summary,note,status,created_at)
values ('v2.4.0 FIX 6','Redeploy + AI/Supabase Tani Merkezi','Yonetim paneline site ici Redeploy / AI Tani merkezi eklendi. GitHub yuklendi, Vercel redeploy, Supabase schema uygulandi ve yeni tablo geri bildirimi takip edilebilir.','Vercel Deploy Hook URL varsa panelden redeploy istegi gonderilir; yoksa GitHub push sonrasi otomatik deploy beklenir. AI ozellikleri Supabase tani tablosuna kaydedilir.','published',now())
on conflict do nothing;

select 'Hayatimiz Oyun v2.4.0 FIX 6 schema hazir. Redeploy ve AI/Supabase tani merkezi aktif.' as status;

-- v2.4.0 FIX 7 - Otomatik AI Tani + Hata Duzeltme Merkezi + Tarih Format Fix
create table if not exists public.site_auto_fix_requests (
  id uuid primary key default gen_random_uuid(),
  version text,
  source text default 'admin_panel',
  error_text text,
  diagnosis jsonb default '[]'::jsonb,
  status text default 'new',
  fixed_files text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table if exists public.site_redeploy_requests add column if not exists auto_detected boolean default false;
alter table if exists public.site_deploy_events add column if not exists detail jsonb default '{}'::jsonb;
alter table if exists public.site_schema_feedback add column if not exists fixed_files text;
alter table if exists public.site_ai_feature_registry add column if not exists auto_detected boolean default false;
alter table if exists public.site_ai_feature_registry add column if not exists last_result text;

insert into public.site_runtime_config (key,value,updated_at)
values ('schema_version', jsonb_build_object('version','v2.4.0 FIX 7','applied_at', now(), 'note','Yonetim paneli butonlari, gun.ay.yil tarih formati, bakim geri sayimi, otomatik AI tani/deploy akisi ve hata yazinca otomatik fix tani merkezi eklendi.'), now())
on conflict (key) do update set value=excluded.value, updated_at=now();

insert into public.site_update_notes (version,title,summary,note,status,created_at)
values ('v2.4.0 FIX 7','Otomatik AI Tani + Hata Duzeltme Merkezi','Yonetim paneli butonlari guclendirildi, bakim tarihi gun.ay.yil formatina alindi, otomatik AI/GitHub/Vercel/Supabase tani akisi ve hata yazinca fix tani merkezi eklendi.','Meta + kapak cek oyun adini daha dogru tanir, bilinen oyunlarda dogru kapak/tarih/tur oncelikli kullanilir.','published',now())
on conflict do nothing;

select 'Hayatimiz Oyun v2.4.0 FIX 7 schema hazir. Otomatik AI tani, hata duzeltme merkezi ve tarih fix aktif.' as status;


-- v2.4.0 FIX 8 - Stabil yonetim paneli, takvim ve API action fix
create table if not exists public.site_user_preferences (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  preferences jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table if exists public.site_calendar_events add column if not exists is_active boolean default true;
alter table if exists public.site_calendar_events add column if not exists updated_at timestamptz default now();
alter table if exists public.site_runtime_config add column if not exists updated_at timestamptz default now();

insert into public.site_runtime_config (key,value,updated_at)
values ('schema_version', jsonb_build_object('version','v2.4.0 FIX 8','applied_at', now(), 'note','Yonetim paneli butonlari, bilinmeyen API action hatasi, yayin takvimi stabilizasyonu ve bakim tarihi gun.ay.yil fix aktif.'), now())
on conflict (key) do update set value=excluded.value, updated_at=now();

insert into public.site_update_notes (version,title,summary,note,status,created_at)
values ('v2.4.0 FIX 8','Stabil Yönetim Paneli + Takvim Fix','Yonetim panelinde calismayan butonlar guclendirildi. Bilinmeyen API action hatalari azaltildi. Yayin takvimi daha stabil hale getirildi ve bakim tarihi gun.ay.yil formatina sabitlendi.','Panel rehberi eklendi; Deploy Merkezi hook alani olmadan temizlendi; takvim kayitlari ekle/duzenle/sil akisi guclendirildi.','published',now())
on conflict do nothing;

select 'Hayatimiz Oyun v2.4.0 FIX 8 schema hazir. Yonetim paneli, takvim ve API action fix aktif.' as status;

-- v2.4.0 FIX 11 - kapak/meta ve bakım notları kullanıcı ekranı fix
insert into public.site_runtime_config(key,value,updated_at)
values ('schema_version', jsonb_build_object('version','v2.4.0 FIX 11','applied_at', now(), 'note','Kapak/meta güvenli eşleştirme ve bakım güncelleme notları kullanıcı ekranı fix'), now())
on conflict (key) do update set value=excluded.value, updated_at=now();

insert into public.site_update_notes (version,title,summary,note,status,created_at)
values ('v2.4.0 FIX 11','Kapak ve Bakım Notları Fix','Meta + Kapak Çek yanlış genel görsel göstermeyecek şekilde düzeltildi; bakım modundaki güncelleme notları kullanıcı ekranında görünür hale getirildi.','Bilinen oyunlar için doğru başlık, tür, tarih ve Steam/RAWG tabanlı kapak eşleştirme güçlendirildi. Güvenilir kapak bulunamazsa rastgele arcade görseli basılmaz. Bakım notları updates / notesText / publicNotes alanlarıyla birlikte kaydedilir.', 'published', now())
on conflict (version,title) do update set summary=excluded.summary, note=excluded.note, status=excluded.status;

select 'Hayatimiz Oyun v2.4.0 FIX 11 schema hazir. Kapak/meta ve bakim notlari fix aktif.' as status;

-- v2.4.0 FIX 11: kapak seçici, AI versiyon seçimi ve seriesGroups açılış fix kaydı.


-- v2.4.0 FIX 12 - AI öneri değiştir ve versiyon notu kaydı
insert into public.site_runtime_config (key, value, updated_at)
values ('schema_version', jsonb_build_object('version','v2.4.0 FIX 12','applied_at', now(), 'note','AI öneri değiştir butonu ve seçilen versiyona göre güncelleme notu akışı'), now())
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into public.site_update_notes (version,title,summary,note,status,created_at)
values ('v2.4.0 FIX 12','AI Öneri Değiştir','Yeni Özellik Önerileri bölümüne beğenilmeyen öneriyi tek karttan değiştirme butonu eklendi.','Liste 10 öneride sabit kalır; değiştirilen önerinin yerine yeni öneri gelir. Uygulanan özellik seçili versiyonla güncelleme notu/local changelog akışına işlenir.','published',now())
on conflict do nothing;

select 'Hayatimiz Oyun v2.4.0 FIX 12 schema hazir. AI oneri degistir fix aktif.' as status;

-- v2.4.0 FIX 13 - AI yeni oneriler ve redeploy guncelleme kartlari fix
create table if not exists public.site_ai_suggestion_scans (
  id uuid primary key default gen_random_uuid(),
  version text,
  source text default 'admin_panel',
  focus_category text default 'Tümü',
  suggestions jsonb default '[]'::jsonb,
  status text default 'generated',
  created_at timestamptz default now()
);

alter table if exists public.site_ai_feature_registry add column if not exists suggestion_source text;
alter table if exists public.site_ai_feature_registry add column if not exists focus_category text;
alter table if exists public.site_deploy_events add column if not exists version text;
alter table if exists public.site_schema_feedback add column if not exists version text;

insert into public.site_runtime_config (key, value, updated_at)
values ('schema_version', jsonb_build_object('version','v2.4.0 FIX 13','applied_at', now(), 'note','Redeploy üst güncelleme kartları canlı yenilenir; AI Özellik Ekle ekranına Yeni Öneriler Öner alanı eklendi.'), now())
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into public.site_update_notes (version,title,summary,note,status,created_at)
values ('v2.4.0 FIX 13','AI Yeni Öneriler + Redeploy Güncelleme Fix','Redeploy merkezindeki Yeni Güncellemeleri Otomatik Ara butonu üst durum kartlarını ve AI öneri listesini anında günceller.','AI Özellik Ekle ekranına Yeni Öneriler Öner alanı eklendi. Versiyon alanı AI önerilerine senkron bağlandı; öneri üretme ve üst güncelleme kartları sayfa yenilemeden çalışır hale getirildi.','published',now())
on conflict do nothing;

select 'Hayatimiz Oyun v2.4.0 FIX 13 schema hazir. AI yeni oneriler ve redeploy guncelleme fix aktif.' as status;


-- v2.4.0 FIX 14 - Stabil kapak, AI uygula ve dinamik versiyon fix
create table if not exists public.site_ai_feature_apply_log (
  id uuid primary key default gen_random_uuid(),
  feature_key text,
  feature_title text,
  target text,
  version text,
  payload jsonb default '{}'::jsonb,
  status text default 'applied',
  created_at timestamptz default now()
);

create table if not exists public.site_cover_candidates_log (
  id uuid primary key default gen_random_uuid(),
  game_title text,
  selected_title text,
  candidates jsonb default '[]'::jsonb,
  source text default 'fix14_cover_search',
  created_at timestamptz default now()
);

alter table if exists public.site_ai_feature_registry add column if not exists applied_target text;
alter table if exists public.site_ai_feature_registry add column if not exists applied_version text;
alter table if exists public.site_ai_feature_registry add column if not exists applied_at timestamptz;
alter table if exists public.site_deploy_events add column if not exists selected_version text;
alter table if exists public.site_schema_feedback add column if not exists selected_version text;

insert into public.site_runtime_config (key, value, updated_at)
values ('schema_version', jsonb_build_object('version','v2.4.0 FIX 14','applied_at', now(), 'note','Dinamik site sürümü, Alan Wake American Nightmare kapak/meta eşleşmesi ve AI Siteye Uygula/Nereye Eklendiyse Git akışı stabil fix.'), now())
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into public.site_update_notes (version,title,summary,note,status,created_at)
values ('v2.4.0 FIX 14','Stabil Kapak + AI Uygula + Dinamik Versiyon Fix','Site adındaki/üst bardaki sürüm etiketi yeni versiyon alanıyla senkron güncellenir; Alan Wake American Nightmare gibi alt oyunların kapakları ayrı eşleşir; AI Siteye Uygula ve Nereye Eklendiyse Git akışı stabil hale getirildi.','Kapak aday havuzu genişletildi, yanlış genel oyun eşleşmeleri azaltıldı, uygulanan AI özellikleri kayıt/plan/güncelleme notu akışına bağlandı ve hedef sayfaya gitme haritası güçlendirildi.','published',now())
on conflict do nothing;

select 'Hayatimiz Oyun v2.4.0 FIX 14 schema hazir. Dinamik versiyon, stabil kapak ve AI uygula fix aktif.' as status;


-- v2.4.0 FIX 22 - AI özellik yazma/önerme sistemi kaldırıldı.
-- Kullanıcının isteğiyle AI özellik tabloları ve registry kayıtları temizlenir.
drop table if exists public.site_ai_feature_apply_log cascade;
drop table if exists public.site_ai_suggestion_scans cascade;
drop table if exists public.site_ai_prompt_templates cascade;
drop table if exists public.site_ai_sql_drafts cascade;
drop table if exists public.site_ai_feature_registry cascade;
drop table if exists public.site_ai_feature_applications cascade;
insert into public.site_runtime_config (key,value,updated_at)
values ('schema_version', jsonb_build_object('version','v2.4.0 FIX 22','applied_at', now(), 'note','AI özellik yazma/önerme/uygulama sistemi kaldırıldı; Deploy Merkezi sade moda alındı.'), now())
on conflict (key) do update set value=excluded.value, updated_at=now();
insert into public.site_update_notes (version,title,summary,note,status,created_at)
values ('v2.4.0 FIX 22','AI Özellik Sistemi Kaldırıldı','AI ile özellik yazma, önerme, uygulama ve AI tanı panelleri kaldırıldı.','AI Özellik Ekle, AI Özellik Merkezi, Özellik Yaz, Siteye Uygulandı, Özellik Planı ve Uygulama Merkezi akışları kapatıldı. Deploy Merkezi sadece GitHub/Vercel/Supabase kontrol alanı olarak sadeleştirildi.','published',now())
on conflict (version,title) do update set
  summary = coalesce(excluded.summary, public.site_update_notes.summary),
  note = coalesce(excluded.note, public.site_update_notes.note),
  image_url = coalesce(excluded.image_url, public.site_update_notes.image_url),
  status = coalesce(excluded.status, public.site_update_notes.status);
select 'Hayatimiz Oyun v2.4.0 FIX 22 schema hazir. AI özellik sistemi kaldırıldı.' as status;


-- v2.4.0 FIX 23 - Site içi Deploy/Redeploy/GitHub/Vercel panelleri kaldırıldı.
-- Kullanıcı artık bu işlemleri site içinden değil ZIP güncellemesiyle sürdürecek.
drop table if exists public.site_redeploy_requests cascade;
drop table if exists public.site_deploy_events cascade;
drop table if exists public.site_deploy_checklist cascade;
drop table if exists public.site_deploy_diagnostics cascade;
drop table if exists public.site_deploy_logs cascade;
insert into public.site_runtime_config (key,value,updated_at)
values ('schema_version', jsonb_build_object('version','v2.4.0 FIX 23','applied_at', now(), 'note','Site içi deploy/redeploy/GitHub/Vercel kontrol panelleri kaldırıldı; yönetim paneli sade moda alındı.'), now())
on conflict (key) do update set value=excluded.value, updated_at=now();
insert into public.site_update_notes (version,title,summary,note,status,created_at)
values ('v2.4.0 FIX 23','Sade Yönetim Paneli','Site içindeki deploy/redeploy/GitHub/Vercel kontrol panelleri kaldırıldı.','AI özellik sistemi ve yayına alma kontrol panelleri artık kullanıcı arayüzünde görünmez. Bundan sonraki güncellemeler ZIP paketiyle hazırlanır.','published',now())
on conflict do nothing;
select 'Hayatimiz Oyun v2.4.0 FIX 23 schema hazir. Sade yönetim paneli aktif.' as status;


-- v2.4.0 FIX 24 - AI ve Deploy/Redeploy tabloları doğrudan temizlendi
-- Bu blok pasifleştirme için değildir; artık kullanılmayan AI/deploy kayıt tablolarını kaldırır.
drop table if exists public.site_ai_feature_applications cascade;
drop table if exists public.site_ai_sql_drafts cascade;
drop table if exists public.site_deploy_checklist cascade;
drop table if exists public.site_deploy_events cascade;
drop table if exists public.site_redeploy_requests cascade;
delete from public.site_runtime_config where key in ('ai_feature_registry','deploy_center_state','redeploy_center_state','github_upload_queue','vercel_deploy_hook');
insert into public.site_runtime_config (key,value,updated_at)
values ('schema_version', jsonb_build_object('version','v2.4.0 FIX 24','applied_at', now(), 'note','AI ozellik ve deploy/redeploy modulleri dogrudan silindi.'), now())
on conflict (key) do update set value=excluded.value, updated_at=now();
select 'Hayatimiz Oyun v2.4.0 FIX 24 schema hazir. AI ve deploy/redeploy tablolari temizlendi.' as status;

-- v2.4.0 FIX 27 - Schema tekrar çalıştırma / duplicate update note fix
-- site_update_notes kayıtları artık aynı version+title ile tekrar çalıştırıldığında hata vermez; mevcut kayıt güncellenir.
insert into public.site_runtime_config (key,value,updated_at)
values ('schema_version', jsonb_build_object('version','v2.4.0 FIX 27','applied_at', now(), 'note','site_update_notes duplicate key hatası giderildi; schema.sql tekrar tekrar güvenle çalıştırılabilir.'), now())
on conflict (key) do update set value=excluded.value, updated_at=now();
insert into public.site_update_notes (version,title,summary,note,status,created_at)
values ('v2.4.0 FIX 27','Schema Tekrar Çalıştırma Fix','Supabase schema.sql tekrar çalıştırıldığında duplicate key hatası vermez.','site_update_notes kayıtları version+title benzersiz alanında artık upsert mantığıyla çalışır. Aynı güncelleme notu varsa hata vermeden mevcut kayıt güncellenir.','published',now())
on conflict (version,title) do update set
  summary = excluded.summary,
  note = excluded.note,
  status = excluded.status;
select 'Hayatimiz Oyun v2.4.0 FIX 27 schema hazir. Duplicate key hatasi giderildi.' as status;


-- =========================================================
-- v2.4.0 FIX 42 - Profesyonel panel + içerik kontrol + tarih çekme notu
-- Tekrar çalıştırılabilir güvenli bloktur.
-- =========================================================
alter table if exists public.site_game_requests add column if not exists priority text default 'normal';
alter table if exists public.site_game_requests add column if not exists admin_reply text;
alter table if exists public.site_game_requests add column if not exists request_count integer default 1;
alter table if exists public.site_game_requests add column if not exists converted_game_id uuid;

alter table if exists public.site_bug_reports add column if not exists bug_type text default 'Genel';
alter table if exists public.site_bug_reports add column if not exists priority text default 'normal';
alter table if exists public.site_bug_reports add column if not exists solution_note text;
alter table if exists public.site_bug_reports add column if not exists related_game_id uuid;

insert into public.site_update_notes(version,title,summary,note,status,created_at)
values(
  'v2.4.0 FIX 42',
  'Profesyonel Temizlik + İçerik Kontrol + Çıkış Tarihi Fix',
  'Yönetim paneli sadeleştirildi, içerik kontrol paneli eklendi, oyun formunda tüm bilgileri/kapak/tarih/tür/açıklama çekme sistemi güçlendirildi.',
  'FIX42 ile AI/deploy/redeploy kalıntıları temiz kalır. Çıkış tarihi yerel kesin katalog, Steam, RAWG ve internet aramasıyla kontrol edilir; çekme işlemleri kaydetmeden Supabase kaydı yapmaz.',
  'published',
  now()
)
on conflict (version,title) do update set summary=excluded.summary, note=excluded.note, status='published', updated_at=now();

-- =========================================================
-- v2.4.1 FIX 48 - Public sürüm sabitleme + modal düzenleme fix
-- Bu blok Supabase tarafındaki görünen sürüm ve güncelleme notunu v2.4.1'e çeker.
-- Tekrar çalıştırılabilir güvenli bloktur.
-- =========================================================
insert into public.site_runtime_config (key,value,updated_at)
values
  ('schema_version', jsonb_build_object('version','v2.4.1','fix','FIX 48','applied_at', now(), 'note','v2.4.1 public sürüm sabitlendi; Eksik Alanlar modal düzenleme açılışı düzeltildi.'), now()),
  ('site_public_version', jsonb_build_object('version','v2.4.1','label','v2.4.1','applied_at', now()), now()),
  ('current_site_version', jsonb_build_object('version','v2.4.1','label','v2.4.1','applied_at', now()), now())
on conflict (key) do update set value=excluded.value, updated_at=now();

insert into public.site_update_notes(version,title,summary,note,status,created_at)
values(
  'v2.4.1 FIX 48',
  'Sürüm Sabitleme + Eksik Alan Modal Fix',
  'Üst/sol menüde görünen sürüm v2.4.1 olarak sabitlendi. Eksik Alanlar ve Düzeltilecek Kayıtlar bölümündeki Eksiği Gider butonu ayrı düzenleme penceresini gerçekten açar.',
  'FIX48 ile eski buton yakalama katmanının modal düzenlemeyi engellemesi düzeltildi. Üst bar kaydırma sırasında sayfayla aşağı taşmayacak şekilde düzenlendi. Supabase site_public_version ve current_site_version kayıtları v2.4.1 olarak güncellendi.',
  'published',
  now()
)
on conflict (version,title) do update set summary=excluded.summary, note=excluded.note, status='published', updated_at=now();

select 'Hayatimiz Oyun v2.4.1 FIX 48 schema hazir. Public version ve modal edit fix aktif.' as status;


-- FIX49 - v2.4.1 public version tekrar sabitleme
-- DÜZELTİLDİ: value kolonu jsonb olduğu için düz metin yerine jsonb_build_object kullanılır.
insert into public.site_runtime_config (key, value, updated_at)
values
  ('site_public_version', jsonb_build_object('version','v2.4.1','label','v2.4.1','fix','FIX49','applied_at', now()), now()),
  ('current_site_version', jsonb_build_object('version','v2.4.1','label','v2.4.1','fix','FIX49','applied_at', now()), now())
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into public.site_update_notes (version, title, summary, note, image_url, status, created_at)
values (
  'v2.4.1',
  'FIX49 - Açılış ve Form Buton Stabilizasyonu',
  'İlk açılışta yükleniyor ekranı erken görünmez; Eksiği Gider modalı açılır; kapak, tarih, tür ve açıklama çekme butonları sayfa yenilemeden forma işler.',
  'FIX49 ile form içi veri çekme butonları submit/reload yapmayacak şekilde ayrıldı. Supabase sürümü v2.4.1 olarak sabitlenir.',
  'previews/hayatimiz-oyun-v241-fix49-form-modal-stabil.png',
  'published',
  now()
)
on conflict (version, title) do update set
  summary = excluded.summary,
  note = excluded.note,
  image_url = excluded.image_url,
  status = excluded.status,
  updated_at = now();

-- FIX50 - Schema JSON syntax ve form butonları stabilizasyonu
-- Bu blok tekrar tekrar çalıştırılabilir. Supabase sürüm kayıtları JSONB formatında tutulur.
insert into public.site_runtime_config (key, value, updated_at)
values
  ('schema_version', jsonb_build_object('version','v2.4.1','fix','FIX50','applied_at', now(), 'note','schema.sql jsonb hatası düzeltildi; form veri çekme butonları submit/reload yapmadan çalışır.'), now()),
  ('site_public_version', jsonb_build_object('version','v2.4.1','label','v2.4.1','fix','FIX50','applied_at', now()), now()),
  ('current_site_version', jsonb_build_object('version','v2.4.1','label','v2.4.1','fix','FIX50','applied_at', now()), now())
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into public.site_update_notes (version, title, summary, note, image_url, status, created_at)
values (
  'v2.4.1 FIX 50',
  'Schema JSON + Form Buton Stabilizasyonu',
  'Supabase schema.sql içindeki jsonb syntax hatası giderildi. Kapak, çıkış tarihi, tür ve açıklama çekme butonları sayfa yenilemeden forma işler.',
  'FIX50 ile site_runtime_config.value alanına düz metin yazan eski blok JSONB formatına çevrildi. Oyun ekle/düzenle ekranında veri çekme butonları erken yakalama katmanıyla submit/reload davranışından ayrıldı.',
  'previews/hayatimiz-oyun-v241-fix50-schema-form-buton.png',
  'published',
  now()
)
on conflict (version, title) do update set
  summary = excluded.summary,
  note = excluded.note,
  image_url = excluded.image_url,
  status = excluded.status,
  updated_at = now();

select 'Hayatimiz Oyun v2.4.1 FIX 50 schema hazir. JSONB version kaydi ve form buton fix aktif.' as status;

-- v2.4.1 FIX 55 - Kesin tarih kataloğu + oyun formu sıfırlama + gelecek plan temizlik
insert into public.site_runtime_config (key, value, updated_at)
values
  ('schema_version', jsonb_build_object('version','v2.4.1','fix','FIX55','applied_at', now(), 'note','Avatar DLC ve benzeri kayıtlarda kesin çıkış tarihi kataloğu eklendi; oyun ekle formu sıfırlama ve çekme butonları güçlendirildi.'), now()),
  ('site_public_version', jsonb_build_object('version','v2.4.1','label','v2.4.1','fix','FIX55','applied_at', now()), now()),
  ('current_site_version', jsonb_build_object('version','v2.4.1','label','v2.4.1','fix','FIX55','applied_at', now()), now())
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into public.site_update_notes (version, title, summary, note, image_url, status, created_at)
values (
  'v2.4.1 FIX 55',
  'Kesin Çıkış Tarihi ve Form Sıfırlama Fix',
  'Avatar: Frontiers of Pandora DLC: The Sky Breaker gibi DLC kayıtlarında yanlış çıkış tarihi çekme düzeltildi. Oyun ekle formuna Formu Sıfırla eklendi.',
  'FIX55 ile yerel kesin tarih kataloğu güçlendirildi. DLC kayıtları ana oyunla karışmaz; tarih çekme yanlış eski değeri ezerek doğru gün.ay.yıl değerini yazar. Kapak, tür, hikaye ve tüm bilgileri çekme butonları kayıt yapmadan forma işler. Gelecek güncellemeler planı otomatik kod uygulayan sistem olmadan yeniden düzenlendi.',
  'previews/hayatimiz-oyun-v241-fix55-tarih-form-sifirla.png',
  'published',
  now()
)
on conflict (version, title) do update set
  summary = excluded.summary,
  note = excluded.note,
  image_url = excluded.image_url,
  status = excluded.status,
  updated_at = now();

select 'Hayatimiz Oyun v2.4.1 FIX 55 schema hazir. Kesin tarih katalogu, form sifirlama ve gelecek plan temizlik aktif.' as status;


-- FIX56 - Tüm Bilgileri Çek Recursion Fix
insert into public.site_update_notes (version, title, note, image_url)
values ('v2.4.1 FIX 56', 'Tüm Bilgileri Çek Recursion Fix', 'Tüm Bilgileri Çek ve tür çekme sırasında oluşan Maximum call stack size exceeded hatası giderildi. Kapak, tarih, tür, etiket ve hikaye çekme butonları formu yenilemeden çalışır.', 'previews/hayatimiz-oyun-v241-fix56-tum-bilgileri-cek-stabil.png')
on conflict (version, title) do update set note = excluded.note, image_url = excluded.image_url;


-- v2.4.1 FIX 57 - Kapak ve çıkış tarihi motoru genişletildi
insert into public.site_update_notes (version, title, note, image_url, created_at)
values ('v2.4.1 FIX 57', 'Kapak ve Çıkış Tarihi Motoru Genişletildi', 'Assassin''s Creed 1 / Director''s Cut için doğru kapak ve 13.11.2007 çıkış tarihi kesin kataloğa eklendi. Kapak, tarih, tür ve tüm bilgileri çekme butonları oyun adını bozmadan forma işler. AI/deploy/redeploy sistemi eklenmedi.', 'previews/hayatimiz-oyun-v241-fix57-kapak-tarih-motoru.png', now())
on conflict (version, title) do update set
  note = excluded.note,
  image_url = excluded.image_url;

insert into public.site_settings (key, value, updated_at)
values ('site_public_version', to_jsonb('v2.4.1'::text), now())
on conflict (key) do update set value = excluded.value, updated_at = now();

-- v2.4.1 FIX 58 - Steam tarih/kapak kontrolü + playlist video fix + profesyonel form
insert into public.site_runtime_config (key, value, updated_at)
values
  ('schema_version', jsonb_build_object('version','v2.4.1','fix','FIX58','applied_at', now(), 'note','Steam tarih/kapak kontrolü, güçlü playlist video çekme ve profesyonel oyun ekleme formu aktif.'), now()),
  ('site_public_version', jsonb_build_object('version','v2.4.1','label','v2.4.1','fix','FIX58','applied_at', now()), now()),
  ('current_site_version', jsonb_build_object('version','v2.4.1','label','v2.4.1','fix','FIX58','applied_at', now()), now())
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into public.site_update_notes (version, title, summary, note, image_url, status, created_at)
values (
  'v2.4.1 FIX 58',
  'Steam Tarih/Kapak Kontrolü ve Playlist Video Fix',
  'Oyun ekleme formu profesyonelleştirildi. Steam kontrolü tarih, kapak ve başlık eşleşmesini gösterir. Playlist çekme ve istatistik video metinleri düzeltildi.',
  'FIX58 ile oyun ekleme ekranına Steam doğrulama kartı eklendi. Yanlış tarih/kapak yakalanır, doğru görünen Steam sonucu tek tıkla forma uygulanır. Playlist bölümleri çekme sistemi güçlendirilerek video kayıtları daha güvenilir alınır. Genel istatistiklerde bölüm yerine video yazılır; seri izleme ekranında bölüm ifadesi korunur.',
  'previews/hayatimiz-oyun-v241-fix58-steam-playlist-form.png',
  'published',
  now()
)
on conflict (version, title) do update set
  summary = excluded.summary,
  note = excluded.note,
  image_url = excluded.image_url,
  status = excluded.status,
  updated_at = now();

insert into public.site_settings (key, value, updated_at)
values ('site_public_version', to_jsonb('v2.4.1'::text), now())
on conflict (key) do update set value = excluded.value, updated_at = now();

select 'Hayatimiz Oyun v2.4.1 FIX 58 schema hazir. Steam kontrolu, playlist video fix ve profesyonel form aktif.' as status;



-- v2.4.1 FIX 59 - Devam eden serilerde Kaldığımız Bölüm + playlist algılama
insert into public.site_runtime_config (key, value, updated_at)
values
  ('schema_version', jsonb_build_object('version','v2.4.1','fix','FIX59','applied_at', now(), 'note','Devam eden serilerde playlistten Kaldığımız Bölüm algılama aktif.'), now()),
  ('site_public_version', jsonb_build_object('version','v2.4.1','label','v2.4.1','fix','FIX59','applied_at', now()), now()),
  ('current_site_version', jsonb_build_object('version','v2.4.1','label','v2.4.1','fix','FIX59','applied_at', now()), now())
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into public.site_update_notes (version, title, summary, note, image_url, status, created_at)
values (
  'v2.4.1 FIX 59',
  'Kaldığımız Bölüm ve Devam Eden Seri Takibi',
  'Devam eden seriler artık playlistten çekilen videolara göre kaldığımız bölümü gösterir. İzleyici tek tıkla o bölümü açabilir.',
  'FIX59 ile ana sayfa, devam eden seri kartları, seri listesi ve izleme modalına Kaldığımız Bölüm göstergesi eklendi. Sistem playlist video listesinden son/aktif bölümü algılar; video yoksa manuel bölüm verisine güvenli şekilde düşer.',
  'previews/hayatimiz-oyun-v241-fix59-kaldigimiz-bolum.png',
  'published',
  now()
)
on conflict (version, title) do update set
  summary = excluded.summary,
  note = excluded.note,
  image_url = excluded.image_url,
  status = excluded.status,
  updated_at = now();

insert into public.site_settings (key, value, updated_at)
values ('site_public_version', to_jsonb('v2.4.1'::text), now())
on conflict (key) do update set value = excluded.value, updated_at = now();

select 'Hayatimiz Oyun v2.4.1 FIX 59 schema hazir. Kaldigimiz bolum ve playlist algilama aktif.' as status;


-- v2.4.1 FIX 60 - Kırmızı Kompakt Arayüz + XP/Level Sıfırlama
-- Not: XP/Level sıfırlama local profil seviyesi içindir; oyun, kapak ve playlist verilerini silmez.

-- v2.4.1 FIX 61 - 15 gelecek güncelleme MD dosyası pakete eklendi.
-- Not: Bu fix kod/veritabanı değişikliği yapmaz; PLANLANANLAR klasöründeki dokümantasyon eksikliği giderildi.


-- FIX63 - Seri Durumu, Bakım Modu, Listeler, Topluluk ve Playlist Kaynağı Fix
insert into public.site_update_notes (version, title, summary, created_at) values ('v2.4.1 FIX 63', 'Seri Durumu, Bakım Modu, Listeler ve Playlist Kaynağı Fix', 'Devam eden seri filtresi, kaldığımız bölüm mantığı, bakım modu, listeler/topluluk ve playlist kaynak kontrolü düzeltildi.', now()) on conflict do nothing;


-- v2.4.3 - Site Tanıtım ve İlk Kullanım Rehberi + Hikaye Açıklaması İyileştirmesi
insert into public.site_runtime_config (key, value, updated_at)
values
  ('schema_version', jsonb_build_object('version','v2.4.3','label','v2.4.3','applied_at', now(), 'note','İlk kullanım rehberi ve spoiler kontrollü hikaye açıklaması iyileştirmesi aktif.'), now()),
  ('site_public_version', jsonb_build_object('version','v2.4.3','label','v2.4.3','applied_at', now()), now()),
  ('current_site_version', jsonb_build_object('version','v2.4.3','label','v2.4.3','applied_at', now()), now()),
  ('first_use_guide_version', jsonb_build_object('version','v2.4.3','enabled', true, 'title','Site Tanıtım ve İlk Kullanım Rehberi'), now()),
  ('story_engine_version', jsonb_build_object('version','v2.4.3','mode','spoiler_safe_story_focus','note','Hikaye açıklamaları türleri saymak yerine oyunun ne anlattığını açıklar.'), now())
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into public.site_settings (key, value, updated_at)
values
  ('site_public_version', to_jsonb('v2.4.3'::text), now()),
  ('first_use_guide_enabled', to_jsonb(true), now()),
  ('story_description_mode', to_jsonb('spoiler_safe_story_focus'::text), now())
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into public.site_update_notes (version, title, summary, note, image_url, status, created_at)
values (
  'v2.4.3',
  'Site Tanıtım ve İlk Kullanım Rehberi',
  'İlk giriş rehberi, yönetim paneli rehber ayarları ve spoiler kontrollü hikaye açıklaması iyileştirmesi eklendi.',
  'v2.4.3 ile kullanıcı ilk girişte ana sayfa, seriler, videolar, listeler, topluluk ve kaldığın yerden devam et sistemini anlatan rehber görür. Yönetim panelinden rehber başlığı, açıklaması ve adımları düzenlenebilir. Hikaye açıklamaları artık türleri saymak yerine oyunun ne anlattığını, karakter motivasyonlarını ve atmosferini spoiler kontrollü biçimde açıklar. A Plague Tale: Innocence gibi hikaye oyunlarında metin oyunun ana anlatısını açıklar; kritik final olaylarını vermez.',
  'previews/hayatimiz-oyun-v243-ilk-kullanim-rehberi.png',
  'published',
  now()
)
on conflict (version, title) do update set
  summary = excluded.summary,
  note = excluded.note,
  image_url = excluded.image_url,
  status = excluded.status,
  updated_at = now();

select 'Hayatimiz Oyun v2.4.3 schema hazir. Ilk kullanim rehberi ve spoiler kontrollu hikaye aciklamasi aktif.' as status;


-- v2.4.4 - Mağaza Kaynak Kontrolü, Sosyal Medya ve YouTube Profesyonel Senkronizasyon
create table if not exists public.site_social_links (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null,
  icon_url text,
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index if not exists site_social_links_url_unique_idx on public.site_social_links(url);

insert into public.site_settings(key, value, updated_at) values
  ('schema_version', jsonb_build_object('version','v2.4.4','label','v2.4.4','applied_at', now(), 'note','Mağaza kaynak kontrolü, sosyal medya yönetimi ve YouTube profesyonel tablo senkronizasyonu aktif.'), now()),
  ('site_public_version', jsonb_build_object('version','v2.4.4','label','v2.4.4','applied_at', now()), now()),
  ('current_site_version', jsonb_build_object('version','v2.4.4','label','v2.4.4','applied_at', now()), now()),
  ('store_source_check_version', jsonb_build_object('version','v2.4.4','sources', jsonb_build_array('Steam','Epic Games','Ubisoft'), 'enabled', true), now()),
  ('social_media_manager_version', jsonb_build_object('version','v2.4.4','enabled', true, 'icon_source','site favicon'), now()),
  ('youtube_sync_table_version', jsonb_build_object('version','v2.4.4','enabled', true, 'mode','professional_episode_table'), now())
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into public.site_update_notes(version, title, summary, note, image_url, status, created_at)
values (
  'v2.4.4',
  'Mağaza Kaynak Kontrolü, Sosyal Medya ve YouTube Profesyonel Senkronizasyon',
  'Sol üst logo site logosuna çevrildi; Steam dışında Epic Games ve Ubisoft kaynak kontrolü eklendi; sosyal medya yönetimi, daha doğru RAWG sonuçları ve profesyonel YouTube bölüm tablosu eklendi.',
  'v2.4.4 ile yönetim paneline Sosyal Medya alanı eklendi. Sosyal medya ikonları ilgili sitelerin favicon/icon kaynaklarından çekilecek şekilde hazırlandı. Oyun ekle/düzenle formuna Steam, Epic Games ve Ubisoft kaynak kontrol alanları eklendi. YouTube Senkronize Et işlemi teknik bölüm metni yerine profesyonel tablo görünümüyle işlendi. RAWG kapak/meta sonuçları daha az ama daha doğru aday gösterecek şekilde filtrelendi. Tamamlanan sürümler PLANLANANLAR klasöründen çıkarılıp TAMAMLANANLAR klasörüne işlendi.',
  'previews/hayatimiz-oyun-v244-magaza-sosyal-youtube.png',
  'published',
  now()
)
on conflict do nothing;

select 'Hayatımız Oyun v2.4.9 FIX2 schema hazır. Son sürüm schema status ve güncelleme notları işlendi.' as status;


-- =========================================================
-- v2.4.5 - Profesyonel Oyun Formu, Bakım Merkezi ve Toplu Silme
-- =========================================================
create table if not exists public.site_version_history (
  id bigserial primary key,
  version text not null,
  title text not null,
  notes text,
  created_at timestamptz default now()
);

insert into public.site_version_history (version, title, notes)
values (
  'v2.4.5',
  'Profesyonel Oyun Formu, Bakım Merkezi ve Toplu Silme',
  'Oyun türü ve etiket kapak üstünde ayrı gösterildi. YouTube playlist bölümleri tek profesyonel tabloya düşürüldü. Bakım modu kaydetme/yüzde/güncelleme notları profesyonelleştirildi. Kayıtlı tüm oyunları silme ve oyun ekle formunu sıfırlama eklendi.'
)
on conflict do nothing;

insert into public.site_settings (key, value)
values (
  'current_version',
  jsonb_build_object('version','v2.4.5','title','Profesyonel Oyun Formu ve Bakım Merkezi','updated_at',now())
)
on conflict (key) do update set value = excluded.value, updated_at = now();


-- =========================================================
-- v2.4.6 - Seri İzleme Ekranı + Profesyonel Bakım Merkezi
-- =========================================================
create table if not exists public.site_runtime_config (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_update_notes (
  id bigserial primary key,
  version text,
  title text,
  summary text,
  note text,
  image_url text,
  status text default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz default now()
);

create unique index if not exists site_update_notes_version_title_unique_idx on public.site_update_notes(version, title);

insert into public.site_settings(key, value, updated_at) values
  ('schema_version', jsonb_build_object('version','v2.4.6','label','v2.4.6','applied_at', now(), 'note','Seri izleme ekranı, profesyonel bakım modu ve otomatik güncelleme notları aktif.'), now()),
  ('site_public_version', jsonb_build_object('version','v2.4.6','label','v2.4.6','applied_at', now()), now()),
  ('current_site_version', jsonb_build_object('version','v2.4.6','label','v2.4.6','applied_at', now()), now()),
  ('maintenance_center_version', jsonb_build_object('version','v2.4.6','save_enabled',true,'toggle_enabled',true,'auto_notes_limit',5), now()),
  ('series_watch_version', jsonb_build_object('version','v2.4.6','layout','professional_compact','previous_next_enabled',true), now()),
  ('gameplay_score_badge_version', jsonb_build_object('version','v2.4.6','mode','gameplay_average'), now())
on conflict (key) do update set value = excluded.value, updated_at = now();

-- v2.4.8 FIX2: Bakım modu ZIP/schema güncellemesinde asla overwrite edilmez.
-- Supabase'de kayıtlı maintenance_mode varsa olduğu gibi korunur.
insert into public.site_runtime_config(key, value, updated_at)
select
  'maintenance_mode',
  jsonb_build_object(
    'enabled', false,
    'message', 'Hayatımız Oyun kısa süreli bakımda. Yeni güncelleme hazırlanıyor.',
    'eta', '',
    'progress', 0,
    'version', 'v2.4.8 FIX2',
    'notesText', 'Bakım modu ilk kez kurulursa varsayılan not oluşturulur; mevcut kayıt varsa korunur.'
  ),
  now()
where not exists (select 1 from public.site_runtime_config where key = 'maintenance_mode');

insert into public.site_update_notes(version, title, summary, note, image_url, status, created_at, updated_at) values (
  'v2.4.6',
  'Seri İzleme Ekranı ve Profesyonel Bakım Merkezi',
  'Seri izleme ekranı daha kompakt ve okunaklı hale getirildi; bakım modu kaydet/aç/kapat, otomatik son 5 güncelleme notu ve kullanıcı önizlemesiyle güçlendirildi.',
  'v2.4.6 ile Supabase sürüm bilgisi güncellendi, bakım modu yönetim panelinde ve kullanıcı arayüzünde profesyonelleştirildi, kapak üstündeki puanlar ortalama oynanış puanı olarak etiketlendi, seriler sayfası ve izleme ekranı daha okunaklı hale getirildi.',
  'previews/hayatimiz-oyun-v246-seri-bakim.png',
  'published',
  now(),
  now()
)
on conflict (version, title) do update set summary=excluded.summary, note=excluded.note, image_url=excluded.image_url, status=excluded.status, updated_at=now();


-- v2.4.6 FIX1 - Seri ve Bakım Modu UI Düzeltmeleri
insert into public.site_settings (key, value)
values
  ('current_fix_version', '"v2.4.6 FIX1"'::jsonb),
  ('v2_4_6_fix1_notes', '["Seriler kompakt ve alfabetik hale getirildi", "Tür ve etiket rozetleri ayrıldı", "Bakım modu Kaydet/Aç/Kapat paneli profesyonelleştirildi"]'::jsonb)
on conflict (key) do update set value = excluded.value, updated_at = now();


-- v2.4.6 FIX2: Tür/etiket ayrımı düzeltildi, Steam puanı otomatik çekme notu eklendi.
insert into public.site_settings (key, value) values ('latest_fix_version', jsonb_build_object('version','v2.4.6 FIX2','title','Tür/etiket ayrımı ve Steam puanı otomatik çekme')) on conflict (key) do update set value = excluded.value;


-- v2.4.6 FIX3 - Steam puanı katı kural notu
-- Steam puanı bulunamazsa mevcut/eski puan kullanılmaz; form puan alanı boş bırakılır.
insert into public.site_update_notes (version, title, summary, note, description, status, created_at, updated_at)
values (
  'v2.4.6 FIX3',
  'Steam Puanı Katı Kural',
  'Steam puanı bulunamazsa mevcut/eski puan artık kullanılmaz.',
  'Steam puanı bulunamazsa mevcut/eski puan artık asla kullanılmaz; puan alanı boş bırakılır.',
  'Steam puanı bulunamazsa mevcut/eski puan artık asla kullanılmaz; puan alanı boş bırakılır.',
  'published',
  now(),
  now()
)
on conflict (version, title) do update set
  summary = excluded.summary,
  note = excluded.note,
  description = excluded.description,
  status = excluded.status,
  updated_at = now();

-- v2.4.6 FIX4 - schema.sql site_update_notes kolon güvenliği
alter table public.site_update_notes add column if not exists description text;
alter table public.site_update_notes add column if not exists written text;
alter table public.site_update_notes add column if not exists updated_at timestamptz;

insert into public.site_settings (key, value, updated_at)
values (
  'latest_fix_version',
  jsonb_build_object(
    'version', 'v2.4.6 FIX4',
    'title', 'schema.sql site_update_notes kolon güvenliği',
    'note', 'site_update_notes tablosunda description kolonu yok hatası kalıcı olarak düzeltildi.',
    'applied_at', now()
  ),
  now()
)
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into public.site_update_notes (version, title, summary, note, description, status, created_at, updated_at)
values (
  'v2.4.6 FIX4',
  'Schema Güncelleme Notları Kolon Güvenliği',
  'site_update_notes tablosunda eksik description/written/updated_at kolonları güvenli şekilde eklendi.',
  'schema.sql artık mevcut Supabase tablolarında kolon eksik olsa bile önce kolonları ekler, sonra sürüm notlarını işler. Böylece description kolonu yok hatası tekrarlanmaz.',
  'schema.sql artık mevcut Supabase tablolarında kolon eksik olsa bile önce kolonları ekler, sonra sürüm notlarını işler. Böylece description kolonu yok hatası tekrarlanmaz.',
  'published',
  now(),
  now()
)
on conflict (version, title) do update set
  summary = excluded.summary,
  note = excluded.note,
  description = excluded.description,
  status = excluded.status,
  updated_at = now();


-- v2.4.6 FIX5 - Bakım Modu Butonları
create table if not exists public.site_update_notes (
  id bigserial primary key,
  version text unique,
  title text,
  summary text,
  note text,
  description text,
  status text default 'completed',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.site_update_notes add column if not exists description text;
alter table public.site_update_notes add column if not exists summary text;
alter table public.site_update_notes add column if not exists note text;
alter table public.site_update_notes add column if not exists status text default 'completed';
alter table public.site_update_notes add column if not exists updated_at timestamptz default now();
delete from public.site_update_notes where version = 'v2.4.6 FIX5' and title = 'Bakım Modu Butonları';
insert into public.site_update_notes (version, title, summary, note, description, status, updated_at)
values (
  'v2.4.6 FIX5',
  'Bakım Modu Butonları',
  'Bakım modu yönetim ekranında Kaydet, Önizle, Bakımı Aç ve Bakımı Kapat butonları görünür hale getirildi.',
  'Mobil ve masaüstü ekranda bakım butonları üst ve alt aksiyon barında gösterilir.',
  'Bakım modu kontrol merkezi Kaydet/Aç/Kapat butonlarıyla güçlendirildi.',
  'completed',
  now()
);


-- v2.4.6 FIX6 - Varsayılan 8.5 puanı kaldırıldı
insert into public.site_update_notes (version, title, summary, note, description, status, created_at, updated_at)
values ('v2.4.6 FIX6', 'Varsayılan 8.5 Puanı Kaldırıldı', 'Steam puanı gelmedikçe kartlarda, formda ve önizlemede otomatik 8.5 gösterimi kaldırıldı.', 'Steam puanı yoksa Puan yok görünür; mevcut/eski puan otomatik kullanılmaz.', 'Varsayılan 8.5 puanı kaldırıldı.', 'completed', now(), now())
on conflict do nothing;


-- v2.4.6 FIX7 - DLC kapak rozeti notu
create table if not exists public.site_update_notes (
  id bigserial primary key,
  version text,
  title text,
  summary text,
  note text,
  description text,
  status text default 'Tamamlandı',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_update_notes add column if not exists description text;
alter table if exists public.site_update_notes add column if not exists summary text;
alter table if exists public.site_update_notes add column if not exists note text;
alter table if exists public.site_update_notes add column if not exists status text default 'Tamamlandı';
delete from public.site_update_notes where version = 'v2.4.6 FIX7' and title = 'DLC Kapak Rozeti';
insert into public.site_update_notes (version, title, summary, note, description, status, updated_at)
values (
  'v2.4.6 FIX7',
  'DLC Kapak Rozeti',
  'Kapak çekilen DLC oyunlar artık DLC rozeti ile gösterilir.',
  'Oyun arşivi, ana sayfa, seri kartları ve seri ilerleme kartlarında DLC etiketi kapağın üstünde görünür.',
  'DLC olarak algılanan oyunların kapağında kırmızı DLC rozeti görünür.',
  'Tamamlandı',
  now()
);


-- v2.4.6 FIX8 - site_update_notes ON CONFLICT(version) hatası düzeltildi
alter table if exists public.site_update_notes add column if not exists description text;
alter table if exists public.site_update_notes add column if not exists summary text;
alter table if exists public.site_update_notes add column if not exists note text;
alter table if exists public.site_update_notes add column if not exists status text default 'Tamamlandı';
alter table if exists public.site_update_notes add column if not exists updated_at timestamptz default now();
delete from public.site_update_notes where version = 'v2.4.6 FIX8' and title = 'Schema ON CONFLICT Version Fix';
insert into public.site_update_notes (version, title, summary, note, description, status, updated_at)
values (
  'v2.4.6 FIX8',
  'Schema ON CONFLICT Version Fix',
  'site_update_notes tablosunda version için unique constraint olmadığı durumda oluşan ON CONFLICT hatası düzeltildi.',
  'Schema sürüm notları artık aynı versiyonu önce silip sonra ekler; unique constraint gerektirmez.',
  'Supabase SQL tekrar çalıştırıldığında ON CONFLICT(version) hatası vermez.',
  'Tamamlandı',
  now()
);


-- v2.4.6 FIX9 - Steam Kontrol Et eksikleri tamamlar
insert into public.site_runtime_config (key, value, updated_at)
values ('schema_version', jsonb_build_object('version','v2.4.6 FIX9','title','Steam Kontrol Et eksikleri tamamlar','applied_at',now()), now())
on conflict (key) do update set value = excluded.value, updated_at = now();
delete from public.site_update_notes where version = 'v2.4.6 FIX9' and title = 'Steam Kontrol Et Eksikleri Tamamlar';
insert into public.site_update_notes (version, title, summary, note, description, status, created_at, updated_at)
values (
  'v2.4.6 FIX9',
  'Steam Kontrol Et Eksikleri Tamamlar',
  'Steam Kontrol Et butonu eksik kapak, tarih, tür, açıklama ve varsa Steam puanını forma otomatik işler.',
  'Steam puanı yoksa varsayılan/eski puan kullanılmaz; puan alanı boş bırakılır.',
  'Yönetim panelinde Steam kontrolü artık sadece kontrol değil, eksik alan tamamlama görevi de yapar.',
  'Tamamlandı',
  now(),
  now()
);


-- v2.4.7 - XP/Level V2 + Profesyonel UI güncelleme notu
create table if not exists public.site_update_notes (
  id bigserial primary key,
  version text,
  title text,
  summary text,
  note text,
  description text,
  status text default 'Tamamlandı',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_update_notes add column if not exists version text;
alter table if exists public.site_update_notes add column if not exists title text;
alter table if exists public.site_update_notes add column if not exists summary text;
alter table if exists public.site_update_notes add column if not exists note text;
alter table if exists public.site_update_notes add column if not exists description text;
alter table if exists public.site_update_notes add column if not exists status text default 'Tamamlandı';
alter table if exists public.site_update_notes add column if not exists updated_at timestamptz default now();

delete from public.site_update_notes where version = 'v2.4.7';
insert into public.site_update_notes (version, title, summary, note, description, status, created_at, updated_at)
values (
  'v2.4.7',
  'XP/Level V2, Puan Ortalaması ve Profesyonel Seri/Video Arayüzü',
  'Steam + Google puan ortalaması, profesyonel video/seri kartları, üst kaydet/güncelle butonları, DLC rozeti ve gelişmiş rehber eklendi.',
  'Puan çekme sistemi Steam ve Google kaynaklarından ortalama almaya hazırlandı. Oyun kartları ve videolar daha profesyonel görünüme geçirildi.',
  'v2.4.7 paketi XP/Level V2 planı üzerine profesyonel seri/video arayüzü, tür/etiket ayrımı, DLC rozeti, gelişmiş rehber ve puan ortalama sistemini içerir.',
  'Tamamlandı',
  now(),
  now()
);

create table if not exists public.site_schema_versions (
  version text primary key,
  title text,
  applied_at timestamptz default now()
);
delete from public.site_schema_versions where version = 'v2.4.7';
insert into public.site_schema_versions (version, title, applied_at)
values ('v2.4.7', 'XP/Level V2 ve Profesyonel UI', now());


-- v2.4.7 FIX1 - Seriler altında oyunlar görünür notu
create table if not exists public.site_update_notes (
  id bigserial primary key,
  version text,
  title text,
  summary text,
  note text,
  description text,
  status text default 'Tamamlandı',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_update_notes add column if not exists description text;
alter table if exists public.site_update_notes add column if not exists summary text;
alter table if exists public.site_update_notes add column if not exists note text;
alter table if exists public.site_update_notes add column if not exists status text default 'Tamamlandı';
delete from public.site_update_notes where version = 'v2.4.7 FIX1';
insert into public.site_update_notes (version, title, summary, note, description, status)
values (
  'v2.4.7 FIX1',
  'Seriler Altında Oyunlar Görünür',
  'Seriler sayfasında her seri kartının altında o seriye bağlı oyunlar mini liste olarak gösterilir.',
  'Oyunlar küçük kapak, sıra numarası, bölüm ilerlemesi ve DLC rozetiyle listelenir.',
  'Seriler altında oyunlar görünmüyordu; bu düzeltmeyle seri kartlarının içine alt oyun listesi eklendi.',
  'Tamamlandı'
);


-- v2.4.7 FIX2 - Bakım modu butonları ve schema version notu
create table if not exists public.site_update_notes (
  id bigserial primary key,
  version text,
  title text,
  summary text,
  note text,
  description text,
  status text default 'Tamamlandı',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_update_notes add column if not exists version text;
alter table if exists public.site_update_notes add column if not exists title text;
alter table if exists public.site_update_notes add column if not exists summary text;
alter table if exists public.site_update_notes add column if not exists note text;
alter table if exists public.site_update_notes add column if not exists description text;
alter table if exists public.site_update_notes add column if not exists status text default 'Tamamlandı';
alter table if exists public.site_update_notes add column if not exists updated_at timestamptz default now();
delete from public.site_update_notes where version = 'v2.4.7 FIX2';
insert into public.site_update_notes (version, title, summary, note, description, status)
values (
  'v2.4.7 FIX2',
  'Bakım Modu Butonları Görünür',
  'Kaydet, Önizle, Bakımı Aç ve Bakımı Kapat butonları sabit görünür hale getirildi.',
  'Bakım modu yönetim ekranına üst ve alt aksiyon barı eklendi. Mobilde butonların kaybolması engellendi.',
  'Bakım Modu ekranında kaydetme, açma ve kapatma işlemleri için bağımsız güvenli action handler eklendi.',
  'Tamamlandı'
);
create table if not exists public.site_runtime_config (
  key text,
  value jsonb,
  updated_at timestamptz default now()
);
alter table if exists public.site_runtime_config add column if not exists key text;
alter table if exists public.site_runtime_config add column if not exists value jsonb;
alter table if exists public.site_runtime_config add column if not exists updated_at timestamptz default now();
delete from public.site_runtime_config where key = 'schema_version';
insert into public.site_runtime_config (key, value, updated_at)
values ('schema_version', '{"version":"v2.4.7 FIX2","title":"Bakım Modu Butonları Görünür"}'::jsonb, now());


-- v2.4.7 FIX3 - Bakım modu butonları ve bağımsız puan çekme notu
create table if not exists public.site_update_notes (
  id bigserial primary key,
  version text,
  title text,
  summary text,
  note text,
  description text,
  status text default 'Tamamlandı',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_update_notes add column if not exists version text;
alter table if exists public.site_update_notes add column if not exists title text;
alter table if exists public.site_update_notes add column if not exists summary text;
alter table if exists public.site_update_notes add column if not exists note text;
alter table if exists public.site_update_notes add column if not exists description text;
alter table if exists public.site_update_notes add column if not exists status text default 'Tamamlandı';
alter table if exists public.site_update_notes add column if not exists updated_at timestamptz default now();
delete from public.site_update_notes where version = 'v2.4.7 FIX3';
insert into public.site_update_notes (version, title, summary, note, description, status, created_at, updated_at)
values (
  'v2.4.7 FIX3',
  'Bakım Modu ve Puan Çekme Düzeltmesi',
  'Bakım modu gerçek Kaydet/Aç/Kapat butonlarıyla yeniden düzenlendi; puan çekme bağımsız çalışır.',
  'Bakım modu yüzde, mesaj, tarih ve güncelleme notlarını kaydeder. Puanı Çek / Ortalama Al butonu Tümünü Çek işleminden ayrı çalışır.',
  'v2.4.7 FIX3 ile bakım modu butonları büyük aksiyon paneli olarak görünür hale getirildi.',
  'Tamamlandı',
  now(),
  now()
);


-- v2.4.7 FIX4 - Bakım modu kesin buton düzeltmesi
create table if not exists public.site_update_notes (
  id bigserial primary key,
  version text,
  title text,
  summary text,
  note text,
  description text,
  status text default 'Tamamlandı',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_update_notes add column if not exists summary text;
alter table if exists public.site_update_notes add column if not exists note text;
alter table if exists public.site_update_notes add column if not exists description text;
alter table if exists public.site_update_notes add column if not exists status text default 'Tamamlandı';
delete from public.site_update_notes where version = 'v2.4.7 FIX4';
insert into public.site_update_notes (version, title, summary, note, description, status)
values (
  'v2.4.7 FIX4',
  'Bakım Modu Kesin Buton Düzeltmesi',
  'Bakım modu ekranına renderlardan bağımsız sabit işlem paneli eklendi.',
  'Kaydet, Önizle, Bakımı Aç ve Bakımı Kapat butonları her zaman görünür ve settings-set API ile kayıt yapar.',
  'Mobilde altta sabit panel, masaüstünde üstte sabit panel ile bakım modu yönetimi kesin görünür hale getirildi.',
  'Tamamlandı'
);


-- v2.4.7 FIX5 - Profesyonel bakım modu UI
create table if not exists public.site_update_notes (
  id bigserial primary key,
  version text,
  title text,
  summary text,
  note text,
  description text,
  status text default 'Tamamlandı',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_update_notes add column if not exists description text;
alter table if exists public.site_update_notes add column if not exists summary text;
alter table if exists public.site_update_notes add column if not exists note text;
alter table if exists public.site_update_notes add column if not exists status text default 'Tamamlandı';
alter table if exists public.site_update_notes add column if not exists updated_at timestamptz default now();
delete from public.site_update_notes where version = 'v2.4.7 FIX5';
insert into public.site_update_notes (version, title, summary, note, description, status, updated_at)
values (
  'v2.4.7 FIX5',
  'Profesyonel Bakım Modu UI',
  'Bakım modu admin paneli ve kullanıcı ekranı profesyonel hale getirildi.',
  'Kötü görünen sabit buton barı kaldırıldı; Kaydet, Önizle, Bakımı Aç, Bakımı Kapat ve Son 5 Notu Getir tek panelde toplandı.',
  'Admin bakım modu ekranı modern panel tasarımına, kullanıcı bakım ekranı profesyonel kartlı görünüme alındı.',
  'Tamamlandı',
  now()
);


-- v2.4.7 FIX6 - Steam / Epic Games / Ubisoft puan ortalaması notu
create table if not exists public.site_update_notes (
  id bigserial primary key,
  version text,
  title text,
  summary text,
  note text,
  description text,
  status text default 'Tamamlandı',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_update_notes add column if not exists summary text;
alter table if exists public.site_update_notes add column if not exists note text;
alter table if exists public.site_update_notes add column if not exists description text;
alter table if exists public.site_update_notes add column if not exists status text default 'Tamamlandı';
delete from public.site_update_notes where version = 'v2.4.7 FIX6';
insert into public.site_update_notes (version, title, summary, note, description, status)
values (
  'v2.4.7 FIX6',
  'Steam / Epic Games / Ubisoft Puan Ortalaması',
  'Steam Kontrol Et butonu artık çoklu mağaza/kaynak puan ortalamasını forma işler.',
  'Steam, Google, Epic Games ve Ubisoft kaynakları kontrol edilir; puan bulunursa ortalama forma yazılır.',
  'Puan bulunamazsa varsayılan puan kullanılmaz ve form puan alanı boş bırakılır.',
  'Tamamlandı'
);


-- v2.4.7 FIX7 - Seri/video/canli form ve bakım kalıcı kayıt
create table if not exists public.site_runtime_config (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_runtime_config add column if not exists value jsonb not null default '{}'::jsonb;
alter table if exists public.site_runtime_config add column if not exists updated_at timestamptz default now();
create table if not exists public.site_update_notes (
  id bigserial primary key,
  version text,
  title text,
  summary text,
  note text,
  description text,
  status text default 'Tamamlandı',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_update_notes add column if not exists description text;
alter table if exists public.site_update_notes add column if not exists summary text;
alter table if exists public.site_update_notes add column if not exists note text;
alter table if exists public.site_update_notes add column if not exists status text default 'Tamamlandı';
delete from public.site_update_notes where version = 'v2.4.7 FIX7';
insert into public.site_update_notes (version,title,summary,note,description,status,updated_at)
values (
  'v2.4.7 FIX7',
  'Seri, Video, Canlı Puan / YouTube ve Bakım Kaydı',
  'Video kapakları, seri alt oyun listesi, canlı puan/YouTube önizlemesi ve bakım modu kaydı güçlendirildi.',
  'Puan çekme ve YouTube senkronizasyonu kaydetmeden önce formda canlı görünür. Bakım modu Supabase site_runtime_config içine kaydedilir.',
  'Serilerde tür/etiket ayrımı, kaydırmalı oyun listesi, video kapak sığdırma ve form bildirimleri eklendi.',
  'Tamamlandı',
  now()
);
insert into public.site_runtime_config (key,value,updated_at)
values ('schema_version', jsonb_build_object('version','v2.4.7 FIX7','note','Seri video canlı form ve bakım kaydı güncellemesi','updated_at',now()), now())
on conflict (key) do update set value=excluded.value, updated_at=now();


-- v2.4.7 FIX8 - Puan çekme ve kaydetme kalıcı düzeltme
create table if not exists public.site_update_notes (
  id bigserial primary key,
  version text,
  title text,
  summary text,
  note text,
  description text,
  status text default 'Tamamlandı',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_update_notes add column if not exists summary text;
alter table if exists public.site_update_notes add column if not exists note text;
alter table if exists public.site_update_notes add column if not exists description text;
alter table if exists public.site_update_notes add column if not exists status text default 'Tamamlandı';
delete from public.site_update_notes where version='v2.4.7 FIX8';
insert into public.site_update_notes (version,title,summary,note,description,status)
values ('v2.4.7 FIX8','Puan Çekme ve Kaydetme','Steam/Google/Epic/Ubisoft puanı forma canlı yazılır ve kaydet/güncelle sırasında Supabase score alanına korunarak gönderilir.','scoreSource alanı eklenerek eski submit guardlarının puanı silmesi engellendi.','Puanı Çek / Ortalama Al ve Steam Kontrol Et sonrasında puan kaybolmadan kaydedilir.','Tamamlandı');


-- v2.4.7 FIX9 - Etiket ve puan koruma notu
create table if not exists public.site_update_notes (
  id bigserial primary key,
  version text,
  title text,
  summary text,
  note text,
  description text,
  status text default 'Tamamlandı',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_update_notes add column if not exists summary text;
alter table if exists public.site_update_notes add column if not exists note text;
alter table if exists public.site_update_notes add column if not exists description text;
alter table if exists public.site_update_notes add column if not exists status text default 'Tamamlandı';
delete from public.site_update_notes where version = 'v2.4.7 FIX9';
insert into public.site_update_notes (version, title, summary, note, description, status)
values (
  'v2.4.7 FIX9',
  'Etiket ve Puan Koruma',
  'Mevcut oyun düzenleme formunda etiket ve puanın silinmesi engellendi.',
  'Tüm verileri çek veya düzenleme formu açma işlemi boş veri döndürse bile mevcut tags ve score korunur.',
  'A Plague Tale: Requiem dahil tüm mevcut oyunlarda düzenleme sırasında etiket ve puan kaybolmaz.',
  'Tamamlandı'
);


-- v2.4.7 FIX10 - Video/seri görünümü ve toplu mevcut oyun güncelleme notu
create table if not exists public.site_update_notes (
  id bigserial primary key,
  version text,
  title text,
  summary text,
  note text,
  description text,
  status text default 'Tamamlandı',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_update_notes add column if not exists description text;
alter table if exists public.site_update_notes add column if not exists summary text;
alter table if exists public.site_update_notes add column if not exists note text;
alter table if exists public.site_update_notes add column if not exists status text default 'Tamamlandı';
delete from public.site_update_notes where version = 'v2.4.7 FIX10';
insert into public.site_update_notes (version, title, summary, note, description, status)
values (
  'v2.4.7 FIX10',
  'Video / Seri / Toplu Mevcut Oyun Güncelleme',
  'Videolarda tür ve etiket ayrıldı; serilerde alt oyunlar kaydırmalı listelendi; tüm mevcut oyunları tek tuşla tekrar çekme eklendi.',
  'Puan ve YouTube senkronizasyonu formda canlı görünür. Toplu güncelleme boş gelen veriyle mevcut alanları silmez.',
  'Video kapakları tam sığar, seri kartlarında oyun sayısı ve kaydırmalı alt oyun listesi görünür.',
  'Tamamlandı'
);
create table if not exists public.site_runtime_config (
  key text primary key,
  value jsonb,
  updated_at timestamptz default now()
);
insert into public.site_runtime_config (key, value, updated_at)
values ('schema_version', jsonb_build_object('version','v2.4.7 FIX10','note','Video/seri görünümü ve toplu mevcut oyun güncelleme sistemi','updated_at',now()), now())
on conflict (key) do update set value=excluded.value, updated_at=now();


-- v2.4.7 FIX11 - Video alfabetik şerit ve tümünü getir sürüm notu
create table if not exists public.site_update_notes (
  id bigserial primary key,
  version text,
  title text,
  summary text,
  note text,
  description text,
  status text default 'Tamamlandı',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_update_notes add column if not exists summary text;
alter table if exists public.site_update_notes add column if not exists note text;
alter table if exists public.site_update_notes add column if not exists description text;
alter table if exists public.site_update_notes add column if not exists status text default 'Tamamlandı';
delete from public.site_update_notes where version = 'v2.4.7 FIX11';
insert into public.site_update_notes (version, title, summary, note, description, status)
values (
  'v2.4.7 FIX11',
  'Video Alfabetik Şerit ve Tümünü Getir',
  'Videolar sayfasına A-Z harf grupları ve mevcut oyunlar için toplu tüm bilgileri tekrar çekme sistemi eklendi.',
  'Kayıtlı oyunların kapak, tarih, tür, etiket, açıklama ve puan bilgileri boş veriyle silinmeden tekrar kontrol edilir.',
  'Videolar A serisi/B serisi gibi alfabetik şeritlerle listelenir. Yönetim paneline Tüm Bilgileri Tekrar Çek ve Tümünü Getir butonları eklendi.',
  'Tamamlandı'
);
create table if not exists public.site_runtime_config (
  key text primary key,
  value jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);
insert into public.site_runtime_config (key, value, updated_at)
values ('schema_version', jsonb_build_object('version','v2.4.7 FIX11','note','Video alfabetik şerit ve tümünü getir','updated_at',now()), now())
on conflict (key) do update set value=excluded.value, updated_at=now();


-- v2.4.7 FIX12 - Video alfabetik ve Mevcut Oyunlar tümünü getir kesin düzeltme
create table if not exists public.site_update_notes (
  id bigserial primary key,
  version text,
  title text,
  summary text,
  note text,
  description text,
  status text default 'Tamamlandı',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_update_notes add column if not exists summary text;
alter table if exists public.site_update_notes add column if not exists note text;
alter table if exists public.site_update_notes add column if not exists description text;
alter table if exists public.site_update_notes add column if not exists status text default 'Tamamlandı';

delete from public.site_update_notes where version = 'v2.4.7 FIX12';
insert into public.site_update_notes (version, title, summary, note, description, status, updated_at)
values (
  'v2.4.7 FIX12',
  'Video Alfabetik ve Mevcut Oyunlar Tümünü Getir Kesin Düzeltme',
  'Videolar/Oyun Arşivi sayfasına A-Z harf şeridi eklendi; Mevcut Oyunlar ekranında tüm kayıtlı oyunları tekrar çekme paneli görünür hale getirildi.',
  'Serilerde alfabetik harfe tıklayınca ana sayfaya atma sorunu engellendi. Schema sürüm notu güncel versiyona çekildi.',
  'v2.4.7 FIX12 ile video alfabetik sıralama, toplu oyun bilgisi çekme ve seri alfabetik tıklama düzeltmesi tamamlandı.',
  'Tamamlandı',
  now()
);


-- v2.4.7 FIX13 - Kayıtlı oyun koruma ve video alfabe düzeltmesi
create table if not exists public.site_update_notes (
  id bigserial primary key,
  version text,
  title text,
  summary text,
  note text,
  description text,
  status text default 'Tamamlandı',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_update_notes add column if not exists summary text;
alter table if exists public.site_update_notes add column if not exists note text;
alter table if exists public.site_update_notes add column if not exists description text;
alter table if exists public.site_update_notes add column if not exists status text default 'Tamamlandı';
delete from public.site_update_notes where version = 'v2.4.7 FIX13';
insert into public.site_update_notes (version, title, summary, note, description, status, updated_at)
values (
  'v2.4.7 FIX13',
  'Kayıtlı Oyun Koruma ve Video Alfabe',
  'Mevcut Oyunlar ekranındaki kayıtları otomatik değiştiren toplu tümünü çek paneli kaldırıldı; güvenli kayıtlı oyunları getir paneli eklendi.',
  'Videolar sayfası A Harfinde Başlayan Oyunlar gibi profesyonel başlıklarla listelenir. Serilerde alfabetik tıklama ana sayfaya atmaz.',
  'Kayıtlı oyunlar artık tek tuşla yeniden getirilebilir fakat otomatik veri çekme kayıtları bozmaz.',
  'Tamamlandı',
  now()
);
create table if not exists public.site_runtime_config (
  key text primary key,
  value jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);
insert into public.site_runtime_config (key, value, updated_at)
values ('schema_version', jsonb_build_object('version','v2.4.7 FIX13','note','Kayıtlı oyun koruma ve video alfabe düzeltmesi','updated_at',now()), now())
on conflict (key) do update set value=excluded.value, updated_at=now();


-- v2.4.8 - Profil, Video Alfabe, Seri Harf ve Kapak Çekme Güncellemesi
create table if not exists public.site_update_notes (
  id bigserial primary key,
  version text,
  title text,
  summary text,
  note text,
  description text,
  status text default 'Tamamlandı',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_update_notes add column if not exists description text;
alter table if exists public.site_update_notes add column if not exists summary text;
alter table if exists public.site_update_notes add column if not exists note text;
alter table if exists public.site_update_notes add column if not exists status text default 'Tamamlandı';
alter table if exists public.site_update_notes add column if not exists updated_at timestamptz default now();

delete from public.site_update_notes where version = 'v2.4.8';
insert into public.site_update_notes (version, title, summary, note, description, status)
values (
  'v2.4.8',
  'Profil, Video Alfabe, Seri Harf ve Kapak Çekme Güncellemesi',
  'Profil istatistikleri, videolar için profesyonel alfabetik şerit, serilerde harf tıklama düzeltmesi ve kapak çekme iyileştirmeleri tamamlandı.',
  'Video sayfasında A Harfinde Başlayan Oyunlar başlığı ve profesyonel harf şeridi eklendi. Serilerde harf tıklayınca ana sayfaya atma sorunu engellendi. Tüm Bilgileri Çek kapakları daha doğru forma işler.',
  'v2.4.8 ile profil ve izleme istatistikleri geliştirildi; videolar ve seriler daha profesyonel alfabetik düzen aldı.',
  'Tamamlandı'
);

create table if not exists public.site_schema_versions (
  id bigserial primary key,
  version text,
  note text,
  created_at timestamptz default now()
);
delete from public.site_schema_versions where version = 'v2.4.8';

-- FIX1 prelude: site_schema_versions note kolonu eski insert satırlarından önce güvenli oluşturulur.
create table if not exists public.site_schema_versions (
  id bigserial primary key,
  version text,
  note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_schema_versions add column if not exists version text;
alter table if exists public.site_schema_versions add column if not exists note text;
alter table if exists public.site_schema_versions add column if not exists created_at timestamptz default now();
alter table if exists public.site_schema_versions add column if not exists updated_at timestamptz default now();

insert into public.site_schema_versions (version, note)
values ('v2.4.8', 'Profil istatistikleri, video alfabetik şerit, seri harf düzeltmesi ve kapak çekme iyileştirmesi.');



-- v2.4.8 FIX1 - site_schema_versions note kolonu güvenli düzeltmesi
create table if not exists public.site_schema_versions (
  id bigserial primary key,
  version text,
  note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table if exists public.site_schema_versions
  add column if not exists version text;

alter table if exists public.site_schema_versions
  add column if not exists note text;

alter table if exists public.site_schema_versions
  add column if not exists created_at timestamptz default now();

alter table if exists public.site_schema_versions
  add column if not exists updated_at timestamptz default now();

-- Unique constraint gerektirmeyen güvenli sürüm kaydı:
-- Önce aynı sürüm notunu siler, sonra yeniden ekler.
delete from public.site_schema_versions
where version = 'v2.4.8 FIX1';

insert into public.site_schema_versions (version, note, created_at, updated_at)
values (
  'v2.4.8 FIX1',
  'site_schema_versions tablosundaki eksik note kolonu güvenli şekilde eklendi. Bundan sonraki sürüm kayıtları kolon yok hatasına düşmeyecek.',
  now(),
  now()
);

-- Güncelleme notları tablosu da güvenli tutulur.
create table if not exists public.site_update_notes (
  id bigserial primary key,
  version text,
  title text,
  summary text,
  note text,
  description text,
  status text default 'Tamamlandı',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table if exists public.site_update_notes add column if not exists version text;
alter table if exists public.site_update_notes add column if not exists title text;
alter table if exists public.site_update_notes add column if not exists summary text;
alter table if exists public.site_update_notes add column if not exists note text;
alter table if exists public.site_update_notes add column if not exists description text;
alter table if exists public.site_update_notes add column if not exists status text default 'Tamamlandı';
alter table if exists public.site_update_notes add column if not exists created_at timestamptz default now();
alter table if exists public.site_update_notes add column if not exists updated_at timestamptz default now();

delete from public.site_update_notes
where version = 'v2.4.8 FIX1';

insert into public.site_update_notes (version, title, summary, note, description, status, created_at, updated_at)
values (
  'v2.4.8 FIX1',
  'Schema site_schema_versions Kolon Düzeltmesi',
  'site_schema_versions tablosunda eksik note kolonu nedeniyle oluşan SQL hatası giderildi.',
  'schema.sql artık site_schema_versions.note kolonunu güvenli şekilde ekler ve sürüm notunu constraint gerektirmeden kaydeder.',
  'Supabase SQL Editor çalıştırıldığında column "note" does not exist hatası tekrar oluşmamalıdır.',
  'Tamamlandı',
  now(),
  now()
);



-- v2.4.8 FIX2 - Bakım modu koruma ve kapak öneri sistemi
create table if not exists public.site_runtime_config (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_runtime_config add column if not exists value jsonb not null default '{}'::jsonb;
alter table if exists public.site_runtime_config add column if not exists updated_at timestamptz default now();

-- ÖNEMLİ: maintenance_mode burada overwrite edilmez. Kayıt varsa Supabase'deki değer korunur.
insert into public.site_runtime_config(key, value, updated_at)
select 'maintenance_mode', jsonb_build_object(
  'enabled', false,
  'message', 'Hayatımız Oyun kısa süreli bakımda.',
  'eta', '',
  'progress', 0,
  'version', 'v2.4.8 FIX2'
), now()
where not exists (select 1 from public.site_runtime_config where key='maintenance_mode');

-- schema_version güncellenir ama bakım modu ayarı sıfırlanmaz.
delete from public.site_runtime_config where key='schema_version';
insert into public.site_runtime_config(key, value, updated_at)
values ('schema_version', jsonb_build_object(
  'version','v2.4.8 FIX2',
  'note','Bakım modu Supabase değeri korunur; kapak önerileri 6 adayla form altında gösterilir.',
  'updated_at',now()
), now());

create table if not exists public.site_update_notes (
  id bigserial primary key,
  version text,
  title text,
  summary text,
  note text,
  description text,
  status text default 'Tamamlandı',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_update_notes add column if not exists version text;
alter table if exists public.site_update_notes add column if not exists title text;
alter table if exists public.site_update_notes add column if not exists summary text;
alter table if exists public.site_update_notes add column if not exists note text;
alter table if exists public.site_update_notes add column if not exists description text;
alter table if exists public.site_update_notes add column if not exists status text default 'Tamamlandı';
alter table if exists public.site_update_notes add column if not exists updated_at timestamptz default now();

delete from public.site_update_notes where version='v2.4.8 FIX2';
insert into public.site_update_notes(version,title,summary,note,description,status,updated_at)
values (
  'v2.4.8 FIX2',
  'Bakım Modu Koruma ve 6 Kapak Önerisi',
  'Schema çalıştırıldığında bakım modu Supabase değerleri korunur; kapak çekme önbelleğe yazmadan 6 doğru aday gösterir.',
  'maintenance_mode artık schema.sql içinde overwrite edilmez. Tüm Bilgileri Çek işlemi DLC dahil oyunlar için Steam/Google/RAWG kaynaklarından 6 kapak önerisini form altında gösterir.',
  'ZIP güncellense bile Supabase site_runtime_config.maintenance_mode kaydı varsa sıfırlanmaz.',
  'Tamamlandı',
  now()
);



-- v2.4.9 - Mobil/tablet uyumluluk ve kapak önizleme sürüm notu
create table if not exists public.site_schema_versions (
  id bigserial primary key,
  version text,
  note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_schema_versions add column if not exists version text;
alter table if exists public.site_schema_versions add column if not exists note text;
alter table if exists public.site_schema_versions add column if not exists created_at timestamptz default now();
alter table if exists public.site_schema_versions add column if not exists updated_at timestamptz default now();

delete from public.site_schema_versions where version = 'v2.4.9';
insert into public.site_schema_versions (version, note, created_at, updated_at)
values (
  'v2.4.9',
  'Mobil/tablet uyumluluk, Tüm Bilgileri Çek kapak önerileri ve Steam kapak canlı önizleme sistemi eklendi.',
  now(),
  now()
);

create table if not exists public.site_update_notes (
  id bigserial primary key,
  version text,
  title text,
  summary text,
  note text,
  description text,
  status text default 'Tamamlandı',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_update_notes add column if not exists version text;
alter table if exists public.site_update_notes add column if not exists title text;
alter table if exists public.site_update_notes add column if not exists summary text;
alter table if exists public.site_update_notes add column if not exists note text;
alter table if exists public.site_update_notes add column if not exists description text;
alter table if exists public.site_update_notes add column if not exists status text default 'Tamamlandı';
alter table if exists public.site_update_notes add column if not exists created_at timestamptz default now();
alter table if exists public.site_update_notes add column if not exists updated_at timestamptz default now();

delete from public.site_update_notes where version = 'v2.4.9';
insert into public.site_update_notes (version, title, summary, note, description, status, created_at, updated_at)
values (
  'v2.4.9',
  'Mobil ve Tablet Uyumluluk + Kapak Önizleme',
  'Mobil/tablet görünüm iyileştirildi; Tüm Bilgileri Çek ve Steam Kontrol Et kapakları canlı önizlemeye işler.',
  'Kapak önerileri form altında 6 seçenekle gösterilir; seçilen kapak kaydetmeden Supabase’e yazılmaz.',
  'Telefon, tablet ve küçük ekran uyumu güçlendirildi. Steam/Google/RAWG kaynaklarından kapak önerileri canlı forma aktarılır.',
  'Tamamlandı',
  now(),
  now()
);




-- v2.4.9 FIX1 - Profesyonel harf paneli, kapak önizleme, YouTube görünümü ve schema versiyon düzeltmesi
create table if not exists public.site_schema_versions (
  id bigserial primary key,
  version text,
  note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_schema_versions add column if not exists version text;
alter table if exists public.site_schema_versions add column if not exists note text;
alter table if exists public.site_schema_versions add column if not exists created_at timestamptz default now();
alter table if exists public.site_schema_versions add column if not exists updated_at timestamptz default now();

delete from public.site_schema_versions where version = 'v2.4.9 FIX1';
insert into public.site_schema_versions (version, note, created_at, updated_at)
values (
  'v2.4.9 FIX1',
  'Profesyonel harf paneli, canlı kapak önizleme, YouTube kart görünümü ve son versiyon kaydı güncellendi.',
  now(),
  now()
);

create table if not exists public.site_update_notes (
  id bigserial primary key,
  version text,
  title text,
  summary text,
  note text,
  description text,
  status text default 'Tamamlandı',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_update_notes add column if not exists version text;
alter table if exists public.site_update_notes add column if not exists title text;
alter table if exists public.site_update_notes add column if not exists summary text;
alter table if exists public.site_update_notes add column if not exists note text;
alter table if exists public.site_update_notes add column if not exists description text;
alter table if exists public.site_update_notes add column if not exists status text default 'Tamamlandı';
alter table if exists public.site_update_notes add column if not exists created_at timestamptz default now();
alter table if exists public.site_update_notes add column if not exists updated_at timestamptz default now();

delete from public.site_update_notes where version = 'v2.4.9 FIX1';
insert into public.site_update_notes (version, title, summary, note, description, status, created_at, updated_at)
values (
  'v2.4.9 FIX1',
  'Profesyonel Harf, Kapak ve YouTube Görünümü',
  'Seriler/videolar harf paneli yenilendi; Tüm Bilgileri Çek ve Steam Kontrol Et kapakları canlı işler.',
  'YouTube playlist bölümleri daha profesyonel kart görünümüne alındı. Schema versiyon kaydı son sürümü gösterecek şekilde güncellendi.',
  'Seriler ve videolarda Harfe Git alanı profesyonel chip paneline çevrildi. Kapak çekme canlı önizlemeye bağlandı.',
  'Tamamlandı',
  now(),
  now()
);

-- Site runtime config tablo güvenliği; mevcut maintenance_mode değeri overwrite edilmez.
create table if not exists public.site_runtime_config (
  key text primary key,
  value jsonb,
  updated_at timestamptz default now()
);

insert into public.site_runtime_config (key, value, updated_at)
values ('schema_version', jsonb_build_object('version','v2.4.9 FIX1','updated_at',now()), now())
on conflict (key) do update set
  value = excluded.value,
  updated_at = now();




-- v2.4.9 FIX2 - Schema status son versiyon düzeltmesi
create table if not exists public.site_schema_versions (
  id bigserial primary key,
  version text,
  note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_schema_versions add column if not exists version text;
alter table if exists public.site_schema_versions add column if not exists note text;
alter table if exists public.site_schema_versions add column if not exists created_at timestamptz default now();
alter table if exists public.site_schema_versions add column if not exists updated_at timestamptz default now();

delete from public.site_schema_versions where version = 'v2.4.9 FIX2';
insert into public.site_schema_versions (version, note, created_at, updated_at)
values (
  'v2.4.9 FIX2',
  'Supabase schema status sonucu eski v2.4.4 yerine son sürüm v2.4.9 FIX2 gösterecek şekilde güncellendi.',
  now(),
  now()
);

create table if not exists public.site_update_notes (
  id bigserial primary key,
  version text,
  title text,
  summary text,
  note text,
  description text,
  status text default 'Tamamlandı',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_update_notes add column if not exists version text;
alter table if exists public.site_update_notes add column if not exists title text;
alter table if exists public.site_update_notes add column if not exists summary text;
alter table if exists public.site_update_notes add column if not exists note text;
alter table if exists public.site_update_notes add column if not exists description text;
alter table if exists public.site_update_notes add column if not exists status text default 'Tamamlandı';
alter table if exists public.site_update_notes add column if not exists created_at timestamptz default now();
alter table if exists public.site_update_notes add column if not exists updated_at timestamptz default now();

delete from public.site_update_notes where version = 'v2.4.9 FIX2';
insert into public.site_update_notes (version, title, summary, note, description, status, created_at, updated_at)
values (
  'v2.4.9 FIX2',
  'Schema Status Son Versiyon Düzeltmesi',
  'Supabase SQL sonucu/status alanında eski v2.4.4 yazma sorunu düzeltildi.',
  'schema.sql final status mesajı, schema_version kaydı ve sürüm notları v2.4.9 FIX2 olarak güncellendi.',
  'SQL Editor çalıştırıldığında sonuç satırında en son sürüm olan v2.4.9 FIX2 görünür.',
  'Tamamlandı',
  now(),
  now()
);

create table if not exists public.site_runtime_config (
  key text primary key,
  value jsonb,
  updated_at timestamptz default now()
);

insert into public.site_runtime_config (key, value, updated_at)
values (
  'schema_version',
  jsonb_build_object(
    'version','v2.4.9 FIX2',
    'status','Hayatımız Oyun v2.4.9 FIX2 schema hazır. Son sürüm aktif.',
    'updated_at',now()
  ),
  now()
)
on conflict (key) do update set
  value = excluded.value,
  updated_at = now();

select 'Hayatımız Oyun v2.4.9 FIX2 schema hazır. Son sürüm schema status ve güncelleme notları işlendi.' as status;




-- v2.4.9 FIX3 - Canlı önizleme ve profesyonel harf paneli
create table if not exists public.site_schema_versions (
  id bigserial primary key,
  version text,
  note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_schema_versions add column if not exists version text;
alter table if exists public.site_schema_versions add column if not exists note text;
alter table if exists public.site_schema_versions add column if not exists created_at timestamptz default now();
alter table if exists public.site_schema_versions add column if not exists updated_at timestamptz default now();

delete from public.site_schema_versions where version = 'v2.4.9 FIX3';
insert into public.site_schema_versions (version, note, created_at, updated_at)
values (
  'v2.4.9 FIX3',
  'Canlı önizleme kesin güncellendi; seriler/videolar Harfe Git paneli A-B-C-D chipleriyle profesyonelleştirildi.',
  now(),
  now()
);

create table if not exists public.site_update_notes (
  id bigserial primary key,
  version text,
  title text,
  summary text,
  note text,
  description text,
  status text default 'Tamamlandı',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_update_notes add column if not exists version text;
alter table if exists public.site_update_notes add column if not exists title text;
alter table if exists public.site_update_notes add column if not exists summary text;
alter table if exists public.site_update_notes add column if not exists note text;
alter table if exists public.site_update_notes add column if not exists description text;
alter table if exists public.site_update_notes add column if not exists status text default 'Tamamlandı';
alter table if exists public.site_update_notes add column if not exists created_at timestamptz default now();
alter table if exists public.site_update_notes add column if not exists updated_at timestamptz default now();

delete from public.site_update_notes where version = 'v2.4.9 FIX3';
insert into public.site_update_notes (version, title, summary, note, description, status, created_at, updated_at)
values (
  'v2.4.9 FIX3',
  'Canlı Önizleme ve Harf Paneli',
  'Oyun formunda canlı önizleme düzeltildi; seriler ve videolar Harfe Git paneli profesyonelleştirildi.',
  'Kapak URL, başlık, açıklama ve puan değişince önizleme canlı güncellenir. Harf panelinde A-B-C-D chipleri görünür.',
  'Tüm Bilgileri Çek ve Steam Kontrol Et kapakları canlı önizlemeye işler. 1 harf grubu metni kaldırıldı.',
  'Tamamlandı',
  now(),
  now()
);

create table if not exists public.site_runtime_config (
  key text primary key,
  value jsonb,
  updated_at timestamptz default now()
);

insert into public.site_runtime_config (key, value, updated_at)
values (
  'schema_version',
  jsonb_build_object(
    'version','v2.4.9 FIX3',
    'status','Hayatımız Oyun v2.4.9 FIX5 schema hazır. Vercel Node engines uyarısı kaldırıldı.',
    'updated_at',now()
  ),
  now()
)
on conflict (key) do update set
  value = excluded.value,
  updated_at = now();

select 'Hayatımız Oyun v2.4.9 FIX5 schema hazır. Vercel Node engines uyarısı kaldırıldı.' as status;




-- v2.4.9 FIX4 - Node engines uyarısı ve puan koruma sürüm notu
create table if not exists public.site_schema_versions (
  id bigserial primary key,
  version text,
  note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_schema_versions add column if not exists version text;
alter table if exists public.site_schema_versions add column if not exists note text;
alter table if exists public.site_schema_versions add column if not exists created_at timestamptz default now();
alter table if exists public.site_schema_versions add column if not exists updated_at timestamptz default now();

delete from public.site_schema_versions where version = 'v2.4.9 FIX4';
insert into public.site_schema_versions (version, note, created_at, updated_at)
values (
  'v2.4.9 FIX4',
  'Vercel Node engines uyarısı giderildi; kapak seçimi, Steam kontrol ve Tüm Bilgileri Çek işlemlerinde puan sıfırlanması engellendi.',
  now(),
  now()
);

create table if not exists public.site_update_notes (
  id bigserial primary key,
  version text,
  title text,
  summary text,
  note text,
  description text,
  status text default 'Tamamlandı',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_update_notes add column if not exists version text;
alter table if exists public.site_update_notes add column if not exists title text;
alter table if exists public.site_update_notes add column if not exists summary text;
alter table if exists public.site_update_notes add column if not exists note text;
alter table if exists public.site_update_notes add column if not exists description text;
alter table if exists public.site_update_notes add column if not exists status text default 'Tamamlandı';
alter table if exists public.site_update_notes add column if not exists created_at timestamptz default now();
alter table if exists public.site_update_notes add column if not exists updated_at timestamptz default now();

delete from public.site_update_notes where version = 'v2.4.9 FIX4';
insert into public.site_update_notes (version, title, summary, note, description, status, created_at, updated_at)
values (
  'v2.4.9 FIX4',
  'Node Sürüm Sabitleme ve Puan Koruma',
  'Vercel Node engines uyarısı giderildi; kapak/Steam/Tüm Bilgileri Çek işlemlerinde puanın sıfırlanması engellendi.',
  'package.json içinde node sürümü 20.x olarak sabitlendi. Formda puan değeri, kapak değişimi ve Steam kontrol sonrası korunur.',
  'Kapak seçildiğinde veya Steam/Tüm Bilgileri Çek çalıştırıldığında mevcut puan silinmez; kaydet/güncelle sırasında da korunur.',
  'Tamamlandı',
  now(),
  now()
);

create table if not exists public.site_runtime_config (
  key text primary key,
  value jsonb,
  updated_at timestamptz default now()
);

insert into public.site_runtime_config (key, value, updated_at)
values (
  'schema_version',
  jsonb_build_object(
    'version','v2.4.9 FIX4',
    'status','Hayatımız Oyun v2.4.9 FIX5 schema hazır. Vercel Node engines uyarısı kaldırıldı.',
    'updated_at',now()
  ),
  now()
)
on conflict (key) do update set
  value = excluded.value,
  updated_at = now();

select 'Hayatımız Oyun v2.4.9 FIX5 schema hazır. Vercel Node engines uyarısı kaldırıldı.' as status;




-- v2.4.9 FIX5 - Vercel Node engines uyarısı düzeltmesi
create table if not exists public.site_schema_versions (
  id bigserial primary key,
  version text,
  note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_schema_versions add column if not exists version text;
alter table if exists public.site_schema_versions add column if not exists note text;
alter table if exists public.site_schema_versions add column if not exists created_at timestamptz default now();
alter table if exists public.site_schema_versions add column if not exists updated_at timestamptz default now();

delete from public.site_schema_versions where version = 'v2.4.9 FIX5';
insert into public.site_schema_versions (version, note, created_at, updated_at)
values (
  'v2.4.9 FIX5',
  'package.json içindeki engines alanı kaldırıldı; Vercel Project Settings Node 24.x ayarı geçerli olacak.',
  now(),
  now()
);

create table if not exists public.site_update_notes (
  id bigserial primary key,
  version text,
  title text,
  summary text,
  note text,
  description text,
  status text default 'Tamamlandı',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table if exists public.site_update_notes add column if not exists version text;
alter table if exists public.site_update_notes add column if not exists title text;
alter table if exists public.site_update_notes add column if not exists summary text;
alter table if exists public.site_update_notes add column if not exists note text;
alter table if exists public.site_update_notes add column if not exists description text;
alter table if exists public.site_update_notes add column if not exists status text default 'Tamamlandı';
alter table if exists public.site_update_notes add column if not exists created_at timestamptz default now();
alter table if exists public.site_update_notes add column if not exists updated_at timestamptz default now();

delete from public.site_update_notes where version = 'v2.4.9 FIX5';
insert into public.site_update_notes (version, title, summary, note, description, status, created_at, updated_at)
values (
  'v2.4.9 FIX5',
  'Vercel Node Engines Uyarısı Düzeltmesi',
  'package.json içindeki engines alanı kaldırıldı; Vercel Project Settings Node 24.x ayarı kullanılacak.',
  '20.x engines sabitlemesi kaldırıldı. Bu sayede Vercel Project Settings içinde seçili Node 24.x geçerli olur ve engines uyarısı çıkmaz.',
  'FIX4 puan koruma sistemi korunmuştur.',
  'Tamamlandı',
  now(),
  now()
);

create table if not exists public.site_runtime_config (
  key text primary key,
  value jsonb,
  updated_at timestamptz default now()
);

insert into public.site_runtime_config (key, value, updated_at)
values (
  'schema_version',
  jsonb_build_object(
    'version','v2.4.9 FIX5',
    'status','Hayatımız Oyun v2.4.9 FIX5 schema hazır. Vercel Node engines uyarısı kaldırıldı.',
    'updated_at',now()
  ),
  now()
)
on conflict (key) do update set
  value = excluded.value,
  updated_at = now();

select 'Hayatımız Oyun v2.4.9 FIX5 schema hazır. Vercel Node engines uyarısı kaldırıldı.' as status;

