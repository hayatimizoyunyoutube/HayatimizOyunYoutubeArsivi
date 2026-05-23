-- Hayatımız Oyun v2.1.4 yetki örnekleri
-- MAIL_ADRESINI_BURAYA_YAZ kısmını kendi kayıt olduğun e-posta ile değiştir.

-- Kurucu yap
update public.site_users
set role = 'kurucu', is_active = true, banned_at = null, ban_reason = null, updated_at = now()
where email = 'MAIL_ADRESINI_BURAYA_YAZ';

-- Yönetici yap
-- update public.site_users set role='yonetici', is_active=true, banned_at=null, ban_reason=null, updated_at=now() where email='MAIL_ADRESINI_BURAYA_YAZ';

-- Moderatör yap
-- update public.site_users set role='moderator', is_active=true, banned_at=null, ban_reason=null, updated_at=now() where email='MAIL_ADRESINI_BURAYA_YAZ';

-- Editör yap
-- update public.site_users set role='editor', is_active=true, banned_at=null, ban_reason=null, updated_at=now() where email='MAIL_ADRESINI_BURAYA_YAZ';

-- Normal kullanıcı yap
-- update public.site_users set role='user', is_active=true, banned_at=null, ban_reason=null, updated_at=now() where email='MAIL_ADRESINI_BURAYA_YAZ';

-- Banla
-- update public.site_users set role='banned', is_active=false, banned_at=now(), ban_reason='Kurucu tarafından banlandı', updated_at=now() where email='MAIL_ADRESINI_BURAYA_YAZ';

notify pgrst, 'reload schema';
