/**
 * Start IT Academy Server, Telegram Bot & HTTPS Tunnel for Mini App
 */

require('./server.js');
const { startTunnel } = require('./tunnel.js');

// Запускаем безопасный HTTPS туннель для Telegram Mini App
setTimeout(() => {
  startTunnel(8080, (webappUrl) => {
    console.log(`[START-ALL] Telegram Mini App готов: ${webappUrl}`);
  });
}, 1500);

