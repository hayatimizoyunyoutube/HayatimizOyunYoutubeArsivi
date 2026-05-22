const { json, getSupabase, requireStaff, readBody, log } = require('../lib/_lib');
module.exports = async (req, res) => { try { const s=getSupabase(); const action=(req.query&&req.query.action)||''; if(req.method==='GET'){const {data,error}=await s.from('site_settings').select('*').eq('id',1).single(); if(error) throw error; return json(res,200,{ok:true,settings:data});} const b=await readBody(req); req.body=b; if(!(await requireStaff(req,'Editör'))) return json(res,401,{ok:false,message:'Bu işlem için yetkili kullanıcıyla giriş gerekli.'});
  if(action==='discord-test' || b.test_discord){
    const {data:st,error:stErr}=await s.from('site_settings').select('discord_webhook,discord_enabled,site_title').eq('id',1).single(); if(stErr) throw stErr;
    if(!st?.discord_webhook) return json(res,400,{ok:false,message:'Discord webhook boş.'});
    if(!st?.discord_enabled) return json(res,400,{ok:false,message:'Discord webhook pasif. Önce ayarlardan aktif et.'});
    const payload={content:`${st.site_title||'Hayatımız Oyun'} test bildirimi başarılı.`, embeds:[{title:'V1.9.0', description:'Discord webhook test mesajı.', color:15158332, timestamp:new Date().toISOString()}]};
    const rr=await fetch(st.discord_webhook,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    if(!rr.ok) return json(res,500,{ok:false,message:'Discord webhook hata verdi: HTTP '+rr.status});
    await log('Discord webhook test edildi','',req); return json(res,200,{ok:true,message:'Discord test bildirimi gönderildi.'});
  }
  const patch={...b.settings, id:1, updated_at:new Date().toISOString()}; const {data,error}=await s.from('site_settings').upsert(patch).select().single(); if(error) throw error; await log('Ayarlar güncellendi','', req); json(res,200,{ok:true,settings:data}); } catch(e){json(res,500,{ok:false,message:e.message});} };
