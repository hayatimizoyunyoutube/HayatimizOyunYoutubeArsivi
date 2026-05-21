const { json, getSupabase, requireStaff, readBody, log } = require('../lib/_lib');

function isPublicUserNote(n={}){
  if(n.public_visible===false) return false;
  const text=`${n.type||''} ${n.title||''} ${n.body||''}`.toLocaleLowerCase('tr-TR');
  // Ziyaretçi/kullanıcıyı ilgilendirmeyen admin-panel, yetki, log ve şifre notlarını public listeden gizle.
  const blocked=['admin','panel','yetkili','yetki','şifre','sifre','rol','log','api çek','api cek','vercel','supabase schema','environment'];
  return !blocked.some(w=>text.includes(w));
}

module.exports = async (req,res)=>{ try{
  const s=getSupabase();
  if(req.method==='GET'){
    const all=req.query&&req.query.all==='1';
    let q=s.from('update_notes').select('*').order('created_at',{ascending:false});
    if(!all) q=q.eq('public_visible',true).neq('type','Admin');
    const {data,error}=await q; if(error) throw error;
    const notes=all?(data||[]):(data||[]).filter(isPublicUserNote);
    return json(res,200,{ok:true,notes});
  }
  const b=await readBody(req); req.body=b;
  if(!(await requireStaff(req,'Editör'))) return json(res,401,{ok:false,message:'Bu işlem için yetkili kullanıcıyla giriş gerekli.'});
  if(req.method==='POST'||req.method==='PUT'||req.method==='PATCH'){
    const note={public_visible:true,...(b.note||b)};
    if(note.type==='Admin') note.public_visible=false;
    const method=note.id?'upsert':'insert';
    const q=method==='upsert'?s.from('update_notes').upsert(note).select().single():s.from('update_notes').insert(note).select().single();
    const {data,error}=await q; if(error) throw error;
    await log(note.id?'Güncelleme notu düzenlendi':'Güncelleme notu eklendi',data.title,req);
    return json(res,200,{ok:true,note:data});
  }
  if(req.method==='DELETE'){
    const {error}=await s.from('update_notes').delete().eq('id',b.id); if(error) throw error;
    await log('Güncelleme notu silindi',b.id,req);
    return json(res,200,{ok:true});
  }
  json(res,405,{ok:false});
}catch(e){json(res,500,{ok:false,message:e.message});} };
