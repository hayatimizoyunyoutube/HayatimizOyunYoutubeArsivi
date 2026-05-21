
const { json } = require('../lib/_lib');

function stripHtml(v = '') {
  return String(v || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function fmtDate(v) {
  if (!v) return '';
  const d = new Date(String(v).includes('T') ? v : v + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const dict = {
  Action: 'Aksiyon', Adventure: 'Macera', RPG: 'RPG', Strategy: 'Strateji', Shooter: 'Nişancı', Puzzle: 'Bulmaca', Indie: 'Bağımsız', Simulation: 'Simülasyon', Sports: 'Spor', Racing: 'Yarış', Arcade: 'Arcade', Platformer: 'Platform', Casual: 'Basit Eğlence', Fighting: 'Dövüş', Family: 'Aile', 'Board Games': 'Masa Oyunu', Educational: 'Eğitici', Card: 'Kart', 'Massively Multiplayer': 'Devasa Çok Oyunculu', Singleplayer: 'Tek Oyunculu', Multiplayer: 'Çok Oyunculu', Atmospheric: 'Atmosferik', 'Story Rich': 'Hikaye Odaklı', Horror: 'Korku', Survival: 'Hayatta Kalma', 'Open World': 'Açık Dünya', 'Third Person': 'Üçüncü Şahıs', 'First-Person': 'Birinci Şahıs', 'Great Soundtrack': 'Güçlü Müzik', Difficult: 'Zor', 'Co-op': 'Co-op', Fantasy: 'Fantastik', 'Sci-fi': 'Bilim Kurgu', Zombies: 'Zombi', Stealth: 'Gizlilik', Remake: 'Remake', Remaster: 'Remaster', Classic: 'Klasik', Gore: 'Kanlı', Violent: 'Şiddet', Mystery: 'Gizem', Crime: 'Suç', War: 'Savaş'
};

function looksTr(t = '') {
  return /[ıİğĞüÜşŞöÖçÇ]/.test(t) || /\b(ve|bir|oyun|hikaye|karakter|dünya|savaş|macera|korku|için|olarak|ile|bu)\b/i.test(t);
}
function looksRu(t = '') { return /[А-Яа-яЁё]/.test(t); }
function looksEs(t = '') { return /\b(el|la|los|las|una|para|con|historia|juego)\b/i.test(t); }
function looksFr(t = '') { return /\b(le|la|les|une|pour|avec|histoire|jeu)\b/i.test(t); }
function sourceLang(t = '') {
  if (looksRu(t)) return 'ru';
  if (looksEs(t)) return 'es';
  if (looksFr(t)) return 'fr';
  return 'en';
}
function tr(v) { return dict[v] || v; }

function splitChunks(text, max = 430) {
  text = stripHtml(text).slice(0, 1800);
  if (!text) return [];
  const sentences = text.split(/(?<=[.!?。！？])\s+/).filter(Boolean);
  const chunks = [];
  let cur = '';
  for (const s0 of sentences.length ? sentences : [text]) {
    const s = s0.trim();
    if (!s) continue;
    if (s.length > max) {
      if (cur) { chunks.push(cur); cur = ''; }
      for (let i = 0; i < s.length; i += max) chunks.push(s.slice(i, i + max));
      continue;
    }
    if ((cur + ' ' + s).trim().length > max) { chunks.push(cur); cur = s; }
    else cur = (cur + ' ' + s).trim();
  }
  if (cur) chunks.push(cur);
  return chunks.slice(0, 5);
}

async function translateChunk(chunk, lang) {
  const custom = process.env.TRANSLATE_API_URL;
  if (custom) {
    const r = await fetch(custom, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: chunk, source: lang || 'auto', target: 'tr', format: 'text' })
    });
    const j = await r.json();
    return j.translatedText || j.translation || j.text || chunk;
  }
  const url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(chunk) + '&langpair=' + encodeURIComponent((lang || 'en') + '|tr');
  const r = await fetch(url, { headers: { 'User-Agent': 'HayatimizOyun/1.7.5-Fix5' } });
  const j = await r.json();
  if (String(j.responseStatus || '').startsWith('4') || /QUERY LENGTH LIMIT/i.test(j.responseDetails || '')) {
    return chunk;
  }
  return j.responseData?.translatedText || chunk;
}

async function translateText(text) {
  text = stripHtml(text);
  if (!text) return '';
  if (looksTr(text)) return text;
  const lang = sourceLang(text);
  const chunks = splitChunks(text, 430);
  if (!chunks.length) return '';
  const out = [];
  for (const c of chunks) {
    try { out.push(await translateChunk(c, lang)); }
    catch { out.push(c); }
  }
  return stripHtml(out.join(' '));
}

function cleanBadTranslation(text = '') {
  return stripHtml(text)
    .replace(/QUERY LENGTH LIMIT EXCEEDED\.?\s*MAX ALLOWED QUERY\s*:?\s*500\s*CHARS/ig, '')
    .replace(/MYMEMORY WARNING[\s\S]*$/ig, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function shortStory(desc, name, genres = [], released = '') {
  desc = cleanBadTranslation(desc);
  if (desc) {
    const parts = desc.split(/(?<=[.!?])\s+/).filter(Boolean).slice(0, 4).join(' ');
    const story = parts.length > 700 ? parts.slice(0, 700).replace(/\s+\S*$/, '') + '...' : parts;
    if (story && !/QUERY LENGTH LIMIT/i.test(story)) return story;
  }
  const genreText = genres.length ? genres.slice(0, 3).join(', ') : 'hikaye odaklı macera';
  const year = released ? String(released).slice(-4) : '';
  return `${name}, ${genreText} türlerini öne çıkaran${year ? ' ' + year + ' çıkışlı' : ''} bir oyundur. Hikaye odaklı izleme sayfasında oyun atmosferi, karakter yolculuğu ve bölüm sırası üzerinden takip edilebilir.`;
}


function noCyrillic(v=''){ return !/[А-Яа-яЁё]/.test(String(v||'')); }
function uniqueCleanLabels(arr=[]){
  const out=[];
  for(const x of arr){
    let v=tr(String(x||'').trim());
    if(!v || /[А-Яа-яЁё]/.test(v)) continue;
    if(!dict[v] && /^[a-z][a-z\s-]+$/i.test(v) && !Object.values(dict).includes(v)) continue;
    if(!out.includes(v)) out.push(v);
  }
  return out.slice(0,10);
}

function buildSearchName(name) {
  return String(name || '')
    .replace(/\b\d+\s*\.\s*DLC'?si\b/gi, ' ')
    .replace(/\bDLC'?si\b/gi, 'DLC')
    .replace(/\b(Türkçe|Turkce|Altyazılı|Altyazili|Dublaj|Dublajlı|Final|Bölüm|Bolum|Part|Episode|Gameplay|Oynanış|Full|HD|4K)\b/gi, ' ')
    .replace(/[|#\[\]{}()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 90);
}
function rawgSearchVariants(name) {
  const base = buildSearchName(name);
  const variants = [base];
  const m = base.match(/^(Far\s*Cry\s*6)\s+(.+)$/i);
  if (m) {
    variants.push(`${m[1]} ${m[2].replace(/:/g, ' ')}`);
    variants.push(m[2].replace(/:/g, ' '));
  }
  variants.push(base.replace(/:/g, ' '));
  variants.push(base.replace(/\bDLC\b/gi, ' '));
  return [...new Set(variants.map(v => v.replace(/\s+/g, ' ').trim()).filter(Boolean))].slice(0, 6);
}
async function searchRawgGame(key, originalName, headers) {
  const variants = rawgSearchVariants(originalName);
  for (const q of variants) {
    for (const precise of [true, false]) {
      const url = `https://api.rawg.io/api/games?key=${encodeURIComponent(key)}&search=${encodeURIComponent(q)}&page_size=5${precise ? '&search_precise=true' : ''}`;
      const r = await fetch(url, { headers });
      const j = await r.json();
      if (j.error) throw new Error(j.error);
      const results = j.results || [];
      const best = results.find(x => x.background_image) || results[0];
      if (best) return { game: best, query: q, precise };
    }
  }
  return { game: null, query: variants[0] || '', precise: false };
}

module.exports = async (req, res) => {
  try {
    const key = process.env.RAWG_API_KEY;
    if (!key) return json(res, 400, { ok: false, message: 'RAWG_API_KEY Vercel Environment Variables içine eklenmemiş.' });

    const originalName = (req.query && req.query.name) || '';
    const isStoryOnly = String((req.query && req.query.story) || '') === '1';
    const name = buildSearchName(originalName);
    if (!name) return json(res, 400, { ok: false, message: 'name gerekli.' });

    const commonHeaders = { 'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8' };
    const found = await searchRawgGame(key, originalName, commonHeaders);
    const g = found.game;
    if (!g) return json(res, 404, { ok: false, message: 'Oyun bulunamadı. DLC adı için Google Görselde Ara butonunu kullanıp kapak URL alanına görsel adresini ekleyebilirsin.' });

    let detail = {};
    try {
      const dr = await fetch(`https://api.rawg.io/api/games/${g.id}?key=${encodeURIComponent(key)}`, { headers: commonHeaders });
      detail = await dr.json();
    } catch {}

    const genres = uniqueCleanLabels((g.genres || detail.genres || []).map(x => x.name));
    const safeRawTags = uniqueCleanLabels((g.tags || []).map(x => x.name));
    const suggested_tags = Array.from(new Set([...safeRawTags])).filter(Boolean).slice(0, 10);
    const tags = [];
    const raw = stripHtml(detail.description_raw || detail.description || g.description_raw || '');
    const translated = await translateText(raw);
    const description = shortStory(translated || raw, g.name, genres, g.released || detail.released || '');

    if (isStoryOnly) {
      return json(res, 200, {
        ok: true,
        mode: 'story',
        game: {
          rawg_id: String(g.id),
          title: g.name,
          description
        }
      });
    }

    json(res, 200, {
      ok: true,
      game: {
        rawg_id: String(g.id),
        title: g.name,
        release_date: fmtDate(g.released || detail.released || ''),
        cover: g.background_image || detail.background_image || '',
        genre: genres.join(', '),
        tags,
        suggested_tags,
        rating: g.rating || detail.rating || '',
        description,
        note: `V1.9.5 Fix 4: DLC adları temizlenerek arandı. Kullanılan arama: ${found.query}. Türler otomatik doldurulur; etiketler otomatik eklenmez.`
      }
    });
  } catch (e) {
    json(res, 500, { ok: false, message: e.message });
  }
};
