# v2.2.0 FIX - Bakım/Ban/Kurucu Silme Kesin Fix

Yeni sürüm değildir.

## Yapılanlar

- 🛠️ Bakım modu açılışta Supabase’den önce kontrol edilir.
- 👤 Ziyaretçi ve normal üye bakım açıkken siteyi görmez, bakım ekranı görür.
- 🚫 Banlı kullanıcı ana sayfa/arşiv/takvim/profil/izleme/yönetim alanlarını göremez.
- 👑 Ana kurucu tek hesap olarak `mertdundaroyunda@gmail.com` bırakıldı.
- 🗑️ Diğer kurucu/üye kayıtları Supabase Auth + site_users + yetki tablosundan silinebilir.
- ☁️ Kullanıcı silme işleminde e-posta da gönderilir; auth/authority kayıtları boşta kalmaz.
- 🧹 Eski `mertdundar05@outlook.com` otomatik kurucu listesinde tutulmaz.

## Schema durumu

✅ schema.sql gerekli değil. Yeni tablo/kolon eklenmedi; API ve arayüz mantığı düzeltildi.
