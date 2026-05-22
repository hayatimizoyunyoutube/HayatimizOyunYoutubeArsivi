# Hayatımız Oyun v2.1.2

Kullanıcı menüsü sadeleştirme, bakım modu ve çalışan buton sistemi güncellemesi.

## Öne çıkanlar

- Kullanıcıya görünmemesi gereken yönetim/test/API sayfaları ana kategori menüsünden kaldırıldı.
- Yönetim Paneli ayrı üst butondan açılır.
- Bakım Modu eklendi ve admin panelinden aç/kapat yapılır.
- Bakım Modu açıkken kullanıcı tarafında bakım ekranı görünür, admin paneli çalışmaya devam eder.
- Tüm görünür butonlara doğru aksiyon/sekme davranışı eklendi.
- Vercel Hobby uyumludur: `api/` klasörü yoktur, serverless function limiti aşılmaz.
- Supabase zorunlu değildir; site local JSON ile açılır.

## Vercel ayarları

```txt
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install --no-audit --no-fund
Root Directory: boş
```

## Temiz kurulum

`.git` klasörünü koru, diğer dosyaları sil, bu ZIP içeriğini proje köküne çıkar ve force push yap.

## v2.1.2 Fix 1

Bu sürüm giriş/kayıt ekranı, kullanıcı/admin ayrımı ve animasyonlu bakım modu düzeltmesini içerir.

Admin girişi Vercel `ADMIN_PASSWORD` değişkeniyle yapılır; test şifresi arayüzde yazmaz.
