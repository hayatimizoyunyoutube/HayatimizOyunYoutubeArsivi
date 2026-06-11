# v4.0.0 Vercel Deploy Takılma Fix

Bu paket Vite build'i kaldırır ve hızlı statik build kullanır.

## Değişenler
- package.json build komutu `vite` yerine `node scripts/build-static.mjs` oldu.
- Vercel output `dist` klasörü oldu.
- Build 5-15 saniye içinde tamamlanacak şekilde ayarlandı.
- Eski cache kaynaklı takılma için temiz deploy önerilir.

## Vercel ayarı
Vercel > Settings > Build & Development Settings:
- Framework Preset: Other
- Build Command: `node scripts/build-static.mjs`
- Output Directory: `dist`
- Install Command: `npm install`

## Git komutu
```bash
git add -A
git commit --allow-empty -m "v4.0.0 deploy takilma hizli static build fix"
git push -f origin main
```
