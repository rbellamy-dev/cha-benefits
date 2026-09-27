import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Resend } from 'resend';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MIME = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.svg':  'image/svg+xml',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.webp': 'image/webp',
  '.ico':  'image/x-icon',
  '.woff2':'font/woff2',
};

const resend = new Resend(process.env.RESEND_API_KEY);
const PORT = 3003;

function body(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => (data += chunk));
    req.on('end', () => {
      try { resolve(JSON.parse(data)); }
      catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  if (req.method === 'POST' && req.url === '/subscribe') {
    res.setHeader('Content-Type', 'application/json');
    try {
      const { email } = await body(req);

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: 'Invalid email address.' }));
      }

      const escapedEmail = email.replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));

      const { error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: process.env.NOTIFY_EMAIL,
        subject: 'New Cha signup',
        html: `<p>New signup: <strong>${escapedEmail}</strong></p>`,
      });

      if (error) {
        console.error('Resend send failed:', error);
        res.writeHead(500);
        return res.end(JSON.stringify({ error: "Couldn't send that. Please try again in a moment." }));
      }

      res.writeHead(200);
      return res.end(JSON.stringify({ ok: true }));

    } catch (err) {
      console.error('Subscribe handler error:', err);
      res.writeHead(500);
      return res.end(JSON.stringify({ error: "Couldn't send that. Please try again in a moment." }));
    }
  }

  // Serve static files from this folder
  // Strip ?v=… cache-busting query strings before resolving the file
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  let urlPath = pathname === '/' ? '/index.html' : pathname;
  const filePath = path.join(__dirname, urlPath);
  const ext = path.extname(filePath);
  const mime = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end('Not found');
    }
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
});

server.listen(PORT, () => console.log(`Cha redesign server running on :${PORT}`));
