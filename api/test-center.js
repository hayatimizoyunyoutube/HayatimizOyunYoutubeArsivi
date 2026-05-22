export default function handler(req, res) {
  res.status(200).json({ version: 'v2.1.1', status: 'Akşam teste hazır', critical: 0, warnings: 3, modules: ['Ana Sayfa','Yönetim Paneli','Mobil','API/ENV','Fallback'] });
}
