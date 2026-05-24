# Hayatımız Oyun v2.1.3 - Site Yükleniyor + Schema Fix

Bu paket v2.1.3 üstüne hata düzeltme paketidir.

Düzeltilenler:
- Vercel'de `Site yükleniyor...` ekranında kalma riski düzeltildi.
- `vercel.json` içindeki assets dosyalarını bozabilecek genel rewrite kaldırıldı.
- `supabase/schema.sql` içindeki yanlış v2.1.4.4 / v2.1.5 yazıları v2.1.3'e göre düzeltildi.
- Storage bucket, güncelleme notları, oyun episode/favori/geçmiş tabloları tek schema içinde toparlandı.

Normal kurulum: `supabase/schema.sql` -> temiz kurulum -> GitHub -> Vercel Clear Build Cache.
