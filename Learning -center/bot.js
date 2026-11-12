/**
 * Telegram Bot for IT Academy Uzbekistan
 * Username: @ragm_bot
 * 
 * Features:
 * - RAG AI Consultant (Knowledge Base & Gemini API integration)
 * - Interactive Courses Catalog with detailed syllabus & pricing
 * - Lead Capture FSM (Enrollment for free trial lessons)
 * - Career Orientation Quiz (3-step interactive test)
 * - Installment & Discount Calculator
 * - Campus 24/7 & Contacts info
 * - Real-time Lead Notification to Admins (from both Bot & Website)
 */

const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, 'bot_config.json');
const LEADS_PATH = path.join(__dirname, 'leads.json');

// Загрузка конфигурации
let config = {
  bot_token: "9261916843:AAHJILcWGpks6j6dhiEhdM-vZSVjWC-8SgE",
  bot_username: "ragm_bot",
  admin_chat_ids: [],
  gemini_api_key: process.env.GEMINI_API_KEY || "",
  academy_phone: "+998 (71) 200-88-00",
  web_url: "http://localhost:8080",
  webapp_url: "https://it-academy-uz.loca.lt/webapp"
};

function getWebAppUrl() {
  return config.webapp_url || "https://it-academy-uz.loca.lt/webapp";
}

try {
  if (fs.existsSync(CONFIG_PATH)) {
    const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
    config = { ...config, ...JSON.parse(raw) };
  }
} catch (e) {
  console.warn('[BOT] Не удалось прочитать bot_config.json:', e.message);
}

function saveConfig() {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
  } catch (e) {
    console.error('[BOT] Ошибка сохранения bot_config.json:', e.message);
  }
}

// Загрузка / сохранение лидов
function loadLeads() {
  try {
    if (fs.existsSync(LEADS_PATH)) {
      return JSON.parse(fs.readFileSync(LEADS_PATH, 'utf8'));
    }
  } catch (e) {
    console.warn('[BOT] Ошибка чтения leads.json:', e.message);
  }
  return [];
}

function saveLead(lead) {
  const leads = loadLeads();
  leads.unshift(lead);
  try {
    fs.writeFileSync(LEADS_PATH, JSON.stringify(leads, null, 2), 'utf8');
  } catch (e) {
    console.error('[BOT] Ошибка сохранения leads.json:', e.message);
  }
  return lead;
}

// ============================================================================
// БАЗА ЗНАНИЙ (KNOWLEDGE BASE) КУРСОВ И УЧЕБНОГО ЦЕНТРА
// ============================================================================

