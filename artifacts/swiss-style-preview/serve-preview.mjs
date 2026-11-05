import http from 'node:http';
import fs from 'node:fs/promises';
const page=new URL('./swiss-home.html',import.meta.url);
http.createServer(async(req,res)=>{
  if(req.url!=='/'&&req.url!=='/swiss-home.html'){res.writeHead(404).end();return;}
  res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'}).end(await fs.readFile(page));
}).listen(3001,'127.0.0.1',()=>console.log('Swiss preview: http://127.0.0.1:3001/swiss-home.html'));
