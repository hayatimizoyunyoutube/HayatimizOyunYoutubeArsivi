# v2.1.4.9 Kurulum Özeti

1. Supabase için önce `supabase/01-GUNCELLEME-GUVENLI-KURULUM.sql` çalıştır.
2. Sonra `supabase/schema.sql` çalıştır.
3. RLS güvenliği istiyorsan `supabase/02-SUPABASE-RLS-GUVENLIK.sql` çalıştır.
4. Proje klasöründe `.git` hariç temizle.
5. ZIP içeriğini proje klasörüne çıkar.
6. `02-githuba-otomatik-gonder.bat` çalıştır.
7. Vercel > Redeploy > Clear Build Cache yap.