const COURSES = [
  {
    id: "frontend",
    title: "Frontend Разработка (React & Next.js)",
    shortTitle: "Frontend Dev",
    duration: "7 месяцев (3 раза в неделю по 2 часа + безлимитный коворкинг)",
    pricePerMonth: 1800000,
    pricePerMonthFormatted: "1 800 000 сум/мес",
    fullPrice: 12600000,
    fullPriceDiscount: 10710000,
    stack: "HTML5, CSS3, JavaScript ES6+, TypeScript, React 19, Next.js 15, Redux Toolkit, Tailwind CSS, Git, Vite",
    icon: "💻",
    desc: "Практический курс веб-разработки с нуля до уровня Junior+/Middle. 6 реальных проектов в портфолио, диплом государственного образца, гарантированное собеседование в IT-компании.",
    syllabus: [
      "Модуль 1: Вёрстка веб-страниц (HTML5, современный CSS3, Flexbox, Grid, адаптивность)",
      "Модуль 2: Программирование на JavaScript (ES6+, DOM, асинхронность, Fetch API)",
      "Модуль 3: TypeScript и современная архитектура фронтенда",
      "Модуль 4: React.js (хуки, компонентный подход, роутинг, состояние)",
      "Модуль 5: Next.js 15 (SSR, SSG, Server Actions, App Router)",
      "Модуль 6: Дипломный проект (Fullstack веб-сервис) и подготовка к собеседованию"
    ]
  },
  {
    id: "backend",
    title: "Python & Backend Разработка (FastAPI, Django, AI)",
    shortTitle: "Python Backend",
    duration: "8 месяцев (3 раза в неделю)",
    pricePerMonth: 1900000,
    pricePerMonthFormatted: "1 900 000 сум/мес",
    fullPrice: 15200000,
    fullPriceDiscount: 12920000,
    stack: "Python 3.12, ООП, PostgreSQL, Redis, Django, FastAPI, Docker, AsyncIO, Gemini API",
    icon: "🐍",
    desc: "Создание высоконагруженных серверных приложений, RESTful API, Telegram-ботов и микросервисов с интеграцией искусственного интеллекта.",
    syllabus: [
      "Модуль 1: Основы Python, алгоритмы, структуры данных, ООП",
      "Модуль 2: Реляционные базы данных, SQL, PostgreSQL, индексы и оптимизация",
      "Модуль 3: Разработка API на FastAPI и Django REST Framework",
      "Модуль 4: Асинхронное программирование, Redis, Celery, очереди задач",
      "Модуль 5: Docker, контейнеризация, микросервисная архитектура, CI/CD",
      "Модуль 6: Интеграция LLM (Gemini API) и разработка собственного дипломного бэкенда"
    ]
  },
  {
    id: "design",
    title: "UI/UX & Product Design (Figma to Production)",
    shortTitle: "UI/UX Design",
    duration: "5 месяцев",
    pricePerMonth: 1700000,
    pricePerMonthFormatted: "1 700 000 сум/мес",
    fullPrice: 8500000,
    fullPriceDiscount: 7225000,
    stack: "Figma, FigJam, Adobe Illustrator, Principle, Design Systems, UX Research, CustDev, Wireframing",
    icon: "🎨",
    desc: "Проектирование пользовательских интерфейсов мобильных и веб-приложений, проведение исследований, создание дизайн-систем и портфолио на Behance/Dribbble.",
    syllabus: [
      "Модуль 1: Основы композиции, типографика, колористика, сетки",
      "Модуль 2: Инструменты Figma (Auto Layout, Variants, Variables, интерактивные прототипы)",
      "Модуль 3: UX исследования, CustDev, CJM, User Flow, информационная архитектура",
      "Модуль 4: Разработка полноценной Design System",
      "Модуль 5: Дизайн мобильного банка и веб-сервиса (4 кейса на Behance)"
    ]
  },
  {
    id: "qa",
    title: "QA Automation & Manual Testing (Python & Playwright)",
    shortTitle: "QA Testing",
    duration: "4 месяца",
    pricePerMonth: 1600000,
    pricePerMonthFormatted: "1 600 000 сум/мес",
    fullPrice: 6400000,
    fullPriceDiscount: 5440000,
    stack: "Тест-дизайн, Postman, SQL, Git, Python, Playwright, Selenium, Jira, Allure Reports",
    icon: "🔍",
    desc: "Быстрый старт в IT: ручное тестирование веб- и мобильных приложений, написание автотестов на Python, тестирование API в Postman.",
    syllabus: [
      "Модуль 1: Теория тестирования, тест-дизайн, баг-репорты в Jira",
      "Модуль 2: Тестирование API (Postman, REST, JSON, статусы)",
      "Модуль 3: Базы данных SQL для тестировщика (JOIN, агрегация, выборки)",
      "Модуль 4: Автоматизация тестирования на Python и Playwright"
    ]
  },
  {
    id: "ai",
    title: "Data Science & Artificial Intelligence (AI)",
    shortTitle: "Data Science & AI",
    duration: "9 месяцев",
    pricePerMonth: 2100000,
    pricePerMonthFormatted: "2 100 000 сум/мес",
    fullPrice: 18900000,
    fullPriceDiscount: 16065000,
    stack: "Python, Pandas, NumPy, Scikit-learn, PyTorch, LLMs, Prompt Engineering, RAG архитектуры",
    icon: "🤖",
    desc: "Анализ больших данных, машинное обучение, создание нейросетей, интеграция генеративного ИИ и разработка собственных RAG-систем.",
    syllabus: [
      "Модуль 1: Python для анализа данных (NumPy, Pandas, Matplotlib, Seaborn)",
      "Модуль 2: Математическая статистика и теория вероятностей для ML",
      "Модуль 3: Классическое машинное обучение (Scikit-learn, регрессия, классификация)",
      "Модуль 4: Глубокое обучение и нейросети на PyTorch",
      "Модуль 5: Large Language Models (LLM), Prompt Engineering, Fine-tuning, RAG"
    ]
  },
  {
    id: "mobile",
    title: "Mobile App Development (Flutter & Dart)",
    shortTitle: "Mobile (Flutter)",
    duration: "6 месяцев",
    pricePerMonth: 1850000,
    pricePerMonthFormatted: "1 850 000 сум/мес",
    fullPrice: 11100000,
    fullPriceDiscount: 9435000,
    stack: "Dart, Flutter SDK, BLoC, Provider, Firebase, REST API, App Store & Google Play",
    icon: "📱",
    desc: "Кроссплатформенная разработка мобильных приложений под iOS и Android на Flutter. 3 опубликованных приложения в портфолио.",
    syllabus: [
      "Модуль 1: Язык программирования Dart и основы ООП",
      "Модуль 2: Вёрстка экранов на Flutter, виджеты и анимации",
      "Модуль 3: Управление состоянием (BLoC, Provider)",
      "Модуль 4: Работа с сетью, REST API, Firebase, локальная БД",
      "Модуль 5: Публикация приложений в Google Play и App Store"
    ]
  },
  {
    id: "devops",
    title: "DevOps & Cloud Engineering",
    shortTitle: "DevOps & Cloud",
    duration: "6 месяцев",
    pricePerMonth: 2000000,
    pricePerMonthFormatted: "2 000 000 сум/мес",
    fullPrice: 12000000,
    fullPriceDiscount: 10200000,
    stack: "Linux, Bash, Docker, Docker Compose, Kubernetes, CI/CD, AWS, Nginx, Prometheus & Grafana",
    icon: "☁️",
    desc: "Построение отказоустойчивой облачной инфраструктуры, автоматизация деплоя (CI/CD) и мониторинг высоконагруженных систем.",
    syllabus: [
      "Модуль 1: Администрирование Linux и Bash-скриптинг",
      "Модуль 2: Контейнеризация с Docker и Docker Compose",
      "Модуль 3: Оркестрация контейнеров в Kubernetes (K8s)",
      "Модуль 4: Настройка CI/CD пайплайнов (GitHub Actions, GitLab CI)",
      "Модуль 5: Мониторинг, логирование (Prometheus, Grafana) и облака AWS"
    ]
  },
  {
    id: "security",
    title: "Cyber Security & Ethical Hacking",
    shortTitle: "Cyber Security",
    duration: "6 месяцев",
    pricePerMonth: 1950000,
    pricePerMonthFormatted: "1 950 000 сум/мес",
    fullPrice: 11700000,
    fullPriceDiscount: 9945000,
    stack: "Сетевые протоколы, Kali Linux, Wireshark, Metasploit, OWASP Top 10, аудит уязвимостей, криптография",
    icon: "🛡️",
    desc: "Защита цифровых систем, аудит веб-приложений, анализ сетевых атак и этичный хакинг по международным стандартам безопасности.",
    syllabus: [
      "Модуль 1: Компьютерные сети, протоколы TCP/IP, OSI, криптография",
      "Модуль 2: Инструменты анализа безопасности и Kali Linux",
      "Модуль 3: Веб-уязвимости и OWASP Top 10 (SQLi, XSS, CSRF)",
      "Модуль 4: Сетевая безопасность и тестирование на проникновение (Penetration Testing)",
      "Модуль 5: Расследование инцидентов и построение защищенной инфраструктуры"
    ]
  }
];

const CENTER_INFO = {
  name: "IT ACADEMY UZBEKISTAN",
  phone: "+998 (71) 200-88-00",
  telegram: "@it_academy_uz",
  mainCampus: "г. Ташкент, Мирзо-Улугбекский район (ориентир IT-Park / станция метро Буюк Ипак Йули)",
  chilonzorCampus: "г. Ташкент, Чиланзарский район (ориентир метро Новза)",
  hours: "Ежедневно с 09:00 до 22:00 (Коворкинг для студентов 24/7)",
  coworking: "Бесплатный круглосуточный 24/7 коворкинг для студентов: моноблоки Apple iMac, ПК Core i7 32GB RAM, гигабитный интернет, кофе-поинты, переговорные комнаты."
};

// ============================================================================
// СЕССИИ ПОЛЬЗОВАТЕЛЕЙ (FSM State Machine)
// ============================================================================
const userSessions = new Map();

function getSession(userId) {
  if (!userSessions.has(userId)) {
    userSessions.set(userId, {
      state: null, // 'ENROLL_NAME', 'ENROLL_PHONE', 'ENROLL_COURSE', 'QUIZ_1', 'QUIZ_2', 'QUIZ_3'
      data: {}
    });
  }
  return userSessions.get(userId);
}

function clearSession(userId) {
  userSessions.delete(userId);
}

// ============================================================================
// TELEGRAM BOT API CLIENT
// ============================================================================
const TELEGRAM_API_BASE = `https://api.telegram.org/bot${config.bot_token}`;

