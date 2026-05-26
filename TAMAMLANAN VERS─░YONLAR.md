# v2.4.0 FIX 41

- Oyun Ekle / Mevcut Oyunu Düzenle formuna Kapakları Getir, Çıkış Tarihini Tekrar Çek ve Türleri Tekrar Çek butonları eklendi.
- Steam, RAWG, internet/görsel havuzu ve yerel DLC katalog adayları birlikte kullanılır.
- Çekme işlemleri Supabase'e otomatik kayıt yapmaz; kayıt yalnızca Oyunu Kaydet / Oyunu Güncelle ile yapılır.

---

## v2.4.0 FIX 40 - Seri Durum Ekranı

- Seriler sayfasında kapak üstüne Tamamlandı / Devam Ediyor / Yakında rozetleri eklendi.
- Devam eden seriler izleyiciye üstte ayrı ve detaylı bir alanda gösterilir.
- Seri kartlarında sıradaki kayıt, bölüm ilerlemesi ve seri durumu daha profesyonel görünür.
- FIX39 sürükle bırak seri sıralama sistemi korunmuştur.


## v2.4.0 FIX 38 - Seri Sıralama Sürükle Bırak
- Seri sıralama ekranı sürükle bırak mantığıyla profesyonel hale getirildi.
- Seriler üstte kart, seçili seri oyunları altta detaylı liste olarak gösterilir.
- Sıra değişiklikleri ekranda anında uygulanır; kalıcı kayıt için kaydet butonu kullanılır.


## v2.4.0 FIX 37 - Google/İnternet DLC Kapak Havuzu
- Kapakları Getir, Alan Wake DLC/Expansion aramalarında Night Springs, The Lake House, The Writer, The Signal ve tüm Alan Wake ailesini birlikte listeler.
- Night Springs görseli pakete yerel asset olarak eklendi.
- API tarafına canlı internet görsel araması eklendi; internet çalışmazsa yerel güvenli katalog devreye girer.
- Kapak seçimi oyun adını değiştirmez ve Supabase'e otomatik kayıt yapmaz.



## v2.4.0 FIX 34 - Oyun Ekleme / Oyun Tıklama Stabilizasyonu

- Oyunlara tıklayınca oluşan `Maximum call stack size exceeded` hatası düzeltildi.
- Eski FIX31 cache assetleri de yeni güvenli kodla değiştirildi.
- Oyun ekleme/meta/kapak/tür/hikaye çekme işlemleri kayıt yapmadan yalnızca formu doldurur.
- Benzer oyun adlarında farklı oyun çekme riski azaltıldı.

## v2.4.0 FIX 29 - Panel Stabilizasyonu ve Güvenli Oyun Formu

- Bakım modu stabil hale getirildi.
- Seri sıralama üst sekme + alt detay düzenine alındı.
- Oyun istekleri ve hata bildirimleri Supabase’den yenilenebilir oldu.
- Oyun Ekle formunun eski taslakla dolu gelmesi engellendi.
- Kaydet/Güncelle olmadan otomatik Supabase kaydı kapatıldı.

# v2.4.0 FIX 23 - Sade Yönetim Paneli

- Site içindeki Deploy / Redeploy / GitHub / Vercel kontrol panelleri kaldırıldı.
- Bu panellere ait menü bağlantıları, butonlar ve yönlendirmeler pasifleştirildi.
- AI ile özellik yazma/önerme/uygulama sistemi kapalı tutuldu.
- Yönetim paneli sadece gerekli arşiv, seri, takvim, rapor, bakım, schema ve ayar bölümlerine indirildi.
- API tarafındaki deploy/redeploy uçları pasif cevap dönecek şekilde kapatıldı.
- schema.sql içine ilgili deploy/redeploy tablolarını temizleyen FIX23 bloğu eklendi.



## v2.4.0 FIX 22 - AI Özellik Sistemi Kaldırıldı
- AI ile özellik yazma, önerme, uygulama ve AI tanı panelleri kaldırıldı.
- Deploy Merkezi sade GitHub/Vercel/Supabase kontrol ekranı oldu.
- AI localStorage kayıtları ve AI API kayıt akışları pasifleştirildi.



## v2.4.0 FIX 21 - AI Özellik Profesyonel Hedef Router
- Özellik Yaz / AI Uygula sisteminde yanlış sayfaya ekleme sorunu düzeltildi.
- `v2.4.x Planı` içindeki Planı kelimesi artık Yayın Takvimi olarak algılanmaz.
- AI Özellik, Özellik Yaz, Siteye Uygula ve Nereye Eklendiyse Git akışı AI Özellik Ekle hedefinde kilitlenir.
- Daha önce yanlış hedefe düşen AI özellik kayıtları açılışta otomatik düzeltilir.
- Uygulanan özellik listesi, hedef panel kartı ve Git butonu aynı profesyonel router ile çalışır.
- FIX20 hazır dist deploy mantığı korundu; FIX21 assetleri eklendi.



## v2.4.0 FIX 19 - Site Yükleniyor Build/Asset Fix
- Site yükleniyor ekranında kalma sorunu düzeltildi.
- dist içindeki JS artık gerçek Vite production bundle olarak üretilir.
- Eski FIX18 asset yolu için uyumluluk dosyası eklendi.
- Vercel build/cache ayarları güncellendi.

# TAMAMLANAN VERSİYONLAR

Bu dosya eski tek tek sürüm dosyaları yerine hazırlanmış toplu arşivdir. Gereksiz görsel/doküman klasörleri temiz paketten çıkarıldı.


---

## OKU ONCE TAMAMLANANLAR

# Tamamlananlar Klasörü

Bu klasörde tamamlanan sürümler saklanır. Her yeni sürümde yapılanlar burada kendi versiyon dosyasıyla kalır.

## Kural
- Yapılan sürüm buraya `vX.X.X.md` olarak eklenir.
- Görseller `gorseller/vX.X.X/` içine konur.
- Eski tamamlananlar silinmez.


---

## TUM TAMAMLANANLAR

# Tüm Tamamlanan Sürümler

- `v2.0.6.md`
- `v2.0.7.md`
- `v2.0.8.md`
- `v2.0.9.md`
- `v2.1.0.md`
- `v2.1.1.md`
- `v2.1.2.md`
- `v2.1.2-DETAYLI.md`

Görseller `gorseller/` klasöründe versiyonlara göre tutulur.
- `v2.1.3.md` - Stabilizasyon + koleksiyon fix


---

## v2.0.6

# Tamamlananlar - v2.0.6

- UI Safe Fix: kategori taşmaları, yönetim paneli düzeni ve kart oranları.


---

## v2.0.7

# Tamamlananlar - v2.0.7

- Otomatik çekme altyapısı ve fallback veri sistemi.


---

## v2.0.8

# Tamamlananlar - v2.0.8

- Akıllı filtreler, kalite skoru ve sağlık özeti.


---

## v2.0.9

# Tamamlananlar - v2.0.9

- Kontrol merkezi, bölüm takibi ve koleksiyon alanı.


---

## v2.1.0

# Tamamlananlar - v2.1.0

- Temiz oyun ekleme meta sistemi için temel yapı; AI özellik kaldırma kararı sonrası stabil taban.


---

## v2.1.1

# Tamamlananlar - v2.1.1

- Koleksiyon sayacı sabit 7 olmaktan çıkarıldı; oyun ekle meta/koleksiyon fix tamamlandı.


---

## v2.1.2

# Tamamlananlar - v2.1.2

- RAWG çoklu sonuç, formda düzenleme, filtre, favori, seri ve playlist alanları tamamlandı.


---

## v2.1.2 DETAYLI

# Tamamlananlar - v2.1.2

Bu dosya, kullanıcı tarafından verilen v2.1.2 planının tamamlanan sürüm kaydıdır.

## Tamamlanan Maddeler

