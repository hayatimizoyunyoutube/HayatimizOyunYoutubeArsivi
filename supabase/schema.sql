-- Hayatımız Oyun v2.5.6 - Temiz Çalışan Admin Panel
-- Ultra güvenli: mevcut oyun, kullanıcı ve bakım kayıtlarını silmez.
set statement_timeout = '20s';
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
  status text default 'published',
  pinned boolean default false,
  planned boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

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
  video_url text,
  note text,
  source text default 'manual',
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table if exists public.site_calendar_events add column if not exists video_url text;
alter table if exists public.site_calendar_events add column if not exists source text default 'manual';
create index if not exists site_calendar_events_date_idx on public.site_calendar_events (event_date asc);

insert into public.site_update_notes (version,title,summary,note,description,status,pinned,planned,created_at,updated_at)
select 'v2.5.6','Temiz Çalışan Admin Panel','Boş sayfa sorunları için frontend sade ve stabil olarak yeniden kuruldu.','Oyun Ekle, Yayın Takvimi, Güncelleme Notları ve Bakım Modu tek çalışan yapıda toplandı.','Eski bozan admin patchleri kullanılmadan temiz çalışan sürüm hazırlandı.','published',true,false,now(),now()
where not exists (select 1 from public.site_update_notes where version='v2.5.6');

insert into public.site_runtime_config (key,value,updated_at)
values ('schema_version', jsonb_build_object('version','v2.5.6','status','Hayatımız Oyun v2.5.6 temiz çalışan admin panel schema hazır.','updated_at',now()), now())
on conflict (key) do update set value=excluded.value, updated_at=now();

select 'Hayatımız Oyun v2.5.6 temiz çalışan admin panel schema hazır.' as status;