async function callTelegram(method, params = {}) {
  const url = `${TELEGRAM_API_BASE}/${method}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const data = await res.json();
    if (!data.ok) {
      console.warn(`[BOT API ERROR] ${method}:`, data.description);
    }
    return data;
  } catch (err) {
    console.error(`[BOT API NETWORK ERROR] ${method}:`, err.message);
    return { ok: false, error: err.message };
  }
}

async function sendMessage(chatId, text, options = {}) {
  return callTelegram('sendMessage', {
    chat_id: chatId,
    text: text,
    parse_mode: options.parse_mode || 'HTML',
    reply_markup: options.reply_markup,
    disable_web_page_preview: options.disable_web_page_preview !== false
  });
}

async function editMessageText(chatId, messageId, text, options = {}) {
  return callTelegram('editMessageText', {
    chat_id: chatId,
    message_id: messageId,
    text: text,
    parse_mode: options.parse_mode || 'HTML',
    reply_markup: options.reply_markup,
    disable_web_page_preview: options.disable_web_page_preview !== false
  });
}

async function answerCallbackQuery(callbackQueryId, text = "", showAlert = false) {
  return callTelegram('answerCallbackQuery', {
    callback_query_id: callbackQueryId,
    text: text,
    show_alert: showAlert
  });
}

// Установка команд в меню Telegram
async function setupBotCommands() {
  const commands = [
    { command: 'start', description: '🚀 Главное меню и приветствие' },
    { command: 'app', description: '📱 Запустить Telegram Mini App' },
    { command: 'courses', description: '📚 Каталог курсов и программы' },
    { command: 'quiz', description: '🧩 Тест: Какая IT-профессия вам подходит' },
    { command: 'calc', description: '💰 Калькулятор стоимости и рассрочки' },
    { command: 'enroll', description: '🎁 Запись на бесплатный пробный урок' },
    { command: 'coworking', description: '🏢 Коворкинг 24/7 и кампус' },
    { command: 'contacts', description: '📍 Контакты и адреса в Ташкенте' },
    { command: 'faq', description: '❓ Частые вопросы и ответы' },
    { command: 'leads', description: '📋 Просмотр заявок (для менеджеров)' },
    { command: 'help', description: 'ℹ️ Помощь и возможности бота' }
  ];
  const res = await callTelegram('setMyCommands', { commands });
  console.log('[BOT] Команды бота обновлены:', res.ok ? 'Успешно' : 'Ошибка');
}

// Установка кнопки Web App слева от поля ввода текста
async function setupMenuButton() {
  const url = getWebAppUrl();
  if (url && url.startsWith('https://')) {
    const res = await callTelegram('setChatMenuButton', {
      menu_button: {
        type: 'web_app',
        text: 'IT Academy',
        web_app: { url }
      }
    });
    console.log('[BOT] Кнопка меню (Web App) обновлена:', res.ok ? 'Успешно' : res.description);
  }
}

// ============================================================================
// КЛАВИАТУРЫ И МЕНЮ
// ============================================================================

function getMainReplyKeyboard() {
  const url = getWebAppUrl();
  const topRow = (url && url.startsWith('https://'))
    ? [{ text: '🚀 Открыть Mini App в Telegram 📱', web_app: { url } }]
    : [{ text: '🚀 Открыть Mini App 📱' }];

  return {
    keyboard: [
      topRow,
      [{ text: '🎓 Каталог курсов' }, { text: '🎁 Записаться на урок' }],
      [{ text: '💡 Тест профессий' }, { text: '💰 Калькулятор рассрочки' }],
      [{ text: '🏢 Кампус и коворкинг 24/7' }, { text: '📍 Контакты и адреса' }],
      [{ text: '❓ Частые вопросы (FAQ)' }, { text: '💬 Задать вопрос ИИ' }]
    ],
    resize_keyboard: true,
    is_persistent: true
  };
}

function getCoursesInlineKeyboard() {
  const inline_keyboard = [];
  const url = getWebAppUrl();
  if (url && url.startsWith('https://')) {
    inline_keyboard.push([
      { text: '⚡ Открыть всё приложение в Mini App 📱', web_app: { url } }
    ]);
  }
  COURSES.forEach(course => {
    inline_keyboard.push([
      { text: `${course.icon} ${course.shortTitle} • ${course.pricePerMonthFormatted}`, callback_data: `course_${course.id}` }
    ]);
  });
  inline_keyboard.push([
    { text: '🎁 Записаться на бесплатный урок', callback_data: 'enroll_start' },
    { text: '💰 Калькулятор', callback_data: 'calc_start' }
  ]);
  return { inline_keyboard };
}

function getCourseDetailsKeyboard(courseId) {
  return {
    inline_keyboard: [
      [
        { text: '📝 Записаться на этот курс', callback_data: `enroll_for_${courseId}` },
        { text: '💰 Рассчитать оплату', callback_data: `calc_course_${courseId}` }
      ],
      [
        { text: '◀️ Все курсы', callback_data: 'all_courses' },
        { text: '🌐 Сайт IT Academy', url: config.web_url }
      ]
    ]
  };
}

// ============================================================================
// RAG ПОИСК И ГЕНЕРАЦИЯ ОТВЕТОВ
// ============================================================================

function retrieveRAGKnowledge(query) {
  const q = query.toLowerCase();
  const words = q.split(/[\s,?.!]+/).filter(w => w.length > 2);

  const matchedCourses = COURSES.filter(course => {
    const fullText = (course.title + ' ' + course.desc + ' ' + course.stack).toLowerCase();
    return words.some(w => fullText.includes(w));
  });

  return {
    query,
    matchedCourses,
    isCoursesQuery: q.includes('курс') || q.includes('направлен') || q.includes('программ') || q.includes('учит'),
    isPriceQuery: q.includes('стоим') || q.includes('цен') || q.includes('рассрочк') || q.includes('оплат') || q.includes('сум') || q.includes('скидк'),
    isCampusQuery: q.includes('где') || q.includes('адрес') || q.includes('кампус') || q.includes('коворкинг') || q.includes('локаци') || q.includes('филиал') || q.includes('метро'),
    isContactQuery: q.includes('телефон') || q.includes('номер') || q.includes('связат') || q.includes('контакт') || q.includes('менеджер'),
    isLaptopQuery: q.includes('ноутбук') || q.includes('компьютер') || q.includes('пк') || q.includes('imac'),
    isDiplomaQuery: q.includes('диплом') || q.includes('сертификат') || q.includes('государствен'),
    isZeroQuery: q.includes('нуля') || q.includes('новичок') || q.includes('опыт') || q.includes('начать'),
    isEnrollQuery: q.includes('запис') || q.includes('пробн') || q.includes('урок') || q.includes('старт') || q.includes('поступить')
  };
}

async function generateRAGAnswer(query, user) {
  const rag = retrieveRAGKnowledge(query);

  // Если настроен реальный Gemini API ключ, можем вызывать Gemini с RAG контекстом
  if (config.gemini_api_key && config.gemini_api_key.trim() !== "") {
    try {
      const coursesContext = COURSES.map(c => 
        `Курс: ${c.title}\nДлительность: ${c.duration}\nСтоимость: ${c.pricePerMonthFormatted}\nСтек: ${c.stack}\nОписание: ${c.desc}`
      ).join("\n\n");

      const systemPrompt = `Ты — элитный персональный ИИ-консультант IT Academy Uzbekistan в Telegram (@ragm_bot).
Отвечай вежливо, четко, доброжелательно и профессионально, используя Telegram HTML-форматирование (теги <b>, <i>, <code>).
Опирайся на проверенные данные академии:
- Телефон: ${CENTER_INFO.phone}
- Кампусы: ${CENTER_INFO.mainCampus} и ${CENTER_INFO.chilonzorCampus}
- Коворкинг 24/7 доступен бесплатно всем студентам.
- Скидка 15% при единовременной оплате всего курса. Беспроцентная рассрочка через банки.

База знаний о курсах:
${coursesContext}`;

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${config.gemini_api_key.trim()}`;
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: query }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
        })
      });

      if (resp.ok) {
        const json = await resp.json();
        const geminiText = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (geminiText) {
          return geminiText;
        }
      }
    } catch (err) {
      console.warn('[BOT] Ошибка вызова Gemini API, используем локальный RAG:', err.message);
    }
  }

  // Локальный высокоточный RAG генератор
  if (rag.isCoursesQuery && rag.matchedCourses.length > 0) {
    const list = rag.matchedCourses.slice(0, 3).map(c => 
      `🔹 <b>${c.title}</b>\n` +
      `⏱ Длительность: ${c.duration}\n` +
      `💵 Стоимость: <b>${c.pricePerMonthFormatted}</b>\n` +
      `🛠 Стек: <code>${c.stack}</code>\n`
    ).join("\n");

    return `🎓 <b>Найдено в каталоге IT Academy:</b>\n\n${list}\n` +
      `💡 <i>Чтобы изучить программу детально или записаться на бесплатный пробный урок, нажмите кнопку ниже:</i>`;
  }

  if (rag.isPriceQuery) {
    return `💰 <b>Условия оплаты и рассрочки в IT Academy:</b>\n\n` +
      `• <b>Помесячная оплата:</b> от 1 600 000 до 2 100 000 сум/мес (в зависимости от курса).\n` +
      `• <b>Скидка 15%:</b> при единовременной оплате полного курса.\n` +
      `• <b>Беспроцентная рассрочка:</b> на 6, 9 или 12 месяцев через банки-партнеры (Anorbank, Uzum Nasiya, Payme).\n` +
      `• В стоимость включены все практические материалы, код-ревью ментора и <b>безлимитный доступ в коворкинг 24/7</b>.\n\n` +
      `Нажмите /calc чтобы рассчитать платеж под конкретный курс!`;
  }

  if (rag.isCampusQuery || rag.isContactQuery) {
    return `📍 <b>Кампусы и контакты IT Academy в Ташкенте:</b>\n\n` +
      `🏢 <b>Главный кампус:</b>\n${CENTER_INFO.mainCampus}\n\n` +
      `🏢 <b>Филиал 2:</b>\n${CENTER_INFO.chilonzorCampus}\n\n` +
      `📞 <b>Горячая линия:</b> <code>${CENTER_INFO.phone}</code>\n` +
      `✈️ <b>Telegram:</b> ${CENTER_INFO.telegram}\n` +
      `🕒 <b>График работы:</b> ${CENTER_INFO.hours}\n` +
      `⚡ <b>Коворкинг для студентов:</b> 24/7 круглосуточно.`;
  }

  if (rag.isLaptopQuery) {
    return `💻 <b>Нужен ли свой ноутбук для обучения?</b>\n\n` +
      `В наших учебных классах установлены мощные моноблоки <b>Apple iMac</b> и рабочие станции <b>Intel Core i7 с 32 GB RAM</b>.\n\n` +
      `Для очных занятий приносить ноутбук <b>не обязательно</b>! Домашние задания можно выполнять как дома, так и в нашем бесплатном <b>24/7 студенческом коворкинге</b>.`;
  }

  if (rag.isDiplomaQuery) {
    return `📜 <b>Диплом и международная сертификация:</b>\n\n` +
      `После успешной защиты дипломного проекта каждый выпускник получает:\n` +
      `1. Официальный номерной <b>диплом и сертификат</b> на узбекском и английском языках.\n` +
      `2. QR-код для моментальной онлайн-верификации работодателями.\n` +
      `3. Портфолио из 4–6 готовых проектов на GitHub / Behance.\n` +
      `4. Прямые рекомендации и fast-track интервью в более чем 60 IT-компаний партнеров (EPAM, Payme, Uzum, TBC Bank, IT-Park).`;
  }

  if (rag.isZeroQuery) {
    return `🚀 <b>Можно ли начать обучение абсолютно с нуля?</b>\n\n` +
      `<b>Да, конечно!</b> Более 85% наших студентов никогда ранее не программировали.\n\n` +
      `Первые модули посвящены фундаментальной логике, алгоритмам и базовым инструментам. Менторы персонально помогают каждому студенту на практических занятиях и в коворкинге.`;
  }

  if (rag.isEnrollQuery) {
    return `🎁 <b>Бесплатный пробный урок в IT Academy!</b>\n\n` +
      `Вы можете посетить первое практическое занятие по любому направлению совершенно бесплатно. Ментор познакомит вас с технологиями и поможет написать первый проект.\n\n` +
      `Нажмите /enroll или кнопку «🎁 Записаться на урок» ниже, чтобы забронировать место!`;
  }

  // Общий приветливый ответ ИИ
  return `🤖 <b>ИИ-Консультант IT Academy на связи!</b>\n\n` +
    `Я подключен к базе знаний академии и могу подсказать:\n` +
    `• Программы 8 IT-курсов (Frontend, Python Backend, UI/UX, QA, AI...)\n` +
    `• Стоимость, скидки 15% и рассрочку на 6–12 месяцев\n` +
    `• Адреса кампусов в Ташкенте и условия круглосуточного коворкинга 24/7\n` +
    `• Запись на бесплатный пробный урок\n\n` +
    `<i>Вы можете выбрать пункт в меню ниже или написать интересующий вас вопрос!</i>`;
}

