-- Hayatımız Oyun v2.1.5
-- Supabase RLS Güvenlik Fix
-- Amaç: Table Editor'da görünen kırmızı UNRESTRICTED / RLS disabled uyarılarını güvenli şekilde kapatmak.
-- ÖNEMLİ: Bu dosya schema.sql çalıştıktan sonra çalıştırılır.
-- Site Vercel API + SUPABASE_SERVICE_ROLE_KEY kullandığı için servis işlemleri çalışmaya devam eder.

do $$
declare
  t text;
begin
  foreach t in array array[
    'games',
    'site_users',
    'site_features',
    'site_admin_planner',
    'site_admin_notes',
    'site_runtime_config',
    'site_update_notes',
    'update_notes',
    'users_app'
  ] loop
    if to_regclass('public.' || t) is not null then
      execute format('alter table public.%I enable row level security', t);
    end if;
  end loop;
end $$;

-- Çakışma olmaması için eski policy'ler silinir.
do $$
begin
  if to_regclass('public.games') is not null then
    drop policy if exists "games public read" on public.games;
  end if;
  if to_regclass('public.site_update_notes') is not null then
    drop policy if exists "site_update_notes public published read" on public.site_update_notes;
  end if;
  if to_regclass('public.update_notes') is not null then
    drop policy if exists "update_notes public read" on public.update_notes;
  end if;
end $$;

-- Kullanıcı tarafında güvenli okuma gereken tablo: games
do $$
begin
  if to_regclass('public.games') is not null then
    execute $policy$
      create policy "games public read"
      on public.games
      for select
      to anon, authenticated
      using (true)
    $policy$;
    grant select on public.games to anon, authenticated;
  end if;
end $$;

-- Yayındaki güncelleme notları okunabilir.
do $$
begin
  if to_regclass('public.site_update_notes') is not null then
    execute $policy$
      create policy "site_update_notes public published read"
      on public.site_update_notes
      for select
      to anon, authenticated
      using (coalesce(status, 'published') = 'published')
    $policy$;
    grant select on public.site_update_notes to anon, authenticated;
  end if;
end $$;

-- Eski update_notes tablosu varsa sadece okuma açılır.
do $$
begin
  if to_regclass('public.update_notes') is not null then
    execute $policy$
      create policy "update_notes public read"
      on public.update_notes
      for select
      to anon, authenticated
      using (true)
    $policy$;
    grant select on public.update_notes to anon, authenticated;
  end if;
end $$;

-- Hassas tablolar anon/authenticated doğrudan erişime kapalı kalır.
do $$
begin
  if to_regclass('public.site_users') is not null then revoke all on table public.site_users from anon, authenticated; end if;
  if to_regclass('public.site_features') is not null then revoke all on table public.site_features from anon, authenticated; end if;
  if to_regclass('public.site_admin_planner') is not null then revoke all on table public.site_admin_planner from anon, authenticated; end if;
  if to_regclass('public.site_admin_notes') is not null then revoke all on table public.site_admin_notes from anon, authenticated; end if;
  if to_regclass('public.site_runtime_config') is not null then revoke all on table public.site_runtime_config from anon, authenticated; end if;
end $$;

notify pgrst, 'reload schema';

select 'Hayatımız Oyun v2.1.5 RLS güvenlik fix tamam.' as status;
