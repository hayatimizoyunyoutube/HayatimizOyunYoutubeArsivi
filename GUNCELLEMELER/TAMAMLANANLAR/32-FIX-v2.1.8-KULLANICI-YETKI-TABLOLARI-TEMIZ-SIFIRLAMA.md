# v2.1.8 FIX - Kullanıcı ve Yetki Tabloları Temiz Sıfırlama

## Amaç
Yeni sürüm yapmadan Supabase tarafındaki kullanıcı ve yetkili kayıtlarını temizleyip yetki sistemini baştan kurulabilir hale getirmek.

## Yapılanlar
- `schema.sql` güncellendi.
- Kullanıcı kayıtları temizlenir: `site_users`.
- Yetkili kayıtları temizlenir: `site_admin_profiles`, `site_authority_assignments`.
- Rol audit kayıtları temizlenir: `site_user_role_audit`.
- İzleme geçmişi temizlenir: `site_user_watch_history`.
- Oyunlar, seriler, takvim, bakım modu ve güncelleme notları korunur.
- Status/sürüm kaydı `v2.1.8 FIX` olarak güncellenir.
- Planlananlar klasöründeki 15 dolu plan korunur.

## Schema Durumu
Gerekli. Bu schema tablo DROP yapmaz; yalnızca kullanıcı/yetki tablolarının içini temizler.
