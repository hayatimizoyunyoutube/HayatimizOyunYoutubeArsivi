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

## Kalıcı Özellik + Oturum Fix

- Site içinden eklenen özelliklerin güncellemede gitmesi düzeltildi.
- Özellikler Supabase `site_features` ve `site_admin_planner` tablolarında kalıcı tutulur.
- Local oturum anahtarı sürümden bağımsız hale getirildi; site güncellenince kullanıcı otomatik çıkış yapmaz.
- Akıllı Özellik Ekle alanına öneri/onay/düzenle/sil akışı eklendi.
- `Özellikleri Olan Özellikler` bölümü eklendi.
- Oyun adı yazınca tür/etiket/kapak önerisi doldurma modülü eklendi.
- Otomatik kapak çekme için daha güvenli fallback kapak sistemi eklendi.
- Gelecek güncelleme görselleri versiyonlu klasör yapısına taşındı.
- v2.1.4.4 site görselleri ZIP içine eklendi.
