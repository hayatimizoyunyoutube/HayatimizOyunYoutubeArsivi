# Sürüm Notları

## v2.1.4.3 - Arayüz Fix + Güncelleme Notları

- Profesyonel mobil görünüm güçlendirildi.
- Kullanıcı ana sayfasından gereksiz teknik/güncelleme alanları kaldırıldı.
- Güncelleme notu ekleme paneli yönetim paneline alındı.
- Tüm sürümlerin yazılı + resimli güncelleme notu arşivi korundu.
- Site görselleri ve gelecek güncelleme görselleri ZIP içine eklendi.
- Supabase schema dosyaları güvenli tekrar kurulum sırasına göre tutuldu.
- BAT dosyaları güncel sürüm adı ve güvenli temiz kurulum mantığıyla güncellendi.

## Kurulum Sırası

1. Supabase gerekiyorsa `00-TUM-TABLOLARI-SIFIRLA.sql` çalıştır.
2. `schema.sql` çalıştır.
3. Kurucu yetkisi için `YETKI-ORNEK-SQL-v2142.sql` veya güncel yetki SQL dosyasını kullan.
4. Proje klasöründe `.git` hariç her şeyi sil.
5. ZIP içeriğini proje klasörünün içine çıkar.
6. `02-githuba-otomatik-gonder.bat` ile GitHub’a gönder.
7. Vercel’de `Redeploy > Clear Build Cache` yap.
