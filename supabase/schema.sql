-- Hayatımız Oyun v2.5.4 - Bakım Modu V2 ve Yayın Takvimi Kalıcı Kayıt
-- Güvenli / hızlı schema: mevcut oyun, kapak, kullanıcı, bakım ve takvim verilerini silmez.
set statement_timeout = '25s';
set lock_timeout = '3s';

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
  event_type text default 'Ana Yayın',
  game_id text,
  game_title text,
  episode_number integer,
  episode_title text,
  cover_url text,
  video_url text,
  note text,
  source text default 'manual',
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table if exists public.site_calendar_events add column if not exists title text;
alter table if exists public.site_calendar_events add column if not exists event_date date;
alter table if exists public.site_calendar_events add column if not exists event_time text;
alter table if exists public.site_calendar_events add column if not exists event_type text default 'Ana Yayın';
alter table if exists public.site_calendar_events add column if not exists game_id text;
alter table if exists public.site_calendar_events add column if not exists game_title text;
alter table if exists public.site_calendar_events add column if not exists episode_number integer;
alter table if exists public.site_calendar_events add column if not exists episode_title text;
alter table if exists public.site_calendar_events add column if not exists cover_url text;
alter table if exists public.site_calendar_events add column if not exists video_url text;
alter table if exists public.site_calendar_events add column if not exists note text;
alter table if exists public.site_calendar_events add column if not exists source text default 'manual';
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

insert into public.site_update_notes (version, title, summary, note, description, status, pinned, planned, created_at, updated_at)
select 'v2.5.4', 'Bakım Modu V2 ve Yayın Takvimi Kalıcı Kayıt', 'Bakım modu, yayın takvimi ve güncelleme notları Supabase tarafında tek kayıt standardına bağlandı.', 'Takvim etkinlikleri yönetim panelinden eklenip düzenlenir. Bakım notları ve yüzde bilgisi sürüm güncellemelerinde korunur. Boş takvimde oyunlardan öneri üretilir ama otomatik kayıt yapılmaz.', 'runtime-v2 standardı eklendi.', 'published', true, false, now(), now()
where not exists (select 1 from public.site_update_notes where version='v2.5.4');

insert into public.site_runtime_config (key, value, updated_at)
values
('calendar_events_standard', jsonb_build_object('version','v2.5.4','mode','manual','auto_create',false,'suggestion_only',true,'updated_at',now()), now()),
('update_notes_center', jsonb_build_object('version','v2.5.4','admin_page_only',true,'show_on_homepage',false,'runtime_standard','runtime-v2','updated_at',now()), now()),
('maintenance_update_notes', jsonb_build_object('version','v2.5.4','notes',jsonb_build_array(jsonb_build_object('version','v2.5.4','title','Bakım Modu V2 ve Yayın Takvimi Kalıcı Kayıt','summary','Bakım modu, yayın takvimi ve güncelleme notları Supabase tarafında tek kayıt standardına bağlandı.','status','Tamamlandı')),'updated_at',now()), now())
on conflict (key) do update set value = coalesce(public.site_runtime_config.value,'{}'::jsonb) || excluded.value, updated_at = now();

-- Bakım modu varsa mevcut açık/kapalı, mesaj, yüzde ve tarih korunur; sadece boşsa standart alanlar eklenir.
insert into public.site_runtime_config (key, value, updated_at)
select 'maintenance_mode', jsonb_build_object('enabled',false,'message','Hayatımız Oyun kısa süreli bakımda. Yeni güncellemeler hazırlanıyor.','eta','','percent',0,'progress',0,'notesText','v2.5.4 • Bakım Modu V2 ve Yayın Takvimi Kalıcı Kayıt: Bakım modu ve takvim runtime-v2 standardına bağlandı.','updateNotes',coalesce((select value->'notes' from public.site_runtime_config where key='maintenance_update_notes'),'[]'::jsonb),'version','v2.5.4','schema','runtime-v2'), now()
where not exists (select 1 from public.site_runtime_config where key='maintenance_mode');

update public.site_runtime_config
set value = coalesce(value,'{}'::jsonb) || jsonb_build_object('version','v2.5.4','schema','runtime-v2'), updated_at = now()
where key='maintenance_mode';

insert into public.site_schema_versions (version, note, created_at, updated_at)
values ('v2.5.4', 'Bakım Modu V2 ve Yayın Takvimi Kalıcı Kayıt eklendi.', now(), now());

insert into public.site_runtime_config (key, value, updated_at)
values ('schema_version', jsonb_build_object('version','v2.5.4','status','Hayatımız Oyun v2.5.4 schema hazır. Bakım Modu V2 ve Yayın Takvimi Kalıcı Kayıt eklendi.','updated_at',now()), now())
on conflict (key) do update set value = excluded.value, updated_at = now();

select 'Hayatımız Oyun v2.5.4 schema hazır. Bakım Modu V2 ve Yayın Takvimi Kalıcı Kayıt eklendi.' as status;
