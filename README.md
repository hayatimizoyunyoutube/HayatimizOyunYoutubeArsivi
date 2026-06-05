# Hayatımız Oyun — v4.0.0 Ana Açılış Final

Bu paket temiz final pakettir. Eski aktif sürüm yazıları, gereksiz fix notları ve tekrar dosyaları temizlenmiştir.

## İçerik
- 🎨 Profesyonel ana sayfa ve genel arayüz
- 🎮 Oyun arşivi ve kompakt kart yapısı
- 🗂️ Kategori / koleksiyon sistemi
- 🎬 Seri merkezi ve bölüm takibi
- 📺 YouTube playlist bölüm adı + thumbnail koruma
- 📅 Yayın takvimi
- 👤 Profil merkezi
- ⭐ Favoriler ve takip sistemi
- 🏆 Başarım / rozet sistemi
- 🛡️ Yönetim paneli ve veri sağlığı
- 🔐 Kurucu/yetki/ban sistemi
- 🛠️ Bakım modu kapalı açılış ayarı
- 🏷️ v4.0.0 site, Vercel, schema, status ve health senkronu

## Schema
`schema.sql` gereklidir. Veri silmez; sadece eksik kolonları güvenli ekler ve aktif sürüm/status kayıtlarını v4.0.0 yapar.

## Git
```bash
git add -A
git commit --allow-empty -m "v4.0.0 temiz final tam paket"
git push -f origin main
```

Vercel: Deployments > Redeploy > Clear Build Cache > Redeploy


## v4.0.0 Schema Kolon Fix
- site_users.role_code schema fix eklendi.
- Eski Supabase tablolarında eksik kolon varsa güvenli ALTER TABLE ile eklenir.
- Veri silmez.
