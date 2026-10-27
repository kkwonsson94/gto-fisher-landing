import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fs.realpathSync(path.dirname(fileURLToPath(import.meta.url)));
const publicPreview = process.env.PUBLIC_PREVIEW === '1';
const mime = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.md': 'text/plain; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.woff2': 'font/woff2',
};

function withinRoot(target) {
  const relative = path.relative(root, target);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

// A tunnel must expose only the browser-facing page, not the development tree.
function isPublicFile(target) {
  const relative = path.relative(root, target).split(path.sep).join('/');
  if (relative.split('/').some(segment => segment.startsWith('.'))) return false;
  if (relative === 'index.html' || /^[a-z0-9-]+\.(css|js)$/i.test(relative)) return true;
  return relative.startsWith('assets/') &&
    /\.(png|jpe?g|webp|svg|ico|mp4|webm|woff2?)$/i.test(relative);
}

function reply(res, status, message, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', ...headers });
  res.end(message);
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    reply(res, 405, 'Method not allowed', { Allow: 'GET, HEAD' });
    return;
  }
  let target;
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
    if (pathname.includes('\0')) throw new Error('Invalid path');
    target = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
    if (!withinRoot(target)) { reply(res, 403, 'Forbidden'); return; }
    if (publicPreview && !isPublicFile(target)) { reply(res, 404, 'Not found'); return; }
    target = fs.realpathSync(target);
    if (!withinRoot(target)) { reply(res, 403, 'Forbidden'); return; }
    if (publicPreview && !isPublicFile(target)) { reply(res, 404, 'Not found'); return; }
  } catch (error) {
    reply(res, error instanceof URIError ? 400 : 404, 'Not found');
    return;
  }
  const stat = fs.statSync(target);
  if (!stat.isFile()) { reply(res, 404, 'Not found'); return; }
  const headers = {
    'Content-Type': mime[path.extname(target).toLowerCase()] || 'application/octet-stream',
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
    ...(publicPreview ? { 'X-Robots-Tag': 'noindex, nofollow, noarchive' } : {}),
  };
  let start = 0;
  let end = stat.size - 1;
  let status = 200;
  if (req.headers.range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
    if (!match || (!match[1] && !match[2])) {
      reply(res, 416, 'Invalid range', { 'Content-Range': `bytes */${stat.size}` });
      return;
    }
    if (!match[1]) {
      const suffix = Number(match[2]);
      start = Math.max(0, stat.size - suffix);
    } else {
      start = Number(match[1]);
      end = match[2] ? Math.min(Number(match[2]), end) : end;
    }
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= stat.size) {
      reply(res, 416, 'Range not satisfiable', { 'Content-Range': `bytes */${stat.size}` });
      return;
    }
    status = 206;
    headers['Content-Range'] = `bytes ${start}-${end}/${stat.size}`;
  }
  headers['Content-Length'] = stat.size === 0 ? 0 : end - start + 1;
  res.writeHead(status, headers);
  if (req.method === 'HEAD' || stat.size === 0) { res.end(); return; }
  const stream = fs.createReadStream(target, { start, end });
  stream.on('error', () => res.destroy());
  res.on('close', () => stream.destroy());
  stream.pipe(res);
});

const port = Number(process.env.PORT || 4194);
server.listen(port, '127.0.0.1', () => {
  console.log(`Fisher Agent showcase: http://127.0.0.1:${port}/`);
});
