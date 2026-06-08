# v4.0.1 FIX - Bakım Modu Üye/Ziyaretçi Görünüm Koruması

## Yapılanlar
- Bakım modu açıkken giriş yapmamış ziyaretçiler bakım ekranı görür.
- Bakım modu açıkken normal kayıtlı üyeler bakım ekranı görür.
- Kurucu/moderatör/editör bakım modunda siteye ve yönetim paneline erişebilir.
- Giriş/kayıt sayfaları açık bırakıldı; yetkili kullanıcı bakım sırasında giriş yapabilir.
- Supabase `maintenance_mode.enabled=true` değeri artık otomatik kapatılmaz.
- Eski paketlerdeki `adminBypass=false` sebebiyle bakımın kapanması engellendi.

## Schema durumu
Schema gerekli değil.
