# v2.1.5 FIX - Seri Adı ve Bakım Modu Kesin Düzeltme

## Amaç
Yeni sürüm çıkarmadan iki kritik hatayı düzeltmek:

1. A Plague Tale: Innocence gibi oyunların yanlışlıkla Avatar serisine bağlanmasını engellemek.
2. Bakım modu açıkken Supabase Bakımı Yenile butonunun eski kapalı değerle bakım modunu kapatmasını önlemek.

## Yapılanlar
- Oyun başlığı kesin seri bilgisi taşıyorsa seri adı başlıktan doğrulanır.
- A Plague Tale: Innocence ve A Plague Tale: Requiem kayıtları her durumda A Plague Tale serisine bağlanır.
- RAWG, Supabase veya yerel kayıt Avatar gibi alakasız seri getirirse A Plague Tale oyunlarında bu değer ezilir.
- Supabase games tablosundaki eski yanlış Avatar seri kayıtlarını düzeltmek için güvenli schema data fix eklendi.
- Bakım modu açık/kapalı değeri string/boolean fark etmeksizin doğru okunur.
- Yönetici bakım formunda daha yeni değişiklik yaptıysa Supabase yenileme eski uzak kayıtla bunun üstüne yazmaz.
- Güncelleme notu ve status bilgisi güncellendi.

## Schema Durumu
Schema gerekli. Dosya sıfırlamaz, DROP TABLE yoktur ve mevcut verileri silmez. Sadece A Plague Tale seri düzeltmesini ve status/not bilgisini güvenli uygular.
