v2.1.4.9 Akıllı Özellik Gerçek Modül Fix
- Akıllı Özellik Ekle artık oyunları düzenle/sil ve aktif özellikleri tümünü sil isteklerini hazır modüle eşleştirir.
- Oyunlar sekmesinde Düzenle/Sil butonları gerçek çalışır.
- Özellikleri Olan Özellikler bölümüne Tüm Aktif Özellikleri Pasif Yap butonu eklendi.
- Uygula + Siteyi Yenile akışı oturumdan çıkarmadan panel verilerini yeniler.

# Hayatımız Oyun v2.1.4.8 - Supabase RLS Güvenlik Fix

Bu sürüm Supabase Table Editor içindeki kırmızı UNRESTRICTED / RLS disabled uyarılarını güvenli şekilde düzeltmek için hazırlandı.

Eklenenler:
- supabase/02-SUPABASE-RLS-GUVENLIK.sql
- supabase/03-SUPABASE-RLS-KONTROL.sql
- supabase/OKU-ONCE-SUPABASE-SIRASI.txt
- supabase/YETKI-ORNEK-SQL-v2148.sql
- kurulum-gorselleri/v2.1.4.8/
- site-gorselleri/v2.1.4.8/
- gelecek-guncelleme-ozellikleri-ve-resimler/v2.1.4.8-resimler/

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
