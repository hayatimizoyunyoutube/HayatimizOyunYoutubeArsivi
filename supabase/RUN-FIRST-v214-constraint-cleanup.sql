-- Hayatımız Oyun v2.1.4 constraint/duplicate cleanup
-- Tam sıfırlama yapmadan mevcut tabloları koruyarak schema.sql çalıştırmak için önce bunu çalıştır.

create extension if not exists pgcrypto;

-- Aynı email tekrarları varsa ilk kayıt kalsın.
do $$
begin
  if to_regclass('public.site_users') is not null then
    delete from public.site_users a
    using public.site_users b
    where a.ctid < b.ctid and lower(a.email) = lower(b.email);
  end if;
end $$;

-- Aynı runtime key tekrarları varsa son kayıt kalsın.
do $$
begin
  if to_regclass('public.site_runtime_config') is not null then
    delete from public.site_runtime_config a
    using public.site_runtime_config b
    where a.ctid < b.ctid and a.key = b.key;
  end if;
end $$;

-- Aynı özellik key tekrarları varsa son kayıt kalsın.
do $$
begin
  if to_regclass('public.site_features') is not null then
    delete from public.site_features a
    using public.site_features b
    where a.ctid < b.ctid and a.key = b.key;
  end if;
end $$;

-- Güncelleme notlarında tekrar eden sürüm/başlık varsa ilk kayıt kalsın.
do $$
begin
  if to_regclass('public.site_update_notes') is not null then
    delete from public.site_update_notes a
    using public.site_update_notes b
    where a.ctid < b.ctid
      and coalesce(a.version,'') = coalesce(b.version,'')
      and coalesce(a.title,'') = coalesce(b.title,'');
  end if;
end $$;

notify pgrst, 'reload schema';
select 'v2.1.4 constraint cleanup tamam. Simdi supabase/schema.sql calistir.' as status;
