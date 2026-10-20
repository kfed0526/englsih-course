const formatter=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Taipei',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const BUSINESS_HOURS={open:8,close:21};
export const VENUES={
 'town-hospital':{name:'醫院',back:'town'},'town-amusement':{name:'兒童樂園',back:'town'},'town-department':{name:'百貨',back:'town'},'town-salon':{name:'理髮店',back:'town'},
 family:{name:'親子館',back:'home'},dance:{name:'舞蹈教室',back:'home'},music:{name:'音樂教室',back:'home'},kpop:{name:'韓國 K-pop 舞蹈教室',back:'world'}
};
export function taipeiClock(date=new Date()){
 const parts=formatter.formatToParts(date),hour=Number(parts.find(p=>p.type==='hour').value),minute=Number(parts.find(p=>p.type==='minute').value);
 const phase=hour<6||hour>=18?'night':hour<8?'morning':hour>=17?'sunset':'day';
 return {hour,minute,phase,night:phase==='night',label:({night:'夜晚',morning:'早晨',sunset:'黃昏',day:'白天'})[phase],time:`${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}`};
}
export function venueForDestination(id){if(Object.hasOwn(VENUES,id))return id;for(const parent of ['town-hospital','town-department'])if(id?.startsWith(parent+'-'))return parent;return '';}
export function venueForPage(page,scene,lifePlace){if(page==='department-store')return 'town-department';if(page==='hospital')return 'town-hospital';if(page==='amusement')return 'town-amusement';if(page==='scene')return venueForDestination(scene);if(page==='dance-game')return 'dance';if(page==='music-game')return 'music';if(page==='kpop'||page==='kpop-room')return 'kpop';if(page==='life-game'&&lifePlace==='market')return 'family';return '';}
export function venueOpen(id,time=taipeiClock()){return Boolean(time.allScenesOpen)||!VENUES[venueForDestination(id)]||time.hour>=BUSINESS_HOURS.open&&time.hour<BUSINESS_HOURS.close;}
export function celestialHTML(time,small=false){return `<svg class="world-celestial ${small?'small':''}" viewBox="0 0 100 100" aria-hidden="true">${time.night?'<g fill="#f2dba2"><path d="M65 14a37 37 0 1 0 21 60A33 33 0 0 1 65 14Z" stroke="#b8a071" stroke-width="2"/><path d="m79 13 3 7 8 1-6 5 2 8-7-4-6 4 1-8-6-5 8-1z"/><circle cx="91" cy="49" r="2"/><circle cx="49" cy="10" r="2"/></g>':'<g stroke="#cfaa65" stroke-width="3" stroke-linecap="round"><path d="M50 4v10m0 72v10M4 50h10m72 0h10M17 17l8 8m50 50 8 8M17 83l8-8m50-50 8-8"/><circle cx="50" cy="50" r="27" fill="#f1d58b"/><path d="M38 56q12 12 24 0" fill="none"/><circle cx="40" cy="44" r="1.5" fill="#a48054"/><circle cx="60" cy="44" r="1.5" fill="#a48054"/></g>'}</svg>`;}
export function timeBadgeHTML(time){return `<span class="world-time-badge" aria-label="台灣時間 ${time.time}，${time.label}">${celestialHTML(time,true)}<span><small>台灣 · ${time.label}</small><strong>${time.time}</strong></span></span>`;}
export function decorateWorldHTML(html,time){
 html=html.replace(/<button\b([^>]*data-destination="([^"]+)"[^>]*)>([\s\S]*?)<\/button>/g,(button,attrs,id,body)=>{
 const venue=venueForDestination(id);if(!venue)return button;const open=venueOpen(venue,time);
 if(!open)attrs=attrs.replace(/class="([^"]*)"/,(_,classes)=>`class="${classes} venue-closed"`);
 if(!open&&!attrs.includes('venue-closed'))attrs+=' class="venue-closed"';
 if(!open)attrs=attrs.replace(/aria-label="([^"]*)"/,(_,label)=>`aria-label="${label}，休息中，早上08:00再來"`);
 return `<button${attrs}>${body}<small class="venue-hours ${open?'':'venue-resting'}">${time.allScenesOpen?'自由開放':open?'08:00–21:00':'休息中 · 08:00開門'}</small></button>`;
 });
 html=html.replace(/(<div class="neighborhood[^\"]*"[^>]*>)/g,`$1<div class="world-sky-ornament">${celestialHTML(time)}</div>`);
 html=html.replace('<span class="brand">PANDA SCHOOL</span>',`<div class="world-header-meta"><span class="brand">PANDA SCHOOL</span>${timeBadgeHTML(time)}</div>`);
 html=html.replace('PANDA SCHOOL · LITTLE WORLD</span>',`PANDA SCHOOL · LITTLE WORLD</span>${timeBadgeHTML(time)}`);
 return html;
}
export function closedVenueHTML(id,time){const venue=VENUES[id]||VENUES['town-department'],open=venueOpen(id,time);return `<section class="venue-rest-page"><div class="venue-rest-art" aria-hidden="true">${celestialHTML(time)}${open?'':'<span>zzz</span>'}</div><p class="eyebrow">${open?'新的一天，準備出發':'小鎮的休息時間'}</p><h1>${escape(venue.name)}${open?'開門了':'正在休息'}</h1><p role="status">現在是台灣時間 <strong>${time.time}</strong>。<br>營業時間是每天 <strong>08:00–21:00</strong>，${open?'可以進去玩囉。':'早上08:00再來玩吧。'}</p><p class="muted">${open?'準備好了，再一起出發。':'回家放鬆一下，或翻開喜歡的課本。'}</p><div class="actions"><button data-go="${venue.back}">← ${venue.back==='town'?'回生活小鎮':venue.back==='world'?'回世界地圖':'回冒險地圖'}</button>${open?`<button class="primary" data-destination="${id}">進入${escape(venue.name)}</button>`:'<button class="primary" data-destination="school">到學校看課本</button>'}</div></section>`;}
export class WorldClock{
 constructor({now=()=>new Date(),onChange=()=>{},schedule=(fn,ms)=>setTimeout(fn,ms),cancel=id=>clearTimeout(id)}={}){Object.assign(this,{now,onChange,schedule,cancel});this.timer=null;this.running=false;this.signature='';}
 read(){return taipeiClock(this.now());}
 refresh(){const state=this.read(),signature=state.time+state.phase;if(signature!==this.signature){this.signature=signature;this.onChange(state);}return state;}
 start(){if(this.running)return;this.running=true;const tick=()=>{if(!this.running)return;this.refresh();this.timer=this.schedule(tick,60000-(this.now().getTime()%60000)+10);this.timer?.unref?.();};tick();}
 stop(){this.running=false;if(this.timer!==null)this.cancel(this.timer);this.timer=null;}
}

export function accessToggleHTML(open){return `<aside class="world-access"><button data-world-access="toggle" aria-pressed="${Boolean(open)}">${open?'🕒 恢復營業時間':'🔓 開放所有場景'}</button><span role="status">${open?'所有場景自由開放中，日夜景色照常切換。':'想在休息時間逛逛？可以暫時開放所有場景。'}</span></aside>`;}
