-- HAYATIMIZ OYUN SUPABASE HOTFIX
-- Hata: column "key" of relation "site_settings" does not exist
-- Bunu Supabase SQL Editor'da çalıştır, sonra ana supabase/schema.sql dosyasını tekrar çalıştır.

do $$
declare
  value_type text;
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
  end if;
end $$;

create unique index if not exists site_settings_key_unique_idx on public.site_settings ("key");

insert into public.site_settings ("key", value) values
  ('current_version', '{"version":"v2.1.1","name":"Full Merged Supabase Key Fix"}'::jsonb),
  ('safe_fallback', '{"enabled":true,"mode":"local-json"}'::jsonb),
  ('auto_fetch', '{"youtube":false,"supabase":false,"manual":true}'::jsonb)
on conflict ("key") do update set value = excluded.value, updated_at = now();
