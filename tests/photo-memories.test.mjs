import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {inflateSync} from 'node:zlib';import {memoryAlbum,memoryTabs,parkMemoriesHTML} from '../memories.js';
const library=JSON.parse(fs.readFileSync('content/scene-memories.json','utf8')),park=JSON.parse(fs.readFileSync('content/park-memories.json','utf8'));
function rgba(file){
 const png=fs.readFileSync(file);
 assert.equal(png.toString('hex',0,8),'89504e470d0a1a0a');
 assert.equal(png[24],8);assert.equal(png[25],6);
 const width=png.readUInt32BE(16),height=png.readUInt32BE(20),chunks=[];
 for(let p=8;p<png.length;){const length=png.readUInt32BE(p);if(png.toString('ascii',p+4,p+8)==='IDAT')chunks.push(png.subarray(p+8,p+8+length));p+=length+12;}
 const raw=inflateSync(Buffer.concat(chunks)),stride=width*4,pixels=Buffer.alloc(stride*height);
 for(let y=0;y<height;y++)for(let x=0;x<stride;x++){
  const i=y*stride+x,filter=raw[y*(stride+1)],a=x>=4?pixels[i-4]:0,b=y?pixels[i-stride]:0,c=y&&x>=4?pixels[i-stride-4]:0;
  let add=filter===1?a:filter===2?b:filter===3?Math.floor((a+b)/2):0;
  if(filter===4){const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);add=pa<=pb&&pa<=pc?a:pb<=pc?b:c;}
  pixels[i]=(raw[y*(stride+1)+1+x]+add)&255;
 }
 return pixels;
}

test('eleven new photographs are classified once, while the original swing remains first',()=>{const usage=JSON.parse(fs.readFileSync('assets/characters/nickson-photo-usage.json','utf8')).filter(photo=>photo.memory);assert.equal(usage.length,11);assert.equal(new Set(usage.map(p=>p.source)).size,11);let photos=[];for(const scene of ['home','school','park','family','world']){const album=memoryAlbum(library,scene,park);assert.ok(album.photos.length);photos.push(...album.photos);for(const photo of album.photos){assert.ok(fs.existsSync(photo.src));assert.ok(photo.title&&photo.caption&&photo.alt);}}assert.equal(photos.length,12);assert.equal(new Set(photos.map(p=>p.id)).size,12);assert.equal(memoryAlbum(library,'park',park).photos[0].id,'swing-01');assert.match(memoryTabs(library,'school',park),/data-memory-scene="school" aria-pressed="true"/);assert.match(parkMemoriesHTML(memoryAlbum(library,'home',park),999),/第 5 張，共 5 張/);assert.match(parkMemoriesHTML({photos:[]}),/暫時無法載入/);});
test('all three generated cutouts have transparent and solid pixels, plus portable WebP variants',()=>{for(const pose of ['jump','crouch','point']){const src=`assets/characters/nickson-${pose}-20261018.png`,pixels=rgba(src);let clear=0,solid=0;for(let i=3;i<pixels.length;i+=4){if(pixels[i]===0)clear++;if(pixels[i]>230)solid++;}assert.ok(clear>pixels.length/4*.1);assert.ok(solid>pixels.length/4*.1);const webp=fs.readFileSync(src.replace('.png','.webp'));assert.equal(webp.toString('ascii',8,12),'WEBP');}});
