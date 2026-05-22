# Hayatımız Oyun V2.7.0 - Açılış Öncesi Büyük Stabilizasyon

Bu paket, V3.0.0 açılışı öncesi ana siteyi, bakım modunu ve yönetim panelini görseldeki V2.7.0 konseptine göre baştan toparlar.

## Öne çıkanlar

- Ana site V2.7.0 koyu mor/mavi tona çekildi.
- Ana sayfa seri odaklı yapıya alındı.
- Seriler A-Z alfabetik bölümlere ayrıldı.
- A Plague Tale gibi aynı serideki oyunlar tek seri kartında birleşir.
- Seri kartlarında **Tüm Seriyi İzle** butonu var.
- A-Z oyunlar, Profil, Oyun İste / Hata Bildir sayfaları yenilendi.
- Bakım modu V3.0.0 açılış bilgisiyle profesyonel hale getirildi.
- Admin panel tüm kategorileriyle yeniden düzenlendi:
  - Dashboard
  - Site Durumu
  - Bakım Modu
  - Oyunlar
  - Seriler
  - A-Z Yönetimi
  - Kapak Yönetimi
  - Hikaye Yönetimi
  - YouTube Çekme
  - Tüm Hataları Onar
  - Gelen İstek / Hatalar
  - Profil Yönetimi
  - Güncelleme Notları
  - Sosyal Medya
  - Ayarlar
  - Temiz Kurulum Merkezi

## Temiz kurulum

```powershell
cd "C:\Users\Mevlüt Yeni Pc\Desktop\Youtube Yayın Hazırlıkları\Youtube\Youtube Arşiv Sitesi Güncel\hayatimiz-oyun site vercel"
Get-ChildItem -Force | Where-Object { $_.Name -ne ".git" } | Remove-Item -Recurse -Force
```

ZIP içeriğini aynı klasörün içine çıkar.

```powershell
git add .
git commit -m "V2.7.0 temiz kurulum"
git push -f origin main
```
