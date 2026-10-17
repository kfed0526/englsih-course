// Generated watercolor cutouts, separate from lesson content and game state.
export const CHARACTERS={
 guide:{src:'assets/characters/nickson-guide-watercolor.png',label:'英文小冒險的男孩主角'},
 girl:{src:'assets/characters/school-girl-watercolor.png',label:'穿陶粉色洋裝、背書包的水彩小女孩'},
 teacher:{src:'assets/characters/teacher-watercolor.png',label:'拿著繪本、站在黑板旁的老師'},
 friend:{src:'assets/characters/friends-watercolor.png',label:'手牽手、微笑站在一起的兩位小朋友'},
 'bus driver':{src:'assets/characters/bus-driver-watercolor.png',label:'戴司機帽、拿方向盤的校車司機'},
 cook:{src:'assets/characters/cook-watercolor.png',label:'戴廚師帽、拿湯匙與鍋子的廚師'}
};
export const COMPANION_POSES={celebrate:{src:'assets/characters/nickson-celebrate-watercolor.png',label:'開心舉手慶祝的男孩主角'}};
export const CHARACTER_ASSETS=[...Object.values(CHARACTERS),...Object.values(COMPANION_POSES)].map(person=>person.src);
export function characterImage(id,{decorative=false}={}){
 const person=CHARACTERS[id];if(!person)throw Error('Unknown character: '+id);
 return `<img class="character-art" src="${person.src}" alt="${decorative?'':person.label}" ${decorative?'aria-hidden="true"':''} draggable="false" decoding="async"/>`;
}
export function companion(mode='wave',id='guide'){
 const person=CHARACTERS[id];if(!person)throw Error('Unknown companion: '+id);
 const pictures=id==='guide'?`<img class="character-art companion-normal" src="${person.src}" alt="" aria-hidden="true" draggable="false"/><img class="character-art companion-celebrate" src="${COMPANION_POSES.celebrate.src}" alt="" aria-hidden="true" draggable="false"/>`:characterImage(id,{decorative:true});
 return `<div class="mascot ${mode}" role="img" aria-label="${person.label}"><div class="human-figure body">${pictures}</div></div>`;
}
