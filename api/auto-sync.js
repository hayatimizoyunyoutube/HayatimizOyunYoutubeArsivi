export default function handler(req, res) {
  res.status(200).json({
    version: '2.0.9',
    status: 'success',
    modules: ['games', 'updates', 'syncLog', 'analytics', 'schedule', 'collections'],
    message: 'v2.0.9 demo senkron endpointi hazır. Gerçek YouTube/Supabase bağlantısı için .env anahtarları eklenir.'
  });
}
