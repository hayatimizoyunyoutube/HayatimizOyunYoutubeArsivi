# v2.1.5 - Gerçek Storage + Gelişmiş İzleme

- Supabase Storage `profile-photos` bucket için gerçek fotoğraf yükleme endpoint'i eklendi.
- Profil formuna dosya seçme alanı eklendi; yüklenen görsel `avatar_url` olarak kaydedilir.
- Oyunlarda toplam bölüm hedefi ve izlenen bölüm sayısı ayrı tutulur.
- Seri sırası için admin formuna sıra numarası alanı eklendi.
- `Seriyi İzle` detay ekranı eklendi; bölümler içeride listelenir.
- `Sitede İzle` metni YouTube/Seriyi İzle mantığına göre güncellendi.
- Alfabetik arşivde aktif harf görünümü eklendi.
- Harf başlıkları `A Harfinde Başlayan Seriler` formatına çevrildi.
- Admin oyun kartı kapak oranı ve form kapak önizlemesi düzeltildi.
- Bakım moduna otomatik geri sayım metni eklendi.
- Güncelleme notları için düzenle/sil API uçları eklendi.


## v2.1.5.1 Hata Fix Notu

- Site açılışındaki `firstLetter is not defined` hatası düzeltildi.
- `schema.sql` tekrar çalıştırıldığında güncelleme notları ve `schema_version` kaydı güncellenir.
- Supabase SQL Editor'da bu paketle gelen `supabase/schema.sql` dosyasını tekrar çalıştırman önerilir.
