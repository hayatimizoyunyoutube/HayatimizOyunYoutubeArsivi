export default function handler(req, res) {
  res.status(200).json({
    version: '2.1.0',
    mode: 'safe-demo',
    progress: [
      { gameId: 're4r', percent: 68, next: '15. Bölüm' },
      { gameId: 'alanwake2', percent: 42, next: '9. Bölüm' }
    ]
  });
}
