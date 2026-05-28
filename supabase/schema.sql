-- Hayatımız Oyun v2.5.3 FIX2 - Bakım, Yayın Takvimi, Güncelleme Notları ve v3.0.0 Planları Stabil
-- Güvenli migration: mevcut oyunları, kullanıcıları, kapakları, bakım ayarlarını ve takvim kayıtlarını SİLMEZ.
-- maintenance_mode mevcutsa açık/kapalı, mesaj, yüzde ve tahmini açılış korunur.

create extension if not exists pgcrypto;

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
  image_url text,
  status text default 'published',
  pinned boolean default false,
  planned boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table if exists public.site_update_notes add column if not exists version text;
alter table if exists public.site_update_notes add column if not exists title text;
alter table if exists public.site_update_notes add column if not exists summary text;
alter table if exists public.site_update_notes add column if not exists note text;
alter table if exists public.site_update_notes add column if not exists description text;
alter table if exists public.site_update_notes add column if not exists image_url text;
alter table if exists public.site_update_notes add column if not exists status text default 'published';
alter table if exists public.site_update_notes add column if not exists pinned boolean default false;
alter table if exists public.site_update_notes add column if not exists planned boolean default false;
alter table if exists public.site_update_notes add column if not exists created_at timestamptz default now();
alter table if exists public.site_update_notes add column if not exists updated_at timestamptz default now();

