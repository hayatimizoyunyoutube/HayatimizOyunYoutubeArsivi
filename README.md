# Hayatımız Oyun V2.0.0

İlk büyük güncelleme paketi.

## Öne çıkanlar

- Loading güvenliği ve güvenli açılış katmanı
- Profesyonel kompakt Admin Panel V2
- Kapaksız / hatalı oyun kontrol sistemi
- Demo, DLC ve kapaksız oyunlar için otomatik kapaklar
- RAWG kapak ve hikaye yenileme araçları
- Kapak + hikayeleri silip baştan güncelleme aracı
- Seri sıralama ve seri kontrol sistemi
- Sosyal medya ikon sistemi V2
- YouTube / RAWG API hata toleransı
- Temiz kurulum notları

## Temiz Kurulum

Ana klasör silinmez, sadece içi temizlenir. `.git` korunur.

```powershell
cd "C:\Users\Mevlüt Yeni Pc\Desktop\Youtube Yayın Hazırlıkları\Youtube\Youtube Arşiv Sitesi Güncel\hayatimiz-oyun site vercel"

Get-ChildItem -Force | Where-Object { $_.Name -ne ".git" } | Remove-Item -Recurse -Force
```

ZIP içeriğini bu klasöre çıkar.

```powershell
git init
git branch -M main
git remote remove origin
git remote add origin https://github.com/hayatimizoyunyoutube/HayatimizOyunYoutubeArsivi.git
git add .
git commit -m "V2.0.0 ilk büyük güncelleme temiz kurulum"
git push -f origin main
```

Sonra Vercel Redeploy yap.
