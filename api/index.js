
import crypto from 'node:crypto';

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.end(JSON.stringify(payload));
}

function hashPassword(password, salt) {
  return crypto.createHash('sha256').update(`${salt}:${password}`).digest('hex');
}

function normalizeSupabaseUrl(value) {
  return String(value || '').replace(/\/+$/, '');
}

function normalizeRole(role) {
  const raw = String(role || 'user').trim().toLowerCase();
  const ascii = raw
    .replace(/ı/g, 'i').replace(/İ/g, 'i')
    .replace(/ö/g, 'o').replace(/ü/g, 'u')
    .replace(/ğ/g, 'g').replace(/ş/g, 's').replace(/ç/g, 'c');
  if (['kurucu', 'founder', 'owner', 'sahip'].includes(ascii)) return 'kurucu';
  if (['yonetici', 'yönetici', 'admin', 'administrator'].includes(ascii)) return 'yonetici';
  if (['moderator', 'mod', 'moderatör'].includes(ascii)) return 'moderator';
  if (['editor', 'editör', 'icerik-editoru', 'içerik-editörü'].includes(ascii)) return 'editor';
  if (['banned', 'banli', 'banlı'].includes(ascii)) return 'banned';
  return 'user';
}
function isStaffRole(role) { return ['kurucu', 'yonetici', 'moderator', 'editor'].includes(normalizeRole(role)); }
function isOwnerRole(role) { return ['kurucu', 'yonetici'].includes(normalizeRole(role)); }

function adminSecret() {
  return `${process.env.ADMIN_PASSWORD || ''}:${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`;
}

function sign(value) {
  return crypto.createHmac('sha256', adminSecret()).update(value).digest('hex');
}

