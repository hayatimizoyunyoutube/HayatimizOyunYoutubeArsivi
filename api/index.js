import crypto from 'crypto';

const STAFF_ROLES = ['kurucu','yonetici','moderator','editor'];
const OWNER_ROLES = ['kurucu','yonetici'];
const FEATURE_CATALOG = [
  { key:'admin_games_add_button', title:'Oyunlar sekmesine Oyun Ekle butonu ekle', group:'Siteye Gelmesi Gerekenler', next:'Oyun düzenleme ve silme butonlarını aktif et', target:'Yönetim Paneli > Oyunlar', description:'Oyun Ekle formunu görünür yapar.' },
  { key:'auto_cover_fetch', title:'Otomatik kapak resmi çekme sistemini aç', group:'Siteye Gelmesi Gerekenler', next:'RAWG kapak eşleştirme için manuel onay ekranı ekle', target:'Yönetim Paneli > Oyunlar', description:'Kapaksız oyunlara otomatik kapak atama butonunu açar.' },
  { key:'update_notes_editor', title:'Güncelleme notu editörünü Supabase site_update_notes tablosuna bağla', group:'Siteye Gelmesi Gerekenler', next:'Güncelleme notlarına sürüm filtresi ve arama ekle', target:'Yönetim Paneli > Güncelleme Notları', description:'Güncelleme notu editörünü açar.' },
  { key:'profile_photo_upload', title:'Profil fotoğrafı yükleme alanı ekle', group:'Siteye Gelmesi Gerekenler', next:'Profil fotoğrafını profile-photos bucket içine yükle', target:'Profilim', description:'Profil fotoğrafı alanını açar.' },
  { key:'missing_cover_warning', title:'Oyun kartında eksik kapak sarı uyarısını otomatik göster', group:'Gözden Kaçanlar', next:'Eksik kapakları RAWG kapağıyla eşleştir', target:'Oyun kartları', description:'Kapak eksik uyarısını açar.' },
  { key:'maintenance_message_editor', title:'Bakım modu yazısını panelden düzenleme alanı ekle', group:'Siteye Gelmesi Gerekenler', next:'Bakım moduna tahmini açılış zamanı ekle', target:'Yönetim Paneli > Bakım Modu', description:'Bakım mesajı düzenleme alanını güçlendirir.' }
];