1. RAWG kapak aramada birden fazla sonuç seçme/onay ekranı eklendi.
2. Oyun düzenleme prompt yerine sayfa içi form haline getirildi.
3. Oyun düzenleme formuna otomatik meta yenileme butonu eklendi.
4. Koleksiyon sayfasında tür, etiket, favori ve seri filtreleri eklendi.
5. Oyun kartlarında çıkış tarihi ve etiket çipleri daha profesyonel gösterildi.
6. Manuel kapak yükleme/önizleme alanı eklendi; Storage bağlantısı için alan hazırlandı.
7. Gelişmiş arama oyun adı, tür, etiket, durum, çıkış yılı ve seri adına göre çalışır.
8. Kayıtlı kullanıcı favori koleksiyon sistemi local kalıcı olarak eklendi.
9. Kategori/Tür alanı Türkçe tür çevirileriyle güçlendirildi.
10. YouTube oynatma listesi linkinden bölüm sayısı çekme butonu eklendi; YOUTUBE_API_KEY varsa API üzerinden çalışır.
11. Serilere ayırma için seri adı alanı ve koleksiyon gruplama eklendi.

## Kaynak Plan

# Gelecek Güncelleme Özellikleri - v2.1.2

Bu klasör her yeni ZIP'te yeni sürüm için yeniden açılır. v2.1.1 içinde yapılanlar ayrı klasörde kalır; sıradaki öneriler v2.1.2 klasörüne taşındı.

## v2.1.2 için önerilenler

1. RAWG kapak aramada birden fazla sonuç seçme/onay ekranı.
2. Oyun düzenleme formunda otomatik meta yenileme butonu.
3. Koleksiyon sayfasında tür/etiket filtreleri.
4. Oyun kartlarında çıkış tarihi ve etiket çipleri için daha profesyonel mobil görünüm.
5. Supabase Storage ile kapak resmi manuel yükleme.
6. Gelişmiş arama: oyun adı, tür, etiket, durum ve çıkış yılı.
7. Kayıtlı kullanıcı favori koleksiyon sistemi.
8. Oyunları Düzenleme Sistemini form halinde yap
9. Kategori/Tür türkçe yap ve daha vikipedi yada oyunun sitesinden bak
10. Bölüm Sayısını Youtube oynatma listesinden çek oynatma listesi ekleme gelsin
11. Serilere ayırma gelsin


---

## v2.1.3

# TAMAMLANANLAR - v2.1.3

## Stabilizasyon + Koleksiyon Fix

- Paket sürümü `2.1.3` yapıldı.
- Site görünen sürümü `v2.1.3 Stabilizasyon + Koleksiyon Fix` olarak güncellendi.
- `README.md`, `VERSION_NOTES.md`, `KURULUM-KOMUTLARI.txt` ve Supabase kurulum notları güncellendi.
- `public/data/update-notes.json` v2.1.3 gerçek notlarıyla yeniden yazıldı.
- `supabase/schema.sql` içindeki v2.1.4.4 / v2.1.5 karışık başlıkları temizlendi.
- Koleksiyon sistemi durum, tür, etiket, seri ve favori verilerine göre dinamik hale getirildi.
- Koleksiyon sayacı filtreli görünümde `görünen/toplam` mantığıyla düzeltildi.
- Eski v2.1.2 stabil oyun yönetimi, RAWG meta, seri, playlist ve admin panel özellikleri korundu.

## Test

- `npm install` çalıştırıldı.
- `npm run build` ile Vite üretim build testi yapılmalı/başarılı olmalı.


---

## v2.1.4

# TAMAMLANANLAR - v2.1.4

## Gelişmiş Arşiv + Görsel İyileştirme

- Oyun kartlarında seri bilgisi ve bölüm ilerleme yüzdesi gösterildi.
- Admin panelinde eksik kapakları tek ekranda listeleyen kontrol paneli eklendi.
- RAWG kapak seçim ekranına büyük önizleme eklendi.
- Güncelleme notları paneline sürüm filtresi ve arama eklendi.
- Profil fotoğrafı için avatar URL alanı ve Supabase Storage notu eklendi.
- Bakım modu için tahmini açılış zamanı alanı eklendi.
- Vercel/Supabase kurulum rehberi v2.1.4'e göre güncellendi.
- Arayüz daha profesyonel, sade ve istatistik odaklı hale getirildi.
- Ana menüden gereksiz Koleksiyonlar kategorisi kaldırıldı.
- Profesyonel oyuncu arşivi hero alanı küçültülüp istatistik paneline dönüştürüldü.
- Oyun kartlarına Sitede İzle / Serileri İzle / Yakında butonları eklendi.
- Oyunlara alfabetik sıralama şeritleri eklendi.
- Harfe Git navigasyonu eklendi.
- Bakım modu loading ekranıyla daha profesyonel hale getirildi.
- Güncelleme notları son sürüm üstte olacak şekilde düzenlendi.
- Oyun kartlarındaki kapak/yazı düzeni profesyonelleştirildi.


---

## v2.1.5

# PLANLANANLAR - v2.1.5

## Önerilen Sonraki Sürüm: Gerçek Storage + Gelişmiş İzleme

- Supabase Storage profile-photos bucket üzerinden gerçek dosya yükleme endpoint'i eklenecek.
- Güncelleme notlarında gerçek düzenleme/silme Supabase kayıt ID'leriyle tamamlanacak.
- Oyun kartlarında manuel bölüm hedefi ve izlenen bölüm sayısı ayrı tutulacak.
- Seri sıralaması için admin panelinde sürükle-bırak veya sıra numarası alanı eklenecek.
- Sitede İzle butonu için video/playlist URL doğrulama eklenecek.
- Bakım modu için otomatik geri sayım sayacı eklenecek.
- Alfabetik arşivde seçilen harfin aktif görünmesi sağlanacak.
- A Harfinde Başlayan Seriler Diye değişecek
- Sitede izle deyince youtubeda izleniyor seriyi izle diye değişecek ve içeriğine girilecek orda bölümler gözükecek
- admin panelinde oyunlarda kartlar kapak kötü duruyor sığacak şekilde düzenlenecek
- 2.1.6 biraz daha fazla özellik yazılacak güncelleme notuna


## Tamamlandı

- Yukarıdaki v2.1.5 maddeleri bu pakete işlendi.
- Build testi başarılıdır.


---

## v2.1.5 FIX

# TAMAMLANANLAR - v2.1.5 FIX

Bu dosya yeni güncelleme değil, v2.1.5 stabil fix kaydıdır.

- Admin oyun kartlarında kapak/yazı taşması düzeltildi.
- YouTube dış bağlantısı yerine site içi Seriyi İzle penceresi kullanıldı.
- Büyük profesyonel arşiv kapağı kaldırıldı.
- Alfabetik başlık görünümü düzeltildi.
- schema.sql son status mesajı v2.1.5 FIX olarak düzeltildi.


---

## v2.1.5.1

# TAMAMLANANLAR - v2.1.5.1

## Hata Fix + Sürekli Güncellenen Schema

- Site açılışında görünen `ReferenceError: firstLetter is not defined` hatası giderildi.
- Alfabetik arşiv `gameInitial()` fonksiyonuyla güvenli çalışacak şekilde düzeltildi.
- `schema.sql` tekrar çalıştırıldığında güncelleme notları eski kalmayacak şekilde upsert mantığı eklendi.
- `site_update_notes` için `version + title` benzersiz indeks eklendi.
- `site_runtime_config` içine `schema_version = v2.1.5.1` kaydı eklendi.
- `YouTube'da İzle` / `Seriyi İzle` buton metinleri düzeltildi.


---

## v2.1.6

# TAMAMLANANLAR - v2.1.6

- Seri detay ekranında bölüm başlığı, açıklaması, küçük kapak ve video linki desteği eklendi.
- Bölüm bazlı izlendi işaretleme ve toplam ilerleme hesabı eklendi.
- Admin panelinde oyunları seri adına göre gruplama ve seri sıra no kontrolü eklendi.
- YouTube playlist URL'sinden bölüm listesi çekme paneli geliştirildi.
- Güncelleme notları arşivine v2.1.6 eklendi.
- Ana sayfaya toplam seri, toplam bölüm, izlenen bölüm ve tamamlanan seri istatistikleri eklendi.
- Oyun kartlarında kompakt/liste görünümü seçeneği eklendi.
- Hatalı veya boş YouTube linklerini kontrol eden admin sağlık paneli eklendi.
- Seriyi İzle ekranı ayrı site içi izleme sayfası görünümüne taşındı.


