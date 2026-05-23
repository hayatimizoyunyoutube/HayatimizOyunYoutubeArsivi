import { createHash, randomBytes, createHmac, timingSafeEqual } from 'node:crypto';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TOKEN_SECRET = process.env.ADMIN_PASSWORD || process.env.SUPABASE_SERVICE_ROLE_KEY || 'hayatimiz-oyun-local';
const STAFF_ROLES = ['kurucu','yonetici','moderator','editor'];
const OWNER_ROLES = ['kurucu','yonetici'];

function json(res, status, body){
  res.statusCode = status;
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  res.end(JSON.stringify(body));
}
function normalizeRole(role){
  const raw = String(role || 'user').trim().toLowerCase();
  const ascii = raw.replace(/ı/g,'i').replace(/İ/g,'i').replace(/ö/g,'o').replace(/ü/g,'u').replace(/ğ/g,'g').replace(/ş/g,'s').replace(/ç/g,'c');
  if(['kurucu','founder','owner','sahip'].includes(ascii)) return 'kurucu';
  if(['yonetici','yönetici','admin','administrator'].includes(ascii)) return 'yonetici';
  if(['moderator','mod'].includes(ascii)) return 'moderator';
  if(['editor','editör'].includes(ascii)) return 'editor';
  if(['banned','banli','banlı'].includes(ascii)) return 'banned';
  return 'user';
}
function isStaff(role){ return STAFF_ROLES.includes(normalizeRole(role)); }
function isOwner(role){ return OWNER_ROLES.includes(normalizeRole(role)); }
function cleanUser(user){
  if(!user) return null;
  return { id:user.id, full_name:user.full_name || user.name || '', email:user.email, role:normalizeRole(user.role), is_active:user.is_active !== false, banned_at:user.banned_at || null, ban_reason:user.ban_reason || null, created_at:user.created_at || null, updated_at:user.updated_at || null };
}
function hashPassword(password, salt = randomBytes(16).toString('hex')){
  const hash = createHash('sha256').update(`${salt}:${password}`).digest('hex');
  return { salt, hash };
}
function signToken(payload){
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 1000 * 60 * 60 * 12 })).toString('base64url');
  const sig = createHmac('sha256', TOKEN_SECRET).update(body).digest('base64url');
  return `${body}.${sig}`;
}
function verifyToken(token){
  if(!token || !String(token).includes('.')) throw new Error('Yetki token yok. Tekrar giriş yap.');
  const [body, sig] = String(token).split('.');
  const expected = createHmac('sha256', TOKEN_SECRET).update(body).digest('base64url');
  const a = Buffer.from(sig); const b = Buffer.from(expected);
  if(a.length !== b.length || !timingSafeEqual(a,b)) throw new Error('Yetki token geçersiz.');
  const payload = JSON.parse(Buffer.from(body,'base64url').toString('utf8'));
  if(Date.now() > payload.exp) throw new Error('Oturum süresi doldu. Tekrar giriş yap.');
  return { ...payload, role: normalizeRole(payload.role) };
}
async function readBody(req){
  return await new Promise(resolve=>{
    let data='';
    req.on('data', chunk=>data+=chunk);
    req.on('end', ()=>{ try{ resolve(data ? JSON.parse(data) : {}); }catch{ resolve({}); } });
  });
}
function requireEnv(){
  if(!SUPABASE_URL || !SERVICE_KEY) throw new Error('Vercel ENV eksik: SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli.');
}
async function supabase(path, options = {}){
  requireEnv();
  const url = `${SUPABASE_URL.replace(/\/$/,'')}/rest/v1/${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(options.headers || {})
    }
  });
  const text = await res.text();
  let data = null;
  try{ data = text ? JSON.parse(text) : null; }catch{ data = text; }
  if(!res.ok){
    const msg = data?.message || data?.hint || text || `Supabase hata ${res.status}`;
    throw new Error(msg);
  }
  return data;
}
async function getUserByEmail(email){
  const rows = await supabase(`site_users?email=eq.${encodeURIComponent(String(email).toLowerCase())}&limit=1`, { method:'GET' });
  return Array.isArray(rows) ? rows[0] : null;
}
async function getUserById(id){
  const rows = await supabase(`site_users?id=eq.${encodeURIComponent(id)}&limit=1`, { method:'GET' });
  return Array.isArray(rows) ? rows[0] : null;
}
async function requireOwner(adminToken){
  const token = verifyToken(adminToken);
  if(!isOwner(token.role)) throw new Error('Bu işlem için kurucu veya yönetici yetkisi gerekli.');
  const user = await getUserByEmail(token.email);
  if(!user || user.is_active === false || !isOwner(user.role)) throw new Error('Yetki güncel değil. Çıkış yapıp tekrar giriş yap.');
  return user;
}
async function requireStaff(adminToken){
  const token = verifyToken(adminToken);
  if(!isStaff(token.role)) throw new Error('Yetkili hesap gerekli.');
  const user = await getUserByEmail(token.email);
  if(!user || user.is_active === false || !isStaff(user.role)) throw new Error('Yetki güncel değil.');
  return user;
}

export default async function handler(req, res){
  if(req.method === 'OPTIONS') return json(res, 200, { ok:true });
  try{
    const action = req.query?.action || new URL(req.url, 'http://localhost').searchParams.get('action') || 'health';
    const body = await readBody(req);

    if(action === 'health') return json(res, 200, { ok:true, version:'v2.1.3-fix8', env:{ supabase:Boolean(SUPABASE_URL), service:Boolean(SERVICE_KEY) } });

    if(action === 'register'){
      const email = String(body.email || '').trim().toLowerCase();
      const fullName = String(body.fullName || body.name || '').trim();
      const password = String(body.password || '');
      if(!email || !password || password.length < 6) throw new Error('E-posta ve en az 6 karakter şifre gerekli.');
      const exists = await getUserByEmail(email).catch(err => { throw new Error(`site_users tablosu bulunamadı veya schema çalışmadı: ${err.message}`); });
      if(exists) throw new Error('Bu e-posta ile kayıt zaten var.');
      const { salt, hash } = hashPassword(password);
      const inserted = await supabase('site_users', { method:'POST', body: JSON.stringify([{ full_name: fullName || email.split('@')[0], email, password_hash: hash, password_salt: salt, role:'user', is_active:true }]) });
      const user = cleanUser(inserted?.[0]);
      return json(res, 200, { ok:true, user, adminToken: isStaff(user.role) ? signToken({ email:user.email, role:user.role }) : null });
    }

    if(action === 'login'){
      const email = String(body.email || '').trim().toLowerCase();
      const password = String(body.password || '');
      const userRaw = await getUserByEmail(email).catch(err => { throw new Error(`site_users tablosu bulunamadı veya schema çalışmadı: ${err.message}`); });
      if(!userRaw) throw new Error('Kullanıcı bulunamadı.');
      if(userRaw.is_active === false || normalizeRole(userRaw.role) === 'banned') throw new Error(userRaw.ban_reason || 'Hesap banlı.');
      const { hash } = hashPassword(password, userRaw.password_salt || '');
      if(hash !== userRaw.password_hash) throw new Error('Şifre hatalı.');
      await supabase(`site_users?id=eq.${encodeURIComponent(userRaw.id)}`, { method:'PATCH', body: JSON.stringify({ last_login_at:new Date().toISOString(), role: normalizeRole(userRaw.role) }) }).catch(()=>{});
      const user = cleanUser({ ...userRaw, role: normalizeRole(userRaw.role) });
      return json(res, 200, { ok:true, user, adminToken: isStaff(user.role) ? signToken({ email:user.email, role:user.role }) : null });
    }

    if(action === 'session-refresh'){
      const email = String(body.email || '').trim().toLowerCase();
      const user = cleanUser(await getUserByEmail(email));
      return json(res, 200, { ok:true, user, adminToken: user && isStaff(user.role) ? signToken({ email:user.email, role:user.role }) : null });
    }

    if(action === 'users-list'){
      await requireOwner(body.adminToken);
      const rows = await supabase('site_users?select=id,full_name,email,role,is_active,banned_at,ban_reason,created_at,updated_at&order=created_at.desc', { method:'GET' });
      return json(res, 200, { ok:true, users:(rows || []).map(cleanUser) });
    }

    if(action === 'user-role-set'){
      await requireOwner(body.adminToken);
      const role = normalizeRole(body.role);
      if(!['kurucu','yonetici','moderator','editor','user','banned'].includes(role)) throw new Error('Geçersiz rol.');
      const patch = role === 'banned' ? { role:'banned', is_active:false, banned_at:new Date().toISOString(), ban_reason:'Yönetim panelinden banlandı', updated_at:new Date().toISOString() } : { role, is_active:true, banned_at:null, ban_reason:null, updated_at:new Date().toISOString() };
      const rows = await supabase(`site_users?id=eq.${encodeURIComponent(body.userId)}`, { method:'PATCH', body: JSON.stringify(patch) });
      return json(res, 200, { ok:true, user:cleanUser(rows?.[0]) });
    }

    if(action === 'user-ban-toggle'){
      await requireOwner(body.adminToken);
      const target = await getUserById(body.userId);
      if(!target) throw new Error('Kullanıcı bulunamadı.');
      const ban = target.is_active !== false;
      const patch = ban ? { role:'banned', is_active:false, banned_at:new Date().toISOString(), ban_reason:'Yönetim panelinden banlandı', updated_at:new Date().toISOString() } : { role:'user', is_active:true, banned_at:null, ban_reason:null, updated_at:new Date().toISOString() };
      const rows = await supabase(`site_users?id=eq.${encodeURIComponent(body.userId)}`, { method:'PATCH', body: JSON.stringify(patch) });
      return json(res, 200, { ok:true, user:cleanUser(rows?.[0]) });
    }

    if(action === 'user-delete'){
      await requireOwner(body.adminToken);
      await supabase(`site_users?id=eq.${encodeURIComponent(body.userId)}`, { method:'DELETE', headers:{ Prefer:'return=minimal' } });
      return json(res, 200, { ok:true });
    }

    if(action === 'settings-get'){
      const rows = await supabase(`site_runtime_config?key=eq.maintenance_mode&limit=1`, { method:'GET' }).catch(()=>[]);
      const value = Array.isArray(rows) && rows[0]?.value ? rows[0].value : { enabled:false, message:'Hayatımız Oyun kısa süreli bakımda.' };
      return json(res, 200, { ok:true, maintenance:value });
    }

    if(action === 'settings-set'){
      await requireStaff(body.adminToken);
      const maintenance = body.maintenance || { enabled:false, message:'Hayatımız Oyun kısa süreli bakımda.' };
      await supabase('site_runtime_config?on_conflict=key', { method:'POST', headers:{ Prefer:'resolution=merge-duplicates,return=representation' }, body: JSON.stringify([{ key:'maintenance_mode', value:maintenance, updated_at:new Date().toISOString() }]) });
      return json(res, 200, { ok:true, maintenance });
    }

    return json(res, 404, { ok:false, error:'Bilinmeyen API action.' });
  }catch(error){
    return json(res, 400, { ok:false, error: error.message || String(error) });
  }
}
