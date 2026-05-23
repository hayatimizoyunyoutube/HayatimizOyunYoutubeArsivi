// Hayatımız Oyun v2.0.9 güvenli veri katmanı
// Bu dosya mevcut projeye parça parça alınabilir.
export async function safeReadJson(path, fallback) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const response = await fetch(path, { signal: controller.signal, cache: 'no-store' });
    clearTimeout(timeout);
    if (!response.ok) throw new Error('JSON okunamadı');
    return { data: await response.json(), status: 'online' };
  } catch (error) {
    return { data: fallback, status: 'fallback', error: error.message };
  }
}

export function createQualityScore(game) {
  let score = 70;
  if (game.cover) score += 10;
  if (game.episodes > 0 || game.status === 'Yakında') score += 8;
  if (game.tags?.length) score += 5;
  if (game.source) score += 4;
  if (game.progress >= 100) score += 3;
  return Math.min(score, 100);
}
