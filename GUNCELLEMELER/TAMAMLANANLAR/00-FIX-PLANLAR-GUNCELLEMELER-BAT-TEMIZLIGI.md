# FIX - Planlar, Güncellemeler ve BAT Temizliği

Bu paket yeni bir ana sürüm değildir. v2.0.2 stabil çalışan site tabanı korunarak klasör düzeni ve BAT dosyaları temizlendi.

## Yapılanlar

1. Ana klasörde sadece gerekli BAT dosyaları bırakıldı.
2. `03-VSCode-Localhost-Onizleme.bat` silindi.
3. `04-Dist-Onizleme.bat` silindi.
4. Eski/bozuk karakterli üst klasör dosya adları temizlendi.
5. Eski dağınık `PLANLANANLAR`, `TAMAMLANANLAR` ve `HATALAR` yapısı kaldırıldı.
6. Yeni düzen kuruldu: `GUNCELLEMELER/TAMAMLANANLAR` ve `GUNCELLEMELER/PLANLANANLAR`.
7. Silinen/pasife alınan özelliklerin geri eklenme sırası plan dosyalarına tek tek yazıldı.
8. Site kodu bozulmadı; v2.0.2 stabil açılış korunuyor.

## Kalan BAT dosyaları

- `01-siteyi-temizle-git-ve-bat-haric.bat`
- `02-githuba-otomatik-gonder.bat`

## Not

Bu işlem özellik geri ekleme sürümü değildir. Sadece proje klasörünü toparlayan fix paketidir.
