-- v4.0.0 Ana Açılış Sürümü
-- Güvenlidir: mevcut oyun, kullanıcı, takvim, bölüm ve bakım verilerini silmez.

create table if not exists public.site_runtime_config (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

create table if not exists public.admin_activity_logs (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  detail text,
  actor_email text,
  created_at timestamptz default now()
);

insert into public.site_runtime_config (key, value, updated_at)
values (
  'site_version',
  jsonb_build_object(
    'version','v4.0.0',
    'label','Ana Açılış Sürümü',
    'status','published',
    'maintenance_mode', false,
    'updated_by','mertdundaroyunda@gmail.com'
  ),
  now()
)
on conflict (key) do update
set value = public.site_runtime_config.value || excluded.value,
    updated_at = now();

insert into public.site_runtime_config (key, value, updated_at)
values (
  'maintenance_mode',
  jsonb_build_object(
    'enabled', false,
    'percent', 100,
    'message','Hayatımız Oyun v4.0.0 ana açılış sürümü yayında.',
    'eta','Site açık',
    'adminBypass', true,
    'version','v4.0.0'
  ),
  now()
)
on conflict (key) do update
set value = public.site_runtime_config.value || jsonb_build_object(
    'enabled', false,
    'percent', 100,
    'message','Hayatımız Oyun v4.0.0 ana açılış sürümü yayında.',
    'eta','Site açık',
    'adminBypass', true,
    'version','v4.0.0'
  ),
  updated_at = now();

insert into public.admin_activity_logs (action, detail, actor_email)
values (
  'version_update',
  'v4.0.0 Ana Açılış Sürümü schema çalıştırıldı. Bakım modu kapalı, site yayına hazır. Veri silinmedi.',
  'mertdundaroyunda@gmail.com'
);
