const http = require('http');
const fs = require('fs');
const path = require('path');
const bot = require('./bot.js');

let PORT = parseInt(process.env.PORT, 10) || 8080;
const BASE_DIR = __dirname;
const LEADS_FILE = path.join(BASE_DIR, 'leads.json');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

function readBodyJson(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const parsed = body ? JSON.parse(body) : {};
        resolve(parsed);
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function createServer() {
  const server = http.createServer(async (req, res) => {
    // CORS заголовки
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
    const pathname = parsedUrl.pathname;

    // API: Обработка заявки с сайта (Lead Enrollment)
    if (pathname === '/api/enroll' && req.method === 'POST') {
      try {
        const data = await readBodyJson(req);
        if (!data.name || !data.phone) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ ok: false, error: 'Имя и телефон обязательны' }));
          return;
        }

        const savedLead = bot.handleWebsiteLead({
          name: data.name,
          phone: data.phone,
          course: data.course || 'Не указан',
          source: 'website'
        });

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          ok: true,
          message: 'Заявка успешно принята и отправлена в Telegram бот',
          lead: savedLead
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: err.message }));
      }
      return;
    }

    // API: Список заявок
    if (pathname === '/api/leads' && req.method === 'GET') {
      try {
        let leads = [];
        if (fs.existsSync(LEADS_FILE)) {
          leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
        }
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: true, count: leads.length, leads }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: err.message }));
      }
      return;
    }

    // Раздача статических файлов
    let reqUrl = pathname;
    if (reqUrl === '/') reqUrl = '/index.html';
    if (reqUrl === '/webapp' || reqUrl === '/app') reqUrl = '/webapp.html';

    const safePath = path.normalize(decodeURIComponent(reqUrl)).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(BASE_DIR, safePath);

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`404: Файл ${reqUrl} не найден`);
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      res.writeHead(200, { 'Content-Type': contentType });
      const readStream = fs.createReadStream(filePath);
      readStream.pipe(res);
    });
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️ Порт ${PORT} занят, пробуем ${PORT + 1}...`);
      PORT += 1;
      server.listen(PORT);
    } else {
      console.error('Ошибка сервера:', err);
    }
  });

  server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Сервер IT Academy успешно запущен: http://localhost:${PORT}`);
    console.log(`📡 API эндпоинты:`);
    console.log(`   • POST http://localhost:${PORT}/api/enroll (приём заявок)`);
    console.log(`   • GET  http://localhost:${PORT}/api/leads  (просмотр заявок)`);
    console.log(`🤖 Telegram Bot: @ragm_bot`);
    console.log(`======================================================\n`);

    // Запуск Telegram-бота в фоне
    bot.startPolling().catch(err => {
      console.error('Ошибка запуска Telegram бота:', err);
    });
  });
}

createServer();
