import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

export function nextRelease(previous, now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
  const part = type => parts.find(p => p.type === type).value;
  const date = part('year') + part('month') + part('day');
  const last = previous?.version?.match(/^(\d{8})\.v([1-9]\d*)$/);
  if (last && last[1] > date) throw Error('發布日期早於目前版本，請檢查電腦時間。');
  const revision = last?.[1] === date ? Number(last[2]) + 1 : 1;
  return {version:`${date}.v${revision}`,releasedAt:now.toISOString(),timezone:'Asia/Taipei'};
}

export function release(root = process.cwd(), now = new Date()) {
  const file = path.join(root,'release.json');
  const previous = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file,'utf8')) : null;
  const result = nextRelease(previous,now);
  const index = path.join(root,'index.html');
  let html = fs.readFileSync(index,'utf8');
  html = html.replace(/<html\b([^>]*)>/,(_,attributes)=>`<html${attributes.replace(/\sdata-version="[^"]*"/,'')} data-version="${result.version}">`);
  html = html.replace(/href="style\.css(?:\?v=[^"]*)?"/,`href="style.css?v=${result.version}"`);
  html = html.replace(/src="app\.js(?:\?v=[^"]*)?"/,`src="app.js?v=${result.version}"`);
  fs.writeFileSync(index,html);
  fs.writeFileSync(file,JSON.stringify(result,null,2)+'\n');
  return result;
}

if(process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) console.log(release().version);