create table if not exists public.site_calendar_events (
  id uuid primary key default gen_random_uuid(),
  title text,
  event_date date,
  event_time text,
  event_type text default 'Yayın',
  game_id text,
  game_title text,
  episode_number integer,
  episode_title text,
  cover_url text,
  note text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table if exists public.site_calendar_events add column if not exists title text;
alter table if exists public.site_calendar_events add column if not exists event_date date;
alter table if exists public.site_calendar_events add column if not exists event_time text;
alter table if exists public.site_calendar_events add column if not exists event_type text default 'Yayın';
alter table if exists public.site_calendar_events add column if not exists game_id text;
alter table if exists public.site_calendar_events add column if not exists game_title text;
alter table if exists public.site_calendar_events add column if not exists episode_number integer;
alter table if exists public.site_calendar_events add column if not exists episode_title text;
alter table if exists public.site_calendar_events add column if not exists cover_url text;
alter table if exists public.site_calendar_events add column if not exists note text;
alter table if exists public.site_calendar_events add column if not exists is_active boolean default true;
alter table if exists public.site_calendar_events add column if not exists created_at timestamptz default now();
alter table if exists public.site_calendar_events add column if not exists updated_at timestamptz default now();

create index if not exists site_calendar_events_date_idx on public.site_calendar_events (event_date asc);

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

delete from public.site_update_notes where version in ('v2.5.3 FIX2','v2.5.4','v2.5.5','v2.5.6','v2.6.0','v2.7.0','v2.8.0','v2.9.0','v3.0.0');

insert into public.site_update_notes (version, title, summary, note, description, status, pinned, planned, created_at, updated_at)
values
('v2.5.3 FIX2','Bakım, Yayın Takvimi ve Güncelleme Notları Stabil','Bakım modu boş kalmayacak, yayın takvimi otomatik dolacak ve güncelleme notları tek stabil panelde çalışacak şekilde düzeltildi.','Eski v2.5.2/v2.5.3 patch katmanları kesildi. Güncelleme Notları sadece yönetim panelinde görünür.','Bakım, takvim ve güncelleme notları tek stabil sistemle çalışır.','published',true,false,now(),now()),
('v2.5.4','Bakım Modu V2 ve Yayın Takvimi Kalıcı Kayıt','Bakım modu, yayın takvimi ve güncelleme notları Supabase tarafında tek kayıt standardına bağlanacak.','Takvim etkinlikleri yönetim panelinden eklenip düzenlenecek; bakım notları sürüm değişimlerinde korunacak.','Planlanan güncelleme.','planned',true,true,now(),now()),
('v2.5.5','Güncelleme Notları V2 ve Sürüm Zaman Çizelgesi','Tamamlanan ve planlanan sürümler ayrı sekmelerde profesyonel zaman çizelgesiyle gösterilecek.','Görselli sürüm notları, kategori filtreleri ve admin detay notu ayrılacak.','Planlanan güncelleme.','planned',true,true,now(),now()),
('v2.5.6','Yayın Takvimi V2 ve Canlı Yayın Planlama','Canlı yayınlar, bölüm yayın tarihleri ve topluluk etkinlikleri takvimde ayrı renklerle listelenecek.','Oyun kartlarından otomatik etkinlik üretme ve haftalık/aylık görünüm güçlendirilecek.','Planlanan güncelleme.','planned',true,true,now(),now()),
('v2.6.0','Kullanıcı Profil ve İzleme Merkezi','Kullanıcılar izleme geçmişi, favoriler, kaldığı bölüm ve kişisel liste sistemini daha net görecek.','Profil istatistikleri ve seri ilerlemesi Supabase ile kalıcı tutulacak.','Planlanan güncelleme.','planned',true,true,now(),now()),
('v2.7.0','Video İzleme Deneyimi ve Bölüm Merkezi','Site içi video izleme ekranı, bölüm geçişleri ve playlist senkronizasyonu daha profesyonel hale getirilecek.','Sonraki bölüm, önceki bölüm, otomatik devam etme ve izleme oranı geliştirilecek.','Planlanan güncelleme.','planned',true,true,now(),now()),
('v2.8.0','Arşiv Veri Güvenliği ve Otomatik Yedekleme','Oyunlar, kapaklar, puanlar, seri sıraları ve bakım ayarları için otomatik yedekleme sistemi güçlendirilecek.','Tek tıkla yedekten geri alma ve bozuk veri onarma araçları genişletilecek.','Planlanan güncelleme.','planned',true,true,now(),now()),
('v2.9.0','Yayın Öncesi Kontrol ve Performans Paketi','Site açılışından önce eksikler, hatalı linkler, boş kapaklar ve bozuk kayıtlar tek ekranda kontrol edilecek.','Vercel build kontrolü, Supabase tablo kontrolü ve yayın öncesi kalite kontrol listesi eklenecek.','Planlanan güncelleme.','planned',true,true,now(),now()),
('v3.0.0','Ana Açılış ve İlk Yayın Sürümü','Hayatımız Oyun arşivi açılışa hazır ana sürüme taşınacak.','Stabil video izleme, seri arşivi, yönetim paneli, bakım modu, bildirimler, takvim ve veri güvenliği tamamlanmış olacak.','Planlanan ana açılış sürümü.','planned',true,true,now(),now());

insert into public.site_calendar_events (title, event_date, event_time, event_type, note, is_active, created_at, updated_at)
select 'v2.5.4 Bakım ve Takvim Kontrol Yayını', current_date + interval '1 day', '20:00', 'Sistem', 'Bakım modu ve yayın takvimi kontrol yayını', true, now(), now()
where not exists (select 1 from public.site_calendar_events where title = 'v2.5.4 Bakım ve Takvim Kontrol Yayını');

insert into public.site_calendar_events (title, event_date, event_time, event_type, note, is_active, created_at, updated_at)
select 'Seri Devam Yayını', current_date + interval '3 day', '21:00', 'Seri Devamı', 'Devam eden seri bölümleri', true, now(), now()
where not exists (select 1 from public.site_calendar_events where title = 'Seri Devam Yayını');

insert into public.site_runtime_config (key, value, updated_at)
values (
  'maintenance_update_notes',
  jsonb_build_object(
    'version','v2.5.3 FIX2',
    'notes',
      jsonb_build_array(
        jsonb_build_object('version','v2.5.3 FIX2','title','Bakım, Yayın Takvimi ve Güncelleme Notları Stabil','summary','Bakım modu boş kalmayacak, yayın takvimi otomatik dolacak ve güncelleme notları tek stabil panelde çalışacak şekilde düzeltildi.','status','Tamamlandı'),
        jsonb_build_object('version','v2.5.3','title','Admin Panel Temizlik ve Veri Kurtarma Merkezi','summary','Yönetim paneline Veri Kurtarma Merkezi, yedek ve bozuk veri kontrolü eklendi.','status','Tamamlandı'),
        jsonb_build_object('version','v2.5.2','title','Bildirim ve Duyuru Merkezi','summary','Duyuru Merkezi ve kullanıcı bildirim sistemi eklendi.','status','Ana Güncelleme')
      ),
    'planned',
      jsonb_build_array(
        jsonb_build_object('version','v2.5.4','title','Bakım Modu V2 ve Yayın Takvimi Kalıcı Kayıt'),
        jsonb_build_object('version','v2.5.5','title','Güncelleme Notları V2 ve Sürüm Zaman Çizelgesi'),
        jsonb_build_object('version','v2.5.6','title','Yayın Takvimi V2 ve Canlı Yayın Planlama'),
        jsonb_build_object('version','v2.6.0','title','Kullanıcı Profil ve İzleme Merkezi'),
        jsonb_build_object('version','v2.7.0','title','Video İzleme Deneyimi ve Bölüm Merkezi'),
        jsonb_build_object('version','v2.8.0','title','Arşiv Veri Güvenliği ve Otomatik Yedekleme'),
        jsonb_build_object('version','v2.9.0','title','Yayın Öncesi Kontrol ve Performans Paketi'),
        jsonb_build_object('version','v3.0.0','title','Ana Açılış ve İlk Yayın Sürümü')
      ),
    'updated_at', now()
  ),
  now()
)
on conflict (key) do update set
  value = excluded.value,
  updated_at = now();

insert into public.site_runtime_config (key, value, updated_at)
values (
  'update_notes_center',
  jsonb_build_object(
    'enabled', true,
    'version','v2.5.3 FIX2',
    'show_on_homepage', false,
    'admin_page_only', true,
    'stable_page', true,
    'planned_until','v3.0.0',
    'updated_at', now()
  ),
  now()
)
on conflict (key) do update set
  value = coalesce(public.site_runtime_config.value, '{}'::jsonb) || excluded.value,
  updated_at = now();

-- maintenance_mode mevcutsa sadece updateNotes alanı yenilenir, diğer değerler korunur.
update public.site_runtime_config
set
  value = jsonb_set(
    coalesce(value, '{}'::jsonb),
    '{updateNotes}',
    coalesce((select value->'notes' from public.site_runtime_config where key = 'maintenance_update_notes'), '[]'::jsonb),
    true
  ),
  updated_at = now()
where key = 'maintenance_mode';

insert into public.site_runtime_config (key, value, updated_at)
select
  'maintenance_mode',
  jsonb_build_object(
    'enabled', false,
    'message', 'Hayatımız Oyun kısa süreli bakımda. Yeni güncellemeler hazırlanıyor.',
    'eta', '',
    'percent', 0,
    'progress', 0,
    'notesText', '',
    'updateNotes', coalesce((select value->'notes' from public.site_runtime_config where key = 'maintenance_update_notes'), '[]'::jsonb),
    'version', 'v2.5.3 FIX2'
  ),
  now()
where not exists (select 1 from public.site_runtime_config where key = 'maintenance_mode');

delete from public.site_schema_versions where version = 'v2.5.3 FIX2';
insert into public.site_schema_versions (version, note, created_at, updated_at)
values (
  'v2.5.3 FIX2',
  'Bakım, yayın takvimi, güncelleme notları ve v3.0.0 planları stabil hale getirildi.',
  now(),
  now()
);

insert into public.site_runtime_config (key, value, updated_at)
values (
  'schema_version',
  jsonb_build_object(
    'version','v2.5.3 FIX2',
    'status','Hayatımız Oyun v2.5.3 FIX2 schema hazır. Bakım, yayın takvimi, güncelleme notları ve v3.0.0 planları stabil hale getirildi.',
    'updated_at',now()
  ),
  now()
)
on conflict (key) do update set
  value = excluded.value,
  updated_at = now();

select 'Hayatımız Oyun v2.5.3 FIX2 schema hazır. Bakım, yayın takvimi, güncelleme notları ve v3.0.0 planları stabil hale getirildi.' as status;
