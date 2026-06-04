# v2.2.1 - Sürüm Senkronizasyonu ve Premium Bakım Merkezi

## Yapılanlar

- 🛠️ Bakım modu ziyaretçi ekranı animasyonlu ve profesyonel tasarıma taşındı.
- 💾 Bakım modu `site_runtime_config.maintenance_mode` üzerinden kalıcı kaydedilecek şekilde güçlendirildi.
- 🔒 Güncelleme ve fix paketlerinde bakım modu, oyunlar, kullanıcılar ve yetkiler sıfırlanmasın diye korumalı kayıt mantığı eklendi.
- 🎮 Oyun ekleme/güncelleme akışı Supabase kalıcı kayıt mantığıyla korunur.
- 👥 Supabase Auth kullanıcıları `site_users` tablosuna işlenir; eksik kurucu hesaplar tekrar oluşturulur.
- 🚫 Banlı kullanıcılar siteye ulaşamaz; “Banlandınız” ekranı görür.
- 💬 Banlı kullanıcı ekranına Discord iletişim bağlantısı eklendi: https://discord.gg/QXc74Q6UUE
- 📦 Yönetim paneli üst menüsü daha kompakt hale getirildi.

## Schema durumu

✅ schema.sql gerekli.

Neden gerekli?
- 🧱 Ban sistemi için `banned_at`, `ban_reason`, `is_active` alanlarının garanti edilmesi gerekiyor.
- 💾 Bakım modu kalıcı kayıt sistemi için `site_runtime_config` alanları garanti ediliyor.
- 🛡️ Schema güvenli yazıldı; mevcut oyun, kullanıcı, yetki ve bakım verilerini silmez.
