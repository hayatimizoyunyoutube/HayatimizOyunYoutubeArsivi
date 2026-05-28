-- Hayatımız Oyun v2.5.2 FIX13 - Güvenli Supabase schema/migration
-- Mevcut verileri SİLMEZ.
-- Bakım modu açık/kapalı, mesaj, yüzde ve tahmini açılış değerlerini SIFIRLAMAZ.
-- Kayıt sistemi için site_users tablosunu oluşturur/güçlendirir.
-- Seri sıralaması için games.series_order alanını güvenceye alır.

create extension if not exists pgcrypto;

create table if not exists public.site_runtime_config (
  key text primary key,
  value jsonb,
  updated_at timestamptz default now()
);

create table if not exists public.site_users (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  avatar_url text,
  email text not null,
  password_hash text,
  password_salt text,
  role text default 'user',
  is_active boolean default true,
  banned_at timestamptz,
  ban_reason text,
  last_login_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table if exists public.site_users add column if not exists full_name text;
alter table if exists public.site_users add column if not exists avatar_url text;
alter table if exists public.site_users add column if not exists email text;
alter table if exists public.site_users add column if not exists password_hash text;
alter table if exists public.site_users add column if not exists password_salt text;
alter table if exists public.site_users add column if not exists role text default 'user';
alter table if exists public.site_users add column if not exists is_active boolean default true;
alter table if exists public.site_users add column if not exists banned_at timestamptz;
alter table if exists public.site_users add column if not exists ban_reason text;
alter table if exists public.site_users add column if not exists last_login_at timestamptz;
alter table if exists public.site_users add column if not exists created_at timestamptz default now();
alter table if exists public.site_users add column if not exists updated_at timestamptz default now();

create unique index if not exists site_users_email_lower_unique on public.site_users (lower(email));

create table if not exists public.site_update_notes (
  id bigserial primary key,
  version text,
  title text,
  summary text,
  note text,
  description text,
  status text default 'Tamamlandı',
  pinned boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table if exists public.site_update_notes add column if not exists version text;
alter table if exists public.site_update_notes add column if not exists title text;
alter table if exists public.site_update_notes add column if not exists summary text;
alter table if exists public.site_update_notes add column if not exists note text;
alter table if exists public.site_update_notes add column if not exists description text;
alter table if exists public.site_update_notes add column if not exists status text default 'Tamamlandı';
alter table if exists public.site_update_notes add column if not exists pinned boolean default false;
alter table if exists public.site_update_notes add column if not exists created_at timestamptz default now();
alter table if exists public.site_update_notes add column if not exists updated_at timestamptz default now();

create table if not exists public.site_notifications (
  id uuid primary key default gen_random_uuid(),
  type text default 'system',
  title text,
  message text,
  status text default 'published',
  pinned boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table if exists public.site_notifications add column if not exists type text default 'system';
alter table if exists public.site_notifications add column if not exists title text;
alter table if exists public.site_notifications add column if not exists message text;
alter table if exists public.site_notifications add column if not exists status text default 'published';
alter table if exists public.site_notifications add column if not exists pinned boolean default false;
alter table if exists public.site_notifications add column if not exists created_at timestamptz default now();
alter table if exists public.site_notifications add column if not exists updated_at timestamptz default now();

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

alter table if exists public.games add column if not exists score numeric;
alter table if exists public.games add column if not exists score_source text default 'auto';
alter table if exists public.games add column if not exists manual_score numeric;
alter table if exists public.games add column if not exists series_order integer;
alter table if exists public.games add column if not exists series_name text;
alter table if exists public.games add column if not exists playlist_url text;
alter table if exists public.games add column if not exists updated_at timestamptz default now();

delete from public.site_update_notes where version in ('v2.5.2','v2.5.2 FIX13');
insert into public.site_update_notes (version, title, summary, note, description, status, pinned, created_at, updated_at)
values
(
  'v2.5.2',
  'Bildirim ve Duyuru Merkezi',
  'Yönetim paneline Duyuru Merkezi, kullanıcı tarafına bildirim zili, okundu/okunmadı sistemi ve bakım/yayın/seri/bölüm duyuru tipleri eklendi.',
  'Bu ana güncelleme Güncelleme Notları panelinde en üstte gösterilir.',
  'Duyuru Merkezi; sistem, bakım, yayın, yeni seri ve yeni bölüm duyurularını tek yerden yönetir.',
  'Ana Güncelleme',
  true,
  now(),
  now()
),
(
  'v2.5.2 FIX13',
  'Seri Sıralama, Kullanıcı Kaydı ve Temiz Panel Final',
  'Seri sırası kullanıcı tarafına doğru yansıtıldı, kayıt sistemi site_users tablosuna bağlandı ve eski karışan panel katmanları temizlendi.',
  'Seri sırasını kaydet butonu games.series_order alanını günceller. Yeni kullanıcılar site_users tablosuna kaydedilir.',
  'Ana sayfada güncelleme notları barı görünmez. Duyuru Merkezi ve Güncelleme Notları sadece yönetim panelinde modal olarak açılır.',
  'Tamamlandı',
  true,
  now(),
  now()
);

insert into public.site_notifications (id, type, title, message, status, pinned, created_at, updated_at)
values (
  '00000000-0000-4000-8000-000000002513'::uuid,
  'system',
  'v2.5.2 FIX13 yayında',
  'Seri sıralama, kullanıcı kaydı ve temiz panel sistemi güncellendi.',
  'published',
  true,
  now(),
  now()
)
on conflict (id) do update set
  type = excluded.type,
  title = excluded.title,
  message = excluded.message,
  status = excluded.status,
  pinned = excluded.pinned,
  updated_at = now();

insert into public.site_runtime_config (key, value, updated_at)
values (
  'update_notes_center',
  jsonb_build_object(
    'enabled', true,
    'version','v2.5.2 FIX13',
    'main_update_visible', true,
    'show_on_homepage', false,
    'admin_button_only', true,
    'clean_notes_only', true,
    'hide_cover_gallery_tools', true,
    'updated_at', now()
  ),
  now()
)
on conflict (key) do update set
  value = coalesce(public.site_runtime_config.value, '{}'::jsonb) || excluded.value,
  updated_at = now();

insert into public.site_runtime_config (key, value, updated_at)
values (
  'notifications_center',
  jsonb_build_object(
    'enabled', true,
    'version','v2.5.2 FIX13',
    'admin_panel_visible', true,
    'main_announcement_visible', true,
    'single_bell', true,
    'types', jsonb_build_array('system','maintenance','release','series','episode'),
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
    'version','v2.5.2 FIX13',
    'notes',
      jsonb_build_array(
        jsonb_build_object('version','v2.5.2','title','Bildirim ve Duyuru Merkezi','summary','Yönetim paneline Duyuru Merkezi, kullanıcı tarafına bildirim zili, okundu/okunmadı sistemi ve bakım/yayın/seri/bölüm duyuru tipleri eklendi.','status','Ana Güncelleme'),
        jsonb_build_object('version','v2.5.2 FIX13','title','Seri Sıralama, Kullanıcı Kaydı ve Temiz Panel Final','summary','Seri sırası kullanıcı tarafına doğru yansıtıldı, kayıt sistemi site_users tablosuna bağlandı ve eski karışan panel katmanları temizlendi.','status','Tamamlandı'),
        jsonb_build_object('version','v2.5.2 FIX12','title','Final Temiz Panel, Seri Sıralama ve Kalıcı Bakım','summary','Duyuru Merkezi ve Güncelleme Notları yönetim panelinde modal olarak ayrıldı.','status','Tamamlandı')
      ),
    'updated_at', now()
  ),
  now()
)
on conflict (key) do update set
  value = excluded.value,
  updated_at = now();

-- Bakım modu mevcutsa sadece updateNotes alanı güncellenir.
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

-- maintenance_mode hiç yoksa varsayılanı yalnızca bir kere oluştur.
insert into public.site_runtime_config (key, value, updated_at)
select
  'maintenance_mode',
  jsonb_build_object(
    'enabled', false,
    'message', 'Hayatımız Oyun kısa süreli bakımda.',
    'progress', 0,
    'percent', 0,
    'eta', '',
    'notes', jsonb_build_array(),
    'updateNotes', coalesce((select value->'notes' from public.site_runtime_config where key = 'maintenance_update_notes'), '[]'::jsonb),
    'version', 'v2.5.2 FIX13'
  ),
  now()
where not exists (select 1 from public.site_runtime_config where key = 'maintenance_mode');

delete from public.site_schema_versions where version = 'v2.5.2 FIX13';
insert into public.site_schema_versions (version, note, created_at, updated_at)
values (
  'v2.5.2 FIX13',
  'Seri sıralama, kullanıcı kaydı ve temiz panel final düzeltmesi eklendi.',
  now(),
  now()
);

insert into public.site_runtime_config (key, value, updated_at)
values (
  'schema_version',
  jsonb_build_object(
    'version','v2.5.2 FIX13',
    'status','Hayatımız Oyun v2.5.2 FIX13 schema hazır. Seri sıralama, kullanıcı kaydı ve temiz panel düzeltildi.',
    'updated_at',now()
  ),
  now()
)
on conflict (key) do update set
  value = excluded.value,
  updated_at = now();

select 'Hayatımız Oyun v2.5.2 FIX13 schema hazır. Seri sıralama, kullanıcı kaydı ve temiz panel düzeltildi.' as status;
