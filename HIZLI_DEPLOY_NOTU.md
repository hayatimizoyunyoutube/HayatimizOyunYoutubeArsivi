# v2.4.0 FIX 1 - Hızlı Deploy Notu

Bu pakette Vercel'in uzun süren `npm install` ve `npm run build` adımlarını beklememesi için hazır derlenmiş `dist` klasörü pakete eklendi.

## Önemli
- `vercel.json` içinde `installCommand` ve `buildCommand` hızlı `echo` komutuna çekildi.
- Vercel output klasörü `dist` olarak ayarlandı.
- `package.json` kaynak kod için durur ama Vercel install/build beklememelidir.

## Vercel ayarında elle komut yazılıysa
Vercel Project Settings içinde elle yazılmış `Install Command` veya `Build Command` varsa dosyadaki ayarı ezebilir. Bu durumda şu alanları boş bırak:

- Install Command: boş
- Build Command: boş
- Output Directory: dist
- Framework Preset: Other veya Vite

Sonra `Redeploy > Clear Build Cache` yap.
