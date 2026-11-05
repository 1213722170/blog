import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const directory = path.dirname(fileURLToPath(import.meta.url));
http.createServer(async (request,response) => {
  try {
    const filename = path.basename(new URL(request.url,'http://localhost').pathname);
    if (!/^(0[1-5]-[a-z-]+\.html|palettes\.json)$/.test(filename)) { response.writeHead(404).end(); return; }
    const content = await fs.readFile(path.join(directory,filename));
    response.writeHead(200, {'Content-Type': filename.endsWith('.html') ? 'text/html; charset=utf-8' : 'application/json; charset=utf-8'}).end(content);
  } catch { response.writeHead(404).end(); }
}).listen(3001,'127.0.0.1',() => console.log('Color previews: http://127.0.0.1:3001/01-moss-green.html'));
