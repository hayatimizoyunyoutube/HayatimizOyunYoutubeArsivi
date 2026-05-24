import crypto from 'crypto';

const STAFF_ROLES = ['kurucu','yonetici','moderator','editor'];
const OWNER_ROLES = ['kurucu','yonetici'];
const FEATURE_CATALOG = [
  { key:'admin_games_add_button', title:'Oyunlar sekmesine Oyun Ekle butonu ekle', group:'Siteye Gelmesi Gerekenler', next:'Oyun düzenleme ve silme butonlarını aktif et', target:'Yönetim Paneli > Oyunlar', description:'Oyun Ekle formunu görünür yapar.' },
  { key:'auto_cover_fetch', title:'Otomatik kapak resmi çekme sistemini aç', group:'Siteye Gelmesi Gerekenler', next:'RAWG kapak eşleştirme için manuel onay ekranı ekle', target:'Yönetim Paneli > Oyunlar', description:'Kapaksız oyunlara otomatik kapak atama butonunu açar.' },
  { key:'update_notes_editor', title:'Güncelleme notu editörünü Supabase site_update_notes tablosuna bağla', group:'Siteye Gelmesi Gerekenler', next:'Güncelleme notlarına sürüm filtresi ve arama ekle', target:'Yönetim Paneli > Güncelleme Notları', description:'Güncelleme notu editörünü açar.' },
  { key:'profile_photo_upload', title:'Profil fotoğrafı yükleme alanı ekle', group:'Siteye Gelmesi Gerekenler', next:'Profil fotoğrafını profile-photos bucket içine yükle', target:'Profilim', description:'Profil fotoğrafını profile-photos Storage bucket içine yükler.' },
  { key:'game_auto_meta_fetch', title:'Oyun adından tür, etiket ve açıklama otomatik çekme', group:'Siteye Gelmesi Gerekenler', next:'Oyun düzenleme formunda otomatik meta yenile butonu ekle', target:'Yönetim Paneli > Oyunlar', description:'Oyun adı yazınca tür, etiket ve kapak önerisi doldurma modülünü açar.' },
  { key:'feature_edit_delete', title:'Akıllı özelliklerde düzenleme ve silme sistemi', group:'Eklenen Özellikler', next:'Özellik geçmişi ve geri alma ekranı ekle', target:'Yönetim Paneli > Özellik Planı', description:'Özellik kartlarında düzenle ve sil işlemlerini açar.' },
  { key:'game_edit_delete_buttons', title:'Oyunları düzenle ve sil butonlarını aktif et', group:'Siteye Gelmesi Gerekenler', next:'Oyun düzenleme ekranına kapak önizleme ve otomatik meta yenile ekle', target:'Yönetim Paneli > Oyunlar', description:'Oyun kartlarına Düzenle/Sil butonlarını açar.' },
  { key:'active_features_bulk_clear', title:'Özellikleri Olan Özellikler bölümüne tümünü silme butonu ekle', group:'Siteye Gelmesi Gerekenler', next:'Özellik silme geçmişi ve geri alma paneli ekle', target:'Yönetim Paneli > Özellik Planı', description:'Aktif özellikleri tek tuşla pasife alma butonunu açar.' },
  { key:'apply_and_refresh_flow', title:'Siteye Uygula + Siteyi Yenile akışını aktif et', group:'Eklenen Özellikler', next:'Uygulama sonrası otomatik test raporu göster', target:'Yönetim Paneli > Özellik Planı', description:'Uygulama sonrası oturumdan çıkmadan panel verilerini yeniler.' },
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
    id:user.id, full_name:user.full_name || '', avatar_url:user.avatar_url || '', email:user.email, role,
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
    tags:game.tags || '',
    release_date:game.release_date || game.releaseDate || '',
    rawg_slug:game.rawg_slug || '',
    series_name:game.series_name || '',
    playlist_url:game.playlist_url || '',
    video_url:game.video_url || '',
    episodes:Array.isArray(game.episodes) ? game.episodes : [],
    watched_episode_count:Number(game.watched_episode_count ?? 0),
    series_order:Number(game.series_order ?? 0),
    description:game.description || '',
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

async function supabaseStorageUpload(bucket, objectPath, buffer, contentType){
  const { url, key } = env();
  const response = await fetch(`${url}/storage/v1/object/${bucket}/${objectPath}`, {
    method:'POST',
    headers:{ apikey:key, Authorization:`Bearer ${key}`, 'Content-Type':contentType || 'application/octet-stream', 'x-upsert':'true' },
    body:buffer
  });
  const text = await response.text();
  if(!response.ok) throw new Error(text || `Storage HTTP ${response.status}`);
  return `${url}/storage/v1/object/public/${bucket}/${objectPath}`;
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


function normalizeRawgDate(value){
  if(!value) return '';
  const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : String(value);
}
function localGameMeta(title){
  const t = String(title || '').toLowerCase();
  const rows = [
    [/assassin.*origins|origins/, { genre:'Aksiyon, Macera, RPG, Açık Dünya', released:'27.10.2017', score:8.5, cover:'https://media.rawg.io/media/games/336/336c6bd63d83cf8e59937ab8895d1240.jpg', slug:'assassins-creed-origins' }],
    [/red dead|rdr2/, { genre:'Aksiyon, Macera, Açık Dünya', released:'26.10.2018', score:9.7, cover:'https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg', slug:'red-dead-redemption-2' }],
    [/gta|grand theft auto/, { genre:'Aksiyon, Macera, Açık Dünya', released:'17.09.2013', score:9.3, cover:'https://media.rawg.io/media/games/20a/20aa03a10cb1e10f31f82a5e2ebf1e72.jpg', slug:'grand-theft-auto-v' }],
    [/resident|silent hill|alan wake|outlast|evil|dead space/, { genre:'Korku, Aksiyon, Macera', released:'', score:8.8, cover:'https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=900&auto=format&fit=crop', slug:'' }],
    [/god of war|elden ring|dark souls|sekiro|witcher/, { genre:'Aksiyon, RPG, Macera', released:'', score:9.2, cover:'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=900&auto=format&fit=crop', slug:'' }]
  ];
  return (rows.find(([r])=>r.test(t)) || [null, { genre:'Genel, Hikaye', released:'', score:8.5, cover:'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=900&auto=format&fit=crop', slug:'' }])[1];
}
function translateGenre(name){
  const map = { Action:'Aksiyon', Adventure:'Macera', RPG:'RPG', Shooter:'Nişancı', Puzzle:'Bulmaca', Strategy:'Strateji', Simulation:'Simülasyon', Sports:'Spor', Racing:'Yarış', Platformer:'Platform', Indie:'Bağımsız', Horror:'Korku', Fighting:'Dövüş' };
  return map[name] || name;
}
function stripHtml(value){ return String(value || '').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim(); }
function localTurkishStory(title, genre=''){
  const name = String(title || 'Bu oyun').trim() || 'Bu oyun';
  const key = (name + ' ' + genre).toLocaleLowerCase('tr-TR');
  if(key.includes('assassin') || key.includes('origins')) return `${name}, Antik Mısır döneminde geçen hikaye odaklı bir macera sunar. Oyuncu, Bayek'in kişisel intikam yolculuğunu, halkını koruma mücadelesini ve Suikastçı Kardeşliği'nin temellerine uzanan olayları bölüm bölüm takip eder.`;
  if(key.includes('resident') || key.includes('silent') || key.includes('alan wake') || key.includes('outlast') || key.includes('korku')) return `${name}, gerilim ve hayatta kalma atmosferini öne çıkaran hikaye odaklı bir deneyim sunar. Oyuncu, karanlık olayların arkasındaki sırrı çözerken bölüm bölüm ilerleyen tehditlerle yüzleşir.`;
  if(key.includes('rpg') || key.includes('açık dünya') || key.includes('macera') || key.includes('aksiyon')) return `${name}, keşif, mücadele ve hikaye ilerleyişini bir araya getiren bir seridir. Oyuncu görevleri tamamlayarak ana hikayeyi, yan içerikleri ve bölüm ilerlemesini takip eder.`;
  return `${name}, oyun arşivinde bölüm bölüm takip edilecek bir içerik olarak kaydedildi. Bu alanda oyunun hikayesi, ilerleme durumu, seri bilgisi ve izleme notları tutulur.`;
}
async function fetchRawgDetails(slug, key){
  if(!slug || !key) return null;
  const url = `https://api.rawg.io/api/games/${encodeURIComponent(slug)}?key=${encodeURIComponent(key)}`;
  const response = await fetch(url, { headers:{ 'User-Agent':'Hayatimiz-Oyun-Archive' } });
  if(!response.ok) return null;
  const data = await response.json();
  return { description:stripHtml(data.description_raw || data.description || ''), website:data.website || '' };
}
async function fetchRawgMeta(title){
  const key = process.env.RAWG_API_KEY || '';
  if(!key) return null;
  const url = `https://api.rawg.io/api/games?key=${encodeURIComponent(key)}&search=${encodeURIComponent(title)}&page_size=5&search_precise=false`;
  const response = await fetch(url, { headers:{ 'User-Agent':'Hayatimiz-Oyun-Archive' } });
  if(!response.ok) return null;
  const data = await response.json();
  const candidates = [];
  for(const game of (data?.results || []).slice(0,5)){
    const genres = Array.isArray(game.genres) ? game.genres.map(g=>translateGenre(g.name)).filter(Boolean).join(', ') : '';
    const details = await fetchRawgDetails(game.slug, key).catch(()=>null);
    candidates.push({
      title:game.name || title,
      genre:genres || 'Genel',
      released:normalizeRawgDate(game.released),
      score:Number(game.rating || 0) ? Math.min(10, Number(game.rating) * 2).toFixed(1) : 8.5,
      cover:game.background_image || '',
      rawg_slug:game.slug || '',
      description:localTurkishStory(game.name || title, genres)
    });
  }
  return candidates.length ? { ...candidates[0], candidates } : null;
}

function extractYoutubePlaylistId(raw){
  const value = String(raw || '').trim();
  if(!value) return '';
  try{
    const u = new URL(value);
    const list = u.searchParams.get('list');
    if(list) return list;
  }catch{}
  const m = value.match(/[?&]list=([^&\s]+)/) || value.match(/playlist\?list=([^&\s]+)/) || value.match(/list=([^&\s]+)/);
  return m ? decodeURIComponent(m[1]) : '';
}
function cleanYoutubeTitle(value){
  return String(value || '')
    .replace(/\\u0026/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}
function uniqueEpisodes(rows){
  const seen = new Set();
  const out = [];
  for(const row of rows || []){
    const videoId = String(row.videoId || '').trim();
    if(!videoId || seen.has(videoId)) continue;
    if(/deleted video|private video/i.test(row.title || '')) continue;
    seen.add(videoId);
    const idx = out.length + 1;
    out.push({
      id:`yt-${videoId}`,
      number:idx,
      title:cleanYoutubeTitle(row.title) || `${idx}. Bölüm`,
      description:'',
      thumbnail:row.thumbnail || `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
      videoId,
      videoUrl:`https://www.youtube.com/watch?v=${videoId}`,
      watched:false
    });
  }
  return out;
}
async function fetchYoutubePlaylistItemsNoKey(playlistUrl){
  const playlistId = extractYoutubePlaylistId(playlistUrl);
  if(!playlistId) return { count:0, episodes:[] };
  const url = `https://www.youtube.com/playlist?list=${encodeURIComponent(playlistId)}`;
  const response = await fetch(url, { headers:{ 'User-Agent':'Mozilla/5.0 HayatimizOyunBot/1.0', 'Accept-Language':'tr-TR,tr;q=0.9,en;q=0.7' } });
  if(!response.ok) return { count:0, episodes:[] };
  const html = await response.text();
  const rows = [];
  const blocks = html.split('playlistVideoRenderer');
  for(const block of blocks){
    const videoId = (block.match(/"videoId":"([a-zA-Z0-9_-]{11})"/) || [])[1];
    if(!videoId) continue;
    const simple = block.match(/"title":\{"simpleText":"([^"]+)"\}/);
    const runs = block.match(/"title":\{"runs":\[\{"text":"([^"]+)"\}\]/);
    const title = cleanYoutubeTitle((simple && simple[1]) || (runs && runs[1]) || '');
    rows.push({ videoId, title:title || `${rows.length+1}. Bölüm`, thumbnail:`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg` });
  }
  if(!rows.length){
    const ids = [...html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)].map(m=>m[1]);
    for(const videoId of ids) rows.push({ videoId, title:`${rows.length+1}. Bölüm`, thumbnail:`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg` });
  }
  const episodes = uniqueEpisodes(rows).slice(0, 500);
  return { count:episodes.length, episodes };
}
async function fetchYoutubePlaylistItems(playlistUrl){
  const playlistId = extractYoutubePlaylistId(playlistUrl);
  if(!playlistId) return { count:0, episodes:[] };
  const key = process.env.YOUTUBE_API_KEY || '';
  if(!key) return await fetchYoutubePlaylistItemsNoKey(playlistUrl);
  const rows = [];
  let pageToken = '';
  for(let page=0; page<20; page++){
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${encodeURIComponent(playlistId)}&key=${encodeURIComponent(key)}${pageToken?`&pageToken=${encodeURIComponent(pageToken)}`:''}`;
    const response = await fetch(url);
    if(!response.ok) break;
    const data = await response.json();
    (data.items || []).forEach((item)=>{
      const sn = item.snippet || {};
      const videoId = item.contentDetails?.videoId || sn.resourceId?.videoId || '';
      rows.push({
        videoId,
        title:sn.title || '',
        thumbnail:sn.thumbnails?.medium?.url || sn.thumbnails?.default?.url || `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`
      });
    });
    pageToken = data.nextPageToken || '';
    if(!pageToken) break;
  }
  let episodes = uniqueEpisodes(rows);
  if(!episodes.length) return await fetchYoutubePlaylistItemsNoKey(playlistUrl);
  return { count:episodes.length, episodes };
}
async function fetchYoutubePlaylistCount(playlistUrl){
  const key = process.env.YOUTUBE_API_KEY || '';
  if(!key) return 0;
  const playlistId = extractYoutubePlaylistId(playlistUrl);
  if(!playlistId) return 0;
  const url = `https://www.googleapis.com/youtube/v3/playlists?part=contentDetails&id=${encodeURIComponent(playlistId)}&key=${encodeURIComponent(key)}`;
  const response = await fetch(url);
  if(!response.ok) return 0;
  const data = await response.json();
  return Number(data?.items?.[0]?.contentDetails?.itemCount || 0);
}

export default async function handler(req, res){
  if(req.method === 'OPTIONS') return json(res, 200, { ok:true });
  const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
  const action = url.searchParams.get('action') || 'health';
  const body = req.method === 'POST' ? await readBody(req) : {};

  try{
    if(action === 'health') return json(res, 200, { ok:true, version:'v2.2.0 FIX 6 FINAL' });

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

    if(action === 'profile-photo-upload'){
      const email = String(body.email || '').trim().toLowerCase();
      if(!email) throw new Error('E-posta gerekli.');
      const dataUrl = String(body.dataUrl || '');
      const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
      if(!match) throw new Error('Dosya base64 dataUrl olarak gelmeli.');
      const contentType = String(body.contentType || match[1] || 'image/png');
      const ext = (String(body.fileName || '').split('.').pop() || contentType.split('/').pop() || 'png').replace(/[^a-z0-9]/gi,'').slice(0,8) || 'png';
      const safeEmail = email.replace(/[^a-z0-9_.-]/gi,'_');
      const objectPath = `${safeEmail}/${Date.now()}.${ext}`;
      const publicUrl = await supabaseStorageUpload('profile-photos', objectPath, Buffer.from(match[2], 'base64'), contentType);
      await supabase(`site_users?email=eq.${encodeURIComponent(email)}`, { method:'PATCH', body: JSON.stringify({ avatar_url:publicUrl, updated_at:new Date().toISOString() }) }).catch(()=>{});
      return json(res, 200, { ok:true, publicUrl });
    }

    if(action === 'profile-update'){
      const email = String(body.email || '').trim().toLowerCase();
      if(!email) throw new Error('E-posta gerekli.');
      const fullName = String(body.fullName || '').trim();
      const avatarUrl = String(body.avatarUrl || body.avatar_url || '').trim();
      const rows = await supabase(`site_users?email=eq.${encodeURIComponent(email)}`, { method:'PATCH', body: JSON.stringify({ full_name:fullName, avatar_url:avatarUrl, updated_at:new Date().toISOString() }) });
      return json(res, 200, { ok:true, user:cleanUser(rows?.[0]) });
    }

    if(action === 'users-list'){
      await requireOwner(body.adminToken);
      const rows = await supabase('site_users?select=id,full_name,avatar_url,email,role,is_active,banned_at,ban_reason,created_at,updated_at,last_login_at&order=created_at.desc', { method:'GET' });
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
      const value = Array.isArray(rows) && rows[0]?.value ? rows[0].value : { enabled:false, message:'Hayatımız Oyun kısa süreli bakımda.', eta:'' };
      return json(res, 200, { ok:true, maintenance:value });
    }

    if(action === 'settings-set'){
      await requireStaff(body.adminToken);
      const maintenance = body.maintenance || { enabled:false, message:'Hayatımız Oyun kısa süreli bakımda.', eta:'' };
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

    if(action === 'feature-plan-add'){
      await requireOwner(body.adminToken);
      const key = String(body.key || '').trim();
      const title = String(body.title || key).trim();
      if(!key || !title) throw new Error('Özellik adı gerekli.');
      const feature = {
        key, title,
        group:String(body.group || 'Adminin Önerileri'),
        target:String(body.target || 'Yönetim Paneli > Özellik Planı'),
        description:String(body.description || 'AI ile eklenen özellik isteği'),
        next:String(body.next || '')
      };
      await ensurePlannerFeature(feature).catch(()=>{});
      await supabase(`site_admin_planner?feature_key=eq.${encodeURIComponent(key)}`, {
        method:'PATCH',
        body: JSON.stringify({ group_name:feature.group, title:feature.title, status:'plan', feature_key:feature.key, updated_at:new Date().toISOString() })
      }).catch(()=>{});
      return json(res, 200, { ok:true, feature:{ key:feature.key, title:feature.title, status:'plan' } });
    }

    if(action === 'feature-apply'){
      await requireOwner(body.adminToken);
      const key = String(body.key || '').trim();
      if(!key) throw new Error('Özellik anahtarı gerekli.');
      const preset = FEATURE_CATALOG.find(f => f.key === key);
      const feature = {
        ...(preset || {}),
        key,
        title:String(body.title || preset?.title || key).trim(),
        group:String(body.group || preset?.group || 'Adminin Önerileri'),
        target:String(body.target || preset?.target || 'Özellik Planı'),
        description:String(body.description || preset?.description || 'Özel özellik isteği'),
        next:String(body.next || preset?.next || 'Bu özel istek için hazır modül kodunu ekle')
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

    if(action === 'feature-disable-all'){
      await requireOwner(body.adminToken);
      const keys = Array.isArray(body.keys) ? body.keys.map(k=>String(k)) : [];
      const rows = keys.length ? keys.map(key => ({ key })) : await supabase('site_features?select=key', { method:'GET' }).catch(()=>[]);
      for(const row of rows || []){
        if(row?.key){
          await supabase(`site_features?key=eq.${encodeURIComponent(row.key)}`, { method:'PATCH', body: JSON.stringify({ enabled:false, updated_at:new Date().toISOString() }) }).catch(()=>{});
          await supabase(`site_admin_planner?feature_key=eq.${encodeURIComponent(row.key)}`, { method:'PATCH', body: JSON.stringify({ status:'plan', updated_at:new Date().toISOString() }) }).catch(()=>{});
        }
      }
      return json(res, 200, { ok:true, disabled:(rows || []).map(r=>r.key).filter(Boolean) });
    }


    if(action === 'game-story'){
      await requireStaff(body.adminToken);
      const title = String(body.title || '').trim();
      if(!title) throw new Error('Oyun adı gerekli.');
      const meta = await fetchRawgMeta(title).catch(()=>null);
      return json(res, 200, { ok:true, story: localTurkishStory(title, meta?.genre || '') });
    }

    if(action === 'game-meta'){
      await requireStaff(body.adminToken);
      const title = String(body.title || '').trim();
      if(!title) throw new Error('Oyun adı gerekli.');
      const rawg = await fetchRawgMeta(title).catch(()=>null);
      const fallback = localGameMeta(title);
      return json(res, 200, { ok:true, meta:{ ...fallback, ...(rawg || {}), releaseDate:(rawg?.released || fallback.released || '') }, candidates: rawg?.candidates || [{ ...fallback, title }] });
    }

    if(action === 'games-list'){
      const rows = await supabase('games?select=id,title,genre,status,episode_count,score,cover_url,tags,release_date,rawg_slug,series_name,playlist_url,video_url,watched_episode_count,series_order,episodes,description,created_at,updated_at&order=created_at.desc', { method:'GET' }).catch(()=>[]);
      return json(res, 200, { ok:true, games:(rows || []).map(cleanGame) });
    }

    if(action === 'games-add'){
      await requireStaff(body.adminToken);
      const game = body.game || {};
      const title = String(game.title || '').trim();
      if(!title) throw new Error('Oyun adı gerekli.');
      const rows = await supabase('games', { method:'POST', body: JSON.stringify([{ title, genre:String(game.genre || 'Genel'), status:String(game.status || 'Devam Ediyor'), episode_count:Number(game.eps || game.episode_count || 0), score:Number(game.score || 0), cover_url:String(game.cover || game.cover_url || ''), tags:String(game.tags || ''), release_date:String(game.releaseDate || game.release_date || ''), rawg_slug:String(game.rawg_slug || game.rawgSlug || ''), series_name:String(game.seriesName || game.series_name || ''), playlist_url:String(game.playlistUrl || game.playlist_url || ''), video_url:String(game.videoUrl || game.video_url || ''), watched_episode_count:Number(game.watchedEps || game.watched_episode_count || 0), series_order:Number(game.seriesOrder || game.series_order || 0), episodes:Array.isArray(game.episodes) ? game.episodes : [], description:String(game.description || '') }]) });
      return json(res, 200, { ok:true, game:cleanGame(rows?.[0]) });
    }

    if(action === 'games-update'){
      await requireStaff(body.adminToken);
      const gameId = String(body.gameId || '').trim();
      if(!gameId) throw new Error('Oyun ID gerekli.');
      const game = body.game || {};
      const patch = {
        title:String(game.title || '').trim() || undefined,
        genre:String(game.genre || 'Genel'),
        status:String(game.status || 'Devam Ediyor'),
        episode_count:Number(game.eps ?? game.episode_count ?? 0),
        score:Number(game.score ?? 0),
        cover_url:String(game.cover || game.cover_url || ''),
        tags:String(game.tags || ''),
        release_date:String(game.releaseDate || game.release_date || ''),
        rawg_slug:String(game.rawg_slug || game.rawgSlug || ''),
        series_name:String(game.seriesName || game.series_name || ''),
        playlist_url:String(game.playlistUrl || game.playlist_url || ''),
        video_url:String(game.videoUrl || game.video_url || ''),
        watched_episode_count:Number(game.watchedEps ?? game.watched_episode_count ?? 0),
        series_order:Number(game.seriesOrder ?? game.series_order ?? 0),
        episodes:Array.isArray(game.episodes) ? game.episodes : [],
        description:String(game.description || ''),
        updated_at:new Date().toISOString()
      };
      Object.keys(patch).forEach(k => patch[k] === undefined && delete patch[k]);
      const rows = await supabase(`games?id=eq.${encodeURIComponent(gameId)}`, { method:'PATCH', body: JSON.stringify(patch) });
      return json(res, 200, { ok:true, game:cleanGame(rows?.[0]) });
    }


    if(action === 'episode-progress-save'){
      const gameId = String(body.gameId || '').trim();
      if(!gameId) throw new Error('Oyun ID gerekli.');
      const episodes = Array.isArray(body.episodes) ? body.episodes : [];
      const watched = Number(body.watchedEps ?? episodes.filter(ep=>ep && ep.watched).length ?? 0);
      const rows = await supabase(`games?id=eq.${encodeURIComponent(gameId)}`, { method:'PATCH', body: JSON.stringify({ episodes, watched_episode_count:watched, updated_at:new Date().toISOString() }) });
      return json(res, 200, { ok:true, game:cleanGame(rows?.[0]) });
    }

    if(action === 'games-delete'){
      await requireStaff(body.adminToken);
      const gameId = String(body.gameId || '').trim();
      if(!gameId) throw new Error('Oyun ID gerekli.');
      await supabase(`games?id=eq.${encodeURIComponent(gameId)}`, { method:'DELETE', headers:{ Prefer:'return=minimal' } });
      return json(res, 200, { ok:true });
    }


    if(action === 'playlist-count'){
      await requireStaff(body.adminToken);
      const count = await fetchYoutubePlaylistCount(String(body.playlistUrl || '')).catch(()=>0);
      return json(res, 200, { ok:true, count });
    }

    if(action === 'playlist-items'){
      await requireStaff(body.adminToken);
      const items = await fetchYoutubePlaylistItems(String(body.playlistUrl || '')).catch(()=>({ count:0, episodes:[] }));
      const count = items.count || await fetchYoutubePlaylistCount(String(body.playlistUrl || '')).catch(()=>0);
      return json(res, 200, { ok:true, count, episodes:items.episodes || [] });
    }


    if(action === 'calendar-events-list'){
      const rows = await supabase('site_calendar_events?select=id,title,event_date,event_time,event_type,cover_url,note,is_active,created_at,updated_at&is_active=eq.true&order=event_date.asc', { method:'GET' }).catch(()=>[]);
      const events = (rows || []).map(row => ({ id:row.id, title:row.title, date:row.event_date, time:row.event_time, type:row.event_type, cover:row.cover_url, note:row.note, isActive:row.is_active }));
      return json(res, 200, { ok:true, events });
    }

    if(action === 'calendar-events-upsert'){
      await requireStaff(body.adminToken);
      const event = body.event || {};
      const title = String(event.title || '').trim();
      const date = String(event.date || event.event_date || '').trim();
      if(!title || !date) throw new Error('Takvim kaydı için başlık ve tarih gerekli.');
      const payload = {
        title,
        event_date:date,
        event_time:String(event.time || event.event_time || '20:00'),
        event_type:String(event.type || event.event_type || 'Ana Yayın'),
        cover_url:String(event.cover || event.cover_url || ''),
        note:String(event.note || ''),
        is_active:true,
        updated_at:new Date().toISOString()
      };
      const rows = await supabase('site_calendar_events', { method:'POST', body: JSON.stringify([payload]) });
      const row = rows?.[0] || payload;
      return json(res, 200, { ok:true, event:{ id:row.id, title:row.title, date:row.event_date, time:row.event_time, type:row.event_type, cover:row.cover_url, note:row.note } });
    }

    if(action === 'calendar-events-delete'){
      await requireStaff(body.adminToken);
      const id = String(body.id || '').trim();
      if(!id) throw new Error('Takvim kayıt ID gerekli.');
      await supabase(`site_calendar_events?id=eq.${encodeURIComponent(id)}`, { method:'PATCH', body: JSON.stringify({ is_active:false, updated_at:new Date().toISOString() }) });
      return json(res, 200, { ok:true });
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


    if(action === 'episode-comment-add'){
      const gameId = String(body.gameId || '').trim();
      const episodeIndex = Number(body.episodeIndex || 0);
      const comment = String(body.comment || '').trim();
      if(!gameId || !comment) throw new Error('Oyun ve yorum gerekli.');
      const actor = verifyToken(body.adminToken || body.token || '')?.email || null;
      const rows = await supabase('site_episode_comments', { method:'POST', body: JSON.stringify([{ game_id:gameId, episode_index:episodeIndex, comment, actor_email:actor }]) }).catch(()=>[]);
      return json(res, 200, { ok:true, comment:rows?.[0] || { game_id:gameId, episode_index:episodeIndex, comment, actor_email:actor } });
    }

    if(action === 'notifications-list'){
      const rows = await supabase('site_notifications?select=id,title,message,type,is_read,created_at&order=created_at.desc&limit=50', { method:'GET' }).catch(()=>[]);
      return json(res, 200, { ok:true, notifications:rows || [] });
    }

    if(action === 'bulk-operation-log'){
      await requireStaff(body.adminToken);
      const title = String(body.title || 'Toplu işlem').trim();
      const details = body.details || {};
      const rows = await supabase('site_bulk_operations', { method:'POST', body: JSON.stringify([{ title, details, actor_email:verifyToken(body.adminToken)?.email || null }]) }).catch(()=>[]);
      return json(res, 200, { ok:true, operation:rows?.[0] || { title, details } });
    }

    return json(res, 404, { ok:false, error:'Bilinmeyen API action.' });
  }catch(error){
    return json(res, 400, { ok:false, error:error.message || String(error) });
  }
}
