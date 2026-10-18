import {characterImage} from './characters.js?v=20261018.v12';
// Coordinates are percentages of the painted 1536x1024 floor plan.
export const CAMPUS_ROOMS={
 'play area':{left:5,top:5,width:37,height:34,point:[38,30]},
 classroom:{left:58,top:5,width:37,height:34,point:[62,30]},
 kitchen:{left:5,top:45,width:37,height:34,point:[38,58]},
 bathroom:{left:58,top:45,width:37,height:34,point:[62,58]},
};
export const CAMPUS_ENTRANCE=[50,83];
export function campusRoute(from,to){
 const start=CAMPUS_ROOMS[from]?.point||CAMPUS_ENTRANCE;
 const end=CAMPUS_ROOMS[to]?.point;
 if(!end)throw Error('Unknown school room');
 return {start:[...start],end:[...end],points:[[...start],[50,start[1]],[50,end[1]],[...end]]};
}
export function girlSprite(){return characterImage('girl',{decorative:true});}
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function campusHTML({unit,room,route,moving,locked,help,target,wrong}){
 const point=route?.start||CAMPUS_ROOMS[room]?.point||CAMPUS_ENTRANCE;
 const end=route?.end||point;
 return `<div class="campus ${moving?'is-walking':''}"><img class="campus-painting" src="${escape(unit.games.mapAsset)}" alt="溫暖水彩學校俯視圖：左上遊戲區、右上教室、左下廚房、右下洗手間，中央走廊相通" draggable="false"/>${unit.words.map(w=>{const r=CAMPUS_ROOMS[w.id];return `<button class="map-room answer campus-room ${room===w.id?'visited':''} ${help&&w.id===target?'hint':''} ${wrong===w.id?'wrong':''}" style="left:${r.left}%;top:${r.top}%;width:${r.width}%;height:${r.height}%" data-activity="choose" data-word="${escape(w.id)}" aria-label="${escape(w.id)}" ${locked?'disabled':''}><span class="campus-label">${escape(w.zh)}${room===w.id?' ✓':''}</span></button>`;}).join('')}<div class="campus-girl" role="img" aria-label="${moving?'小女孩正沿走廊行走':room?'小女孩在 '+room:'小女孩在學校入口'}" style="left:${point[0]}%;top:${point[1]}%;--start-x:${point[0]}%;--start-y:${point[1]}%;--end-x:${end[0]}%;--end-y:${end[1]}%">${girlSprite()}</div><span class="campus-entrance" aria-hidden="true">入口</span></div><p class="campus-legend">🌿 聽一聽，點選房間，沿著走廊一起探索</p>`;
}
