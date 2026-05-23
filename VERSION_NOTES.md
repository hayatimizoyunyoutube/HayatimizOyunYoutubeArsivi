# v2.1.3 Fix 5 - Kurucu Yetki + Bakım Kilidi

- Yönetim Paneli butonları işlevli hale getirildi.
- Bakım modu giriş yapmayanlara ve normal kullanıcılara global gösterilecek şekilde düzeltildi.
- `admin` rolü kaldırıldı; yeni rol sistemi eklendi: kurucu, yonetici, moderator, editor, user, banned.
- Kurucu/Yönetici: tüm yetkiler.
- Moderatör/Editör: panel görüntüleme ve içerik/test takibi.
- Supabase `RUN-FIRST-v213-fix5-roles-maintenance.sql` önce çalıştırılmalı.


## v2.1.3 Fix 6
- Kullanıcı ana sayfası sadeleştirildi.
- Admin/Supabase/test teknik kartları Yönetim Paneli Genel Bakış'a taşındı.
- Güncelleme notları artık kullanıcı ana sayfasında görünmez.
