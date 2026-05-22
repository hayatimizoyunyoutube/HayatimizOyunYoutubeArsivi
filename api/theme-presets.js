export default function handler(req, res) {
  res.status(200).json({
    version: '2.1.0',
    themes: ['cinematic-red', 'neon-blue', 'dark-gold']
  });
}
