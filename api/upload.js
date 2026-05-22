const { json, getSupabase } = require('../lib/_lib');
const Busboy = require('busboy');
module.exports = async function(req,res){
  if(req.method!=='POST') return json(res,405,{ok:false,message:'POST gerekli.'});
  try{
    const s=getSupabase();
    const bb=Busboy({headers:req.headers,limits:{fileSize:4*1024*1024,files:1}});
    let folder='uploads', fileBuf=null, filename='file', mime='application/octet-stream';
    await new Promise((resolve,reject)=>{
      bb.on('field',(n,v)=>{if(n==='folder')folder=String(v||'uploads').replace(/[^a-z0-9_-]/gi,'')||'uploads'});
      bb.on('file',(n,file,info)=>{filename=info.filename||'file';mime=info.mimeType||mime;const chunks=[];file.on('data',d=>chunks.push(d));file.on('limit',()=>reject(new Error('Dosya en fazla 4 MB olabilir.')));file.on('end',()=>{fileBuf=Buffer.concat(chunks)})});
      bb.on('error',reject);bb.on('finish',resolve);req.pipe(bb);
    });
    if(!fileBuf) return json(res,400,{ok:false,message:'Dosya bulunamadı.'});
    if(!/^image\//.test(mime)) return json(res,400,{ok:false,message:'Sadece görsel yüklenebilir.'});
    const ext=(filename.split('.').pop()||'jpg').replace(/[^a-z0-9]/gi,'').toLowerCase();
    const path=`${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const bucket='site-uploads';
    await s.storage.createBucket(bucket,{public:true}).catch(()=>{});
    const {error}=await s.storage.from(bucket).upload(path,fileBuf,{contentType:mime,upsert:true});
    if(error) throw error;
    const {data}=s.storage.from(bucket).getPublicUrl(path);
    json(res,200,{ok:true,url:data.publicUrl,path,bucket});
  }catch(e){json(res,500,{ok:false,message:e.message});}
};
module.exports.config={api:{bodyParser:false},maxDuration:60};
