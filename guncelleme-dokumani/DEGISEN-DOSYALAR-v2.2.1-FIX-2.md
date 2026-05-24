# DEĞİŞEN DOSYALAR - v2.2.1 FIX 2

- `src/main.js`
- `supabase/schema.sql`
- `VERSION_NOTES.md`

## Düzeltme
- İlk açılışta çıkan `ReferenceError: publicHighlights is not defined` hatası giderildi.
- Eski `publicHighlights` referansı kaldırıldı ve `publicStats` güvenli fallback ile çalışacak hale getirildi.
