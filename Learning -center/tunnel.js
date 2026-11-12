/**
 * Robust High-Speed HTTPS Tunnel for Telegram Mini App
 * Uses built-in Windows OpenSSH with localhost.run / Cloudflare TLS termination.
 * No 503 errors, no interstitial captcha pages, instant loading on smartphones!
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, 'bot_config.json');

async function updateTelegramBotMenuButton(token, webappUrl) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/setChatMenuButton`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        menu_button: {
          type: 'web_app',
          text: 'IT Academy',
          web_app: { url: webappUrl }
        }
      })
    });
    const data = await res.json();
    console.log('[TUNNEL] Telegram Bot Menu Button обновлен:', data.ok ? 'Успешно' : data.description);
  } catch (err) {
    console.warn('[TUNNEL] Ошибка обновления Menu Button:', err.message);
  }
}

function startTunnel(port = 8080, callback) {
  console.log(`[TUNNEL] Подключение защищенного SSH HTTPS-туннеля для порта ${port}...`);

  const proc = spawn('ssh', [
    '-o', 'StrictHostKeyChecking=no',
    '-o', 'ServerAliveInterval=30',
    '-o', 'ServerAliveCountMax=3',
    '-R', `80:localhost:${port}`,
    'nokey@localhost.run'
  ], {
    shell: false,
    windowsHide: true
  });

  proc.stdout.on('data', (chunk) => {
    const text = chunk.toString();
    
    // Поиск HTTPS URL (lhr.life или localhost.run)
    const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.(?:lhr\.life|localhost\.run)/);
    if (match) {
      const baseUrl = match[0];
      const webappUrl = `${baseUrl}/webapp`;

      console.log(`\n======================================================`);
      console.log(`🚀 НАДЕЖНЫЙ HTTPS ТУННЕЛЬ ДЛЯ TELEGRAM MINI APP АКТИВЕН!`);
      console.log(`🌐 Адрес Mini App: ${webappUrl}`);
      console.log(`⚡ Быстрая загрузка без 503 ошибок и подтверждений IP!`);
      console.log(`======================================================\n`);

      try {
        let conf = {};
        if (fs.existsSync(CONFIG_PATH)) {
          conf = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
        }
        conf.webapp_url = webappUrl;
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(conf, null, 2), 'utf8');
        console.log(`[TUNNEL] bot_config.json успешно обновлен: webapp_url = ${webappUrl}`);

        if (conf.bot_token) {
          updateTelegramBotMenuButton(conf.bot_token, webappUrl);
        }
      } catch (e) {
        console.error('[TUNNEL] Ошибка обновления конфига:', e.message);
      }

      if (typeof callback === 'function') {
        callback(webappUrl);
      }
    }
  });

  proc.stderr.on('data', (chunk) => {
    // OpenSSH info/notices
  });

  proc.on('close', (code) => {
    console.log(`[TUNNEL] Туннель закрылся (код: ${code}). Переподключение через 5 сек...`);
    setTimeout(() => startTunnel(port, callback), 5000);
  });

  return proc;
}

module.exports = { startTunnel };

if (require.main === module) {
  startTunnel(8080);
}
