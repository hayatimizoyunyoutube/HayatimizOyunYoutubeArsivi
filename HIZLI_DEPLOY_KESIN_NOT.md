# Hızlı Deploy Notu

Vercel logunda hâlâ `npm install --no-audit --no-fund` görüyorsan bu paket değil, Vercel Project Settings içindeki manuel Install Command devrededir.

Ayarlar:
- Root Directory: boş
- Framework Preset: Other / Static
- Install Command: boş veya `echo skip install`
- Build Command: boş veya `echo skip build`
- Output Directory: `.`

Bu paket kökünde `package.json` yoktur. Bu yüzden Vercel normalde npm install çalıştırmamalıdır.
