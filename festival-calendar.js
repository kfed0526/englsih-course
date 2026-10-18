import lunarYearData from './lunar-year-data.js?v=20261018.v13';
const dateCache=new Map();
export function taipeiToday(now=new Date()){
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
 const get=k=>parts.find(p=>p.type===k).value;
 return `${get('year')}-${get('month')}-${get('day')}`;
}
export function lunarDates(year){
 if(!Number.isInteger(year)||year<1901||year>2100)throw RangeError('年份範圍為 1901–2100');
 if(dateCache.has(year))return dateCache.get(year);
 // Civil-date arithmetic in UTC avoids host timezone/DST and ICU Chinese Calendar differences.
 const monthDays=(bits,month)=>(bits&(0x10000>>month))?30:29;
 const leapDays=bits=>(bits&15)?(bits&0x10000?30:29):0;
 const yearDays=bits=>Array.from({length:12},(_,i)=>monthDays(bits,i+1)).reduce((a,b)=>a+b,0)+leapDays(bits);
 let newYearOffset=0;for(let y=1900;y<year;y++)newYearOffset+=yearDays(lunarYearData[y-1900]);
 const bits=lunarYearData[year-1900],leap=bits&15,result={};
 for(const [month,day]of [[1,1],[5,5],[8,15]]){
  let offset=newYearOffset+day-1;
  for(let m=1;m<month;m++){offset+=monthDays(bits,m);if(m===leap)offset+=leapDays(bits);}
  // No leap-month flag: select the regular month, before a leap month of the same number.
  result[`${month}/${day}`]=new Date(Date.UTC(1900,0,31)+offset*86400000).toISOString().slice(0,10);
 }
 dateCache.set(year,Object.freeze(result));return dateCache.get(year);
}
export function festivalEvents(catalog,year){
 const lunar=lunarDates(year);
 return catalog.events.map(e=>({...e,date:e.rule.calendar==='lunar'?lunar[`${e.rule.month}/${e.rule.day}`]||null:`${year}-${String(e.rule.month).padStart(2,'0')}-${String(e.rule.day).padStart(2,'0')}`})).sort((a,b)=>(a.date||'9999').localeCompare(b.date||'9999'));
}
export const festivalDate=date=>date?`${Number(date.slice(5,7))} 月 ${Number(date.slice(8,10))} 日`:'日期待確認';
const symbols={'new-year':'🏮',birthday:'🎂','dragon-boat':'🚣','mid-autumn':'🌕',fireworks:'🎆',skeleton:'🎃',christmas:'🎄'};
export function festivalCalendarHTML(catalog,year,records={},today=taipeiToday()){
 const events=festivalEvents(catalog,year),next=events.find(e=>e.date&&e.date>=today);
 return `<section class="festival-calendar"><p class="eyebrow">A YEAR OF LITTLE CELEBRATIONS</p><h1>慶典廣場</h1><p>陪 Nickson 過節、慶生，留下我們的快樂回憶。</p><div class="festival-banner"><div><span class="badge">${next?'下一個慶典':'這一年的慶典簿'}</span><h2>${next?next.name:'每一天，都值得開心'}</h2><p>${next?festivalDate(next.date)+' · '+next.title:'所有節日全年都能玩，不用等到當天。'}</p>${next?`<button class="primary" data-festival-open="${next.id}">一起玩 →</button>`:''}</div></div><nav class="festival-year" aria-label="慶典年份"><button data-festival-year="${year-1}" ${year<=1901?'disabled':''} aria-label="前一年">←</button><strong>${year} 年</strong><button data-festival-year="${year+1}" ${year>=2100?'disabled':''} aria-label="後一年">→</button><button data-festival-year="${Number(today.slice(0,4))}">回到今年</button></nav><p class="muted">標示節日本日，全年都可以玩。農曆節日會隨年份更新。</p><div class="festival-events">${events.map(e=>`<article class="festival-event ${e.id===next?.id?'upcoming':''}" style="--festival-color:${e.color}"><time datetime="${e.date||''}">${festivalDate(e.date)}</time><span class="festival-symbol" aria-hidden="true">${symbols[e.game]}</span><h2>${e.name}</h2><small>${e.dateLabel}</small><p>${e.description}</p>${records[`${year}/${e.id}`]?'<span class="badge">✓ 已完成，還可以再玩</span>':''}<button data-festival-open="${e.id}">${e.title} →</button></article>`).join('')}</div><details class="festival-date-note"><summary>節日日期怎麼來的？</summary><p>${catalog.dateNote} 農曆依專案內保存的農曆年資料逐年換算，支援 1901–2100 年，並與官方日曆核對。</p><a href="${catalog.dateSource}" target="_blank" rel="noopener">政府 2026 年辦公日曆（核對來源）</a><p>生日依家長提供的月日；這裡是課外慶典遊戲，不加入英文或日文題庫。</p></details></section>`;
}
