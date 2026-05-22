export default function handler(req, res) {
  const exportedAt = new Date().toISOString();
  res.status(200).json({
    version: '2.0.9',
    exportedAt,
    status: 'ready',
    note: 'Gerçek projede Supabase/YouTube verisi burada JSON backup olarak döndürülebilir.'
  });
}
