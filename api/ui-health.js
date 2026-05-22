export default function handler(req, res) {
  res.status(200).json({ version: 'v2.1.1', ui: 'safe', categoryOverflow: 'fixed', sidebar: 'stable', mobile: 'checked' });
}
