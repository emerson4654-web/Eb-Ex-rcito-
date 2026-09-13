const $=s=>document.querySelector(s);
let config={};
async function init(){
  config=await fetch('/api/config').then(r=>r.json()).catch(()=>({}));
  if(config.gameUrl){$('#gameBtn').href=config.gameUrl;$('#footerGame').href=config.gameUrl;}
  await loadMe();
}
async function loadMe(){
  const r=await fetch('/api/me');
  if(!r.ok){$('#panelState').classList.remove('hidden');return;}
  const d=await r.json();
  $('#panelState').classList.add('hidden');$('#profile').classList.remove('hidden');
  $('#username').textContent=d.user.preferred_username||d.user.name||'Militar';$('#userid').textContent='ID: '+d.user.sub;
  $('#avatar').src=d.user.picture||`https://tr.rbxcdn.com/30DAY-AvatarHeadshot-Png?userId=${d.user.sub}&width=150&height=150&format=png`;
  $('#roleName').textContent=d.role?.name||'Não está no grupo';$('#ups').textContent=d.ups||0;
  if(d.admin){$('#adminBadge').classList.remove('hidden');$('#admin').classList.remove('hidden');await loadRoles();}
  renderList('#trainingList',d.trainingHistory||[],x=>`🎓 <b>${esc(x.title)}</b> — +${x.ups} UP(s) <span>• ${date(x.at)}</span>`);
  renderList('#promotionList',d.promotionHistory||[],x=>`⬆️ <b>Promoção aplicada</b> — role ${esc(x.roleId)} <span>• ${date(x.at)}</span>`);
}
async function loadRoles(){
  const r=await fetch('/api/roles');const d=await r.json();const s=$('#roleSelect');s.innerHTML='<option value="">Selecione a próxima patente</option>'+(d.roles||[]).map(x=>`<option value="${esc(x.id)}">${esc(x.displayName||x.name||x.path||'Patente')}</option>`).join('');
}
$('#logout').onclick=async()=>{await fetch('/auth/logout',{method:'POST'});location.reload()};
$('#promoteForm').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);const msg=$('#adminMsg');const r=await fetch('/api/promote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(f))});const d=await r.json();msg.className='form-msg '+(r.ok?'ok':'err');msg.textContent=r.ok?'✅ Promoção aplicada com sucesso.':('❌ '+(d.error||'Erro'));if(r.ok) e.target.reset();};
$('#trainingForm').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);const msg=$('#adminMsg');const r=await fetch('/api/training',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(f))});const d=await r.json();msg.className='form-msg '+(r.ok?'ok':'err');msg.textContent=r.ok?`✅ Treinamento registrado. Total: ${d.totalUps} UPs.`:('❌ '+(d.error||'Erro'));};
function renderList(sel,arr,fn){$(sel).innerHTML=arr.length?arr.map(x=>`<div class="timeline-item">${fn(x)}</div>`).join(''):'<div class="timeline-item"><span>Nenhum registro ainda.</span></div>'}
function date(v){try{return new Date(v).toLocaleDateString('pt-BR')}catch{return ''}}
function esc(v){return String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
init();
