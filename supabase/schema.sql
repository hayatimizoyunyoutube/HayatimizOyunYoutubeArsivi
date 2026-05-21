-- HAYATIMIZ OYUN V1.8.4 SUPABASE SCHEMA
-- Supabase > SQL Editor > New query > Run
-- Eski verileri silmez; eksik tabloları/kolonları ekler.

create extension if not exists pgcrypto;

create table if not exists games (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  series text default 'Tekil Oyun',
  status text default 'Devam Ediyor',
  type text default 'Ana Oyun',
  release_date text,
  upcoming_start text,
  genre text,
  tags text[] default '{}',
  description text,
  cover text,
  playlist_url text,
  youtube_playlist_id text,
  rawg_id text,
  order_no int default 0,
  episodes jsonb default '[]'::jsonb,
  canon boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table games add column if not exists canon boolean default true;
alter table games add column if not exists upcoming_start text;

create table if not exists update_notes (
  id uuid primary key default gen_random_uuid(),
  version text not null,
  type text default 'Özellik',
  title text not null,
  body text,
  public_visible boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table update_notes add column if not exists public_visible boolean default true;
alter table update_notes add column if not exists updated_at timestamptz default now();

create table if not exists calendar_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  game_title text,
  event_date text,
  event_time text,
  description text,
  image text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table calendar_events add column if not exists updated_at timestamptz default now();

create table if not exists site_settings (
  id int primary key default 1,
  maintenance boolean default false,
  maintenance_note text default 'Sitede kısa bir güncelleme yapılıyor.',
  announcement text default '',
  site_title text default 'Hayatımız Oyun',
  site_logo text default '',
  footer_text text default '',
  theme text default 'default',
  updated_at timestamptz default now()
);
alter table site_settings add column if not exists site_title text default 'Hayatımız Oyun';
alter table site_settings add column if not exists site_logo text default '';
alter table site_settings add column if not exists footer_text text default '';
alter table site_settings add column if not exists theme text default 'default';
alter table site_settings add column if not exists maintenance_progress int default 72;
alter table site_settings add column if not exists upcoming_features text default 'YouTube senkronizasyonu güçlendiriliyor
Seri sıralaması iyileştiriliyor
Profil ve bildirim sistemi geliştiriliyor
2.5.0 güncellemesinde site açılacak';
alter table site_settings add column if not exists current_version text default 'V1.8.4';
insert into site_settings (id) values (1) on conflict (id) do nothing;

create table if not exists users_app (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_hash text not null,
  role text default 'user',
  banned boolean default false,
  ban_reason text,
  xp int default 0,
  level int default 1,
  badges text[] default '{}',
  watch_state jsonb default '{}'::jsonb,
  favorites jsonb default '{"games":[],"series":[]}'::jsonb,
  notifications jsonb default '[]'::jsonb,
  profile_photo text default '',
  created_at timestamptz default now()
);
alter table users_app add column if not exists ban_reason text;
alter table users_app add column if not exists favorites jsonb default '{"games":[],"series":[]}'::jsonb;
alter table users_app add column if not exists notifications jsonb default '[]'::jsonb;
alter table users_app add column if not exists profile_photo text default '';

create table if not exists admin_logs (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  detail text,
  admin_name text default 'Admin',
  admin_role text default 'Admin',
  created_at timestamptz default now()
);
alter table admin_logs add column if not exists admin_name text default 'Admin';
alter table admin_logs add column if not exists admin_role text default 'Admin';

create table if not exists friends (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid,
  requester_name text,
  receiver_id uuid,
  receiver_name text,
  status text default 'pending',
  created_at timestamptz default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid,
  sender_name text,
  receiver_id uuid,
  receiver_name text,
  body text not null,
  read_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  username text default 'Kullanıcı',
  game_slug text,
  body text not null,
  spoiler boolean default false,
  likes int default 0,
  created_at timestamptz default now()
);

alter table games enable row level security;
alter table update_notes enable row level security;
alter table calendar_events enable row level security;
alter table site_settings enable row level security;
alter table users_app enable row level security;
alter table admin_logs enable row level security;
alter table friends enable row level security;
alter table messages enable row level security;
alter table comments enable row level security;

do $$ begin
  create policy "Public read games" on games for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Public read notes" on update_notes for select using (public_visible = true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Public read calendar" on calendar_events for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Public read settings" on site_settings for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Public read comments" on comments for select using (true);
exception when duplicate_object then null; end $$;

insert into update_notes (version,type,title,body,public_visible)
values
('V1.7.3','Özellik','Admin paneli normal kullanıcılardan gizlendi','Normal kullanıcılar admin butonunu ve panelini göremez. Yetkili girişi sadece admin rolüyle yapılır.',true),
('V1.7.3','Özellik','Sosyal sistem eklendi','Arkadaş ekleme, sohbet ve oyun yorumları için Supabase tabloları ve arayüz eklendi.',true),
('V1.7.3','Özellik','İzleme sistemi geliştirildi','Burada Kaldım, İzledim, Sonraki Bölüm ve Tüm Seriyi Sırayla İzle butonları eklendi.',true),
('V1.7.3','Özellik','Takvim haftalık/aylık oldu','Takvimde 7 günlük haftalık görünüm, aylık görünüm, resimli kartlar, düzenleme ve silme eklendi.',true),
('V1.7.3','Fix','RAWG Türkçeleştirme geliştirildi','API aramasında yabancı dil sorunu azaltıldı, türler Türkçeleştirildi ve kısa hikaye/açıklama alanı doldurulacak şekilde güncellendi.',true),
('V1.7.3','Sürüm','V1.7.3 yayınlandı','Profesyonel ana sayfa, seri şeritleri, bakım modu animasyonu, güncelleme notları ve admin yönetimi geliştirildi.',true),
('V1.7.3 Fix 1','Fix','RAWG kısa Türkçe hikaye hatası düzeltildi','Çeviri 500 karakter sınırına takılmaması için metin parçalara bölündü. Rusça/İngilizce açıklamalar Türkçeye çevrilmeye çalışılır ve hikaye alanı boş kalmaz.',true),
('V1.7.3 Fix 2','Özellik','YouTube kanalından otomatik oyun ekleme','Admin API Çek bölümüne @HayatimizOyunn kanalındaki oynatma listelerini otomatik oyun olarak siteye ekleme sistemi eklendi.',true),
('V1.7.3 Fix 2','Özellik','Toplu oyun silme eklendi','Admin oyun listesinde birden fazla oyunu seçip tek seferde silme desteği eklendi.',true),
('V1.7.3 Fix 2','Fix','Arkadaş ekleme kullanıcı adıyla çalışıyor','Arkadaş ekleme ve mesaj gönderme artık kullanıcı ID istemez; kullanıcı adıyla çalışır.',true),
('V1.7.3 Fix 2','Güvenlik','Admin paneli kullanıcı rolüyle açılır','Admin şifre formu kaldırıldı. Admin paneline sadece Moderatör, Editör, Admin veya Kurucu rolündeki kullanıcılar girebilir.',true)
on conflict do nothing;


insert into update_notes(version,type,title,body,public_visible)
values ('V1.7.3 Fix 5','Fix','Kategori link ve geri tuşu düzeltmesi','Kategori, seri, oyun ve izleme ekranları URL hash route ile açılır hale getirildi. Tarayıcı geri/ileri tuşu düzeltildi.', true)
on conflict do nothing;

-- V1.7.3 Fix 5: Public güncelleme notlarında admin/yetkili/panel/şifre/log içeriklerini gizle.
update update_notes
set public_visible = false
where lower(coalesce(type,'') || ' ' || coalesce(title,'') || ' ' || coalesce(body,'')) similar to '%(admin|yetkili|yetki|şifre|sifre|rol|log|panel|api çek|api cek|vercel|supabase schema|environment)%';

insert into update_notes(version,type,title,body,public_visible)
values
('V1.7.3 Fix 5','Fix','YouTube kanalından otomatik ekleme düzeltildi','Kanal linki veya @HayatimizOyunn ile oynatma listeleri daha güvenli çekilir. Uzun kanal işlemlerinde JSON okunamadı hatası azaltıldı.', true),
('V1.7.3 Fix 5','Fix','Güncelleme notları sadeleştirildi','Ziyaretçilere sadece siteyi ve kullanıcı deneyimini ilgilendiren yenilikler gösterilir.', true)
on conflict do nothing;


-- V1.7.4 ek alanlar ve kullanıcıya açık notlar
create index if not exists idx_friends_requester_receiver on friends(requester_id, receiver_id);
create index if not exists idx_messages_pair on messages(sender_id, receiver_id, created_at);

insert into update_notes(version,type,title,body,public_visible)
values
('V1.7.4','Özellik','Sosyal sistem yenilendi','Arkadaşlık isteği gönderme, gelen isteği kabul etme, arkadaş listesi ve arkadaşla sohbet sistemi geliştirildi.', true),
('V1.7.4','Özellik','Profil sayfası geliştirildi','Profil fotoğrafı URL ile eklenebilir hale geldi. Favoriler ve izleme bilgileri profil sayfasında daha sade gösterilir.', true),
('V1.7.4','Özellik','İzlemeye Devam Et ve Favoriler güçlendirildi','Kaldığın bölümler ve favori oyun/seriler ana sayfada daha görünür hale getirildi.', true),
('V1.7.4','Özellik','Oyun ve seri detayları geliştirildi','Seri kartları, oyun detayları ve bölüm listesi daha düzenli hale getirildi.', true),
('V1.7.4','Özellik','Takvim görünümü güçlendirildi','Haftalık ve aylık takvim görünümü resimli kartlarla daha okunabilir hale getirildi.', true)
on conflict do nothing;


-- V1.7.4 Fix 1: ziyaretçiye/admin dışına gereksiz teknik ve panel notlarını gizle
update update_notes
set public_visible = false
where lower(coalesce(type,'') || ' ' || coalesce(title,'') || ' ' || coalesce(body,'')) similar to '%(admin|panel|yetkili|yetki|şifre|sifre|rol|log|api çek|api cek|vercel|supabase|environment|schema)%';

insert into update_notes(version,type,title,body,public_visible)
values
('V1.7.4 Fix 1','Özellik','Profil fotoğrafı dosya yükleme ile eklendi','Profil fotoğrafı artık URL yazmadan bilgisayardan görsel seçilerek eklenebilir.', true),
('V1.7.4 Fix 1','Özellik','Kanal otomatik çekme genişletildi','Kanalda bulunan public oynatma listeleri ve bölümler limit girmeden çekilmeye çalışılır.', true),
('V1.7.4 Fix 1','İyileştirme','Güncelleme notları sadeleştirildi','Ziyaretçilere yalnızca site kullanımını ilgilendiren yenilikler gösterilir.', true)
on conflict do nothing;


-- V1.7.5 ekleri
alter table site_settings add column if not exists theme text default 'default';
alter table site_settings add column if not exists maintenance_progress int default 72;
alter table site_settings add column if not exists upcoming_features text default 'YouTube senkronizasyonu güçlendiriliyor
Seri sıralaması iyileştiriliyor
Profil ve bildirim sistemi geliştiriliyor
2.5.0 güncellemesinde site açılacak';
alter table site_settings add column if not exists current_version text default 'V1.8.4';
create index if not exists idx_messages_read_at on messages(receiver_id, read_at);
create index if not exists idx_friends_status on friends(status);

-- Supabase Storage bucket: profil fotoğrafı, site logosu ve görseller için.
insert into storage.buckets (id, name, public)
values ('site-uploads', 'site-uploads', true)
on conflict (id) do update set public = true;

do $$ begin
  create policy "Public read site uploads" on storage.objects for select using (bucket_id = 'site-uploads');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Service role upload site uploads" on storage.objects for insert with check (bucket_id = 'site-uploads');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Service role update site uploads" on storage.objects for update using (bucket_id = 'site-uploads');
exception when duplicate_object then null; end $$;

update update_notes
set public_visible = false
where lower(coalesce(type,'') || ' ' || coalesce(title,'') || ' ' || coalesce(body,'')) similar to '%(admin|panel|yetkili|yetki|şifre|sifre|rol|log|api çek|api cek|vercel|supabase|environment|schema|fix)%';

insert into update_notes(version,type,title,body,public_visible)
values
('V1.7.5','Özellik','Arkadaş ve sohbet sistemi geliştirildi','Arkadaşlık isteğini silme, arkadaşlıktan çıkarma, sohbet bildirimleri ve daha düzenli sosyal ekran eklendi.', true),
('V1.7.5','Özellik','Rozetli ve sesli bildirim menüsü eklendi','Yeni bildirimler üst menüde rozetle görünür. Mesaj ve sosyal bildirimler için sesli uyarı altyapısı eklendi.', true),
('V1.7.5','Özellik','YouTube kanal çekme parça parça çalışır','Kanal import işlemi 504 hatasına takılmasın diye oynatma listelerini tek tek işleyen güvenli sisteme geçirildi.', true),
('V1.7.5','Özellik','Bakım modu yenilendi','Bakım ekranı logo, giriş/çıkış butonları, animasyon ve kullanıcıya açık güncelleme notlarıyla daha profesyonel hale getirildi.', true),
('V1.7.5','Özellik','Takvim bugün bilgisini gösterir','Takvim sayfası bugünün gününü ve varsa bugünkü yayınları öne çıkarır.', true),
('V1.7.5','Özellik','A-Z alanına sayı şeritleri eklendi','Seri/harf ekranında 1-2-3-4 gibi rakamla başlayan oyunlar için sayı şeritleri eklendi.', true),
('V1.7.5','Özellik','Tema sistemi eklendi','Admin ayarlarından varsayılan, kırmızı, mavi, mor, yeşil, neon ve retro tema seçilebilir.', true)
on conflict do nothing;


-- V1.7.5 Fix 2 - kullanıcıya açık güncelleme notu
insert into update_notes (version,type,title,body,public_visible)
values ('V1.7.5 Fix 2','Fix','YouTube otomatik çekme geliştirildi','Kanal oynatma listeleri daha kapsamlı taranır ve oyunlar tek tek siteye eklenir. Serilerde oyunlar çıkış sırasına göre listelenir.', true)
on conflict do nothing;


-- V1.7.5 Fix 3 - kullanıcıya açık güncelleme notu
insert into update_notes (version,type,title,body,public_visible)
values ('V1.7.5 Fix 3','İyileştirme','YouTube kanal taramasına yüzde göstergesi eklendi','Kanal otomatik çekme sırasında toplam oynatma listesi, işlenen liste sayısı ve yüzde ilerleme canlı olarak gösterilir.', true)
on conflict do nothing;


-- V1.7.5 Fix 6 - kullanıcıya açık güncelleme notu
insert into update_notes(version,type,title,body,public_visible)
values ('V1.7.5 Fix 6','Fix','Seri gruplama ve toplu silme geliştirildi','Bazı DLC ve alt başlıklı oyunların farklı seri açması düzeltildi. Admin paneline tüm oyunları tek seferde tamamen silme seçeneği eklendi.', true)
on conflict do nothing;


insert into update_notes(version,type,title,body,public_visible)
values('V1.7.5 Fix 7','Fix','Oyun kapakları ve seri düzenleme iyileştirildi','Kanal importunda oyun kapakları YouTube thumbnail yerine oyun ana görselinden alınacak şekilde geliştirildi. Admin oyun listesi resimli hale getirildi ve seri sıralaması sürükle-bırak ile düzenlenebilir oldu.',true)
on conflict do nothing;

-- V1.7.5 Fix 8 - kullanıcıya açık güncelleme notu
insert into update_notes(version,type,title,body,public_visible)
values('V1.7.5 Fix 8','İyileştirme','Seri içi sıralama ayrı ekrana alındı','Serili oyunlar artık ayrı bir sıralama ekranından sürükle-bırak ile düzenlenebilir. Assassin’s Creed ve A Plague Tale gibi seriler tek tek sıralanabilir.',true)
on conflict do nothing;


-- V1.7.5 Fix 11 - schema sürüm alanı ve kullanıcıya açık güncelleme notları
alter table games add column if not exists upcoming_start text;
alter table site_settings add column if not exists current_version text default 'V1.7.5 Fix 11';
update site_settings set current_version = 'V1.7.5 Fix 11' where id = 1;

insert into update_notes(version,type,title,body,public_visible)
values
('V1.7.5 Fix 9','İyileştirme','Alfabetik seri şeritleri ve admin oyun arama geliştirildi','Ana sayfada seriler alfabetik şeritlerle gösterilir. Admin oyun listesine arama ve seri sıralama kaydetme geliştirildi.', true),
('V1.7.5 Fix 10','İyileştirme','YouTube senkronizasyon ve hikaye yenileme eklendi','Yeni oynatma listesi veya yeni bölüm olup olmadığını kontrol eden senkronizasyon eklendi. Oyun hikayelerini toplu yenileme geliştirildi.', true),
('V1.7.5 Fix 11','İyileştirme','Yakında gelecek içerikler için sayaç eklendi','Yakında gelecek oyun ve serilerde izleme kapatıldı. Detay sayfası açık kalır ve başlangıç tarihi varsa sayaç gösterilir; tarih yoksa Belli değil yazar.', true)
on conflict do nothing;


-- V1.7.5 Fix 12 - Admin panel buton düzeltmesi
insert into update_notes (version,type,title,body,public_visible)
values ('V1.7.5 Fix 12','Fix','Admin panel düzeltmesi','Admin panelindeki sekme ve işlem butonları yeniden düzenlendi.',false)
on conflict do nothing;


-- V1.8.4 - Final Öncesi Hazırlık Paketi
alter table site_settings add column if not exists maintenance_progress integer default 85;
alter table site_settings add column if not exists upcoming_features text default 'YouTube import kuyruğu hazırlanıyor
Admin panel stabilizasyonu tamamlanıyor
RAWG hikaye/kapak düzeltme sistemi güçleniyor
Bildirim, sosyal ve izleme sistemi toparlanıyor
2.5.0 güncellemesinde site final olarak açılacak';
alter table site_settings add column if not exists current_version text default 'V1.8.4';
update site_settings set current_version='V1.8.4' where id=1;

insert into update_notes(version,type,title,body,public_visible)
values
('V1.8.4','Sürüm','Final öncesi hazırlık paketi','V1.8.4 ile site V2.5.0 final açılışına hazırlanır. Admin dashboard kontrol listesi, YouTube kuyruklu senkronizasyon ve bakım ekranı final yol haritası geliştirildi.', true),
('V1.8.4','Özellik','V2.5.0 kontrol listesi eklendi','Admin dashboard üzerinde kapaksız, hikayesiz, bölümsüz ve yakında gelecek içerikleri hızlı kontrol edebileceğiniz final hazırlık kartları eklendi.', true),
('V1.8.4','Özellik','YouTube import kuyruk sistemi güçlendirildi','Kanal importu ve senkronizasyonu oynatma listelerini tek tek işleyen, yüzde ilerleme gösteren ve hata alan playlistleri ayıran yapıya geçirildi.', true),
('V1.8.4','Özellik','Bakım ekranı 2.5.0 final yol haritasına hazırlandı','Bakım modunda ilerleme yüzdesi, yeni gelecek özellikler ve 2.5.0 final açılış mesajı daha net gösterilir.', true),
('V2.5.0','Sürüm','Final açılış güncellemesi','2.5.0 güncellemesinde site final sürüm olarak açılacak. Bu sürüm ana açılış, profesyonel izleme, sosyal ve otomatik içerik sistemlerini tamamlamayı hedefler.', true)
on conflict do nothing;


-- V1.8.4 - Büyük Sistem Toparlama Paketi
alter table site_settings add column if not exists theme text default 'dark';
alter table site_settings add column if not exists maintenance_progress integer default 88;
alter table site_settings add column if not exists upcoming_features text default 'Admin panel V2 düzeni hazırlanıyor
YouTube import kuyruğu ve senkronizasyon güçleniyor
RAWG kapak ve hikaye toplu düzeltme geliyor
Profil, bildirim ve sosyal sistem profesyonelleşiyor
2.5.0 güncellemesinde site final olarak açılacak';
alter table site_settings add column if not exists current_version text default 'V1.8.4';
update site_settings set current_version='V1.8.4', maintenance_progress=greatest(coalesce(maintenance_progress,0),88) where id=1;

insert into update_notes(version,type,title,body,public_visible) values
('V1.8.4','Sürüm','Büyük sistem toparlama paketi','V1.8.4 ile admin panel, YouTube senkronizasyonu, RAWG kapak/hikaye düzeltmeleri ve bakım ekranı V2.5.0 final sürümüne hazır hale getirildi.', true),
('V1.8.4','Özellik','Admin oyun filtreleri geliştirildi','Oyun yönetiminde durum filtresi, kapaksız oyunlar, hikayesi eksik oyunlar ve bölümsüz oyunları hızlı bulma seçenekleri eklendi.', true),
('V1.8.4','Özellik','Toplu kapak yenileme eklendi','RAWG üzerinden tüm oyun kapaklarını toplu yenilemek için yeni toplu işlem butonu eklendi.', true),
('V1.8.4','Özellik','Tema ve bakım hazırlığı güçlendi','Tema seçimi, bakım yüzdesi ve 2.5.0 final yol haritası ayarları daha düzenli hale getirildi.', true)
on conflict do nothing;


-- V1.8.4 - Müzik, loading ve atmosfer sistemi
alter table site_settings add column if not exists music_enabled boolean default true;
alter table site_settings add column if not exists music_volume integer default 28;
alter table site_settings add column if not exists video_duck_music boolean default true;
alter table site_settings add column if not exists current_version text default 'V1.8.4';
update site_settings set current_version='V1.8.4' where id=1;

insert into update_notes(version,type,title,body,public_visible) values
('V1.8.4','Sürüm','Atmosfer ve açılış paketi','Siteye profesyonel açılış ekranı, arka plan müziği, ses kontrol paneli ve kategori geçiş animasyonları eklendi.', true),
('V1.8.4','Özellik','Site müziği eklendi','Site içinde telif riski düşük WebAudio atmosfer müziği otomatik hazırlanır. Kullanıcı ilk etkileşimden sonra sesi açabilir, kapatabilir veya azaltabilir.', true),
('V1.8.4','Özellik','Profesyonel loading ekranı','Site açılışında logo, yüzde ilerleme ve yükleme mesajlarıyla daha profesyonel bir giriş ekranı gösterilir.', true),
('V1.8.4','Özellik','Kategori geçiş animasyonları','Ana sayfa, seriler, takvim, profil ve diğer sayfa geçişleri daha yumuşak animasyonla açılır.', true)
on conflict do nothing;


-- V1.8.4 - Görsel kalite ve paylaşım sistemi
alter table site_settings add column if not exists share_title text default 'Hayatımız Oyun - Oyun ve Seri İzleme Arşivi';
alter table site_settings add column if not exists share_description text default 'Oyun serileri, bölümler, takvim, favoriler ve izleme takibi için Hayatımız Oyun arşivi.';
alter table site_settings add column if not exists share_image text default '/assets/og-cover.png';
alter table site_settings add column if not exists background_intensity integer default 75;
alter table site_settings add column if not exists current_version text default 'V1.8.4';
update site_settings set current_version='V1.8.4' where id=1;

insert into update_notes(version,type,title,body,public_visible) values
('V1.8.4','Sürüm','Görsel kalite ve paylaşım paketi','Site arka planı daha sinematik hale getirildi. Link paylaşımında görsel, başlık ve açıklama çıkması için paylaşım altyapısı eklendi.', true),
('V1.8.4','Özellik','Paylaşım kapağı eklendi','Site linki paylaşıldığında Hayatımız Oyun kapak görseli, başlık ve açıklama görünür. Oyun/seri detaylarında sayfa başlığı ve paylaşım bilgisi güncellenir.', true),
('V1.8.4','Özellik','Profesyonel arka plan sistemi','Ana sayfa ve diğer bölümlere sinematik gradient, glow ve hafif grid atmosferi eklendi. Arka plan yoğunluğu admin ayarlarından değiştirilebilir.', true),
('V1.8.4','Fix','Kapak fallback sistemi geliştirildi','Kapak görseli olmayan veya bozuk olan oyun ve seri kartlarında profesyonel varsayılan görsel gösterilir.', true),
('V1.8.4','Özellik','SEO ve paylaşım ayarları','Admin panel ayarlarına paylaşım başlığı, açıklaması, varsayılan paylaşım görseli ve arka plan yoğunluğu alanları eklendi.', true)
on conflict do nothing;


-- V1.8.4 - Sosyal medya, otomatik ikon ve footer paketi
alter table site_settings add column if not exists social_links text default 'https://www.youtube.com/@HayatimizOyunn';
alter table site_settings add column if not exists show_social_header boolean default true;
alter table site_settings add column if not exists show_social_footer boolean default true;
alter table site_settings add column if not exists favicon text default '/assets/og-cover.png';
alter table site_settings add column if not exists current_version text default 'V1.8.4';
alter table users_app add column if not exists social_links text default '';
update site_settings set current_version='V1.8.4' where id=1;

insert into update_notes(version,type,title,body,public_visible) values
('V1.8.4','Sürüm','Sosyal medya ve ikon paketi','V1.8.4 ile sosyal medya linkleri, otomatik ikon algılama, footer sosyal alanı ve profil sosyal linkleri eklendi.', true),
('V1.8.4','Özellik','Sosyal medya ikonları otomatik algılanır','YouTube, Instagram, TikTok, Discord, Twitch, X/Twitter, Steam, GitHub ve benzeri linkler yazıldığında ikonlar otomatik oluşturulur.', true),
('V1.8.4','Özellik','Sosyal linkler admin panelinden düzenlenebilir','Admin ayarlarında sosyal medya linkleri eklenebilir, düzenlenebilir, header ve footer alanında gösterilip gizlenebilir.', true),
('V1.8.4','Özellik','Profil sosyal linkleri eklendi','Kullanıcı profiline sosyal medya linkleri eklenebilir ve profilde ikonlu şekilde gösterilir.', true),
('V1.8.4','İyileştirme','Favicon ve footer sistemi geliştirildi','Favicon yükleme alanı ve daha profesyonel footer sosyal medya görünümü eklendi.', true)
on conflict do nothing;


-- V1.8.4 - Sosyal, Müzik ve Seri Sıralama Düzeltme Paketi
alter table site_settings add column if not exists current_version text default 'V1.8.4';
update site_settings set current_version='V1.8.4' where id=1;
insert into update_notes(version,type,title,body,public_visible) values
('V1.8.4','Sürüm','Sosyal paylaşım ve düzeltme paketi','V1.8.4 ile sosyal medya sistemi, paylaşım görünümü, müzik deneyimi ve seri sıralama kaydetme davranışı iyileştirildi.', true),
('V1.8.4','Fix','Site müziği sakinleştirildi','Rahatsız edici tonlar kaldırıldı, ses seviyesi düşürüldü ve müzik ilk kullanıcı etkileşiminde daha güvenilir başlayacak şekilde düzenlendi.', true),
('V1.8.4','Fix','Seri sıralaması kaydetme düzeltildi','Seri içindeki oyunları sürükle-taşı ile sıralayıp kaydedince eski haline dönme sorunu düzeltildi.', true)
on conflict do nothing;

-- V1.9.0 - Kick, bağış, yayıncı kartı, sosyal destek ve Discord paketi
alter table site_settings add column if not exists discord_webhook text default '';
alter table site_settings add column if not exists discord_enabled boolean default false;
alter table site_settings add column if not exists show_streamer_card boolean default true;
alter table site_settings add column if not exists current_version text default 'V1.9.0';
create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  name text,
  type text default 'Öneri',
  message text not null,
  status text default 'new',
  created_at timestamptz default now()
);
alter table feedback enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='feedback' and policyname='feedback_insert_public') then
    create policy feedback_insert_public on feedback for insert with check (true);
  end if;
