import test from 'node:test';
import assert from 'node:assert/strict';
import {nextRelease,release} from '../scripts/release.mjs';
import {mkdtempSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
test('release numbers use Taipei date and increase only within the same day',()=>{
 assert.equal(nextRelease(null,new Date('2026-10-17T15:59:59Z')).version,'20261017.v1');
 assert.equal(nextRelease({version:'20261017.v1'},new Date('2026-10-17T15:59:59Z')).version,'20261017.v2');
 assert.equal(nextRelease({version:'20261017.v9'},new Date('2026-10-17T15:59:59Z')).version,'20261017.v10');
 assert.equal(nextRelease({version:'20261017.v9'},new Date('2026-10-17T16:00:00Z')).version,'20261018.v1');
 assert.throws(()=>nextRelease({version:'20261018.v1'},new Date('2026-10-17T10:00:00Z')));
});
test('release stamps match HTML and entry asset URLs, then advance on next release',()=>{
 const root=mkdtempSync(path.join(tmpdir(),'nickson-release-'));
 try{writeFileSync(path.join(root,'index.html'),'<html lang="zh-Hant"><link href="style.css"><script src="app.js"></script></html>');
 const now=new Date('2026-10-17T10:00:00Z');assert.equal(release(root,now).version,'20261017.v1');assert.equal(release(root,now).version,'20261017.v2');
 const html=readFileSync(path.join(root,'index.html'),'utf8');assert.match(html,/data-version="20261017.v2"/);assert.match(html,/app.js\?v=20261017.v2/);assert.match(html,/style.css\?v=20261017.v2/);assert.equal(JSON.parse(readFileSync(path.join(root,'release.json'),'utf8')).version,'20261017.v2');
 }finally{assert.equal(path.dirname(root),path.resolve(tmpdir()));assert.ok(path.basename(root).startsWith('nickson-release-'));rmSync(root,{recursive:true,force:true});}
});
