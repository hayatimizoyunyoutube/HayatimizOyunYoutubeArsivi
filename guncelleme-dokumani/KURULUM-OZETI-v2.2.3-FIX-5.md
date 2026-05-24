# Kurulum Özeti - v2.2.3 FIX 5

1. ZIP içindeki dosyaları proje klasörünün içine çıkar.
2. Proje kökünde package.json, index.html, vercel.json, src ve api görünmeli.
3. Terminalde npm install ve npm run build çalıştır.
4. GitHub'a force push yap.
5. Vercel > Project Settings > Build & Development Settings:
   - Framework: Vite
   - Build Command: npm run build
   - Output Directory: dist
   - Install Command: npm install
6. Deployments > Redeploy > Clear Build Cache seç.
