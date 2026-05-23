-- HAYATIMIZ OYUN v2.1.3 FIX 3
-- BUNU ÖNCE ÇALIŞTIR: Kullanıcı yetki sistemi + global bakım modu.
-- Eski site_settings id=1 duplicate hatasına takılmaz; yeni ayarlar site_runtime_config tablosunda tutulur.

create extension if not exists pgcrypto;

create table if not exists public.site_users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  password_hash text not null,
  password_salt text not null,
  role text not null default 'user',
  provider text default 'site-form',
  is_active boolean default true,
  banned_at timestamptz,
  ban_reason text,
  last_login_at timestamptz,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.site_users add column if not exists name text;
alter table public.site_users add column if not exists email text;
alter table public.site_users add column if not exists password_hash text;
alter table public.site_users add column if not exists password_salt text;
alter table public.site_users add column if not exists role text default 'user';
alter table public.site_users add column if not exists provider text default 'site-form';
alter table public.site_users add column if not exists is_active boolean default true;
alter table public.site_users add column if not exists banned_at timestamptz;
alter table public.site_users add column if not exists ban_reason text;
alter table public.site_users add column if not exists last_login_at timestamptz;
alter table public.site_users add column if not exists metadata jsonb default '{}'::jsonb;
alter table public.site_users add column if not exists created_at timestamptz default now();
alter table public.site_users add column if not exists updated_at timestamptz default now();

create unique index if not exists site_users_email_unique_idx on public.site_users (email);
create index if not exists site_users_role_idx on public.site_users (role);
create index if not exists site_users_active_idx on public.site_users (is_active);
create index if not exists site_users_created_at_idx on public.site_users (created_at desc);

create table if not exists public.site_runtime_config (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

insert into public.site_runtime_config (key, value, updated_at)
values
  ('maintenance_mode', '{"enabled":false,"message":"Hayatımız Oyun kısa süreli bakımda."}'::jsonb, now()),
  ('register_target', '{"table":"public.site_users","enabled":true}'::jsonb, now()),
  ('current_version', '{"version":"v2.1.3-fix-3","name":"Yetki Yönetimi + Global Bakım"}'::jsonb, now())
on conflict (key) do update set value = excluded.value, updated_at = now();

alter table public.site_users enable row level security;
alter table public.site_runtime_config enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='site_users' and policyname='site users service role only') then
    create policy "site users service role only" on public.site_users for all using (false) with check (false);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='site_runtime_config' and policyname='site runtime config public read') then
    create policy "site runtime config public read" on public.site_runtime_config for select using (true);
  end if;
end $$;

notify pgrst, 'reload schema';

select 'v2.1.3 fix 3 yetki + bakım hotfix tamam' as status,
       (select count(*) from public.site_users) as users_count,
       (select value from public.site_runtime_config where key='maintenance_mode') as maintenance_mode;
