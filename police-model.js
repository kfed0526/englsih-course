export const POLICE_MISSIONS={lost:{name:'失物小偵探',icon:'🔎'},reunion:{name:'陪小兔找家人',icon:'🐰'},traffic:{name:'安全過馬路',icon:'🚦'}};
export const CROSS_MILLISECONDS=1400;
export const BAG_CHOICES=[{id:'blue-circle',color:'blue',shape:'circle'},{id:'blue-star',color:'blue',shape:'star'},{id:'orange-star',color:'orange',shape:'star'}];
export const REUNION_CHOICES=[
 [{id:'stay',icon:'🪑',label:'在安全服務台等候'},{id:'run',icon:'🏃',label:'自己跑出去找'}],
 [{id:'follow',icon:'🍦',label:'跟不認識的人離開'},{id:'ask',icon:'👮',label:'請服務台警長幫忙'}],
 [{id:'wait',icon:'🐰👮',label:'陪警長在這裡等家人'},{id:'leave',icon:'🚪',label:'自己離開服務台'}]
];
export function policeCatalog(catalog=[]){const book=catalog.find(b=>b.id==='my-school'),words=book?.units.flatMap(u=>u.words||[])||[];return {bag:words.find(w=>w.id==='schoolbag')?.zh||'',shapes:Object.fromEntries(['circle','star'].map(id=>[id,words.find(w=>w.id===id)?.zh||'']))};}
const road=()=>({step:0,left:false,right:false,status:'ready'});
// Pretend-play only: no storage, real reporting, phone calls or official lesson scores.
export class PoliceVisit{
 constructor(catalog={bag:'',shapes:{}}){this.catalog=catalog;this.mission='lobby';this.paused=false;this.clues=new Set();this.bag='';this.lostDone=false;this.reunionStep=0;this.traffic=road();this.stamps=new Set();}
 get lostReady(){return Boolean(this.catalog.bag&&this.catalog.shapes.star&&this.catalog.shapes.circle);}
 get complete(){return this.stamps.size===Object.keys(POLICE_MISSIONS).length;}
 get done(){return this.mission==='lost'?this.lostDone:this.mission==='reunion'?this.reunionStep===3:this.mission==='traffic'?this.traffic.status==='done':false;}
 selectMission(id){if(this.paused||id!=='lobby'&&!Object.hasOwn(POLICE_MISSIONS,id))return false;this.cancelCross();this.mission=id;return true;}
 reset(){if(this.paused||this.mission==='lobby')return false;this.cancelCross();if(this.mission==='lost'){this.clues.clear();this.bag='';this.lostDone=false;}if(this.mission==='reunion')this.reunionStep=0;if(this.mission==='traffic')this.traffic=road();return true;}
 findClue(id){if(this.paused||this.mission!=='lost'||this.bag||!this.lostReady||!['color','shape'].includes(id)||this.clues.has(id))return false;this.clues.add(id);return true;}
 chooseBag(id){if(this.paused||this.mission!=='lost'||!this.lostReady||this.clues.size!==2||this.bag||id!=='blue-star')return false;this.bag=id;return true;}
 returnBag(){if(this.paused||this.mission!=='lost'||!this.bag||this.lostDone)return false;this.lostDone=true;this.stamps.add('lost');return true;}
 helpRabbit(id){if(this.paused||this.mission!=='reunion'||this.reunionStep>=3||id!==['stay','ask','wait'][this.reunionStep])return false;this.reunionStep++;if(this.reunionStep===3)this.stamps.add('reunion');return true;}
 roadAction(action){const r=this.traffic;if(this.paused||this.mission!=='traffic'||r.status!=='ready')return false;
  if(action==='wait'&&r.step===0){r.step=1;return true;}if(action==='hand'&&r.step===1){r.step=2;return true;}
  if(['left','right'].includes(action)&&r.step===2&&!r[action]){r[action]=true;if(r.left&&r.right)r.step=3;return true;}return false;
 }
 startCross(){const r=this.traffic;if(this.paused||this.mission!=='traffic'||r.step!==3||!r.left||!r.right||r.status!=='ready')return false;r.status='crossing';return true;}
 finishCross(){if(this.paused||this.mission!=='traffic'||this.traffic.status!=='crossing')return false;this.traffic.status='done';this.stamps.add('traffic');return true;}
 cancelCross(){if(this.traffic.status==='crossing')this.traffic.status='ready';}
}
