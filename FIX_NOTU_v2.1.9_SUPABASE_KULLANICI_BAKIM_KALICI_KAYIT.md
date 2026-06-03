# v2.1.9 FIX — Supabase Kullanıcı ve Bakım Kalıcı Kayıt

## Yapılanlar

- 👥 Yeni açılan Supabase Auth kullanıcıları Kullanıcılar ve Yetkiler paneline otomatik çekilecek.
- 💾 Auth kullanıcıları otomatik olarak `site_users` tablosuna eşlenecek.
- 👑 Kurucu e-postası tablolar sıfırlansa bile tekrar Supabase kurucu kaydı olarak oluşturulacak.
- 🔐 Yetki kaydetme işlemi önce Supabase tablosuna yazacak, olmazsa sadece geçici yerel yedek kullanacak.
- 🧾 Paneldeki `Yerel` etiketi daha anlaşılır hale getirildi; asıl kayıt kaynağı Supabase olarak gösterilecek.
- 🛠️ Bakım modu kaydedilirken açık/kapalı değeri tersine dönmeyecek.
- ☁️ Bakım ayarı `site_runtime_config.maintenance_mode` içine kalıcı kaydedilecek.
- ♻️ Supabase kullanıcı listesi yenilendiğinde Auth + site_users + yetki kayıtları birleştirilecek.

## Schema durumu

✅ `schema.sql` gerekli değil. Mevcut tablolar kullanıldı; yeni tablo veya kolon eklenmedi.
