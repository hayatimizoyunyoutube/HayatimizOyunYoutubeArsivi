# GELECEK GÜNCELLEMELER

Proje çizgisi: **Hayatımız Oyun v2.4.1 sonrası**.

Bu dosya yalnızca bundan sonra yapılacak planları içerir. Tamamlanan FIX kayıtları ve geçmiş teknik notlar ayrı dosyalarda tutulur. Bundan sonraki geliştirmelerde site içinde otomatik özellik yazan yapay zekâ modülü, deploy/redeploy merkezi veya GitHub/Vercel kontrol paneli geri getirilmeyecek. Güncellemeler kullanıcı isteğine göre ZIP paketleriyle hazırlanacak.

---

## Genel Geliştirme Kuralları

- Public sürüm etiketi kullanıcı tarafında yalnızca gerçek sürüm olarak görünecek: örnek **v2.4.1**, **v2.4.2**, **v2.5.0**.
- FIX numarası kullanıcı arayüzünde gösterilmeyecek; sadece geliştirici notlarında ve ZIP dosya adlarında kalacak.
- Oyun ekleme/düzenleme ekranındaki veri çekme butonları hiçbir zaman otomatik kayıt yapmayacak.
- Supabase kaydı yalnızca **Oyunu Kaydet** veya **Oyunu Güncelle** butonuyla yapılacak.
- Kapak, tür, tarih, hikaye ve playlist çekme işlemleri sadece formu dolduracak.
- Oyun adı kullanıcı tarafından yazıldıysa çekme işlemleri oyun adını değiştirmeyecek.
- DLC kayıtları ana oyunla karıştırılmayacak.
- Form açıkken bildirim, toast veya kısa süreli render işlemleri formu sıfırlamayacak.
- Yeni planlarda otomatik kod yazan sistem olmayacak; manuel ve kontrollü ZIP güncelleme akışı korunacak.

---

## v2.4.2 Planı - Çıkış Tarihi ve Veri Doğrulama Sürümü

Amaç: Oyunların ve DLC kayıtlarının çıkış tarihlerini daha güvenilir hale getirmek.

### Planlananlar

- Çıkış tarihi için daha geniş yerel kesin katalog oluşturulacak.
- DLC / Expansion / Remastered / Complete Edition ayrımı güçlendirilecek.
- Ana oyun ve DLC tarihi birbirine karışmayacak.
- Örnek düzeltmeler:
  - Avatar: Frontiers of Pandora ana oyun: 07.12.2023
  - Avatar: Frontiers of Pandora DLC: The Sky Breaker: 16.07.2024
  - Avatar: Frontiers of Pandora DLC: Secrets of the Spires: 28.11.2024
  - Alan Wake II: Night Springs: 08.06.2024
  - Alan Wake II: The Lake House: 22.10.2024
- Çıkış tarihi çekme ekranında kaynak bilgisi gösterilecek.
- Tarih çekildikten sonra formda eski yanlış değer kalmayacak.
- Hatalı tarih tespiti için yönetim panelinde ayrı kontrol listesi eklenecek.
- Tarihi eksik oyunlar tek tıkla düzenleme formuna açılacak.

---

## v2.4.3 Planı - Profesyonel Oyun Formu Sürümü

Amaç: Oyun ekleme ve mevcut oyun düzenleme ekranlarını daha hızlı, stabil ve anlaşılır hale getirmek.

### Planlananlar

- Oyun ekleme formunda daha görünür **Formu Sıfırla** alanı olacak.
- Form sıfırlama işlemi kayıt yapmadan sadece yeni oyun formunu temizleyecek.
- Mevcut oyun düzenleme formunda üstte, ortada ve altta erişilebilir **Oyunu Güncelle** butonları korunacak.
- Form içindeki veri çekme butonları tek bir profesyonel panel altında toplanacak:
  - Tüm Bilgileri Çek
  - Kapakları Getir
  - Çıkış Tarihini Çek
  - Türleri Çek
  - Detaylı Hikaye Çek
  - Playlist Bölümleri Çek
