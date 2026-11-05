import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const directory=path.dirname(fileURLToPath(import.meta.url));
http.createServer(async(req,res)=>{
  const filename=path.basename(new URL(req.url,'http://localhost').pathname);
  if(!/^0[1-5]-[a-z-]+\.html$/.test(filename)){res.writeHead(404).end();return;}
  try{const content=await fs.readFile(path.join(directory,filename));res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'}).end(content);}
  catch{res.writeHead(404).end();}
}).listen(3001,'127.0.0.1',()=>console.log('Color blocks: http://127.0.0.1:3001/01-cobalt-orange.html'));
