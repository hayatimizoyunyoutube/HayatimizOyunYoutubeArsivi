export default function handler(req, res) {
  const query = req.query?.q || '';
  res.status(200).json({ version: '2.0.9', query, status: 'ready', results: [] });
}
