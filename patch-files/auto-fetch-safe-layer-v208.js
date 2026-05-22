// v2.0.8 güvenli otomatik çekme yardımcı fonksiyonu.
// JSON, API, Supabase edge endpoint veya Vercel endpoint için ortak güvenli okuma katmanı.
export async function safeAutoFetchV208(url, fallbackData, options = {}) {
  const timeoutMs = options.timeoutMs || 3500;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const response = await fetch(url, { signal: controller.signal, cache: 'no-store' });
    clearTimeout(timeout);
    if (!response.ok) throw new Error('Veri çekilemedi');
    const data = await response.json();
    return { data, usedFallback: false, source: url, fetchedAt: new Date().toISOString() };
  } catch (error) {
    console.warn('Hayatımız Oyun v2.0.8 fallback veri kullandı:', error.message);
    return { data: fallbackData, usedFallback: true, source: 'fallback', fetchedAt: new Date().toISOString() };
  }
}

export function findDuplicateGameTitles(games = []) {
  const titles = games.map(game => game.title?.trim().toLowerCase()).filter(Boolean);
  return [...new Set(titles.filter((title, index) => titles.indexOf(title) !== index))];
}