---

## v2.1.6 FIX

# TAMAMLANANLAR - v2.1.6 FIX

- Form altındaki butonlar daha düzgün ve okunabilir hale getirildi.
- `Hikayesi / Açıklama` alanı düzenlendi.
- `Hikaye Çek` butonu eklendi; Türkçe hikaye özeti forma işlenir.
- Playlistten tüm bölümleri çekme işleminde bölüm listesi ve toplam bölüm formda kalıcı görünür.
- Düzenleme formunda meta/playlist çekme sonrası form sıfırlanma sorunu giderildi.
- Kapak önizleme ve form buton görünümü düzeltildi.


---

## v2.1.6 FIX 2

# TAMAMLANANLAR - v2.1.6 FIX 2

## Hikaye ve Playlist Düzeltmesi

- Hikaye Çek artık RAWG notu eklemez.
- Hikaye alanı oyun adına göre Türkçe oyun hikayesi olarak doldurulur.
- Meta / Kapak Çek artık açıklama alanını RAWG açıklamasıyla kirletmez.
- Playlist Videolarını Çek butonu YouTube playlist videolarını bölüm listesine işler.
- Bölüm listesine açıklama metinleri yerine temiz video başlığı, video linki ve küçük kapak yazılır.
- YOUTUBE_API_KEY yoksa herkese açık playlist sayfasından yedek çekme denenir.
- Formdaki bölüm listesi yanlışlıkla YouTube açıklamasıyla dolmasın diye import mantığı temizlendi.


---

## v2.1.6 FIX 3

# v2.1.6 FIX 3 - Profesyonel Bölüm Çekme ve Seri İzleme

- Playlistten bölüm çekme sistemi tekrar düzeltildi.
- YouTube açıklaması, kanal metni veya URL satırları bölüm listesine karışmayacak şekilde temizlendi.
- Admin formunda ham URL görünümü gizlendi; bölümler profesyonel liste olarak gösterildi.
- Teknik bölüm verisi sadece gerekirse göster/gizle butonuyla açılır.
- Seriyi İzle ekranında bölüm seçimi index bazlı yapıldı; seçilen bölüm artık hep 1. bölüme dönmez.
- Her bölüm kendi YouTube video ID'siyle site içi oynatıcıda açılır.
- Sağ bölüm listesi daha profesyonel sinema ekranı görünümüne getirildi.


---

## v2.1.7

# TAMAMLANANLAR - v2.1.7

- Kalıcı bölüm izleme kaydı eklendi.
- Playlist senkronizasyon karşılaştırması eklendi.
- Otomatik sonraki bölüme geçme eklendi.
- Seriler kategorisi eklendi.
- Yönetim panelinde seri sıralamasını kalıcı kaydetme eklendi.
- Mobil alt menü ve hızlı arama eklendi.
- Sağlık paneli genişletildi.
- Profesyonel arayüz iyileştirmeleri yapıldı.


---

## v2.1.8

# TAMAMLANANLAR - v2.1.8

## Tam Otomatik Yayın Takvimi + Gelişmiş Medya Yönetimi

- Bölüm listesi formatına yayın tarihi ve kişisel not alanı eklendi.
- Seriyi İzle ekranına Burada Kaldım ve İzlendi Geri Al mantığı eklendi.
- Son bölümden sonra aynı seride sıradaki oyuna geçiş butonu eklendi.
- Klavye kısayolları eklendi: sağ/sol bölüm değiştirir, Space izleme durumunu değiştirir, F sinema modunu açar.
- Mobil/tam ekran sinema modu eklendi.
- Yönetim panelinde seri sıralama ayrı butona taşındı.
- Yönetim panelindeki kategori/filtre çubuklarının aşağı kaydırınca yapışması engellendi.
- Toplu playlist senkronizasyonu eklendi.
- Bakım ekranı profesyonel animasyonlu hale getirildi ve kullanıcılara sadece önemli güncelleme notları gösterildi.


---

## v2.1.9

# TAMAMLANANLAR - v2.1.9

## Yayın Otomasyonu + Bildirim Merkezi

- Bildirimler kategorisi eklendi.
- Ana sayfaya rozetli/sesli bildirim butonu eklendi.
- Yaklaşan bölüm yayın tarihi bildirimleri hazırlandı.
- Yeni video/bölüm uyarıları bildirim merkezinde gösterildi.
- Serileri tümünü izle akışı eklendi.
- Sitede İzle ekranı daha büyük ve profesyonel hale getirildi.
- Bölüm yorumları / kişisel not alanı güçlendirildi.
- İzleme geçmişi zaman çizelgesi eklendi.
- Yönetim Paneli içine ayrı Seri İzleme kategorisi eklendi.
- Toplu playlist senkronizasyonu geçmişi altyapısı eklendi.
- Supabase için site_notifications, site_episode_comments ve site_bulk_operations tabloları eklendi.


---

## v2.2.0

# TAMAMLANANLAR - v2.2.0

## Tam Otomatik YouTube Senkron + Profesyonel Arşiv UI

- Ana sayfa profesyonel oyun arşivi görünümüne taşındı.
- Sol kategori menüsü ve üst navigasyon yenilendi.
- Sağ profil, istatistik, yaklaşan yayın ve son etkinlik panelleri eklendi.
- Bildirimler butonları çalışır hale getirildi.
- Bildirim tercihleri Yeni Video / Yayın Tarihi / Bakım olarak ayrıldı.
- Seriyi İzle ekranı büyük sinema ekranına çevrildi.
- Video oynatıcı alanı ve bölüm listesi profesyonel şekilde düzenlendi.
- v2.2.0 schema dönüş mesajı düzeltildi.


---

## v2.2.0 FIX

# v2.2.0 FIX - Schema JSONB Düzeltmesi

## Düzeltildi

- `schema.sql` içinde `site_runtime_config.value` alanına düz metin sürüm yazılması düzeltildi.
- `schema_version` kayıtları artık `jsonb_build_object(...)` ile JSONB formatında yazılır.
- Supabase SQL Editor üzerinde görülen `22P02: invalid input syntax for type json` hatası giderildi.
- Schema dönüş mesajı `v2.2.0 FIX` olarak güncellendi.

## Not

Bu bir özellik güncellemesi değil, v2.2.0 schema fix paketidir.


---

## v2.2.0 FIX 2

# TAMAMLANANLAR - v2.2.0 FIX 2

## Menü ve Arşiv Paneli Fix

- Üstteki gereksiz menü butonları kaldırıldı.
- Sol Arşiv Menüsü artık sayfa değiştirince kaybolmuyor.
- Kullanıcı sayfaları kalıcı sol menü + içerik alanı düzenine alındı.
- Oyun Arşivi, Seriler, Yayın Takvimi, Bildirimler ve Profilim sayfaları aynı arşiv yerleşimini kullanıyor.
- Üst bar daha sade ve profesyonel hale getirildi.


---

## v2.2.0 FIX 3

# v2.2.0 FIX 3 - Oyun Arşivi Kapak ve Adres Fix

- Oyun Arşivi kart kapakları daha profesyonel, geniş ve modern görünecek şekilde düzeltildi.
- Kapaklar artık taşmadan, sıkışmadan ve okunabilir kart düzeninde gösterilir.
- Kart hover, progress, etiket ve aksiyon alanları iyileştirildi.
- Menü / sayfa geçişlerinde tarayıcı adresinin `#/kategori/...` şeklinde değişmesi kapatıldı.
- Bu paket yeni güncelleme değildir; v2.2.0 için arayüz fix paketidir.


---

## v2.2.0 FIX 4

# TAMAMLANANLAR - v2.2.0 FIX 4

## Profesyonel Arayüz Yenileme Fix Paketi

