const { json, getSupabase, readBody, requireStaff, log } = require('../lib/_lib');

async function findUserByUsername(s, username){
  const name=String(username||'').trim();
  if(!name) return null;
  const {data,error}=await s.from('users_app').select('id,username').ilike('username', name).limit(1).maybeSingle();
  if(error) throw error;
  return data;
}
async function notify(s, user_id, text, type='social'){
  try{
    const {data:u}=await s.from('users_app').select('notifications').eq('id',user_id).single();
    const list=Array.isArray(u?.notifications)?u.notifications:[];
    list.unshift({id:String(Date.now())+Math.random().toString(36).slice(2),type,text,read:false,created_at:new Date().toISOString()});
    await s.from('users_app').update({notifications:list.slice(0,60)}).eq('id',user_id);
  }catch{}
}

module.exports = async (req,res)=>{ try{ const s=getSupabase(); const b=await readBody(req); const action=(req.query&&req.query.action)||b.action||'feed';
  if(req.method==='GET'){
    if(action==='feedback'){
      if(!(await requireStaff(req,'Moderatör'))) return json(res,401,{ok:false,message:'Bu işlem için yetkili kullanıcıyla giriş gerekli.'});
      const {data,error}=await s.from('feedback').select('*').order('created_at',{ascending:false}).limit(300);
      if(error) throw error;
      return json(res,200,{ok:true,feedback:data||[]});
    }
    if(action==='comments'){
      const {game_slug}=req.query; let q=s.from('comments').select('*').order('created_at',{ascending:false}).limit(100); if(game_slug) q=q.eq('game_slug',game_slug); const {data,error}=await q; if(error) throw error; return json(res,200,{ok:true,comments:data||[]});
    }
    if(action==='friends'){
      const {user_id}=req.query; if(!user_id)return json(res,400,{ok:false,message:'user_id gerekli.'});
      const {data,error}=await s.from('friends').select('*').or(`requester_id.eq.${user_id},receiver_id.eq.${user_id}`).order('created_at',{ascending:false}); if(error) throw error; return json(res,200,{ok:true,friends:data||[]});
    }
    if(action==='notifications'){
      const {user_id}=req.query; if(!user_id)return json(res,400,{ok:false,message:'user_id gerekli.'});
      const {data,error}=await s.from('users_app').select('notifications').eq('id',user_id).single(); if(error) throw error;
      return json(res,200,{ok:true,notifications:data?.notifications||[]});
    }
    if(action==='messages'){
      const {user_id,friend_id}=req.query; if(!user_id||!friend_id)return json(res,400,{ok:false,message:'user_id ve friend_id gerekli.'});
      const {data,error}=await s.from('messages').select('*').or(`and(sender_id.eq.${user_id},receiver_id.eq.${friend_id}),and(sender_id.eq.${friend_id},receiver_id.eq.${user_id})`).order('created_at',{ascending:true}).limit(200); if(error) throw error;
      await s.from('messages').update({read_at:new Date().toISOString()}).eq('receiver_id',user_id).eq('sender_id',friend_id).is('read_at',null);
      return json(res,200,{ok:true,messages:data||[]});
    }
  }
  if(action==='feedback'){
    if(req.method==='POST'){
      const f=b.feedback||b;
      const row={type:f.type||f.category||'Öneri',name:f.name||f.username||'Ziyaretçi',email:f.email||'',message:f.message||f.body||'',status:'new'};
      const {data,error}=await s.from('feedback').insert(row).select().single(); if(error) throw error;
      return json(res,200,{ok:true,feedback:data});
    }
    if(req.method==='PATCH'){
      if(!(await requireStaff(req,'Moderatör'))) return json(res,401,{ok:false,message:'Bu işlem için yetkili kullanıcıyla giriş gerekli.'});
      const {id,status}=b; if(!id)return json(res,400,{ok:false,message:'id gerekli.'});
      const {data,error}=await s.from('feedback').update({status:status||'read'}).eq('id',id).select().single(); if(error) throw error;
      await log('Geri bildirim güncellendi', String(id), req);
      return json(res,200,{ok:true,feedback:data});
    }
    if(req.method==='DELETE'){
      if(!(await requireStaff(req,'Moderatör'))) return json(res,401,{ok:false,message:'Bu işlem için yetkili kullanıcıyla giriş gerekli.'});
      const id=b.id || (req.query&&req.query.id); if(!id)return json(res,400,{ok:false,message:'id gerekli.'});
      const {data,error}=await s.from('feedback').delete().eq('id',id).select().single(); if(error) throw error;
      await log('Geri bildirim silindi', String(id), req);
      return json(res,200,{ok:true,feedback:data});
    }
  }
  if(action==='comment'){
    const row={user_id:b.user_id,username:b.username||'Kullanıcı',game_slug:b.game_slug||'',body:b.body||'',spoiler:!!b.spoiler}; const {data,error}=await s.from('comments').insert(row).select().single(); if(error) throw error; return json(res,200,{ok:true,comment:data});
  }
  if(action==='friend_request' || action==='friend_by_username'){
    const receiver=await findUserByUsername(s,b.receiver_username);
    if(!receiver) return json(res,404,{ok:false,message:'Bu kullanıcı adı bulunamadı.'});
    if(String(receiver.id)===String(b.requester_id)) return json(res,400,{ok:false,message:'Kendini arkadaş ekleyemezsin.'});
    const {data:existing,error:exErr}=await s.from('friends').select('*').or(`and(requester_id.eq.${b.requester_id},receiver_id.eq.${receiver.id}),and(requester_id.eq.${receiver.id},receiver_id.eq.${b.requester_id})`).limit(1).maybeSingle();
    if(exErr) throw exErr; if(existing) return json(res,200,{ok:true,friend:existing,message:'Bu kullanıcıyla zaten istek veya arkadaşlık var.'});
    const row={requester_id:b.requester_id,requester_name:b.requester_name,receiver_id:receiver.id,receiver_name:receiver.username,status:'pending'};
    const {data,error}=await s.from('friends').insert(row).select().single(); if(error) throw error;
    await notify(s, receiver.id, `${b.requester_name||'Bir kullanıcı'} sana arkadaşlık isteği gönderdi.`, 'friend');
    return json(res,200,{ok:true,friend:data});
  }
  if(action==='friend_respond'){
    const status=b.status==='accepted'?'accepted':'rejected';
    const {data:fr,error:readErr}=await s.from('friends').select('*').eq('id',b.id).single(); if(readErr) throw readErr;
    if(String(fr.receiver_id)!==String(b.user_id))return json(res,403,{ok:false,message:'Bu isteği sadece alıcı cevaplayabilir.'});
    const {data,error}= status==='rejected' ? await s.from('friends').delete().eq('id',b.id).select().single() : await s.from('friends').update({status}).eq('id',b.id).select().single();
    if(error) throw error;
    await notify(s, fr.requester_id, `${fr.receiver_name||'Kullanıcı'} arkadaşlık isteğini ${status==='accepted'?'kabul etti':'reddetti'}.`, 'friend');
    return json(res,200,{ok:true,friend:data});
  }
  if(action==='friend_delete'){
    const {data:fr,error:readErr}=await s.from('friends').select('*').eq('id',b.id).single(); if(readErr) throw readErr;
    if(String(fr.requester_id)!==String(b.user_id)&&String(fr.receiver_id)!==String(b.user_id))return json(res,403,{ok:false,message:'Bu arkadaşlığı sadece taraflardan biri silebilir.'});
    const {data,error}=await s.from('friends').delete().eq('id',b.id).select().single(); if(error) throw error;
    const other=String(fr.requester_id)===String(b.user_id)?fr.receiver_id:fr.requester_id;
    await notify(s, other, `${String(fr.requester_id)===String(b.user_id)?fr.requester_name:fr.receiver_name} arkadaşlığı/isteği sildi.`, 'friend');
    return json(res,200,{ok:true,friend:data});
  }
  if(action==='message_by_username'){
    const receiver=await findUserByUsername(s,b.receiver_username);
    if(!receiver) return json(res,404,{ok:false,message:'Alıcı kullanıcı adı bulunamadı.'});
    b.receiver_id=receiver.id; b.receiver_name=receiver.username;
  }
  if(action==='message' || action==='message_by_username'){
    if(!b.sender_id||!b.receiver_id)return json(res,400,{ok:false,message:'Gönderen ve alıcı gerekli.'});
    const {data:friend}=await s.from('friends').select('*').or(`and(requester_id.eq.${b.sender_id},receiver_id.eq.${b.receiver_id},status.eq.accepted),and(requester_id.eq.${b.receiver_id},receiver_id.eq.${b.sender_id},status.eq.accepted)`).limit(1).maybeSingle();
    if(!friend)return json(res,403,{ok:false,message:'Mesaj göndermek için önce arkadaşlık kabul edilmeli.'});
    const row={sender_id:b.sender_id,sender_name:b.sender_name,receiver_id:b.receiver_id,receiver_name:b.receiver_name,body:b.body||''};
    const {data,error}=await s.from('messages').insert(row).select().single(); if(error) throw error;
    await notify(s,b.receiver_id,`${b.sender_name||'Arkadaşın'} sana mesaj gönderdi.`,'message');
    return json(res,200,{ok:true,message:data});
  }
  json(res,400,{ok:false,message:'Geçersiz sosyal işlem.'});
}catch(e){json(res,500,{ok:false,message:e.message});} };
