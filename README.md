# Hayatımız Oyun V2.0.0 Fix 1 - Stable Restore

V2.0.0 geri dönüşünde görülen açılış / güvenli mod sorunu düzeltilmiştir.

## Yapılanlar

- Siteyi render sırasında düşüren eksik `socialLinksFromSettings()` fonksiyonu eklendi.
- Loading ekranında kalma ve güvenli moda düşme sorunu düzeltildi.
- API cevap vermese bile site ana arayüzü açılır.
- Oyun verisi boşsa önce local cache, sonra `/data/sample-game.json` yedek veri olarak kullanılır.
- V2.0.0 görünümü korunmuştur; V2.7.0 bozuk arayüzleri bu pakete eklenmemiştir.
- Sürüm V2.0.0 Fix 1 olarak güncellendi.
- JS syntax kontrolünden geçti.

## Temiz kurulum

```powershell
cd "C:\Users\Mevlüt Yeni Pc\Desktop\Youtube Yayın Hazırlıkları\Youtube\Youtube Arşiv Sitesi Güncel\hayatimiz-oyun site vercel"
Get-ChildItem -Force | Where-Object { $_.Name -ne ".git" } | Remove-Item -Recurse -Force
```

ZIP içeriğini aynı klasörün içine çıkar.

```powershell
git add .
git commit -m "V2.0.0 Fix 1 temiz kurulum"
git push -f origin main
```

Vercel'de Redeploy yaparken mümkünse Clear Build Cache seç.
