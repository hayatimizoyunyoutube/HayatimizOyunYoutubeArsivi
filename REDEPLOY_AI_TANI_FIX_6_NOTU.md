# v2.4.0 FIX 6 - Redeploy + AI/Supabase Tanı Merkezi

Bu pakette yönetim paneline ek bir Redeploy / AI Tanı butonu eklenmiştir.

## Özellikler
- GitHub yüklendi durumunu işaretleme
- Vercel Deploy Hook URL ile redeploy tetikleme
- Supabase schema uygulandı durumunu işaretleme
- Yeni tablo / SQL geri bildirimi kaydetme
- AI özelliklerini Supabase tanı listesine aktarma

## Not
Vercel redeploy otomasyonu için Vercel Deploy Hook URL gerekir. URL yoksa panel sadece durumu kaydeder; GitHub push sonrası Vercel otomatik deploy beklenir.
