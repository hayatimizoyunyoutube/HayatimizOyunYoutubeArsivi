const VERSION = 'v2.0.3';
const GAME_KEYS = ['hayatimiz_games_cache_stable_v31','hayatimiz_games_cache_stable_v30','hayatimiz_games_cache_stable_v24','hayatimiz_games_cache_stable','hayatimiz_games_v2'];
const EVENTS_KEYS = ['hayatimiz_v202_calendar_events','hayatimiz_v254_fix2_calendar_events','hayatimiz_calendar_events_stable_v253f4'];
const NOTES_KEY = 'hayatimiz_update_notes_local_v203';
const LEGACY_NOTES_KEYS = ['hayatimiz_update_notes_local_v202','hayatimiz_update_notes_local_v254f8','hayatimiz_update_notes_local_v251','hayatimiz_update_notes_local'];
const MAINTENANCE_KEY = 'hayatimiz_maintenance_cache_stable';

const DEFAULT_GAMES = [
  {id:'alan-wake-remastered',title:'Alan Wake Remastered',status:'Devam Eden',genre:'Korku',seriesName:'Alan Wake',cover:'/assets/alan-wake-night-springs.png',releaseDate:'2010',description:'Korku ve hikaye odaklı yayın arşivi.',episodeCount:8,tags:'Türkçe Altyazılı, Hikaye'},
  {id:'assassins-creed-directors-cut',title:'Assassin’s Creed Director’s Cut',status:'Tamamlanan',genre:'Aksiyon',seriesName:'Assassin’s Creed',cover:'/assets/assassins-creed-directors-cut.png',releaseDate:'2008',description:'Tamamlanan seri arşivi ve bölüm takibi.',episodeCount:14,tags:'Türkçe, Seri'},
  {id:'hayatimiz-oyun-arsiv',title:'Hayatımız Oyun Arşivi',status:'Yakında',genre:'YouTube Arşivi',seriesName:'Genel Arşiv',cover:'/assets/hayatimiz-kapak.png',releaseDate:'2026',description:'YouTube playlist, bölüm ve oyun koleksiyonu merkezi.',episodeCount:0,tags:'Arşiv, Plan'}
];
const DEFAULT_NOTES = [
  {id:'v203',version:'v2.0.3',title:'Profesyonel Ana Sayfa Geri Dönüş',summary:'v2.0.2 stabil taban bozulmadan sinematik hero, arşiv istatistikleri, son eklenenler ve hızlı menü geri eklendi.',status:'Tamamlandı'},
  {id:'v202-fix',version:'v2.0.2',title:'Planlar, Güncellemeler ve BAT Temizliği',summary:'GUNCELLEMELER/TAMAMLANANLAR ve GUNCELLEMELER/PLANLANANLAR düzeni kuruldu; ana klasörde sadece iki BAT bırakıldı.',status:'Tamamlandı'},
  {id:'v202',version:'v2.0.2',title:'Boş Ekran Kesin Düzeltme',summary:'Kırık eski ana JS açılışı kaldırıldı; stabil çalışan yeni uygulama kabuğu eklendi.',status:'Tamamlandı'},
  {id:'v201',version:'v2.0.1',title:'Ana Sayfa Boş Ekran Fix',summary:'Önceki boş ekran koruması eklendi ama kullanıcı tarafında hâlâ siyah ekran görüldü.',status:'Tamamlandı'},
  {id:'v200',version:'v2.0.0',title:'Dolu Eski Taban',summary:'Eski dolu özellikler korunarak v2.0.0 tabanına geri dönüldü.',status:'Tamamlandı'}
];

