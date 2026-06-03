# v2.1.9 FIX — Supabase Auth Kullanıcı Çekme

Yeni sürüm değildir, v2.1.9 düzeltme paketidir.

## Yapılanlar

- Yönetim > Kullanıcılar ve Yetkiler ekranı artık sadece `site_users` tablosunu değil, Supabase Auth kullanıcılarını da çeker.
- Yeni kayıt olan hesaplar `Supabase Auth` kaynağıyla listede görünür.
- Yetki kaydedilince e-posta üzerinden `site_users` ve `site_authority_assignments` kayıtları oluşturulur/güncellenir.
- Yetki kaydetme butonu Auth-only kullanıcılar için de çalışacak şekilde düzeltildi.

## Schema durumu

schema.sql gerekli değil. Mevcut tablolar yeterlidir; düzeltme API ve panel tarafındadır.