// ============================================================================
// УВЕДОМЛЕНИЕ АДМИНИСТРАТОРОВ О НОВЫХ ЗАЯВКАХ
// ============================================================================

async function notifyAdminsAboutLead(lead) {
  const text = `🚨 <b>НОВАЯ ЗАЯВКА НА ОБУЧЕНИЕ!</b>\n\n` +
    `👤 <b>Имя:</b> ${lead.name}\n` +
    `📱 <b>Телефон:</b> <code>${lead.phone}</code>\n` +
    `📚 <b>Курс:</b> ${lead.course || 'Не указан'}\n` +
    `🌐 <b>Источник:</b> ${lead.source === 'website' ? 'Веб-сайт IT Academy' : 'Telegram Бот (@ragm_bot)'}\n` +
    `🕒 <b>Дата и время:</b> ${lead.createdAt}\n` +
    `${lead.username ? `✈️ <b>Telegram:</b> @${lead.username}\n` : ''}` +
    `\n<i>Свяжитесь с абитуриентом в течение 15 минут!</i>`;

  if (config.admin_chat_ids && config.admin_chat_ids.length > 0) {
    for (const adminId of config.admin_chat_ids) {
      await sendMessage(adminId, text);
    }
  }
}

// Экспортная функция для server.js (заявки с сайта)
function handleWebsiteLead(leadData) {
  const lead = {
    id: 'lead_' + Date.now(),
    name: leadData.name || 'Аноним',
    phone: leadData.phone || '',
    course: leadData.course || 'Общая консультация',
    source: 'website',
    createdAt: new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' })
  };

  saveLead(lead);
  notifyAdminsAboutLead(lead);
  console.log(`[LEAD] Новая заявка с сайта от ${lead.name} (${lead.phone})`);
  return lead;
}