function $(sel, root=document){ return root.querySelector(sel); }
function $all(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }
function esc(v){ return String(v ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
function readJson(key, fallback){ try{ const raw=localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }catch{ return fallback; } }
function writeJson(key, value){ localStorage.setItem(key, JSON.stringify(value)); }
function firstArray(keys, fallback=[]){ for(const key of keys){ const val=readJson(key,null); if(Array.isArray(val) && val.length) return val; } return fallback; }
function slugify(v){ return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || ('item-'+Date.now()); }
function normalizeGame(g,i){
  const title = g.title || g.name || g.game_title || `Oyun ${i+1}`;
  return {
    id: g.id || g.slug || slugify(title),
    title,
    status: g.status || g.progress_status || g.state || 'Devam Eden',
    genre: g.genre || g.category || (Array.isArray(g.genres)?g.genres[0]:'Arşiv'),
    tags: Array.isArray(g.tags) ? g.tags.join(', ') : (g.tags || ''),
    seriesName: g.seriesName || g.series_name || g.series || '',
    cover: g.cover || g.coverUrl || g.cover_url || g.image || g.image_url || g.background_image || '/assets/hayatimiz-kapak.png',
    releaseDate: g.releaseDate || g.release_date || g.released || '',
    description: g.description || g.summary || 'Açıklama eklenmedi.',
    youtubePlaylistUrl: g.youtubePlaylistUrl || g.youtube_playlist_url || g.playlistUrl || g.playlist_url || '',
    episodeCount: Number(g.episodeCount || g.episode_count || g.totalEpisodes || 0)
  };
}
function loadGames(){ return firstArray(GAME_KEYS, DEFAULT_GAMES).map(normalizeGame); }
function saveGames(rows){ for(const k of ['hayatimiz_games_cache_stable_v31','hayatimiz_games_cache_stable']) writeJson(k, rows); }
function loadEvents(){ return firstArray(EVENTS_KEYS, []); }
function saveEvents(rows){ for(const k of EVENTS_KEYS) writeJson(k, rows); }
function loadNotes(){ const local=firstArray([NOTES_KEY,...LEGACY_NOTES_KEYS], []); return local.length ? local : DEFAULT_NOTES; }
function saveNotes(rows){ writeJson(NOTES_KEY, rows); }
function loadMaintenance(){ return readJson(MAINTENANCE_KEY, {enabled:false,message:'Hayatımız Oyun kısa süreli bakımda.',eta:'',percent:0}); }
function saveMaintenance(v){ writeJson(MAINTENANCE_KEY, v); }
function route(){ return decodeURI(location.pathname || '/'); }
function setRoute(path){ history.pushState({},'',path); render(); window.scrollTo(0,0); }
function toast(msg){ const old=$('.toast'); if(old) old.remove(); const t=document.createElement('div'); t.className='toast'; t.textContent=msg; document.body.appendChild(t); setTimeout(()=>t.remove(),2600); }
function active(path){ const p=route(); return p===path || (path!=='/' && p.startsWith(path)); }
function countBy(rows, key){ return rows.reduce((acc,item)=>{ const k=item[key] || 'Diğer'; acc[k]=(acc[k]||0)+1; return acc; },{}); }
function statusClass(status){ const s=String(status||'').toLowerCase(); return s.includes('tamam')?'green':s.includes('yak')||s.includes('plan')?'amber':s.includes('ara')?'red':''; }
function nav(){
  const items=[['/ana-sayfa','Ana Sayfa'],['/oyun-arsivi','Oyun Arşivi'],['/seriler','Seriler'],['/yonetim','Yönetim Paneli'],['/yonetim/oyun-ekle','Oyun Ekle'],['/yonetim/mevcut-oyunlar','Mevcut Oyunlar'],['/yonetim/yayin-takvimi','Yayın Takvimi'],['/yonetim/guncelleme-notlari','Güncelleme Notları'],['/yonetim/bakim-modu','Bakım Modu']];
  return `<aside class="side"><div class="brand"><span class="logo">🎮</span><span><b>Hayatımız <em>Oyun</em></b><small>${VERSION} • profesyonel ana sayfa</small></span></div><nav class="nav">${items.map(([href,label])=>`<a class="${active(href)?'active':''}" href="${href}">${label}</a>`).join('')}</nav><button data-action="hard-refresh">Sayfayı Yenile</button><div class="sideFooter"><b class="okText">Boş ekran fix aktif</b><br>v2.0.3 ana sayfa parça parça geri eklendi. Eski kırık JS geri basılmadı.</div></aside>`;
}
function layout(content){ return `<main class="app">${nav()}<section class="main">${content}</section></main>`; }
function hero(title, text, badge='v2.0.3 • profesyonel ana sayfa'){
  return `<section class="hero"><span class="badge">${esc(badge)}</span><h1>${esc(title)}</h1><p>${esc(text)}</p><div class="actions"><a class="btn primary" href="/yonetim">Yönetim Paneli</a><a class="btn secondary" href="/yonetim/oyun-ekle">Oyun Ekle</a><a class="btn secondary" href="/oyun-arsivi">Arşivi Aç</a></div></section>`;
}
function gameCard(g){
  const cls = statusClass(g.status);
  const tags = String(g.tags||'').split(',').map(x=>x.trim()).filter(Boolean).slice(0,3);
  return `<article class="gameCard"><img src="${esc(g.cover)}" alt="${esc(g.title)}" onerror="this.src='/assets/hayatimiz-kapak.png'"><div class="body"><div class="cardTop"><span class="pill ${cls}">${esc(g.status)}</span>${g.episodeCount?`<span class="pill">${esc(g.episodeCount)} bölüm</span>`:''}</div><h3>${esc(g.title)}</h3><p>${esc(g.description)}</p>${tags.length?`<div class="tags">${tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div>`:''}<p class="muted" style="margin-top:10px">${esc(g.genre)} ${g.seriesName?'• '+esc(g.seriesName):''} ${g.releaseDate?'• '+esc(g.releaseDate):''}</p></div></article>`;
}
function quickCard(href, icon, title, text){ return `<a class="quickCard" href="${href}"><span class="quickIcon">${icon}</span><b>${esc(title)}</b><small>${esc(text)}</small></a>`; }
function statusBar(label,count,total,cls=''){
  const pct = total ? Math.round((count/total)*100) : 0;
  return `<div class="statusBar"><div><span class="pill ${cls}">${esc(label)}</span><b>${count}</b></div><i><span style="width:${pct}%"></span></i></div>`;
}
function home(){
  const games=loadGames(); const notes=loadNotes(); const events=loadEvents();
  const series=new Set(games.map(g=>g.seriesName).filter(Boolean)); const genres=new Set(games.map(g=>g.genre).filter(Boolean));
  const episodeTotal=games.reduce((sum,g)=>sum + Number(g.episodeCount||0),0);
  const featured=games[0] || DEFAULT_GAMES[0];
  const byStatus=countBy(games,'status');
  const lastGames=games.slice(0,4);
  const latestNote=notes[0] || DEFAULT_NOTES[0];
  return layout(`
  <section class="dashboardHero">
    <div class="heroGlow"></div>
    <div class="heroContent">
      <span class="badge">${VERSION} • Profesyonel Ana Sayfa Geri Döndü</span>
      <h1>Hayatımız Oyun Arşivi</h1>
      <p>v2.0.2 stabil taban korunarak sinematik vitrin, arşiv istatistikleri, son eklenenler ve hızlı menü geri eklendi. Boş/siyah ekran koruması hâlâ aktif.</p>
      <div class="actions"><a class="btn primary" href="/oyun-arsivi">Arşivi Aç</a><a class="btn secondary" href="/yonetim/oyun-ekle">Oyun Ekle</a><a class="btn secondary" href="/yonetim">Yönetim Paneli</a></div>
      <div class="heroMiniStats"><span><b>${games.length}</b> Oyun</span><span><b>${series.size}</b> Seri</span><span><b>${episodeTotal}</b> Bölüm</span><span><b>${genres.size}</b> Kategori</span></div>
    </div>
    <aside class="heroSpotlight">
      <img src="${esc(featured.cover)}" alt="${esc(featured.title)}" onerror="this.src='/assets/hayatimiz-kapak.png'">
      <div><span class="pill ${statusClass(featured.status)}">Öne Çıkan</span><h2>${esc(featured.title)}</h2><p>${esc(featured.description)}</p><small>${esc(featured.genre)} ${featured.seriesName?'• '+esc(featured.seriesName):''}</small></div>
    </aside>
  </section>
  <section class="quickGrid">
    ${quickCard('/oyun-arsivi','🗂️','Oyun Arşivi','Kartlar ve temel filtreler')}
    ${quickCard('/seriler','🎞️','Seriler','Seri grupları ve bölüm sayısı')}
    ${quickCard('/yonetim/yayin-takvimi','📅','Yayın Takvimi','Yaklaşan yayın kayıtları')}
    ${quickCard('/yonetim/guncelleme-notlari','📝','Güncellemeler','Tamamlanan/planlanan notlar')}
  </section>
  <section class="stats"><article class="stat"><b>${games.length}</b><span>Toplam Oyun</span></article><article class="stat"><b>${series.size}</b><span>Seri Grubu</span></article><article class="stat"><b>${episodeTotal}</b><span>Takip Edilen Bölüm</span></article><article class="stat"><b>${VERSION}</b><span>Aktif Sürüm</span></article></section>
  <section class="panels homePanels"><div class="panel"><div class="sectionHead compact"><div><h2>Arşiv Durumu</h2><p>Devam eden, tamamlanan ve yakında gelecek içerikler.</p></div></div><div class="miniList">${Object.entries(byStatus).map(([label,count])=>statusBar(label,count,games.length,statusClass(label))).join('') || '<div class="empty">Durum verisi yok.</div>'}</div></div><div class="panel"><div class="sectionHead compact"><div><h2>Son Güncelleme</h2><p>${esc(latestNote.version||VERSION)}</p></div><a class="btn secondary" href="/yonetim/guncelleme-notlari">Notları Aç</a></div><article class="note"><span class="pill green">${esc(latestNote.status||'Tamamlandı')}</span><h3>${esc(latestNote.title)}</h3><p>${esc(latestNote.summary||latestNote.description||'')}</p></article></div></section>
  <div class="sectionHead"><div><h2>Son Eklenenler</h2><p>v2.0.3 ile ana sayfada arşiv vitrini tekrar görünür.</p></div><a class="btn secondary" href="/oyun-arsivi">Tümünü Gör</a></div><section class="grid">${lastGames.map(gameCard).join('')}</section>
  <section class="panels"><div class="panel"><h2>Yaklaşan Yayınlar</h2><div class="miniList">${events.length?events.slice(0,4).map(e=>`<article class="event"><span class="pill">${esc(e.date||'Tarih yok')}</span><h3>${esc(e.title||'Yayın')}</h3><p>${esc(e.time||'20:00')} • ${esc(e.note||e.type||'')}</p></article>`).join(''):'<div class="empty">Henüz takvim kaydı yok.</div>'}</div></div><div class="panel"><h2>Geri Ekleme Sırası</h2><div class="roadList"><span class="done">1. Profesyonel ana sayfa tamamlandı</span><span>2. Oyun arşivi kartları ve filtreler</span><span>3. Admin panel dönüşü</span><span>4. RAWG / YouTube / Supabase adımları</span></div></div></section>`);
}
function archive(){
  const games=loadGames(); const q=new URLSearchParams(location.search).get('q')||''; const f=new URLSearchParams(location.search).get('status')||'Tümü';
  const statuses=['Tümü',...Array.from(new Set(games.map(g=>g.status).filter(Boolean)))];
  const filtered=games.filter(g=>(!q || [g.title,g.genre,g.seriesName,g.description,g.tags].join(' ').toLowerCase().includes(q.toLowerCase())) && (f==='Tümü'||g.status===f));
  return layout(`<div class="sectionHead"><div><h2>Oyun Arşivi</h2><p>Arama, durum filtresi ve kart görünümü stabil çalışır. Gelişmiş filtreler v2.0.4 planında geri gelecek.</p></div><a class="btn primary" href="/yonetim/oyun-ekle">Yeni Oyun Ekle</a></div><form class="toolbar" data-search-form><input class="input" name="q" style="max-width:360px" placeholder="Oyun, tür, seri ara" value="${esc(q)}"><select name="status" style="max-width:220px">${statuses.map(s=>`<option ${s===f?'selected':''}>${esc(s)}</option>`).join('')}</select><button class="btn primary" type="submit">Filtrele</button></form>${filtered.length?`<section class="grid">${filtered.map(gameCard).join('')}</section>`:'<div class="empty">Bu filtreyle oyun bulunamadı.</div>'}`);
}
function seriesPage(){
  const games=loadGames(); const map=new Map(); games.forEach(g=>{ const key=g.seriesName||'Serisiz Oyunlar'; if(!map.has(key)) map.set(key,[]); map.get(key).push(g); });
  return layout(`<div class="sectionHead"><div><h2>Seriler</h2><p>Oyunlar seri adına göre gruplandı.</p></div></div><section class="miniList">${Array.from(map.entries()).map(([name,rows])=>`<article class="panel"><span class="pill">${rows.length} oyun</span><h2>${esc(name)}</h2><div class="grid" style="margin-top:14px">${rows.map(gameCard).join('')}</div></article>`).join('')}</section>`);
}
function admin(){
  const cards=[['/yonetim/oyun-ekle','Oyun Ekle','Yeni oyun kaydı oluştur, kapak ve playlist bilgisi gir.'],['/yonetim/mevcut-oyunlar','Mevcut Oyunlar','Kayıtlı oyunları kontrol et ve sil.'],['/yonetim/yayin-takvimi','Yayın Takvimi','Manuel yayın tarihlerini kaydet.'],['/yonetim/guncelleme-notlari','Güncelleme Notları','Tamamlanan ve planlanan notları düzenle.'],['/yonetim/bakim-modu','Bakım Modu','Bakım mesajı, yüzde ve tahmini açılışı ayarla.']];
  return layout(`<div class="sectionHead"><div><h2>Yönetim Paneli</h2><p>Stabil yönetim kabuğu aktif. Gelişmiş admin v2.0.5 planında geri güçlendirilecek.</p></div></div><section class="adminGrid">${cards.map(([href,t,d])=>`<a class="adminCard" href="${href}"><b>${esc(t)}</b><span>${esc(d)}</span></a>`).join('')}</section><section class="panel" style="margin-top:16px"><h2>Sonraki Plan</h2><p>v2.0.4: Oyun arşivi kartları, gelişmiş filtreler ve koleksiyon görünümü geri eklenecek.</p></section>`);
}
function gameForm(){
  return layout(`<div class="sectionHead"><div><h2>Oyun Ekle</h2><p>Form kaydedince oyun arşivine eklenir. Veri localStorage içinde saklanır.</p></div></div><form class="panel formGrid" data-game-form><label class="field">Oyun Adı<input class="input" name="title" required placeholder="Örn: Alan Wake 2"></label><label class="field">Durum<select name="status"><option>Devam Eden</option><option>Tamamlanan</option><option>Yakında</option><option>Ara Verildi</option></select></label><label class="field">Tür / Kategori<input class="input" name="genre" placeholder="Korku, Aksiyon, RPG"></label><label class="field">Seri Adı<input class="input" name="seriesName" placeholder="Örn: Alan Wake"></label><label class="field">Çıkış Tarihi<input class="input" name="releaseDate" placeholder="2023"></label><label class="field">Kapak URL<input class="input" name="cover" placeholder="https://... veya /assets/hayatimiz-kapak.png"></label><label class="field full">Etiketler<input class="input" name="tags" placeholder="Türkçe Altyazılı, Hikaye, Canlı Yayın"></label><label class="field full">YouTube Playlist URL<input class="input" name="youtubePlaylistUrl" placeholder="https://youtube.com/playlist?list=..."></label><label class="field full">Açıklama<textarea name="description" placeholder="Oyun açıklaması"></textarea></label><div class="full actions"><button class="btn primary" type="submit">Oyunu Kaydet</button><a class="btn secondary" href="/oyun-arsivi">Arşive Dön</a></div></form>`);
}
function currentGamesAdmin(){
  const games=loadGames();
  return layout(`<div class="sectionHead"><div><h2>Mevcut Oyunlar</h2><p>${games.length} kayıt listeleniyor.</p></div><a class="btn primary" href="/yonetim/oyun-ekle">Yeni Oyun</a></div><div class="panel">${games.length?`<table class="table"><thead><tr><th>Oyun</th><th>Durum</th><th>Tür</th><th>Seri</th><th></th></tr></thead><tbody>${games.map(g=>`<tr><td>${esc(g.title)}</td><td>${esc(g.status)}</td><td>${esc(g.genre)}</td><td>${esc(g.seriesName||'-')}</td><td><button class="btn danger" data-delete-game="${esc(g.id)}">Sil</button></td></tr>`).join('')}</tbody></table>`:'<div class="empty">Kayıtlı oyun yok.</div>'}</div>`);
}
function calendar(){
  const rows=loadEvents();
  return layout(`<div class="sectionHead"><div><h2>Yayın Takvimi</h2><p>Manuel kayıtlar kalıcı olarak localStorage içinde korunur.</p></div></div><section class="panels"><form class="panel formGrid" data-event-form><label class="field full">Başlık<input class="input" name="title" required placeholder="Örn: Alan Wake 2 Bölüm 3"></label><label class="field">Tarih<input class="input" type="date" name="date" required></label><label class="field">Saat<input class="input" name="time" value="20:00"></label><label class="field full">Video URL<input class="input" name="videoUrl" placeholder="https://youtube.com/..."></label><label class="field full">Not<textarea name="note"></textarea></label><div class="full"><button class="btn primary" type="submit">Yayını Kaydet</button></div></form><div class="panel"><h2>Kayıtlı Yayınlar</h2><div class="miniList">${rows.length?rows.map((e,i)=>`<article class="event"><span class="pill">${esc(e.date||'Tarih yok')} • ${esc(e.time||'20:00')}</span><h3>${esc(e.title||'Yayın')}</h3><p>${esc(e.note||e.videoUrl||'')}</p><button class="btn danger" data-delete-event="${i}">Sil</button></article>`).join(''):'<div class="empty">Henüz yayın kaydı yok.</div>'}</div></div></section>`);
}
function updateNotes(){
  const rows=loadNotes();
  return layout(`<div class="sectionHead"><div><h2>Güncelleme Notları</h2><p>Tamamlanan ve planlanan sürümler buradan eklenebilir.</p></div></div><section class="panels"><form class="panel formGrid" data-note-form><label class="field">Sürüm<input class="input" name="version" value="v2.0.3"></label><label class="field">Durum<select name="status"><option>Tamamlandı</option><option>Planlandı</option></select></label><label class="field full">Başlık<input class="input" name="title" required placeholder="Güncelleme başlığı"></label><label class="field full">Özet<textarea name="summary" required></textarea></label><div class="full"><button class="btn primary" type="submit">Notu Kaydet</button></div></form><div class="panel"><h2>Kayıtlı Notlar</h2><div class="miniList">${rows.map((n,i)=>`<article class="note"><span class="pill ${String(n.status).includes('Plan')?'amber':'green'}">${esc(n.version||VERSION)} • ${esc(n.status||'Tamamlandı')}</span><h3>${esc(n.title)}</h3><p>${esc(n.summary||n.description||'')}</p><button class="btn danger" data-delete-note="${i}">Sil</button></article>`).join('')}</div></div></section>`);
}
function maintenance(){
  const m=loadMaintenance();
  return layout(`<div class="sectionHead"><div><h2>Bakım Modu</h2><p>Mevcut bakım ayarı schema çalışsa bile korunacak mantıkla saklanır.</p></div></div><form class="panel formGrid" data-maint-form><label class="field">Durum<select name="enabled"><option value="false" ${!m.enabled?'selected':''}>Kapalı</option><option value="true" ${m.enabled?'selected':''}>Açık</option></select></label><label class="field">Yüzde<input class="input" type="number" min="0" max="100" name="percent" value="${esc(m.percent||0)}"></label><label class="field full">Mesaj<input class="input" name="message" value="${esc(m.message||'')}"></label><label class="field full">Tahmini Açılış<input class="input" name="eta" value="${esc(m.eta||'')}"></label><div class="full actions"><button class="btn primary" type="submit">Bakım Ayarını Kaydet</button></div></form><section class="panel" style="margin-top:16px"><h2>Önizleme</h2><p><b>Durum:</b> ${m.enabled?'<span class="pill red">Açık</span>':'<span class="pill green">Kapalı</span>'}</p><p>${esc(m.message||'Mesaj yok')}</p><p class="muted">${esc(m.eta||'Tahmini açılış girilmedi')} • ${esc(m.percent||0)}%</p></section>`);
}
function notFound(){ return layout(`<section class="panel"><h1>Sayfa bulunamadı</h1><p class="muted">Bu rota stabil kabukta bulunamadı.</p><a class="btn primary" href="/ana-sayfa">Ana Sayfaya Dön</a></section>`); }
function pageHtml(){ const p=route(); if(p==='/'||p==='/ana-sayfa') return home(); if(p.startsWith('/oyun-arsivi')) return archive(); if(p.startsWith('/seriler')) return seriesPage(); if(p==='/yonetim') return admin(); if(p==='/yonetim/oyun-ekle') return gameForm(); if(p==='/yonetim/mevcut-oyunlar') return currentGamesAdmin(); if(p==='/yonetim/yayin-takvimi') return calendar(); if(p==='/yonetim/guncelleme-notlari' || p==='/guncellemeler') return updateNotes(); if(p==='/yonetim/bakim-modu') return maintenance(); return notFound(); }
function bind(){
  document.body.addEventListener('click', e=>{
    const a=e.target.closest('a[href]'); if(a && a.origin===location.origin && !a.hasAttribute('download')){ e.preventDefault(); setRoute(a.pathname + a.search); return; }
    const delGame=e.target.closest('[data-delete-game]'); if(delGame){ const id=delGame.dataset.deleteGame; saveGames(loadGames().filter(g=>String(g.id)!==String(id))); toast('Oyun silindi.'); render(); }
    const delEvent=e.target.closest('[data-delete-event]'); if(delEvent){ const rows=loadEvents(); rows.splice(Number(delEvent.dataset.deleteEvent),1); saveEvents(rows); toast('Yayın silindi.'); render(); }
    const delNote=e.target.closest('[data-delete-note]'); if(delNote){ const rows=loadNotes(); rows.splice(Number(delNote.dataset.deleteNote),1); saveNotes(rows); toast('Not silindi.'); render(); }
    if(e.target.closest('[data-action="hard-refresh"]')) location.reload();
  });
  document.body.addEventListener('submit', e=>{
    const search=e.target.closest('[data-search-form]'); if(search){ e.preventDefault(); const fd=new FormData(search); setRoute('/oyun-arsivi?q='+encodeURIComponent(fd.get('q')||'')+'&status='+encodeURIComponent(fd.get('status')||'Tümü')); return; }
    const gf=e.target.closest('[data-game-form]'); if(gf){ e.preventDefault(); const fd=new FormData(gf); const rows=loadGames(); const title=fd.get('title'); rows.unshift(normalizeGame({id:slugify(title),title,status:fd.get('status'),genre:fd.get('genre'),seriesName:fd.get('seriesName'),cover:fd.get('cover')||'/assets/hayatimiz-kapak.png',releaseDate:fd.get('releaseDate'),description:fd.get('description'),youtubePlaylistUrl:fd.get('youtubePlaylistUrl'),tags:fd.get('tags')},0)); saveGames(rows); toast('Oyun kaydedildi.'); setRoute('/oyun-arsivi'); return; }
    const ef=e.target.closest('[data-event-form]'); if(ef){ e.preventDefault(); const fd=new FormData(ef); const rows=loadEvents(); rows.unshift({id:'event-'+Date.now(),title:fd.get('title'),date:fd.get('date'),time:fd.get('time'),videoUrl:fd.get('videoUrl'),note:fd.get('note')}); saveEvents(rows); toast('Yayın kaydedildi.'); render(); return; }
    const nf=e.target.closest('[data-note-form]'); if(nf){ e.preventDefault(); const fd=new FormData(nf); const rows=loadNotes(); rows.unshift({id:'note-'+Date.now(),version:fd.get('version'),status:fd.get('status'),title:fd.get('title'),summary:fd.get('summary')}); saveNotes(rows); toast('Güncelleme notu kaydedildi.'); render(); return; }
    const mf=e.target.closest('[data-maint-form]'); if(mf){ e.preventDefault(); const fd=new FormData(mf); saveMaintenance({enabled:fd.get('enabled')==='true',percent:Number(fd.get('percent')||0),message:fd.get('message'),eta:fd.get('eta')}); toast('Bakım modu kaydedildi.'); render(); return; }
  });
}
function render(){ const root=document.getElementById('root'); if(!root) return; root.innerHTML=pageHtml(); document.title='Hayatımız Oyun - '+VERSION; }
window.addEventListener('popstate', render);
window.addEventListener('error', ev=>{ console.error('v2.0.3 hata:', ev.message); const root=document.getElementById('root'); if(root && (root.textContent||'').trim().length<40) root.innerHTML=home(); });
document.addEventListener('DOMContentLoaded', ()=>{ bind(); render(); setTimeout(()=>{ const r=document.getElementById('root'); if(!r || (r.textContent||'').trim().length<40) render(); }, 300); });