end $$;
update site_settings set
  current_version='V1.9.0',
  social_links=case
    when coalesce(social_links,'') = '' then 'https://www.youtube.com/@HayatimizOyunn
Kick|https://kick.com/hayatimizoyun
Bağış|https://www.bynogame.com/tr/destekle/hayatimizoyun'
    when social_links not ilike '%kick.com/hayatimizoyun%' then social_links || E'\nKick|https://kick.com/hayatimizoyun\nBağış|https://www.bynogame.com/tr/destekle/hayatimizoyun'
    else social_links
  end
where id=1;
insert into update_notes(version,type,title,body,public_visible) values
('V1.9.0','Sürüm','Kick ve bağış destek paketi','Kick yayın bağlantısı, bağış/Bynogame bağlantısı, yayıncı kartı, footer V4 ve sosyal destek alanları eklendi.', true),
('V1.9.0','Özellik','Kick logosu otomatik algılanır','https://kick.com/hayatimizoyun gibi Kick bağlantıları otomatik Kick logosuyla görünür.', true),
('V1.9.0','Özellik','Bağış / Bynogame logosu eklendi','Bağış başlığı veya Bynogame bağlantısı yazıldığında destek/bağış logosu otomatik çıkar.', true),
('V1.9.0','Özellik','Hakkında ve destek sayfası eklendi','Sosyal bağlantılar, Kick, YouTube, Discord ve bağış bağlantıları için yeni destek sayfası eklendi.', true),
('V1.9.0','Özellik','Discord webhook başlangıcı','Admin panelinden Discord webhook test bildirimi gönderme altyapısı eklendi.', true),
('V1.9.0','Özellik','Geri bildirim sistemi eklendi','Kullanıcılar Hakkında/Destek sayfasından hata veya öneri gönderebilir, admin panelde listelenir.', true)
on conflict do nothing;

