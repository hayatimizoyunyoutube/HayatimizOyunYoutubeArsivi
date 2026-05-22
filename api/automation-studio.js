export default function handler(req, res) {
  res.status(200).json({
    version: '2.1.0',
    rules: {
      aiRecommendations: true,
      watchProgress: true,
      notificationCenter: true,
      duplicateCheck: true,
      safeFallback: true
    }
  });
}
