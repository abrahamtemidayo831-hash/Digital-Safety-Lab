const Act=(()=>{
const D={},ui={};
const SIM='<div class="sim">SIMULATION — FOR EDUCATIONAL PURPOSES</div>';
const R=()=>window.refresh();
const ans=()=>Store.get().ans;
function att(a,id,n){const m=ans();m.att=m.att||{};const l=m.att[a]=m.att[a]||[];if(!l.includes(id))l.push(id);Store.save();if(l.length>=n)Score.complete(a)}
const gain=g=>g?`<p class="gain">+${g} XP</p>`:'<p class="muted">No new XP this time. Points are only awarded once per question.</p>';
const mark=(ok)=>ok?'<span class="ok">✓</span>':'<span class="bad">✗</span>';
const nextBtn=(a,last,txt)=>`<button class="btn" data-a="${a}">${last?'Finish and return to dashboard':txt}</button>`;

/* SPOT THE SCAM */
const sc=()=>ui.scam||(ui.scam={i:0,sel:[],act:-1,sub:false,insp:{},g:0,hint:false});
function scamR(){const u=sc(),s=D.scam[u.i],n=D.scam.length;
let h=`<h2>Spot the Scam <small>${u.i+1} of ${n}</small></h2>${SIM}<p class="muted">${esc(s.title)}</p>
<article class="msg"><div class="mh"><b>${esc(s.channel)}</b><div>From: ${esc(u.insp.f?s.fromReveal:s.from)}</div>${s.subject?`<div>Subject: ${esc(s.subject)}</div>`:''}</div>
${s.body.map(p=>`<p>${esc(p)}</p>`).join('')}<p><span class="fakelink">${esc(u.insp.l?s.linkReveal:s.link)}</span></p>
<div class="row"><button class="chip" data-a="scam-insp" data-k="f">Inspect sender</button><button class="chip" data-a="scam-insp" data-k="l">Inspect link</button></div></article>
<h3>1. Tap every suspicious sign</h3><div class="list">`;
s.indicators.forEach((x,k)=>{const on=u.sel.includes(k);const c=u.sub?((x.real===on)?'ok':'bad'):'';
h+=`<button class="opt ${on?'on':''} ${c}" aria-pressed="${on}" data-a="scam-sel" data-k="${k}" ${u.sub?'disabled':''}>${u.sub?mark(x.real===on):''} ${esc(x.t)}</button>${u.sub?`<p class="why">${x.real?'Suspicious. ':'Not a warning sign. '}${esc(x.why)}</p>`:''}`});
h+=`</div><h3>2. Choose your safest response</h3><div class="list">`;
s.actions.forEach((x,k)=>{const on=u.act===k;const c=u.sub?(x.correct?'ok':on?'bad':''):'';
h+=`<button class="opt ${on?'on':''} ${c}" aria-pressed="${on}" data-a="scam-act" data-k="${k}" ${u.sub?'disabled':''}>${esc(x.t)}</button>${u.sub&&(on||x.correct)?`<p class="why">${esc(x.why)}</p>`:''}`});
h+='</div>';
if(!u.sub){h+=`${u.hint?'<p class="bad">Choose a response first.</p>':''}<button class="btn" data-a="scam-sub">Check my answers</button>`}
else{h+=`<div class="card">${gain(u.g)}<div class="row"><button class="btn alt" data-a="scam-retry">Try again</button>${nextBtn('scam-next',u.i===n-1,'Next scenario')}</div></div>`}
return h}
function scamOn(a,d){const u=sc(),s=D.scam[u.i];
if(a==='scam-insp')u.insp[d.k]=!u.insp[d.k];
else if(a==='scam-sel'){const k=+d.k;u.sel=u.sel.includes(k)?u.sel.filter(x=>x!==k):[...u.sel,k]}
else if(a==='scam-act')u.act=+d.k;
else if(a==='scam-sub'){if(u.act<0){u.hint=true;return R()}
const ok=s.indicators.every((x,k)=>x.real===u.sel.includes(k)),aok=s.actions[u.act].correct;
u.g=(ok?Score.award(`scam:${s.id}:ind`,25):0)+(aok?Score.award(`scam:${s.id}:act`,25):0);u.sub=true;att('scam',s.id,D.scam.length)}
else if(a==='scam-retry'){Object.assign(u,{sel:[],act:-1,sub:false,g:0,hint:false})}
else if(a==='scam-next'){if(u.i===D.scam.length-1){ui.scam=null;location.hash='#/dash';return}ui.scam={i:u.i+1,sel:[],act:-1,sub:false,insp:{},g:0,hint:false}}
R()}

/* FOOTPRINT DETECTIVE */
const fp=()=>ui.foot||(ui.foot={sel:[],sub:false,g:0});
function footR(){const u=fp(),F=D.foot;
let h=`<h2>Footprint Detective</h2>${SIM}<div class="card profile"><div class="avatar">A</div><div><b>${esc(F.profile.name)}</b> <small>${esc(F.profile.handle)}</small><p class="muted">${esc(F.profile.bio)}</p></div></div>
<p>Tap every post or detail that could expose Alex to a privacy risk. Leave low-risk items unselected.</p><div class="list">`;
F.items.forEach(x=>{const on=u.sel.includes(x.id),c=u.sub?((x.risky===on)?'ok':'bad'):'';
h+=`<button class="opt post ${on?'on':''} ${c}" aria-pressed="${on}" data-a="foot-sel" data-k="${x.id}" ${u.sub?'disabled':''}><small>${esc(x.kind)}</small><br>${u.sub?mark(x.risky===on)+' ':''}${esc(x.text)}</button>`;
if(u.sub)h+=x.risky?`<div class="why"><b>Exposed:</b> ${esc(x.exposes)}<br><b>How it could be used:</b> ${esc(x.misuse)}<br><b>Safer:</b> ${esc(x.safer)}</div>`:`<div class="why"><b>Low risk.</b> ${esc(x.why)}</div>`});
h+='</div>';
if(!u.sub)h+='<button class="btn" data-a="foot-sub">Check my investigation</button>';
else{const c=F.items.filter(x=>x.risky===u.sel.includes(x.id)).length;
h+=`<div class="card"><p><b>${c} of ${F.items.length} correct.</b></p>${gain(u.g)}<div class="row"><button class="btn alt" data-a="foot-retry">Try again</button><button class="btn" data-a="foot-fin">Back to dashboard</button></div></div>
<h3>Quick lesson</h3>${F.lesson.map(l=>`<div class="card"><b>${esc(l.t)}</b><p>${esc(l.b)}</p></div>`).join('')}`}
return h}
function footOn(a,d){const u=fp();
if(a==='foot-sel')u.sel=u.sel.includes(d.k)?u.sel.filter(x=>x!==d.k):[...u.sel,d.k];
else if(a==='foot-sub'){u.g=0;D.foot.items.forEach(x=>{if(x.risky===u.sel.includes(x.id))u.g+=Score.award('foot:'+x.id,10)});u.sub=true;Score.complete('foot')}
else if(a==='foot-retry')ui.foot={sel:[],sub:false,g:0};
else if(a==='foot-fin'){ui.foot=null;location.hash='#/dash';return}
R()}

/* TRUTH OR TRAP */
const OPTS=['Believe it','Share it','Investigate further','Reject it'];
const tr=()=>ui.truth||(ui.truth={i:0,pick:-1,g:0});
function truthR(){const u=tr(),T=D.truth,c=T.claims[u.i],n=T.claims.length;
let h=`<h2>Truth or Trap? <small>${u.i+1} of ${n}</small></h2>${SIM}<article class="msg"><div class="mh"><b>${esc(c.label)}</b><div>Source: ${esc(c.source)}</div></div><p>${esc(c.text)}</p></article><p>What would you do?</p><div class="list">`;
OPTS.forEach((o,k)=>{const cls=u.pick<0?'':(k===c.answer?'ok':k===u.pick?'bad':'');h+=`<button class="opt ${cls}" data-a="truth-pick" data-k="${k}" ${u.pick>=0?'disabled':''}>${o}</button>`});
h+='</div>';
if(u.pick>=0){const ok=u.pick===c.answer;
h+=`<div class="card"><p><b>${ok?'Correct.':'Not quite. Best answer: '+OPTS[c.answer]+'.'}</b></p><p>${esc(c.explain)}</p>${gain(u.g)}
<details open><summary>How to verify</summary><ol>${T.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol></details>
<div class="row">${ok?'':'<button class="btn alt" data-a="truth-retry">Try again</button>'}${nextBtn('truth-next',u.i===n-1,'Next claim')}</div></div>`}
return h}
function truthOn(a,d){const u=tr(),c=D.truth.claims[u.i];
if(a==='truth-pick'){u.pick=+d.k;u.g=u.pick===c.answer?Score.award('truth:'+c.id,20):0;att('truth',c.id,D.truth.claims.length)}
else if(a==='truth-retry'){u.pick=-1;u.g=0}
else if(a==='truth-next'){if(u.i===D.truth.claims.length-1){ui.truth=null;location.hash='#/dash';return}ui.truth={i:u.i+1,pick:-1,g:0}}
R()}

/* SAFETY CHALLENGE */
const qs=()=>ui.quiz||(ui.quiz={fb:null});
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const Q=id=>D.quiz.questions.find(x=>x.id===id);
function quizStats(){const q=ans().quiz;if(!q||Object.keys(q.picks).length<q.order.length)return null;
const by={};let score=0;q.order.forEach(id=>{const x=Q(id),ok=q.picks[id]===x.a;if(ok)score++;const t=by[x.topic]=by[x.topic]||{c:0,n:0};t.n++;if(ok)t.c++});return{score,total:q.order.length,by}}
function quizR(){const u=qs(),q=ans().quiz,n=D.quiz.questions.length;
if(!q)return `<h2>The Safety Challenge</h2><div class="card"><p>Ten multiple-choice questions on phishing, passwords, footprints, misinformation and responsible tech use. You get instant feedback and 20 XP per correct answer.</p><button class="btn" data-a="quiz-start">Start the challenge</button></div>`;
const k=Object.keys(q.picks).length,id=u.fb||(k<q.order.length?q.order[k]:null);
if(!id){const st=quizStats(),p=Math.round(st.score/st.total*100);
return `<h2>Challenge complete</h2><div class="card center"><div class="big">${st.score}/${st.total}</div><b>${Score.level(p)}</b><p>${Score.msg(p)}</p></div><h3>Review your answers</h3>${q.order.map((i,ix)=>{const x=Q(i),pk=q.picks[i],ok=pk===x.a;return `<div class="card"><p>${mark(ok)} <b>${ix+1}. ${esc(x.q)}</b></p><p>Your answer: ${esc(x.o[pk])}</p>${ok?'':`<p>Correct answer: ${esc(x.o[x.a])}</p>`}<p class="muted">${esc(x.e)}</p></div>`}).join('')}
<div class="row"><button class="btn alt" data-a="quiz-retake">Retake (no extra XP for answers already earned)</button><button class="btn" onclick="location.hash='#/report'">View my report</button></div>`}
const x=Q(id),pk=q.picks[id],idx=q.order.indexOf(id);
let h=`<h2>The Safety Challenge <small>${idx+1} of ${n}</small></h2><div class="card"><p><b>${esc(x.q)}</b></p></div><div class="list">`;
x.o.forEach((o,j)=>{const c=pk===undefined?'':(j===x.a?'ok':j===pk?'bad':'');h+=`<button class="opt ${c}" data-a="quiz-pick" data-k="${j}" ${pk!==undefined?'disabled':''}>${esc(o)}</button>`});
h+='</div>';
if(pk!==undefined)h+=`<div class="card"><p><b>${pk===x.a?'Correct! +20 XP (first time)':'Not quite.'}</b></p><p>${esc(x.e)}</p><button class="btn" data-a="quiz-next">${idx===n-1?'See my score':'Next question'}</button></div>`;
return h}
function quizOn(a,d){const u=qs();
if(a==='quiz-start'){ans().quiz={order:shuffle(D.quiz.questions.map(x=>x.id)),picks:{}};Store.save()}
else if(a==='quiz-pick'&&!u.fb){const q=ans().quiz,id=q.order[Object.keys(q.picks).length],x=Q(id);q.picks[id]=+d.k;if(+d.k===x.a)Score.award('quiz:'+id,20);u.fb=id;Store.save();if(Object.keys(q.picks).length===q.order.length)Score.complete('quiz')}
else if(a==='quiz-next')u.fb=null;
else if(a==='quiz-retake'){ans().quiz=null;ui.quiz={fb:null};Store.save()}
R()}

const view={scam:scamR,foot:footR,truth:truthR,quiz:quizR},on={scam:scamOn,foot:footOn,truth:truthOn,quiz:quizOn};
return{D,render:k=>view[k](),on:(a,d)=>on[a.split('-')[0]](a,d),quizStats,resetUI(){for(const k in ui)delete ui[k]},
async load(){const g=async f=>(await fetch('data/'+f)).json();[D.scam,D.foot,D.truth,D.quiz]=await Promise.all([g('phishing.json'),g('footprint.json'),g('misinformation.json'),g('assessment.json')])}};
})();
