const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function storySectionHTML(catalog,state){
 if(!catalog?.stories?.length)return '';
 const current=catalog.stories.find(story=>story.id===state?.id);
 return `<section class="school-story"><div class="story-heading"><span class="panda-badge" aria-hidden="true">🐼</span><div><p class="eyebrow">${escape(catalog.school)} · ${escape(catalog.className)} 班</p><h2>先聽一個小故事</h2><p>Nickson，今天和 Panda 班一起出發！</p></div></div><div class="story-choices">${catalog.stories.map(story=>`<button data-action="school-story" data-story="${escape(story.id)}" aria-pressed="${current?.id===story.id&&state?.status==='playing'}">${current?.id===story.id&&state?.status==='playing'?'↻':'🔊'} ${escape(story.title)}</button>`).join('')}</div>${current?`<div class="story-transcript"><p role="status">${state.status==='playing'?'正在聽故事…':state.status==='error'?'故事暫時無法播放，請重試。':'故事聽完了，選一本課本開始吧！'}</p><p>${escape(current.text)}</p>${state.status==='playing'?'<button data-action="stop-story">■ 停止故事</button>':''}</div>`:''}<div id="audio-status" role="alert"></div></section>`;
}
