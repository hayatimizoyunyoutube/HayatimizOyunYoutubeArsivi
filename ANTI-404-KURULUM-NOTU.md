# v4.0.0 Anti 404 Final Paket

Bu paket Vercel'de 404 almamak için root `index.html` dosyasını direkt statik olarak yayınlar.

## Vercel ayarı
- Framework Preset: Other
- Build Command: boş bırakılabilir veya `npm run build`
- Output Directory: boş bırak
- Install Command: npm install

## Önemli
GitHub repo ana dizininde mutlaka şunlar görünmeli:
- index.html
- package.json
- vercel.json
- assets/
- api/
- public/

Eğer GitHub'da tek klasör içinde görünüyorsa yanlış yüklenmiştir. Dosyalar repo kökünde olmalı.
