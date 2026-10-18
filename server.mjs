import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd();
http.createServer(async(req,res)=>{try{const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=path.resolve(root,'.'+(name==='/'?'/index.html':name));if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}const data=await readFile(file);res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.wav':'audio/wav','.mp3':'audio/mpeg','.png':'image/png'})[path.extname(file)]||'application/octet-stream');res.end(data);}catch{res.writeHead(404);res.end('Not found');}}).listen(4173,'0.0.0.0',()=>console.log('Preview: http://localhost:4173'));