- Ana sayfa daha profesyonel oyun arşivi paneline çevrildi.
- Oyun kartları daha geniş, okunabilir ve kapak odaklı hale getirildi.
- Oyun Arşivi kartlarında sıkışma ve bozuk kapak görünümü azaltıldı.
- Seriler sayfası seri gruplama mantığına uygun görsel düzene yaklaştırıldı.
- Yayın Takvimi, Favoriler, Bildirimler, Profilim, Yönetim Paneli ve Seriyi İzle için profesyonel görsel referanslar eklendi.
- Sol Arşiv Menüsü kalıcı görünüm mantığı korundu.
- Üst gereksiz menülerin kaldırıldığı sade navigasyon yapısı korundu.
- Site içi sayfa geçişlerinde adres çubuğunun kötü değişmesi engellendi.
- Fix paketinin görselleri `gorseller/v2.2.0-FIX-4` içine eklendi.

## Supabase

Bu fixte yeni tablo değişikliği yoktur.


---

## v2.2.0 FIX 5

# v2.2.0 FIX 5 - Referans Tasarıma Yakın Arayüz

Bu paket, gönderilen referans görsellere daha fazla yaklaşmak için hazırlanmıştır.

## Tamamlananlar
- Ana sayfa kartları ve sağ panel daha profesyonel, daha koyu ve referans ekrana yakın hale getirildi.
- Sol menü yeniden düzenlendi; menü başlıkları, destek kutusu ve alt sosyal ikon alanı eklendi.
- Yönetim paneli sol menüsü referans görseldeki gibi daha belirgin hale getirildi.
- Yönetim panelinde "YÖNETİM" bölümü altında açık/alt menülü yapı görünümü oluşturuldu.
- Oyunlar sekmesi üst başlık alanı ve eylem butonları düzenlendi.
- Oyun formunun kapalı/açık durumu için daha net görünüm eklendi.
- Site içi izleme ekranı daha büyük, daha sinematik ve daha düzenli yapıya geçirildi.
- İzleme ekranında üst bilgi alanı, istatistik kutuları ve gelişmiş sağ bölüm listesi iyileştirildi.
- Derleme testi çalıştırıldı ve paket build hatasız doğrulandı.

## Teknik Not
- `src/main.js` içinde dashboard, sol menü, yönetim paneli ve izleme modalı güncellendi.
- `src/styles.css` içine FIX 5 için geniş arayüz override stilleri eklendi.

## Sonraki Öneriler
- Yönetim paneli alt menülerine gerçek daralt/aç mantığı eklenebilir.
- Sağ panelde gerçek kullanıcı aktivite verileri Supabase üzerinden detaylandırılabilir.
- Sayfa bazlı ekran görüntüleri `site-gorselleri/v2.2.0-fix-5/` klasörüne eklenebilir.


---

## v2.2.0 FIX 6

# v2.2.0 FIX 6 - Referans Tasarım Tam Fix

## Yapılanlar
- Ana sayfa üst bar ve sol menü referans görsele daha yakın hale getirildi.
- Sol menüde yazıların birleşmesi ve sıkışması azaltıldı.
- Yayın Takvimi basit liste görünümünden çıkarıldı, aylık takvim düzenine dönüştürüldü.
- Yaklaşan yayınlar, bu hafta listesi ve öne çıkan etkinlik kartları eklendi.
- Yönetim Paneli > Oyunlar ekranı referans görsele yakın profesyonel forma çevrildi.
- Oyun ekleme formuna sağ tarafta canlı önizleme kartı eklendi.
- Kapak görseli alanı upload/dropzone benzeri profesyonel blok olarak düzenlendi.
- Mevcut oyunlar alanı tablo görünümüne alındı.
- Build testi başarılı tamamlandı.

## Not
Bu paket yeni büyük sürüm değildir; v2.2.0 için görsel ve arayüz fix paketidir.


---

## v2.2.0 FIX 6 FINAL

# v2.2.0 FIX 6 FINAL - Profesyonel UI + Takvim Yönetimi

## Tamamlanan Fixler
- Ana sayfa daha profesyonel geniş dashboard yapısına çekildi.
- Öne çıkan oyun kartları daha geniş ve okunabilir hale getirildi.
- Kapak görsellerinde kırpılma/sıkışma azaltıldı; görseller normal oranıyla gösterilecek şekilde düzenlendi.
- Seriler sayfası dar kart görünümünden çıkarılıp geniş seri satırlarıyla yeniden düzenlendi.
- Oyun ekleme formu daha profesyonel hale getirildi.
- Oyun ekleme formunda `Çıkış Tarihi` alanı gün.ay.yıl formatıyla gösterilecek şekilde düzenlendi.
- Oyun ekleme formuna otomatik kapak/meta çekme akışı daha görünür hale getirildi.
- Yayın Takvimi kullanıcı tarafında gerçek takvim görünümüne yaklaştırıldı.
- Yönetim Paneli içine `Yayın Takvimi` düzenleme alanı eklendi.
- Yönetimden takvim başlığı, tarih, saat, tür, kapak ve not eklenebilir hale getirildi.
- Supabase `site_calendar_events` tablosu schema.sql içine eklendi.
- schema_version v2.2.0 FIX 6 FINAL olarak güncellendi.

## Test
- `node --check src/main.js`
- `node --check api/index.js`
- `npm install`
- `npm run build`

Build başarılı.


---

## v2.2.0 FIX 7

# v2.2.0 FIX 7 - Alfabetik Şerit + Kapaklı Seri ve Takvim Fix

Bu paket yeni büyük sürüm değildir; v2.2.0 için arayüz ve yönetim paneli fix paketidir.

## Tamamlananlar
- Seriler sayfasına alfabetik harf şeridi eklendi.
- Seriler sayfasına "Harfe git" mantığı eklendi.
- Seriler sayfasında her harf için "A Harfindeki Seriler" benzeri başlık yapısı eklendi.
- Oyun Arşivi sayfasına alfabetik şeritler eklendi.
- Oyun Arşivi sayfasına "Harfe git" alanı eklendi.
- Oyun Arşivi sayfasında her harf için "A Harfindeki Oyunlar" başlıkları eklendi.
- Ana sayfada alfabetik arşiv ön izlemesi eklendi.
- Yönetim Paneli > Seri İzleme alanı kapaklı seri sıralama ekranına çevrildi.
- Seri sıralama kartlarında oyun kapakları, oyun adı ve sıra inputu gösterildi.
- Seri sırası kayıt butonu aynı mantıkla korunarak daha profesyonel hale getirildi.
- Yayın Takvimi yönetim formu geliştirildi.
- Yayın Takvimi formuna oyun seçme alanı eklendi.
- Yayın Takvimi formuna bölüm numarası ve bölüm başlığı alanı eklendi.
- Seçilen oyundan takvim formuna otomatik kapak/meta çekme butonu eklendi.
- Takvim kayıtlarında oyun adı, bölüm bilgisi ve kapak daha temiz gösterilir hale getirildi.
- Supabase schema.sql FIX 7 için güncellendi.
- site_calendar_events tablosuna game_title, episode_number, episode_title ve raw_meta alanları eklendi.
- API takvim kayıtları yeni alanları okuyacak/kaydedecek şekilde güncellendi.
- Gelecek güncelleme planından FIX 7 ile tamamlanan maddeler çıkarıldı.

## Test
- `node --check src/main.js`
- `node --check api/index.js`
- `npm run build`


---

## v2.2.0 FIX 8

# v2.2.0 FIX 8 - Profesyonel Panel + İstek/Hata Sistemi

