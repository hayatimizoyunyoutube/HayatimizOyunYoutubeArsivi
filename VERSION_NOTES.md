# Hayatımız Oyun v2.1.2

Bu sürüm akşam test öncesi kullanıcı arayüzünü sadeleştirir ve yönetim/bakım tarafını düzenler.

## Eklenen / düzeltilenler

- Kullanıcılara görünmemesi gereken Test Merkezi, Hata Raporları, API Durumu, Bildirimler, AI Öneriler ve Yönetim Paneli ana kategori menüsünden kaldırıldı.
- Ana kategori menüsünde sadece kullanıcı tarafı kaldı: Ana Sayfa, Popüler, Tamamlanan, Devam Eden, Yakında, Korku, Aksiyon, Hikaye Odaklı, Takvim, Koleksiyonlar.
- Yönetim Paneli ayrı güvenli erişim butonuna alındı.
- Bakım Modu eklendi: admin panelinden aç/kapat yapılır, kullanıcı tarafında bakım ekranı gösterilir.
- Bakım Modu açıkken yönetim paneline erişim devam eder.
- Boş/göstermelik butonlara aksiyon mesajı eklendi.
- Yönetim Paneli butonları panel içinde sekme değiştirir; yanlış sayfaya gitmez.
- Mobilde kategori taşması ve butonların sağa kayması azaltıldı.
- Vercel Hobby uyumu korundu: api klasörü/serverless function yok.
- Supabase zorunlu değildir; site local JSON ile açılır.

## Deploy

Vercel ayarları:

```txt
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install --no-audit --no-fund
Root Directory: boş
```
