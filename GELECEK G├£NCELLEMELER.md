## v2.4.0 FIX 41 Planı

- Seri sayfası için kullanıcı yorumları ve izleme önerileri geliştirilecek.
- Devam eden serilerde sıradaki bölüm otomatik önerisi güçlendirilecek.

# Gelecek Güncellemeler

- Seri sıralama sürükle bırak görünürlük sorunu FIX39 ile tamamlandı.
- Sonraki sürümlerde istek geldikçe oyun editörü, kapak sistemi ve seri paneli geliştirilecek.



## v2.4.0 FIX 22 - AI Özellik Sistemi Kaldırıldı
- AI ile özellik yazma, önerme, uygulama ve AI tanı panelleri kaldırıldı.
- Deploy Merkezi sade GitHub/Vercel/Supabase kontrol ekranı oldu.
- AI localStorage kayıtları ve AI API kayıt akışları pasifleştirildi.



## v2.4.0 FIX 19 - Site Yükleniyor Build/Asset Fix
- Site yükleniyor ekranında kalma sorunu düzeltildi.
- dist içindeki JS artık gerçek Vite production bundle olarak üretilir.
- Eski FIX18 asset yolu için uyumluluk dosyası eklendi.
- Vercel build/cache ayarları güncellendi.

# GELECEK GÜNCELLEMELER


# v2.4.1 Planı
- AI öneri değişim geçmişini Supabase'e kalıcı kaydetme.
- Öneri değiştirilen kartların neden değiştirildiğini not alma.
- Uygulanan AI özelliklerinin güncelleme notu önizlemesini büyütme.

Bundan sonra gelecek güncellemeler her zaman 15 sürüm sırasıyla tutulur.

Bu temiz pakette gelecek planlar tek dosyada ve 15 sürüm halinde tutulur.

Not: Bundan sonra bu dosyada her zaman 15 sıradaki versiyon tutulacak; tamamlanan sürüm TAMAMLANAN VERSİYONLAR.md içine taşınacak.

# v2.4.1 Planı
- v2.4.0 modüllerinde canlı kullanım sonrası çıkan hataları düzeltme.
- Bildirim kuyruğunu gerçek e-posta sağlayıcısına bağlama.
- Deploy Merkezi için gerçek Vercel/GitHub API log entegrasyonu.

# v2.4.2 Planı
- AI Özellik Merkezi için gerçek kod değişikliği onay akışı.
- Uygulanan özellikleri branch bazlı takip etme.
- Kullanıcı tercihlerini tüm cihazlarda eşitleme.

# v2.4.3 Planı
- Oyun arşivi kartlarında gelişmiş hızlı düzenleme.
- Supabase oyun kayıtlarında toplu doğrulama.
- Eksik kapak ve tarihleri tek ekrandan yenileme.

# v2.4.4 Planı
- Serilerde sürükle-bırak sıralama geçmişini detaylandırma.
- Seri içi eski/yeni sıralama görsel fark ekranı.
- Seri sırası geri alma işlemini güçlendirme.

# v2.4.5 Planı
- Yayın takvimi hatırlatıcılarını gerçek bildirim servislerine bağlama.
- Takvim kayıtlarını haftalık özet olarak dışa aktarma.
- Takvimde oyun/seri bazlı filtreleri genişletme.

# v2.4.6 Planı
- Kullanıcı oyun isteklerinde otomatik kapak ve tür önerisi.
- Yetkili onayından sonra tek tıkla oyun oluşturma akışını güçlendirme.
- Oyun istekleri için detaylı rapor ekranı.

# v2.4.7 Planı
- Hata raporlarında ekran görüntüsü önizlemeyi büyütme.
- Kritik/orta/düşük otomatik öncelik önerisi.
- Hata çözülünce kullanıcıya bildirim kaydı oluşturma.

# v2.4.8 Planı
- Bakım ekranı tasarım şablonları.
- Bakım modunda ilerleme yüzdesi ve kalan süreyi canlı güncelleme.
- Bakım notlarını kullanıcılara sade kartlar halinde gösterme.

# v2.4.9 Planı
- Sistem Sağlık ekranında kırık YouTube linki kontrolü.
- Supabase ENV ve API bağlantı kontrolü.
- Tek tıkla sağlık raporu oluşturma.

# v2.5.0 Planı
- AI önerilerinde risk/etki puanına göre sıralama.
- AI özellik önerilerini kategori bazlı yenileme.
- Uygulanan özellikler için geri alma notu.

# v2.5.1 Planı
- GitHub/Vercel deploy sonuçlarını panelde zaman çizelgesiyle gösterme.
- Deploy başarısız olursa düzeltme kontrol listesi üretme.
- Temiz kurulum durumunu panelden doğrulama.

# v2.5.2 Planı
- Supabase schema geçmişi için tek tık rollback notu.
- Çalıştırılan SQL sürümlerini görsel zaman çizelgesinde gösterme.
- Schema kontrol raporu oluşturma.

