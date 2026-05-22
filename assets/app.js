
/* Hayatımız Oyun - V2.0.0 İlk Büyük Güncelleme */
const VERSION='2.0.0';
const STAFF=['Moderatör','Editör','Admin','Kurucu'];
const state={games:[],notes:[],events:[],settings:{},page:'home',filter:'',user:JSON.parse(localStorage.ho_user||'null'),selectedFriend:null,seriesEditKey:''};
const $=(s,el=document)=>el.querySelector(s);
const $$=(s,el=document)=>[...el.querySelectorAll(s)];
const esc=(v='')=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const enc=(v='')=>encodeURIComponent(String(v??''));
const slug=(v='')=>String(v||'').toLocaleLowerCase('tr-TR').trim().replace(/[ğ]/g,'g').replace(/[ü]/g,'u').replace(/[ş]/g,'s').replace(/[ı]/g,'i').replace(/[ö]/g,'o').replace(/[ç]/g,'c').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')||('oyun-'+Date.now());
function headerSafe(v=''){return encodeURIComponent(String(v||''));}
function canSeeAdmin(){return !!(state.user&&STAFF.includes(state.user.role));}
function actorHeaders(){return {'x-user-id':headerSafe(state.user?.id||''),'x-admin-user':headerSafe(state.user?.username||'Kullanıcı'),'x-admin-role':headerSafe(state.user?.role||'user')};}
async function api(url,opts={}){
  const isForm=opts.body instanceof FormData;
  opts.headers={...(isForm?{}:{'Content-Type':'application/json'}),...actorHeaders(),...(opts.headers||{})};
  opts.cache='no-store';
  const r=await fetch(url,opts);
  const text=await r.text();
  let j={};
  try{j=text?JSON.parse(text):{}}catch{
    const isHtml=/<!doctype html|<html/i.test(text||'');
    const hint=isHtml?'API yerine HTML döndü. Temiz kurulumda eski dosyaları silip ZIP içeriğini tekrar gönder ve Vercel Redeploy yap.':'';
    throw new Error(`API JSON döndürmedi. HTTP ${r.status} — ${hint} ${String(text||'').slice(0,140)}`);
  }
  if(!r.ok||j.ok===false)throw new Error(j.message||'İşlem başarısız.');
  return j;
}
async function uploadImage(file,folder='uploads'){ if(!file)return ''; const fd=new FormData(); fd.append('folder',folder); fd.append('file',file); const r=await fetch('/api/upload',{method:'POST',headers:actorHeaders(),body:fd}); const text=await r.text(); let j; try{j=JSON.parse(text)}catch{throw new Error('Upload JSON okunamadı. HTTP '+r.status)} if(!r.ok||j.ok===false) throw new Error(j.message||'Upload başarısız'); return j.url; }
function trSort(a,b){return String(a||'').localeCompare(String(b||''),'tr',{numeric:true,sensitivity:'base'});} 
function parseDate(v){ if(!v)return null; const s=String(v).trim(); let m=s.match(/^(\d{2})\.(\d{2})\.(\d{4})(?:\s+(\d{2}):(\d{2}))?$/); if(m)return new Date(+m[3],+m[2]-1,+m[1],+(m[4]||0),+(m[5]||0)); m=s.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2}))?/); if(m)return new Date(+m[1],+m[2]-1,+m[3],+(m[4]||0),+(m[5]||0)); const d=new Date(s); return Number.isNaN(d.getTime())?null:d; }
function fmtDate(v){const d=parseDate(v); return d?d.toLocaleDateString('tr-TR',{day:'2-digit',month:'2-digit',year:'numeric'}):(v||'');}
function fmtDateTime(v){const d=parseDate(v); return d?d.toLocaleString('tr-TR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}):(v||'');}
function img(g){ if(!g)return ''; return g.cover||g.thumbnail||g.episodes?.[0]?.thumbnail||''; }
function gameCover(g){ const src=img(g); if(src)return src; const hay=(`${g?.title||''} ${g?.series||''} ${g?.type||''}`).toLocaleLowerCase('tr-TR'); if(/demo/.test(hay))return '/assets/demo-series-cover.svg'; if(/dlc|ek paket|expansion/.test(hay))return '/assets/dlc-series-cover.svg'; return '/assets/series-placeholder.svg'; }
function hasRealCover(g){ const u=String(img(g)||''); return !!u && !/series-placeholder\.svg|demo-series-cover\.svg|dlc-series-cover\.svg/i.test(u); }
function gameIssues(g){ g=g||{}; const a=[]; if(!hasRealCover(g))a.push('Kapak eksik / otomatik kapak'); if(!String(g.title||'').trim())a.push('Başlık boş'); if(!String(g.series||'').trim())a.push('Seri adı boş'); if(!String(g.description||'').trim())a.push('Hikaye yok'); if(!(Array.isArray(g.episodes)&&g.episodes.length))a.push('Bölüm yok'); if(!g.slug)a.push('Slug yok'); return a; }
function isBrokenGame(g){ return gameIssues(g).length>0; }

function siteTitle(){return state.settings?.site_title||'Hayatımız Oyun';}
function activeTheme(){return state.user?.theme||state.settings?.theme||'dark';}
function absoluteUrl(u){if(!u)return 'https://hayatimiz-oyun-youtube-arsivi.vercel.app/assets/og-cover.png'; if(/^data:/i.test(u))return 'https://hayatimiz-oyun-youtube-arsivi.vercel.app/assets/og-cover.png'; try{return new URL(u, location.origin).href}catch{return 'https://hayatimiz-oyun-youtube-arsivi.vercel.app/assets/og-cover.png'}}
function setMeta(sel,attr,val){let el=document.querySelector(sel); if(!el){el=document.createElement('meta'); if(sel.includes('property='))el.setAttribute('property',sel.match(/property="([^"]+)/)?.[1]||''); else el.setAttribute('name',sel.match(/name="([^"]+)/)?.[1]||''); document.head.appendChild(el);} el.setAttribute(attr,val||'');}
function updateSeo({title,description,image,url}={}){const site=siteTitle(); const t=title?`${title} - ${site}`:(state.settings?.share_title||`${site} - Oyun ve Seri İzleme Arşivi`); const d=(description||state.settings?.share_description||'Oyun serileri, bölümler, takvim, favoriler ve izleme takibi için Hayatımız Oyun arşivi.').slice(0,220); const imgUrl=absoluteUrl(image||state.settings?.share_image||state.settings?.site_logo||'/assets/og-cover.png'); const pageUrl=url||location.href.split('#')[0]; document.title=t; setMeta('meta[name="description"]','content',d); setMeta('meta[property="og:title"]','content',t); setMeta('meta[property="og:description"]','content',d); setMeta('meta[property="og:image"]','content',imgUrl); setMeta('meta[property="og:url"]','content',pageUrl); setMeta('meta[name="twitter:title"]','content',t); setMeta('meta[name="twitter:description"]','content',d); setMeta('meta[name="twitter:image"]','content',imgUrl);}
function parseSocialLinks(value){
  if(!value)return [];
  if(Array.isArray(value))return value.filter(x=>x&&x.url);
  const raw=String(value||'').trim(); if(!raw)return [];
  try{const j=JSON.parse(raw); if(Array.isArray(j))return j.filter(x=>x&&x.url);}catch{}
  return raw.split(/\n+/).map(line=>line.trim()).filter(Boolean).map(line=>{
    const parts=line.split('|').map(x=>x.trim());
    if(parts.length>=2)return {title:parts[0],url:parts[1],active:parts[2]!== 'pasif'};
    return {title:'',url:parts[0],active:true};
  }).filter(x=>x.url && x.active!==false);
}
function socialPlatform(url='',title=''){
  const u=String(url||'').toLowerCase(), t=String(title||'').toLowerCase();
  const hay=u+' '+t;
  if(/youtube|youtu\.be/.test(hay))return {key:'youtube',name:'YouTube',icon:'▶',short:'YT'};
  if(/kick\.com|\bkick\b/.test(hay))return {key:'kick',name:'Kick',icon:'K',short:'K'};
  if(/discord|discord\.gg/.test(hay))return {key:'discord',name:'Discord',icon:'💬',short:'DC'};
  if(/bynogame|bağış|bagis|donate|donation|destek|support|tip|trakteer|papara/.test(hay))return {key:'donate',name:'Bağış',icon:'❤',short:'BG'};
  if(/tiktok/.test(hay))return {key:'tiktok',name:'TikTok',icon:'♪',short:'TT'};
  if(/instagram/.test(hay))return {key:'instagram',name:'Instagram',icon:'◎',short:'IG'};
  if(/twitch/.test(hay))return {key:'twitch',name:'Twitch',icon:'▣',short:'TW'};
  if(/x\.com|twitter/.test(hay))return {key:'twitter',name:'X',icon:'𝕏',short:'X'};
  if(/steam/.test(hay))return {key:'steam',name:'Steam',icon:'♨',short:'ST'};
  if(/github/.test(hay))return {key:'github',name:'GitHub',icon:'⌘',short:'GH'};
  if(/telegram|t\.me/.test(hay))return {key:'telegram',name:'Telegram',icon:'✈',short:'TG'};
  return {key:'link',name:title||'Link',icon:'🔗',short:'LN'};
}
function normalizeUrl(url=''){let u=String(url||'').trim(); if(!u)return ''; if(/^javascript:/i.test(u))return ''; if(!/^https?:\/\//i.test(u))u='https://'+u; return u;}
function socialIconHtml(item,mini=false){
  const url=normalizeUrl(item.url); if(!url)return '';
  const p=socialPlatform(url,item.title);
  const label=item.title||p.name;
  return `<a class="social-icon ${p.key} ${mini?'mini':''}" data-platform="${esc(p.key)}" href="${esc(url)}" target="_blank" rel="noopener noreferrer" title="${esc(label)}" aria-label="${esc(label)}"><span>${esc(p.icon)}</span><b>${esc(mini?p.short:label)}</b></a>`;
}
function socialLinksHtml(mini=false){return socialLinksFromSettings().map(x=>socialIconHtml(x,mini)).join('');}
function buildSettingsSocialLinks(f={}){
  const rows=[['YouTube',f.social_youtube],['Kick',f.social_kick],['Discord',f.social_discord],['TikTok',f.social_tiktok],['Instagram',f.social_instagram],['Bağış',f.social_donate]]
    .filter(x=>String(x[1]||'').trim()).map(([t,u])=>`${t}|${String(u).trim()}`);
  const extra=String(f.social_links||'').split(/\n+/).map(x=>x.trim()).filter(Boolean);
  return [...rows,...extra].join('\n');
}
function renderSocialSurfaces(){
  const html=socialLinksHtml(true);
  let head=$('#socialHeader');
  if(!head){head=document.createElement('div'); head.id='socialHeader'; head.className='social-header'; document.querySelector('header.top')?.appendChild(head);}
  head.innerHTML=state.settings?.show_social_header===false?'':html;
  const foot=$('#siteFooter'); if(foot)foot.innerHTML=`<div class="footer-info"><b>${esc(siteTitle())}</b><small>V${VERSION} • V2.5.0 final hazırlığı</small><p>${esc(state.settings?.footer_text||state.settings?.share_description||'Oyun ve seri izleme arşivi.')}</p><div class="footer-links"><button class="ghost small" onclick="setPage('notes')">Güncelleme Notları</button><button class="ghost small" onclick="setPage('calendar')">Takvim</button><button class="ghost small" onclick="setPage('about')">Hakkında / Destek</button></div></div><div class="footer-social">${state.settings?.show_social_footer===false?'':(html||'<span class="muted">Sosyal medya linkleri ayarlardan eklenebilir.</span>')}</div>`;
  const fav=state.settings?.favicon||state.settings?.site_logo; if(fav){let l=document.querySelector('link[rel="icon"]'); if(l)l.href=fav;}
  renderSideMenu();
}
function renderSideMenu(){
  // V1.9.1 Fix 1: Sol menü masaüstünde üst menüyle çakıştığı için kaldırıldı.
  // Menü işlemleri üst navigasyondan ve mobil Menü butonundan devam eder.
  document.getElementById('sideMenu')?.remove();
}
function socialPreviewFromText(v){return parseSocialLinks(v).map(x=>socialIconHtml(x)).join('')||'<p class="muted">Link yazınca ikon otomatik algılanır.</p>';}
function updateSocialPreview(){const el=$('#socialPreview'),field=$('#socialLinksField'); if(el&&field)el.innerHTML=socialPreviewFromText(field.value);}

function shareButton(title,text,url){return `<button class="ghost" onclick="sharePage('${enc(title||siteTitle())}','${enc(text||'Hayatımız Oyun arşivi')}','${enc(url||location.href)}')">Paylaş</button>`;}
async function sharePage(t,txt,u){const data={title:decodeURIComponent(t),text:decodeURIComponent(txt),url:decodeURIComponent(u)}; try{if(navigator.share)await navigator.share(data); else{await navigator.clipboard.writeText(data.url); alert('Link kopyalandı.')}}catch(e){}}
function coverStyle(g){return `background-image:url('${esc(img(g)||'/assets/fallback-cover.png')}'),url('/assets/fallback-cover.png')`;} 
function applyTheme(){document.body.dataset.theme=activeTheme();}
function roleLabel(){return state.user?`${state.user.username} (${state.user.role||'user'})`:'';}
function getSeriesName(g){return g.series||g.title||'Tekil Oyun';}
function canonicalSeriesName(value='',title=''){let x=String(value||title||'').trim().replace(/[’`´]/g,"'").replace(/\s+/g,' '); if(!x)return ''; x=x.replace(/\b(Türkçe\s+Altyazılı|Türkçe\s+Dublajlı|Full|Tüm\s+Bölümler|Final|DLC|Remake|Remaster|Coop|%100)\b/ig,'').trim(); const rules=[[/assassin'?s\s+creed/i,"Assassin's Creed"],[/a\s+plague\s+tale/i,'A Plague Tale'],[/resident\s+evil/i,'Resident Evil'],[/silent\s+hill/i,'Silent Hill'],[/half[-\s]?life|black\s+mesa/i,'Half-Life'],[/dead\s+island/i,'Dead Island'],[/crysis/i,'Crysis'],[/far\s+cry/i,'Far Cry'],[/call\s+of\s+duty/i,'Call of Duty'],[/tomb\s+raider/i,'Tomb Raider'],[/god\s+of\s+war/i,'God of War'],[/uncharted/i,'Uncharted'],[/metro/i,'Metro'],[/mafia/i,'Mafia'],[/max\s+payne/i,'Max Payne'],[/watch\s+dogs/i,'Watch Dogs'],[/alan\s+wake/i,'Alan Wake'],[/little\s+nightmares/i,'Little Nightmares']]; for(const [re,name] of rules)if(re.test(x))return name; return (x.split(/[:\-–—]/)[0]||x).replace(/\s+(I|II|III|IV|V|VI|VII|VIII|IX|X|[0-9]+)\b.*$/i,'').trim()||x;}
function sortGamesByRelease(arr){return [...arr].sort((a,b)=>{const ao=Number(a.order_no)||0, bo=Number(b.order_no)||0; if(ao||bo) return (ao||999999)-(bo||999999)||trSort(a.title,b.title); return (parseDate(a.release_date)?.getTime()||9999999999999)-(parseDate(b.release_date)?.getTime()||9999999999999)||trSort(a.title,b.title);});}
function groupGames(list=state.games){const map=new Map(); for(const g of list){const k=canonicalSeriesName(getSeriesName(g),g.title); if(!map.has(k))map.set(k,{series:k,games:[]}); map.get(k).games.push(g);} return [...map.values()].map(gr=>({...gr,games:sortGamesByRelease(gr.games)})).sort((a,b)=>trSort(a.series,b.series));}
function isUpcoming(g){return String(g?.status||'').toLocaleLowerCase('tr-TR').includes('yakında');}
function countdownText(v){const d=parseDate(v); if(!d)return 'Başlangıç tarihi belli değil'; const diff=d-Date.now(); if(diff<=0)return 'Başlama tarihi geldi'; const days=Math.floor(diff/86400000),h=Math.floor(diff%86400000/3600000),m=Math.floor(diff%3600000/60000); if(days>0)return `${days} gün ${h} saat kaldı`; if(h>0)return `${h} saat ${m} dakika kaldı`; return `${Math.max(1,m)} dakika kaldı`;}
function getUpcomingStart(g){return g?.upcoming_start||g?.start_date||'';}
function groupUpcomingStart(gr){return (gr.games||[]).map(getUpcomingStart).filter(Boolean).sort((a,b)=>(parseDate(a)||9e15)-(parseDate(b)||9e15))[0]||'';}
function upcomingBox(v){return `<div class="upcoming-box"><b>Yakında</b><span>${esc(countdownText(v))}</span><small>Başlangıç: ${esc(fmtDateTime(v)||'Belli değil')}</small></div>`;}
function watchState(){return JSON.parse(localStorage.ho_watch||'{}');}
function saveWatchState(w){localStorage.ho_watch=JSON.stringify(w); if(state.user){api('/api/auth',{method:'POST',body:JSON.stringify({action:'watch',id:state.user.id,watch_state:w,xp:state.user.xp||0,level:state.user.level||1})}).then(j=>{state.user=j.user;localStorage.ho_user=JSON.stringify(state.user)}).catch(()=>{});} }
function getFavs(){return state.user?.favorites||JSON.parse(localStorage.ho_favs||'{"games":[],"series":[]}');}
function saveFavs(f){if(state.user){state.user.favorites=f; localStorage.ho_user=JSON.stringify(state.user); api('/api/auth',{method:'POST',body:JSON.stringify({action:'favorites',id:state.user.id,favorites:f})}).catch(()=>{});} else localStorage.ho_favs=JSON.stringify(f);}
function continueCount(){return Object.values(watchState()).filter(v=>v.here&&!v.watched).length;}

function soundPrefs(){return JSON.parse(localStorage.ho_sound||'{"enabled":false,"volume":0,"muted":true,"notify":false}');}
function saveSoundPrefs(p){localStorage.ho_sound=JSON.stringify(p);}
const musicState={ctx:null,master:null,playing:false,started:false,theme:'Sessiz Mod'};
function initMusic(){return null;}
function setAtmosphereTheme(label='Ana Sayfa'){
  const names={home:'Sessiz Ana Sayfa',series:'Sessiz Seriler',az:'Sessiz Arşiv',calendar:'Sessiz Takvim',social:'Sessiz Sosyal',profile:'Sessiz Profil',admin:'Admin Sessiz Mod',notes:'Sessiz Güncellemeler'};
  musicState.theme=names[state.page]||'Sessiz Mod';
  const name=$('#musicTrack'); if(name)name.textContent=musicState.theme;
}
function playMusic(){
  const pref=soundPrefs(); pref.enabled=false; pref.muted=true; pref.notify=false; pref.volume=0; pref.volume=0; saveSoundPrefs(pref);
  musicState.playing=false; renderMusicPanel();
}
function pauseMusic(){
  const pref=soundPrefs(); pref.enabled=false; pref.muted=true; pref.notify=false; pref.volume=0; pref.volume=0; saveSoundPrefs(pref);
  musicState.playing=false; renderMusicPanel();
}
function toggleMusic(){pauseMusic();}
function setMusicVolume(v){
  const pref=soundPrefs(); pref.volume=0; pref.enabled=false; pref.muted=true; pref.notify=false; pref.volume=0; saveSoundPrefs(pref);
  musicState.playing=false; renderMusicPanel(false);
}
function renderMusicPanel(update=true){
  let panel=$('#musicPanel');
  if(!panel){document.body.insertAdjacentHTML('beforeend','<div id="musicPanel" class="music-panel silent-only collapsed"></div>'); panel=$('#musicPanel');}
  panel.classList.add('collapsed','silent-only');
  panel.innerHTML=`<div class="music-head"><b>Sessiz Mod</b><small id="musicTrack">${esc(musicState.theme||'Tüm sesler kapalı')}</small></div><small class="muted">Fix 4: otomatik müzik, efekt ve yapay bip sesleri tamamen devre dışı.</small>`;
}
function nextAtmosphere(){setAtmosphereTheme(state.page);}
function bootAudioOnUserGesture(){}
function hideLoader(){const l=$('#siteLoader'); if(l){l.classList.add('hide'); setTimeout(()=>l.remove(),650);} renderMusicPanel(); setAtmosphereTheme(state.page);}
function playNotificationSound(){}

function loaderSet(pct,text){const b=$('#loaderBar'),n=$('#loaderPct'),t=$('#loaderText'); if(b)b.style.width=pct+'%'; if(n)n.textContent=pct+'%'; if(t&&text)t.textContent=text;}
function hideLoader(){const l=$('#siteLoader'); if(l){l.classList.add('hide'); setTimeout(()=>l.remove(),650);} renderMusicPanel(); setAtmosphereTheme(state.page);}
function playNotificationSound(){const pref=soundPrefs(); if(!pref.notify)return; initMusic(); const ctx=musicState.ctx; if(!ctx)return; const o=ctx.createOscillator(),g=ctx.createGain(); o.frequency.value=880; o.type='sine'; g.gain.value=(pref.volume||.25)*.25; o.connect(g); g.connect(ctx.destination); o.start(); g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.28); setTimeout(()=>o.stop(),320);}

async function load(){
  const safe=async(label,pct,fn,fallback)=>{try{loaderSet(pct,label); return await fn();}catch(e){console.warn(label,e); return fallback;}};
  const s=await safe('Site ayarları hazırlanıyor...',12,()=>api('/api/settings'),{settings:{}}); state.settings=s.settings||{};
  const g=await safe('Oyunlar yükleniyor...',35,()=>api('/api/games'),{games:[]}); state.games=g.games||[];
  const n=await safe('Güncelleme notları alınıyor...',58,()=>api('/api/notes'),{notes:[]}); state.notes=n.notes||[];
  const c=await safe('Takvim kontrol ediliyor...',78,()=>api('/api/calendar'),{events:[]}); state.events=c.events||[];
  loaderSet(100,'Atmosfer başlatılıyor...');
}
function renderNav(){const items=[['home','Ana Sayfa'],['series','Seriler'],['az','A-Z'],['calendar','Takvim'],['notes','Güncelleme Notları'],['social','Sosyal'],['about','Hakkında'],['profile','Profil']]; if(canSeeAdmin())items.push(['admin','Admin']); $('#brand').innerHTML=`${state.settings?.site_logo?`<img src="${esc(state.settings.site_logo)}" class="brand-logo">`:''}<b>${esc(siteTitle())}</b><small>V${VERSION}</small>`; $('#nav').innerHTML=items.map(([p,t])=>`<button type="button" data-page="${p}" class="${state.page===p?'active':''}">${t}</button>`).join(''); $$('#nav button').forEach(b=>b.addEventListener('click',()=>setPage(b.dataset.page))); renderSocialSurfaces();}
function setPage(p){state.page=p||'home'; location.hash='#/'+state.page; render();}
function render(){applyTheme(); document.documentElement.style.setProperty('--bg-intensity', Math.max(.2, Math.min(1.25, Number(state.settings?.background_intensity??75)/100))); updateSeo(); document.body.classList.remove('menu-open'); const app=$('#app'); if(app){app.classList.remove('page-in'); void app.offsetWidth; app.classList.add('page-in');} renderNav(); setAtmosphereTheme(state.page); if(state.settings?.maintenance&&!canSeeAdmin()){maintenance();return;} const pages={home,series,az,calendar,notes,social,about,profile,admin}; (pages[state.page]||home)(); renderMusicPanel();}
function maintenance(){
 const logo=state.settings?.site_logo?`<img src="${esc(state.settings.site_logo)}" class="maint-logo">`:'<div class="maint-logo-text">HO</div>';
 const rawProgress=Number(state.settings?.maintenance_progress??88);
 const progress=Math.max(0,Math.min(100,Number.isFinite(rawProgress)?rawProgress:88));
 const featureText=state.settings?.upcoming_features||'Admin panel V3 düzeni hazırlanıyor\nYouTube senkronizasyon stabilizasyonu ve senkronizasyon güçleniyor\nRAWG kapak ve hikaye toplu düzeltme geliyor\nProfil, bildirim ve sosyal sistem profesyonelleşiyor\n2.5.0 güncellemesinde site final olarak açılacak';
 const features=String(featureText).split(/\n|,/).map(x=>x.trim()).filter(Boolean).slice(0,8);
 const socialButtons=socialLinksHtml(); $('#app').innerHTML=`<section class="maintenance maintenance-v176"><div class="orb"></div><div class="maint-panel">${logo}<span class="version-pill">V${VERSION}</span><h1>Bakımdayız</h1><p class="maint-big">Site güncelleniyor, yeni sürüm hazırlanıyor.</p><p class="muted">${esc(state.settings?.maintenance_note||'2.5.0 güncellemesinde site final olarak açılacak.')}</p><p class="final-countdown"><b>V2.5.0 Final:</b> ${esc(finalCountdown())}</p><div class="maint-progress"><div class="maint-progress-top"><b>Güncelleme ilerlemesi</b><span>%${progress}</span></div><div class="maint-bar"><i style="width:${progress}%"></i></div></div><div class="maint-features"><h2>Yeni Gelecek Özellikler</h2><div class="feature-list">${features.map(f=>`<span>${esc(f)}</span>`).join('')}</div></div><div class="social-icons maintenance-social">${socialButtons}</div><div class="row center"><button onclick="setPage('profile')">Giriş Yap</button>${state.user?'<button class="ghost" onclick="logout()">Çıkış Yap</button>':''}</div><div class="card maint-notes"><h2>Güncelleme Notları</h2>${noteList(state.notes.filter(n=>n.public_visible!==false).slice(0,5))}</div></div></section>`;}

function getSocialItem(key){return socialLinksFromSettings().find(x=>socialPlatform(x.url,x.title).key===key);} 
function finalCountdown(){
  const d=parseDate(state.settings?.final_release_date); if(!d)return '2.5.0 final hazırlığı sürüyor.';
  const diff=d.getTime()-Date.now(); if(diff<=0)return '2.5.0 final açılış zamanı geldi.';
  const day=Math.floor(diff/86400000), hour=Math.floor(diff%86400000/3600000), min=Math.floor(diff%3600000/60000);
  return `${day} gün ${hour} saat ${min} dk kaldı`;
}
function streamerCard(){
 const kick=getSocialItem('kick'); const donate=getSocialItem('donate'); const yt=getSocialItem('youtube'); const discord=getSocialItem('discord');
 const buttons=[kick,donate,yt,discord].filter(Boolean).map(x=>socialIconHtml(x)).join('');
 if(state.settings?.show_streamer_card===false||!buttons)return '';
 const live=!!state.settings?.kick_live;
 const desc=state.settings?.publisher_description||'Kick yayınları, YouTube arşivi, Discord topluluğu ve bağış bağlantıları burada.';
 return `<section class="card streamer-card streamer-v186"><div><span class="version-pill ${live?'live-pill':''}">${live?'● Canlı Yayında':'Yayıncı Alanı'}</span><h2>Hayatımız Oyun'u takip et ve destek ol</h2><p class="muted">${esc(desc)}</p><p class="muted"><b>V2.5.0 Final:</b> ${esc(finalCountdown())}</p></div><div class="social-icons streamer-links">${buttons}</div></section>`;
}
function supportLinks(){const links=socialLinksFromSettings(); return links.length?`<div class="social-icons support-links">${links.map(x=>socialIconHtml(x)).join('')}</div>`:'<p class="muted">Sosyal bağlantılar admin panelinden eklenebilir.</p>';}
function card(g){const up=isUpcoming(g); const ep=g.episodes?.length||0; return `<article class="card game pro-card ${up?'upcoming-card':''}"><div class="cover" style="${coverStyle(g)}"><span class="badge-top">${esc(up?'Yakında':(g.status||'Arşiv'))}</span></div><div class="body"><h3>${esc(g.title)}</h3><p class="muted">${esc(getSeriesName(g))} • ${fmtDate(g.release_date)} • ${ep} bölüm</p>${up?upcomingBox(getUpcomingStart(g)):''}<p>${esc((g.description||'').slice(0,150))}</p><div class="tags">${(g.tags||[]).slice(0,5).map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div><div class="row"><button onclick="openGame('${esc(g.slug)}')">Detay</button>${up?'':`<button onclick="watchGame('${esc(g.slug)}',0)">İzle</button>`}<button class="ghost" onclick="favGame('${esc(g.slug)}')">Favori</button></div></div></article>`;}
function seriesCard(gr){const ep=gr.games.reduce((a,g)=>a+(g.episodes?.length||0),0); const up=gr.games.some(isUpcoming); const cover=img(gr.games.find(x=>x.cover)||gr.games[0]); const desc=gr.games.find(g=>g.description)?.description||`${gr.series} serisi.`; return `<article class="card game pro-card ${up?'upcoming-card':''}"><div class="cover" style="background-image:url('${esc(cover||'/assets/fallback-cover.png')}'),url('/assets/fallback-cover.png')"><span class="badge-top">${up?'Yakında':gr.games.length>1?'Seri':'Oyun'}</span></div><div class="body"><h3>${esc(gr.series)}</h3><p class="muted">${gr.games.length} oyun • ${ep} bölüm</p>${up?upcomingBox(groupUpcomingStart(gr)):''}<p>${esc(desc.slice(0,150))}</p><div class="row"><button onclick="openSeries('${esc(slug(gr.series))}')">Detay</button>${up?'':`<button onclick="watchSeries('${esc(slug(gr.series))}')">Sırayla İzle</button>`}<button class="ghost" onclick="favSeries('${esc(gr.series)}')">Favori</button></div></div></article>`;}
function statusStats(s){return groupGames(state.games.filter(g=>String(g.status||'').toLocaleLowerCase('tr-TR').includes(s.toLocaleLowerCase('tr-TR')))).length;}
function filterStatus(s){state.filter=s; home();}
function home(){const base=state.filter?state.games.filter(g=>String(g.status||'').toLocaleLowerCase('tr-TR').includes(state.filter.toLocaleLowerCase('tr-TR'))):state.games; const groups=groupGames(base); const totalEp=state.games.reduce((a,g)=>a+(g.episodes?.length||0),0); $('#app').innerHTML=`<section class="hero"><span class="version-pill">V${VERSION}</span><h1>${esc(siteTitle())}</h1><p class="muted">Oyun, seri, bölüm, favori ve izleme arşivi.</p><div class="stats"><span>${state.games.length}<small>Oyun</small></span><span>${groupGames().length}<small>Seri</small></span><span>${totalEp}<small>Bölüm</small></span><span>${continueCount()}<small>Devam</small></span></div><div class="status-buttons"><button onclick="filterStatus('Tamamlandı')">Tamamlanan Seriler (${statusStats('Tamamlandı')})</button><button onclick="filterStatus('Devam')">Devam Eden Seriler (${statusStats('Devam')})</button><button onclick="filterStatus('Yakında')">Yakında Gelecek Seriler (${statusStats('Yakında')})</button><button onclick="filterStatus('')">Tümü</button></div>${state.settings?.announcement?`<p class="notice">${esc(state.settings.announcement)}</p>`:''}</section>${streamerCard()}<h2>İzlemeye Devam Et</h2><div class="grid compact">${continueCards()}</div><h2>Favoriler</h2><div class="grid compact">${favoriteCards()}</div><div class="section-title"><h2>Alfabetik Seri Şeritleri</h2><input id="search" placeholder="Oyun / seri / etiket ara"></div>${alphaSeriesStrips(groups)}`; $('#search').oninput=e=>{const q=e.target.value.toLocaleLowerCase('tr-TR'); const filtered=base.filter(g=>(g.title+' '+getSeriesName(g)+' '+(g.genre||'')+' '+(g.tags||[]).join(' ')).toLocaleLowerCase('tr-TR').includes(q)); $('.alpha-wrap').innerHTML=alphaSeriesStrips(groupGames(filtered),true);};}
function alphaSeriesStrips(groups,inner=false){const letters='1234567890ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'.split(''); const html=`<div class="alpha-wrap">${letters.map(l=>{const arr=groups.filter(g=>(/\d/.test(l)?String(g.series||'')[0]===l:String(g.series||'').toLocaleUpperCase('tr-TR').startsWith(l))); return arr.length?`<section class="alpha-strip"><h2>${esc(l)} Serisi</h2><div class="grid">${arr.map(seriesCard).join('')}</div></section>`:''}).join('')||'<p>Henüz seri yok.</p>'}</div>`; return inner?html.replace(/^<div class="alpha-wrap">|<\/div>$/g,''):html;}
function continueCards(){const w=watchState(); const html=Object.entries(w).filter(([k,v])=>v.here&&!v.watched).slice(-6).reverse().map(([k,v])=>{const [sl,i]=k.split(':'); const g=state.games.find(x=>x.slug===sl); if(!g)return ''; return `<div class="card mini-card"><b>${esc(g.title)}</b><small>${esc(g.episodes?.[i]?.title||'Bölüm')}</small><button onclick="watchGame('${esc(sl)}',${+i||0})">Devam Et</button><button class="ghost" onclick="removeWatch('${esc(k)}')">Sil</button></div>`;}).join(''); return html||'<p class="muted">Henüz devam kaydı yok.</p>';}
function favoriteCards(){const f=getFavs(); const games=(f.games||[]).map(sl=>state.games.find(g=>g.slug===sl)).filter(Boolean).slice(0,6); const series=(f.series||[]).slice(0,4); const html=[...games.map(g=>`<div class="card mini-card"><b>${esc(g.title)}</b><button onclick="openGame('${esc(g.slug)}')">Aç</button></div>`),...series.map(s=>`<div class="card mini-card"><b>${esc(s)}</b><button onclick="openSeries('${esc(slug(s))}')">Aç</button></div>`)].join(''); return html||'<p class="muted">Favori yok.</p>';}
function favGame(sl){const f=getFavs(); f.games=f.games||[]; f.games=f.games.includes(sl)?f.games.filter(x=>x!==sl):[...f.games,sl]; saveFavs(f); render();}
function favSeries(s){const f=getFavs(); f.series=f.series||[]; f.series=f.series.includes(s)?f.series.filter(x=>x!==s):[...f.series,s]; saveFavs(f); render();}
function removeWatch(k){const w=watchState(); delete w[k]; saveWatchState(w); render();}
function series(){const groups=groupGames(); $('#app').innerHTML=`<section class="hero"><h1>Seriler</h1><p class="muted">Seriler çıkış sırasına göre dizilir.</p></section>${alphaSeriesStrips(groups)}`;}
function az(){const letters='1234567890ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'.split(''); $('#app').innerHTML=`<section class="hero"><h1>A-Z / Harfe Git</h1><div class="az">${letters.map(l=>`<button onclick="azPick('${l}')">${l}</button>`).join('')}<button onclick="azPick('')">Tümü</button></div></section><div id="azList" class="grid">${state.games.map(card).join('')}</div>`;}
function azPick(l){const list=l?state.games.filter(g=>String(g.title||'').toLocaleUpperCase('tr-TR').startsWith(l)):state.games; $('#azList').innerHTML=list.map(card).join('')||'<p>Sonuç yok.</p>';}
function storyText(g){return g.description||'Bu oyun için kısa Türkçe hikaye henüz eklenmedi.';}
function episodeStory(g,e,i){return e.story||`${g.title} ${i+1}. bölüm: Hikaye bu bölümde devam eder.`;}
function openSeries(key){const gr=groupGames().find(x=>slug(x.series)===key); if(!gr)return; const seriesCover=img(gr.games.find(x=>x.cover)||gr.games[0]); updateSeo({title:gr.series,description:(gr.games.find(g=>g.description)?.description||gr.series+' serisi.'),image:seriesCover,url:location.href}); const up=gr.games.some(isUpcoming); $('#app').innerHTML=`<section class="hero"><h1>${esc(gr.series)}</h1><p class="muted">${gr.games.length} oyun • ${gr.games.reduce((a,g)=>a+(g.episodes?.length||0),0)} bölüm</p>${up?upcomingBox(groupUpcomingStart(gr)):''}<div class="row">${up?'':`<button onclick="watchSeries('${esc(key)}')">Tüm Seriyi Sırayla İzle</button>`}<button class="ghost" onclick="setPage('series')">Serilere Dön</button>${shareButton(gr.series,gr.games.find(g=>g.description)?.description||gr.series+' serisi.',location.href)}</div></section><div class="grid">${gr.games.map(card).join('')}</div>`;}
function openGame(sl){const g=state.games.find(x=>x.slug===sl); if(!g)return; updateSeo({title:g.title,description:storyText(g),image:img(g),url:location.href}); const up=isUpcoming(g); $('#app').innerHTML=`<section class="hero"><span class="tag">${esc(getSeriesName(g))}</span><h1>${esc(g.title)}</h1><p class="muted">${esc(g.genre||'')} • ${fmtDate(g.release_date)} • ${esc(g.status||'')}</p>${up?upcomingBox(getUpcomingStart(g)):''}<div class="row">${up?'':`<button onclick="watchGame('${esc(g.slug)}',0)">İzle</button>`}<button class="ghost" onclick="favGame('${esc(g.slug)}')">Favori</button>${shareButton(g.title,storyText(g),location.href)}<button class="ghost" onclick="openSeries('${esc(slug(getSeriesName(g)))}')">Seriye Dön</button></div></section><div class="split"><div><div class="card story-card"><h2>Oyun Hikayesi</h2><p>${esc(storyText(g))}</p></div><div class="card"><h2>Bölümler</h2>${up?'<p class="muted">Bu oyun yakında gelecek.</p>':(g.episodes||[]).map((e,i)=>`<div class="episode"><span><b>${i+1}. ${esc(e.title||'Bölüm')}</b><small>${esc(episodeStory(g,e,i))}</small></span><button onclick="watchGame('${esc(g.slug)}',${i})">İzle</button></div>`).join('')||'<p>Bölüm yok.</p>'}</div></div><div class="card"><h2>Yorumlar</h2><div id="comments">Yükleniyor...</div>${state.user?`<form onsubmit="sendComment(event,'${esc(g.slug)}')"><textarea name="body" placeholder="Yorum yaz"></textarea><button>Yorum Yap</button></form>`:'<p class="muted">Yorum yazmak için giriş yap.</p>'}</div></div>`; loadComments(g.slug);}
function watchSeries(key){const gr=groupGames().find(x=>slug(x.series)===key); if(!gr)return; if(gr.games.some(isUpcoming))return alert('Bu seri yakında gelecek.'); const first=sortGamesByRelease(gr.games).find(g=>(g.episodes||[]).length); if(first)watchGame(first.slug,0);}
function watchGame(sl,i=0){const g=state.games.find(x=>x.slug===sl); if(!g)return; if(isUpcoming(g))return alert('Bu oyun yakında gelecek.'); const e=(g.episodes||[])[i]||{}; $('#app').innerHTML=`<section class="hero"><h1>${esc(g.title)}</h1><p>${esc(e.title||'Bölüm')}</p><div class="row"><button onclick="markHere('${esc(sl)}',${i})">Burada Kaldım</button><button onclick="markWatched('${esc(sl)}',${i})">İzledim</button><button class="ghost" onclick="undoWatched('${esc(sl)}',${i})">İzlendi Geri Al</button><button class="ghost" onclick="openGame('${esc(sl)}')">Detay</button></div></section><div class="split"><div class="card"><div class="video-wrap">${e.videoId?`<iframe src="https://www.youtube-nocookie.com/embed/${esc(e.videoId)}" allowfullscreen></iframe>`:'<p>Video ID yok.</p>'}</div></div><div class="card"><h2>Bölüm Hikayesi</h2><p>${esc(episodeStory(g,e,i))}</p><h3>Bölümler</h3>${(g.episodes||[]).map((x,idx)=>`<div class="episode"><span>${idx+1}. ${esc(x.title||'Bölüm')}</span><button onclick="watchGame('${esc(sl)}',${idx})">Aç</button></div>`).join('')}</div></div>`;}
function markHere(sl,i){const w=watchState(); w[`${sl}:${i}`]={here:true,watched:false,at:Date.now()}; saveWatchState(w); alert('Kaldığın yer kaydedildi.');}
function markWatched(sl,i){const w=watchState(); w[`${sl}:${i}`]={here:false,watched:true,at:Date.now()}; saveWatchState(w); alert('İzlendi olarak işaretlendi.');}
function undoWatched(sl,i){const w=watchState(); w[`${sl}:${i}`]={here:true,watched:false,at:Date.now()}; saveWatchState(w); alert('Geri alındı.');}
function calendar(){const today=new Date().toISOString().slice(0,10); const todayEvents=state.events.filter(e=>e.event_date===today); $('#app').innerHTML=`<section class="hero"><h1>Takvim</h1><p class="muted">Bugün: ${new Date().toLocaleDateString('tr-TR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'})}</p><p>${todayEvents.length?`Bugün ${todayEvents.length} etkinlik var.`:'Bugün etkinlik yok.'}</p></section><div class="grid">${state.events.map(e=>`<div class="card"><div class="calendar-img" style="background-image:url('${esc(e.image||'')}')"></div><h3>${esc(e.title)}</h3><p>${esc(e.game_title||'')} • ${fmtDate(e.event_date)} ${esc(e.event_time||'')}</p><p>${esc(e.description||'')}</p></div>`).join('')||'<p>Takvim boş.</p>'}</div>`;}
function noteList(arr){return (arr||[]).map(n=>`<div class="episode"><span><b>${esc(n.title||n.version)}</b><small>${esc(n.version||'')} • ${esc(n.type||'')}</small><p>${esc(n.body||'')}</p></span></div>`).join('')||'<p class="muted">Not yok.</p>';}
function notes(){const publicNotes=state.notes.filter(n=>n.public_visible!==false&&n.type!=='Admin'); $('#app').innerHTML=`<section class="hero"><h1>Güncelleme Notları</h1><p class="muted">Kullanıcıyı ilgilendiren yenilikler.</p></section><div class="note-grid"><div class="card"><h2>Yeni Özellikler</h2>${noteList(publicNotes.filter(n=>/özellik/i.test(n.type||'')))}</div><div class="card"><h2>Fix</h2>${noteList(publicNotes.filter(n=>/fix/i.test(n.type||'')))}</div><div class="card"><h2>Sürüm</h2>${noteList(publicNotes.filter(n=>/sürüm/i.test(n.type||'')))}</div></div>`;}

function about(){
 updateSeo({title:'Hakkında ve Destek',description:'Hayatımız Oyun sosyal bağlantıları, oyun istekleri ve V2.5.0 yol haritası.',image:state.settings?.site_logo||state.settings?.share_image});
 const aboutText=state.settings?.about_text||`Hayatımız Oyun; oyun serilerini, YouTube bölümlerini, takvimi, favorileri ve izleme takibini tek yerde toplayan Türkçe oyun arşivi platformudur. V2.5.0 açılışına kadar sosyal bağlantılar, oyun istekleri, geri bildirim ve profesyonel izleme sistemi geliştirilmeye devam eder.`;
 $('#app').innerHTML=`<section class="hero"><span class="version-pill">V${VERSION}</span><h1>Hakkında / Destek</h1><p class="muted">${esc(aboutText)}</p><div class="row"><button onclick="document.getElementById('requestBox')?.scrollIntoView({behavior:'smooth'})">Oyun İste</button><button class="ghost" onclick="document.getElementById('feedbackBox')?.scrollIntoView({behavior:'smooth'})">Geri Bildirim Gönder</button></div></section>
 <div class="split"><div class="card"><h2>Sosyal ve Destek Bağlantıları</h2>${supportLinks()}<p class="muted">YouTube, Kick, Discord, TikTok, Instagram ve Bynogame bağış linkleri admin panelinden ayrı ayrı düzenlenebilir.</p></div><div class="card"><h2>V2.5.0 Açılış Yol Haritası</h2><div class="feature-list"><span>Profesyonel oyun arşivi</span><span>Oyun / seri istekleri</span><span>Sosyal ve bildirim sistemi</span><span>YouTube senkronizasyonu</span><span>Takvim ve izleme takibi</span></div></div></div>
 <div class="split"><form id="requestBox" class="card" onsubmit="sendFeedback(event)"><h2>Oyun / Seri İste</h2><input name="name" value="${esc(state.user?.username||'')}" placeholder="Adın"><select name="type"><option>Oyun İsteği</option><option>Seri İsteği</option></select><input name="game_title" placeholder="Oyun / seri adı"><input name="playlist_url" placeholder="YouTube playlist linki varsa"><textarea name="message" placeholder="Notunu yaz"></textarea><button>İstek Gönder</button></form>
 <form id="feedbackBox" class="card" onsubmit="sendFeedback(event)"><h2>Geri Bildirim / Hata Bildir</h2><input name="name" value="${esc(state.user?.username||'')}" placeholder="Adın"><select name="type"><option>Hata Bildir</option><option>Öneri Gönder</option><option>Site Problemi</option><option>Tasarım Önerisi</option><option>Eksik İçerik</option><option>Diğer</option></select><textarea name="message" placeholder="Mesajını yaz"></textarea><button>Gönder</button></form></div>`;
}
async function sendFeedback(e){e.preventDefault(); const feedback=Object.fromEntries(new FormData(e.target)); if(feedback.game_title||feedback.playlist_url){feedback.message=`${feedback.message||''}\nOyun/Seri: ${feedback.game_title||''}\nPlaylist: ${feedback.playlist_url||''}`.trim();} try{await api('/api/social?action=feedback',{method:'POST',body:JSON.stringify({feedback})}); alert('Gönderildi. Teşekkürler.'); e.target.reset();}catch(err){alert(err.message)}}
function profile(){if(!state.user){$('#app').innerHTML=`<section class="hero"><h1>Profil</h1><p class="muted">Giriş yap veya kayıt ol.</p></section><div class="split"><form class="card" onsubmit="login(event)"><h2>Giriş</h2><input name="username" placeholder="Kullanıcı adı"><input name="password" type="password" placeholder="Şifre"><button>Giriş Yap</button></form><form class="card" onsubmit="register(event)"><h2>Kayıt</h2><input name="username" placeholder="Kullanıcı adı"><input name="password" type="password" placeholder="Şifre"><button>Kayıt Ol</button></form></div>`;return;} const photo=state.user.profile_photo||''; const links=socialPreviewFromText(state.user.social_links||''); $('#app').innerHTML=`<section class="hero profile-pro"><div class="avatar xl">${photo?`<img src="${esc(photo)}">`:esc(state.user.username?.[0]||'K')}</div><div><h1>${esc(state.user.username)}</h1><p class="muted">${esc(state.user.role||'user')} • XP ${state.user.xp||0} • Level ${state.user.level||1}</p><div class="social-icons profile-social">${links}</div><button onclick="logout()">Çıkış Yap</button></div></section><div class="profile-grid"><form class="card" onsubmit="saveProfile(event)"><h2>Profil Ayarları</h2><label>Profil fotoğrafı</label><input type="file" name="profile_file" accept="image/*"><label>Sosyal medya linkleri</label><textarea name="social_links" placeholder="Her satıra bir link yaz: https://youtube.com/...">${esc(state.user.social_links||'')}</textarea><small class="muted">YouTube, Kick, Bağış/Bynogame, Instagram, TikTok, Discord, Twitch, X, Steam, GitHub otomatik ikonlanır.</small><button>Kaydet</button></form><div class="card"><h2>İzlemeye Devam Et</h2>${continueCards()}</div><div class="card wide"><h2>Favoriler</h2><div class="grid compact">${favoriteCards()}</div></div></div>`;}
async function register(e){e.preventDefault(); const b=Object.fromEntries(new FormData(e.target)); try{const j=await api('/api/auth',{method:'POST',body:JSON.stringify({action:'register',...b})}); state.user=j.user; localStorage.ho_user=JSON.stringify(j.user); render();}catch(err){alert(err.message)}}
async function login(e){e.preventDefault(); const b=Object.fromEntries(new FormData(e.target)); try{const j=await api('/api/auth',{method:'POST',body:JSON.stringify({action:'login',...b})}); state.user=j.user; localStorage.ho_user=JSON.stringify(j.user); render();}catch(err){alert(err.message)}}
function logout(){localStorage.removeItem('ho_user'); state.user=null; render();}
async function saveProfile(e){e.preventDefault(); try{const patch={action:'profile',id:state.user.id,social_links:e.target.social_links?.value||''}; const file=e.target.profile_file?.files?.[0]; if(file)patch.profile_photo=await uploadImage(file,'profiles'); const j=await api('/api/auth',{method:'POST',body:JSON.stringify(patch)}); state.user=j.user; localStorage.ho_user=JSON.stringify(j.user); render();}catch(err){alert(err.message)}}
function social(){if(!state.user){$('#app').innerHTML=`<section class="hero"><h1>Sosyal</h1><p>Giriş yapmalısın.</p><button onclick="setPage('profile')">Giriş</button></section>`;return;} $('#app').innerHTML=`<section class="hero"><h1>Arkadaşlar ve Sohbet</h1></section><div class="social-layout"><div class="card"><h2>Arkadaş Ekle</h2><div class="row"><input id="friendUsername" placeholder="Kullanıcı adı"><button onclick="addFriend()">İstek Gönder</button></div><div id="friends">Yükleniyor...</div></div><div class="card chat-card"><h2 id="chatTitle">Sohbet</h2><div id="messages" class="messages"><p class="muted">Bir arkadaş seç.</p></div><textarea id="msgBody" placeholder="Mesaj yaz"></textarea><button onclick="sendMessage()">Mesaj Gönder</button></div></div>`; loadFriends();}
async function addFriend(){const username=$('#friendUsername').value.trim(); if(!username)return; try{await api('/api/social',{method:'POST',body:JSON.stringify({action:'friend_request',requester_id:state.user.id,requester_name:state.user.username,receiver_username:username})}); loadFriends();}catch(e){alert(e.message)}}
function otherSide(f){return String(f.requester_id)===String(state.user.id)?{id:f.receiver_id,name:f.receiver_name}:{id:f.requester_id,name:f.requester_name};}
async function loadFriends(){try{const j=await api('/api/social?action=friends&user_id='+enc(state.user.id)); const incoming=j.friends.filter(f=>f.status==='pending'&&String(f.receiver_id)===String(state.user.id)); const outgoing=j.friends.filter(f=>f.status==='pending'&&String(f.requester_id)===String(state.user.id)); const accepted=j.friends.filter(f=>f.status==='accepted'); $('#friends').innerHTML=`${incoming.map(f=>`<div class="episode"><span>${esc(f.requester_name)} seni eklemek istiyor.</span><button onclick="respondFriend('${f.id}','accepted')">Kabul</button><button onclick="respondFriend('${f.id}','rejected')">Reddet</button></div>`).join('')}${outgoing.map(f=>`<div class="episode"><span>${esc(f.receiver_name)} bekliyor.</span><button class="danger" onclick="removeFriend('${f.id}')">Sil</button></div>`).join('')}${accepted.map(f=>{const o=otherSide(f);return `<div class="episode"><span><b>${esc(o.name)}</b></span><button onclick="openChat('${esc(o.id)}','${esc(o.name)}')">Sohbet</button><button class="danger" onclick="removeFriend('${f.id}')">Arkadaşlıktan Çıkar</button></div>`}).join('')||(!incoming.length&&!outgoing.length?'<p>Arkadaş yok.</p>':'')}`;}catch(e){$('#friends').textContent=e.message;}}
async function respondFriend(id,status){try{await api('/api/social',{method:'POST',body:JSON.stringify({action:'friend_respond',id,status,user_id:state.user.id})});loadFriends()}catch(e){alert(e.message)}}
async function removeFriend(id){if(!confirm('Silinsin mi?'))return; try{await api('/api/social',{method:'DELETE',body:JSON.stringify({id,user_id:state.user.id})});loadFriends()}catch(e){alert(e.message)}}
async function openChat(id,name){state.selectedFriend={id,name}; $('#chatTitle').textContent='Sohbet: '+name; loadMessages();}
async function loadMessages(){if(!state.selectedFriend)return; try{const j=await api('/api/social?action=messages&user_id='+enc(state.user.id)+'&friend_id='+enc(state.selectedFriend.id)); $('#messages').innerHTML=(j.messages||[]).map(m=>`<div class="msg ${String(m.sender_id)===String(state.user.id)?'me':''}"><b>${esc(m.sender_name)}</b><p>${esc(m.body)}</p><small>${new Date(m.created_at).toLocaleString('tr-TR')}</small></div>`).join('')||'<p>Mesaj yok.</p>'; }catch(e){$('#messages').textContent=e.message;}}
async function sendMessage(){if(!state.selectedFriend)return alert('Arkadaş seç.'); const body=$('#msgBody').value.trim(); if(!body)return; try{await api('/api/social',{method:'POST',body:JSON.stringify({action:'message',sender_id:state.user.id,sender_name:state.user.username,receiver_id:state.selectedFriend.id,receiver_name:state.selectedFriend.name,body})}); $('#msgBody').value=''; loadMessages();}catch(e){alert(e.message)}}
async function loadComments(sl){const el=$('#comments'); if(!el)return; try{const j=await api('/api/social?action=comments&game_slug='+enc(sl)); el.innerHTML=(j.comments||[]).map(c=>`<div class="episode"><span><b>${esc(c.username)}</b><p>${esc(c.body)}</p></span></div>`).join('')||'<p>Yorum yok.</p>';}catch(e){el.textContent=e.message;}}
async function sendComment(e,sl){e.preventDefault(); const body=e.target.body.value.trim(); if(!body)return; try{await api('/api/social',{method:'POST',body:JSON.stringify({action:'comment',user_id:state.user.id,username:state.user.username,game_slug:sl,body})}); e.target.reset(); loadComments(sl);}catch(err){alert(err.message)}}

function adminV2Checklist(){
  const missingCover=state.games.filter(g=>!img(g)).length;
  const missingStory=state.games.filter(g=>!String(g.description||'').trim()).length;
  const noEpisodes=state.games.filter(g=>!(g.episodes||[]).length).length;
  const upcoming=state.games.filter(isUpcoming).length;
  return `<section class="card v2-checklist"><div class="section-title"><div><h2>V2.5.0 Final Hazırlık Kontrolü</h2><p class="muted">V1.9.0 final öncesi orta stabilizasyon paketidir. Admin, API, oyun, seri ve bakım sistemleri V2.5.0 açılışına hazırlanır.</p></div><span class="version-pill">Final hazırlığı</span></div><div class="grid compact"><div class="card"><h3>${missingCover}</h3><p>Kapaksız oyun</p></div><div class="card"><h3>${missingStory}</h3><p>Hikayesi eksik</p></div><div class="card"><h3>${noEpisodes}</h3><p>Bölümsüz oyun</p></div><div class="card"><h3>${upcoming}</h3><p>Yakında içerik</p></div></div><div class="roadmap-list"><span>Admin panel V3</span><span>YouTube senkronizasyon stabilizasyonu</span><span>RAWG kapak ve hikaye düzeltmeleri</span><span>Profil, sosyal ve bildirim düzeltmeleri</span><span>Tema, bakım ve loading düzeltmeleri</span><span>2.5.0 profesyonel final açılış hazırlığı</span></div></section>`;
}


function v195QuickActions(){
  const d=seriesControlData();
  const apiCount=12;
  return `<section class="card v195-panel"><div class="section-title"><div><span class="version-pill">V1.9.5</span><h2>Temiz Kurulum ve Hızlı Onarım Merkezi</h2><p class="muted">Bu panel eski API dosyası kalması, kapak/hikaye eksikleri, seri dağınıklığı ve sosyal medya ayarlarını tek yerden kontrol etmek için eklendi.</p></div><button class="ghost" onclick="copyCleanInstallCommands()">Temiz Kurulum Komutlarını Kopyala</button></div><div class="grid compact"><div class="card"><h3>${apiCount}/12</h3><p>Vercel API endpoint düzeni</p></div><div class="card"><h3>${d.score}%</h3><p>Seri sağlığı</p></div><div class="card"><h3>${d.noCover.length}</h3><p>Kapaksız oyun</p></div><div class="card"><h3>${d.noStory.length}</h3><p>Hikayesi eksik</p></div></div><div class="row"><button onclick="adminTab('seriesControl')">Serileri Kontrol Et</button><button class="ghost" onclick="adminTab('api')">RAWG / YouTube Araçları</button><button class="ghost" onclick="adminTab('socialset')">Sosyal Medya Ayarları</button><button class="ghost" onclick="downloadReadme()">Kurulum Notu İndir</button></div></section>`;
}
function cleanInstallCommands(){return `# Hayatımız Oyun V2.0.0 temiz kurulum
# Eski dosyaların üstüne kopyalama yapma; yeni ZIP klasörünü temiz kaynak olarak kullan.

git init
git branch -M main
git remote remove origin 2>nul || true
git remote add origin https://github.com/hayatimizoyunyoutube/HayatimizOyunYoutubeArsivi.git
git add .
git commit -m "V2.0.0 ilk büyük güncelleme temiz kurulum"
git push -f origin main

# Sonra Vercel panelinden Redeploy yap.
# Gerekirse Supabase SQL Editor içinde supabase/schema.sql dosyasını çalıştır.`;}
async function copyCleanInstallCommands(){try{await navigator.clipboard.writeText(cleanInstallCommands()); alert('Temiz kurulum komutları kopyalandı.');}catch{alert(cleanInstallCommands());}}
function downloadReadme(){const blob=new Blob([cleanInstallCommands()+`\n\nV2.0.0 İlk Büyük Güncelleme Özeti:\n- Admin Panel V3 hızlı onarım merkezi\n- Sosyal medya / bağış / yayıncı alanı güçlendirme\n- Seri kontrol ve kapaklı sıralama stabilizasyonu\n- API JSON hata uyarıları ve Vercel 12 endpoint düzeni\n- RAWG kapak/hikaye toplu yenileme araçları\n- YouTube kanal import/senkron ilerleme göstergesi\n`],{type:'text/plain;charset=utf-8'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='V2.0.0-temiz-kurulum-notu.txt'; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
function repairGameBeforeSave(game){
  game.title=String(game.title||'').trim();
  if(!game.slug)game.slug=slug(game.title||('oyun-'+Date.now()));
  game.series=canonicalSeriesName(game.series, game.title)||game.series||game.title||'Serisiz';
  game.status=game.status||'Devam Ediyor';
  game.type=game.type||(/demo/i.test(game.title||'')?'Demo':(/dlc|ek paket|expansion/i.test(game.title||'')?'DLC':'Ana Oyun'));
  game.tags=Array.isArray(game.tags)?game.tags:String(game.tags||'').split(',').map(x=>x.trim()).filter(Boolean);
  game.episodes=(game.episodes||[]).map((ep,i)=>({title:ep.title||`${i+1}. Bölüm`,url:ep.url||ep.video_url||'',thumbnail:ep.thumbnail||ep.image||'',description:ep.description||''}));
  ensureGameVisuals(game);
  if(!String(game.description||'').trim()) game.description='Bu oyun için açıklama geçici olarak oluşturuldu. RAWG hikaye yenileme aracıyla daha detaylı bilgi çekebilirsin.';
  return game;
}
async function repairSelectedGames(){
  const ids=[...document.querySelectorAll('.game-check:checked')].map(x=>x.value);
  if(!ids.length)return alert('Onarılacak oyun seç.');
  if(!confirm(`${ids.length} oyun için seri adı, durum, tip ve bölüm alanları standartlaştırılsın mı?`))return;
  let ok=0;
  for(const id of ids){const g=state.games.find(x=>String(x.id)===String(id)); if(!g)continue; try{await api('/api/games',{method:'PUT',body:JSON.stringify({game:repairGameBeforeSave({...g})})}); ok++;}catch(e){console.warn(e)}}
  await load(); adminTab('games'); alert(`${ok} oyun standartlaştırıldı.`);
}
async function repairAllGamesLight(){
  if(!state.games.length)return alert('Oyun yok.');
  if(!confirm('Tüm oyunlarda hafif onarım yapılsın mı? Seri adı, durum, tip, bölüm ve slug alanları standartlaştırılır.'))return;
  let ok=0;
  for(const g of state.games){try{await api('/api/games',{method:'PUT',body:JSON.stringify({game:repairGameBeforeSave({...g})})}); ok++;}catch(e){console.warn(e)}}
  await load(); adminTab('seriesControl'); alert(`${ok} oyun kontrol edildi / onarıldı.`);
}
function adminNavBtn(tab,label,icon){return `<button type="button" data-tab="${tab}" onclick="adminTab('${tab}')"><span>${icon}</span><b>${label}</b></button>`;}

function v200LaunchPanel(){
  return `<section class="card v200-panel"><div class="section-title"><div><span class="version-pill">V2.0.0</span><h2>İlk Büyük Güncelleme</h2><p class="muted">Stabil açılış, profesyonel admin panel, kapak/hikaye onarım, seri sıralama, sosyal ikonlar ve YouTube/RAWG güvenliği tek pakette toplandı.</p></div><button onclick="adminTab('api')">Kapak / Hikaye Onarımına Git</button></div><div class="roadmap-list"><span>Loading güvenliği</span><span>Admin Panel V2</span><span>Kapaksız oyun kontrolü</span><span>Hatalı oyun kontrolü</span><span>Seri sıralama V2</span><span>Sosyal ikon V2</span><span>RAWG / YouTube stabilizasyon</span></div></section>`;
}

function admin(){
  if(!canSeeAdmin()){$('#app').innerHTML=`<section class="hero"><h1>Erişim yok</h1><p>Admin paneli yetkili kullanıcıya açıktır.</p><button onclick="setPage('profile')">Giriş</button></section>`;return;}
  $('#app').innerHTML=`<section class="admin-hero-pro">
    <div><span class="version-pill">V${VERSION}</span><h1>Admin Kontrol Merkezi</h1><p>Giriş: ${esc(roleLabel())} • profesyonel yönetim paneli</p></div>
    <div class="admin-hero-actions"><button onclick="adminTab('games')">Yeni İçerik Yönet</button><button class="ghost" onclick="copyCleanInstallCommands()">Temiz Kurulum Komutları</button></div>
  </section>
  <section class="admin-shell-pro admin-shell-v2">
    <div class="admin-tabs" aria-label="Admin kategori menüsü">
      <div class="admin-nav-group"><span>Genel</span>${adminNavBtn('dash','Dashboard','⌂')}</div>
      <div class="admin-nav-group"><span>İçerik</span>${adminNavBtn('games','Oyunlar','🎮')}${adminNavBtn('seriesOrder','Seri Sıralama','⇅')}${adminNavBtn('seriesControl','Seriler Kontrol','✓')}${adminNavBtn('api','API Çek','⚡')}</div>
      <div class="admin-nav-group"><span>Topluluk</span>${adminNavBtn('users','Kullanıcılar','👥')}${adminNavBtn('socialset','Sosyal Medya','🔗')}${adminNavBtn('feedback','İstek / Geri Bildirim','✉')}</div>
      <div class="admin-nav-group"><span>Sistem</span>${adminNavBtn('set','Ayarlar','⚙')}${adminNavBtn('note','Güncelleme Notları','📝')}${adminNavBtn('cal','Takvim','📅')}${adminNavBtn('logs','Loglar','☰')}<button type="button" onclick="exportAll()"><span>⬇</span><b>Yedek Al</b></button></div>
    </div>
    <div class="admin-main-pro"><div id="adminArea"></div></div>
  </section>`;
  adminTab('dash');
}
async function adminTab(t){const a=$('#adminArea'); if(!a)return; $$('.admin-tabs button[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===t)); try{ if(t==='dash'){let users=0,logs=[];try{users=(await api('/api/users')).users?.length||0}catch{}try{logs=(await api('/api/logs')).logs||[]}catch{} a.innerHTML=`<div class="admin-section-head"><div><span class="version-pill">Dashboard</span><h2>Genel Bakış</h2><p class="muted">Sitenin tüm ana verileri ve hızlı kontrolleri.</p></div><button class="ghost" onclick="adminTab('seriesControl')">Seri Sağlığını Kontrol Et</button></div><div class="admin-top-stats grid"><div class="card"><h2>${state.games.length}</h2><p>Oyun</p></div><div class="card"><h2>${groupGames().length}</h2><p>Seri</p></div><div class="card"><h2>${state.events.length}</h2><p>Takvim</p></div><div class="card"><h2>${state.notes.length}</h2><p>Güncelleme Notu</p></div><div class="card"><h2>${users}</h2><p>Kullanıcı</p></div><div class="card"><h2>${continueCount()}</h2><p>Devam Kaydı</p></div><div class="card series-health"><h2>${seriesHealth().score}%</h2><p>Seri Sağlığı</p><button class="ghost small" onclick="adminTab('seriesControl')">Kontrol Et</button></div></div>${v200LaunchPanel()}${v195QuickActions()}${adminV2Checklist()}${seriesHealthDashboard()}<h2>Son İşlemler</h2>${logs.slice(0,8).map(logHtml).join('')||'<p>Log yok.</p>'}`; return; }
 if(t==='games'){a.innerHTML=`<div class="row"><button onclick="clearGameForm()">Yeni Oyun</button><button class="danger" onclick="deleteAllGames()">Tüm Oyunları Tamamen Sil</button></div>${gameForm()}<h2>Toplu Oyun Yönetimi</h2><div class="card"><div class="form-grid"><input id="adminGameSearch" placeholder="Admin oyun arama: oyun / seri / tür / etiket" oninput="filterAdminGames()"><select id="adminFilterStatus" onchange="filterAdminGames()"><option value="">Tüm durumlar</option><option>Tamamlandı</option><option>Devam Ediyor</option><option>Yakında Gelecek</option></select><select id="adminFilterMissing" onchange="filterAdminGames()"><option value="">Tüm oyunlar</option><option value="cover">Kapaksız oyunlar</option><option value="story">Hikayesi eksik</option><option value="episode">Bölümsüz oyunlar</option></select><select id="bulkStatus"><option value="">Durum değiştirme</option><option>Tamamlandı</option><option>Devam Ediyor</option><option>Yakında Gelecek</option></select><input id="bulkSeries" placeholder="Seriye taşı"><input id="bulkTag" placeholder="Etiket ekle"><button onclick="bulkUpdateSelectedGames()">Seçilenleri Güncelle</button><button class="ghost" onclick="repairSelectedGames()">Seçilenleri Onar</button><button class="danger" onclick="deleteSelectedGames()">Seçilenleri Sil</button></div></div><h2>Oyun Listesi</h2><div id="adminGamesList">${adminGamesList(state.games)}</div>`; return; }
 if(t==='seriesOrder'){a.innerHTML=seriesOrderPanel(); return;}
 if(t==='seriesControl'){a.innerHTML=seriesControlPanel(); return;}
 if(t==='api'){a.innerHTML=`<div class="split"><div class="card"><h2>RAWG Türkçe Bilgi Çek</h2><input id="rawgName" placeholder="Oyun adı"><button onclick="rawgFetch()">Forma Doldur</button><button class="ghost" onclick="rawgStoryFetch()">Sadece Oyun Hikayesini Çek</button><button class="ghost" onclick="openGoogleImageSearch()">Google Görselde Ara</button><button class="ghost" onclick="bulkRefreshAllStories()">Eklenmiş Tüm Hikayeleri Düzelt</button><button class="ghost" onclick="bulkRefreshAllCovers()">Tüm Kapakları RAWG ile Yenile</button><button class="danger" onclick="rebuildAllCoversAndStories()">Kapak + Hikayeleri Silip Baştan Güncelle</button><p class="muted">Fix 4: DLC adları otomatik temizlenir. Örnek: Far Cry 6 3.DLC'si Joseph: Collapse → Far Cry 6 Joseph Collapse.</p></div><div class="card"><h2>YouTube</h2><input id="ytList" placeholder="Playlist URL"><button onclick="ytFetch()">Bölüm JSON Doldur</button><hr><input id="ytChannel" value="@HayatimizOyunn" placeholder="Kanal handle"><button onclick="ytChannelImport()">Kanaldan Oyunları Çek</button><button class="ghost" onclick="ytChannelSync()">YouTube Senkronize Et</button><p class="muted">Yeni oynatma listesi ve yeni bölüm kontrolü yapar. V1.8.0 kuyruğu playlistleri tek tek işler.</p></div></div><div id="apiFormArea">${gameForm()}</div><div id="ytProgressBar"></div><pre id="fetchOut" class="card"></pre>`; return;}
 if(t==='users'){const j=await api('/api/users'); a.innerHTML=`<h2>Kullanıcılar</h2><div class="card table-wrap"><table><thead><tr><th>Kullanıcı</th><th>Rol</th><th>Durum</th><th>XP</th><th>Level</th><th>İşlem</th></tr></thead><tbody>${j.users.map(userRow).join('')||'<tr><td colspan="6">Kullanıcı yok.</td></tr>'}</tbody></table></div>`; return;}
 if(t==='note'){const j=await api('/api/notes?all=1'); a.innerHTML=`<h2>Güncelleme Notları</h2>${noteForm()}<div class="card table-wrap"><table><thead><tr><th>Sürüm</th><th>Tip</th><th>Başlık</th><th>Public</th><th>İşlem</th></tr></thead><tbody>${j.notes.map(noteRow).join('')||'<tr><td colspan="5">Not yok.</td></tr>'}</tbody></table></div>`; return;}
 if(t==='cal'){a.innerHTML=`<h2>Takvim Yönetimi</h2>${eventForm()}<div class="card table-wrap"><table><thead><tr><th>Görsel</th><th>Başlık</th><th>Oyun</th><th>Tarih</th><th>Saat</th><th>İşlem</th></tr></thead><tbody>${state.events.map(eventRow).join('')||'<tr><td colspan="6">Etkinlik yok.</td></tr>'}</tbody></table></div>`; return;}
 if(t==='set'){a.innerHTML=`<h2>Site Ayarları</h2><form class="card" onsubmit="saveSettings(event)"><label><input type="checkbox" name="maintenance" ${state.settings?.maintenance?'checked':''}> Bakım modu</label><textarea name="maintenance_note" placeholder="Bakım notu">${esc(state.settings?.maintenance_note||'2.5.0 güncellemesinde site final olarak açılacak.')}</textarea><label>Bakım ilerleme yüzdesi</label><input name="maintenance_progress" type="number" min="0" max="100" value="${esc(state.settings?.maintenance_progress??88)}" placeholder="Örn: 75"><label>Bakım ekranında görünecek yeni özellikler</label><textarea name="upcoming_features" placeholder="Her satıra bir özellik yaz">${esc(state.settings?.upcoming_features||'Admin panel V3 düzeni hazırlanıyor\nYouTube senkronizasyon stabilizasyonu ve senkronizasyon güçleniyor\nRAWG kapak ve hikaye toplu düzeltme geliyor\nProfil, bildirim ve sosyal sistem profesyonelleşiyor\n2.5.0 güncellemesinde site final olarak açılacak')}</textarea><input name="announcement" value="${esc(state.settings?.announcement||'')}" placeholder="Duyuru"><input name="site_title" value="${esc(state.settings?.site_title||'Hayatımız Oyun')}" placeholder="Site adı"><input type="hidden" name="site_logo" value="${esc(state.settings?.site_logo||'')}"><label>Logo dosyası</label><input type="file" name="site_logo_file" accept="image/*"><input name="footer_text" value="${esc(state.settings?.footer_text||'')}" placeholder="Footer yazısı"><hr><h3>Sosyal Medya ve Footer Ayarları</h3><p class="muted">Her satıra link yaz. İstersen Başlık|URL biçimi de kullanabilirsin. İkon otomatik algılanır.</p><div class="form-grid social-separate-fields"><input name="social_youtube" value="${esc(state.settings?.social_youtube||'https://www.youtube.com/@HayatimizOyunn')}" placeholder="YouTube linki"><input name="social_kick" value="${esc(state.settings?.social_kick||'https://kick.com/hayatimizoyun')}" placeholder="Kick linki"><input name="social_discord" value="${esc(state.settings?.social_discord||'')}" placeholder="Discord linki"><input name="social_tiktok" value="${esc(state.settings?.social_tiktok||'')}" placeholder="TikTok linki"><input name="social_instagram" value="${esc(state.settings?.social_instagram||'')}" placeholder="Instagram linki"><input name="social_donate" value="${esc(state.settings?.social_donate||'https://www.bynogame.com/tr/destekle/hayatimizoyun')}" placeholder="Bağış / Bynogame linki"></div><h3>Ekstra sosyal linkler</h3><textarea id="socialLinksField" name="social_links" oninput="updateSocialPreview()" placeholder="Sadece ekstra link varsa yaz. Ana YouTube/Kick/Discord/TikTok/Instagram/Bağış alanlarını yukarıdaki kutulardan doldur.">${esc(state.settings?.social_links||'')}</textarea><div id="socialPreview" class="social-icons preview">${socialPreviewFromText(state.settings?.social_links||'')}</div><label><input type="checkbox" name="show_social_header" ${state.settings?.show_social_header===false?'':'checked'}> Sosyal ikonları üst menüde göster</label><label><input type="checkbox" name="show_social_footer" ${state.settings?.show_social_footer===false?'':'checked'}> Sosyal ikonları footer alanında göster</label><div class="notice"><b>Desteklenen yeni ikonlar:</b> Kick linki için <code>https://kick.com/hayatimizoyun</code>, bağış için <code>Bağış|https://...</code> veya Bynogame linki yaz. Sistem logoyu otomatik seçer.</div><hr><h3>Discord Webhook ve Yayıncı Kartı</h3><label><input type="checkbox" name="discord_enabled" ${state.settings?.discord_enabled?'checked':''}> Discord webhook aktif</label><input name="discord_webhook" value="${esc(state.settings?.discord_webhook||'')}" placeholder="Discord webhook URL"><button type="button" onclick="testDiscordWebhook()">Discord Webhook Test Et</button><label><input type="checkbox" name="show_streamer_card" ${state.settings?.show_streamer_card===false?'':'checked'}> Ana sayfada yayıncı kartını göster</label><label><input type="checkbox" name="kick_live" ${state.settings?.kick_live?'checked':''}> Kick canlı yayında etiketi göster</label><textarea name="publisher_description" placeholder="Yayıncı kartı açıklaması">${esc(state.settings?.publisher_description||'Kick yayınları, YouTube arşivi, Discord topluluğu ve bağış bağlantıları burada.')}</textarea><label>V2.5.0 final hedef tarihi</label><input name="final_release_date" value="${esc(state.settings?.final_release_date||'')}" placeholder="Örn: 25.06.2026 20:00"><label>Favicon dosyası</label><input type="hidden" name="favicon" value="${esc(state.settings?.favicon||'')}"><input type="file" name="favicon_file" accept="image/*"><hr><h3>Site Hakkında</h3><textarea id="aboutTextField" name="about_text" placeholder="Site hakkında yazısı">${esc(state.settings?.about_text||'')}</textarea><button type="button" class="ghost" onclick="generateAboutText()">AI ile Hakkında Yazısı Hazırla</button><hr><h3>Paylaşım ve Arka Plan Ayarları</h3><input name="share_title" value="${esc(state.settings?.share_title||'Hayatımız Oyun - Oyun ve Seri İzleme Arşivi')}" placeholder="Paylaşım başlığı"><textarea name="share_description" placeholder="Paylaşım açıklaması">${esc(state.settings?.share_description||'Oyun serileri, bölümler, takvim, favoriler ve izleme takibi için Hayatımız Oyun arşivi.')}</textarea><input type="hidden" name="share_image" value="${esc(state.settings?.share_image||'')}"><label>Varsayılan paylaşım görseli</label><input type="file" name="share_image_file" accept="image/*"><label>Arka plan yoğunluğu</label><input name="background_intensity" type="number" min="20" max="125" value="${esc(state.settings?.background_intensity??75)}"><label>Varsayılan tema</label><select name="theme"><option value="dark" ${activeTheme()=='dark'?'selected':''}>Koyu</option><option value="red" ${activeTheme()=='red'?'selected':''}>Kırmızı</option><option value="blue" ${activeTheme()=='blue'?'selected':''}>Mavi</option><option value="purple" ${activeTheme()=='purple'?'selected':''}>Mor</option><option value="green" ${activeTheme()=='green'?'selected':''}>Yeşil</option><option value="neon" ${activeTheme()=='neon'?'selected':''}>Neon</option><option value="retro" ${activeTheme()=='retro'?'selected':''}>Retro</option></select><hr><h3>Müzik ve Açılış Ayarları</h3><label><input type="checkbox" name="music_enabled" ${state.settings?.music_enabled?'checked':''}> Site müziği açık olsun</label><label>Varsayılan ses seviyesi</label><input name="music_volume" type="number" min="0" max="100" value="${esc(state.settings?.music_volume??8)}"><label><input type="checkbox" name="video_duck_music" ${state.settings?.video_duck_music===false?'':'checked'}> Video izlerken müzik kısılsın</label><button>Kaydet</button></form>`; return;}
 if(t==='socialset'){a.innerHTML=`<h2>Sosyal Medya Linkleri</h2><form class="card social-link-form" onsubmit="saveSettings(event)"><p class="muted">Her platform için ayrı link gir. İkonlar otomatik seçilir. Bynogame/bağış için özel T logolu bağış ikonu görünür.</p><div class="form-grid"><input name="social_youtube" value="${esc(state.settings?.social_youtube||'https://www.youtube.com/@HayatimizOyunn')}" placeholder="YouTube linki"><input name="social_kick" value="${esc(state.settings?.social_kick||'https://kick.com/hayatimizoyun')}" placeholder="Kick linki"><input name="social_discord" value="${esc(state.settings?.social_discord||'')}" placeholder="Discord linki"><input name="social_tiktok" value="${esc(state.settings?.social_tiktok||'')}" placeholder="TikTok linki"><input name="social_instagram" value="${esc(state.settings?.social_instagram||'')}" placeholder="Instagram linki"><input name="social_donate" value="${esc(state.settings?.social_donate||'https://www.bynogame.com/tr/destekle/hayatimizoyun')}" placeholder="Bağış / Bynogame linki"></div><input type="hidden" name="social_links" value="${esc(state.settings?.social_links||'')}"><label><input type="checkbox" name="show_social_header" ${state.settings?.show_social_header===false?'':'checked'}> Üst menüde göster</label><label><input type="checkbox" name="show_social_footer" ${state.settings?.show_social_footer===false?'':'checked'}> Footer’da göster</label><h3>Canlı önizleme</h3><div class="social-icons preview social-preview-clean">${socialLinksHtml()}</div><button>Kaydet</button></form>`; return; }
 if(t==='feedback'){const j=await api('/api/social?action=feedback'); a.innerHTML=`<h2>İstekler / Geri Bildirim / Oyun İstekleri</h2><p class="muted">Oyun isteği, seri isteği, hata bildirimi ve öneriler burada listelenir.</p><div class="card table-wrap"><table><thead><tr><th>Tür</th><th>Ad</th><th>Mesaj</th><th>Durum</th><th>Tarih</th><th>İşlem</th></tr></thead><tbody>${(j.feedback||[]).map(f=>`<tr><td>${esc(f.type)}</td><td>${esc(f.name)}</td><td>${esc(f.message)}</td><td>${esc(f.status||'new')}</td><td>${f.created_at?new Date(f.created_at).toLocaleString('tr-TR'):''}</td><td><button class="ghost small" onclick="markFeedback('${f.id}','read')">Okundu</button><button class="ghost small" onclick="markFeedback('${f.id}','accepted')">Kabul</button><button class="ghost small" onclick="markFeedback('${f.id}','rejected')">Reddet</button><button class="danger small" onclick="deleteFeedback('${f.id}')">Sil</button></td></tr>`).join('')||'<tr><td colspan="6">Geri bildirim yok.</td></tr>'}</tbody></table></div>`; return;}
 if(t==='logs'){const j=await api('/api/logs'); a.innerHTML=`<h2>Loglar</h2><button class="danger" onclick="clearLogs()">Tüm Logları Sil</button>${(j.logs||[]).map(logHtml).join('')||'<p>Log yok.</p>'}`; return;}
 }catch(e){a.innerHTML=`<div class="card danger-box"><b>Admin sekmesi açılamadı:</b><p>${esc(e.message)}</p></div>`;}}
function logHtml(l){return `<div class="episode"><span><b>${esc(l.admin_name||'Yetkili')}</b> <small>(${esc(l.admin_role||'')})</small> — ${esc(l.action)}: ${esc(l.detail||'')}</span><small>${l.created_at?new Date(l.created_at).toLocaleString('tr-TR'):''}</small></div>`;}
function userRow(u){return `<tr><td>${esc(u.username)}</td><td><select id="role_${u.id}"><option ${u.role==='user'?'selected':''} value="user">User</option><option ${u.role==='Moderatör'?'selected':''}>Moderatör</option><option ${u.role==='Editör'?'selected':''}>Editör</option><option ${u.role==='Admin'?'selected':''}>Admin</option><option ${u.role==='Kurucu'?'selected':''}>Kurucu</option></select></td><td>${u.banned?'Banlı':'Aktif'}</td><td>${u.xp||0}</td><td>${u.level||1}</td><td class="row"><button onclick="updateUser('${u.id}')">Yetki</button><button onclick="toggleBan('${u.id}',${!u.banned})">${u.banned?'Ban Aç':'Banla'}</button><button onclick="resetUser('${u.id}')">Sıfırla</button><button class="danger" onclick="deleteUser('${u.id}')">Sil</button></td></tr>`;}
async function updateUser(id){await api('/api/users',{method:'PATCH',body:JSON.stringify({id,role:$('#role_'+id).value})}); adminTab('users');}
async function toggleBan(id,banned){await api('/api/users',{method:'PATCH',body:JSON.stringify({id,banned})}); adminTab('users');}
async function resetUser(id){if(confirm('Kullanıcı sıfırlansın mı?')){await api('/api/users',{method:'PATCH',body:JSON.stringify({id,reset:true})}); adminTab('users');}}
async function deleteUser(id){if(confirm('Kullanıcı silinsin mi?')){await api('/api/users',{method:'DELETE',body:JSON.stringify({id})}); adminTab('users');}}
function gameForm(g={}){const tagVals=Array.isArray(g.tags)?g.tags:String(g.tags||'').split(',').map(x=>x.trim()).filter(Boolean); const typeVals=['Ana Oyun','DLC','Yan Seri','Remake','Remaster','Spin-off']; const tagButtons=['DLC','Türkçe Altyazılı','Türkçe Dublajlı','Coop','%100','Final','Korku','Aksiyon','Macera','Hikaye Odaklı','Remake','Remaster']; return `<form class="card" id="gameForm" onsubmit="saveGame(event)"><input type="hidden" name="id" value="${esc(g.id||'')}"><div class="form-grid"><input name="title" value="${esc(g.title||'')}" placeholder="Oyun adı"><input name="slug" value="${esc(g.slug||'')}" placeholder="Slug"><input name="series" value="${esc(g.series||'')}" placeholder="Seri adı"><select name="status"><option ${g.status==='Devam Ediyor'?'selected':''}>Devam Ediyor</option><option ${g.status==='Tamamlandı'?'selected':''}>Tamamlandı</option><option ${g.status==='Yakında Gelecek'?'selected':''}>Yakında Gelecek</option></select><input name="upcoming_start" value="${esc(g.upcoming_start||'')}" placeholder="Yakında başlangıç tarihi"><input name="release_date" value="${esc(fmtDate(g.release_date)||'')}" placeholder="Çıkış tarihi gg.aa.yyyy"><input name="genre" value="${esc(g.genre||'')}" placeholder="Tür"><input name="cover" value="${esc(g.cover||'')}" placeholder="Kapak URL"><button type="button" onclick="fetchRawgCoverForForm()">Oyun Ana Resmini Çek</button><button type="button" class="ghost" onclick="openGoogleImageSearchFromForm()">Google Görselde Ara</button><input name="playlist_url" value="${esc(g.playlist_url||'')}" placeholder="Playlist URL"><input name="youtube_playlist_id" value="${esc(g.youtube_playlist_id||'')}" placeholder="Playlist ID"><input name="rawg_id" value="${esc(g.rawg_id||'')}" placeholder="RAWG ID"><input name="order_no" type="number" value="${esc(g.order_no||0)}" placeholder="Sıra"></div><label>İçerik Tipi</label><div class="choice-buttons">${typeVals.map(v=>`<button type="button" class="${(g.type||'Ana Oyun')===v?'active':''}" onclick="chooseOne(this,'type','${esc(v)}')">${esc(v)}</button>`).join('')}</div><input type="hidden" name="type" value="${esc(g.type||'Ana Oyun')}"><label>Etiketler</label><div class="choice-buttons tags-choice">${tagButtons.map(v=>`<button type="button" class="${tagVals.includes(v)?'active':''}" onclick="toggleTagButton(this,'${esc(v)}')">${esc(v)}</button>`).join('')}</div><input type="hidden" name="tags" value="${esc(tagVals.join(', '))}"><textarea name="description" placeholder="Kısa Türkçe hikaye / açıklama">${esc(g.description||'')}</textarea><textarea name="episodes" placeholder="Bölümler JSON">${esc(JSON.stringify(g.episodes||[],null,2))}</textarea><button>Kaydet</button></form>`;}
function chooseOne(btn,name,val){const wrap=btn.parentElement; $$('button',wrap).forEach(b=>b.classList.remove('active')); btn.classList.add('active'); btn.closest('form').elements[name].value=val;}
function toggleTagButton(btn,val){btn.classList.toggle('active'); const form=btn.closest('form'); form.elements.tags.value=$$('.tags-choice button.active',form).map(b=>b.textContent.trim()).join(', ');}
async function saveGame(e){e.preventDefault(); const game=Object.fromEntries(new FormData(e.target)); if(!game.slug)game.slug=slug(game.title); game.release_date=fmtDate(game.release_date); game.tags=String(game.tags||'').split(',').map(x=>x.trim()).filter(Boolean); try{game.episodes=JSON.parse(game.episodes||'[]')}catch{return alert('Bölümler JSON hatalı.')} repairGameBeforeSave(game); if(!game.id)delete game.id; try{await api('/api/games',{method:game.id?'PUT':'POST',body:JSON.stringify({game})}); await load(); adminTab('games');}catch(err){alert(err.message)}}
function adminGamesList(list){
  const arr=[...list].sort((a,b)=>trSort(getSeriesName(a),getSeriesName(b))||((a.order_no||0)-(b.order_no||0))||trSort(a.title,b.title));
  return `<div class="admin-game-grid admin-game-grid-pro">${arr.map(g=>{const noCover=!g.cover; const noStory=!String(g.description||'').trim(); const noEpisode=!(Array.isArray(g.episodes)&&g.episodes.length); return `<div class="card admin-game-card pro-game-card">
    <input type="checkbox" class="game-check" value="${esc(g.id)}">
    <div class="admin-cover" style="background-image:url('${esc(img(g))}')"><span class="badge-top">${esc(g.status||'Durum')}</span></div>
    <div class="admin-game-info"><h3>${esc(g.title)}</h3><p class="muted">${esc(getSeriesName(g))} • ${esc(g.type||'Ana Oyun')} • ${fmtDate(g.release_date)||'Tarih yok'}</p>
    <div class="mini-badges"><span>${esc(g.genre||'Tür yok')}</span><span>${(g.episodes||[]).length} bölüm</span>${noCover?'<span class="warn">Kapak yok</span>':''}${noStory?'<span class="warn">Hikaye yok</span>':''}${noEpisode?'<span class="warn">Bölüm yok</span>':''}</div>
    <div class="row"><button onclick="editGame('${esc(g.slug)}')">Düzenle</button><button class="ghost" onclick="quickCover('${esc(g.id)}')">Kapak Çek</button><button class="ghost" onclick="quickStory('${esc(g.id)}')">Hikaye Çek</button><button class="ghost" onclick="googleCoverGame('${esc(g.id)}')">Google Ara</button><button class="danger" onclick="deleteGame('${esc(g.id)}')">Sil</button></div></div>
  </div>`}).join('')||'<p>Oyun yok.</p>'}</div>`;
}
function filterAdminGames(){const q=($('#adminGameSearch')?.value||'').toLocaleLowerCase('tr-TR'); const st=$('#adminFilterStatus')?.value||''; const miss=$('#adminFilterMissing')?.value||''; const list=state.games.filter(g=>{const hay=(g.title+' '+getSeriesName(g)+' '+(g.genre||'')+' '+(g.tags||[]).join(' ')).toLocaleLowerCase('tr-TR'); if(q&&!hay.includes(q))return false; if(st&&String(g.status||'')!==st)return false; if(miss==='cover'&&img(g))return false; if(miss==='story'&&String(g.description||'').trim().length>30)return false; if(miss==='episode'&&(g.episodes||[]).length)return false; return true;}); $('#adminGamesList').innerHTML=adminGamesList(list);}
function editGame(sl){const g=state.games.find(x=>x.slug===sl); $('#adminArea').innerHTML=gameForm(g)+`<h2>Oyun Listesi</h2><div id="adminGamesList">${adminGamesList(state.games)}</div>`; scrollTo({top:0,behavior:'smooth'});}
function clearGameForm(){adminTab('games');}
async function deleteGame(id){if(confirm('Oyun silinsin mi?')){await api('/api/games',{method:'DELETE',body:JSON.stringify({id})}); await load(); adminTab('games');}}
async function deleteSelectedGames(){const ids=$$('.game-check:checked').map(x=>x.value); if(!ids.length)return alert('Oyun seç.'); if(confirm(`${ids.length} oyun silinsin mi?`)){await api('/api/games',{method:'DELETE',body:JSON.stringify({ids})}); await load(); adminTab('games');}}
async function deleteAllGames(){const word=prompt('Tüm oyunlar silinecek. Onay için SIL yaz.'); if(word!=='SIL')return; await api('/api/games',{method:'DELETE',body:JSON.stringify({all:true})}); await load(); adminTab('games');}
async function bulkUpdateSelectedGames(){const ids=$$('.game-check:checked').map(x=>x.value); if(!ids.length)return alert('Oyun seç.'); const patch={}; if($('#bulkStatus')?.value)patch.status=$('#bulkStatus').value; if($('#bulkSeries')?.value.trim())patch.series=$('#bulkSeries').value.trim(); if($('#bulkTag')?.value.trim())patch.add_tag=$('#bulkTag').value.trim(); if(!Object.keys(patch).length)return alert('Bir güncelleme alanı doldur.'); await api('/api/games',{method:'PATCH',body:JSON.stringify({ids,patch})}); await load(); adminTab('games');}
function seriesOrderPanel(){
  const groups=groupGames();
  const options=groups.map(g=>`<option value="${esc(slug(g.series))}" ${state.seriesEditKey===slug(g.series)?'selected':''}>${esc(g.series)} (${g.games.length})</option>`).join('');
  return `<h2>Seri Oyunları Sıralama</h2><div class="card series-order-tools"><select id="seriesSelect" onchange="state.seriesEditKey=this.value; renderSeriesOrderList()"><option value="">Seri seç</option>${options}</select><button class="ghost" onclick="sortCurrentSeriesByRelease()">Çıkış Tarihine Göre Sırala</button><button class="ghost" onclick="sortCurrentSeriesAZ()">A-Z Sırala</button><button class="ghost" onclick="refreshCurrentSeriesCovers()">Bu Serinin Kapaklarını Yenile</button></div><div id="seriesOrderList">${renderSeriesOrderList(true)}</div>`;
}
function renderSeriesOrderList(ret=false){
  const key=state.seriesEditKey||$('#seriesSelect')?.value||''; if(key)state.seriesEditKey=key;
  const gr=groupGames().find(g=>slug(g.series)===key);
  const html=!gr?'<p class="muted">Bir seri seç.</p>':`<div class="card series-order-card"><h3>${esc(gr.series)}</h3><p class="muted">Kapaklı kartları sürükle-bırak ile sırala. Kaydet butonu sadece bu seriyi etkiler.</p><div id="sortableSeries" class="series-sort-grid">${gr.games.map((g,i)=>`<div class="series-sort-item" draggable="true" data-id="${esc(g.id)}"><div class="series-sort-cover" style="background-image:url('${esc(img(g))}')"></div><div class="series-sort-meta"><b>${i+1}. ${esc(g.title)}</b><small>${fmtDate(g.release_date)||'Tarih yok'} • ${esc(g.type||'Ana Oyun')} • ${esc(g.status||'')}</small><div class="mini-badges"><span>Sıra: ${Number(g.order_no)||i+1}</span>${!g.cover?'<span class="warn">Kapak yok</span>':''}${!String(g.description||'').trim()?'<span class="warn">Hikaye yok</span>':''}</div></div><div class="series-sort-actions"><button onclick="moveSeriesItem('${esc(g.id)}',-1)">↑</button><button onclick="moveSeriesItem('${esc(g.id)}',1)">↓</button><button onclick="editGame('${esc(g.slug)}')">Düzenle</button><button class="ghost" onclick="moveGameToSeriesPrompt('${esc(g.id)}')">Taşı</button><button class="danger" onclick="deleteSeriesGame('${esc(g.id)}')">Kayıttan Sil</button></div></div>`).join('')}</div><div class="row"><button onclick="saveSeriesOrder()">Bu Seriyi Kaydet</button><button class="ghost" onclick="renderSeriesOrderList()">Yenile</button></div></div>`;
  if(ret)return html; $('#seriesOrderList').innerHTML=html; enableDragSort();
}
function currentSeriesIds(){return $$('#sortableSeries .draggable').map(x=>x.dataset.id);}
function moveSeriesItem(id,dir){const el=$(`#sortableSeries [data-id="${CSS.escape(id)}"]`); if(!el)return; if(dir<0&&el.previousElementSibling)el.parentNode.insertBefore(el,el.previousElementSibling); if(dir>0&&el.nextElementSibling)el.parentNode.insertBefore(el.nextElementSibling,el);}
function enableDragSort(){let drag=null; $$('#sortableSeries .draggable').forEach(el=>{el.ondragstart=()=>{drag=el; el.classList.add('dragging')}; el.ondragend=()=>{el.classList.remove('dragging'); drag=null}; el.ondragover=e=>{e.preventDefault(); const box=el.getBoundingClientRect(); const after=e.clientY>box.top+box.height/2; if(drag&&drag!==el) el.parentNode.insertBefore(drag,after?el.nextSibling:el);};});}
async function saveSeriesOrder(){const ids=currentSeriesIds(); if(!ids.length)return; const gr=groupGames().find(g=>slug(g.series)===(state.seriesEditKey||$('#seriesSelect')?.value||'')); const seriesName=gr?.series||''; await api('/api/games',{method:'PATCH',body:JSON.stringify({order:ids.map((id,i)=>({id,order_no:i+1,series:seriesName}))})}); await load(); state.seriesEditKey=slug(seriesName); renderSeriesOrderList(); alert('Seri sıralaması kaydedildi.');}
async function deleteSeriesGame(id){if(confirm('Bu oyun tamamen kayıttan silinsin mi?')){await api('/api/games',{method:'DELETE',body:JSON.stringify({id})}); await load(); renderSeriesOrderList();}}
function noteForm(n={}){return `<form class="card" id="noteForm" onsubmit="saveNote(event)"><input type="hidden" name="id" value="${esc(n.id||'')}"><div class="form-grid"><input name="version" value="${esc(n.version||'V'+VERSION)}"><select name="type"><option ${n.type==='Özellik'?'selected':''}>Özellik</option><option ${n.type==='Fix'?'selected':''}>Fix</option><option ${n.type==='Sürüm'?'selected':''}>Sürüm</option><option ${n.type==='Admin'?'selected':''}>Admin</option></select><input name="title" value="${esc(n.title||'')}" placeholder="Başlık"></div><textarea name="body">${esc(n.body||'')}</textarea><label><input type="checkbox" name="public_visible" ${n.public_visible===false?'':'checked'}> Sitede göster</label><button>Kaydet</button></form>`;}
function noteRow(n){return `<tr><td>${esc(n.version)}</td><td>${esc(n.type)}</td><td>${esc(n.title)}</td><td>${n.public_visible===false?'Hayır':'Evet'}</td><td><button onclick='editNote(${JSON.stringify(n).replace(/'/g,'&#039;')})'>Düzenle</button><button class="danger" onclick="deleteNote('${n.id}')">Sil</button></td></tr>`;}
async function saveNote(e){e.preventDefault(); const n=Object.fromEntries(new FormData(e.target)); n.public_visible=!!e.target.public_visible.checked; try{await api('/api/notes',{method:n.id?'PUT':'POST',body:JSON.stringify(n)}); await load(); adminTab('note');}catch(err){alert(err.message)}}
function editNote(n){$('#noteForm')?.remove(); $('#adminArea').insertAdjacentHTML('afterbegin',noteForm(n)); scrollTo({top:0,behavior:'smooth'});}
async function deleteNote(id){if(confirm('Not silinsin mi?')){await api('/api/notes',{method:'DELETE',body:JSON.stringify({id})}); await load(); adminTab('note');}}
function eventForm(e={}){return `<form class="card" id="eventForm" onsubmit="saveEvent(event)"><input type="hidden" name="id" value="${esc(e.id||'')}"><div class="form-grid"><input name="title" value="${esc(e.title||'')}" placeholder="Başlık"><input name="game_title" id="calGameTitle" value="${esc(e.game_title||'')}" placeholder="Oyun adı"><button type="button" onclick="calendarImageFetch()">Resim Çek</button><input name="event_date" type="date" value="${esc(e.event_date||'')}"><input name="event_time" type="time" value="${esc(e.event_time||'')}"><input name="image" id="calImage" value="${esc(e.image||'')}" placeholder="Görsel URL"></div><textarea name="description">${esc(e.description||'')}</textarea><button>Kaydet</button></form>`;}
function eventRow(e){return `<tr><td><div class="calendar-img" style="width:90px;background-image:url('${esc(e.image||'')}')"></div></td><td>${esc(e.title)}</td><td>${esc(e.game_title||'')}</td><td>${fmtDate(e.event_date)}</td><td>${esc(e.event_time||'')}</td><td><button onclick='editEvent(${JSON.stringify(e).replace(/'/g,'&#039;')})'>Düzenle</button><button class="danger" onclick="deleteEvent('${e.id}')">Sil</button></td></tr>`;}
async function saveEvent(e){e.preventDefault(); const event=Object.fromEntries(new FormData(e.target)); try{await api('/api/calendar',{method:event.id?'PUT':'POST',body:JSON.stringify({event})}); await load(); adminTab('cal');}catch(err){alert(err.message)}}
function editEvent(e){$('#eventForm')?.remove(); $('#adminArea').insertAdjacentHTML('afterbegin',eventForm(e));}
async function deleteEvent(id){if(confirm('Takvim kaydı silinsin mi?')){await api('/api/calendar',{method:'DELETE',body:JSON.stringify({id})}); await load(); adminTab('cal');}}
async function calendarImageFetch(){try{const j=await api('/api/rawg?name='+enc($('#calGameTitle').value)); $('#calImage').value=j.game?.cover||'';}catch(e){alert(e.message)}}
async function markFeedback(id,status='read'){try{await api('/api/social?action=feedback',{method:'PATCH',body:JSON.stringify({id,status})}); adminTab('feedback');}catch(e){alert(e.message)}}
async function deleteFeedback(id){if(!confirm('Bu geri bildirimi silmek istiyor musun?'))return; try{await api('/api/social?action=feedback&id='+enc(id),{method:'DELETE'}); adminTab('feedback');}catch(e){alert(e.message)}}
async function testDiscordWebhook(){try{await api('/api/settings?action=discord-test',{method:'POST',body:JSON.stringify({test:true})}); alert('Discord test bildirimi gönderildi.');}catch(e){alert(e.message)}}
function generateAboutText(){const el=document.getElementById('aboutTextField'); if(!el)return; el.value=`${siteTitle()}, oyun serilerini Türkçe içeriklerle düzenli şekilde takip edebileceğin bir oyun arşivi ve yayıncı platformudur. YouTube bölümleri, seri sıralamaları, izleme takibi, takvim, sosyal bağlantılar ve oyun istekleri tek yerde toplanır. V2.5.0 açılışına kadar profesyonel arşiv, topluluk ve yayıncı destek sistemi geliştirilmeye devam eder.`;}
async function saveSettings(e){
  e.preventDefault();
  const form=e.target;
  const f={...(state.settings||{}),...Object.fromEntries(new FormData(form))};
  // Formun bulunmadığı sekmelerde eski ayarı koru; sadece görünen checkboxları değiştir.
  if(form.maintenance) f.maintenance=!!form.maintenance.checked;
  if(form.music_enabled) f.music_enabled=!!form.music_enabled.checked;
  if(form.video_duck_music) f.video_duck_music=!!form.video_duck_music.checked;
  if(form.show_social_header) f.show_social_header=!!form.show_social_header.checked;
  if(form.show_social_footer) f.show_social_footer=!!form.show_social_footer.checked;
  if(form.discord_enabled) f.discord_enabled=!!form.discord_enabled.checked;
  if(form.show_streamer_card) f.show_streamer_card=!!form.show_streamer_card.checked;
  if(form.kick_live) f.kick_live=!!form.kick_live.checked;
  f.social_links=buildSettingsSocialLinks(f);
  try{
    const file=form.site_logo_file?.files?.[0]; if(file)f.site_logo=await uploadImage(file,'logos');
    const shareFile=form.share_image_file?.files?.[0]; if(shareFile)f.share_image=await uploadImage(shareFile,'share');
    const favFile=form.favicon_file?.files?.[0]; if(favFile)f.favicon=await uploadImage(favFile,'favicons');
    delete f.site_logo_file; delete f.share_image_file; delete f.favicon_file;
    await api('/api/settings',{method:'POST',body:JSON.stringify({settings:f})});
    await load();
    state.settings={...state.settings,...f};
    adminTab(form.closest('.social-link-form')?'socialset':'set');
    renderNav(); updateSeo();
    alert('Ayarlar kaydedildi.');
  }catch(err){alert(err.message)}
}
async function clearLogs(){if(confirm('Tüm loglar silinsin mi?')){try{await api('/api/logs',{method:'DELETE',body:JSON.stringify({all:true})}); adminTab('logs');}catch(e){alert(e.message)}}}
async function rawgFetch(){try{const j=await api('/api/rawg?name='+enc($('#rawgName').value)); fillGameForm(j.game||{}); $('#fetchOut').textContent=JSON.stringify(j.game,null,2);}catch(e){alert(e.message)}}
async function rawgStoryFetch(){try{const name=$('#rawgName')?.value||$('#gameForm')?.elements.title?.value; const j=await api('/api/rawg?story=1&name='+enc(name)); const f=$('#gameForm'); if(f)f.elements.description.value=j.game?.description||''; $('#fetchOut').textContent=JSON.stringify(j.game,null,2);}catch(e){alert(e.message)}}
function fillGameForm(g={}){const area=$('#apiFormArea')||$('#adminArea'); area.innerHTML=gameForm({...Object.fromEntries(new FormData($('#gameForm')||document.createElement('form'))),...g,tags:($('#gameForm')?.elements.tags?.value||'').split(',').map(x=>x.trim()).filter(Boolean)});}
async function fetchRawgCoverForForm(){const f=$('#gameForm'); if(!f)return; try{const j=await api('/api/rawg?name='+enc(cleanDlcSearchTitle(f.elements.title.value))); f.elements.cover.value=j.game?.cover||f.elements.cover.value; if(j.game?.genre)f.elements.genre.value=j.game.genre; if(j.game?.rawg_id)f.elements.rawg_id.value=j.game.rawg_id;}catch(e){alert(e.message)}}
async function ytFetch(){try{const j=await api('/api/youtube?playlist='+enc($('#ytList').value)); const f=$('#gameForm'); if(f){f.elements.episodes.value=JSON.stringify(j.episodes||[],null,2); f.elements.playlist_url.value=$('#ytList').value;} $('#fetchOut').textContent=JSON.stringify(j,null,2);}catch(e){alert(e.message)}}
function updateYoutubeProgress(done,total,label='',extra=''){
  const pct=total?Math.round(done/total*100):0;
  const out=$('#fetchOut');
  if(out)out.textContent=`%${pct} (${done}/${total}) ${label}\n${extra||''}`;
  const bar=$('#ytProgressBar');
  if(bar)bar.innerHTML=`<div class="progress-head"><b>%${pct}</b><span>${esc(label)}</span></div><div class="progress"><b style="width:${pct}%"></b></div>`;
}
async function ytChannelImport(){
  try{
    const ch=$('#ytChannel').value.trim()||'@HayatimizOyunn';
    $('#fetchOut').textContent='Kanal oynatma listeleri alınıyor...';
    const list=await api('/api/youtube?channel='+enc(ch)+'&list=1&limit=all');
    const playlists=list.playlists||[];
    let ok=0,skip=0,fail=0,lines=[];
    updateYoutubeProgress(0,playlists.length,'Kuyruk hazırlandı');
    for(let i=0;i<playlists.length;i++){
      const p=playlists[i];
      updateYoutubeProgress(i,playlists.length,`İşleniyor: ${p.title}`,lines.slice(-8).join('\n'));
      try{
        const r=await api('/api/youtube?importPlaylist='+enc(p.id)+'&maxEpisodes=all');
        ok+=r.saved?1:0; skip+=r.saved?0:1;
        lines.push(`✓ ${p.title}`);
      }catch(e){fail++; lines.push(`✗ ${p.title}: ${e.message}`);}
    }
    updateYoutubeProgress(playlists.length,playlists.length,'Kanal import tamamlandı',`Eklenen/Güncellenen: ${ok}\nAtlanan: ${skip}\nHata: ${fail}\n`+lines.join('\n'));
    await load(); adminTab('games');
  }catch(e){alert(e.message)}
}
async function ytChannelSync(){
  try{
    const ch=$('#ytChannel').value.trim()||'@HayatimizOyunn';
    $('#fetchOut').textContent='YouTube senkron kuyruk hazırlanıyor...';
    const list=await api('/api/youtube?channel='+enc(ch)+'&list=1&limit=all');
    const playlists=list.playlists||[];
    let updated=0,skipped=0,fail=0,lines=[];
    updateYoutubeProgress(0,playlists.length,'Senkron kuyruğu hazırlandı');
    for(let i=0;i<playlists.length;i++){
      const p=playlists[i];
      updateYoutubeProgress(i,playlists.length,`Senkron: ${p.title}`,lines.slice(-8).join('\n'));
      try{
        const r=await api('/api/youtube?importPlaylist='+enc(p.id)+'&sync=1&maxEpisodes=all');
        if(r.saved)updated++; else skipped++;
        lines.push(`✓ ${p.title}`);
      }catch(e){fail++; lines.push(`✗ ${p.title}: ${e.message}`);}
    }
    updateYoutubeProgress(playlists.length,playlists.length,'YouTube senkron tamamlandı',`Güncellenen/Yeni: ${updated}\nAtlanan: ${skipped}\nHata: ${fail}\n`+lines.join('\n'));
    await load(); adminTab('games');
  }catch(e){alert(e.message)}
}
async function bulkRefreshAllStories(){if(!state.games.length)return; if(!confirm('Tüm oyun hikayeleri yeniden çekilsin mi?'))return; const out=$('#fetchOut'); let ok=0,fail=0; for(let i=0;i<state.games.length;i++){const g=state.games[i]; if(out)out.textContent=`%${Math.round(i/state.games.length*100)} — ${g.title}`; try{const j=await api('/api/rawg?story=1&name='+enc(g.title)); const desc=j.game?.description||''; if(desc){await api('/api/games',{method:'PUT',body:JSON.stringify({game:{...g,description:desc}})}); ok++;}else fail++;}catch{fail++;}} if(out)out.textContent=`%100 tamamlandı. Başarılı: ${ok}, Hata: ${fail}`; await load();}

async function bulkRefreshAllCovers(){
  if(!state.games.length)return;
  if(!confirm('Tüm oyun kapakları RAWG ana görselleriyle yenilensin mi?'))return;
  const out=$('#fetchOut'); let ok=0,fail=0;
  for(let i=0;i<state.games.length;i++){
    const g=state.games[i];
    if(out)out.textContent=`%${Math.round(i/state.games.length*100)} — Kapak yenileniyor: ${g.title}`;
    try{
      const j=await api('/api/rawg?name='+enc(cleanDlcSearchTitle(g.title)));
      const cover=j.game?.cover||'';
      if(cover){await api('/api/games',{method:'PUT',body:JSON.stringify({game:{...g,cover}})}); ok++;} else fail++;
    }catch{fail++;}
  }
  if(out)out.textContent=`%100 tamamlandı. Kapak yenilenen: ${ok}, Hata: ${fail}`;
  await load();
}


function normalizedSeriesKey(name=''){
  return canonicalSeriesName(String(name||'').replace(/serisi|series|collection|full seri|tüm seri/ig,'').trim()).toLocaleLowerCase('tr-TR').replace(/[^a-z0-9ğüşöçıİĞÜŞÖÇ]+/gi,'');
}
function seriesControlData(){
  const groups=groupGames();
  const similar=new Map();
  for(const gr of groups){const key=normalizedSeriesKey(gr.series); if(!similar.has(key))similar.set(key,[]); similar.get(key).push(gr);}
  const dupSeries=[...similar.values()].filter(a=>a.length>1);
  const emptySeries=state.games.filter(g=>!String(g.series||'').trim());
  const byTitle=new Map();
  for(const g of state.games){const k=slug(g.title||''); if(!byTitle.has(k))byTitle.set(k,[]); byTitle.get(k).push(g);}
  const dupGames=[...byTitle.values()].filter(a=>a.length>1);
  const noCover=state.games.filter(g=>!g.cover);
  const noStory=state.games.filter(g=>!String(g.description||'').trim());
  const wrongDlc=state.games.filter(g=>/dlc|tyranny|episode|chapter|ek paket/i.test((g.title||'')+' '+(g.type||'')) && !/DLC/i.test(g.type||''));
  const issueCount=dupSeries.length+emptySeries.length+dupGames.length+noCover.length+noStory.length+wrongDlc.length;
  const score=Math.max(0,Math.min(100,100-Math.round(issueCount/Math.max(1,state.games.length+groups.length)*100)));
  return {groups,dupSeries,emptySeries,dupGames,noCover,noStory,wrongDlc,score};
}
function seriesHealth(){return seriesControlData();}
function seriesHealthDashboard(){const d=seriesControlData(); return `<div class="card series-health-panel"><div class="panel-head"><h2>Seri Sağlığı</h2><strong>${d.score}%</strong></div><div class="grid"><div class="card"><h3>${d.score}%</h3><p>Genel skor</p></div><div class="card"><h3>${d.dupSeries.length}</h3><p>Benzer/Fazla seri</p></div><div class="card"><h3>${d.noCover.length}</h3><p>Kapaksız oyun</p></div><div class="card"><h3>${d.noStory.length}</h3><p>Hikayesiz oyun</p></div><div class="card"><h3>${d.dupGames.length}</h3><p>Duplicate oyun</p></div></div><button onclick="adminTab('seriesControl')">Seriler Kontrol Raporu</button></div>`;}
function seriesControlPanel(){
  const d=seriesControlData();
  const dupHtml=d.dupSeries.map((arr,i)=>`<div class="series-control-group"><h3>Benzer Seri Grubu ${i+1}</h3>${arr.map(gr=>`<label><input type="checkbox" class="merge-series-check" value="${esc(gr.series)}"> <b>${esc(gr.series)}</b> <small>${gr.games.length} oyun</small></label>`).join('')}<div class="row"><input id="mergeTarget${i}" placeholder="Ana seri adı" value="${esc(canonicalSeriesName(arr[0].series))}"><button onclick="mergeCheckedSeries('mergeTarget${i}')">Seçilenleri Birleştir</button></div></div>`).join('')||'<p class="muted">Benzer/fazla seri bulunmadı.</p>';
  return `<h2>Seriler Kontrol</h2><div class="grid"><div class="card"><h2>${d.score}%</h2><p>Seri Sağlığı</p></div><div class="card"><h2>${d.dupSeries.length}</h2><p>Fazla/benzer seri</p></div><div class="card"><h2>${d.emptySeries.length}</h2><p>Seri adı boş</p></div><div class="card"><h2>${d.dupGames.length}</h2><p>Duplicate oyun</p></div><div class="card"><h2>${d.wrongDlc.length}</h2><p>DLC kontrol uyarısı</p></div></div><div class="card"><h2>Otomatik Seri Düzeltme</h2><p class="muted">Assassin's Creed, A Plague Tale, Resident Evil gibi seri kuralları uygulanır; “Serisi” ve gereksiz kelimeler temizlenir.</p><button onclick="autoFixSeriesNames()">Serileri Otomatik Düzelt</button><button class="ghost" onclick="repairAllGamesLight()">Tüm Oyunları Hafif Onar</button></div><div class="card"><h2>Fazla / Benzer Seriler</h2>${dupHtml}</div><div class="split"><div class="card"><h2>Kapaksız Oyunlar</h2>${d.noCover.slice(0,25).map(g=>`<div class="episode"><span>${esc(g.title)}</span><button onclick="editGame('${esc(g.slug)}')">Düzenle</button></div>`).join('')||'<p>Kapaksız oyun yok.</p>'}</div><div class="card"><h2>Hikayesi Eksik</h2>${d.noStory.slice(0,25).map(g=>`<div class="episode"><span>${esc(g.title)}</span><button onclick="editGame('${esc(g.slug)}')">Düzenle</button></div>`).join('')||'<p>Hikayesi eksik oyun yok.</p>'}</div></div>`;
}
async function mergeCheckedSeries(targetId){
  const target=$('#'+targetId)?.value.trim(); if(!target)return alert('Ana seri adını yaz.');
  const selected=[...document.querySelectorAll('.merge-series-check:checked')].map(x=>x.value);
  if(!selected.length)return alert('Birleştirilecek seri seç.');
  const ids=state.games.filter(g=>selected.includes(getSeriesName(g))).map(g=>g.id);
  if(!ids.length)return alert('Oyun bulunamadı.');
  if(!confirm(`${ids.length} oyun “${target}” serisine taşınsın mı?`))return;
  await api('/api/games',{method:'PATCH',body:JSON.stringify({ids,patch:{series:target}})});
  await load(); adminTab('seriesControl');
}
async function autoFixSeriesNames(){
  if(!confirm('Tüm oyunlarda seri adları otomatik standartlaştırılsın mı?'))return;
  let changed=0;
  for(const g of state.games){const fixed=canonicalSeriesName(g.series,g.title); if(fixed && fixed!==g.series){await api('/api/games',{method:'PUT',body:JSON.stringify({game:{...g,series:fixed}})}); changed++;}}
  await load(); adminTab('seriesControl'); alert(`${changed} seri kaydı düzeltildi.`);
}
function currentSeriesItems(){return [...document.querySelectorAll('#sortableSeries .series-sort-item')];}
function sortCurrentSeriesByRelease(){const items=currentSeriesItems(); items.sort((a,b)=>{const ga=state.games.find(g=>String(g.id)===a.dataset.id)||{}, gb=state.games.find(g=>String(g.id)===b.dataset.id)||{}; return (parseDate(ga.release_date)?.getTime()||9999999999999)-(parseDate(gb.release_date)?.getTime()||9999999999999)||trSort(ga.title,gb.title);}).forEach(x=>$('#sortableSeries').appendChild(x));}
function sortCurrentSeriesAZ(){const items=currentSeriesItems(); items.sort((a,b)=>{const ga=state.games.find(g=>String(g.id)===a.dataset.id)||{}, gb=state.games.find(g=>String(g.id)===b.dataset.id)||{}; return trSort(ga.title,gb.title);}).forEach(x=>$('#sortableSeries').appendChild(x));}
async function moveGameToSeriesPrompt(id){const g=state.games.find(x=>String(x.id)===String(id)); if(!g)return; const target=prompt('Taşınacak seri adı:',g.series||''); if(!target)return; await api('/api/games',{method:'PATCH',body:JSON.stringify({ids:[id],patch:{series:target}})}); await load(); renderSeriesOrderList();}

function cleanDlcSearchTitle(title=''){
  return String(title||'')
    .replace(/\b\d+\s*\.\s*DLC'?si\b/gi,' ')
    .replace(/\bDLC'?si\b/gi,'DLC')
    .replace(/\b(Türkçe|Altyazılı|Dublajlı|Bölüm|Part|Episode|Gameplay|Oynanış|Final|Full|Walkthrough)\b/gi,' ')
    .replace(/[|#\[\]{}()]/g,' ')
    .replace(/\s+/g,' ')
    .trim();
}
function professionalCoverSearchTitle(g){
  const base=cleanDlcSearchTitle(g?.title||'');
  const series=cleanDlcSearchTitle(g?.series||'');
  const type=String(g?.type||'');
  if(/demo/i.test(`${base} ${series} ${type}`)) return `${base||series} demo game cover`;
  if(/dlc|ek paket|expansion/i.test(`${base} ${series} ${type}`)) return `${base||series} dlc expansion game cover`;
  return `${base||series} game cover`;
}
function openGoogleImageSearch(q){
  const input=$('#rawgName');
  const title=cleanDlcSearchTitle(q || input?.value || $('#gameForm')?.elements?.title?.value || '');
  if(!title)return alert('Önce oyun adını yaz.');
  const url='https://www.google.com/search?tbm=isch&q='+enc(title+' game cover');
  window.open(url,'_blank','noopener,noreferrer');
}
function openGoogleImageSearchFromForm(){openGoogleImageSearch($('#gameForm')?.elements?.title?.value||'');}
function googleCoverGame(id){const g=state.games.find(x=>String(x.id)===String(id)); openGoogleImageSearch(g?.title||'');}

async function quickCover(id){const g=state.games.find(x=>String(x.id)===String(id)); if(!g)return; try{const j=await api('/api/rawg?name='+enc(g.title)); const cover=j.game?.cover||''; if(!cover)return alert('Kapak bulunamadı.'); await api('/api/games',{method:'PUT',body:JSON.stringify({game:{...g,cover,genre:j.game?.genre||g.genre,rawg_id:j.game?.rawg_id||g.rawg_id}})}); await load(); filterAdminGames();}catch(e){alert(e.message)}}
async function quickStory(id){const g=state.games.find(x=>String(x.id)===String(id)); if(!g)return; try{const j=await api('/api/rawg?story=1&name='+enc(g.title)); const description=j.game?.description||''; if(!description)return alert('Hikaye bulunamadı.'); await api('/api/games',{method:'PUT',body:JSON.stringify({game:{...g,description}})}); await load(); filterAdminGames();}catch(e){alert(e.message)}}
async function refreshCurrentSeriesCovers(){const key=state.seriesEditKey||$('#seriesSelect')?.value||''; const gr=groupGames().find(g=>slug(g.series)===key); if(!gr)return; if(!confirm(`${gr.series} serisinin kapakları RAWG ile yenilensin mi?`))return; let ok=0; for(const g of gr.games){try{const j=await api('/api/rawg?name='+enc(g.title)); const cover=j.game?.cover||''; if(cover){await api('/api/games',{method:'PUT',body:JSON.stringify({game:{...g,cover}})}); ok++;}}catch{}} await load(); renderSeriesOrderList(); alert(`${ok} kapak yenilendi.`);}

async function rebuildAllCoversAndStories(){
  if(!confirm('V2.0.0: Tüm oyunların kapak ve hikaye alanları temizlenip RAWG ile baştan güncellensin mi? Bulunamayan kapaklara otomatik profesyonel kapak atanır.'))return;
  const out=$('#fetchOut'); let coverOk=0,storyOk=0,fail=0;
  for(let i=0;i<state.games.length;i++){
    const g=state.games[i];
    if(out)out.textContent=`%${Math.round(i/state.games.length*100)} — Baştan güncelleniyor: ${g.title}`;
    try{
      const coverRes=await api('/api/rawg?name='+enc(professionalCoverSearchTitle(g)));
      const storyRes=await api('/api/rawg?story=1&name='+enc(cleanDlcSearchTitle(g.title||g.series||'')));
      const cover=coverRes.game?.cover||gameCover({...g,cover:''});
      const description=storyRes.game?.description||'';
      const next=repairGameBeforeSave({...g,cover:'',thumbnail:'',description:'',cover,description,genre:coverRes.game?.genre||g.genre,rawg_id:coverRes.game?.rawg_id||g.rawg_id});
      await api('/api/games',{method:'PUT',body:JSON.stringify({game:next})});
      if(cover)coverOk++;
      if(description)storyOk++;
    }catch(e){console.warn(e); fail++;}
  }
  if(out)out.textContent=`%100 tamamlandı. Kapak güncellenen: ${coverOk}, Hikaye güncellenen: ${storyOk}, Hata: ${fail}`;
  await load();
  alert(`Kapak güncellenen: ${coverOk}\nHikaye güncellenen: ${storyOk}\nHata: ${fail}`);
}

function exportAll(){const data={games:state.games,notes:state.notes,events:state.events,settings:state.settings,version:VERSION}; const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})); a.download='hayatimiz-oyun-yedek.json'; a.click();}
window.addEventListener('hashchange',()=>{const p=location.hash.replace(/^#\/?/,'').split('/')[0]||'home'; state.page=p; render();});
Object.assign(window,{generateAboutText,updateSocialPreview,toggleMusic,setMusicVolume,nextAtmosphere,playMusic,pauseMusic,setPage,filterStatus,openGame,openSeries,watchGame,watchSeries,favGame,favSeries,removeWatch,azPick,login,register,logout,saveProfile,social,addFriend,respondFriend,removeFriend,openChat,sendMessage,sendComment,adminTab,updateUser,toggleBan,resetUser,deleteUser,gameForm,saveGame,editGame,clearGameForm,deleteGame,deleteSelectedGames,deleteAllGames,bulkUpdateSelectedGames,filterAdminGames,seriesOrderPanel,renderSeriesOrderList,moveSeriesItem,saveSeriesOrder,deleteSeriesGame,seriesControlPanel,mergeCheckedSeries,autoFixSeriesNames,sortCurrentSeriesByRelease,sortCurrentSeriesAZ,moveGameToSeriesPrompt,quickCover,quickStory,refreshCurrentSeriesCovers,chooseOne,toggleTagButton,saveNote,editNote,deleteNote,saveEvent,editEvent,deleteEvent,calendarImageFetch,saveSettings,clearLogs,rawgFetch,rawgStoryFetch,fetchRawgCoverForForm,ytFetch,ytChannelImport,ytChannelSync,bulkRefreshAllStories,bulkRefreshAllCovers,exportAll,copyCleanInstallCommands,downloadReadme,openGoogleImageSearch,openGoogleImageSearchFromForm,googleCoverGame,repairSelectedGames,repairAllGamesLight,markHere,markWatched,undoWatched});
load().then(()=>{const p=location.hash.replace(/^#\/?/,'').split('/')[0]; state.page=p||'home'; render(); setTimeout(hideLoader,450); {const pref=soundPrefs(); pref.enabled=false; pref.muted=true; pref.notify=false; pref.volume=0; saveSoundPrefs(pref); renderMusicPanel();}});


/* Fix 10 Stable: loading takılma güvenlik katmanı */
function fix10HideLoaders(){
  ['loader','loading','splash','preloader'].forEach(id=>{const el=document.getElementById(id); if(el){el.style.display='none'; el.style.opacity='0'; el.style.pointerEvents='none';}});
  document.querySelectorAll('.loader,.loading,.splash,.preloader').forEach(el=>{el.style.display='none'; el.style.opacity='0'; el.style.pointerEvents='none';});
}
function fix10FallbackIfStuck(){
  const app=document.getElementById('app');
  if(app && /Yükleniyor/i.test(app.textContent||'')){
    try{
      state.settings=state.settings&&Object.keys(state.settings).length?state.settings:{
        site_title:'Hayatımız Oyun',
        social_youtube:'https://www.youtube.com/@HayatimizOyunn',
        social_kick:'https://kick.com/hayatimizoyun',
        social_donate:'https://www.bynogame.com/tr/destekle/hayatimizoyun',
        maintenance:false,
        show_social_header:true,
        show_social_footer:true
      };
      state.games=Array.isArray(state.games)?state.games:[];
      state.notes=Array.isArray(state.notes)?state.notes:[];
      state.events=Array.isArray(state.events)?state.events:[];
      renderNav();
      renderSocialSurfaces();
      if(typeof home==='function') home(); else app.innerHTML=`<section class="hero"><span class="version-pill">V${VERSION}</span><h1>Hayatımız Oyun</h1><p class="muted">Site güvenli modda açıldı. API cevap vermezse bile loading ekranında kalmaz.</p><div class="row"><button onclick="setPage('admin')">Admin Panel</button><button class="ghost" onclick="location.reload()">Yenile</button></div></section>`;
    }catch(e){
      console.error('Fix10 fallback render:',e);
      app.innerHTML=`<section class="hero"><span class="version-pill">V${VERSION}</span><h1>Hayatımız Oyun</h1><p class="muted">Güvenli mod açıldı.</p><button onclick="location.reload()">Yenile</button></section>`;
    }
  }
  fix10HideLoaders();
}
window.addEventListener('error',()=>setTimeout(fix10FallbackIfStuck,100));
window.addEventListener('unhandledrejection',()=>setTimeout(fix10FallbackIfStuck,100));
setTimeout(fix10FallbackIfStuck,2800);


/* V2.0.0 güvenli açılış katmanı */
function v200HideLoaders(){
  ['loader','loading','splash','preloader'].forEach(id=>{const el=document.getElementById(id); if(el){el.style.display='none'; el.style.opacity='0'; el.style.pointerEvents='none';}});
  document.querySelectorAll('.loader,.loading,.splash,.preloader').forEach(el=>{el.style.display='none'; el.style.opacity='0'; el.style.pointerEvents='none';});
}
function v200FallbackIfStuck(){
  const app=document.getElementById('app');
  if(app && /Yükleniyor/i.test(app.textContent||'')){
    try{
      state.settings=state.settings&&Object.keys(state.settings).length?state.settings:{site_title:'Hayatımız Oyun',social_youtube:'https://www.youtube.com/@HayatimizOyunn',social_kick:'https://kick.com/hayatimizoyun',social_donate:'https://www.bynogame.com/tr/destekle/hayatimizoyun',maintenance:false,show_social_header:true,show_social_footer:true};
      state.games=Array.isArray(state.games)?state.games:[];
      state.notes=Array.isArray(state.notes)?state.notes:[];
      state.events=Array.isArray(state.events)?state.events:[];
      renderNav(); renderSocialSurfaces();
      if(typeof home==='function') home();
      else app.innerHTML=`<section class="hero"><span class="version-pill">V${VERSION}</span><h1>Hayatımız Oyun V2.0.0</h1><p class="muted">Güvenli modda açıldı. API cevap vermese bile site loading ekranında kalmaz.</p><div class="row"><button onclick="setPage('admin')">Admin Panel</button><button class="ghost" onclick="location.reload()">Yenile</button></div></section>`;
    }catch(e){
      console.error('V2 fallback render:',e);
      app.innerHTML=`<section class="hero"><span class="version-pill">V${VERSION}</span><h1>Hayatımız Oyun V2.0.0</h1><p class="muted">Güvenli mod açıldı.</p><button onclick="location.reload()">Yenile</button></section>`;
    }
  }
  v200HideLoaders();
}
window.addEventListener('error',()=>setTimeout(v200FallbackIfStuck,100));
window.addEventListener('unhandledrejection',()=>setTimeout(v200FallbackIfStuck,100));
setTimeout(v200FallbackIfStuck,2800);
try{Object.assign(window,{rebuildAllCoversAndStories,v200FallbackIfStuck});}catch(e){}