-- V1.9.0 - Yayıncı platformu, Kick canlı yayın, bağış V2, oyun/seri istekleri ve final sayacı
alter table site_settings add column if not exists kick_live boolean default false;
alter table site_settings add column if not exists publisher_description text default 'Kick yayınları, YouTube arşivi, Discord topluluğu ve bağış bağlantıları burada.';
alter table site_settings add column if not exists final_release_date text default '';
alter table site_settings add column if not exists show_support_card boolean default true;
alter table site_settings add column if not exists current_version text default 'V1.9.0';
alter table feedback add column if not exists status text default 'new';
update site_settings set
  current_version='V1.9.0',
  publisher_description=coalesce(nullif(publisher_description,''),'Kick yayınları, YouTube arşivi, Discord topluluğu ve bağış bağlantıları burada.'),
  upcoming_features=coalesce(nullif(upcoming_features,''),'Kick canlı yayın kartı güçleniyor
Bynogame bağış destek alanı yenileniyor
Oyun ve seri istekleri admin paneline geliyor
Discord bildirimleri gelişiyor
2.5.0 güncellemesinde site final olarak açılacak')
where id=1;

insert into update_notes(version,type,title,body,public_visible) values
('V1.9.0','Sürüm','Yayıncı platformu ve final hazırlık paketi','Kick canlı yayın kartı, bağış destek alanı, oyun/seri istekleri, geri bildirim yönetimi ve V2.5.0 final sayacı eklendi.', true),
('V1.9.0','Özellik','Kick canlı yayın alanı geliştirildi','Kick bağlantısı ana sayfada yayıncı kartında daha belirgin gösterilir. Admin panelinden canlı yayında etiketi açılıp kapatılabilir.', true),
('V1.9.0','Özellik','Bağış ve destek alanı yenilendi','Bynogame/bağış bağlantıları destek butonu olarak görünür, bakım modu ve yayıncı alanında sosyal bağlantılar daha görünür hale getirildi.', true),
('V1.9.0','Özellik','Oyun ve seri isteği eklendi','Kullanıcılar Hakkında/Destek sayfasından oyun isteği, seri isteği, hata ve öneri gönderebilir. Admin panelinde geri bildirimler yönetilebilir.', true),
('V1.9.0','Özellik','V2.5.0 final sayacı eklendi','Admin ayarlarından V2.5.0 hedef tarihi girilebilir. Ana sayfa ve bakım ekranında final hazırlık durumu gösterilir.', true),
('V1.9.0','İyileştirme','Bakım modu sosyal bağlantılarla güçlendi','Bakım ekranında Kick, YouTube, Discord ve bağış bağlantıları gösterilir; kullanıcılar bakımdayken sosyal bağlantılara ulaşabilir.', true)
on conflict do nothing;


-- V1.9.0 - API limit ve admin panel düzeltmesi
alter table site_settings add column if not exists current_version text default 'V1.9.0';
update site_settings set current_version='V1.9.0', updated_at=now() where id=1;
insert into update_notes(version,type,title,body,public_visible) values
('V1.9.0','Fix','API limit ve panel düzeltmesi','Vercel ücretsiz plan sınırına uygun şekilde API yapısı düzenlendi; geri bildirim ve Discord test işlemleri mevcut güvenli endpointlere taşındı.', true)
on conflict do nothing;


-- V1.9.0 - Vercel Hobby API sınırı, bakım/loading ve panel toparlama
alter table site_settings add column if not exists current_version text default 'V1.9.0';
update site_settings set current_version='V1.9.0', updated_at=now() where id=1;
insert into update_notes(version,type,title,body,public_visible) values
('V1.9.0','Fix','Site paneli ve yükleme ekranı düzeltildi','Oyunlar, bakım modu, loading ekranı ve admin panel bölümleri daha sağlam çalışacak şekilde toparlandı.', true),
('V1.9.0','Fix','Vercel ücretsiz plan uyumu düzeltildi','API dosyaları ücretsiz Vercel sınırına uygun hale getirildi ve eski API dosyaları deploy sırasında yok sayılacak şekilde ayarlandı.', false)
on conflict do nothing;


-- V1.9.0 - 12 API stabil geri dönüş ve panel onarım paketi
alter table site_settings add column if not exists current_version text default 'V1.9.0';
update site_settings set current_version='V1.9.0', updated_at=now() where id=1;
insert into update_notes(version,type,title,body,public_visible) values
('V1.9.0','Fix','Panel ve API yolları düzeltildi','Oyunlar, kayıt/kaydetme işlemleri, bakım modu, loading ekranı ve admin panel butonları tekrar stabil hale getirildi.', true),
('V1.9.0','Fix','Vercel ücretsiz plan uyumu korundu','API yapısı Vercel Hobby sınırını aşmayacak şekilde 12 endpointte tutuldu. Eski kalıntı API dosyaları deploy dışı bırakılır.', false)
on conflict do nothing;

-- V1.9.0
update site_settings set current_version = 'V1.9.0' where id = 1;
insert into update_notes(version,type,title,body,public_visible) values ('V1.9.0','Fix','Stabilite düzeltmesi','Oyunlar, bakım modu, loading ve kayıt işlemleri stabil hale getirildi.', true) on conflict do nothing;


-- V1.9.0 - Orta stabilizasyon ve V2.5.0 hazırlık paketi
alter table site_settings add column if not exists current_version text default 'V1.9.0';
alter table site_settings add column if not exists final_release_version text default 'V2.5.0';
update site_settings set
  current_version='V1.9.0',
  final_release_version='V2.5.0',
  maintenance_note=coalesce(nullif(maintenance_note,''),'2.5.0 güncellemesinde site profesyonel açılış sürümü olarak açılacak.'),
  upcoming_features=coalesce(nullif(upcoming_features,''),'Admin panel V3 stabilizasyonu\nYouTube senkronizasyon düzeltmeleri\nRAWG kapak ve hikaye düzeltmeleri\nBakım, loading ve oyun sistemleri toparlanıyor\n2.5.0 güncellemesinde site profesyonel açılış sürümü olarak açılacak'),
  updated_at=now()
where id=1;

insert into update_notes(version,type,title,body,public_visible) values
('V1.9.0','Sürüm','Final öncesi orta güncelleme','V1.9.0 ile API sistemi, admin panel, oyunlar, bakım modu, loading ekranı ve kayıt işlemleri V2.5.0 profesyonel açılışına hazırlanır.', true),
('V1.9.0','İyileştirme','Vercel ücretsiz plan uyumu','API klasörü 12 endpoint sınırına uygun tutulur. Yeni özellikler mevcut API dosyalarının içine eklenir.', false),
('V1.9.0','Özellik','Temiz kurulum sistemi','Yeni ZIP paketleri temiz kurulum mantığıyla kullanılacak şekilde düzenlendi. Eski dosyalar silinip yeni paket temiz eklenecek.', true),
('V2.5.0','Sürüm','Profesyonel açılış hedefi','2.5.0 güncellemesinde site profesyonel açılış sürümü olarak açılacak. 2.0.0 içinde yetişmeyen büyük profesyonel özellikler 2.5.0 yol haritasında önerilecek.', true)
on conflict do nothing;

-- V1.9.1 - Sosyal medya ayrı linkler, site hakkında, sol menü ve istek paketi
alter table site_settings add column if not exists social_youtube text default 'https://www.youtube.com/@HayatimizOyunn';
alter table site_settings add column if not exists social_kick text default 'https://kick.com/hayatimizoyun';
alter table site_settings add column if not exists social_discord text default '';
alter table site_settings add column if not exists social_tiktok text default '';
alter table site_settings add column if not exists social_instagram text default '';
alter table site_settings add column if not exists social_donate text default 'https://www.bynogame.com/tr/destekle/hayatimizoyun';
alter table site_settings add column if not exists about_text text default 'Hayatımız Oyun; oyun serilerini, YouTube bölümlerini, takvimi, favorileri ve izleme takibini tek yerde toplayan Türkçe oyun arşivi platformudur. V2.5.0 açılışına kadar sosyal bağlantılar, oyun istekleri, geri bildirim ve profesyonel izleme sistemi geliştirilmeye devam eder.';
alter table site_settings add column if not exists current_version text default 'V1.9.1';
alter table feedback add column if not exists email text default '';
alter table feedback add column if not exists status text default 'new';
update site_settings set
  current_version='V1.9.1',
  social_youtube=coalesce(nullif(social_youtube,''),'https://www.youtube.com/@HayatimizOyunn'),
  social_kick=coalesce(nullif(social_kick,''),'https://kick.com/hayatimizoyun'),
  social_donate=coalesce(nullif(social_donate,''),'https://www.bynogame.com/tr/destekle/hayatimizoyun'),
  social_links=coalesce(nullif(social_links,''),'YouTube|https://www.youtube.com/@HayatimizOyunn
Kick|https://kick.com/hayatimizoyun
Bağış|https://www.bynogame.com/tr/destekle/hayatimizoyun'),
  about_text=coalesce(nullif(about_text,''),'Hayatımız Oyun; oyun serilerini, YouTube bölümlerini, takvimi, favorileri ve izleme takibini tek yerde toplayan Türkçe oyun arşivi platformudur. V2.5.0 açılışına kadar sosyal bağlantılar, oyun istekleri, geri bildirim ve profesyonel izleme sistemi geliştirilmeye devam eder.'),
  updated_at=now()
where id=1;
insert into update_notes(version,type,title,body,public_visible) values
('V1.9.1','Sürüm','Sosyal medya ve istek sistemi paketi','YouTube, Kick, Discord, TikTok, Instagram ve Bağış/Bynogame linkleri admin panelinde ayrı ayrı düzenlenebilir hale getirildi.', true),
('V1.9.1','Özellik','Bynogame bağış için özel ikon','Bağış bağlantıları özel T logolu destek ikonu ile header, footer ve destek alanlarında gösterilir.', true),
('V1.9.1','Özellik','Site Hakkında bölümü geliştirildi','Site Hakkında sayfası, V2.5.0 yol haritası, sosyal bağlantılar ve destek alanı ile yenilendi.', true),
('V1.9.1','Özellik','Oyun ve seri istek sistemi','Kullanıcılar Hakkında sayfasından oyun isteği, seri isteği, hata bildirimi ve öneri gönderebilir.', true),
('V1.9.1','Özellik','Sol bölüm menüsü eklendi','Ana sayfa, seriler, A-Z, takvim, sosyal, hakkında ve profil için sol hızlı menü eklendi.', true)
on conflict do nothing;


-- V1.9.1 Fix 1 kullanıcıya açık güncelleme notu
insert into update_notes(version,type,title,body,public_visible)
values ('V1.9.1 Fix 1','Fix','Sol menü görünümü düzeltildi','Üst menü ile sol menünün aynı anda ekranı kaplaması düzeltildi. Site artık daha temiz ve kullanışlı görünür.',true)
on conflict do nothing;


-- V1.9.3 - Panel, buton, API, oyun çekme ve seri stabilizasyon paketi
alter table site_settings add column if not exists current_version text default 'V1.9.3';
update site_settings set current_version='V1.9.3', updated_at=now() where id=1;
insert into update_notes(version,type,title,body,public_visible) values
('V1.9.3','Fix','Panel ve buton stabilizasyonu','Admin panelindeki sekme, kaydetme, ayarlar, sosyal medya ve oyun yönetimi işlemleri daha sağlam hale getirildi.', true),
('V1.9.3','Fix','API ve JSON hata kontrolleri güçlendirildi','API yerine HTML dönmesi gibi durumlarda kullanıcıya daha açıklayıcı hata gösterilir; Vercel ücretsiz plan için 12 API düzeni korunur.', true),
('V1.9.3','Fix','Oyun çekme ve seri düzeltme güçlendirildi','YouTube, RAWG, oyun listesi, seri gruplama ve seri sıralama işlemleri final öncesi stabilizasyona alındı.', true)
on conflict do nothing;


-- V1.9.3 - Seri kontrol, kapaklı seri sıralama ve yönetim paketi
alter table site_settings add column if not exists current_version text default 'V1.9.3';
update site_settings set current_version='V1.9.3', updated_at=now() where id=1;
insert into update_notes(version,type,title,body,public_visible) values
('V1.9.3','Özellik','Seriler kontrol sistemi eklendi','Benzer/fazla seri, duplicate oyun, kapaksız oyun, hikayesi eksik oyun ve DLC kontrol uyarıları admin panelinden görülebilir.', true),
('V1.9.3','Özellik','Kapaklı seri sıralama geliştirildi','Seri içindeki oyunlar kapaklı kartlarla gösterilir; sürükle-bırak, A-Z, çıkış tarihi sıralaması ve seri içinden taşıma/silme araçları eklendi.', true),
('V1.9.3','Fix','Admin oyun kartları iyileştirildi','Admin oyun kartlarında kapak, durum, bölüm sayısı, tür, hikaye/kapak uyarıları ve hızlı kapak/hikaye çekme butonları geliştirildi.', true)
on conflict do nothing;


-- V1.9.5 - Temiz kurulum, sosyal medya, API ve seri stabilizasyon paketi
alter table site_settings add column if not exists current_version text default 'V1.9.5';
update site_settings set current_version='V1.9.5', updated_at=now() where id=1;
insert into update_notes(version,type,title,body,public_visible) values
('V1.9.5','Sürüm','Temiz kurulum ve hızlı onarım merkezi','Admin Panel V3 içine temiz kurulum komutları, Vercel 12 API kontrolü, seri sağlığı ve oyun onarım araçları eklendi.', true),
('V1.9.5','Özellik','Oyun standartlaştırma araçları','Seçili oyunları veya tüm oyunları hafif onararak seri adı, durum, tip, slug ve bölüm alanlarını düzenleyen araçlar eklendi.', true),
('V1.9.5','Fix','Sosyal medya ve destek alanı korundu','YouTube, Kick, Discord, TikTok, Instagram ve Bynogame/Bağış linklerinin admin panelinden yönetimi korunup görünür hale getirildi.', true),
('V1.9.5','Fix','API ve Vercel temiz paket düzeni','Eski API dosyalarının kalmaması için paket 12 endpoint düzeninde tutuldu; JSON hata uyarıları ve temiz redeploy notları güçlendirildi.', true)
on conflict do nothing;

-- V1.9.5 Restore Normal: V2/fallback güvenli mod ekranları temizlenmiş geri dönüş.

-- V2.0.0 Alpha 1: V1.9.5 özellikli taban korunur, stabil açılış ve admin açılış kontrolü yapılır.

-- V2.0.0 Alpha 2: Admin Panel V2 Alpha, Sosyal İkon V2 ve Bakım Modu V2 eklendi.

-- V2.0.0 Alpha 2 Fix 1: Loading takılması düzeltildi. Gerçek loader id #siteLoader kapatılır.

-- V2.0.0 Alpha 2 Fix 2: Eksik socialLinksFromSettings() fonksiyonu eklendi. Açılış/render hatası giderildi.

-- V2.0.0 Alpha 3: Kapak/Hikaye Onarım V2 ve Hatalı Oyun Kontrol sistemi eklendi.

-- V2.0.0 Final
-- API tarafında thumbnail gibi schema dışı alanlar games tablosuna gönderilmez.
-- İstersen uyumluluk için şu kolon da eklenebilir; API buna ihtiyaç duymaz:
alter table games add column if not exists thumbnail text;

-- V2.0.1 Fix 1 Stabil: V2.0.0 Final tabanı korunur, güvenli profesyonel görünüm ve not sıralama eklenir.

-- V2.0.1 Fix 2: Admin/seri kapak görünümü, loading %100 kapanışı, bakım modu toggle ve animasyon eklendi.

-- V2.0.1 Fix 2b: Hatalı Oyunları Onar gerçek onarım yapar; Yakında Gelecek kayıtlarında bölüm eksikliği hata sayılmaz.

-- V2.0.1 Fix 2c: Loading %100 kapanışı düzeltildi; başlıkta DLC geçen oyunların tipi onarımda DLC yapılır.

-- V2.0.1 Fix 2e Stabil: Fix 2d açılış takılması giderildi, Tüm Hataları Onar için stabil yüzde/progress/log eklendi.

-- V3.0.0: Profesyonel bakım modu, transparan sosyal ikonlar, temiz loader akışı ve oyun listesi görünüm iyileştirmeleri eklendi.

-- V2.0.3 Fix Social: Site normal açılır; ByNoGame ve TikTok sosyal ikonları görünür hale getirildi.

-- V2.0.3 Current: V3.0.0 duyuruları kaldırıldı, site güncel sürüm V2.0.3 olarak normal açılır.

-- V2.0.3 Fix 1: Oyunlar sekmesine tümünü seç/toplu düzenleme, admin kapak düzeltmesi ve hakkında yönetimi eklendi.

-- V2.1.0: Gelişmiş arşiv, arama, favoriler, izleme takip, duyuru, sağlık kontrolü ve yedekleme merkezi eklendi.

-- V2.1.0 Fix 1: Kategori/nav düzeni, admin oyun kartları, tümünü seç/toplu güncelleme ve güncelleme notları sıralaması düzeltildi.

-- V2.2.0: Tüm kaydet/toplu işlem progress yüzdesi, admin panel ve oyun kartları profesyonel stabilite düzeni eklendi.

-- V3.0.0 Fix 1: A-Z/Seriler arama, V3.0.0 sürüm metni, ByNoGame yuvarlak ikon ve sosyal medya hata kontrol eklendi.

-- V2.2.0 V3 Açılış Sistemi: Site sürümü V2.2.0 bırakıldı, loading/açılış ekranı V3.0.0 açılış mantığıyla otomatik yüzdeye bağlandı.

-- V2.2.0 İzleme Fix: YouTube linklerinden video ID otomatik çıkarma, site içi iframe player ve admin video ID onarım aracı eklendi.

-- V2.5.0 Mega: 40 özelliklik platform güncellemesi, Seri İste, Hata Bildir, Katkı Merkezi, Sağlık Puanı, Profil Dashboard, Mobil Alt Menü ve Admin Final Kontrol Paneli eklendi.

-- V2.5.0 Fix 1: A-Z alfabetik sıralama, Türkçe karakter/numeric sıralama ve Arama/Favoriler/Takip/Arşiv tam oyun adı görünümü düzeltildi.

-- V2.5.1 Fix: Açılış/loading yönetimi, otomatik yüzde, güncelleme notu düzenle/sil/ekle, kart/video/canlı yayın stabilite düzeltmeleri eklendi.

-- V2.5.1 Fix 1 Sade: Gereksiz mega menü/vitrin/dashboard kalabalığı temizlendi; sade ana sayfa, admin, kartlar ve temel özellikler korundu.

-- V2.5.1 Fix 2 Arayüz: Son görseldeki koyu profesyonel arayüze benzer hero, istatistik kartları, oyun kartları ve sade menü güncellendi.
