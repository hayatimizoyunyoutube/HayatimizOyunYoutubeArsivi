-- Hayatımız Oyun v2.1.6 FIX 3 - Hikaye ve Playlist Düzeltmesi
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

select 'Hayatimiz Oyun v2.1.8 schema hazir. Yayin takvimi, medya yonetimi, burada kaldim ve sinema modu aktif.' as status;
