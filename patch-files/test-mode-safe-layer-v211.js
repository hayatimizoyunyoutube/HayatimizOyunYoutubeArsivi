// Hayatımız Oyun v2.1.1 - test mode safe layer
// Amaç: Akşam testinde console hatalarını ve API durumlarını güvenli şekilde yakalamaya hazırlık.
export function createTestReport({ source = 'browser', message = '', level = 'info' } = {}) {
  return { source, message, level, time: new Date().toISOString(), version: 'v2.1.1' };
}
export function checkRequiredEnv(env = {}) {
  const required = ['YOUTUBE_API_KEY', 'SUPABASE_URL', 'SUPABASE_SERVICE_KEY'];
  return required.map((key) => ({ key, ready: Boolean(env[key]), status: env[key] ? 'ready' : 'missing' }));
}
export function safeConsoleGuard(callback) {
  try { return callback?.(); }
  catch (error) { return createTestReport({ source: 'console', message: error.message, level: 'warning' }); }
}
