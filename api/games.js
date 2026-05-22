const { json, getSupabase, requireStaff, slugify, readBody, log } = require('../lib/_lib');


function canonicalSeriesName(value='', title=''){
  let x=String(value||title||'').trim();
  if(!x) return '';
  x=x.replace(/[’`´]/g,"'").replace(/\s+/g,' ');
  x=x.replace(/\b(Türkçe\s+Altyazılı|Türkçe\s+Dublajlı|Full|Tüm\s+Bölümler|Final|DLC|Remake|Remaster|Coop|%100)\b/ig,'').trim();
  const rules=[
    [/assassin'?s\s+creed/i,"Assassin's Creed"], [/a\s+plague\s+tale/i,'A Plague Tale'], [/resident\s+evil/i,'Resident Evil'], [/silent\s+hill/i,'Silent Hill'], [/half[-\s]?life|black\s+mesa/i,'Half-Life'], [/dead\s+island/i,'Dead Island'], [/dead\s+space/i,'Dead Space'], [/the\s+last\s+of\s+us/i,'The Last of Us'], [/tomb\s+raider/i,'Tomb Raider'], [/god\s+of\s+war/i,'God of War'], [/uncharted/i,'Uncharted'], [/metro\s+(2033|last\s+light|exodus)?/i,'Metro'], [/batman\s+arkham/i,'Batman Arkham'], [/call\s+of\s+duty/i,'Call of Duty'], [/battlefield/i,'Battlefield'], [/crysis/i,'Crysis'], [/far\s+cry/i,'Far Cry'], [/bioshock/i,'BioShock'], [/dark\s+souls/i,'Dark Souls'], [/mafia/i,'Mafia'], [/max\s+payne/i,'Max Payne'], [/watch\s+dogs/i,'Watch Dogs'], [/alan\s+wake/i,'Alan Wake'], [/little\s+nightmares/i,'Little Nightmares'], [/life\s+is\s+strange/i,'Life is Strange']
  ];
  for(const [re,name] of rules) if(re.test(x)) return name;
  const before=x.split(/[:\-–—]/).map(a=>a.trim()).filter(Boolean)[0]||x;
  return before.replace(/\s+(I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|[0-9]+)\b.*$/i,'').trim()||x;
}

function fmtDate(v){ if(!v) return ''; if(/^\d{2}\.\d{2}\.\d{4}$/.test(String(v))) return String(v); const d=new Date(String(v).includes('T')?v:v+'T00:00:00'); if(Number.isNaN(d.getTime())) return v; return d.toLocaleDateString('tr-TR',{day:'2-digit',month:'2-digit',year:'numeric'}); }
function normalizeGame(game) {
  const g = { ...game };
  if (!g.title) return g;
  g.slug = g.slug || slugify(g.title);
  g.tags = Array.isArray(g.tags) ? g.tags : String(g.tags || '').split(',').map(x=>x.trim()).filter(Boolean);
  if (typeof g.episodes === 'string') {
    try { g.episodes = JSON.parse(g.episodes || '[]'); } catch { g.episodes = []; }
  }
  if (!Array.isArray(g.episodes)) g.episodes = [];
  g.release_date = fmtDate(g.release_date);
  g.series = canonicalSeriesName(g.series, g.title) || g.series || g.title;
  if (g.order_no === '' || g.order_no == null) g.order_no = 0;
  return g;
}

module.exports = async (req, res) => {
  try {
    const supabase = getSupabase();
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('games').select('*').order('series').order('order_no').order('title');
      if (error) throw error;
      return json(res, 200, { ok: true, games: data || [] });
    }

    const body = await readBody(req); req.body = body;
    if (!(await requireStaff(req,'Editör'))) return json(res, 401, { ok:false, message:'Bu işlem için yetkili kullanıcıyla giriş gerekli.' });

    if (req.method === 'POST' || req.method === 'PUT') {
      const game = normalizeGame(body.game || body);
      if (!game.title) return json(res, 400, { ok:false, message:'Oyun adı zorunlu.' });
      let { data, error } = await supabase.from('games').upsert(game, { onConflict:'slug' }).select().single();
      // Eski Supabase schema çalıştırılmadıysa bilinmeyen kolon yüzünden panelin bozulmasını engelle.
      if (error && /column|schema cache|upcoming_start/i.test(String(error.message||''))) {
        const retry = { ...game };
        delete retry.upcoming_start;
        ({ data, error } = await supabase.from('games').upsert(retry, { onConflict:'slug' }).select().single());
      }
      if (error) throw error;
      await log(req.method === 'PUT' ? 'Oyun düzenlendi' : 'Oyun kaydedildi', data.title, req);
      return json(res, 200, { ok:true, game:data });
    }

    if (req.method === 'PATCH') {
      if (Array.isArray(body.order) && body.order.length) {
        for (const item of body.order) {
          if (!item || !item.id) continue;
          const update = { order_no: Number(item.order_no) || 0 };
          if (item.series) update.series = canonicalSeriesName(item.series, item.series);
          const { error:eOrder } = await supabase.from('games').update(update).eq('id', item.id);
          if (eOrder) throw eOrder;
        }
        await log('Seri sıralaması güncellendi', `${body.order.length} oyun`, req);
        return json(res, 200, { ok:true, updated:body.order.length });
      }
      const ids = Array.isArray(body.ids) ? body.ids.filter(Boolean) : [];
      const patch = body.patch || {};
      if (!ids.length) return json(res, 400, { ok:false, message:'Güncellenecek oyun seçilmedi.' });
      const base = {};
      if (patch.status) base.status = patch.status;
      if (patch.series) base.series = patch.series;
      let updated = 0;
      if (Object.keys(base).length) {
        const { error, count } = await supabase.from('games').update(base).in('id', ids);
        if (error) throw error;
        updated += count || ids.length;
      }
      if (patch.add_tag) {
        const { data:rows, error:e1 } = await supabase.from('games').select('id,tags').in('id', ids);
        if (e1) throw e1;
        for (const row of rows || []) {
          const tags = Array.isArray(row.tags) ? row.tags : [];
          if (!tags.includes(patch.add_tag)) tags.push(patch.add_tag);
          const { error:e2 } = await supabase.from('games').update({ tags }).eq('id', row.id);
          if (e2) throw e2;
        }
      }
      await log('Toplu oyun güncellendi', `${ids.length} oyun`, req);
      return json(res, 200, { ok:true, updated:ids.length });
    }

    if (req.method === 'DELETE') {
      if (body.all === true || body.all === 'true') {
        const { data: rows, error: e0 } = await supabase.from('games').select('id').limit(100000);
        if (e0) throw e0;
        const idsAll = (rows || []).map(x => x.id);
        if (idsAll.length) {
          const { error } = await supabase.from('games').delete().in('id', idsAll);
          if (error) throw error;
        }
        await log('Tüm oyunlar silindi', `${idsAll.length} oyun`, req);
        return json(res, 200, { ok:true, deleted:idsAll.length, all:true });
      }
      const ids = Array.isArray(body.ids) ? body.ids.filter(Boolean) : [];
      if (ids.length) {
        const { error } = await supabase.from('games').delete().in('id', ids);
        if (error) throw error;
        await log('Toplu oyun silindi', `${ids.length} oyun`, req);
        return json(res, 200, { ok:true, deleted:ids.length });
      }
      const id = body.id || req.query?.id;
      const slug = body.slug || req.query?.slug;
      if (!id && !slug) return json(res, 400, { ok:false, message:'id, ids veya slug gerekli.' });
      const q = supabase.from('games').delete();
      const { error } = id ? await q.eq('id', id) : await q.eq('slug', slug);
      if (error) throw error;
      await log('Oyun silindi', id || slug, req);
      return json(res, 200, { ok:true });
    }

    json(res, 405, { ok:false, message:'Method desteklenmiyor.' });
  } catch (e) { json(res, 500, { ok:false, message:e.message }); }
};
