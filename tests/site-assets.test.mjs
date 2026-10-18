import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';

test('home screen manifest and PNG icons resolve under both localhost and GitHub Pages',()=>{
 const manifest=JSON.parse(fs.readFileSync('site.webmanifest','utf8'));
 for(const base of ['http://localhost:4173/','https://kfed0526.github.io/panda-school/']){
  assert.equal(new URL(manifest.start_url,base).href,base);assert.equal(new URL(manifest.scope,base).href,base);
  for(const icon of manifest.icons)assert.ok(new URL(icon.src,base).href.startsWith(base+'assets/icons/'));
 }
 for(const size of [32,180,192,512]){const png=fs.readFileSync(`assets/icons/panda-${size}.png`);assert.equal(png.toString('ascii',1,4),'PNG');assert.equal(png.readUInt32BE(16),size);assert.equal(png.readUInt32BE(20),size);}
 assert.ok(manifest.icons.some(i=>i.purpose==='maskable'&&fs.existsSync(i.src)));
 const html=fs.readFileSync('index.html','utf8');assert.match(html,/rel="apple-touch-icon"[^>]+panda-180\.png/);assert.match(html,/rel="manifest"[^>]+site\.webmanifest/);assert.match(html,/rel="icon"[^>]+panda\.svg/);
});
test('all twelve Japanese clips are audibly louder with limited peaks and canonical references',()=>{
 const report=JSON.parse(fs.readFileSync('assets/audio/japanese/normalization.json','utf8'));
 const book=JSON.parse(fs.readFileSync('content/japanese-school.json','utf8'));
 assert.equal(report.clips.length,12);
 for(const unit of book.units)for(const word of unit.words){
  const clip=report.clips.find(c=>c.word===word.id);assert.equal(word.audio,clip.output);assert.equal(unit.audio[word.kana],clip.output);assert.ok(clip.after.mean_volume-clip.before.mean_volume>=3);assert.ok(clip.after.max_volume<=-.5);
  assert.equal(createHash('sha256').update(fs.readFileSync(clip.output)).digest('hex'),clip.sha256);assert.ok(fs.existsSync(clip.source));
 }
});