function createAdminToken(email) {
  const payload = { email, ts: Date.now() };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${encoded}.${sign(encoded)}`;
}

function verifyAdminToken(token) {
  if (!token || !process.env.ADMIN_PASSWORD) return false;
  const [encoded, sig] = String(token).split('.');
  if (!encoded || !sig) return false;
  const expected = sign(encoded);
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  } catch { return false; }
  const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
  const maxAge = 1000 * 60 * 60 * 24 * 7;
  return payload?.ts && Date.now() - Number(payload.ts) < maxAge;
}

function requireAdmin(body) {
  if (!verifyAdminToken(body.adminToken)) throw new Error('Yetkili işlem gerekiyor. Kurucu/Yönetici girişiyle tekrar giriş yap.');
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
      throw new Error('Supabase tabloyu schema cache içinde göremiyor. supabase/RUN-FIRST-v213-fix5-roles-maintenance.sql dosyasını çalıştır, 20-30 saniye bekle, sonra Vercel redeploy yap.');
    }
    throw new Error(detail || `Supabase API hata kodu: ${response.status}`);
  }
  return data;
}

async function findUser(email) {
  const rows = await supabaseFetch(`site_users?email=eq.${encodeURIComponent(email)}&select=id,name,email,role,password_hash,password_salt,is_active,banned_at,ban_reason,created_at,last_login_at&limit=1`, { method: 'GET' });
  return Array.isArray(rows) ? rows[0] : null;
}

async function listUsers() {
  const rows = await supabaseFetch('site_users?select=id,name,email,role,is_active,banned_at,ban_reason,created_at,last_login_at&order=created_at.desc', { method: 'GET' });
  return Array.isArray(rows) ? rows : [];
}

async function getRuntimeSettings() {
  try {
    const rows = await supabaseFetch('site_runtime_config?key=eq.maintenance_mode&select=key,value,updated_at&limit=1', { method: 'GET' });
    const value = Array.isArray(rows) && rows[0] ? rows[0].value : {};
    return { maintenanceMode: Boolean(value?.enabled), maintenanceMessage: value?.message || 'Hayatımız Oyun bakımda.' };
  } catch (error) {
    return { maintenanceMode: false, maintenanceMessage: 'Ayar tablosu bulunamadıysa site normal açılır.', warning: error.message };
  }
}

async function setMaintenanceMode(enabled) {
  const payload = [{ key: 'maintenance_mode', value: { enabled: Boolean(enabled), message: 'Hayatımız Oyun kısa süreli bakımda.', updatedAt: new Date().toISOString() } }];
  const rows = await supabaseFetch('site_runtime_config?on_conflict=key', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify(payload)
  });
  return Array.isArray(rows) ? rows[0] : rows;
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return json(res, 200, { ok: true });

  const parsedUrl = new URL(req.url || '/api', 'https://hayatimiz-oyun.local');
  const pathAction = parsedUrl.pathname.replace(/^\/api\/?/, '').split('/').filter(Boolean)[0];
  const action = req.query?.action || parsedUrl.searchParams.get('action') || pathAction || 'health';

  if (action === 'health' && req.method === 'GET') {
    return json(res, 200, {
      ok: true,
      version: 'v2.1.3-fix-5-authority-maintenance-actions',
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
        version: 'v2.1.3-fix-5-authority-maintenance-actions',
        supabaseConfigured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
        adminPasswordConfigured: Boolean(process.env.ADMIN_PASSWORD)
      });
    }

    if (action === 'settings-get') {
      const settings = await getRuntimeSettings();
      return json(res, 200, { ok: true, settings });
    }

    if (action === 'settings-set') {
      requireAdmin(body);
      const row = await setMaintenanceMode(Boolean(body.maintenanceMode));
      return json(res, 200, { ok: true, settings: { maintenanceMode: Boolean(row?.value?.enabled) } });
    }

    if (action === 'admin-login') {
      const username = String(body.username || '').trim().toLowerCase();
      const password = String(body.password || '');
      const adminPassword = process.env.ADMIN_PASSWORD;
      if (!adminPassword) return json(res, 500, { ok: false, error: 'ADMIN_PASSWORD Vercel ENV içinde eksik.' });
      const allowedUser = ['admin', 'kurucu', 'yonetici', 'yönetici', 'admin@hayatimizoyun.local', 'kurucu@hayatimizoyun.local'].includes(username);
      if (!allowedUser || password !== adminPassword) return json(res, 401, { ok: false, error: 'Yetkili kullanıcı adı veya şifre hatalı.' });
      return json(res, 200, { ok: true, session: { name: 'Kurucu', email: 'kurucu@hayatimizoyun.local', role: 'kurucu', adminToken: createAdminToken('kurucu@hayatimizoyun.local') } });
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
        body: JSON.stringify([{ name, email, password_hash, password_salt: salt, role: 'user', provider: 'site-form', is_active: true, metadata: { registeredFrom: 'site' } }])
      });
      const user = Array.isArray(inserted) ? inserted[0] : inserted;
      return json(res, 200, { ok: true, user: { id: user?.id, name, email, role: 'user' }, savedTo: 'public.site_users' });
    }

    if (action === 'login') {
      const email = String(body.email || '').trim().toLowerCase();
      const password = String(body.password || '');
      const user = await findUser(email);
      if (!user) return json(res, 401, { ok: false, error: 'Kullanıcı bulunamadı.' });
      if (!user.is_active || user.banned_at) return json(res, 403, { ok: false, error: user.ban_reason ? `Hesap banlı: ${user.ban_reason}` : 'Kullanıcı pasif veya banlı.' });
      const hash = hashPassword(password, user.password_salt || '');
      if (hash !== user.password_hash) return json(res, 401, { ok: false, error: 'E-posta veya şifre hatalı.' });
      await supabaseFetch(`site_users?id=eq.${encodeURIComponent(user.id)}`, { method: 'PATCH', body: JSON.stringify({ last_login_at: new Date().toISOString(), updated_at: new Date().toISOString() }) });
      const role = normalizeRole(user.role);
      const session = { id: user.id, name: user.name, email: user.email, role, is_active: user.is_active };
      if (isStaffRole(role)) session.adminToken = createAdminToken(user.email);
      return json(res, 200, { ok: true, user: session });
    }

    if (action === 'session-refresh') {
      const email = String(body.email || '').trim().toLowerCase();
      const user = await findUser(email);
      if (!user) return json(res, 404, { ok: false, error: 'Oturum kullanıcısı Supabase tablosunda bulunamadı.' });
      const role = normalizeRole(user.role);
      const session = { id: user.id, name: user.name, email: user.email, role, is_active: user.is_active, banned_at: user.banned_at, ban_reason: user.ban_reason };
      if (isStaffRole(role) && user.is_active && !user.banned_at) session.adminToken = createAdminToken(user.email);
      return json(res, 200, { ok: true, user: session });
    }

    if (action === 'users-list') {
      requireAdmin(body);
      return json(res, 200, { ok: true, users: (await listUsers()).map((user) => ({ ...user, role: normalizeRole(user.role) })) });
    }

    if (action === 'user-set-role') {
      requireAdmin(body);
      const requestedRole = normalizeRole(body.role);
      const role = ['user', 'editor', 'moderator', 'yonetici', 'kurucu', 'banned'].includes(requestedRole) ? requestedRole : 'user';
      await supabaseFetch(`site_users?id=eq.${encodeURIComponent(body.userId)}`, { method: 'PATCH', body: JSON.stringify({ role, is_active: true, banned_at: null, ban_reason: null, updated_at: new Date().toISOString() }) });
      return json(res, 200, { ok: true, users: (await listUsers()).map((user) => ({ ...user, role: normalizeRole(user.role) })) });
    }

    if (action === 'user-ban') {
      requireAdmin(body);
      await supabaseFetch(`site_users?id=eq.${encodeURIComponent(body.userId)}`, { method: 'PATCH', body: JSON.stringify({ role: 'banned', is_active: false, banned_at: new Date().toISOString(), ban_reason: String(body.reason || 'Yetkili panelinden banlandı').slice(0, 200), updated_at: new Date().toISOString() }) });
      return json(res, 200, { ok: true, users: (await listUsers()).map((user) => ({ ...user, role: normalizeRole(user.role) })) });
    }

    if (action === 'user-unban') {
      requireAdmin(body);
      await supabaseFetch(`site_users?id=eq.${encodeURIComponent(body.userId)}`, { method: 'PATCH', body: JSON.stringify({ role: 'user', is_active: true, banned_at: null, ban_reason: null, updated_at: new Date().toISOString() }) });
      return json(res, 200, { ok: true, users: (await listUsers()).map((user) => ({ ...user, role: normalizeRole(user.role) })) });
    }

    if (action === 'user-delete') {
      requireAdmin(body);
      await supabaseFetch(`site_users?id=eq.${encodeURIComponent(body.userId)}`, { method: 'DELETE' });
      return json(res, 200, { ok: true, users: (await listUsers()).map((user) => ({ ...user, role: normalizeRole(user.role) })) });
    }

    return json(res, 404, { ok: false, error: 'Bilinmeyen API işlemi.' });
  } catch (error) {
    return json(res, 500, { ok: false, error: error.message || 'Sunucu hatası.' });
  }
}
