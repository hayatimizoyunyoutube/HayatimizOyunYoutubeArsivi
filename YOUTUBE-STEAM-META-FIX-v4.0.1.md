# v4.0.1 YouTube / Steam Meta Fix

- YouTube playlist bölümleri sadece YouTube Data API v3 ile çekilir.
- Vercel ENV içine `YOUTUBE_API_KEY` eklenmelidir.
- Steam App ID alanı doluysa meta/kapak Steam App ID üzerinden çekilir.
- 007 First Light için Steam App ID: 3768760.
- Etiketler otomatik doldurulmaz; kullanıcı seçerse kaydedilir.
- Kanal logosu/site kapağı otomatik bölüm kapağı olarak yazılmaz.