## Tamamlananlar
- Oyun Arşivi kartlarının sayfa dışına taşması engellendi.
- Oyun Arşivi ve Seriler sayfasında kartlar dolunca alt satıra geçecek şekilde düzenlendi.
- Yönetim Paneli > Oyunlar içinde Oyun Ekle ve Mevcut Oyunlar ayrı sekmelere ayrıldı.
- Oyun ekleme formu iki kolonlu, sağ kapak önizlemeli ve daha profesyonel hale getirildi.
- Oyun ekleme formuna Tamamlanan Seriler, Devam Eden Seriler ve Yakında Gelecek Seriler hızlı durum butonları eklendi.
- Oyun ekleme formuna Türkçe tür önerisi butonu eklendi.
- Yönetim Paneli > Seri İzleme içine arama kutusu, seri seçme butonları ve kapaklı seri içi sıralama eklendi.
- Yayın Takvimi yönetiminde sadece devam eden oyunların seçilmesi sağlandı.
- Yayın Takvimi kayıtlarına düzenleme ve silme butonları eklendi.
- Güncelleme Notları ve Bakım Modu yönetim menüsüne geri alındı.
- Bakım modu yönetimi daha profesyonel önizlemeli hale getirildi.
- Oyun İstekleri kategorisi eklendi.
- Hata Bildir kategorisi eklendi.
- Yetkililer için Yönetim Paneli içinde Oyun İstekleri ve Hata Bildirimleri görüntüleme alanı eklendi.
- Supabase tarafına `site_game_requests` ve `site_bug_reports` tabloları eklendi.


---

## v2.2.0 FIX 9

# v2.2.0 FIX 9 Tamamlananlar

- Mevcut oyun düzenleme akışı düzeltildi.
- Yayın takvimi düzenle/sil akışı temizlendi.
- Bakım modu yüzde ve güncelleme notu alanları eklendi.
- Bakım önizlemesi yönetim panelinde gösterildi.
- Serileri sıralama sürükle-bırak otomatik kayıt sistemine çevrildi.
- Supabase schema FIX 9 olarak güncellendi.


---

## v2.2.0 FIX 9 SCHEMA FIX

# v2.2.0 FIX 9 SCHEMA FIX

## Düzeltilen Hata
- Supabase `schema.sql` çalıştırırken çıkan `column "written" of relation "site_update_notes" does not exist` hatası düzeltildi.
- `site_update_notes` insert satırı artık `written` yerine mevcut tablo yapısındaki `note` kolonunu kullanır.
- `schema_version` mesajı `v2.2.0 FIX 9 SCHEMA FIX` olarak güncellendi.

## Not
Bu paket yeni özellik güncellemesi değildir; sadece FIX 9 içindeki SQL hatasını düzeltir.


---

## v2.2.0 FIX 10

# v2.2.0 FIX 10 - Düzenleme + Kompakt Arşiv + İstek/Hata Fix

Bu paket yeni büyük sürüm değildir. v2.2.0 hattındaki stabilizasyon fixidir.

## Tamamlananlar
- Mevcut oyunlarda Düzenle butonu güçlendirildi.
- Düzenleme formu ayrı sekmede daha profesyonel hale getirildi.
- Oyun ekleme ve mevcut oyun düzenleme formuna detaylı "Hikayeyi Tekrar Çek" butonu eklendi.
- "Türleri Türkçe Öner" yerine "Türleri Tekrar Çek" mantığı eklendi.
- Oyun adına göre Türkçe türler forma otomatik yazılır.
- Oyun arşivi kartları kompakt hale getirildi; yan yana sığmayınca alt satıra geçer.
- Seriler ekranı kompakt, alfabetik şeritli ve kapaklı hale getirildi.
- Oyun İstekleri sayfası daha profesyonel forma ve listeye alındı.
- Hata Bildir sayfası daha profesyonel forma ve listeye alındı.
- Yönetim panelindeki Oyun İstekleri ve Hata Bildirimleri panelleri durum seçilebilir hale getirildi.
- Supabase schema.sql FIX 10 mesajı ve gerekli ek kolonlarla güncellendi.

## Test
- `node --check src/main.js`
- `node --check api/index.js`
- `npm run build`


---

## v2.2.0 FIX 11

# v2.2.0 FIX 11 Tamamlananlar

- Oyun Arşivi 4 kolon grid yapısına geçirildi.
- Oyun Arşivi alfabetik sıralama ve Harfe Git ile düzenlendi.
- Seriler sayfası 4 kolon profesyonel kartlara çevrildi.
- Oyun Ekle formu her açılışta boş gelecek şekilde ayarlandı.
- Mevcut oyun düzenleme ayrı modal/pencere yapısına taşındı.
- Hikaye/Açıklama ve Bölüm Listesi alanları daha profesyonel hale getirildi.
- Oyun İste ve Hata Bildir ekranları yenilendi.
- Bakım modu, kullanıcıya logo ve kanal kapak görselli profesyonel ekran olarak gösterilecek hale getirildi.


---

## v2.2.0 FIX 12

# v2.2.0 FIX 12 - Kart, Form, Hikaye ve İstek/Hata Fix

Bu paket yeni büyük güncelleme değildir; v2.2.0 hattında stabil fix paketidir.

## Tamamlananlar
- Oyun Arşivi kartlarında yazıların kesilmesi düzeltildi.
- Seriler kartlarında yazıların kesilmesi düzeltildi.
- Oyun Arşivi 4 kolon profesyonel grid yapısında tutuldu.
- Seriler 4 kolon profesyonel grid yapısında tutuldu.
- Oyun Arşivi'ne Tamamlanan / Devam Eden / Yakında durum butonları eklendi.
- Seriler sayfasına Tamamlanan / Devam Eden / Yakında durum butonları eklendi.
- Alfabetik Harfe Git şeridi korundu.
- Hikayeyi Tekrar Çek butonu formu silmeden çalışacak şekilde düzeltildi.
- Türleri Tekrar Çek butonu formu silmeden Türkçe türleri forma yazacak şekilde düzeltildi.
- A Way Out gibi oyunlarda detaylı Türkçe hikaye formatı güçlendirildi.
- Oyun ekleme formunda butonlara basınca formun sıfırlanması engellendi.
- Oyun İste metin kutusu daha profesyonel hale getirildi.
- Hata Bildir metin kutusu daha profesyonel hale getirildi.


---

## v2.2.1

# v2.2.1 Tamamlananlar

- Oyun isteklerinde yetkili durum değiştirme: Yeni, İnceleniyor, Eklendi, Reddedildi.
- Hata bildirimlerinde durum değiştirme ve çözüm notu ekleme.
- Yayın takviminde Ay / Hafta / Gün görünümü arasında gerçek geçiş.
- Seri sıralamada sürükle-bırak ile sıra değiştirme ve otomatik kayıt.
- Arşiv kartlarında kullanıcıya özel görünüm ayarları: kompakt, detaylı, poster ve yatay kart.
- Hikayeyi spoiler olmadan çekme butonu.
- Supabase schema v2.2.1 güncellemesi.


---

## v2.2.1 FIX 1

# v2.2.1 FIX 1 - Kompakt Kart Görünüm Düzeltmesi

## Tamamlananlar
- Kompakt görünüm modunda oyun kartlarının görünmemesi/bozulması düzeltildi.
- Eski `grid` localStorage değeri otomatik `compact` görünümüne çevrildi.
- Oyun Arşivi kartları 4 kolon profesyonel yapıya sabitlendi.
- Seriler kartları 4 kolon profesyonel yapıya sabitlendi.
- Küçük ekranlarda kartlar otomatik 3 / 2 / 1 kolona düşer.
- Kart kapakları, başlıklar, açıklamalar, etiketler ve buton alanları görünür hale getirildi.


---

## v2.2.2

# v2.2.2 Tamamlananlar

- Oyun türü önerileri RAWG ve yerel Türkçe doğrulama sözlüğüyle güçlendirildi.
- Takvim kayıtlarına hatırlatıcı ekleme altyapısı eklendi.
- Kullanıcı arşiv görünüm tercihleri Supabase profiline kaydedilecek şekilde hazırlandı.
- Seri sıralama değişiklikleri için işlem geçmişi ekranı eklendi.
- Oyun istekleri ve hata bildirimleri için filtreli rapor ekranı eklendi.
- Spoilersız hikaye butonu kaldırıldı.
- Hikayeyi Tekrar Çek artık oyunla ilgili daha doğru Türkçe hikaye/bilgi metni yazar.


---

## v2.2.3

# v2.2.3 Tamamlananlar

- Hatırlatıcıların e-posta/tarayıcı bildirimi altyapısı.
- Seri sıralama geçmişinde geri alma.
- Oyun isteklerinden tek tıkla oyun ekleme.
- Hata bildirimlerine ekran görüntüsü yükleme.
- Yönetim panelinde AI ile site üzerinden versiyon versiyon özellik ekleme.


