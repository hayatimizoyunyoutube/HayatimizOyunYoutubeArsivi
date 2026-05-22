const bcrypt = require('bcryptjs');
const { json, getSupabase, readBody } = require('../lib/_lib');
const SELECT='id,username,role,banned,xp,level,badges,watch_state,favorites,notifications,profile_photo,social_links,created_at';
module.exports = async (req, res) => {
  try {
    const s = getSupabase(); const b = await readBody(req);
    if (req.method !== 'POST') return json(res,405,{ok:false});
    const action = b.action;
    if (action === 'register') {
      if (!b.username || !b.password) return json(res,400,{ok:false,message:'Kullanıcı adı ve şifre gerekli.'});
      const password_hash = await bcrypt.hash(b.password, 10);
      const { data, error } = await s.from('users_app').insert({ username:b.username, password_hash }).select(SELECT).single();
      if (error) throw error; return json(res,200,{ok:true,user:data});
    }
    if (action === 'login') {
      const { data:user, error } = await s.from('users_app').select('*').eq('username', b.username).single();
      if (error || !user) return json(res,401,{ok:false,message:'Kullanıcı bulunamadı.'});
      if (user.banned) return json(res,403,{ok:false,message:'Bu kullanıcı banlı.'});
      const ok = await bcrypt.compare(b.password || '', user.password_hash);
      if (!ok) return json(res,401,{ok:false,message:'Şifre yanlış.'});
      delete user.password_hash; return json(res,200,{ok:true,user});
    }
    if (action === 'watch') {
      const { id, watch_state, xp, level } = b;
      const { data, error } = await s.from('users_app').update({ watch_state, xp, level }).eq('id', id).select(SELECT).single();
      if (error) throw error; return json(res,200,{ok:true,user:data});
    }
    if (action === 'favorites') {
      const { data, error } = await s.from('users_app').update({ favorites:b.favorites||{games:[],series:[]} }).eq('id', b.id).select(SELECT).single();
      if (error) throw error; return json(res,200,{ok:true,user:data});
    }
    if (action === 'profile') {
      const patch={}; if('profile_photo' in b)patch.profile_photo=String(b.profile_photo||'').trim(); if('social_links' in b)patch.social_links=String(b.social_links||'').trim();
      const { data, error } = await s.from('users_app').update(patch).eq('id', b.id).select(SELECT).single();
      if (error) throw error; return json(res,200,{ok:true,user:data});
    }
    json(res,400,{ok:false,message:'Geçersiz işlem.'});
  } catch(e) { json(res,500,{ok:false,message:e.message}); }
};
