# Hayatımız Oyun v2.4.0 FIX 2 - Ultra Statik Hızlı Deploy

Bu paket Vercel'in uzun `npm install` / `npm run build` sürecine girmemesi için hazırlandı.

Bu pakette bilinçli olarak şunlar yoktur:
- package.json
- package-lock.json
- src
- api
- node_modules
- dist klasörü

Site hazır derlenmiş dosyalarla kökten çalışır:
- index.html
- assets/
- data/

Vercel ayarlarında Install Command veya Build Command manuel yazılıysa boşalt veya `echo skip` yap.
