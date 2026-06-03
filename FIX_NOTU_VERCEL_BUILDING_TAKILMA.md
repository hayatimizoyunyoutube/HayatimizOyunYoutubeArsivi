# v2.1.8 FIX - Vercel Building Takılma Onarımı

Yeni sürüm değildir. v2.1.8 üzerinde deploy takılmasını azaltmak için düzenlendi.

## Yapılanlar
- ZIP içinden `node_modules` ve hazır `dist` klasörü çıkarıldı.
- Vercel build süreci hafifletildi.
- `vercel.json` içinde framework otomatik algılama kapatıldı.
- `installCommand` hızlı/temiz hale getirildi.
- Build komutu doğrudan statik `dist` üretimi yapacak şekilde sabitlendi.
- API fonksiyonu için süre sınırı eklendi.

## Vercel'de uygulanacak adım
Deployments > Redeploy > Clear Build Cache > Redeploy
