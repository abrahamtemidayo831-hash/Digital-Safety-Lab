const CACHE='dsl-futa-v1';
const FILES=['./','./index.html','./manifest.json','./css/style.css','./js/storage.js','./js/scoring.js','./js/challenges.js','./js/app.js','./data/phishing.json','./data/footprint.json','./data/misinformation.json','./data/assessment.json','./assets/icons/icon-192.png','./assets/icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n.startsWith('dsl-')&&n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>hit||fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp))}return res}).catch(()=>r.mode==='navigate'?caches.match('./index.html'):new Response('Offline',{status:503}))))});
