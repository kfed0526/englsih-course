import {optimizedImages} from '../optimized-images.js';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
export function buildOfflineManifest(root=process.cwd()){
 const version=JSON.parse(fs.readFileSync(path.join(root,'release.json'),'utf8')).version;
 const files=[];const add=file=>fs.existsSync(path.join(root,file))&&files.push({url:file,bytes:fs.statSync(path.join(root,file)).size});
 for(const file of fs.readdirSync(root))if(/\.(js|css)$/.test(file)&&file!=='sw.js')add(file);
 for(const file of ['index.html','site.webmanifest','release.json'])add(file);
 const walk=dir=>{if(!fs.existsSync(path.join(root,dir)))return;for(const item of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){const file=dir+'/'+item.name;if(item.isDirectory())walk(file);else if(/\.(json|webp|svg|wav|mp3|png)$/.test(file)&&!Object.hasOwn(optimizedImages,file))add(file);}};
 walk('content');walk('assets');
 const manifest={version,totalBytes:files.reduce((n,f)=>n+f.bytes,0),files};fs.writeFileSync(path.join(root,'offline-manifest.json'),JSON.stringify(manifest,null,2)+'\n');return manifest;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){const m=buildOfflineManifest();console.log(`${m.files.length} files, ${(m.totalBytes/1048576).toFixed(1)} MB`);}
