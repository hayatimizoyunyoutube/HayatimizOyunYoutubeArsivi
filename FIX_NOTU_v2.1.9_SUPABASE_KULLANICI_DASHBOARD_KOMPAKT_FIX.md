# v2.1.9 FIX — Supabase Kullanıcıları + Kompakt Yönetim Paneli

## Yapılanlar

- 👥 Supabase Auth kullanıcılarını çekme akışı güçlendirildi.
- 💾 Auth kullanıcıları `site_users` tablosuna otomatik işlenecek şekilde düzeltildi.
- 👑 Kurucu e-postası Supabase’de yoksa tekrar `site_users` içine kurucu olarak yazılır.
- 🔄 Yönetim paneline “Supabase Kullanıcı Yenile” akışı eklendi.
- 🧾 Kullanıcı satırlarındaki “Yerel” etiketi daha anlaşılır hale getirildi.
- 🛡️ Yetki kaydetme artık Supabase’e yazmayı tekrar dener.
- 📦 Yönetim paneli hero alanı küçültüldü; ekranı kaplama sorunu düzeltildi.
- 🧰 Üst yönetim menüsü taşma yapmayacak şekilde sıkılaştırıldı.

## Schema durumu

✅ `schema.sql` gerekli değil. Mevcut `site_users`, `site_authority_assignments` ve `site_runtime_config` tabloları kullanıldı.
