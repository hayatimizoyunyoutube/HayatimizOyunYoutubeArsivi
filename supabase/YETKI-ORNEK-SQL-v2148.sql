-- Hayatımız Oyun v2.1.4.8 Yetki Örnekleri
-- MAIL_ADRESINI_BURAYA_YAZ kısmını kendi hesabınla değiştir.

update public.site_users
set role = 'kurucu',
    is_active = true,
    banned_at = null,
    ban_reason = null,
    updated_at = now()
where email = 'MAIL_ADRESINI_BURAYA_YAZ';

notify pgrst, 'reload schema';
