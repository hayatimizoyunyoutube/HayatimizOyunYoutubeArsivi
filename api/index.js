
import crypto from 'node:crypto';

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

function hashPassword(password, salt) {
  return crypto.createHash('sha256').update(`${salt}:${password}`).digest('hex');
}

function normalizeSupabaseUrl(value) {
  return String(value || '').replace(/\/+$/, '');
}

async function supabaseFetch(path, options = {}) {
  const url = normalizeSupabaseUrl(process.env.SUPABASE_URL);
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('SUPABASE_URL veya SUPABASE_SERVICE_ROLE_KEY Vercel ENV içinde eksik.');
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!response.ok) {
    const detail = typeof data === 'object' && data ? (data.message || data.error || JSON.stringify(data)) : text;
    const details = typeof data === 'object' && data ? JSON.stringify(data) : text;
    if (details.includes('schema cache') || details.includes('PGRST205') || details.includes('Could not find the table')) {
      throw new Error('Supabase public.site_users tablosunu schema cache içinde göremiyor. Supabase SQL Editor içinde önce supabase/SUPABASE-HOTFIX-v213-fix2-site-users-cache.sql dosyasını çalıştır, 20-30 saniye bekle, sonra tekrar dene.');
    }
    throw new Error(detail || `Supabase API hata kodu: ${response.status}`);
  }
  return data;
}

async function findUser(email) {
  const rows = await supabaseFetch(`site_users?email=eq.${encodeURIComponent(email)}&select=id,name,email,role,password_hash,password_salt,is_active,created_at&limit=1`, { method: 'GET' });
  return Array.isArray(rows) ? rows[0] : null;
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return json(res, 200, { ok: true });

  const parsedUrl = new URL(req.url || '/api', 'https://hayatimiz-oyun.local');
  const pathAction = parsedUrl.pathname.replace(/^\/api\/?/, '').split('/').filter(Boolean)[0];
  const action = req.query?.action || parsedUrl.searchParams.get('action') || pathAction || 'health';

  if (action === 'health' && req.method === 'GET') {
    return json(res, 200, {
      ok: true,
      version: 'v2.1.3-fix-2',
      route: parsedUrl.pathname,
      supabaseConfigured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
      adminPasswordConfigured: Boolean(process.env.ADMIN_PASSWORD)
    });
  }

  if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'Sadece POST desteklenir.' });

  let body = {};
  try { body = typeof req.body === 'object' ? (req.body || {}) : JSON.parse(req.body || '{}'); }
  catch { return json(res, 400, { ok: false, error: 'Geçersiz JSON isteği.' }); }

  try {
    if (action === 'health') {
      return json(res, 200, {
        ok: true,
        version: 'v2.1.3-fix-2',
        supabaseConfigured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
        adminPasswordConfigured: Boolean(process.env.ADMIN_PASSWORD)
      });
    }

    if (action === 'admin-login') {
      const username = String(body.username || '').trim().toLowerCase();
      const password = String(body.password || '');
      const adminPassword = process.env.ADMIN_PASSWORD;
      if (!adminPassword) return json(res, 500, { ok: false, error: 'ADMIN_PASSWORD Vercel ENV içinde eksik.' });
      const allowedUser = username === 'admin' || username === 'admin@hayatimizoyun.local';
      if (!allowedUser || password !== adminPassword) return json(res, 401, { ok: false, error: 'Yönetici kullanıcı adı veya şifre hatalı.' });
      return json(res, 200, { ok: true, session: { name: 'Admin', email: 'admin@hayatimizoyun.local', role: 'admin' } });
    }

    if (action === 'register') {
      const name = String(body.name || '').trim().slice(0, 80) || 'Kullanıcı';
      const email = String(body.email || '').trim().toLowerCase();
      const password = String(body.password || '');
      if (!email.includes('@') || password.length < 4) return json(res, 400, { ok: false, error: 'Geçerli e-posta ve en az 4 karakter şifre gir.' });
      const existing = await findUser(email);
      if (existing) return json(res, 409, { ok: false, error: 'Bu e-posta zaten kayıtlı. Giriş yap.' });
      const salt = crypto.randomBytes(16).toString('hex');
      const password_hash = hashPassword(password, salt);
      const inserted = await supabaseFetch('site_users', {
        method: 'POST',
        body: JSON.stringify([{ name, email, password_hash, password_salt: salt, role: 'user', provider: 'site-form', is_active: true }])
      });
      const user = Array.isArray(inserted) ? inserted[0] : inserted;
      return json(res, 200, { ok: true, user: { id: user?.id, name, email, role: 'user' }, savedTo: 'public.site_users' });
    }

    if (action === 'login') {
      const email = String(body.email || '').trim().toLowerCase();
      const password = String(body.password || '');
      const user = await findUser(email);
      if (!user || !user.is_active) return json(res, 401, { ok: false, error: 'Kullanıcı bulunamadı veya pasif.' });
      const hash = hashPassword(password, user.password_salt || '');
      if (hash !== user.password_hash) return json(res, 401, { ok: false, error: 'E-posta veya şifre hatalı.' });
      await supabaseFetch(`site_users?id=eq.${encodeURIComponent(user.id)}`, { method: 'PATCH', body: JSON.stringify({ last_login_at: new Date().toISOString() }) });
      return json(res, 200, { ok: true, user: { id: user.id, name: user.name, email: user.email, role: user.role || 'user' } });
    }

    return json(res, 404, { ok: false, error: 'Bilinmeyen API işlemi.' });
  } catch (error) {
    return json(res, 500, { ok: false, error: error.message || 'Sunucu hatası.' });
  }
}
