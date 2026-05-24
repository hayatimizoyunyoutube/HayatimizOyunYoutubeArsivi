# Kurulum Özeti - v2.1.4.7

## Sıra

1. Supabase gerekiyorsa `supabase/schema.sql` çalıştır.
2. Proje klasöründe `.git` klasörünü silme.
3. `.bat` dosyalarını silme.
4. Eski site dosyalarını temizlemek için `01-siteyi-temizle-git-ve-bat-haric.bat` çalıştır.
5. ZIP içindeki dosyaları direkt proje klasörüne çıkar.
6. `02-githuba-otomatik-gonder.bat` çalıştır.
7. Vercel'de `Redeploy > Clear Build Cache` yap.
8. Siteye giriş yap.
9. Yönetim Paneli > Özellik Planı > Akıllı Özellik Ekle alanını test et.

## Test cümleleri

- otomatik kapak resmi çekme
- oyun adı çekme
- türünü otomatik çek
- etiket ekleme
- özellik düzenleme silme
