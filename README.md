# Hayatımız Oyun v2.1.1

Bu paket 2.1.0 oyun ekleme sisteminin devamıdır. AI Özellik bölümü kaldırıldı; yeni özellikler artık sohbet üzerinden hazırlanacak.

## Öne çıkanlar

- Oyun ekleme formu Yönetim Paneli > Oyunlar içinde doğrudan çalışır.
- Otomatik çekme oyun eklemez, oyun silmez; sadece formu doldurur.
- Kapak resmi, çıkış tarihi, tüm oyun türleri ve puan çekme akışı korunur.
- Çıkış tarihi formatı: gün.ay.yıl.
- Etiketler butonlu: Türkçe Altyazılı, Türkçe Dublajlı, DLC, Coop, %100 ve diğerleri.
- Koleksiyon sayacı sabit 7 olmaktan çıkarıldı.
- Koleksiyonlar games tablosundaki gerçek oyunların tür, durum ve etiketlerinden oluşur.

## Kurulum

1. Supabase SQL Editor içinde `supabase/schema.sql` çalıştır.
2. Proje klasöründe `01-siteyi-temizle-git-ve-bat-haric.bat` çalıştır.
3. ZIP içeriğini proje klasörüne çıkar.
4. `02-githuba-otomatik-gonder.bat` çalıştır.
5. Vercel üzerinden Redeploy > Clear Build Cache yap.

Gizli API key ve şifreler ZIP içinde yoktur; Vercel Environment Variables içinde kalmalıdır.
