# AvtoHu-бот на Python (aiogram 3 + Google Gemini)

Telegram-бот для ответов на вопросы через Google Gemini (модель `gemini-2.5-flash`).

## Структура проекта

```
avtohu-bot/
├── bot.py              # основной код бота
├── requirements.txt    # зависимости
├── .env.example        # шаблон переменных окружения
├── .env                # секреты (заполните своими данными)
└── .gitignore
```

## Шаг 1. Получить токен бота в @BotFather

1. Откройте в Telegram бота @BotFather.
2. Отправьте команду `/newbot`.
3. Введите имя бота (например, `AvtoHu bot`) и username (например, `AvtoHu_bot`).
4. BotFather пришлёт токен вида `123456789:AA...`. Скопируйте его.

## Шаг 2. Получить API-ключ в Google AI Studio

1. Откройте https://aistudio.google.com/apikey и войдите в Google-аккаунт.
2. Нажмите **Create API key**, выберите проект, скопируйте ключ.
3. Проверьте, что для модели `gemini-2.5-flash` доступен бесплатный тариф (Free tier).

## Шаг 3. Установить Python

Скачайте Python 3.10+ с https://www.python.org/downloads/ (на Windows при установке отметьте галочку **Add python.exe to PATH**).

## Шаг 4. Виртуальное окружение и зависимости

### Windows (PowerShell)

```powershell
cd C:\Users\User\OneDrive\Desktop\dz\month2\avtohu-bot
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Linux / macOS

```bash
cd avtohu-bot
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Шаг 5. Файл .env

Скопируйте `.env.example` в `.env` и подставьте свои ключи (либо оставьте уже заполненный `.env`):

```
BOT_TOKEN=ваш_токен_от_BotFather
GEMINI_API_KEY=ваш_ключ_от_Google_AI_Studio
```

## Шаг 6. Запуск

```powershell
python bot.py
```

Бот запущен. Напишите ему `/start`, а затем любой вопрос — он ответит через Gemini.

## Как это работает

- `/start` — приветствие и подсказка.
- Любое текстовое сообщение уходит в Gemini; пока модель генерирует ответ, бот показывает индикатор «печатает...».
- Длинные ответы (больше 4096 символов) разбиваются на несколько сообщений.
- При ошибке Gemini бот вежливо сообщает об этом, а не падает.

## Важно про безопасность

- Файл `.env` нельзя публиковать и добавлять в git (он уже в `.gitignore`).
- Если ключи попадали в открытый доступ — перевыпустите их:
  - BotFather: `/revoke` — отозвать старый токен и получить новый.
  - Google AI Studio: удалить старый ключ и создать новый.