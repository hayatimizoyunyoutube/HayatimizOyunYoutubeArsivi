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
where not exists (select 1 from public.site_update_notes where version = 'v2.0.6' and title = 'UI Safe Fix');

insert into public.site_update_notes (version, title, summary, note, image_url, status)
select 'v2.0.7', 'Otomatik Çekme Altyapısı', 'JSON veri sistemi, otomatik çekme paneli ve fallback yapısı eklendi.', 'Veri gelmezse sitenin bozulmaması için güvenli katman hazırlandı.', 'previews/hayatimiz-oyun-v207-desktop-preview.png', 'published'
where not exists (select 1 from public.site_update_notes where version = 'v2.0.7' and title = 'Otomatik Çekme Altyapısı');

insert into public.site_update_notes (version, title, summary, note, image_url, status)
select 'v2.0.8', 'Smart Archive', 'Akıllı filtre, kalite skoru, otomatik çekme geçmişi ve sağlık özeti eklendi.', 'Arşiv tarafında kontrol ve filtreleme kartları geliştirildi.', 'previews/hayatimiz-oyun-v208-desktop-preview.png', 'published'
where not exists (select 1 from public.site_update_notes where version = 'v2.0.8' and title = 'Smart Archive');

insert into public.site_update_notes (version, title, summary, note, image_url, status)
select 'v2.0.9', 'Control Hub', 'Kontrol merkezi, sezon/bölüm takibi, yayın takvimi ve koleksiyon alanı eklendi.', 'Arşiv yönetimi sezon ve koleksiyon odaklı hale getirildi.', 'previews/hayatimiz-oyun-v209-desktop-preview.png', 'published'
where not exists (select 1 from public.site_update_notes where version = 'v2.0.9' and title = 'Control Hub');

insert into public.site_update_notes (version, title, summary, note, image_url, status)
select 'v2.1.0', 'AI Archive Studio', 'AI öneri paneli, bildirim merkezi, izleme ilerlemesi ve tema presetleri eklendi.', 'Kişiselleştirme ve otomasyon altyapısı genişletildi.', 'previews/hayatimiz-oyun-v210-desktop-preview.png', 'published'
where not exists (select 1 from public.site_update_notes where version = 'v2.1.0' and title = 'AI Archive Studio');

insert into public.site_update_notes (version, title, summary, note, image_url, status)
select 'v2.1.1', 'Test Center', 'Test merkezi, hata raporları, API/ENV paneli ve rollback planı eklendi.', 'Akşam testleri için hata yakalama ve kontrol merkezi oluşturuldu.', 'previews/hayatimiz-oyun-v211-desktop-preview.png', 'published'
where not exists (select 1 from public.site_update_notes where version = 'v2.1.1' and title = 'Test Center');

insert into public.site_update_notes (version, title, summary, note, image_url, status)
select 'v2.1.2', 'Kullanıcı Menüleri + Bakım', 'Teknik menüler kullanıcıdan kaldırıldı ve bakım modu güçlendirildi.', 'Yönetim paneli kullanıcı arayüzünden ayrıldı.', 'previews/hayatimiz-oyun-v212-desktop-preview.png', 'published'
where not exists (select 1 from public.site_update_notes where version = 'v2.1.2' and title = 'Kullanıcı Menüleri + Bakım');

insert into public.site_update_notes (version, title, summary, note, image_url, status)
select 'v2.1.3', 'Stabilizasyon + Koleksiyon Fix', 'Sürüm karışıklığı temizlendi, koleksiyon sistemi genişletildi ve kurulum notları düzenlendi.', 'v2.1.3 ile package, README, schema, update notes ve plan/tamamlanan klasörleri aynı sürüm çizgisine çekildi. Koleksiyonlar durum, tür, etiket, seri ve favoriye göre dinamik hesaplanır.', 'previews/hayatimiz-oyun-v213-stabilizasyon-preview.png', 'published'
where not exists (select 1 from public.site_update_notes where version = 'v2.1.3' and title = 'Stabilizasyon + Koleksiyon Fix');



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
