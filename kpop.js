// Extracurricular music room. Official visible YouTube embed; no audio extraction.
export const QUEENCARD={id:'queencard',videoId:'7HDeem-JaSY',title:'Queencard',artist:'(G)I-DLE',url:'https://www.youtube.com/watch?v=7HDeem-JaSY'};
export function kpopLibraryHTML(){return `<section class="kpop-library"><div class="kpop-welcome"><div><p class="eyebrow">SEOUL · LITTLE DANCE STUDIO</p><h1>韓國 K-pop 舞蹈教室</h1><p>今天，跟 Nickson 一起當小小舞者！<br>選一首歌，伸伸手、踏踏步，開心跳就好。</p><span class="badge">自由律動 · 不計分</span></div><img src="assets/characters/nickson-celebrate-watercolor.png" alt="Nickson 舉起雙手，邀請你跳舞"/></div><div class="kpop-songs"><button class="kpop-song" data-kpop="queencard" aria-label="開啟 (G)I-DLE 的 Queencard 舞蹈教室"><span class="kpop-thumbnail"><span class="thumbnail-fallback" aria-hidden="true">QUEENCARD</span><img src="https://i.ytimg.com/vi/${QUEENCARD.videoId}/hqdefault.jpg" alt="Queencard 官方音樂影片縮圖" loading="lazy"/><span class="song-play" aria-hidden="true">▶</span><span class="song-source">YouTube 官方 MV</span></span><span class="song-details"><small>01 · TODAY'S MUSIC</small><strong>Queencard</strong><span>(G)I-DLE</span><span class="song-enter">一起跳舞 →</span></span></button><div class="kpop-next"><span aria-hidden="true">♫</span><h2>下一首，留給新的靈感</h2><p>慢慢收藏喜歡的音樂，<br>每次一起跳一點點。</p></div></div><p class="kpop-parent-note">點歌曲後載入 YouTube 影片；可能有廣告或外部推薦，請家長陪同。先留一點活動空間喔！</p></section>`;}
export function kpopRoomHTML(){return `<section class="kpop-room"><div class="kpop-room-heading"><div><p class="eyebrow">K-POP DANCE TIME · 韓國</p><h1>Queencard <small>(G)I-DLE</small></h1></div><span class="badge">跟 Nickson 一起跳</span></div><div class="kpop-room-grid"><section class="kpop-video-panel" aria-label="官方 YouTube 音樂影片"><div class="youtube-frame"><div id="queencard-player"><p>正在準備官方影片…</p></div></div><p class="video-caption">YouTube 官方 MV · 用影片上的 ▶ 開始播放</p><p id="kpop-video-status" role="status">影片載入中。也可以先預覽 Nickson 的動作。</p><a href="${QUEENCARD.url}" target="_blank" rel="noopener noreferrer">到 YouTube 看官方影片 ↗</a></section><section class="nickson-dance-panel" aria-label="Nickson 自由律動動畫"><div class="dance-studio" data-pose="sway"><div class="studio-window" aria-hidden="true"></div><span class="studio-sign">NICKSON'S STUDIO</span><span class="studio-note note-one" aria-hidden="true">♪</span><span class="studio-note note-two" aria-hidden="true">♫</span><div class="studio-floor" aria-hidden="true"></div><div class="nickson-dancer"><img src="assets/characters/nickson-celebrate-watercolor.png" alt="舉手跳舞的 Nickson" draggable="false"/></div><span class="studio-mat" aria-hidden="true"></span></div><p id="kpop-dance-status" role="status">準備好了！播放影片，Nickson 就會跟著動。</p><div class="dance-poses" role="group" aria-label="選擇 Nickson 的舞蹈動作"><button data-kpop-pose="sway" aria-pressed="true">左右搖</button><button data-kpop-pose="bounce" aria-pressed="false">跳一跳</button><button data-kpop-pose="turn" aria-pressed="false">轉一轉</button></div><button class="dance-preview" data-kpop="preview" aria-pressed="false">▶ 預覽 Nickson 動作</button></section></div><p class="kpop-footnote">這是 Nickson 的自由律動動畫，不是原曲舞蹈教學。暫停影片會停下動作；離開教室會關閉影片。請家長陪同觀看。</p></section>`;}

