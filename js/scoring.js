const Score=(()=>{
const MAX={scam:150,foot:100,truth:100,quiz:200},ACTS=['scam','foot','truth','quiz'],BONUS=50,TOTAL=600;
const S=()=>Store.get();
// Each award id is paid once only, so retries cannot farm XP.
function award(id,pts){const a=S().awards;if(a[id]!==undefined)return 0;a[id]=pts;Store.save();return pts}
const actXP=act=>Object.entries(S().awards).filter(([k])=>k.startsWith(act+':')).reduce((t,[,v])=>t+v,0);
const done=a=>!!S().done[a];
const allDone=()=>ACTS.every(done);
function complete(a){S().done[a]=true;if(allDone())award('bonus',BONUS);Store.save()}
const total=()=>Object.values(S().awards).reduce((t,v)=>t+v,0);
const level=p=>p>=80?'Cyber Safety Champion':p>=60?'Digital Safety Defender':p>=40?'Safety Explorer':'Digital Safety Beginner';
const msg=p=>p>=80?'Outstanding. You think like a defender.':p>=60?'Strong work. A few habits to sharpen.':p>=40?'Good start. Keep exploring and try the activities again.':'Every expert starts here. Revisit the activities and try again.';
return{MAX,ACTS,BONUS,TOTAL,award,actXP,done,allDone,complete,total,level,msg};
})();