// ============================================================================
// ОБРАБОТЧИКИ КОМАНД И СООБЩЕНИЙ БОТА
// ============================================================================

async function handleCommand(chatId, text, message) {
  const userId = message.from?.id;
  const username = message.from?.username || message.from?.first_name || '';

  if (text.startsWith('/start')) {
    clearSession(userId);

    // Добавляем чат в админы если это первый запуск или спец-параметр
    if (!config.admin_chat_ids.includes(chatId)) {
      config.admin_chat_ids.push(chatId);
      saveConfig();
      console.log(`[BOT] Чат ${chatId} (${username}) добавлен в список получателей заявок`);
    }

    const welcome = `👋 <b>Добро пожаловать в IT ACADEMY UZBEKISTAN!</b>\n\n` +
      `Мы — практическая IT-академия нового поколения в Ташкенте. Готовим специалистов с нуля до первого оффера в ведущие IT-компании (EPAM, Payme, Uzum, TBC Bank).\n\n` +
      `🔥 <b>Наши преимущества:</b>\n` +
      `• 70% практики и реальные проекты\n` +
      `• 24/7 бесплатный коворкинг (iMac, Core i7 32GB, 1 Гбит/с)\n` +
      `• Senior-менторы из BigTech\n` +
      `• Помощь карьерного центра и гарантия собеседования\n\n` +
      `Выберите нужный раздел в меню ниже или просто задайте мне вопрос:`;

    await sendMessage(chatId, welcome, {
      reply_markup: getMainReplyKeyboard()
    });

    await sendMessage(chatId, `📚 <b>Популярные направления обучения:</b>\nВыберите курс для просмотра программы и цен:`, {
      reply_markup: getCoursesInlineKeyboard()
    });
    return;
  }

  if (text.startsWith('/courses')) {
    await sendMessage(chatId, `📚 <b>Каталог направлений IT Academy:</b>\n\nНажмите на интересующее направление, чтобы изучить подробную программу и стоимость:`, {
      reply_markup: getCoursesInlineKeyboard()
    });
    return;
  }

  if (text.startsWith('/enroll')) {
    const session = getSession(userId);
    session.state = 'ENROLL_NAME';
    session.data = { source: 'telegram_bot', username };

    await sendMessage(chatId, `🎁 <b>Запись на бесплатный вводный урок!</b>\n\nШаг 1 из 3: Как к вам обращаться? Напишите ваше <b>Имя</b>:`, {
      reply_markup: {
        keyboard: [[{ text: '❌ Отменить запись' }]],
        resize_keyboard: true,
        one_time_keyboard: true
      }
    });
    return;
  }

  if (text.startsWith('/quiz')) {
    const session = getSession(userId);
    session.state = 'QUIZ_1';
    session.data = { score: {} };

    await sendMessage(chatId, `🧩 <b>Тест профориентации: Какая IT-профессия вам подходит?</b>\n\n<i>Вопрос 1 из 3:</i> Что вам ближе по духу и интересам?`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🎨 Создавать визуал и удобные интерфейсы', callback_data: 'quiz1_design' }],
          [{ text: '💻 Писать логику сайтов и интерактив', callback_data: 'quiz1_front' }],
          [{ text: '⚙️ Базы данных, сервера и архитектура', callback_data: 'quiz1_back' }],
          [{ text: '🔍 Искать ошибки, тестировать системы', callback_data: 'quiz1_qa' }],
          [{ text: '🤖 Анализировать данные и обучать нейросети', callback_data: 'quiz1_ai' }]
        ]
      }
    });
    return;
  }

  if (text.startsWith('/calc')) {
    await sendMessage(chatId, `💰 <b>Интерактивный калькулятор обучения:</b>\n\nВыберите курс, для которого хотите рассчитать график платежей и рассрочку:`, {
      reply_markup: {
        inline_keyboard: COURSES.map(c => [
          { text: `${c.icon} ${c.shortTitle} (${c.pricePerMonthFormatted})`, callback_data: `calc_course_${c.id}` }
        ])
      }
    });
    return;
  }

  if (text.startsWith('/coworking')) {
    await sendMessage(chatId, `🏢 <b>Технологичный кампус и коворкинг 24/7:</b>\n\n` +
      `Студентам IT Academy доступен круглосуточный рабочий хаб в Ташкенте:\n\n` +
      `⚡ <b>Оснащение:</b>\n` +
      `• Моноблоки Apple iMac 27" и рабочие станции Intel Core i7 32GB RAM\n` +
      `• Оптоволоконный интернет 1 Гбит/с без задержек\n` +
      `• Кофе-поинты, чай, зоны отдыха и мягкие пуфы\n` +
      `• Тихие переговорные комнаты для командных спринтов и звонков\n\n` +
      `🕒 <b>Доступ:</b> 24 часа в сутки, 7 дней в неделю по электронному пропуску студента!`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🎁 Записаться на пробный урок в кампусе', callback_data: 'enroll_start' }]
          ]
        }
      });
    return;
  }

  if (text.startsWith('/contacts')) {
    await sendMessage(chatId, `📍 <b>Контакты и кампусы IT Academy в Ташкенте:</b>\n\n` +
      `🏢 <b>Главный кампус:</b>\n${CENTER_INFO.mainCampus}\n\n` +
      `🏢 <b>Филиал 2:</b>\n${CENTER_INFO.chilonzorCampus}\n\n` +
      `📞 <b>Телефон:</b> <code>${CENTER_INFO.phone}</code>\n` +
      `✈️ <b>Telegram-канал:</b> ${CENTER_INFO.telegram}\n` +
      `🕒 <b>Часы работы:</b> ${CENTER_INFO.hours}\n` +
      `⚡ <b>Коворкинг:</b> 24/7 для студентов.`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '📞 Позвонить', url: 'tel:+998712008800' }, { text: '🌐 Открыть сайт', url: config.web_url }]
          ]
        }
      });
    return;
  }

  if (text.startsWith('/faq')) {
    await sendMessage(chatId, `❓ <b>Часто задаваемые вопросы (FAQ):</b>\n\n` +
      `<b>1. Нужен ли свой ноутбук?</b>\nВ классах установлены мощные iMac и ПК. Для очных занятий ноутбук не нужен.\n\n` +
      `<b>2. Можно ли начать с нуля?</b>\nДа! 85% студентов начинают без предварительного опыта.\n\n` +
      `<b>3. Как работает рассрочка?</b>\nОфициальная рассрочка на 6–12 месяцев через Anorbank, Uzum Nasiya, Payme без первого взноса.\n\n` +
      `<b>4. Выдается ли диплом?</b>\nДа, диплом и международный сертификат с QR-кодом верификации.\n\n` +
      `<i>Задайте любой вопрос прямо в чат — наш ИИ-консультант ответит мгновенно!</i>`, {
        reply_markup: getMainReplyKeyboard()
      });
    return;
  }

  if (text.startsWith('/leads')) {
    const leads = loadLeads();
    if (leads.length === 0) {
      await sendMessage(chatId, `📋 В базе пока нет новых заявок.`);
      return;
    }
    const recent = leads.slice(0, 10);
    let msg = `📋 <b>Последние ${recent.length} заявок:</b>\n\n`;
    recent.forEach((l, idx) => {
      msg += `<b>#${idx + 1}</b> • ${l.createdAt}\n👤 <b>${l.name}</b>\n📱 <code>${l.phone}</code>\n📚 Курс: <i>${l.course || 'Не указан'}</i>\n🌐 Источник: ${l.source}\n\n`;
    });
    await sendMessage(chatId, msg);
    return;
  }

  if (text.startsWith('/app') || text.startsWith('/webapp')) {
    const url = getWebAppUrl();
    if (url && url.startsWith('https://')) {
      await sendMessage(chatId, `📱 <b>Telegram Mini App IT Academy</b>\n\nНажмите на кнопку ниже, чтобы открыть интерактивное мобильное приложение с курсами, квизом, калькулятором и ИИ-консультантом прямо в Telegram:`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🚀 Запустить Mini App IT Academy', web_app: { url } }]
          ]
        }
      });
    } else {
      await sendMessage(chatId, `📱 <b>Mini App IT Academy</b>\n\nПриложение доступно: <code>${config.web_url}/webapp</code>\nЧтобы открывать его по кнопке в Telegram на смартфоне, укажите HTTPS URL:\n<code>/set_webapp https://ваш-домен/webapp</code>`);
    }
    return;
  }

  if (text.startsWith('/set_webapp')) {
    const parts = text.split(/\s+/);
    if (parts.length < 2 || !parts[1].startsWith('https://')) {
      await sendMessage(chatId, `⚠️ Укажите валидный HTTPS адрес:\n<code>/set_webapp https://ваш-домен.loca.lt/webapp</code>`);
      return;
    }
    config.webapp_url = parts[1].trim();
    saveConfig();
    await setupMenuButton();
    await sendMessage(chatId, `✅ <b>URL Telegram Mini App успешно сохранен!</b>\nНовый адрес: <code>${config.webapp_url}</code>\nКнопка меню обновлена.`);
    return;
  }

  if (text.startsWith('/help')) {
    await sendMessage(chatId, `ℹ️ <b>Как пользоваться ботом IT Academy:</b>\n\n` +
      `• /app — Запустить интерактивный Telegram Mini App\n` +
      `• /courses — Каталог всех курсов, стек, программы и цены\n` +
      `• /enroll — Запись на бесплатный вводный мастер-класс\n` +
      `• /quiz — Профориентационный тест из 3 вопросов\n` +
      `• /calc — Калькулятор помесячной рассрочки и скидок\n` +
      `• /coworking — Информация о круглосуточном коворкинге\n` +
      `• /contacts — Адреса кампусов и телефоны\n` +
      `• /leads — Просмотр полученных заявок\n\n` +
      `💬 <b>ИИ-Консультант:</b> Вы можете просто написать любой вопрос в чат текстом, и ИИ ответит по базе знаний!`);
    return;
  }
}

