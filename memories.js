const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function parkMemoriesHTML(album,index=0){
 const photos=Array.isArray(album?.photos)?album.photos:[];
 if(!photos.length)return '<section class="memories-page"><h1>我的回憶</h1><p>照片暫時無法載入，請稍後重新整理。</p></section>';
 const i=Math.max(0,Math.min(photos.length-1,Number.isInteger(index)?index:0)),photo=photos[i];
 return `<section class="memories-page"><div class="memory-heading"><p class="eyebrow">MY LITTLE MEMORIES · 公園相簿</p><h1>我的回憶</h1></div><div class="memory-layout"><figure class="memory-photo"><img src="${escape(photo.src)}" alt="${escape(photo.alt)}" draggable="false"/></figure><div class="memory-story"><span class="badge" role="status">第 ${i+1} 張，共 ${photos.length} 張</span><h2>${escape(photo.title)}</h2><p>${escape(photo.caption)}</p><div class="memory-controls"><button data-memory-step="-1" ${i===0?'disabled':''}>← 上一張</button><button data-memory-step="1" ${i===photos.length-1?'disabled':''}>下一張 →</button></div><p class="memory-note">把公園裡的開心時刻，收進小相簿。</p></div></div></section>`;
}