---

## v2.2.3 FIX 1

# v2.2.3 FIX 1 - Tamamlananlar

- Açılışta çıkan `submitBugReportFix8 is not defined` hatası giderildi.
- Kompakt kart görünümü geri getirildi ve bozulmaya karşı stabilize edildi.
- Yakında olan oyun/serilerin gri ve tıklanamaz görünümü korundu.
- AI Özellik Merkezi yönetim panelinde net şekilde görünecek hale getirildi.
- Schema version mesajı v2.2.3 FIX 1 olarak güncellendi.


---

## v2.2.3 FIX 2

# v2.2.3 FIX 2 - Tamamlananlar

- Oyun ekleme formu stabil hale getirildi.
- Form butonlarının formu silmesi/sıfırlaması engellendi.
- AI Özellik Merkezi yeni buton hatası düzeltildi.
- AI özellik uygulama geçmişi güvenli local kayıt mantığıyla güçlendirildi.
- Build testi başarılı tamamlandı.


---

## v2.2.3 FIX 3

# v2.2.3 FIX 3

- Maximum call stack açılış hatası düzeltildi.
- AI Özellik Ekle, yönetim panelinde ayrı buton/sayfa haline getirildi.
- Oyun Ekle formu stabil hale getirildi.
- Oyun ekleme ile AI özellik sistemi birbirinden ayrıldı.


---

## v2.2.3 FIX 4

# v2.2.3 FIX 4 Tamamlananlar

- Seri sıralama üst butonlu eski düzene alındı.
- Seri seçme ve seri içi kapaklı sıralama eklendi.
- AI Özellik Ekle paneli iki butonlu akışa çevrildi.
- Yeni Özellik Önerileri her zaman 10 öneri gösterecek hale getirildi.
- Siteye Uygulandı geçmişi ayrı tutuldu.
- Supabase AI özellik uygulama tablosu aktarım durumu alanlarıyla genişletildi.


---

## v2.2.3 FIX 5

# v2.2.3 FIX 5

## Tamamlananlar
- Vercel 404 NOT_FOUND hatası için vercel.json düzeltildi.
- SPA fallback route eklendi/güçlendirildi.
- Vite base ve output ayarları sabitlendi.
- .vercelignore dosyası güncellendi.
- Vercel kurulum notu eklendi.


---

## v2.2.3 FIX 9

# v2.2.3 FIX 9 - Oyun Ekle Stabil + AI Ayrı Sayfa

- `v223FixAdminGames is not defined` açılış/yönetim paneli hatası giderildi.
- Oyun Ekle ekranı sadece oyun ekleme ve mevcut oyun düzenleme için bırakıldı.
- AI Özellik Ekle yönetim panelinde ayrı sayfa olarak sabitlendi.
- Admin panelde Oyunlar gövdesi güvenli helper ile çalışacak hale getirildi.
- Build testi başarılı geçti.

---

# v2.2.4 - AI SQL Onay + Deploy Kontrol + Rapor Panelleri

## Tamamlananlar
- AI Özellik Ekle panelinden oluşturulan SQL taslakları için ayrı onay ekranı eklendi.
- GitHub / Vercel / Supabase deploy kontrol listesi yönetim paneline eklendi.
- Seri sıralama geçmişi büyütüldü ve eski sıraya dönme alanı daha görünür hale getirildi.
- AI önerilerinde uygulanmış özellikler kategori bazlı filtrelenebilir hale getirildi.
- Yönetim paneline gelen oyun istekleri görünür rapor ekranı eklendi.
- Yönetim paneline gelen hata raporları görünür rapor ekranı eklendi.
- GELECEK GÜNCELLEMELER dosyası 15 sıralı sürüm planı içerecek şekilde güncellendi.
- Supabase schema.sql v2.2.4 tabloları ve kolonlarıyla güncellendi.

# v2.2.5 - Güncelleme Paketi
- SQL taslaklarına otomatik syntax kontrolü eklendi.
- Deploy hatalarını otomatik tanı ekranı eklendi.
- Uygulanan AI özelliklerinde arama kutusu eklendi.
- Kullanıcıların eklediği oyun istekleri ve hata raporları için silme eklendi.
- Kullanıcıların gönderdiği oyun istekleri ve hata raporlarının yönetim paneline Supabase + local kayıt olarak düşmesi güçlendirildi.
- Oyun isteğinden otomatik kapaklı oyun oluşturma sihirbazı eklendi.

# v2.4.0 - Tüm Yeni Özellikler Stabil Paket

## Tamamlananlar
- v2.2.6 - v2.4.0 arası tüm planlanan yeni özellikler tek stabil pakette modüler olarak eklendi.
- Takvim kayıtları için bildirim kuyruğu, tarayıcı bildirimi ve e-posta kuyruğu test paneli eklendi.
- Takvimde ay/hafta/gün görünümü, tarih aralığı ve kategori filtresi eklendi.
- Seri sıralama geçmişi için görsel karşılaştırma ve geri alma paneli eklendi.
- Kullanıcı tema, kart yoğunluğu ve mobil görünüm tercihleri eklendi.
- Oyun istekleri ve hata raporları için filtre, öncelik, yetkili atama, CSV/JSON dışa aktarma ve çözüm şablonu altyapısı eklendi.
- Bakım ekranına yüzde, tahmini süre, kullanıcıya açık notlar ve yol haritası önizlemesi eklendi.
- AI Özellik Merkezi; kategori şablonları, risk/etki puanı, uygulanan özellik filtresi ve kullanıcıya açık özet ile genişletildi.
- GitHub/Vercel deploy merkezi ve başarısızlık kontrol listesi eklendi.
- Supabase schema geçmişi, zaman çizelgesi ve kontrol raporu ekranı eklendi.
- Role göre yönetim kısayolları ve tam sistem sağlık kontrol paneli eklendi.

# v2.4.0 FIX 3 - Supabase Dinamik + Kompakt Arşiv Geri Yükleme
- Ultra statik deploy paketinde kaybolan Supabase dinamik oyun okuma sistemi geri getirildi.
- Demo/rastgele varsayılan oyun gösterimi kapatıldı.
- Oyun Arşivi ve Seriler kompakt kart yapısı 4 kolon olarak geri yüklendi.
- Yakında kartlarının gri ve tıklanamaz davranışı korundu.
- Tamamlanan / Devam Eden / Yakında filtreleri Supabase kayıtlarına göre çalışacak şekilde sabitlendi.
- v2.4.1 - v2.5.5 arası 15 gelecek sürüm planı GELECEK GÜNCELLEMELER.md içine yazıldı.


# v2.4.0 FIX 4 - Hızlı Deploy + Supabase Versiyon Takibi
- Vercel install/build beklemesini azaltmak için hazır dist ile hızlı deploy yapısı eklendi.
- package.json bağımlılıksız hale getirildi; Vercel yine install çalıştırsa bile indirme yapmaz.
- Gerçek kaynak kodu src/api içinde korundu, geliştirme için package.dev.json eklendi.
- Supabase schema_version her fix/sürümde güncellenecek şekilde v2.4.0 FIX 4 mesajı eklendi.
- Oyun arşivi/seriler kompakt Supabase dinamik yapı korunarak hız optimizasyonu yapıldı.


# v2.4.0 FIX 5 - Kompakt Kart + Bakım Geri Sayım

- Oyun Arşivi kompakt kartları biraz büyütüldü.
- Seriler kompakt kartları biraz büyütüldü.
- Masaüstünde 4 kart yan yana kalacak şekilde grid düzeltildi.
- Görünüm değiştirirken hata veren butonlar güvenli hale getirildi.
- Bakım modu yüzdelik görünümü profesyonelleştirildi.
- Bakım moduna açılış günü/saat geri sayımı eklendi.
- Supabase schema_version v2.4.0 FIX 5 olarak güncellendi.


# v2.4.0 FIX 6 - Redeploy + AI/Supabase Tanı Merkezi

