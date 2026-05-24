v2.1.0 Oyun Ekle Meta Fix
- AI Özellik bölümü kaldırıldı.
- Oyunlar sekmesinde oyun ekleme doğrudan aktif.
- Otomatik çekme sadece formu doldurur; kendiliğinden oyun eklemez/silmez.
- RAWG_API_KEY varsa kapak, çıkış tarihi, tüm türler ve puan çekilir.
- Çıkış tarihi gün.ay.yıl formatında tutulur.
- Etiketler butonlu: Türkçe Altyazılı, Türkçe Dublajlı, DLC, Coop, %100 vb.

AI Düzenle Öneri + Kategori Fix
- Bu paket yeni sürüm değildir; Akıllı Özellik / Düzenle sayfası için fix paketidir.
- Düzenle butonuna basınca artık 4-5 yeni düzenleme önerisi gösterilir.
- Öneri ekranında “Bunlardan hangisi istediğiniz doğrultusunda?” mantığı eklendi.
- Seçilen öneri düzenlenmiş haliyle Siteye Uygula yapılır.
- Seçimden sonra özellik yeşil aktif duruma döner.
- Seçilen düzenleme local cache + Supabase site_features/site_admin_planner akışına gönderilir.
- Siteye uygulama sonrası F5 yenileme akışı eklendi; oturum korunur.
- Site adresindeki kategori/panel yolu algılanır: #/kategori/korku, #/admin/oyunlar gibi adreslerde öneriler o kategoriye göre şekillenir.
- Oyunlar, Özellik Planı, Güncelleme Notları, Bakım Modu, Profil ve public kategoriler için bağlama göre öneri hedefi ayarlanır.
- Eksik loadFeatures fonksiyonu eklendi; Siteye Uygula + yenile akışı daha stabil hale getirildi.
- API tarafında hazır modül uygulanırken düzenlenen başlık/açıklama artık yok sayılmaz.
- Build testi başarılı: 291ms.
- ZIP içinde gizli API key/şifre yoktur.

Akıllı Özellik Düzenle Stabil Fix
- Bu paket yeni sürüm değildir; sadece Özellik Planı / Akıllı Özellik sayfasını düzeltir.
- Tarayıcı prompt düzenleme penceresi kaldırıldı.
- Sayfa içi profesyonel özellik düzenleme modalı eklendi.
- Düzenle > Kaydet aynı sayfada çalışır, kart anında güncellenir.
- Siteye Uygula aynı sayfada kalır ve özellik yeşil Sitede aktif durumuna döner.
- AI öneri seçme akışı korunur ve daha stabil hale getirildi.
- ZIP içinde gizli API key/şifre yoktur.

v2.1.5.1 Vercel Build Speed Fix
- Building uzun kalmasın diye .vercelignore eklendi.
- dist/previews/eski görsel klasörleri temizlendi.
- Kurulum görsellerinde sadece güncel v2.1.5 klasörü bırakıldı.
- Vercel canlı build için gereksiz resim/doküman klasörleri deploy dışında tutuldu.
- Build testi başarılı.

# v2.1.5 Kurulum Sırası Temiz Fix

## Eklenen / Düzeltilenler

- Kurulum görsellerindeki eski sürümler kaldırıldı.
- Sadece `kurulum-gorselleri/v2.1.5/` klasörü bırakıldı.
- Supabase kurulum sırası güncellendi.
- Eski yetki SQL dosyaları temizlendi.
- Yeni `YETKI-ORNEK-SQL-v215.sql` eklendi.
- `KURULUM-KOMUTLARI.txt` yeniden yazıldı.
- Her yeni sürümde kurulum sırası ve kurulum resimleri güncellenecek kuralı eklendi.

## Korunanlar

- v2.1.4.9 Akıllı Özellik gerçek modül fix.
- Oyun düzenle/sil modülü.
- Özellikleri Olan Özellikler toplu pasif yapma modülü.
- Supabase RLS güvenlik fix.

---

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



## Oyun Ekle Otomatik Çekme Stabil Fix
- Oyun adından tür/etiket/kapak çek butonu artık yalnızca formu doldurur.
- Kaydet butonuna basılmadan oyun Supabase games tablosuna eklenmez.
- Otomatik kapak çekme artık oyun listesini doğrudan değiştirmez; önce öneri gösterir, onaydan sonra uygular.
- Form F5/render sonrası boşalmaz; taslak localStorage içinde korunur.
- Aynı oyun adı ikinci kez eklenmez; mevcut oyun için Düzenle/Sil akışı kullanılır.
