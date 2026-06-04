# v2.2.1 - Premium Bakım Merkezi ve Sürüm Senkronizasyonu

## Yapılanlar

- 🎬 Bakım modu ekranı 007 First Light esintili sinematik tasarıma taşındı.
- 🌌 Hareketli ajan/ışık/wallpaper arka planı eklendi.
- ✨ Bakım ekranına glow, scanline, hareketli ışık ve progress animasyonları eklendi.
- 🚫 Banlı kullanıcı ekranı premium kırmızı güvenlik tasarımına güncellendi.
- 💬 Ban ekranında Discord iletişim bağlantısı korundu.
- 🏷️ SiteConfig, Vercel/GitHub etiketi, health/status, update-notes ve schema Results v2.2.1 olarak eşitlendi.
- 🛡️ Supabase bakım modu, ban sistemi, kullanıcı kayıtları ve kurucu hesap koruması bozulmadan bırakıldı.
- 💾 Güncelleme/fix sonrası bakım modu ve kullanıcı kayıtları sıfırlanmasın diye mevcut koruma mantığı korundu.

## Schema durumu

✅ `schema.sql` gerekli.

🧱 Nedeni: Supabase Results/status/version kayıtlarının v2.2.1 olarak güncellenmesi gerekiyor.
🛡️ Veri silmez, oyun/kullanıcı/bakım kayıtlarını sıfırlamaz.
