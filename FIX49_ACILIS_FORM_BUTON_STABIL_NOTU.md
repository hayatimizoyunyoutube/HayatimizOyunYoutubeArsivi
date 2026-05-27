# FIX49 - Açılış ve Form Buton Stabilizasyonu

## Yapılanlar
- İlk açılışta gereksiz Site yükleniyor ekranı erken görünmesin diye boot timer 12 saniyeye alındı.
- Uygulama JS yüklenir yüklenmez boot ekranı kapatılır.
- Üstteki gereksiz kategori rayı kaldırıldı.
- Görünen sürüm v2.4.1 olarak tekrar sabitlendi.
- Supabase schema.sql içine v2.4.1 runtime config sabitlemesi eklendi.
- Eksiği Gider / Düzenle tıklaması ayrı düzenleme modalını garanti açacak şekilde güçlendirildi.
- Düzenle ve Oyun Ekle formlarındaki Kapakları Getir, Çıkış Tarihini Çek, Türleri Çek, Açıklama Çek ve Tüm Bilgileri Çek butonları sayfayı yenilemeden forma işler.
- Veri çekme butonları Supabase kaydı yapmaz; kayıt yalnızca Oyunu Kaydet / Oyunu Güncelle ile yapılır.
