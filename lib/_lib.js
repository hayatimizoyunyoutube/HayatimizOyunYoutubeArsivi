const { createClient } = require('@supabase/supabase-js');
function json(res, status, data) { res.statusCode=status; res.setHeader('Content-Type','application/json; charset=utf-8'); res.end(JSON.stringify(data)); }
function getSupabase(){ const url=process.env.SUPABASE_URL; const key=process.env.SUPABASE_SERVICE_ROLE_KEY; if(!url||!key) throw new Error('SUPABASE_URL veya SUPABASE_SERVICE_ROLE_KEY eksik.'); return createClient(url,key,{auth:{persistSession:false}}); }
async function readBody(req){ if(req.body&&typeof req.body==='object') return req.body; return await new Promise(resolve=>{let raw=''; req.on('data',c=>raw+=c); req.on('end',()=>{try{resolve(raw?JSON.parse(raw):{})}catch{resolve({})}});}); }
function roleRank(role='user'){ return ({user:0,'User':0,'Moderatör':1,'Editör':2,'Admin':3,'Kurucu':4}[role] ?? 0); }
function decodeHeader(v, fallback=''){
  try { return decodeURIComponent(String(v||fallback)); } catch { return String(v||fallback); }
}
function actor(req){ return { admin_name:decodeHeader(req.headers['x-admin-user']||req.headers['x-user-name'],'Kullanıcı'), admin_role:decodeHeader(req.headers['x-admin-role']||req.headers['x-user-role'],'user'), user_id:decodeHeader(req.headers['x-user-id'],'') }; }
function isAdmin(req){ const pass=req.headers['x-admin-password']||(req.body&&req.body.adminPassword); const a=actor(req); return Boolean((process.env.ADMIN_PASSWORD && pass===process.env.ADMIN_PASSWORD) || (a.user_id && roleRank(a.admin_role)>=roleRank('Moderatör'))); }
function isStaff(req,min='Editör'){ const a=actor(req); return isAdmin(req) && roleRank(a.admin_role)>=roleRank(min); }
async function requireStaff(req,min='Editör'){
  const pass=req.headers['x-admin-password']||(req.body&&req.body.adminPassword);
  if(process.env.ADMIN_PASSWORD && pass===process.env.ADMIN_PASSWORD) return true;
  const a=actor(req);
  if(!a.user_id) return false;
  if(roleRank(a.admin_role)<roleRank(min)) return false;
  try{
    const {data,error}=await getSupabase().from('users_app').select('id,username,role,banned').eq('id',a.user_id).single();
    if(error||!data||data.banned) return false;
    return roleRank(data.role)>=roleRank(min);
  }catch{return false;}
}
function slugify(v=''){ return v.toString().toLowerCase().trim().replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'') || `oyun-${Date.now()}`; }
async function log(action, detail='', req=null){ try{ const a=req?actor(req):{admin_name:'Sistem',admin_role:'Sistem'}; await getSupabase().from('admin_logs').insert({action,detail,admin_name:a.admin_name,admin_role:a.admin_role}); }catch{} }
module.exports={json,getSupabase,readBody,actor,isAdmin,isStaff,requireStaff,roleRank,slugify,log};
