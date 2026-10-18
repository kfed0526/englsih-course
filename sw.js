// Scope-relative caching works on localhost and GitHub Pages project paths.
const VERSION=new URL(self.location.href).searchParams.get('v');
const BASE=new URL('./',self.location.href);
const PREFIX='panda-school-offline-'+encodeURIComponent(BASE.pathname)+'-';
const CACHE=PREFIX+VERSION;
const READY=new URL('__offline_ready__',BASE).href;
let downloading=null;
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
function assetURL(file){const u=new URL(file,BASE);if(/\.(js|css|json|webmanifest)$/.test(u.pathname))u.searchParams.set('v',VERSION);return u.href;}
self.addEventListener('message',event=>{const port=event.ports[0];if(!port)return;event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 if(event.data.type==='STATUS'){port.postMessage({type:'status',ready:!!await cache.match(READY),version:VERSION});return;}
 if(event.data.type==='CLEAR'){if(downloading){port.postMessage({type:'error',message:'請等待下載完成後再移除。'});return;}for(const name of (await caches.keys()).filter(n=>n.startsWith(PREFIX)))await caches.delete(name);port.postMessage({type:'cleared'});return;}
 if(event.data.type!=='DOWNLOAD')return;
 if(downloading){port.postMessage({type:'error',message:'另一個視窗正在下載，請稍後再查看。'});return;}
 downloading=true;
 try{const response=await fetch(assetURL('offline-manifest.json'),{cache:'no-store'});if(!response.ok)throw Error('manifest');const manifest=await response.json();if(manifest.version!==VERSION)throw Error('version');let done=0;await cache.delete(READY);for(const item of manifest.files){const url=assetURL(item.url);if(!await cache.match(url)){const r=await fetch(url,{cache:'reload'});if(!r.ok||r.status===206)throw Error('asset');await cache.put(url,r);}port.postMessage({type:'progress',done:++done,total:manifest.files.length,bytes:manifest.totalBytes});}await cache.put(READY,new Response(JSON.stringify({version:VERSION,total:done})));port.postMessage({type:'ready',version:VERSION,total:done});}
 catch{port.postMessage({type:'error',message:'下載未完成，請確認連線與裝置空間後重試；已下載的檔案會保留。'});}finally{downloading=null;}
})());});
async function partial(response,range){const buffer=await response.arrayBuffer(),length=buffer.byteLength,match=/^bytes=(\d*)-(\d*)$/.exec(range);if(!match||(!match[1]&&!match[2]))return new Response(null,{status:416,headers:{'Content-Range':`bytes */${length}`}});let start=match[1]?Number(match[1]):Math.max(0,length-Number(match[2])),end=match[1]?(match[2]?Math.min(length-1,Number(match[2])):length-1):length-1;if(start>=length||start>end)return new Response(null,{status:416,headers:{'Content-Range':`bytes */${length}`}});const headers=new Headers(response.headers);headers.delete('Content-Encoding');headers.set('Content-Range',`bytes ${start}-${end}/${length}`);headers.set('Content-Length',String(end-start+1));headers.set('Accept-Ranges','bytes');return new Response(buffer.slice(start,end+1),{status:206,headers});}
self.addEventListener('fetch',event=>{const request=event.request,url=new URL(request.url);if(request.method!=='GET'||url.origin!==BASE.origin||!url.pathname.startsWith(BASE.pathname))return;
 event.respondWith((async()=>{const cache=await caches.open(PREFIX+(url.searchParams.get('v')||VERSION));if(request.mode==='navigate'){try{const live=await fetch(request);if(live.ok)return live;}catch{}let saved=await cache.match(new URL('index.html',BASE).href);if(!saved)for(const name of (await caches.keys()).filter(n=>n.startsWith(PREFIX)).reverse()){const older=await caches.open(name);if(await older.match(READY)){saved=await older.match(new URL('index.html',BASE).href);if(saved)break;}}return saved||new Response('離線教材尚未下載。請連網後到家長設定下載。',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});}
 if(['localhost','127.0.0.1'].includes(BASE.hostname))try{const live=await fetch(request);if(live.ok)return live;}catch{}
 const key=new URL(request.url);key.hash='';if(!/\.(js|css|json|webmanifest)$/.test(key.pathname))key.search='';let saved=await cache.match(key.href);if(!saved&&!url.searchParams.has('v'))for(const name of (await caches.keys()).filter(n=>n.startsWith(PREFIX)).reverse()){saved=await (await caches.open(name)).match(key.href);if(saved)break;}if(saved)return request.headers.has('Range')?partial(saved,request.headers.get('Range')):saved;return fetch(request);
 })());});