- Yönetim paneline site içi Redeploy / AI Tanı merkezi eklendi.
- GitHub yüklendi, Vercel redeploy, Supabase schema uygulandı durumları panelden takip edilebilir.
- Vercel Deploy Hook URL varsa panelden redeploy tetiklenebilir.
- AI özelliklerini tanıma ve Supabase registry kaydı eklendi.
- Yeni tablo / SQL geri bildirimi için yönetim paneli alanı eklendi.
- Supabase schema.sql v2.4.0 FIX 6 olarak güncellendi.


# v2.4.0 FIX 7 - Otomatik AI Tanı + Hata Düzeltme Merkezi
- Yönetim paneli butonları güçlendirildi.
- Bakım tarihi gün.ay.yıl formatına sabitlendi ve geri sayım profesyonelleştirildi.
- AI/GitHub/Vercel/Supabase tanı akışı hook girmeden otomatik işleme alındı.
- Hata yazınca otomatik tanı ve düzeltme planı merkezi eklendi.
- Meta + Kapak Çek bilinen oyunlarda doğru başlık/kapak/tarih/tür önceliğiyle düzeltildi.


# v2.4.0 FIX 8 - Stabil Yönetim Paneli + Takvim Fix
- Yönetim panelindeki çalışmayan butonlar güvenli hale getirildi.
- Bilinmeyen API action hatası için eksik endpointler eklendi.
- Yayın Takvimi ekle/düzenle/sil akışı stabil hale getirildi.
- Bakım tarihi gün.ay.yıl saat:dakika formatına sabitlendi.
- Yönetim paneli rehberi eklendi.

# v2.4.0 FIX 9 - Kapak ve Bakım Notları Fix

- Meta + Kapak Çek işleminin rastgele arcade/varsayılan görsel göstermesi engellendi.
- Bilinen oyunlarda doğru başlık, tür, çıkış tarihi ve kapak eşleştirmesi güçlendirildi.
- Güvenilir kapak bulunamazsa var olan kapak korunur veya kapak alanı boş bırakılır.
- Bakım modu güncelleme notları kullanıcı ekranında görünür hale getirildi.
- Bakım modu kayıtlarında `updates`, `notesText`, `notes` ve `publicNotes` alanları birlikte yazılır.
- Supabase schema_version v2.4.0 FIX 9 olarak güncellendi.


# v2.4.0 FIX 11
- seriesGroups açılış hatası düzeltildi.
- Kapak Bul ve Seç paneli eklendi; bulunan kapaklardan manuel seçim yapılır.
- Meta + Kapak Çek yanlış arcade/genel görseli basmaz, güvenilir kapak seçtirir.
- AI Özellik Ekle paneline AI Özellik Yenile, hedef versiyon seçimi, uygulananı sil ve nereye eklendiyse git akışı eklendi.


# v2.4.0 FIX 12
- AI Özellik Ekle > Yeni Özellik Önerileri bölümüne her kart için Öneri Değiştir butonu eklendi.
- Beğenilmeyen öneri listeden çıkarılır ve yerine yeni öneri gelir.
- Liste 10 öneriden fazla uzamaz.
- 10 Öneriyi Değiştir butonu eklendi.
- Siteye Uygulandı işlemi seçilen hedef versiyonla güncelleme notu/local changelog akışına işlenir.
- Hazır dist yeniden build edildi.

# v2.4.0 FIX 13 - AI Yeni Öneriler + Redeploy Güncelleme Fix
- Redeploy / AI Tanı Merkezi içindeki Yeni Güncellemeleri Otomatik Ara butonu düzeltildi.
- Üst durum kartları artık sayfa yenilemeden Başarılı/Bekliyor durumunu doğru gösterir.
- AI Özellik Ekle ekranına Yeni Öneriler Öner alanı eklendi.
- Kategori seçip yeni öneri üretme desteği eklendi.
- Seçilen yeni güncelleme versiyonu AI önerilerine ve güncelleme notu akışına senkron bağlandı.
- FIX12 eski offset anahtarı çakışması giderildi; öneriler artık gerçekten değişir.
- Hazır dist assetleri güncellendi.


## v2.4.0 FIX 14 - Stabil Kapak + AI Uygula + Versiyon Senkron Fix
- Üst bar ve sol yönetim logosundaki sürüm yazısı artık `Yeni güncelleme versiyonu` alanıyla senkron.
- Yeni Güncellemeleri Otomatik Ara tepe kartlarını, AI önerilerini ve son durum metnini birlikte yeniler.
- Alan Wake American Nightmare ayrı oyun olarak tanındı; Alan Wake Remastered ile karışması düzeltildi.
- Kapak seçici 20 adaya kadar görsel gösterir; Steam/RAWG/API sonuçları tek listede birleşir.
- AI Siteye Uygula akışı uygulananlar listesine, local özellik durumuna, güncelleme notu taslağına ve Supabase denemesine bağlandı.
- Nereye Eklendiyse Git hedef panel eşleştirmesi güçlendirildi.

# v2.4.0 FIX 15 - Temiz Sürüm + Özellik Yaz / AI Uygula

- Site adının yanında görünen FIX etiketi kullanıcı arayüzünden kaldırıldı; üst logo ve sol yönetim adı artık sadece seçilen sürümü gösterir.
- Deploy Merkezi içine küçük **Sadece son sayı** kutusu eklendi. Örneğin kutuya `2` yazınca sürüm `v2.4.2` olarak güncellenir.
- AI özellik alanına **Özellik Yaz** bölümü eklendi. Yönetici isteğini normal cümleyle yazar, sistem hedef sayfayı ve nasıl uygulanacağını önerir.
- **Öneriyi Siteye Uygula ve Yenile** butonu eklendi. Özellik uygulananlar listesine, güncelleme notuna ve ilgili yönetim sayfasına işlenir; ardından F5 yenileme yapılır.
- Uygulanan özel özellikler hedef sayfada **AI ile Bu Alana Eklenen Özellikler** kartı altında görünür.
- Kapak/oyun/meta gibi yazılan istekler ilgili özellik anahtarlarını otomatik aktif eder.


## v2.4.0 FIX 16 - Public Sürüm Temizleme
- Üst site adındaki `public sürüm + paket FIX` birleşimi temizlendi.
- Sürüm güncelleme sonrası sadece kullanıcının seçtiği sürüm gösterilir.
- Sol yönetim başlığı ve AI/Deploy paneli aynı temiz sürümle senkron çalışır.

## v2.4.0 FIX 17 - Özellik Yaz Plan Sürümü Otomatik Algılama

- Özellik Yaz alanında yazılan `v2.4.3 Planı` gibi sürümler algılandı.
- Site sürümü, öneri sürümü ve uygulanan özellik kaydı tek public sürüme bağlandı.
- FIX etiketi kullanıcı arayüzünden gizli tutuldu.
- F5 sonrası algılanan sürüm korunacak şekilde local sürüm anahtarları güncellendi.


## v2.4.0 FIX 18 - Oyun Durum Butonları Stabil
- Oyun güncelle ekranındaki Tamamlanan / Devam Eden / Yakında butonları stabil hale getirildi.
- Seçilen durum edit formunda kaybolmadan tutulur ve Oyunu Güncelle ile kaydedilir.
- Yeni oyun formunda durum seçimi draft verisine yazılır.


## v2.4.0 FIX 20 - Vercel Building Skip / Hazır Dist Deploy

- Vercel `Building...` bekleme sorunu için install ve Vite build aşaması hafifletildi.
- Hazır `dist` klasörü Vercel çıktısı olarak kullanılacak hale getirildi.
- `fix20-static` asset yolları eklendi.
- Deploy öncesi dosya kontrol scripti eklendi.


## v2.4.0 FIX 24 - AI + Deploy Kod Temizliği
- AI ile özellik yazma, önerme, uygulama ve hedef panel kayıtları doğrudan kaldırıldı.
- Deploy / Redeploy / GitHub / Vercel yönetim butonları, sayfaları ve API aksiyonları silindi.
- Eski pasifleştirme/uyarı mantığı kaldırıldı; yönetim paneli sade hale getirildi.
- Eski localStorage kayıtları açılışta temizlenir.


