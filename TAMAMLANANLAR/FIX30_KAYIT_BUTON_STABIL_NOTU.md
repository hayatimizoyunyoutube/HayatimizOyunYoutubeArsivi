# FIX30 - Kayıt ve Buton Stabilizasyonu

Bu sürüm, FIX29 sonrası bazı yönetim paneli kayıt ve butonlarında oluşan hata zincirini düzeltir.

## Düzeltilenler

- Oyun istekleri ve hata bildirimleri içindeki **Kaydet** butonları güvenli hale getirildi.
- Durum seçme alanları Supabase hata verse bile paneli bozmaz.
- Oyun düzenle ve oyun sil butonları ekstra güvenli yakalama katmanına alındı.
- Form içindeki normal işlem butonlarının yanlışlıkla submit tetiklemesi engellendi.
- Oyun durum butonları artık sadece formu değiştirir; kayıt ancak **Kaydet / Güncelle** ile yapılır.
- Supabase kayıt hatası olursa kayıt localde korunur, ekran hata vermez.

## Not

AI ve Deploy/Redeploy sistemleri yine kaldırılmış durumdadır. Local önizleme için `03-VSCode-Localhost-Onizleme.bat` kullanılabilir.