// Обработка текстовых сообщений и FSM
async function handleTextMessage(message) {
  const chatId = message.chat.id;
  const text = message.text?.trim() || '';
  const userId = message.from?.id;
  const username = message.from?.username || message.from?.first_name || '';
  const session = getSession(userId);

  // Получение данных напрямую из Telegram Mini App (sendData)
  if (message.web_app_data) {
    try {
      const data = JSON.parse(message.web_app_data.data);
      const lead = {
        id: 'lead_' + Date.now(),
        name: data.name || 'Студент',
        phone: data.phone || 'Не указан',
        course: data.course || 'Не указан',
        source: 'telegram_mini_app',
        userId: userId,
        username: username,
        createdAt: new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' })
      };
      saveLead(lead);
      notifyAdminsAboutLead(lead);
      await sendMessage(chatId, `🎉 <b>Спасибо, ${lead.name}!</b>\n\nВаша заявка из <b>Telegram Mini App</b> на курс <b>${lead.course}</b> успешно принята!\nКоординатор свяжется с вами по номеру <code>${lead.phone}</code> в течение 15 минут.`);
    } catch (e) {
      console.error('[BOT] Ошибка обработки web_app_data:', e);
    }
    return;
  }

  // Команды
  if (text.startsWith('/')) {
    await handleCommand(chatId, text, message);
    return;
  }

  // Быстрая кнопка запуска Mini App
  if (text.includes('Mini App') || text === '🚀 Открыть Mini App 📱') {
    await handleCommand(chatId, '/app', message);
    return;
  }

  // Быстрые кнопки главного меню
  if (text === '🎓 Каталог курсов') {
    await sendMessage(chatId, `📚 <b>Каталог направлений IT Academy:</b>`, {
      reply_markup: getCoursesInlineKeyboard()
    });
    return;
  }

  if (text === '🎁 Записаться на урок') {
    await handleCommand(chatId, '/enroll', message);
    return;
  }

  if (text === '💡 Тест профессий') {
    await handleCommand(chatId, '/quiz', message);
    return;
  }

  if (text === '💰 Калькулятор рассрочки') {
    await handleCommand(chatId, '/calc', message);
    return;
  }

  if (text === '🏢 Кампус и коворкинг 24/7') {
    await handleCommand(chatId, '/coworking', message);
    return;
  }

  if (text === '📍 Контакты и адреса') {
    await handleCommand(chatId, '/contacts', message);
    return;
  }

  if (text === '❓ Частые вопросы (FAQ)') {
    await handleCommand(chatId, '/faq', message);
    return;
  }

  if (text === '💬 Задать вопрос ИИ') {
    await sendMessage(chatId, `🤖 Напишите любой ваш вопрос, например:\n<i>«Сколько стоит курс по Python?»</i> или <i>«Как получить скидку 15%?»</i>`);
    return;
  }

  if (text === '❌ Отменить запись') {
    clearSession(userId);
    await sendMessage(chatId, `Запись отменена. Возвращаю вас в главное меню:`, {
      reply_markup: getMainReplyKeyboard()
    });
    return;
  }

  // FSM: Сбор заявки
  if (session.state === 'ENROLL_NAME') {
    session.data.name = text;
    session.state = 'ENROLL_PHONE';

    await sendMessage(chatId, `Приятно познакомиться, <b>${text}</b>!\n\nШаг 2 из 3: Укажите ваш контактный <b>номер телефона</b> в формате <code>+998 XX XXX-XX-XX</code> (или нажмите кнопку «Отправить контакт» ниже):`, {
      reply_markup: {
        keyboard: [
          [{ text: '📱 Отправить мой контакт', request_contact: true }],
          [{ text: '❌ Отменить запись' }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
      }
    });
    return;
  }

  if (session.state === 'ENROLL_PHONE') {
    let phone = text;
    if (message.contact) {
      phone = message.contact.phone_number;
      if (!phone.startsWith('+')) phone = '+' + phone;
    }

    if (phone.replace(/\D/g, '').length < 9) {
      await sendMessage(chatId, `⚠️ Пожалуйста, введите корректный номер телефона (например, <code>+998 90 123-45-67</code>):`);
      return;
    }

    session.data.phone = phone;
    session.state = 'ENROLL_COURSE';

    await sendMessage(chatId, `Отлично! Номер <code>${phone}</code> сохранен.\n\nШаг 3 из 3: Выберите желаемое направление обучения:`, {
      reply_markup: {
        inline_keyboard: COURSES.map(c => [
          { text: `${c.icon} ${c.shortTitle}`, callback_data: `lead_course_${c.id}` }
        ])
      }
    });
    return;
  }

  // Обработка контакта, отправленного через кнопку
  if (message.contact && session.state === 'ENROLL_PHONE') {
    session.data.phone = message.contact.phone_number.startsWith('+') ? message.contact.phone_number : '+' + message.contact.phone_number;
    session.state = 'ENROLL_COURSE';

    await sendMessage(chatId, `Спасибо! Номер <code>${session.data.phone}</code> принят.\n\nШаг 3 из 3: Выберите направление:`, {
      reply_markup: {
        inline_keyboard: COURSES.map(c => [
          { text: `${c.icon} ${c.shortTitle}`, callback_data: `lead_course_${c.id}` }
        ])
      }
    });
    return;
  }

  // Обычный диалог -> RAG ИИ Консультант
  await callTelegram('sendChatAction', { chat_id: chatId, action: 'typing' });
  const aiResponse = await generateRAGAnswer(text, message.from);

  await sendMessage(chatId, aiResponse, {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🎁 Записаться на бесплатный урок', callback_data: 'enroll_start' }],
        [{ text: '📚 Каталог всех 8 курсов', callback_data: 'all_courses' }]
      ]
    }
  });
}

