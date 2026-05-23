export const fallbackGames = [
  { id: 're4r', title: 'Resident Evil 4 Remake', genre: 'Korku / Aksiyon', status: 'Devam Ediyor', episodes: 14, season: 1, nextEpisode: '15. Bölüm', source: 'Fallback', updatedAt: 'Güncel', progress: 68, score: 9.2, qualityScore: 94, priority: 'Haftalık', watchState: 'İzleniyor', tags: ['Korku', 'Aksiyon'], cover: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=900&auto=format&fit=crop' },
  { id: 'alanwake2', title: 'Alan Wake 2', genre: 'Korku / Hikaye Odaklı', status: 'Devam Ediyor', episodes: 8, season: 1, nextEpisode: '9. Bölüm', source: 'Fallback', updatedAt: 'Güncel', progress: 42, score: 9.1, qualityScore: 91, priority: 'Öncelikli', watchState: 'İzleniyor', tags: ['Hikaye'], cover: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=900&auto=format&fit=crop' }
];
export const fallbackUpdates = [{ version:'v2.1.1 Fix 4', title:'Vercel ENV yanlış uyarı düzeltmesi', date:'2026-05-22', items:['API/ENV panel fix','Yanlış Supabase uyarısı kaldırıldı','Vercel keyleri server-only açıklaması','Fix 3 admin butonları korundu'] }];
export const fallbackConfig = { heroText:'Popüler serileri, devam eden bölümleri, yayın takvimini ve koleksiyonları sade kullanıcı ekranından takip et.', sources:[{name:'Local JSON',enabled:true,priority:1}], syncSettings:{safeFallback:true,testCenter:true,errorReports:true,apiStatusPanel:true,consoleGuard:true}, homepageWidgets:['oyunlar','takvim','koleksiyonlar'], theme:'cinematic-red' };
export const fallbackSyncLog = [{ time:'Yedek', source:'Fallback', status:'Aktif', count:2, note:'Yedek veri kullanıldı' }];
export const fallbackAnalytics = { completionRate:50, averageScore:9.1, activeSeries:2, plannedSeries:1, qualityAverage:90, missingData:0, topTags:['Korku','Hikaye'], todayWatchMinutes:60, aiConfidence:85, notifications:1, automationRules:3, testScore:96, criticalBugs:0, warningBugs:3, checkedScreens:12 };
export const fallbackSchedule = [{ day:'Pazartesi', title:'Resident Evil 4 Remake', episode:'15. Bölüm', status:'Hazırlandı' }];
export const fallbackCollections = [{ name:'Korku Gecesi', count:2, description:'Korku ve gerilim serileri tek alanda.', tag:'Korku' }];
export const fallbackRecommendations = [{ title:'Alan Wake 2 devam et', reason:'Korku + hikaye etiketi güçlü eşleşme veriyor.', confidence:92, action:'9. Bölümü öne çıkar' }];
export const fallbackNotifications = [{ level:'bilgi', title:'Arşiv hazır', text:'Yeni bölümler, takvim ve koleksiyonlar güncel.', time:'Şimdi' }];
export const fallbackThemes = [{ name:'Cinematic Red', key:'cinematic-red', accent:'#ef4444', description:'Varsayılan koyu kırmızı sinematik görünüm' }];
export const fallbackWatchProgress = [{ gameId:'re4r', title:'Resident Evil 4 Remake', episode:'14. Bölüm', percent:68, lastWatched:'Bugün', next:'15. Bölüm' }];
export const fallbackRoadmap = [{ version:'v2.1.1 Fix 4', title:'Vercel ENV panel düzeltmesi', status:'Hazır' }];
export const fallbackTestCenter = { version:'v2.1.1 Fix 4', status:'Vercel ENV uyarıları düzeltildi', overallScore:99, critical:0, warnings:0, checkedAt:'2026-05-22 22:58', modules:[{name:'Ana Sayfa',state:'Geçti',note:'Hero, arama, kategori ve kart düzeni sağlam.'},{name:'Vercel ENV',state:'Geçti',note:'Keyler Vercel içinde güvenli; tarayıcıda görünmemesi normal.'},{name:'Supabase Bilgisi',state:'Geçti',note:'Arayüz testi için Supabase zorunlu değil; local JSON aktif.'}], eveningNotes:['API/ENV panelinde yanlış uyarı kalmış mı?','Yönetim paneli sekmeleri doğru yerde açılıyor mu?'] };
export const fallbackQaChecklist = [{ group:'Arayüz', items:['Ana sayfa açılıyor','Kategoriler taşmıyor','Mobilde bozulma yok'] }];
export const fallbackErrorReports = [{ level:'info', title:'Vercel keyleri eklendi', area:'Environment Variables', status:'Tamam', fix:'Keylerin tarayıcıda görünmemesi doğru; güvenli server ortamında kalırlar.' }];
export const fallbackApiStatus = [{ name:'Local JSON', status:'online', detail:'public/data dosyaları hazır' },{ name:'Vercel ENV', status:'vercel-secure', detail:'Hassas keyler server-only tutulur; tarayıcıda okunmaz.' },{ name:'Supabase', status:'optional', detail:'Arayüz testi için zorunlu değil; gerçek kayıt için schema.sql kullanılır.' }];
export const fallbackRollbackPlan = { safeRollbackVersion:'v2.1.0', steps:['.git klasörünü silme','v2.1.0 ZIP içeriğini çıkar','git push -f origin main'] };

async function fetchJson(path, fallback) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const response = await fetch(path, { signal: controller.signal, cache: 'no-store' });
    clearTimeout(timeout);
    if (!response.ok) throw new Error(`${path} okunamadı`);
    return { data: await response.json(), fallback: false };
  } catch (error) {
    console.warn('Hayatımız Oyun v2.1.1 fallback devrede:', error.message);
    return { data: fallback, fallback: true };
  }
}
export async function loadAutoData() {
  const items = await Promise.all([
    fetchJson('/data/games.json', fallbackGames), fetchJson('/data/update-notes.json', fallbackUpdates), fetchJson('/data/site-config.json', fallbackConfig), fetchJson('/data/auto-sync-log.json', fallbackSyncLog), fetchJson('/data/analytics.json', fallbackAnalytics), fetchJson('/data/schedule.json', fallbackSchedule), fetchJson('/data/collections.json', fallbackCollections), fetchJson('/data/recommendations.json', fallbackRecommendations), fetchJson('/data/notifications.json', fallbackNotifications), fetchJson('/data/theme-presets.json', fallbackThemes), fetchJson('/data/watch-progress.json', fallbackWatchProgress), fetchJson('/data/roadmap.json', fallbackRoadmap), fetchJson('/data/test-center.json', fallbackTestCenter), fetchJson('/data/qa-checklist.json', fallbackQaChecklist), fetchJson('/data/error-reports.json', fallbackErrorReports), fetchJson('/data/api-status.json', fallbackApiStatus), fetchJson('/data/rollback-plan.json', fallbackRollbackPlan)
  ]);
  const [games, updates, config, syncLog, analytics, schedule, collections, recommendations, notifications, themes, watchProgress, roadmap, testCenter, qaChecklist, errorReports, apiStatus, rollbackPlan] = items;
  const usedFallback = items.some(item => item.fallback);
  return { games:games.data, updates:updates.data, config:config.data, syncLog:syncLog.data, analytics:analytics.data, schedule:schedule.data, collections:collections.data, recommendations:recommendations.data, notifications:notifications.data, themes:themes.data, watchProgress:watchProgress.data, roadmap:roadmap.data, testCenter:testCenter.data, qaChecklist:qaChecklist.data, errorReports:errorReports.data, apiStatus:apiStatus.data, rollbackPlan:rollbackPlan.data, status: usedFallback ? 'fallback' : 'online' };
}
export function analyzeGameHealth(games = []) {
  const duplicateTitles = games.map((game) => game.title?.trim().toLowerCase()).filter((title, index, arr) => title && arr.indexOf(title) !== index);
  const qualityAverage = Math.round(games.reduce((sum, game) => sum + Number(game.qualityScore || 0), 0) / Math.max(games.length, 1));
  return { total:games.length, missingCover:games.filter((game)=>!game.cover).length, missingEpisodes:games.filter((game)=>game.status !== 'Yakında' && Number(game.episodes || 0) <= 0).length, duplicates:[...new Set(duplicateTitles)].length, completed:games.filter((game)=>game.status === 'Tamamlandı').length, active:games.filter((game)=>game.status === 'Devam Ediyor').length, planned:games.filter((game)=>game.status === 'Yakında').length, qualityAverage };
}
