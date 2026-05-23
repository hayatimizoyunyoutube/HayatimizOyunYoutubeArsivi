# Hayatımız Oyun v2.1.3 Fix 8

Bu paket beyaz ekran/açılmama sorununu düzeltmek için sade ve stabil yapıyla hazırlandı.

## Önemli
- Giriş ekranında ayrı yetkili/admin girişi yoktur.
- Kurucu, yönetici, moderatör ve editör normal giriş ekranından giriş yapar.
- Yetki Supabase `public.site_users.role` alanından okunur.
- Şifre veya gizli anahtar ekranda yazmaz.
- Bakım modu açıkken giriş yapmayanlar ve normal kullanıcılar bakım ekranını görür.
- Yetkili roller yönetim paneline girebilir.