// Обработка Inline кнопок (Callback Queries)
async function handleCallbackQuery(callbackQuery) {
  const cqId = callbackQuery.id;
  const data = callbackQuery.data;
  const message = callbackQuery.message;
  const chatId = message?.chat?.id;
  const messageId = message?.message_id;
  const userId = callbackQuery.from?.id;
  const username = callbackQuery.from?.username || callbackQuery.from?.first_name || '';

  await answerCallbackQuery(cqId);

  // Возврат к списку курсов
  if (data === 'all_courses') {
    await editMessageText(chatId, messageId, `📚 <b>Каталог направлений IT Academy:</b>\nВыберите интересующий курс:`, {
      reply_markup: getCoursesInlineKeyboard()
    });
    return;
  }

  // Карточка конкретного курса
  if (data.startsWith('course_')) {
    const courseId = data.replace('course_', '');
    const course = COURSES.find(c => c.id === courseId);
    if (!course) return;

    const syllabusText = course.syllabus.map(s => `• ${s}`).join("\n");

    const text = `${course.icon} <b>${course.title}</b>\n\n` +
      `📝 <b>Описание:</b>\n${course.desc}\n\n` +
      `⏱ <b>Длительность:</b> ${course.duration}\n` +
      `🛠 <b>Стек технологий:</b>\n<code>${course.stack}</code>\n\n` +
      `💵 <b>Стоимость в месяц:</b> <b>${course.pricePerMonthFormatted}</b>\n` +
      `💳 <b>Рассрочка:</b> от <b>${Math.round(course.pricePerMonth / 2).toLocaleString('ru-RU')} сум/мес</b> на 12 мес.\n` +
      `🔥 <b>Скидка 15%:</b> ${course.fullPriceDiscount.toLocaleString('ru-RU')} сум при полной оплате.\n\n` +
      `📋 <b>Программа обучения:</b>\n${syllabusText}`;

    await editMessageText(chatId, messageId, text, {
      reply_markup: getCourseDetailsKeyboard(course.id)
    });
    return;
  }

  // Запуск записи на бесплатный урок
  if (data === 'enroll_start' || data.startsWith('enroll_for_')) {
    const preselectedCourse = data.startsWith('enroll_for_') ? data.replace('enroll_for_', '') : null;
    const session = getSession(userId);
    session.state = 'ENROLL_NAME';
    session.data = {
      source: 'telegram_bot',
      username,
      preselectedCourse
    };

    await sendMessage(chatId, `🎁 <b>Запись на бесплатный вводный мастер-класс!</b>\n\nШаг 1 из 3: Как к вам обращаться? Напишите ваше <b>Имя</b>:`, {
      reply_markup: {
        keyboard: [[{ text: '❌ Отменить запись' }]],
        resize_keyboard: true,
        one_time_keyboard: true
      }
    });
    return;
  }

  // Выбор курса при записи (Финальный шаг FSM)
  if (data.startsWith('lead_course_')) {
    const courseId = data.replace('lead_course_', '');
    const course = COURSES.find(c => c.id === courseId);
    const session = getSession(userId);

    const lead = {
      id: 'lead_' + Date.now(),
      name: session.data.name || 'Абитуриент',
      phone: session.data.phone || 'Не указан',
      course: course ? course.title : courseId,
      source: 'telegram_bot',
      userId: userId,
      username: username,
      createdAt: new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' })
    };

    saveLead(lead);
    notifyAdminsAboutLead(lead);
    clearSession(userId);

    const successText = `🎉 <b>Поздравляем, ${lead.name}!</b>\n\n` +
      `Ваша заявка на курс <b>${lead.course}</b> успешно принята!\n` +
      `📞 Контактный номер: <code>${lead.phone}</code>\n\n` +
      `Наш академический координатор свяжется с вами в течение 15 минут, чтобы подтвердить удобное время пробного урока в кампусе или онлайн.\n\n` +
      `📍 <i>Напоминаем: наш коворкинг в Ташкенте открыт 24/7!</i>`;

    await editMessageText(chatId, messageId, successText, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🏢 О коворкинге 24/7', callback_data: 'coworking_info' }],
          [{ text: '🌐 Открыть сайт IT Academy', url: config.web_url }]
        ]
      }
    });

    await sendMessage(chatId, `Главное меню доступно кнопками ниже 👇`, {
      reply_markup: getMainReplyKeyboard()
    });
    return;
  }

  // Калькулятор курса
  if (data === 'calc_start') {
    await editMessageText(chatId, messageId, `💰 <b>Калькулятор обучения IT Academy:</b>\n\nВыберите курс:`, {
      reply_markup: {
        inline_keyboard: COURSES.map(c => [
          { text: `${c.icon} ${c.shortTitle}`, callback_data: `calc_course_${c.id}` }
        ])
      }
    });
    return;
  }

  if (data.startsWith('calc_course_')) {
    const courseId = data.replace('calc_course_', '');
    const course = COURSES.find(c => c.id === courseId);
    if (!course) return;

    const calcText = `💰 <b>Расчет стоимости для курса:</b>\n` +
      `${course.icon} <b>${course.title}</b>\n\n` +
      `• <b>Длительность:</b> ${course.duration}\n` +
      `• <b>Обычная стоимость:</b> ${course.pricePerMonthFormatted}\n\n` +
      `📊 <b>Варианты оплаты:</b>\n` +
      `1️⃣ <b>Помесячно:</b> ${course.pricePerMonthFormatted}\n` +
      `2️⃣ <b>Единовременная оплата (-15%):</b> <b>${course.fullPriceDiscount.toLocaleString('ru-RU')} сум</b> (выгода ${(course.fullPrice - course.fullPriceDiscount).toLocaleString('ru-RU')} сум)\n` +
      `3️⃣ <b>Рассрочка на 6 месяцев:</b> <b>${Math.round(course.fullPrice / 6).toLocaleString('ru-RU')} сум/мес</b>\n` +
      `4️⃣ <b>Рассрочка на 12 месяцев:</b> <b>${Math.round(course.fullPrice / 12).toLocaleString('ru-RU')} сум/мес</b> (без первого взноса)`;

    await editMessageText(chatId, messageId, calcText, {
      reply_markup: {
        inline_keyboard: [
          [{ text: `📝 Записаться на ${course.shortTitle}`, callback_data: `enroll_for_${course.id}` }],
          [{ text: '💰 Выбрать другой курс', callback_data: 'calc_start' }],
          [{ text: '◀️ Каталог курсов', callback_data: 'all_courses' }]
        ]
      }
    });
    return;
  }

  // Квиз профориентации (Шаг 1 -> Шаг 2)
  if (data.startsWith('quiz1_')) {
    const choice1 = data.replace('quiz1_', '');
    const session = getSession(userId);
    session.data.choice1 = choice1;
    session.state = 'QUIZ_2';

    await editMessageText(chatId, messageId, `🧩 <b>Тест профориентации</b>\n\n<i>Вопрос 2 из 3:</i> Какой у вас текущий опыт в программировании или дизайне?`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🌱 Полный ноль, никогда не пробовал(а)', callback_data: 'quiz2_zero' }],
          [{ text: '💻 Пробовал(а) бесплатные уроки / читал(а)', callback_data: 'quiz2_basic' }],
          [{ text: '🚀 Имею технический бэкграунд / опыт', callback_data: 'quiz2_pro' }]
        ]
      }
    });
    return;
  }

  // Квиз (Шаг 2 -> Шаг 3)
  if (data.startsWith('quiz2_')) {
    const choice2 = data.replace('quiz2_', '');
    const session = getSession(userId);
    session.data.choice2 = choice2;
    session.state = 'QUIZ_3';

    await editMessageText(chatId, messageId, `🧩 <b>Тест профориентации</b>\n\n<i>Вопрос 3 из 3:</i> Какая ваша главная цель обучения?`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🎯 Сменить работу и получить оффер Junior+', callback_data: 'quiz3_career' }],
          [{ text: '💡 Запустить свой IT-стартап или проект', callback_data: 'quiz3_startup' }],
          [{ text: '🌍 Работать удаленно на зарубежные компании', callback_data: 'quiz3_remote' }]
        ]
      }
    });
    return;
  }

  // Квиз (Финал)
  if (data.startsWith('quiz3_')) {
    const session = getSession(userId);
    const choice1 = session.data.choice1;
    let recCourseId = 'frontend';

    if (choice1 === 'design') recCourseId = 'design';
    else if (choice1 === 'back') recCourseId = 'backend';
    else if (choice1 === 'qa') recCourseId = 'qa';
    else if (choice1 === 'ai') recCourseId = 'ai';
    else recCourseId = 'frontend';

    const course = COURSES.find(c => c.id === recCourseId);
    clearSession(userId);

    const resultText = `🎯 <b>Результаты теста: Вам идеально подходит направление!</b>\n\n` +
      `${course.icon} <b>${course.title}</b>\n\n` +
      `💡 <i>Почему именно это направление:</i>\n` +
      `Оно наилучшим образом сочетает ваши интересы, позволяет быстро стартовать с поддержкой ментора и имеет огромный спрос среди компаний-партнеров в Ташкенте.\n\n` +
      `• Срок обучения: ${course.duration}\n` +
      `• Стоимость: ${course.pricePerMonthFormatted}\n` +
      `• Результат: готовое портфолио и диплом`;

    await editMessageText(chatId, messageId, resultText, {
      reply_markup: {
        inline_keyboard: [
          [{ text: `🎁 Записаться на бесплатный урок по ${course.shortTitle}`, callback_data: `enroll_for_${course.id}` }],
          [{ text: '📚 Посмотреть все курсы', callback_data: 'all_courses' }]
        ]
      }
    });
    return;
  }

  if (data === 'coworking_info') {
    await sendMessage(chatId, `🏢 Наш коворкинг расположен в Ташкенте (IT-Park / м. БИЙ).\nСтуденты имеют круглосуточный 24/7 доступ к Apple iMac, скоростному интернету и кофе-поинтам. Ждем вас!`);
    return;
  }
}

