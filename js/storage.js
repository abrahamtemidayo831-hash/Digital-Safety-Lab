const KEY='dsl-futa-v1';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const Store=(()=>{
const blank=()=>({awards:{},done:{},ans:{},seen:false});
let s=blank();
try{s=Object.assign(blank(),JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(s))}catch(e){}};
return{get:()=>s,save,reset(){s=blank();save()}};
})();
