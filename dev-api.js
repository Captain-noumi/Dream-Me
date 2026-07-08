import http from 'http';
import url from 'url';
import fs from 'fs';
import path from 'path';
import watsonxHandler from './api/watsonx.js';
import youtubeHandler from './api/youtube.js';

// Programmatic .env loader for local Node.js environments
try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.substring(0, eqIdx).trim();
          const val = trimmed.substring(eqIdx + 1).trim();
          process.env[key] = val.replace(/^["']|["']$/g, ''); // strip optional wrapping quotes
        }
      }
    });
    console.log('\x1b[36mℹ\x1b[0m Environment variables successfully loaded from .env');
  }
} catch (err) {
  console.warn('Could not parse .env configuration:', err.message);
}

const PORT = 3001;

const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = reqUrl.pathname;

  // Mock Vercel response helper
  const mockRes = {
    statusCode: 200,
    headers: {},
    setHeader(name, value) {
      this.headers[name] = value;
      res.setHeader(name, value);
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      res.writeHead(this.statusCode, { 'Content-Type': 'application/json', ...this.headers });
      res.end(JSON.stringify(data));
      return this;
    },
    end() {
      res.writeHead(this.statusCode, this.headers);
      res.end();
      return this;
    }
  };

  // Reconstruct query parameters map
  const query = {};
  reqUrl.searchParams.forEach((val, key) => {
    query[key] = val;
  });

  // Mock Vercel request helper
  const mockReq = {
    method: req.method,
    query: query,
    body: {}
  };

  try {
    if (pathname === '/api/watsonx' || pathname === '/api/watsonx/clear') {
      if (pathname === '/api/watsonx/clear') {
        query.action = 'clear_history';
      }
      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            mockReq.body = body ? JSON.parse(body) : {};
            if (pathname === '/api/watsonx/clear') {
              mockReq.body.action = 'clear_history';
            }
            await watsonxHandler(mockReq, mockRes);
          } catch (e) {
            mockRes.status(500).json({ error: e.message });
          }
        });
      } else {
        await watsonxHandler(mockReq, mockRes);
      }
    } else if (pathname === '/api/youtube') {
      await youtubeHandler(mockReq, mockRes);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  } catch (error) {
    console.error('Server error handling request:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
});

server.listen(PORT, () => {
  console.log(`\x1b[32m✔\x1b[0m Local Dev API Server running at http://localhost:${PORT}`);
  console.log(`Exposing /api/watsonx and /api/youtube endpoints securely.`);
});
