# v2.0.4 FIX - Kalıcı Silme, Kayıt/Giriş ve Bakım Modu

Bu paket yeni sürüm değildir; mevcut v2.0.4 üstüne fix paketidir.

## Düzeltilenler
- Mevcut oyunlarda son oyun silinince demo oyunların tekrar gelmesi düzeltildi.
- Oyun silme artık tüm eski localStorage anahtarlarına da yazılır; eski kayıt geri dirilmez.
- Mevcut Oyunlar sayfasına “Tüm Oyunları Sil” ve “Örnekleri Geri Yükle” butonları eklendi.
- Kayıt Ol ve Giriş Yap sayfaları geri eklendi.
- Admin panel, oyun ekleme, mevcut oyunlar, takvim, güncelleme notları ve bakım modu sadece yetkili girişte görünür.
- Bakım modu herkese yönetim menüsü olarak görünmez.
- Bakım modu açıksa public kullanıcı bakım ekranı görür; admin giriş yapınca siteyi ve yönetim panelini görür.
- Eski bozuk bakım açık kaydı ilk açılışta güvenli şekilde kapalıya alınır.
- `supabase/schema.sql` demo oyun eklemeyen sıfırdan boş kurulum olarak güncellendi.

## Sürüm
- Site sürümü değiştirilmedi: v2.0.4
- Bu paket sadece FIX paketidir.
