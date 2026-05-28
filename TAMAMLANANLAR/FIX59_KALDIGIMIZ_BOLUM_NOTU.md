# v2.4.1 FIX59 - Kaldığımız Bölüm + Playlist Algılama

- Devam eden serilerde **Kaldığımız Bölüm** göstergesi eklendi.
- Sistem playlistten çekilen video listesini okuyarak son/aktif bölümü algılar.
- Ana sayfadaki Devam Eden Seriler kartlarında bölüm numarası, başlığı ve kaynak bilgisi görünür.
- Seri kartlarında ve devam eden seri alanında **Kaldığımız Bölümü İzle** butonu doğrudan ilgili bölümü açar.
- Seriyi izleme modalında üst bölümde playlist takibi ve kaldığımız bölüm bilgisi görünür.
- Playlistten video çekilmediyse manuel bölüm verisine güvenli şekilde düşer.
- Kullanıcı tarafındaki public sürüm etiketi v2.4.1 olarak korunur; FIX59 paket notudur.
- Kontroller: `node --check src/main.js`, `node --check api/index.js`, `npm run build` başarılı.
