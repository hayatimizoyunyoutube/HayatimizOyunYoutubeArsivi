# v4.0.0 Supabase Oyun Kaydetme Kesin Fix

Yapılanlar:
- Oyun ID boş gidince Supabase insert hatası vermesi düzeltildi.
- tags/platforms alanları Supabase text kolonlarıyla uyumlu hale getirildi.
- games tablosundaki eksik kolonlar schema.sql içine eklendi.
- games için select/insert/update/delete policy eklendi.
- package.json node sürümü `>=20` yerine `20.x` yapıldı. Vercel turuncu node uyarısı azalır.

Schema gerekli: EVET.
Supabase SQL Editor içinde `schema.sql` dosyasını çalıştır.
