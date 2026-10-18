import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {spawnSync} from 'node:child_process';
const projectRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export function inspectProject(root=projectRoot){
 const results=[];const check=(name,work)=>{try{const detail=work();results.push({name,ok:true,detail:detail||'OK'});}catch(error){results.push({name,ok:false,detail:error.message});}};
 const read=file=>fs.readFileSync(path.join(root,file),'utf8').replace(/^\uFEFF/,'').replace(/\r\n/g,'\n');
 check('Node',()=>{const major=Number(process.versions.node.split('.')[0]);if(major<18)throw Error('Node 18+ required; validated on 24.19.0');return process.version;});
 check('Project identity',()=>{if(JSON.parse(read('package.json')).name!=='panda-school')throw Error('Not a Panda School checkout');return root;});
 check('Version',()=>{const version=JSON.parse(read('release.json')).version;const html=read('index.html');if(!/^\d{8}\.v[1-9]\d*$/.test(version)||!html.includes(`data-version="${version}"`))throw Error('release.json and index.html differ');return `${version} (local unpublished changes may exist)`;});
 check('Textbooks and referenced assets',()=>{const manifest=JSON.parse(read('content/index.json')),bookIDs=new Set();let units=0,words=0;const assets=new Set();const scan=value=>{if(typeof value==='string'&&value.startsWith('assets/'))assets.add(value);else if(Array.isArray(value))value.forEach(scan);else if(value&&typeof value==='object')Object.values(value).forEach(scan);};for(const file of manifest.books){const book=JSON.parse(read('content/'+file));if(bookIDs.has(book.id))throw Error(`Duplicate book ${book.id}`);bookIDs.add(book.id);const ids=new Set();for(const unit of book.units){if(ids.has(unit.id))throw Error(`Duplicate unit ${book.id}/${unit.id}`);ids.add(unit.id);units++;const wordIDs=new Set();for(const word of unit.words){if(wordIDs.has(word.id))throw Error(`Duplicate word ${book.id}/${unit.id}/${word.id}`);wordIDs.add(word.id);words++;}}scan(book);}for(const asset of assets)if(!fs.existsSync(path.join(root,asset)))throw Error(`Missing ${asset}`);return `${bookIDs.size} books, ${units} units, ${words} words, ${assets.size} referenced assets`;});
 check('Handoff documents',()=>{for(const file of ['AGENTS.md','START_HERE.md','DEVELOPMENT_STATUS.md','DEVELOPMENT.md','SCRIPTS.md','CODE_MAP.md'])read(file);return 'Entry points present';});
 check('Repository skills',()=>{const base='.agents/skills';const dirs=fs.readdirSync(path.join(root,base),{withFileTypes:true}).filter(x=>x.isDirectory());if(!dirs.length)throw Error('No repository skills');for(const dir of dirs){const file=base+'/'+dir.name+'/SKILL.md',text=read(file);if(!text.startsWith('---\n')||!text.includes(`name: ${dir.name}\n`)||!/^description: .+/m.test(text))throw Error(`Invalid skill ${dir.name}`);for(const match of text.matchAll(/\]\((\.\.\/[^)]+)\)/g)){const target=path.resolve(root,base,dir.name,match[1]);if(!fs.existsSync(target))throw Error(`Broken skill link ${match[1]}`);}}return `${dirs.length} skills`;});
 check('Offline manifest',()=>{const manifest=JSON.parse(read('offline-manifest.json'));if(manifest.version!==JSON.parse(read('release.json')).version)throw Error('Manifest version differs; rebuild it');let bytes=0;for(const item of manifest.files){const file=path.join(root,item.url);if(!fs.existsSync(file))throw Error(`Missing offline asset ${item.url}`);const size=fs.statSync(file).size;if(size!==item.bytes)throw Error(`Stale offline size: ${item.url}; run node scripts/offline-manifest.mjs`);bytes+=size;}if(bytes!==manifest.totalBytes)throw Error('Offline total differs');return `${manifest.files.length} files, ${(bytes/1048576).toFixed(1)} MB`;});
 return results;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
 const results=inspectProject();for(const r of results)console.log(`${r.ok?'OK':'FAIL'} ${r.name}: ${r.detail}`);
 const git=spawnSync('git',['branch','--show-current'],{cwd:projectRoot,encoding:'utf8'});console.log(git.status===0?`Git branch: ${git.stdout.trim()}`:'NOTE Git branch unavailable (ZIP checkout, missing Git, or ownership permissions)');
 if(results.some(r=>!r.ok))process.exitCode=1;
 else if(process.argv.includes('--test')){const files=fs.readdirSync(path.join(projectRoot,'tests')).filter(name=>name.endsWith('.test.mjs')).sort().map(name=>path.join('tests',name));const test=spawnSync(process.execPath,['--test',...files],{cwd:projectRoot,stdio:'inherit'});process.exitCode=test.status??1;}
 console.log('No release bump, push, deployment, downloads, or user-data changes performed.');
}
