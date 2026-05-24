# v2.1.3 - Stabilizasyon + Koleksiyon Fix

## Düzenlenenler
- Paket sürümü ve görünen site sürümü v2.1.3 olarak eşitlendi.
- v2.1.4.x / v2.1.5 şeklinde karışık görünen kurulum başlıkları temizlendi.
- `public/data/update-notes.json` güncel sürüme göre yeniden yazıldı.
- `supabase/schema.sql` başlık, açıklama ve tamamlandı mesajı v2.1.3 çizgisine çekildi.
- Planlananlar ve tamamlananlar klasörlerine yeni sürüm dosyaları eklendi.

## Koleksiyon Fix
- Koleksiyonlar artık durum, favori, tür, etiket ve seri verilerinden dinamik oluşturulur.
- Aynı koleksiyon tekrar oluşursa oyunlar tek koleksiyon altında birleştirilir.
- Koleksiyon kartları oyun sayısına göre sıralanır.
- Filtre seçildiğinde üst sayaç toplam/görünen koleksiyonu daha net gösterir.

## Korunan Özellikler
- Oyun ekleme/meta çekme sistemi
- Oyun düzenleme formu
- RAWG çoklu seçim/onay akışı
- Seri ve YouTube playlist alanları
- Admin paneli
- Supabase tabloları ve güvenli tekrar çalıştırılabilir schema yapısı
