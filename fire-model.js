export const FIRE_MISSIONS={gear:{icon:'🧑‍🚒',name:'穿好裝備'},water:{icon:'💦',name:'水柱練習'},truck:{icon:'🚒',name:'消防車出發'}};
export const FIRE_GEAR=[{id:'helmet',icon:'⛑️',name:'消防帽'},{id:'coat',icon:'🧥',name:'消防衣'},{id:'boots',icon:'🥾',name:'消防靴'}];
export const FIRE_PREP=[{id:'hose',icon:'🌀',name:'收好水帶'},{id:'cabinet',icon:'🧰',name:'關器材櫃'},{id:'belt',icon:'💺',name:'繫安全帶'}];
export const FIRE_TARGETS=['left','middle','right'];
export const SPRAY_MILLISECONDS=550,DRIVE_MILLISECONDS=1800;
export class FireVisit{
 constructor(){this.mission='lobby';this.paused=false;this.gearStep=0;this.hits=[0,0,0];this.prepStep=0;this.arrived=false;this.pending=null;this.stamps=new Set();}
 get done(){return this.mission==='gear'?this.gearStep===3:this.mission==='water'?this.hits.every(n=>n===2):this.mission==='truck'?this.arrived:false;}
 get complete(){return this.stamps.size===3;}
 selectMission(id){if(this.paused||id!=='lobby'&&!Object.hasOwn(FIRE_MISSIONS,id))return false;this.cancelPending();this.mission=id;return true;}
 reset(){if(this.paused||this.mission==='lobby')return false;this.cancelPending();if(this.mission==='gear')this.gearStep=0;if(this.mission==='water')this.hits=[0,0,0];if(this.mission==='truck'){this.prepStep=0;this.arrived=false;}return true;}
 equip(id){if(this.paused||this.mission!=='gear'||this.gearStep>=3||FIRE_GEAR[this.gearStep].id!==id)return false;this.gearStep++;if(this.done)this.stamps.add('gear');return true;}
 prepare(id){if(this.paused||this.mission!=='truck'||this.pending||this.prepStep>=3||FIRE_PREP[this.prepStep].id!==id)return false;this.prepStep++;return true;}
 startShot(id){const index=FIRE_TARGETS.indexOf(id);if(this.paused||this.mission!=='water'||this.pending||index<0||this.hits[index]>=2)return false;this.pending={kind:'water',index};return true;}
 startDrive(){if(this.paused||this.mission!=='truck'||this.pending||this.prepStep!==3||this.arrived)return false;this.pending={kind:'truck'};return true;}
 finishPending(){const p=this.pending;if(this.paused||!p||p.kind!==this.mission)return false;this.pending=null;if(p.kind==='water')this.hits[p.index]++;else this.arrived=true;if(this.done)this.stamps.add(this.mission);return true;}
 cancelPending(){this.pending=null;}
}