- Türler ve etiketler ayrı ayrı yönetilecek.
- Etiketler chip/kapsül sistemiyle eklenip silinebilecek.
- Tür listesi hazır butonlardan seçilecek, manuel giriş de korunacak.
- Formdaki canlı önizleme daha büyük ve daha okunabilir yapılacak.
- Kayıt sonrası formun kapanıp kapanmaması yönetici tercihine bağlanacak.

---

## v2.4.4 Planı - Kapak Yönetimi Sürümü

Amaç: Oyun kapaklarını daha doğru ve daha fazla seçenekle yönetmek.

### Planlananlar

- Kapak seçici daha büyük modal pencerede açılacak.
- Kapak kartlarında şu bilgiler gösterilecek:
  - Kapak görseli
  - Oyun/DLC adı
  - Kaynak
  - Çıkış tarihi
  - Eşleşme oranı
  - Ana oyun / DLC etiketi
- Yanlış kapak seçimini azaltmak için oyun adı kilidi korunacak.
- Manuel kapak URL alanı daha görünür olacak.
- Kapak seçildiğinde yalnızca kapak ve güvenilir meta alanları forma işlenecek.
- Oyun adı kapak seçimiyle değişmeyecek.
- Kapak bulunamadıysa yedek görsel yerine kullanıcıya manuel URL önerisi gösterilecek.

---

## v2.4.5 Planı - Bakım Modu ve Güncelleme Notları Sürümü

Amaç: Kullanıcıya görünen bakım ekranını ve sürüm notlarını profesyonelleştirmek.

### Planlananlar

- Bakım modu yönetim panelinde ayrı kartlı tasarım olacak.
- Bakım ekranı kullanıcı tarafında animasyonlu ve modern görünecek.
- Bakım ekranında gösterilecek bilgiler:
  - Bakım başlığı
  - Bakım mesajı
  - İlerleme yüzdesi
  - Tahmini açılış zamanı
  - Güncelleme notları
  - Sistem durumu
- Güncelleme notları timeline yapısında gösterilecek.
- Admin panelinden yeni güncelleme notu eklenebilecek.
- Güncelleme notları kullanıcı tarafında temiz, teknik olmayan şekilde gösterilecek.
- FIX notları kullanıcıya gösterilmeyecek.

---

## v2.4.6 Planı - Yönetim Paneli Sağlık Merkezi

Amaç: Eksik veya hatalı kayıtları tek yerden bulup düzeltmek.

### Planlananlar

- İçerik Sağlık Merkezi geliştirilecek.
- Ayrı kontrol alanları olacak:
  - Çıkış tarihi eksik veya şüpheli oyunlar
  - Kapak eksik oyunlar
  - Tür eksik oyunlar
  - Etiket eksik oyunlar
  - Playlist/bölüm eksik oyunlar
  - Seri adı eksik oyunlar
  - Açıklaması kısa oyunlar
- Her kayıt için **Eksiği Gider** butonu ayrı düzenleme penceresi açacak.
- Toplu kontrol raporu indirilebilecek.
- Raporlar sayfası sadece sayaç değil gerçek işlem yapılabilen panele dönüşecek.

---

## v2.4.7 Planı - Seri Sistemi Geliştirme

Amaç: İzleyicilerin hangi serilerin devam ettiğini daha iyi görmesini sağlamak.

### Planlananlar

- Devam eden seriler ayrı vitrin alanına alınacak.
- Tamamlanan seriler ayrı arşiv alanında gösterilecek.
- Yakında başlayacak seriler ayrı bölüm olacak.
- Seri kartlarında toplam oyun, toplam bölüm, ilerleme yüzdesi ve sıradaki içerik gösterilecek.
- Seri sıralama sürükle bırak sistemi daha görünür hale getirilecek.
- Kaydedilmemiş sıralama değişikliği uyarısı eklenecek.
- Sıralamayı çıkış tarihine göre otomatik dizme seçeneği eklenecek.