## v2.4.0 FIX 25 - Site Açılış Import Fix
- FIX24 sonrası sitenin `Site yükleniyor...` ekranında kalmasına sebep olan `dist` JS içindeki `import './styles.css';` satırı temizlendi.
- `dist/index.html` doğrudan `hayatimiz-app-fix25.js` ve `hayatimiz-style-fix25.css` dosyalarına bağlandı.
- Vercel hazır dist kontrolü artık CSS import kalıntısını yakalar.
- AI ve Deploy/Redeploy temizlikleri korunur.

---

## v2.4.0 FIX 26

- Oyun Ekle ve Mevcut Oyunu Düzenle ekranları profesyonel editör yapısına alındı.
- Kapak/meta/hikaye/playlist çekince sayfanın üste atlama sorunu düzeltildi.
- `Kapakları Getir` butonu gerçek action bağlantısıyla çalışır hale getirildi.
- Oyun güncelleme sonrası form aynı yerde kalır; düzenlemeye devam edilebilir.
- Yayına almadan önce localde görmek için `03-VSCode-Localhost-Onizleme.bat` eklendi.

---

## v2.4.0 FIX 27 - Schema Duplicate Key Fix

- Supabase `schema.sql` tekrar çalıştırıldığında çıkan `duplicate key value violates unique constraint site_update_notes_version_title_unique_idx` hatası giderildi.
- `site_update_notes` kayıtları artık aynı `version + title` ile tekrar çalıştırıldığında hata vermez, mevcut kayıt güncellenir.
- Özellikle `v2.4.0 FIX 22 - AI Özellik Sistemi Kaldırıldı` kaydı için tekrar çalıştırma güvenli hale getirildi.
- Schema dosyasına FIX27 çalışma kaydı eklendi.


## v2.4.0 FIX 28 - Açılış ReferenceError Stabil Fix

- Site açılışında görülen `ho240DeployCenter is not defined` hatası düzeltildi.
- AI/Deploy kaldırma sonrası kalan eski referanslar güvenli tanımlandı.
- FIX26 oyun editörü ve local önizleme özellikleri korundu.
- Hazır `dist` dosyaları FIX28 olarak güncellendi.

## v2.4.0 FIX 30 - Kayıt ve Buton Stabilizasyonu

- Yönetim panelindeki kayıt kaydetme ve durum değiştirme butonları güvenli hale getirildi.
- Oyun istekleri / hata bildirimleri Supabase hatasında paneli bozmaz; local kayıt korunur.
- Oyun düzenle ve sil butonları ek yakalama katmanına alındı.
- Form içi butonların yanlışlıkla kayıt/submit tetiklemesi engellendi.
- Oyun durumu sadece formda değişir, kaydetmeden Supabase’e gitmez.


## v2.4.0 FIX 31 - Oyun Listesi Kaybolma Koruması
- Oyunların Supabase/API hatasında boş görünmesi engellendi.
- games-list endpointine kolon farkı fallback sorguları eklendi.
- Son sağlam oyun listesi local cache ile korunur.
- Hazır Vercel dist dosyaları FIX31 olarak güncellendi.


## v2.4.0 FIX 32 - Oyun tıklama stabil fix
- Oyun kartına tıklayınca oluşan `Maximum call stack size exceeded` hatası giderildi.
- Tür üretme fonksiyonundaki sonsuz döngü kaldırıldı.
- Eski FIX31 asset dosyası da cache uyumluluğu için yamalandı.

## v2.4.0 FIX 33 - Oyun Adı Kilitli Meta / Kapak Çekme
- Meta + Kapak Çek artık yazılan oyun adını kilitler.
- Benzer oyun adı yüzünden farklı oyun kapağı/meta bilgisi çekilmesi engellendi.
- Kesin eşleşme yoksa yanlış kayıt yapılmaz; manuel kapak alanı korunur.

## v2.4.0 FIX 35
- Kapakları Getir butonu düzeltildi; yerel katalog/API/Steam yedek kapak adayları birleşik çalışır.
- Kapak seçimi oyun adını değiştirmez, sadece kapak ve eksik meta alanlarını forma işler.
- Seri Sıralama Merkezi üstte seri kartları, altta seçilen seri detayı olacak şekilde profesyonelleştirildi.


## v2.4.0 FIX 36 - Tüm Kapakları Getir + Çıkış Tarihi
- Kapakları Getir eksik sonuç sorunları düzeltildi.
- Alan Wake gibi seri aramalarında tüm seri kapakları çıkış tarihleriyle listelenir.
- Kapak seçimi oyun adını değiştirmez ve kayıt sadece Kaydet/Güncelle ile yapılır.


## v2.4.0 FIX 39 - Seri Sıralama Sürükle Bırak Görünür

- Seri İzleme ekranındaki eski liste görünümü sürükle bırak satırlarına çevrildi.
- Sol tarafa belirgin **⠿ Sürükle** tutacağı eklendi.
- Sıra değişikliği otomatik kayıt yapmaz; kalıcı kayıt için kaydet butonu kullanılır.


## v2.4.0 FIX 42 - Profesyonel Temizlik + İçerik Kontrol + Çıkış Tarihi Fix

- AI / Deploy / Redeploy kalıntıları temiz tutuldu.
- Yönetim paneline profesyonel Dashboard ve İçerik Kontrol ekranı eklendi.
- Oyun formu veri çekme ve kayıt alanları olarak ayrıldı.
- Tüm Bilgileri Çek, Kapakları Getir, Çıkış Tarihini Çek, Türleri Çek, Açıklama Çek ve Playlist Bölümleri Çek butonları stabilize edildi.
- Çıkış tarihi çekme sistemi yerel katalog + Steam + RAWG + internet araması ile güçlendirildi.
- Kapak seçici kaynak, eşleşme yüzdesi, DLC etiketi ve çıkış tarihi gösterecek şekilde geliştirildi.
- Çekme butonları Supabase'e otomatik kayıt yapmaz; kayıt sadece Oyunu Kaydet / Oyunu Güncelle ile yapılır.
- Kontroller: node --check src/main.js, node --check api/index.js, npm run build başarılı.


## FIX43 - Yeni Arayüz Güncellemesi
- Referans ekrana daha yakın üst menü, yan menü ve ana sayfa vitrini eklendi.
- Hero banner, istatistik kartları, öne çıkan oyunlar ve devam eden seriler alanı modernleştirildi.


## FIX44 - Vercel Build Hatası
- FIX43 arayüzü korundu.
- Vercel build kontrol scripti FIX44 assetlerine göre düzeltildi.
- Deploy sırasında görünen Error sorunu için dist/index ve asset bağlantıları güncellendi.


## FIX45 - Panel, Rapor ve Çıkış Tarihi
- Yönetim paneli akordeon aç/kapat, bildirim çubuğu, işlevli raporlar, Oyun İste/Hata Bildir menüleri ve çıkış tarihi forma işleme düzeltildi.


## FIX46 - Oyun Yönetimi ve Güncelleme Notları
- Eksik Alanlar kartlarına tıklayınca oyun doğrudan düzenleme formunda açılır.
- Mevcut Oyunlar ve Oyun Ekle yönetim panelinde ayrı kategoriye ayrıldı.
- Türler ve etiketler ayrı alanlara taşındı.
- Oyun ekleme/düzenleme butonları daha stabil hale getirildi.
- Ayarlar ve Güncelleme Notları sayfaları profesyonelleştirildi.
- Kullanıcılar için Güncelleme Notları sayfası eklendi.


## v2.4.1 FIX47 - Bakım, Güncelleme Notları ve Modal Düzenleme
- Sürüm tüm yeni arayüzlerde v2.4.1 olarak sabitlendi.
- Eksik Alanlar ve Düzeltilecek Kayıtlar bölümünde oyunlar ayrı düzenleme penceresinde açılır.
- Bakım modu yönetim paneli daha profesyonel yapıldı.
- Kullanıcı bakım ekranı animasyonlu, yüzde göstergeli ve güncelleme notlu hale getirildi.
- Güncelleme notları admin ve kullanıcı tarafında daha profesyonel timeline/gösterim yapısına taşındı.
