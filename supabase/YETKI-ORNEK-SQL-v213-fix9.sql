-- Kendini kurucu yapmak için e-postanı yaz.
update public.site_users
set role = 'kurucu',
    is_active = true,
    banned_at = null,
    ban_reason = null,
    updated_at = now()
where email = 'MAIL_ADRESINI_BURAYA_YAZ';

-- Kullanıcıyı yönetici yapmak için:
-- update public.site_users set role = 'yonetici', is_active = true, updated_at = now() where email = 'MAIL_ADRESI';

-- Kullanıcıyı moderatör yapmak için:
-- update public.site_users set role = 'moderator', is_active = true, updated_at = now() where email = 'MAIL_ADRESI';

-- Kullanıcıyı editör yapmak için:
-- update public.site_users set role = 'editor', is_active = true, updated_at = now() where email = 'MAIL_ADRESI';
