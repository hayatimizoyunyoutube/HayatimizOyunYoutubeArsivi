# Hayatımız Oyun v2.1.3

Bu paket v2.1.2 stabil ZIP üzerine hazırlanmış **v2.1.3 stabilizasyon + koleksiyon fix** paketidir.

## Bu sürümde yapılan ana düzenlemeler
- Paket sürümü `2.1.3` olarak güncellendi.
- Site üstündeki sürüm etiketi `v2.1.3 Stabilizasyon + Koleksiyon Fix` yapıldı.
- Koleksiyon sistemi artık sadece sabit birkaç başlığa göre değil; durum, tür, etiket, seri ve favori verilerine göre dinamik hesaplanır.
- Koleksiyon sayacı filtre seçildiğinde `görünen/toplam` mantığıyla daha doğru görünür.
- `schema.sql`, `update-notes.json`, `README`, `VERSION_NOTES` ve kurulum notlarındaki sürüm karışıklığı temizlendi.
- `TAMAMLANANLAR` içine v2.1.3 tamamlanan dosyası eklendi.
- `PLANLANANLAR` içine v2.1.4 plan dosyası eklendi.

## Normal kurulumda kullanılacak dosyalar
- `supabase/schema.sql`
- Gerekirse `supabase/YETKI-ORNEK-SQL-v212.sql`

Opsiyonel SQL dosyaları sadece hata/temizlik/güvenlik ihtiyacında kullanılmalıdır.

Kurulum için `KURULUM-KOMUTLARI.txt` dosyasını takip et.
