export const STORE_ROOMS={market:{name:'超市',icon:'🛒',asset:'assets/department-market-watercolor.webp'},bakery:{name:'麵包店',icon:'🥐',asset:'assets/department-bakery-watercolor.webp'}};
export const STORE_STEPS={market:['找商品','掃描商品','玩具幣付款','帶回家'],bakery:['揉麵團','選造型','請店員烘烤','裝進袋子','完成']};
export const KNEAD_COUNT=6;
export const BAKE_MILLISECONDS=1800;
export function departmentCatalog(catalog){
 const words=catalog.find(book=>book.id==='japanese-school')?.units.find(unit=>unit.id==='topic-food')?.words||[];
 const shapeWords=catalog.find(book=>book.id==='my-school')?.units.find(unit=>unit.id==='week-1')?.words||[];
 return {goods:['rice','vegetables','meat','fish'].map(id=>words.find(word=>word.id===id)).filter(Boolean).map(({id,zh})=>({id,zh})),shapes:['circle','triangle','star'].map(id=>shapeWords.find(word=>word.id===id)).filter(Boolean).map(({id,zh})=>({id,zh}))};
}
const marketVisit=()=>({step:0,collected:new Set(),scanned:new Set(),coins:new Set()});
const bakeryVisit=()=>({step:0,kneads:0,shape:'',bake:'ready',packed:new Set()});
// Only this browser-page visit is retained. Never writes school, review or payment records.
export class DepartmentVisit{
 constructor({goods=[],shapes=[]}={}){this.goods=goods;this.shapes=shapes;this.list=['rice','vegetables','fish'].map(id=>goods.find(item=>item.id===id)).filter(Boolean);this.room='lobby';this.paused=false;this.market=marketVisit();this.bakery=bakeryVisit();this.stamps=new Set();}
 get current(){return this.room==='market'?this.market:this.room==='bakery'?this.bakery:null;}
 get target(){return this.list.find(item=>!this.market.collected.has(item.id));}
 get marketReady(){return this.list.length===3;}
 selectRoom(room){if(room!=='lobby'&&!Object.hasOwn(STORE_ROOMS,room))return false;this.cancelBake();this.room=room;this.paused=false;return true;}
 reset(){if(!this.current||this.paused)return false;this.cancelBake();this[this.room]=this.room==='market'?marketVisit():bakeryVisit();return true;}
 collect(id){const v=this.market;if(this.paused||this.room!=='market'||v.step!==0||!this.marketReady||!this.list.some(item=>item.id===id)||v.collected.has(id))return false;v.collected.add(id);return true;}
 scan(id){const v=this.market;if(this.paused||this.room!=='market'||v.step!==1||!v.collected.has(id)||v.scanned.has(id))return false;v.scanned.add(id);return true;}
 pay(id){const v=this.market;if(this.paused||this.room!=='market'||v.step!==2||!['0','1','2'].includes(id)||v.coins.has(id))return false;v.coins.add(id);return true;}
 knead(){const v=this.bakery;if(this.paused||this.room!=='bakery'||v.step!==0||v.kneads>=KNEAD_COUNT)return false;v.kneads++;return true;}
 chooseShape(id){const v=this.bakery;if(this.paused||this.room!=='bakery'||v.step!==1||!this.shapes.some(shape=>shape.id===id)||v.shape===id)return false;v.shape=id;return true;}
 startBake(){const v=this.bakery;if(this.paused||this.room!=='bakery'||v.step!==2||v.bake!=='ready'||!v.shape)return false;v.bake='baking';return true;}
 finishBake(shape){const v=this.bakery;if(this.paused||this.room!=='bakery'||v.step!==2||v.bake!=='baking'||v.shape!==shape)return false;v.bake='cooled';return true;}
 cancelBake(){if(this.bakery.bake==='baking')this.bakery.bake='ready';}
 pack(id){const v=this.bakery;if(this.paused||this.room!=='bakery'||v.step!==3||v.bake!=='cooled'||!['0','1','2'].includes(id)||v.packed.has(id))return false;v.packed.add(id);return true;}
 get canNext(){const v=this.current;if(this.paused||!v)return false;if(this.room==='market')return [this.marketReady&&v.collected.size===3,v.scanned.size===3,v.coins.size===3,false][v.step]||false;return [v.kneads===KNEAD_COUNT,Boolean(v.shape),v.bake==='cooled',v.packed.size===3,false][v.step]||false;}
 next(){if(!this.canNext)return false;this.current.step++;if(this.current.step===STORE_STEPS[this.room].length-1)this.stamps.add(this.room);return true;}
}
