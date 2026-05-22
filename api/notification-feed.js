export default function handler(req, res) {
  res.status(200).json({
    version: '2.1.0',
    notifications: [
      { level: 'önemli', title: '2 seri sıradaki bölüm bekliyor' },
      { level: 'uyarı', title: 'Supabase ENV pasif' }
    ]
  });
}
