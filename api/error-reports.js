export default function handler(req, res) {
  res.status(200).json({ version: 'v2.1.1', reports: [], note: 'Gerçek kayıt için Supabase bağlantısı eklenecek.' });
}