function json(res, status, payload){
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}
function normalizeRole(role){
  const raw = String(role || 'user').trim().toLowerCase();
  const ascii = raw.replace(/ı/g,'i').replace(/İ/g,'i').replace(/ö/g,'o').replace(/ü/g,'u').replace(/ğ/g,'g').replace(/ş/g,'s').replace(/ç/g,'c');
  if(['kurucu','founder','owner','sahip'].includes(ascii)) return 'kurucu';
  if(['yonetici','yönetici','admin','administrator'].includes(ascii)) return 'yonetici';
  if(['moderator','mod','moderatör'].includes(ascii)) return 'moderator';
  if(['editor','editör'].includes(ascii)) return 'editor';
  if(['banned','banli','banlı'].includes(ascii)) return 'banned';
  return 'user';
}
function isStaff(role){ return STAFF_ROLES.includes(normalizeRole(role)); }
function isOwner(role){ return OWNER_ROLES.includes(normalizeRole(role)); }
function signToken(payload){
  const secret = process.env.ADMIN_PASSWORD || process.env.SUPABASE_SERVICE_ROLE_KEY || 'local-secret';
  const body = Buffer.from(JSON.stringify({ ...payload, iat:Date.now() })).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${sig}`;
}
function verifyToken(token){
  if(!token || !token.includes('.')) return null;
  const secret = process.env.ADMIN_PASSWORD || process.env.SUPABASE_SERVICE_ROLE_KEY || 'local-secret';
  const [body, sig] = token.split('.');
  const expected = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  if(sig !== expected) return null;
  try { return JSON.parse(Buffer.from(body, 'base64url').toString('utf8')); } catch { return null; }
}
function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')){
  const hash = crypto.pbkdf2Sync(String(password), salt, 120000, 32, 'sha256').toString('hex');
  return { salt, hash };
}
function cleanUser(user){
  if(!user) return null;
  const role = normalizeRole(user.role);
  return {
    id:user.id, full_name:user.full_name || '', email:user.email, role,
    is_active:user.is_active !== false && role !== 'banned',
    banned_at:user.banned_at || null, ban_reason:user.ban_reason || null,
    created_at:user.created_at, updated_at:user.updated_at, last_login_at:user.last_login_at
  };
}
function cleanGame(game){
  if(!game) return null;
  return {
    id:game.id,
    title:game.title || game.name || 'İsimsiz Oyun',
    genre:game.genre || game.category || 'Genel',
    status:game.status || 'Devam Ediyor',
    episode_count:Number(game.episode_count ?? game.eps ?? 0),
    score:Number(game.score ?? 0),
    cover_url:game.cover_url || game.cover || '',
    created_at:game.created_at,
    updated_at:game.updated_at
  };
}
async function readBody(req){
  let raw = '';
  for await (const chunk of req) raw += chunk;
  if(!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}
function env(){
  const url = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if(!url || !key) throw new Error('Vercel ENV içinde SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY olmalı.');
  return { url, key };
}
async function supabase(path, options = {}){
  const { url, key } = env();
  const fullUrl = `${url}/rest/v1/${path}`;
  const headers = {
    apikey:key,
    Authorization:`Bearer ${key}`,
    'Content-Type':'application/json',
    Prefer: options.headers?.Prefer || 'return=representation',
    ...(options.headers || {})
  };
  const response = await fetch(fullUrl, { ...options, headers });
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if(!response.ok){
    const message = data?.message || data?.hint || text || `Supabase HTTP ${response.status}`;
    throw new Error(message);
  }
  return data;
}
async function getUserByEmail(email){
  const rows = await supabase(`site_users?email=eq.${encodeURIComponent(email)}&limit=1`, { method:'GET' });
  return Array.isArray(rows) ? rows[0] : null;
}
async function getUserById(id){
  const rows = await supabase(`site_users?id=eq.${encodeURIComponent(id)}&limit=1`, { method:'GET' });
  return Array.isArray(rows) ? rows[0] : null;
}
async function requireStaff(token){
  const data = verifyToken(token);
  if(!data || !isStaff(data.role)) throw new Error('Yetkili oturum gerekli.');
  const user = await getUserByEmail(String(data.email || '').toLowerCase()).catch(()=>null);
  if(!user || user.is_active === false || !isStaff(user.role)) throw new Error('Yetki güncel değil. Tekrar giriş yap.');
  return user;
}
async function requireOwner(token){
  const user = await requireStaff(token);
  if(!isOwner(user.role)) throw new Error('Bu işlem için kurucu veya yönetici gerekir.');
  return user;
}
async function ensurePlannerFeature(feature){
  const existing = await supabase(`site_admin_planner?title=eq.${encodeURIComponent(feature.title)}&limit=1`, { method:'GET' }).catch(()=>[]);
  if(!Array.isArray(existing) || !existing.length){
    await supabase('site_admin_planner', { method:'POST', body: JSON.stringify([{ group_name:feature.group, title:feature.title, status:'plan', feature_key:feature.key }]) }).catch(()=>{});
  }
}

export default async function handler(req, res){
  if(req.method === 'OPTIONS') return json(res, 200, { ok:true });
  const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
  const action = url.searchParams.get('action') || 'health';
  const body = req.method === 'POST' ? await readBody(req) : {};

  try{
    if(action === 'health') return json(res, 200, { ok:true, version:'v2.1.4.4' });

    if(action === 'register'){
      const email = String(body.email || '').trim().toLowerCase();
      const fullName = String(body.fullName || '').trim();
      const password = String(body.password || '');
      if(!email || !password) throw new Error('E-posta ve şifre gerekli.');
      if(await getUserByEmail(email)) throw new Error('Bu e-posta zaten kayıtlı.');
      const { salt, hash } = hashPassword(password);
      const rows = await supabase('site_users', { method:'POST', body: JSON.stringify([{ full_name:fullName || email.split('@')[0], email, password_hash:hash, password_salt:salt, role:'user', is_active:true }]) });
      const user = cleanUser(rows?.[0]);
      return json(res, 200, { ok:true, user, adminToken:isStaff(user.role) ? signToken({ email:user.email, role:user.role }) : null });
    }

    if(action === 'login'){
      const email = String(body.email || '').trim().toLowerCase();
      const password = String(body.password || '');
      const userRaw = await getUserByEmail(email);
      if(!userRaw) throw new Error('Kullanıcı bulunamadı.');
      const role = normalizeRole(userRaw.role);
      if(userRaw.is_active === false || role === 'banned') throw new Error(userRaw.ban_reason || 'Hesap banlı.');
      const { hash } = hashPassword(password, userRaw.password_salt || '');
      if(hash !== userRaw.password_hash) throw new Error('Şifre hatalı.');
      await supabase(`site_users?id=eq.${encodeURIComponent(userRaw.id)}`, { method:'PATCH', body: JSON.stringify({ last_login_at:new Date().toISOString(), role }) }).catch(()=>{});
      const user = cleanUser({ ...userRaw, role });
      return json(res, 200, { ok:true, user, adminToken:isStaff(user.role) ? signToken({ email:user.email, role:user.role }) : null });
    }

    if(action === 'session-refresh'){
      const email = String(body.email || '').trim().toLowerCase();
      const user = cleanUser(await getUserByEmail(email));
      return json(res, 200, { ok:true, user, adminToken:user && isStaff(user.role) ? signToken({ email:user.email, role:user.role }) : null });
    }

    if(action === 'profile-update'){
      const email = String(body.email || '').trim().toLowerCase();
      if(!email) throw new Error('E-posta gerekli.');
      const fullName = String(body.fullName || '').trim();
      const rows = await supabase(`site_users?email=eq.${encodeURIComponent(email)}`, { method:'PATCH', body: JSON.stringify({ full_name:fullName, updated_at:new Date().toISOString() }) });
      return json(res, 200, { ok:true, user:cleanUser(rows?.[0]) });
    }

    if(action === 'users-list'){
      await requireOwner(body.adminToken);
      const rows = await supabase('site_users?select=id,full_name,email,role,is_active,banned_at,ban_reason,created_at,updated_at,last_login_at&order=created_at.desc', { method:'GET' });
      return json(res, 200, { ok:true, users:(rows || []).map(cleanUser) });
    }

    if(action === 'user-role-set'){
      await requireOwner(body.adminToken);
      const role = normalizeRole(body.role);
      if(!['kurucu','yonetici','moderator','editor','user','banned'].includes(role)) throw new Error('Geçersiz rol.');
      const patch = role === 'banned'
        ? { role:'banned', is_active:false, banned_at:new Date().toISOString(), ban_reason:'Yönetim panelinden banlandı', updated_at:new Date().toISOString() }
        : { role, is_active:true, banned_at:null, ban_reason:null, updated_at:new Date().toISOString() };
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
      const rows = await supabase('site_runtime_config?key=eq.maintenance_mode&limit=1', { method:'GET' }).catch(()=>[]);
      const value = Array.isArray(rows) && rows[0]?.value ? rows[0].value : { enabled:false, message:'Hayatımız Oyun kısa süreli bakımda.' };
      return json(res, 200, { ok:true, maintenance:value });
    }

    if(action === 'settings-set'){
      await requireStaff(body.adminToken);
      const maintenance = body.maintenance || { enabled:false, message:'Hayatımız Oyun kısa süreli bakımda.' };
      await supabase('site_runtime_config?on_conflict=key', { method:'POST', headers:{ Prefer:'resolution=merge-duplicates,return=representation' }, body: JSON.stringify([{ key:'maintenance_mode', value:maintenance, updated_at:new Date().toISOString() }]) });
      return json(res, 200, { ok:true, maintenance });
    }

    if(action === 'features-list'){
      const rows = await supabase('site_features?select=key,enabled&order=created_at.asc', { method:'GET' }).catch(()=>[]);
      const features = {};
      FEATURE_CATALOG.forEach(f => { features[f.key] = false; });
      (rows || []).forEach(row => { if(row?.key) features[row.key] = row.enabled === true; });
      return json(res, 200, { ok:true, features });
    }

    if(action === 'feature-apply'){
      await requireOwner(body.adminToken);
      const key = String(body.key || '').trim();
      if(!key) throw new Error('Özellik anahtarı gerekli.');
      const preset = FEATURE_CATALOG.find(f => f.key === key);
      const feature = preset || {
        key,
        title:String(body.title || key).trim(),
        group:String(body.group || 'Adminin Önerileri'),
        target:String(body.target || 'Özellik Planı'),
        description:String(body.description || 'Özel özellik isteği'),
        next:String(body.next || 'Bu özel istek için hazır modül kodunu ekle')
      };
      await supabase('site_features?on_conflict=key', {
        method:'POST',
        headers:{ Prefer:'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify([{ key:feature.key, title:feature.title, description:feature.description || feature.next, enabled:true, updated_at:new Date().toISOString() }])
      });
      await ensurePlannerFeature(feature).catch(()=>{});
      const planner = await supabase(`site_admin_planner?title=eq.${encodeURIComponent(feature.title)}`, {
        method:'PATCH',
        body: JSON.stringify({ status:'tamam', feature_key:feature.key, updated_at:new Date().toISOString() })
      }).catch(()=>[]);
      if(feature.next){
        const existingNext = await supabase(`site_admin_planner?title=eq.${encodeURIComponent(feature.next)}&limit=1`, { method:'GET' }).catch(()=>[]);
        if(!Array.isArray(existingNext) || !existingNext.length){
          await supabase('site_admin_planner', { method:'POST', body: JSON.stringify([{ group_name:feature.group || 'Adminin Önerileri', title:feature.next, status:'plan' }]) }).catch(()=>{});
        }
      }
      return json(res, 200, { ok:true, feature:{ key:feature.key, enabled:true, preset:Boolean(preset) }, planner });
    }


    if(action === 'feature-disable'){
      await requireOwner(body.adminToken);
      const key = String(body.key || '').trim();
      if(!key) throw new Error('Özellik anahtarı gerekli.');
      await supabase(`site_features?key=eq.${encodeURIComponent(key)}`, { method:'PATCH', body: JSON.stringify({ enabled:false, updated_at:new Date().toISOString() }) }).catch(()=>{});
      await supabase(`site_admin_planner?feature_key=eq.${encodeURIComponent(key)}`, { method:'PATCH', body: JSON.stringify({ status:'plan', updated_at:new Date().toISOString() }) }).catch(()=>{});
      return json(res, 200, { ok:true, key, enabled:false });
    }

    if(action === 'games-list'){
      const rows = await supabase('games?select=id,title,genre,status,episode_count,score,cover_url,tags,created_at,updated_at&order=created_at.desc', { method:'GET' }).catch(()=>[]);
      return json(res, 200, { ok:true, games:(rows || []).map(cleanGame) });
    }

    if(action === 'games-add'){
      await requireStaff(body.adminToken);
      const game = body.game || {};
      const title = String(game.title || '').trim();
      if(!title) throw new Error('Oyun adı gerekli.');
      const rows = await supabase('games', { method:'POST', body: JSON.stringify([{ title, genre:String(game.genre || 'Genel'), status:String(game.status || 'Devam Ediyor'), episode_count:Number(game.eps || game.episode_count || 0), score:Number(game.score || 0), cover_url:String(game.cover || game.cover_url || ''), tags:String(game.tags || '') }]) });
      return json(res, 200, { ok:true, game:cleanGame(rows?.[0]) });
    }

    if(action === 'planner-list'){
      await requireStaff(body.adminToken);
      const planner = await supabase('site_admin_planner?select=id,group_name,title,status,feature_key,created_at&order=created_at.asc', { method:'GET' }).catch(()=>[]);
      const notes = await supabase('site_admin_notes?select=id,note,created_at&order=created_at.desc&limit=20', { method:'GET' }).catch(()=>[]);
      return json(res, 200, { ok:true, planner:(planner || []).map(p=>({ id:p.id, group:p.group_name, text:p.title, status:p.status, feature_key:p.feature_key })), notes:notes || [] });
    }

    if(action === 'planner-complete-add'){
      await requireStaff(body.adminToken);
      if(body.completedId && !String(body.completedId).startsWith('local-')){
        await supabase(`site_admin_planner?id=eq.${encodeURIComponent(body.completedId)}`, { method:'PATCH', body: JSON.stringify({ status:'tamam', updated_at:new Date().toISOString() }) }).catch(()=>{});
      }
      const group = String(body.group || 'Adminin Önerileri');
      const nextText = String(body.nextText || 'Yeni kontrol maddesi');
      await supabase('site_admin_planner', { method:'POST', body: JSON.stringify([{ group_name:group, title:nextText, status:'plan' }]) }).catch(()=>{});
      return json(res, 200, { ok:true });
    }

    if(action === 'admin-note-add'){
      await requireStaff(body.adminToken);
      const note = String(body.note || '').trim();
      if(!note) throw new Error('Not boş olamaz.');
      const actor = verifyToken(body.adminToken)?.email || null;
      const rows = await supabase('site_admin_notes', { method:'POST', body: JSON.stringify([{ note, actor_email:actor }]) });
      return json(res, 200, { ok:true, note:rows?.[0] });
    }


    if(action === 'update-note-add'){
      await requireStaff(body.adminToken);
      const version = String(body.version || '').trim();
      const title = String(body.title || '').trim();
      if(!version || !title) throw new Error('Sürüm ve başlık gerekli.');
      const note = String(body.written || body.summary || '').trim();
      const summary = String(body.summary || '').trim();
      const image_url = String(body.image || '').trim();
      const rows = await supabase('site_update_notes', {
        method:'POST',
        body: JSON.stringify([{ version, title, note, summary, image_url, status:'published', created_at:new Date().toISOString() }])
      });
      return json(res, 200, { ok:true, note:rows?.[0] });
    }

    return json(res, 404, { ok:false, error:'Bilinmeyen API action.' });
  }catch(error){
    return json(res, 400, { ok:false, error:error.message || String(error) });
  }
}
