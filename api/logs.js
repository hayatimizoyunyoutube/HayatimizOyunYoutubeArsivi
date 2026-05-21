const { json, getSupabase, requireStaff, readBody, log } = require('../lib/_lib');
module.exports = async (req,res)=>{
  try{
    const s=getSupabase();
    const b=await readBody(req); req.body=b;
    if(!(await requireStaff(req,'Editör'))) return json(res,401,{ok:false,message:'Bu işlem için yetkili kullanıcıyla giriş gerekli.'});
    if(req.method==='GET'){
      const {data,error}=await s.from('admin_logs').select('*').order('created_at',{ascending:false}).limit(200);
      if(error) throw error;
      return json(res,200,{ok:true,logs:data || []});
    }
    if(req.method==='DELETE'){
      const {error}=await s.from('admin_logs').delete().neq('id','00000000-0000-0000-0000-000000000000');
      if(error) throw error;
      await log('Loglar temizlendi','Tüm admin logları temizlendi',req);
      return json(res,200,{ok:true});
    }
    json(res,405,{ok:false,message:'Method desteklenmiyor.'});
  }catch(e){json(res,500,{ok:false,message:e.message});}
};
