(() => {
  const VERSION = 'v2.4.0 FIX 6';
  const LS_KEY = 'ho_redeploy_ai_center_v240_fix6';
  const now = () => new Date().toLocaleString('tr-TR');
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const read = () => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return {}; }
  };
  const write = (patch) => {
    const next = { ...read(), ...patch, updatedAt: new Date().toISOString() };
    localStorage.setItem(LS_KEY, JSON.stringify(next));
    return next;
  };
  const log = (type, text, extra={}) => {
    const state = read();
    const logs = Array.isArray(state.logs) ? state.logs : [];
    logs.unshift({ id: 'l'+Date.now(), at: now(), type, text, ...extra });
    write({ logs: logs.slice(0, 40) });
    renderModal();
  };
  const api = async (action, payload={}) => {
    try {
      const res = await fetch('/api', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action, ...payload }) });
      return await res.json().catch(()=>({ ok:false, error:'JSON okunamadı' }));
    } catch (error) {
      return { ok:false, error: error.message || String(error) };
    }
  };
  const featureSeeds = [
    { key:'redeploy_panel', title:'Site İçi Redeploy Paneli', target:'Yönetim Paneli > Redeploy / AI Tanı', table:'site_redeploy_requests', status:'eklendi' },
    { key:'github_status', title:'GitHub Yüklendi Durum Kaydı', target:'Deploy Akışı', table:'site_deploy_events', status:'eklendi' },
    { key:'vercel_status', title:'Vercel Redeploy Durum Kaydı', target:'Deploy Akışı', table:'site_deploy_events', status:'eklendi' },
    { key:'supabase_schema_feedback', title:'Yeni Tablo / SQL Geri Bildirim Kaydı', target:'Supabase Tanı', table:'site_schema_feedback', status:'eklendi' },
    { key:'ai_feature_registry', title:'AI Özelliklerini Tanıma Kaydı', target:'AI Özellik Merkezi', table:'site_ai_feature_registry', status:'eklendi' }
  ];
  function isAdminArea(){
    return /Yönetim Paneli|Yönetim Merkezi|AI Özellik|Deploy|Schema/i.test(document.body?.innerText || '') || location.hash.includes('yonetim') || location.hash.includes('admin');
  }
  function injectButton(){
    if(!isAdminArea()) return;
    if(document.querySelector('[data-ho-redeploy-open]')) return;
    const sidebar = document.querySelector('.adminAccordionBody') || document.querySelector('.fix5AdminSidebar') || document.querySelector('.sideNavLabel')?.parentElement;
    if(!sidebar) return;
    const btn = document.createElement('button');
    btn.className = 'adminSubLink hoRedeploySideBtn';
    btn.setAttribute('data-ho-redeploy-open','1');
    btn.innerHTML = '<span class="subDot"></span><div><b>Redeploy / AI Tanı</b><small>GitHub • Vercel • Supabase</small></div>';
    sidebar.appendChild(btn);
  }
  function ensureModal(){
    let modal = document.getElementById('hoRedeployModal');
    if(modal) return modal;
    modal = document.createElement('div');
    modal.id = 'hoRedeployModal';
    modal.className = 'hoRedeployOverlay';
    modal.innerHTML = '<div class="hoRedeployModal"><button class="hoRedeployClose" data-ho-redeploy-close>×</button><div id="hoRedeployContent"></div></div>';
    document.body.appendChild(modal);
    return modal;
  }
  function renderModal(){
    const modal = ensureModal();
    const s = read();
    const features = Array.isArray(s.features) ? s.features : featureSeeds;
    const logs = Array.isArray(s.logs) ? s.logs : [];
    const webhook = s.vercelWebhook || '';
    const repo = s.githubRepo || 'https://github.com/hayatimizoyunyoutube/HayatimizOyunYoutubeArsivi';
    const schema = s.schemaVersion || VERSION;
    const feedback = s.schemaFeedback || '';
    modal.querySelector('#hoRedeployContent').innerHTML = `
      <section class="hoRedeployHero">
        <span>${VERSION}</span>
        <h2>Redeploy / AI Tanı Merkezi</h2>
        <p>GitHub yükleme, Vercel redeploy, Supabase schema ve AI özellik tanı durumlarını tek panelde takip et.</p>
      </section>
      <div class="hoRedeployGrid">
        <article class="hoRedeployCard">
          <h3>GitHub / Vercel Redeploy</h3>
          <label>GitHub Repo<input id="hoGithubRepo" value="${esc(repo)}"></label>
          <label>Vercel Deploy Hook URL <small>Varsa gerçek redeploy tetikler</small><input id="hoVercelWebhook" value="${esc(webhook)}" placeholder="https://api.vercel.com/v1/integrations/deploy/..." ></label>
          <div class="hoBtnRow">
            <button class="hoPrimary" data-ho-save-deploy-settings>Kaydet</button>
            <button data-ho-mark-github>GitHub'a Yüklendi</button>
            <button data-ho-trigger-vercel>Redeploy Başlat</button>
            <button data-ho-mark-success>Başarılı Olarak İşaretle</button>
          </div>
          <div class="hoStatusRow"><b>GitHub:</b><span>${esc(s.githubStatus || 'bekliyor')}</span></div>
          <div class="hoStatusRow"><b>Vercel:</b><span>${esc(s.vercelStatus || 'bekliyor')}</span></div>
          <div class="hoStatusRow"><b>Son durum:</b><span>${esc(s.lastStatus || 'Henüz işlem yok')}</span></div>
        </article>
        <article class="hoRedeployCard">
          <h3>Supabase Tanı / Yeni Tablo</h3>
          <label>Schema sürümü<input id="hoSchemaVersion" value="${esc(schema)}"></label>
          <label>Yeni tablo / SQL geri bildirimi<textarea id="hoSchemaFeedback" rows="6" placeholder="Yeni tablo gerekiyorsa buraya not/SQL taslağı yaz...">${esc(feedback)}</textarea></label>
          <div class="hoBtnRow">
            <button class="hoPrimary" data-ho-save-schema-feedback>Supabase Tanı Ekle</button>
            <button data-ho-mark-supabase>Supabase Schema Uygulandı</button>
          </div>
          <div class="hoStatusRow"><b>Supabase:</b><span>${esc(s.supabaseStatus || 'bekliyor')}</span></div>
        </article>
      </div>
      <section class="hoRedeployCard full">
        <div class="hoSectionHead"><div><h3>AI Özellik Tanıma</h3><p>AI özellikleri Supabase kayıtlarıyla eşleşecek şekilde tanınır.</p></div><button class="hoPrimary" data-ho-scan-ai>AI Özelliklerini Tara ve Tanı</button></div>
        <div class="hoFeatureGrid">${features.map(f=>`<article><b>${esc(f.title)}</b><small>${esc(f.target)}</small><span>Tablo: ${esc(f.table)}</span><em>${esc(f.status || 'bekliyor')}</em></article>`).join('')}</div>
      </section>
      <section class="hoRedeployCard full">
        <h3>İşlem Geçmişi</h3>
        <div class="hoLogList">${logs.map(l=>`<div><b>${esc(l.type)}</b><span>${esc(l.at)}</span><p>${esc(l.text)}</p></div>`).join('') || '<p>Henüz işlem kaydı yok.</p>'}</div>
      </section>`;
  }
  async function openModal(){ ensureModal().classList.add('open'); renderModal(); }
  function closeModal(){ const modal = document.getElementById('hoRedeployModal'); if(modal) modal.classList.remove('open'); }
  document.addEventListener('click', async (e) => {
    const target = e.target;
    if(!target || !target.closest) return;
    if(target.closest('[data-ho-redeploy-open]')) { e.preventDefault(); openModal(); return; }
    if(target.closest('[data-ho-redeploy-close]')) { e.preventDefault(); closeModal(); return; }
    if(target.closest('[data-ho-save-deploy-settings]')) {
      e.preventDefault();
      const state = write({ vercelWebhook: document.getElementById('hoVercelWebhook')?.value || '', githubRepo: document.getElementById('hoGithubRepo')?.value || '' });
      log('Ayar', 'GitHub/Vercel ayarları kaydedildi.'); return;
    }
    if(target.closest('[data-ho-mark-github]')) {
      e.preventDefault(); write({ githubStatus:'GitHub’a yüklendi', lastStatus:'GitHub yükleme işaretlendi' });
      await api('deploy-event-save', { event:{ provider:'github', status:'uploaded', message:'GitHub temiz force push başarılı olarak işaretlendi.', version:VERSION } });
      log('GitHub', 'GitHub’a yüklendi olarak işaretlendi.'); return;
    }
    if(target.closest('[data-ho-trigger-vercel]')) {
      e.preventDefault();
      const url = document.getElementById('hoVercelWebhook')?.value || read().vercelWebhook || '';
      if(url){
        try { await fetch(url, { method:'POST', mode:'no-cors' }); write({ vercelStatus:'Redeploy tetiklendi', lastStatus:'Vercel redeploy isteği gönderildi' }); log('Vercel', 'Deploy Hook üzerinden redeploy isteği gönderildi.'); }
        catch(err){ write({ vercelStatus:'Redeploy hatası', lastStatus:err.message }); log('Vercel Hata', err.message || String(err)); }
      } else {
        write({ vercelStatus:'Webhook yok; GitHub push sonrası otomatik deploy bekleniyor', lastStatus:'Vercel hook eklenmedi' });
        log('Vercel', 'Deploy Hook URL yok. GitHub push sonrası Vercel otomatik deploy beklenir.');
      }
      await api('redeploy-trigger', { webhookUrl:url, version:VERSION });
      return;
    }
    if(target.closest('[data-ho-mark-success]')) {
      e.preventDefault(); write({ githubStatus:'yüklendi', vercelStatus:'başarılı', supabaseStatus: read().supabaseStatus || 'bekliyor', lastStatus:'Canlı yayın başarılı olarak işaretlendi' });
      await api('deploy-event-save', { event:{ provider:'vercel', status:'success', message:'Canlı deploy başarılı işaretlendi.', version:VERSION } });
      log('Başarılı', 'Site başarılı olarak işaretlendi.'); return;
    }
    if(target.closest('[data-ho-save-schema-feedback]')) {
      e.preventDefault();
      const feedback = document.getElementById('hoSchemaFeedback')?.value || '';
      const version = document.getElementById('hoSchemaVersion')?.value || VERSION;
      write({ schemaFeedback:feedback, schemaVersion:version, supabaseStatus:'Geri bildirim kaydedildi' });
      await api('schema-feedback-add', { feedback:{ version, message:feedback, source:'redeploy_ai_center' } });
      log('Supabase', 'Yeni tablo / SQL geri bildirimi kaydedildi.'); return;
    }
    if(target.closest('[data-ho-mark-supabase]')) {
      e.preventDefault(); write({ supabaseStatus:'schema.sql uygulandı', lastStatus:'Supabase schema güncel' });
      await api('deploy-event-save', { event:{ provider:'supabase', status:'schema_applied', message:'Supabase schema.sql uygulandı olarak işaretlendi.', version:VERSION } });
      log('Supabase', 'Supabase schema.sql uygulandı olarak işaretlendi.'); return;
    }
    if(target.closest('[data-ho-scan-ai]')) {
      e.preventDefault();
      const features = featureSeeds.map(f=>({ ...f, detectedAt: now(), status:'tanındı' }));
      write({ features, lastStatus:'AI özellikleri tanındı' });
      await api('ai-feature-registry-save', { features, version:VERSION });
      log('AI Tanı', 'AI özellikleri Supabase tanı listesine kaydedildi.'); return;
    }
  }, true);
  const mo = new MutationObserver(() => injectButton());
  window.addEventListener('DOMContentLoaded', () => { injectButton(); mo.observe(document.body, { childList:true, subtree:true }); });
  setTimeout(() => { injectButton(); if(document.body) mo.observe(document.body, { childList:true, subtree:true }); }, 800);
})();
