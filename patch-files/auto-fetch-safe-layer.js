// v2.0.7 güvenli otomatik çekme yardımcı fonksiyonu.
// Mevcut projede servis klasörüne ekleyip kullanabilirsin.
export async function safeAutoFetch(url, fallbackData) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const response = await fetch(url, { signal: controller.signal, cache: 'no-store' });
    clearTimeout(timeout);
    if (!response.ok) throw new Error('Veri çekilemedi');
    return { data: await response.json(), usedFallback: false };
  } catch (error) {
    console.warn('Hayatımız Oyun fallback veri kullandı:', error.message);
    return { data: fallbackData, usedFallback: true };
  }
}
