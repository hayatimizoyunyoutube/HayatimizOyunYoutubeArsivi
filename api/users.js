const { json, getSupabase, requireStaff, readBody, log } = require('../lib/_lib');

module.exports = async (req, res) => {
  try {
    const s = getSupabase();
    const body = await readBody(req); req.body = body;
    if (!(await requireStaff(req,'Editör'))) return json(res, 401, { ok:false, message:'Bu işlem için yetkili kullanıcıyla giriş gerekli.' });

    if (req.method === 'GET') {
      const { data, error } = await s.from('users_app')
        .select('id,username,role,banned,xp,level,badges,watch_state,favorites,notifications,profile_photo,created_at')
        .order('created_at', { ascending:false });
      if (error) throw error;
      return json(res, 200, { ok:true, users:data || [] });
    }

    if (req.method === 'PATCH' || req.method === 'POST') {
      const { id, role, banned, reset } = body;
      if (!id) return json(res, 400, { ok:false, message:'Kullanıcı id gerekli.' });
      const patch = {};
      if (role) patch.role = role;
      if (typeof banned === 'boolean') patch.banned = banned;
      if (reset) Object.assign(patch, { xp:0, level:1, badges:[], watch_state:{} });
      const { data, error } = await s.from('users_app')
        .update(patch)
        .eq('id', id)
        .select('id,username,role,banned,xp,level,badges,watch_state,favorites,notifications,profile_photo,created_at')
        .single();
      if (error) throw error;
      await log('Kullanıcı güncellendi', `${data.username} / ${data.role}${data.banned ? ' / banlı' : ''}`, req);
      return json(res, 200, { ok:true, user:data });
    }

    if (req.method === 'DELETE') {
      const { id } = body;
      if (!id) return json(res, 400, { ok:false, message:'Kullanıcı id gerekli.' });
      const { error } = await s.from('users_app').delete().eq('id', id);
      if (error) throw error;
      await log('Kullanıcı silindi', id, req);
      return json(res, 200, { ok:true });
    }

    json(res, 405, { ok:false, message:'Method desteklenmiyor.' });
  } catch(e) { json(res, 500, { ok:false, message:e.message }); }
};
