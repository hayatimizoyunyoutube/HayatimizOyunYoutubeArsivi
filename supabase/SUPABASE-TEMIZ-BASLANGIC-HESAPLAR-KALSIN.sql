-- Hayatımız Oyun v2.1.4.3 HESAPLAR KALSIN TEMİZ BAŞLANGIÇ
-- site_users tablosuna dokunmaz. Açtığın hesaplar kalır.
-- Yönetim planı, özellik durumları, güncelleme notları, oyunlar ve bakım ayarı sıfırlanır.

create extension if not exists pgcrypto;

create table if not exists public.site_features (
  id uuid primary key default gen_random_uuid(), key text not null, title text not null,
  description text, enabled boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.site_admin_planner (
  id uuid primary key default gen_random_uuid(), group_name text not null, title text not null,
  status text not null default 'plan', feature_key text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.site_admin_notes (
  id uuid primary key default gen_random_uuid(), note text not null,
  actor_email text, created_at timestamptz not null default now()
);
create table if not exists public.site_update_notes (
  id uuid primary key default gen_random_uuid(), version text, title text, note text,
  created_at timestamptz not null default now()
);
create table if not exists public.site_runtime_config (
  id uuid primary key default gen_random_uuid(), key text not null,
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.games (
  id uuid primary key default gen_random_uuid(), title text not null, genre text default 'Genel',
  status text default 'Devam Ediyor', episode_count integer default 0, score numeric default 0,
  cover_url text, source text default 'manual', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

truncate table public.site_features restart identity cascade;
truncate table public.site_admin_planner restart identity cascade;
truncate table public.site_admin_notes restart identity cascade;
truncate table public.site_update_notes restart identity cascade;
truncate table public.site_runtime_config restart identity cascade;
truncate table public.games restart identity cascade;

notify pgrst, 'reload schema';
select 'v2.1.4.3 temiz baslangic tamam. Hesaplar silinmedi. Simdi supabase/schema.sql calistir.' as status;