---

## v2.4.8 Planı - Oyun İstekleri ve Hata Bildirimleri

Amaç: Kullanıcı geri bildirimlerini yönetilebilir hale getirmek.

### Planlananlar

- Oyun istekleri için durum sistemi eklenecek:
  - Yeni
  - İnceleniyor
  - Kabul edildi
  - Planlandı
  - Eklendi
  - Reddedildi
- Hata bildirimleri için durum sistemi eklenecek:
  - Yeni
  - İnceleniyor
  - Düzeltildi
  - Reddedildi
- Yönetici notu alanı eklenecek.
- En çok istenen oyunlar raporu oluşturulacak.
- İstekten direkt oyun ekleme formuna aktarım yapılabilecek.

---

## v2.5.0 Planı - Büyük Arayüz Sürümü

Amaç: Public site ve yönetim panelini daha modern, hızlı ve profesyonel yapmak.

### Planlananlar

- Ana sayfa hero alanı daha sinematik hale getirilecek.
- Oyun kartları farklı görünüm seçenekleriyle yenilenecek:
  - Kompakt
  - Detaylı
  - Poster
  - Yatay kart
- Yönetim paneli dashboard yapısı güçlendirilecek.
- Kullanıcı tarafındaki güncelleme notları ve bakım duyuruları daha şık gösterilecek.
- Mobil arayüz ayrı optimize edilecek.
- Büyük ekranlarda oyun arşivi daha verimli kullanılacak.
- Performans için asset ve cache yönetimi sadeleştirilecek.

---

## v2.5.1 Planı - Supabase ve Veri Güvenliği

Amaç: Supabase tarafında kayıtların daha güvenli yönetilmesini sağlamak.

### Planlananlar

- `schema.sql` tekrar tekrar çalıştırıldığında hata vermeyecek şekilde korunacak.
- JSONB kayıtları standart hale getirilecek.
- `site_public_version` ve `current_site_version` her sürümde doğru formatta güncellenecek.
- Oyun ekleme/güncelleme API hatalarında local veri korunacak.
- Supabase hata verirse oyun listesi boşalmayacak.
- Güncelleme notları ve bakım ayarları Supabase ile daha temiz senkronize edilecek.

---

## v2.6.0 Uzun Vadeli Plan

Amaç: Hayatımız Oyun arşivini tam profesyonel içerik yönetim sistemine dönüştürmek.

### Planlananlar

- Gelişmiş oyun arşivi filtreleri
- Seri bazlı izleme akışı
- Kullanıcı favorileri
- Bildirim merkezi
- Yayın takvimi hatırlatmaları
- İçerik sağlık puanı
- Eksik bilgi tamamlama ekranı
- Daha güçlü admin ayarları
- Sade, hızlı ve stabil public arayüz

---

## Kesinlikle Geri Getirilmeyecekler

- Site içinde otomatik özellik yazan sistem
- Otomatik siteye kod uygulayan sistem
- Panel içi deploy/redeploy merkezi
- GitHub/Vercel butonları
- Kullanıcıya görünen FIX etiketleri
- Form çekme butonlarının otomatik kayıt yapması
- Oyun adını değiştiren otomatik meta çekme davranışı

---

## Öncelik Sırası

1. Çıkış tarihi ve DLC tarih doğruluğu
2. Oyun ekle/düzenle form stabilitesi
3. Kapak seçici doğruluğu
4. Bakım modu ve güncelleme notları profesyonelleştirme
5. İçerik sağlık merkezi
6. Seri sistemi geliştirme
7. Kullanıcı istekleri ve hata bildirimi yönetimi
8. Büyük arayüz modernizasyonu
