-- HAYATIMIZ OYUN v2.1.3 FIX 2
-- Amaç:
-- 1) site_settings id=1 duplicate hatasını düzeltir.
-- 2) public.site_users tablosunu oluşturur.
-- 3) Supabase/PostgREST schema cache yeniler.
-- Önce bunu çalıştır, sonra gerekirse ana supabase/schema.sql dosyasını tekrar çalıştır.

create extension if not exists pgcrypto;

-- Eski site_settings tablosu id primary key ile kalmışsa güvenli düzelt.
do $$
declare
  value_type text;
  seq_name text;
  has_id boolean;
begin
  if to_regclass('public.site_settings') is null then
    create table public.site_settings (
      "key" text primary key,
      value jsonb not null default '{}'::jsonb,
      updated_at timestamptz default now()
    );
  else
    alter table public.site_settings add column if not exists "key" text;

    select data_type into value_type
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'site_settings'
      and column_name = 'value';

    if value_type is null then
      alter table public.site_settings add column value jsonb default '{}'::jsonb;
    elsif value_type <> 'jsonb' then
      execute 'alter table public.site_settings alter column value type jsonb using coalesce(to_jsonb(value), ''{}''::jsonb)';
    end if;

    alter table public.site_settings add column if not exists updated_at timestamptz default now();

    update public.site_settings s
    set "key" = 'legacy_' || x.rn::text
    from (
      select ctid, row_number() over () as rn
      from public.site_settings
      where "key" is null or trim("key") = ''
    ) x
    where s.ctid = x.ctid;

    select exists (
      select 1 from information_schema.columns
      where table_schema='public' and table_name='site_settings' and column_name='id'
    ) into has_id;

    if has_id then
      seq_name := pg_get_serial_sequence('public.site_settings','id');
      if seq_name is not null then
        execute format('select setval(%L, greatest(coalesce((select max(id) from public.site_settings),0),1), true)', seq_name);
      end if;
    end if;
  end if;
end $$;

create unique index if not exists site_settings_key_unique_idx on public.site_settings ("key");

-- site_users tablosu: kayıt formu bu tabloya yazar.
create table if not exists public.site_users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password_hash text not null,
  password_salt text not null,
  role text not null default 'user',
  provider text default 'site-form',
  is_active boolean default true,
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
alter table public.site_users add column if not exists last_login_at timestamptz;
alter table public.site_users add column if not exists metadata jsonb default '{}'::jsonb;
alter table public.site_users add column if not exists created_at timestamptz default now();
alter table public.site_users add column if not exists updated_at timestamptz default now();

create unique index if not exists site_users_email_unique_idx on public.site_users (email);
create index if not exists site_users_role_idx on public.site_users (role);
create index if not exists site_users_created_at_idx on public.site_users (created_at desc);

alter table public.site_users enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='site_users' and policyname='site users service role only') then
    create policy "site users service role only" on public.site_users for all using (false) with check (false);
  end if;
end $$;

-- PostgREST cache yenile: Vercel API public.site_users tablosunu görsün.
notify pgrst, 'reload schema';

select 'v2.1.3 fix 2 hotfix tamam' as status, count(*) as existing_users from public.site_users;
