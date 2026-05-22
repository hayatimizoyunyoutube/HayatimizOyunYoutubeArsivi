// Hayatımız Oyun v2.1.0 güvenli otomasyon katmanı
export const v210Modules = {
  aiRecommendations: true,
  watchProgress: true,
  notificationCenter: true,
  themePresets: true,
  automationStudio: true,
  safeFallback: true
};

export function normalizeProgress(percent = 0) {
  const value = Number(percent || 0);
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function buildRecommendation(game) {
  const quality = Number(game?.qualityScore || 0);
  const progress = Number(game?.progress || 0);
  return {
    title: `${game?.title || 'Oyun'} devam önerisi`,
    confidence: normalizeProgress((quality + progress) / 2),
    reason: 'Kalite skoru ve izleme ilerlemesine göre öneri oluşturuldu.'
  };
}
