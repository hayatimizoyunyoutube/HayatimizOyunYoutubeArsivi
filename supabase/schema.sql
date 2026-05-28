-- Hayatımız Oyun v2.5.3 FIX1 - Bakım Modu ve Güncelleme Notları Stabil
-- Güvenli migration: mevcut oyun, kullanıcı, kapak ve bakım ayarlarını SİLMEZ.
-- maintenance_mode mevcutsa açık/kapalı, mesaj, yüzde ve tahmini açılış korunur.
-- update_notes_center gibi farklı ayarlar maintenance_mode değerini artık ezmez.

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
alter table if exists public.site_update_notes add column if not exists created_at timestamptz default now();
alter table if exists public.site_update_notes add column if not exists updated_at timestamptz default now();

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

delete from public.site_update_notes where version = 'v2.5.3 FIX1';
insert into public.site_update_notes (version, title, summary, note, description, status, pinned, created_at, updated_at)
values (
  'v2.5.3 FIX1',
  'Bakım Modu ve Güncelleme Notları Stabil',
  'Güncelleme Notları tek stabil yönetim sayfasına alındı; Bakım Modu Supabase ayarları başka paneller tarafından ezilmeyecek şekilde düzeltildi.',
  'settings-set API düzeltildi. update_notes_center gibi ayarlar artık maintenance_mode değerini bozmaz.',
  'Bakım modu açık/kapalı, mesaj, yüzde, tahmini açılış ve bakım notları korunur. Güncelleme Notları sadece Yönetim Paneli > Güncelleme Notları içinde görünür.',
  'published',
  true,
  now(),
  now()
);

insert into public.site_runtime_config (key, value, updated_at)
values (
  'update_notes_center',
  jsonb_build_object(
    'enabled', true,
    'version','v2.5.3 FIX1',
    'show_on_homepage', false,
    'admin_page_only', true,
    'stable_page', true,
    'prevent_panel_mix', true,
    'updated_at', now()
  ),
  now()
)
on conflict (key) do update set
  value = coalesce(public.site_runtime_config.value, '{}'::jsonb) || excluded.value,
  updated_at = now();

insert into public.site_runtime_config (key, value, updated_at)
values (
  'maintenance_update_notes',
  jsonb_build_object(
    'version','v2.5.3 FIX1',
    'notes',
      jsonb_build_array(
        jsonb_build_object('version','v2.5.3 FIX1','title','Bakım Modu ve Güncelleme Notları Stabil','summary','Güncelleme Notları tek stabil yönetim sayfasına alındı; Bakım Modu Supabase ayarları başka paneller tarafından ezilmeyecek şekilde düzeltildi.','status','Tamamlandı'),
        jsonb_build_object('version','v2.5.3','title','Admin Panel Temizlik ve Veri Kurtarma Merkezi','summary','Veri Kurtarma Merkezi, yerel/Supabase yedek, bozuk veri tarama, geri alma ve eski panel/local temizlik araçları eklendi.','status','Tamamlandı'),
        jsonb_build_object('version','v2.5.2','title','Bildirim ve Duyuru Merkezi','summary','Yönetim paneline Duyuru Merkezi ve kullanıcı bildirim sistemi eklendi.','status','Ana Güncelleme')
      ),
    'updated_at', now()
  ),
  now()
)
on conflict (key) do update set
  value = excluded.value,
  updated_at = now();

-- maintenance_mode mevcutsa SADECE updateNotes alanını yenile; diğer değerleri asla sıfırlama.
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

-- maintenance_mode hiç yoksa varsayılanı yalnızca bir kez oluştur.
insert into public.site_runtime_config (key, value, updated_at)
select
  'maintenance_mode',
  jsonb_build_object(
    'enabled', false,
    'message', 'Hayatımız Oyun kısa süreli bakımda. Yeni güncelleme hazırlanıyor.',
    'eta', '',
    'percent', 0,
    'progress', 0,
    'notesText', '',
    'updateNotes', coalesce((select value->'notes' from public.site_runtime_config where key = 'maintenance_update_notes'), '[]'::jsonb),
    'version', 'v2.5.3 FIX1'
  ),
  now()
where not exists (select 1 from public.site_runtime_config where key = 'maintenance_mode');

delete from public.site_schema_versions where version = 'v2.5.3 FIX1';
insert into public.site_schema_versions (version, note, created_at, updated_at)
values (
  'v2.5.3 FIX1',
  'Bakım Modu ve Güncelleme Notları stabil hale getirildi. settings-set artık maintenance_mode değerini yanlışlıkla ezmez.',
  now(),
  now()
);

insert into public.site_runtime_config (key, value, updated_at)
values (
  'schema_version',
  jsonb_build_object(
    'version','v2.5.3 FIX1',
    'status','Hayatımız Oyun v2.5.3 FIX1 schema hazır. Bakım Modu ve Güncelleme Notları stabil hale getirildi.',
    'updated_at',now()
  ),
  now()
)
on conflict (key) do update set
  value = excluded.value,
  updated_at = now();

select 'Hayatımız Oyun v2.5.3 FIX1 schema hazır. Bakım Modu ve Güncelleme Notları stabil hale getirildi.' as status;
