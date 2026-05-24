-- Hayatımız Oyun v2.1.3 Yetki Örnekleri
-- MAIL_ADRESINI_BURAYA_YAZ kısmını kendi e-posta adresinle değiştir.

-- Kurucu yap
update public.site_users
set role = 'kurucu',
    is_active = true,
    banned_at = null,
    ban_reason = null,
    updated_at = now()
where lower(email) = lower('MAIL_ADRESINI_BURAYA_YAZ');

-- Yönetici yap
-- update public.site_users set role='yonetici', is_active=true, banned_at=null, ban_reason=null, updated_at=now() where lower(email)=lower('MAIL_ADRESINI_BURAYA_YAZ');

-- Moderatör yap
-- update public.site_users set role='moderator', is_active=true, banned_at=null, ban_reason=null, updated_at=now() where lower(email)=lower('MAIL_ADRESINI_BURAYA_YAZ');

-- Editör yap
-- update public.site_users set role='editor', is_active=true, banned_at=null, ban_reason=null, updated_at=now() where lower(email)=lower('MAIL_ADRESINI_BURAYA_YAZ');

select email, role, is_active from public.site_users where lower(email)=lower('MAIL_ADRESINI_BURAYA_YAZ');
