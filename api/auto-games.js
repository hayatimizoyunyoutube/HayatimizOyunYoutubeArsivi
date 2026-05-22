// Vercel örnek API dosyasıdır. /api/auto-games adresinden demo veri döndürür.
// Gerçek Supabase veya YouTube API anahtarlarını .env içinde tut.
export default function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=600');
  res.status(200).json({
    ok: true,
    version: '2.0.8',
    message: 'Hayatımız Oyun v2.0.8 akıllı otomatik çekme API örneği hazır.',
    endpoints: ['/data/games.json', '/data/update-notes.json', '/data/site-config.json', '/data/auto-sync-log.json'],
    features: ['duplicate-check', 'sync-log', 'source-priority', 'safe-fallback']
  });
}
