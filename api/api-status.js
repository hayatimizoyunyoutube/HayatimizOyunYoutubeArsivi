export default function handler(req, res) {
  res.status(200).json({ localJson: 'online', youtubeApi: process.env.YOUTUBE_API_KEY ? 'ready' : 'env-needed', supabase: process.env.SUPABASE_URL ? 'ready' : 'env-needed' });
}
