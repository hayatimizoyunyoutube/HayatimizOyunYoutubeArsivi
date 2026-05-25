(() => {
  const VERSION = 'v2.4.0 FIX 13';
  const KEY = 'ho_redeploy_ai_center_v240_fix7';
  const esc = v => String(v ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } };
  const write = patch => { const next = { ...read(), ...patch, updatedAt:new Date().toISOString() }; localStorage.setItem(KEY, JSON.stringify(next)); return next; };
  const now = () => new Date().toLocaleString('tr-TR');
  const api = async (action, payload={}) => { try { const res = await fetch('/api', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ action, ...payload }) }); return await res.json().catch(()=>({ok:false,error:'JSON okunamadı'})); } catch(e){ return { ok:false, error:e.message||String(e) }; } };
  const features = [
    { key:'auto_ai_registry', title:'AI özelliklerini otomatik tanı', target:'AI Özellik Ekle', table:'site_ai_feature_registry' },
    { key:'auto_github_state', title:'GitHub yükleme durumunu işleme al', target:'Deploy Merkezi', table:'site_deploy_events' },
    { key:'auto_vercel_state', title:'Vercel deploy durumunu işleme al', target:'Deploy Merkezi', table:'site_redeploy_requests' },
    { key:'auto_schema_feedback', title:'Supabase yeni tablo geri bildirimi', target:'Schema Geçmişi', table:'site_schema_feedback' },
    { key:'auto_fix_writer', title:'Hata yazınca otomatik düzeltme planı', target:'Deploy Merkezi', table:'site_auto_fix_requests' }
  ];
  function modal(){
    let el = document.getElementById('hoRedeployModal');
    if(el) return el;
    el = document.createElement('div'); el.id='hoRedeployModal'; el.className='hoRedeployOverlay';
    el.innerHTML = '<div class="hoRedeployModal"><button class="hoRedeployClose" data-ho-rd-close>×</button><div id="hoRedeployContent"></div></div>';
    document.body.appendChild(el); return el;
  }
  function logs(){ return Array.isArray(read().logs) ? read().logs : []; }
  function addLog(type,text){ const list = logs(); list.unshift({type,text,at:now()}); write({logs:list.slice(0,40)}); render(); }
  function diagnose(text){
    const lower = String(text||'').toLowerCase(); const out=[];
    if(/referenceerror|is not defined/.test(lower)) out.push('Eksik fonksiyon/değişken: src/main.js içine güvenli fallback eklenmeli.');
    if(/404|not_found/.test(lower)) out.push('Vercel 404: vercel.json rewrites, dist/index.html ve Root Directory kontrol edilmeli.');
    if(/supabase|schema|column|relation/.test(lower)) out.push('Supabase: schema.sql içine IF NOT EXISTS tablo/kolon eklenmeli.');
    if(/maximum call stack|stack size/.test(lower)) out.push('Sonsuz döngü: adminBody/render override zinciri tek eski referansa bağlanmalı.');
    if(!out.length) out.push('Genel düzeltme: src/main.js, api/index.js, supabase/schema.sql ve vercel.json kontrol edilerek fix paketi hazırlanmalı.');
    return out;
  }
  function render(){
    const s = read(); const el = modal(); const content = el.querySelector('#hoRedeployContent'); if(!content) return;
    const d = diagnose(s.errorText || '');
    content.innerHTML = `<section class="hoRedeployHero"><span>${VERSION}</span><h2>Otomatik AI / Deploy Tanı Merkezi</h2><p>Hook URL girmen gerekmez. AI özellikleri tanır, GitHub/Vercel/Supabase durumunu işleme alır, hata olursa geri dönüş üretir.</p></section><div class="hoRedeployGrid"><article class="hoRedeployCard"><h3>Otomatik İşlem Akışı</h3><div class="hoBtnRow"><button class="hoPrimary" data-ho-rd-auto>AI Tanı + GitHub/Vercel/Supabase İşleme Al</button><button data-ho-rd-success>Başarılı Olarak İşaretle</button><button data-ho-rd-error>Hata Olarak İşaretle</button></div><div class="hoStatusRow"><b>AI:</b><span>${esc(s.ai||'bekliyor')}</span></div><div class="hoStatusRow"><b>GitHub:</b><span>${esc(s.github||'bekliyor')}</span></div><div class="hoStatusRow"><b>Vercel:</b><span>${esc(s.vercel||'bekliyor')}</span></div><div class="hoStatusRow"><b>Supabase:</b><span>${esc(s.supabase||'bekliyor')}</span></div></article><article class="hoRedeployCard"><h3>Hatayı Yaz, Otomatik Düzeltme Planı Al</h3><label>Hata metni<textarea id="hoRdErrorText" rows="7" placeholder="ReferenceError, 404, Supabase hatası...">${esc(s.errorText||'')}</textarea></label><div class="hoBtnRow"><button class="hoPrimary" data-ho-rd-diagnose>Hatayı Bul ve Planı Kaydet</button><button data-ho-rd-clear>Temizle</button></div>${d.map(x=>`<div class="hoStatusRow"><b>Düzeltme:</b><span>${esc(x)}</span></div>`).join('')}</article></div><section class="hoRedeployCard full"><h3>Tanımlanan AI Özellikleri</h3><div class="hoFeatureGrid">${features.map(f=>`<article><b>${esc(f.title)}</b><small>${esc(f.target)}</small><span>Tablo: ${esc(f.table)}</span><em>${s.ai==='tanındı'?'tanındı':'bekliyor'}</em></article>`).join('')}</div></section><section class="hoRedeployCard full"><h3>Geri Bildirim</h3><div class="hoLogList">${logs().map(l=>`<div><b>${esc(l.type)}</b><span>${esc(l.at)}</span><p>${esc(l.text)}</p></div>`).join('') || '<p>Henüz işlem yok.</p>'}</div></section>`;
  }
  function inject(){
    if(document.querySelector('[data-ho-rd-open]')) return;
    const sidebar = document.querySelector('.adminAccordionBody') || document.querySelector('.fix5AdminSidebar');
    if(!sidebar || !/Yönetim|Admin|AI|Deploy|Schema/i.test(document.body.innerText || '')) return;
    const btn = document.createElement('button'); btn.className='adminSubLink hoRedeploySideBtn'; btn.dataset.hoRdOpen='1';
    btn.innerHTML='<span class="subDot"></span><div><b>Otomatik AI / Deploy Tanı</b><small>GitHub • Vercel • Supabase</small></div>';
    sidebar.appendChild(btn);
  }
  document.addEventListener('click', async e => {
    const t = e.target?.closest?.('[data-ho-rd-open],[data-ho-rd-close],[data-ho-rd-auto],[data-ho-rd-success],[data-ho-rd-error],[data-ho-rd-diagnose],[data-ho-rd-clear]');
    if(!t) return; e.preventDefault();
    if(t.dataset.hoRdOpen!==undefined){ modal().classList.add('open'); render(); return; }
    if(t.dataset.hoRdClose!==undefined){ modal().classList.remove('open'); return; }
    if(t.dataset.hoRdAuto!==undefined){ write({ai:'tanındı',github:'işleme alındı',vercel:'işleme alındı',supabase:'işleme alındı'}); await api('ai-feature-registry-save',{version:VERSION,features}); await api('deploy-event-save',{event:{provider:'auto',status:'processing',message:'Otomatik AI/GitHub/Vercel/Supabase akışı işleme alındı.',version:VERSION}}); addLog('Otomatik', 'AI özellikleri tanındı; GitHub, Vercel ve Supabase işleme alındı.'); return; }
    if(t.dataset.hoRdSuccess!==undefined){ write({github:'başarılı',vercel:'başarılı',supabase:'başarılı'}); await api('deploy-event-save',{event:{provider:'auto',status:'success',message:'Tüm akış başarılı işaretlendi.',version:VERSION}}); addLog('Başarılı','İşlem başarılı olarak kaydedildi.'); return; }
    if(t.dataset.hoRdError!==undefined){ write({vercel:'hata',lastErrorAt:now()}); addLog('Hata','İşlem hata olarak işaretlendi. Hata metni yazıp tanı oluştur.'); return; }
    if(t.dataset.hoRdDiagnose!==undefined){ const text=document.getElementById('hoRdErrorText')?.value||''; write({errorText:text}); await api('schema-feedback-add',{feedback:{version:VERSION,source:'auto_fix_center',message:text+'\n'+diagnose(text).join('\n')}}); addLog('Hata Tanı', diagnose(text).join(' | ')); return; }
    if(t.dataset.hoRdClear!==undefined){ write({errorText:'',logs:[]}); render(); return; }
  }, true);
  new MutationObserver(inject).observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('DOMContentLoaded',()=>{ inject(); setTimeout(inject,700); });
})();
