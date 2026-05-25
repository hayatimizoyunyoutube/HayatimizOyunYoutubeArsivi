

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
