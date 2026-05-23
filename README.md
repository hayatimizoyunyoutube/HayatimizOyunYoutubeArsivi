v2.1.4.7 Smart Feature Fix
- Akıllı Özellik Ekle artık öneri modalını güvenli şekilde açar.
- Özel özellikler aktif listeye eklenir, düzenlenir ve silinebilir.
- Siteye Uygula sonrası aktif özellikler kalıcı görünür.

# Hayatımız Oyun v2.1.4.4

Bu paket v2.1.4.3 üzerine kalıcı özellik sistemi, oturum koruma ve akıllı özellik uygulama düzeltmelerini getirir.

## Ana düzeltmeler

- Siteden eklenen özellikler güncelleme sonrası kaybolmaz.
- Site artık her çalıştırmada otomatik çıkış yaptırmaz.
- Akıllı Özellik Ekle alanı öneri, onay, düzenleme ve silme akışı verir.
- Özellikleri Olan Özellikler bölümü eklendi.
- Oyun adı yazınca tür, etiket ve kapak önerisi doldurma sistemi eklendi.
- Oyun kapakları için daha düzgün fallback ve eksik kapak uyarısı eklendi.
- Gelecek güncelleme klasörü versiyonlu hale getirildi.

## Klasörler

- `site-gorselleri/v2.1.4.4/`: Bu sürümde sitenin nasıl görüneceğini gösteren görseller.
- `gelecek-guncelleme-ozellikleri-ve-resimler/v2.1.4.4-resimler/`: Gelecek özelliklerin versiyonlu görselleri.
- `kurulum-gorselleri/`: Resimli kurulum adımları.
- `supabase/`: Supabase SQL kurulum dosyaları.
- `01-siteyi-temizle-git-ve-bat-haric.bat`: `.git` ve `.bat` dosyaları hariç siteyi temizler.
- `02-githuba-otomatik-gonder.bat`: GitHub reposuna force push yapar.

## Güvenlik

Şifre, API key ve gizli anahtarlar ZIP içinde yoktur. Bunlar Vercel Environment Variables içinde kalmalıdır.
