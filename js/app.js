(()=>{
const app=document.getElementById('app'),nav=document.getElementById('nav');
const CARDS=[{k:'scam',t:'Spot the Scam',d:'Investigate a fake email, scholarship message and bank alert.',i:'🎣'},{k:'foot',t:'Footprint Detective',d:'Find what Alex\u2019s public profile gives away.',i:'🔍'},{k:'truth',t:'Truth or Trap?',d:'Decide what to do with five viral claims.',i:'📰'},{k:'quiz',t:'The Safety Challenge',d:'Ten questions to test what you have learned.',i:'🏆'}];
let confirmReset=false,lastView='';
const bar=p=>`<div class="bar" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100"><i style="width:${p}%"></i></div>`;
function welcome(){return `<section class="hero"><div class="logo big">DSL</div><h1>Digital Safety Lab</h1><p class="ed">FUTA Edition</p><p class="tag">Think. Identify. Protect.</p>
<p>Welcome to Digital Safety Lab. The internet offers incredible opportunities, but navigating it safely requires knowledge and good decisions. Explore realistic digital scenarios, test your awareness and discover how to protect yourself online.</p>
<button class="btn" data-a="start">Start Exploring</button>
<p class="muted small">Privacy: no name, email, phone number or password is needed. Your progress is saved only on this device and may be lost if you clear browser data. This is an independent learning resource and not an official FUTA product.</p></section>`}
function dash(){const x=Score.total(),n=Score.ACTS.filter(Score.done).length;
return `<h2>Welcome back, explorer</h2><div class="card"><div class="stats"><div><b>${x}</b><small>of ${Score.TOTAL} XP</small></div><div><b>${n}/4</b><small>completed</small></div></div>${bar(Math.round(x/Score.TOTAL*100))}</div>
${CARDS.map(c=>`<button class="act" onclick="location.hash='#/${c.k}'"><span class="ic">${c.i}</span><span><b>${c.t}</b><br><small>${c.d}</small><br><small class="${Score.done(c.k)?'ok':'muted'}">${Score.done(c.k)?'✓ Completed':'Not completed'} · ${Score.actXP(c.k)}/${Score.MAX[c.k]} XP</small></span></button>`).join('')}
<p class="muted small">Finish all four activities for a ${Score.BONUS} XP bonus${Score.allDone()?' (earned)':''}.</p><button class="btn" onclick="location.hash='#/report'">View my safety report</button>`}
const BADGES=[['First Steps','Complete any activity',()=>Score.ACTS.some(Score.done)],['Scam Spotter','Earn all 150 XP in Spot the Scam',()=>Score.actXP('scam')>=150],['Footprint Detective','Earn all 100 XP in Footprint Detective',()=>Score.actXP('foot')>=100],['Truth Seeker','Earn all 100 XP in Truth or Trap',()=>Score.actXP('truth')>=100],['Challenge Ace','Score 8 or more in the Safety Challenge',()=>(Act.quizStats()||{score:0}).score>=8],['Lab Complete','Complete all four activities',()=>Score.allDone()],['Perfect Lab','Earn all 600 XP',()=>Score.total()>=600]];
function report(){const st=Act.quizStats(),p=st?Math.round(st.score/st.total*100):null,T=Act.D.quiz.topics;
let h=`<h2>Your Digital Safety Report</h2><div class="card center"><div class="big">${Score.total()} XP</div><small>of ${Score.TOTAL}</small>${bar(Math.round(Score.total()/Score.TOTAL*100))}<p>${Score.ACTS.filter(Score.done).length} of 4 activities completed</p></div>
<div class="card center">${st?`<div class="big">${st.score}/${st.total}</div><b>${Score.level(p)}</b><p>${Score.msg(p)}</p>`:'<p>Complete the Safety Challenge to get your rating.</p>'}</div>
<h3>XP by activity</h3><div class="card">${CARDS.map(c=>`<p>${c.t}: ${Score.actXP(c.k)}/${Score.MAX[c.k]}${bar(Math.round(Score.actXP(c.k)/Score.MAX[c.k]*100))}</p>`).join('')}</div>`;
if(st){h+=`<h3>Topic breakdown</h3><div class="card">${Object.entries(st.by).map(([k,v])=>`<p>${esc(T[k].name)}: ${v.c}/${v.n}${bar(Math.round(v.c/v.n*100))}</p>`).join('')}</div>`;
const weak=Object.entries(st.by).filter(([,v])=>v.c<v.n);
h+=`<h3>Recommendations</h3><div class="card">${weak.length?weak.map(([k])=>`<p><b>${esc(T[k].name)}.</b> ${esc(T[k].rec)}</p>`).join(''):'<p>You answered every question correctly. Share what you learned with a friend.</p>'}</div>`}
h+=`<h3>Badges</h3><div class="badges">${BADGES.map(b=>{const o=b[2]();return `<div class="badge ${o?'got':''}"><b>${o?'🏅':'🔒'} ${b[0]}</b><small>${b[1]}</small></div>`}).join('')}</div>
<div class="row"><button class="btn alt" data-a="restart">Restart activities</button>`+(confirmReset?`<div class="card warn"><p>Reset all saved progress on this device? This cannot be undone.</p><div class="row"><button class="btn danger" data-a="reset-yes">Yes, reset</button><button class="btn alt" data-a="reset-no">Cancel</button></div></div>`:`<button class="btn alt" data-a="reset-ask">Reset saved progress</button>`)+`</div><p class="muted small">Progress is stored only in this browser. No name is collected and no certificate is generated.</p>`;
return h}
function refresh(){const S=Store.get();let r=location.hash.replace('#/','');if(!S.seen)r='welcome';else if(!['dash','scam','foot','truth','quiz','report'].includes(r))r='dash';
let h;if(r==='welcome')h=welcome();else if(r==='dash')h=dash();else if(r==='report')h=report();else h=`<button class="back" onclick="location.hash='#/dash'">← Dashboard</button>`+Act.render(r);
app.innerHTML=h;nav.hidden=r==='welcome';nav.querySelectorAll('a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#/'+(r==='report'?'report':'dash')));
if(r!==lastView){window.scrollTo(0,0);app.focus({preventScroll:true});lastView=r}}
window.refresh=refresh;
app.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b||b.disabled)return;const a=b.dataset.a;
if(a==='start'){Store.get().seen=true;Store.save();location.hash='#/dash';return refresh()}
if(a==='restart'){const s=Store.get();s.done={};delete s.ans.att;s.ans.quiz=null;Store.save();Act.resetUI();confirmReset=false;location.hash='#/dash';return refresh()}
if(a==='reset-ask'){confirmReset=true;return refresh()}
if(a==='reset-no'){confirmReset=false;return refresh()}
if(a==='reset-yes'){Store.reset();Act.resetUI();confirmReset=false;location.hash='';return refresh()}
Act.on(a,b.dataset)});
window.addEventListener('hashchange',refresh);
const net=document.getElementById('net'),setNet=()=>{net.textContent=navigator.onLine?'Online':'Offline';net.className='pill '+(navigator.onLine?'on':'off')};
addEventListener('online',setNet);addEventListener('offline',setNet);setNet();
if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
Act.load().then(refresh).catch(()=>{app.innerHTML='<div class="card warn"><p>Could not load challenge data. Connect to the internet once, then reload.</p></div>'});
})();
