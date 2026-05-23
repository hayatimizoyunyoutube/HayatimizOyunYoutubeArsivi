-- Hayatımız Oyun v2.1.4.3 constraint/duplicate temizliği
-- schema.sql hata verirse önce bunu çalıştır, sonra schema.sql çalıştır.

do $$
begin
  if to_regclass('public.site_features') is not null then
    delete from public.site_features a using public.site_features b where a.ctid < b.ctid and a.key = b.key;
  end if;
  if to_regclass('public.site_runtime_config') is not null then
    delete from public.site_runtime_config a using public.site_runtime_config b where a.ctid < b.ctid and a.key = b.key;
  end if;
  if to_regclass('public.site_users') is not null then
    delete from public.site_users a using public.site_users b where a.ctid < b.ctid and lower(a.email) = lower(b.email);
  end if;
end $$;

notify pgrst, 'reload schema';
select 'v2.1.4.3 cleanup tamam. Simdi supabase/schema.sql calistir.' as status;
