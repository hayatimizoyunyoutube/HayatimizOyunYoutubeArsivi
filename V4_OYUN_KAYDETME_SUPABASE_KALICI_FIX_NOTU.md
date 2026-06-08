# v4.0.0 FIX - Oyun Kaydetme ve Supabase Kalıcı Kayıt

## Yapılanlar

- Oyun ekledikten sonra `Mevcut Oyunlar` listesinin 0 kalması düzeltildi.
- Yerel kayıt + Supabase kayıt akışı ayrıldı; Supabase hata verse bile oyun tarayıcıda korunur.
- Supabase boş/daha az kayıt dönerse mevcut oyunların üstüne yazmaz.
- Yeni oyun kaydı mevcut arşivle merge edilir, eski kayıtlar silinmez.
- Oyunu Güncelle işlemi bölüm/thumbnail listesini resetlemez.
- Kayıt sonrası liste otomatik yenilenir.

## Schema

Yeni tablo eklenmedi. Mevcut schema yeterlidir.
