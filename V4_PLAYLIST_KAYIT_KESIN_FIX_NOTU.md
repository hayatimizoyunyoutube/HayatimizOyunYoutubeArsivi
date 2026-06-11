# v4.0.0 FIX - Playlist Çekme ve Oyun Kaydetme Kesin Onarım

## Yapılanlar

- YouTube playlist çekme butonunun ekranda sürekli "çekiliyor" kalması engellendi.
- API cevap vermezse 15 saniye içinde güvenli hata/yedek moda geçer.
- Oyun kaydedilirken YouTube'dan gelen gerçek bölüm başlığı korunur.
- YouTube thumbnail görselleri oyun kapağı/site kapağı ile ezilmez.
- Oyunu Güncelle butonu bölüm listesini resetlemez.
- Supabase dönüşü eksik/generic bölüm verisi getirirse yereldeki gerçek YouTube verisi korunur.
- Seri ve bölüm ekranında gerçek bölüm thumbnail verisi öncelikli kullanılır.
- `hayatimiz-kapak.png` yalnızca gerçek thumbnail yoksa son çare olarak kullanılır.

## Schema Durumu

schema.sql gerekli değildir. Veritabanı yapısı değişmedi.
