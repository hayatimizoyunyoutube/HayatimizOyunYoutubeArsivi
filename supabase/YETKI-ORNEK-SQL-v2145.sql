-- Hayatımız Oyun v2.1.4.5 Yetki Örneği
-- MAIL_ADRESINI_BURAYA_YAZ yerine kendi kayıt olduğun e-posta adresini yaz.

update public.site_users
set role = 'kurucu',
    is_active = true,
    banned_at = null,
    ban_reason = null,
    updated_at = now()
where email = 'MAIL_ADRESINI_BURAYA_YAZ';

notify pgrst, 'reload schema';
select email, role, is_active from public.site_users where email = 'MAIL_ADRESINI_BURAYA_YAZ';