// ============================================================================
// LONG POLLING LOOP
// ============================================================================
let isRunning = false;
let lastUpdateId = 0;

async function startPolling() {
  if (isRunning) return;
  isRunning = true;

  console.log(`\n======================================================`);
  console.log(`🤖 TELEGRAM BOT ЗАПУЩЕН УСПЕШНО: @${config.bot_username}`);
  console.log(`⚡ Бот готов принимать сообщения, заявки и отвечать через RAG`);
  console.log(`======================================================\n`);

  await setupBotCommands();
  await setupMenuButton();

  while (isRunning) {
    try {
      const url = `${TELEGRAM_API_BASE}/getUpdates?offset=${lastUpdateId + 1}&timeout=20`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          lastUpdateId = update.update_id;

          if (update.message) {
            handleTextMessage(update.message).catch(err => {
              console.error('[BOT ERROR] Ошибка обработки сообщения:', err);
            });
          } else if (update.callback_query) {
            handleCallbackQuery(update.callback_query).catch(err => {
              console.error('[BOT ERROR] Ошибка обработки callback:', err);
            });
          }
        }
      } else if (!data.ok) {
        console.warn('[BOT POLLING WARNING]:', data.description);
        await new Promise(r => setTimeout(r, 3000));
      }
    } catch (err) {
      // Игнорируем сетевые тайм-ауты или временные сбои
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

function stopPolling() {
  isRunning = false;
  console.log('[BOT] Бот остановлен.');
}

// Экспорт для использования в server.js и автономного запуска
module.exports = {
  startPolling,
  stopPolling,
  handleWebsiteLead,
  COURSES,
  CENTER_INFO,
  notifyAdminsAboutLead
};

// Если запущен напрямую: node bot.js
if (require.main === module) {
  startPolling();
}