let youtubeAPI;
export function loadYouTubeAPI(win=window,doc=document){
 if(win.YT?.Player)return Promise.resolve(win.YT);
 if(youtubeAPI)return youtubeAPI;
 youtubeAPI=new Promise((resolve,reject)=>{
  const script=doc.createElement('script'),previous=win.onYouTubeIframeAPIReady;
  const timer=win.setTimeout(()=>fail(),20000);
  function fail(){win.clearTimeout(timer);script.remove();youtubeAPI=null;reject(Error('YouTube unavailable'));}
  win.onYouTubeIframeAPIReady=()=>{win.clearTimeout(timer);previous?.();resolve(win.YT);};
  script.src='https://www.youtube.com/iframe_api';script.onerror=fail;doc.head.append(script);
 });
 return youtubeAPI;
}

export class KpopSession{
 constructor({root,load=loadYouTubeAPI,origin=window.location.origin,hidden=()=>document.hidden,Observer=globalThis.IntersectionObserver}){Object.assign(this,{root,load,origin,hidden,Observer});this.dead=false;this.playing=false;this.preview=false;this.pose='sway';this.inView=true;}
 async mount(){
  try{
   const YT=await this.load();if(this.dead)return;
   if(this.Observer){this.observer=new this.Observer(entries=>{this.inView=entries[0].isIntersecting&&entries[0].intersectionRatio>=.5;if(!this.inView)this.pause();},{threshold:[0,.5]});this.observer.observe(this.root.querySelector('.youtube-frame'));}
   this.player=new YT.Player(this.root.querySelector('#queencard-player'),{width:'100%',height:'100%',videoId:QUEENCARD.videoId,playerVars:{playsinline:1,controls:1,autoplay:0,rel:0,origin:this.origin},events:{
    onReady:()=>{if(this.dead)return;this.text('#kpop-video-status','影片準備好了，點影片上的 ▶ 開始。');},
    onStateChange:e=>{if(this.dead)return;this.preview=false;this.playing=e.data===1;if((this.hidden()||!this.inView)&&this.playing){this.pause();return;}this.update();this.text('#kpop-video-status',({1:'影片播放中 · 一起開心跳！',2:'影片已暫停。',0:'這首歌跳完囉！可以重播，或回去選歌曲。',3:'影片緩衝中，稍等一下。',5:'點影片上的 ▶ 開始播放。'})[e.data]||'點影片上的 ▶ 開始播放。');},
    onError:()=>this.fail(),onAutoplayBlocked:()=>this.text('#kpop-video-status','請直接點影片上的 ▶ 播放。')
   }});
  }catch{if(!this.dead)this.fail();}
 }
 text(selector,value){const el=this.root.querySelector(selector);if(el)el.textContent=value;}
 update(){
  if(this.dead)return;const dancing=this.playing||this.preview;
  this.root.querySelector('.dance-studio')?.classList.toggle('is-dancing',dancing);
  const button=this.root.querySelector('[data-kpop="preview"]');if(button){button.setAttribute('aria-pressed',String(this.preview));button.textContent=this.preview?'■ 停止動作預覽':'▶ 預覽 Nickson 動作';button.disabled=this.playing;}
  this.text('#kpop-dance-status',this.playing?'跟著音樂，'+({sway:'左右搖一搖！',bounce:'輕輕跳一跳！',turn:'轉一轉身體！'})[this.pose]:this.preview?'動作預覽中（不播放音樂）':'Nickson 休息中。播放影片，或按動作預覽。');
 }
 setPose(pose){if(!['sway','bounce','turn'].includes(pose)||this.dead)return;this.pose=pose;this.root.querySelector('.dance-studio').dataset.pose=pose;this.root.querySelectorAll('[data-kpop-pose]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.kpopPose===pose)));this.update();}
 togglePreview(){if(this.dead||this.playing)return;this.preview=!this.preview;this.update();}
 pause(){this.playing=false;this.preview=false;this.player?.pauseVideo?.();this.update();if(!this.dead)this.text('#kpop-video-status','影片已暫停；回到播放器後，點 ▶ 繼續。');}
 fail(){if(this.dead)return;this.playing=false;this.preview=false;this.update();this.text('.youtube-frame>div','官方影片暫時無法載入');this.text('#kpop-video-status','YouTube 暫時無法在這裡播放。可點下方連結觀看官方影片，或先預覽 Nickson 動作。');}
 destroy(){this.dead=true;this.preview=false;this.playing=false;this.observer?.disconnect();this.player?.destroy?.();this.player=null;}
}