# v2.5.3 Planı
- Yönetim paneli hızlı kısayollarını role göre özelleştirme.
- Kurucu, yönetici ve editör için farklı dashboard görünümü.
- Sık kullanılan aksiyonları sabitleme.

# v2.5.4 Planı
- Oyun arşivinde gelişmiş puan, tür ve yıl filtreleri.
- Alfabetik şeritleri mobilde daha kompakt hale getirme.
- Kart görünümü hızlı önizleme ayarları.

# v2.5.5 Planı
- Seriyi İzle ekranında sezon/final işaretleri.
- Bölüm notlarından otomatik özet çıkarma.
- İzleme geçmişi zaman çizelgesini büyütme.


# v2.4.0 FIX 12
- seriesGroups açılış hatası düzeltildi.
- Kapak Bul ve Seç paneli eklendi; bulunan kapaklardan manuel seçim yapılır.
- Meta + Kapak Çek yanlış arcade/genel görseli basmaz, güvenilir kapak seçtirir.
- AI Özellik Ekle paneline AI Özellik Yenile, hedef versiyon seçimi, uygulananı sil ve nereye eklendiyse git akışı eklendi.


## v2.4.1 Plan - Kapak ve AI Sonrası Geliştirme
- Kapak adaylarını platforma göre filtreleme: Steam, RAWG, manuel URL, YouTube thumbnail.
- AI uygulanan özellikler için gerçek kod modülü eşleştirme raporu.
- Uygulanan özelliği geri al butonu ve değişiklik geçmişi.
- Oyun adından otomatik seri eşleştirme ve alternatif ad sözlüğü.

# FIX 16 Planı

- Özellik Yaz panelinde backend kod üretim taslağı ve dosya bazlı değişiklik önizlemesi.
- Uygulanan özel özellikler için geri alma geçmişi ve tek tık rollback.
- Kapak çekme sistemine daha fazla oyun kaynağı ve kırık görsel otomatik eleme.


## v2.4.0 FIX 18 sonrası kontrol
- Oyun durum filtreleri ve seri listelerinin Supabase gerçek kayıtlarıyla birebir senkron kontrolü.
- Durum değişince ilgili arşiv kategorisinin anlık yenilenmesi.


# FIX 21 sonrası kontrol planı
- AI Özellik router için manuel hedef seçme override alanı.
- Özellik uygulanmadan önce dosya bazlı gerçek kod değişikliği önizlemesi.
- Backend/Supabase isteyen özelliklerde otomatik SQL taslak onayı.


## FIX 24 sonrası kural
- Site içine tekrar AI özellik yazma/önerme veya deploy/redeploy paneli eklenmeyecek.
- Yeni geliştirmeler ChatGPT ile hazırlanıp ZIP paketi olarak verilecek.

---

## v2.4.1 Sonrası Plan

- Local önizlemede tek tık test raporu.
- Oyun formunda kapak kalite puanı ve bozuk görsel kontrolü.
- Oyun düzenleme ekranında değişiklik geçmişi / geri al.

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


## Sonraki Plan
- Seri sıralama sürükle bırak sistemi FIX38 ile tamamlandı; sonraki sürümlerde toplu seri taşıma ve seri şablonları geliştirilebilir.


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


## FIX48 - v2.4.1 Sürüm Sabitleme + Modal Düzenleme Fix
- Görünen sürüm v2.4.1 olarak sabitlendi.
- Supabase schema.sql içinde site_public_version/current_site_version v2.4.1 olarak güncellenir.
- Eksik Alanlar bölümünde Eksiği Gider artık ayrı düzenleme modalını açar.
- Üst bar kaydırma davranışı düzeltildi.


## FIX49 - Açılış ve Form Buton Stabilizasyonu
- İlk açılış yükleniyor ekranı erken görünmeyecek şekilde düzeltildi.
- Eksiği Gider modalı garanti açılır hale getirildi.
- Kapak, çıkış tarihi, tür ve açıklama çekme butonları sayfa yenilemeden forma işler.
- Görünen sürüm v2.4.1 olarak sabitlendi.

## v2.4.1 FIX50 - Schema JSON + Form Buton Stabilizasyonu
- Supabase schema.sql JSONB hatası düzeltildi.
- site_public_version ve current_site_version kayıtları doğru JSONB formatına taşındı.
- Güncelleme notu schema bloğunda image/written yerine image_url/note kullanıldı.
- İlk açılışta bloklayıcı Site yükleniyor ekranı kaldırıldı.
- Oyun ekle/düzenle veri çekme butonları sayfa yenilemeden çalışacak şekilde sabitlendi.


## FIX51 - Oyun Formu Kaydet/Güncelle ve Detaylı Hikaye
- Oyun ekle/düzenle ekranlarında sayfa yenileyen form davranışı kesildi.
- Kaydet ve Oyunu Güncelle işlemleri ayrı stabil kaydetme katmanına bağlandı.
- Kapak, tarih, tür, açıklama ve playlist çekme butonları submit/reload yapmadan forma işler.
- Hikaye çekme daha detaylı Türkçe, spoiler kontrollü metin üretir.
