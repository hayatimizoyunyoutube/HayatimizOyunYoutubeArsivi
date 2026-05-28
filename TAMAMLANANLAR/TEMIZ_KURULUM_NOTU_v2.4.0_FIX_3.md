# v2.4.0 FIX 3 Kurulum Notu

Bu paket ultra statik paket değildir. Supabase kayıtlarının geri gelmesi için `src`, `api`, `package.json` ve `supabase` klasörleri bilerek pakete dahil edildi.

Kurulum:
1. `01-siteyi-temizle-git-ve-bat-haric.bat` çalıştır.
2. EVET yaz.
3. ZIP içeriğini proje klasörüne direkt çıkar.
4. `02-githuba-otomatik-gonder.bat` çalıştır.
5. Vercel > Deployments > Redeploy > Clear Build Cache yap.

Vercel ayarı:
- Framework: Vite
- Install Command: npm install
- Build Command: npm run build
- Output Directory: dist
- Root Directory: boş

Not:
- `02` package.json aramaz, npm install çalıştırmaz; sadece mevcut klasörü GitHub'a force push yapar.
- Vercel kaynak dosyalardan kendisi build alır.
