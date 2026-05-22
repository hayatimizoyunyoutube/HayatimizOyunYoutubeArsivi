const { json, getSupabase } = require('../lib/_lib');
module.exports = async (req,res)=>{try{const s=getSupabase();const {error}=await s.from('site_settings').select('id').eq('id',1).single();json(res,error?500:200,{ok:!error,supabase:!error,message:error?error.message:'Sistem çalışıyor'});}catch(e){json(res,500,{ok:false,message:e.message});}};
