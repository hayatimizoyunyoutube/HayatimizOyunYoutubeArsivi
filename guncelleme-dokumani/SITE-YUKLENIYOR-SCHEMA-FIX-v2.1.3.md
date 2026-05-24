# Site Yükleniyor + Schema Fix - v2.1.3

## Sorun
Site Vercel'de `Site yükleniyor...` ekranında kalabiliyordu. Bunun nedeni genel catch-all rewrite'ın assets JS/CSS dosyalarını da index.html'e yönlendirme riskiydi.

## Çözüm
- `vercel.json` sadeleştirildi.
- Sadece `/api` endpointleri `/api/index.js` dosyasına yönlendiriliyor.
- Hash route kullanıldığı için genel `/(.*)` rewrite kaldırıldı.
- `schema.sql` v2.1.3'e göre yeniden temizlendi.

## Kurulum
1. `supabase/schema.sql`
2. `.git` korunarak temiz kurulum
3. GitHub'a gönder
4. Vercel > Redeploy > Clear Build Cache
