import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {inflateSync} from 'node:zlib';
import {CHARACTERS,COMPANION_POSES,CHARACTER_ASSETS,companion} from '../characters.js';
import {Activity} from '../activities.js';

// Read actual PNG alpha, so an opaque background cannot pass as a cutout.
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
test('all six human characters and the celebration pose have real transparent PNGs',()=>{
 assert.equal(new Set(Object.values(CHARACTERS).map(person=>person.src)).size,6);
 assert.equal(new Set(CHARACTER_ASSETS).size,7);
 for(const {src,label} of [...Object.values(CHARACTERS),...Object.values(COMPANION_POSES)]){
  assert.ok(label);const pixels=rgba(src);let clear=0,solid=0;
  for(let i=3;i<pixels.length;i+=4){if(pixels[i]===0)clear++;if(pixels[i]>200)solid++;}
  assert.ok(clear>pixels.length/4*.05,src+' needs transparent space');
  assert.ok(solid>pixels.length/4*.05,src+' needs a visible character');
 }
});
test('correct role brings the corresponding human character onto the stage once',async()=>{
 const unit=JSON.parse(fs.readFileSync('content/my-school.json','utf8')).units[2];
 for(const word of unit.words){
  let completions=0;
  const activity=new Activity({unit,count:3,speak:async()=>true,delay:async()=>true,render:()=>{},complete:()=>completions++,active:()=>true});
  activity.order=[word.id,...activity.order.filter(id=>id!==word.id)];activity.makeOptions();activity.phase='answer';activity.locked=false;
  await Promise.all([activity.choose(word.id),activity.choose(word.id)]);
  const stage=activity.render().split('class="activity-toolbar"')[0];
  assert.ok(stage.includes(CHARACTERS[word.id].src),word.id);
  assert.equal(activity.step,1);assert.equal(activity.result(word.id).attempts,1);assert.equal(completions,0);
 }
 assert.ok(companion('dance').includes(CHARACTERS.guide.src));
 assert.ok(companion('dance').includes(COMPANION_POSES.celebrate.src));
 assert.ok(!companion('dance','teacher').includes(COMPANION_POSES.celebrate.src));
});
