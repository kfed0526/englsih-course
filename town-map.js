export const TOWN_ASSET='assets/life-town-watercolor.webp';
export const TOWN_PLACES=[
 {id:'town-hospital',name:'醫院',icon:'🏥',x:26,y:27,artY:0,note:'一起認識看診的地方',children:[
  {id:'town-hospital-dental',name:'牙科',icon:'🦷',note:'認識牙齒、刷牙與看牙的流程'},
  {id:'town-hospital-ent',name:'耳鼻喉科',icon:'👂',note:'認識耳朵、鼻子、喉嚨與看診的流程'}]},
 {id:'town-department',name:'百貨',icon:'🏬',x:74,y:27,artY:0,note:'逛逛今天的生活商店',children:[
  {id:'town-department-market',name:'超市',icon:'🛒',note:'找商品、裝進購物籃，再一起結帳'},
  {id:'town-department-bakery',name:'麵包店',icon:'🥐',note:'認識麵包，準備揉麵團與烘烤的小故事'}]},
 {id:'town-salon',name:'理髮店',icon:'💈',x:26,y:54,artY:50,note:'梳梳頭，看看鏡子裡的新髮型'},
 {id:'town-amusement',name:'兒童樂園',icon:'🎡',x:74,y:54,artY:50,note:'摩天輪、旋轉木馬與小火車等你來探索'},
 {id:'town-fire',name:'消防局',icon:'🚒',x:26,y:80,artY:85,note:'認識消防車與幫助大家的消防員'},
 {id:'town-police',name:'警察局',icon:'🚓',x:74,y:80,artY:85,note:'和拉布拉多警犬找失物、陪迷路小兔、練習安全過馬路'}
];

export function mapNavigationHTML(area,schoolOnly=false){return `<nav class="map-navigation" aria-label="選擇冒險地圖">${area==='home'?'<span aria-current="page">01 · 我們的社區</span>':'<button data-go="home">← 01 · 我們的社區</button>'}${area==='town'?'<span aria-current="page">02 · 生活小鎮</span>':`<button data-go="town" ${schoolOnly?'disabled':''}>02 · 生活小鎮 →</button>`}</nav>`;}

export function townMapHTML(){return `<section class="adventure-home town-home"><div class="map-title"><div><p class="eyebrow">NICKSON'S LITTLE WORLD · MAP 02</p><h1>走進生活小鎮</h1><p>沿著小路走走，點一個地方進去看看吧！</p></div><img class="map-nickson" src="assets/characters/nickson-panda-home.png" alt="Nickson 陪你探索生活小鎮"/></div>${mapNavigationHTML('town')}<div class="neighborhood town-neighborhood"><img class="neighborhood-painting" src="${TOWN_ASSET}" width="1254" height="1254" alt="生活小鎮：上方的醫院與百貨，中段的理髮店與兒童樂園，下方的消防局與警察局；中央步道和小橋通往原來的社區" draggable="false"/>${TOWN_PLACES.map(place=>`<button class="destination available town-destination" data-destination="${place.id}" style="--x:${place.x}%;--y:${place.y}%" aria-label="${place.name}，${place.note}"><span class="destination-icon" aria-hidden="true">${place.icon}</span><strong>${place.name}</strong></button>`).join('')}</div><div class="map-connection"><span aria-hidden="true">🌿</span><p>過了小橋，就是熟悉的家與學校。</p><button data-go="home">← 沿著小路回我們的社區</button></div></section>`;}

export function townPlaceHTML(id){
 const place=TOWN_PLACES.find(place=>place.id===id||place.children?.some(child=>child.id===id));
 if(!place)return townMapHTML();
 const child=place.children?.find(child=>child.id===id),current=child||place;
 return `<section class="town-place"><p class="eyebrow">生活小鎮 · ${child?place.name:'一起探索'}</p><h1><span aria-hidden="true">${current.icon}</span> ${current.name}</h1><p class="town-place-note">${current.note}</p><div class="town-place-picture" role="img" aria-label="手繪生活小鎮裡的${place.name}" style="--town-art-x:${place.x<50?0:100}%;--town-art-y:${place.artY}%"></div>${place.children&&!child?`<h2>${place.id==='town-hospital'?'今天想認識哪一科？':'今天想逛哪一家？'}</h2><div class="town-choices">${place.children.map(item=>`<button data-destination="${item.id}"><span aria-hidden="true">${item.icon}</span><strong>${item.name}</strong><small>${item.note}</small><span class="town-choice-link">進去看看 →</span></button>`).join('')}</div>`:`<div class="town-preparing" role="status"><span aria-hidden="true">🌱</span><h2>這裡的小故事正在準備</h2><p>今天先認識這個地方，下次再和 Nickson 一起玩。</p></div>`}<div class="town-return">${child?`<button data-destination="${place.id}">← 回${place.name}${place.id==='town-hospital'?'選科別':'選店舖'}</button>`:''}<button data-go="town">← 回生活小鎮</button></div></section>`;
}
