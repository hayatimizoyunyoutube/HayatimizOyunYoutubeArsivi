-- Hayatımız Oyun v2.1.3 GÜNCELLEME GÜVENLİ KURULUM
-- Bu dosya kullanıcı hesaplarını, siteden eklenen özellikleri, admin notlarını ve oyunları silmez.
-- Güncelleme yaparken ilk tercih bu dosya + schema.sql sırasıdır.

create extension if not exists pgcrypto;

-- Eksik tabloları oluşturur ama var olan veriyi silmez.
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

insert into public.site_runtime_config (key, value, updated_at)
select 'maintenance_mode', '{"enabled":false,"message":"Hayatımız Oyun kısa süreli bakımda."}'::jsonb, now()
where not exists (select 1 from public.site_runtime_config where key = 'maintenance_mode');

notify pgrst, 'reload schema';
select 'v2.1.3 guncelleme guvenli kurulum tamam. Veriler silinmedi.' as status;
