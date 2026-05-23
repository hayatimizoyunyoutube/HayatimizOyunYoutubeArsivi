-- Hayatımız Oyun v2.1.3 Fix 14
-- Mevcut eski tabloları silmeden constraint / duplicate temizliği yapar.
-- Tam sıfırlama yapmayacaksan EN BAŞTA bunu çalıştır, sonra schema.sql çalıştır.

create extension if not exists pgcrypto;

create table if not exists public.site_update_notes (
  id uuid primary key default gen_random_uuid(),
  version text,
  title text,
  note text,
  created_at timestamptz default now()
);

create table if not exists public.site_admin_planner (
  id uuid primary key default gen_random_uuid(),
  group_name text,
  title text,
  status text default 'plan',
  created_at timestamptz default now()
);

create table if not exists public.site_runtime_config (
  id uuid default gen_random_uuid(),
  key text,
  value jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

with ranked_update_notes as (
  select ctid, row_number() over (partition by version, title order by created_at desc nulls last, ctid desc) rn
  from public.site_update_notes where version is not null and title is not null
)
delete from public.site_update_notes t using ranked_update_notes r where t.ctid = r.ctid and r.rn > 1;

with ranked_admin_planner as (
  select ctid, row_number() over (partition by group_name, title order by created_at desc nulls last, ctid desc) rn
  from public.site_admin_planner where group_name is not null and title is not null
)
delete from public.site_admin_planner t using ranked_admin_planner r where t.ctid = r.ctid and r.rn > 1;

delete from public.site_runtime_config where key is null;
with ranked_runtime as (
  select ctid, row_number() over (partition by key order by updated_at desc nulls last, ctid desc) rn
  from public.site_runtime_config where key is not null
)
delete from public.site_runtime_config t using ranked_runtime r where t.ctid = r.ctid and r.rn > 1;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'site_update_notes_version_title_unique') then
    drop index if exists public.site_update_notes_version_title_unique_idx;
    alter table public.site_update_notes add constraint site_update_notes_version_title_unique unique (version, title);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'site_admin_planner_group_title_unique') then
    drop index if exists public.site_admin_planner_group_title_unique_idx;
    alter table public.site_admin_planner add constraint site_admin_planner_group_title_unique unique (group_name, title);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'site_runtime_config_key_unique') then
    drop index if exists public.site_runtime_config_key_unique;
    alter table public.site_runtime_config add constraint site_runtime_config_key_unique unique (key);
  end if;
end $$;

notify pgrst, 'reload schema';

select 'Fix 14 constraint cleanup tamam. Şimdi supabase/schema.sql çalıştır.' as status;
