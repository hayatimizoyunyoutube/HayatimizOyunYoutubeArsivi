-- Hayatımız Oyun v2.1.3 GÜNCELLEME GÜVENLİ KURULUM
-- Bu dosya veri silmez. Duplicate/constraint sorunlarında schema.sql öncesi çalıştırılabilir.
-- Normalde önce supabase/schema.sql yeterlidir.

create extension if not exists pgcrypto;

-- Yinelenen kayıtları temizle: unique index kurulabilsin.
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema='public' and table_name='site_users') then
    delete from public.site_users a using public.site_users b where a.ctid < b.ctid and lower(a.email) = lower(b.email);
  end if;
  if exists (select 1 from information_schema.tables where table_schema='public' and table_name='site_features') then
    delete from public.site_features a using public.site_features b where a.ctid < b.ctid and a.key = b.key;
  end if;
  if exists (select 1 from information_schema.tables where table_schema='public' and table_name='site_runtime_config') then
    delete from public.site_runtime_config a using public.site_runtime_config b where a.ctid < b.ctid and a.key = b.key;
  end if;
  if exists (select 1 from information_schema.tables where table_schema='public' and table_name='site_update_notes') then
    delete from public.site_update_notes a using public.site_update_notes b where a.ctid < b.ctid and coalesce(a.version,'') = coalesce(b.version,'') and coalesce(a.title,'') = coalesce(b.title,'');
  end if;
  if exists (select 1 from information_schema.tables where table_schema='public' and table_name='site_favorites') then
    delete from public.site_favorites a using public.site_favorites b where a.ctid < b.ctid and lower(a.user_email)=lower(b.user_email) and a.game_id=b.game_id;
  end if;
end $$;

notify pgrst, 'reload schema';
select 'v2.1.3 guncelleme guvenli kurulum tamam. Veriler silinmedi. Simdi schema.sql calistir.' as status;
