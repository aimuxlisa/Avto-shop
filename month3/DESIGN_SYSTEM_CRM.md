# AutoHub Design System & CRM UI Kit
> **Версия:** 1.0.0  
> **Назначение:** Официальная дизайн-система маркетплейса **AutoHub** для разработки отдельного CRM / SRM сервиса (управление лидами, тест-драйвами, каталогом авто, записями на сервис и базой знаний Turso).  
> **Стиль:** Cyber-Luxury Dark Mode / High-Tech Automotive Glassmorphism.

---

## Содержание
1. [Философия и ДНК Бренда](#1-философия-и-днк-бренда)
2. [Цветовая палитра и токены (Color Tokens)](#2-цветовая-палитра-и-токены-color-tokens)
3. [Типографика (Typography)](#3-типографика-typography)
4. [Эффекты, свечения и Glassmorphism](#4-эффекты-свечения-и-glassmorphism)
5. [Готовые конфиги: Tailwind & CSS](#5-готовые-конфиги-tailwind--css)
6. [Библиотека иконок (Lucide Icons Guide)](#6-библиотека-иконок-lucide-icons-guide)
7. [UI Компоненты для CRM](#7-ui-компоненты-для-crm)
   - 7.1. Кнопки (Buttons & Action Chips)
   - 7.2. Поля ввода и фильтры (Inputs, Selects, Search)
   - 7.3. Статусные бейджи (Status Badges & Tags)
   - 7.4. Метрики и KPI карточки (Stat Cards)
   - 7.5. Таблицы данных CRM (Data Tables)
   - 7.6. Канбан / Pipeline карточки (Deal Cards)
   - 7.7. Модальные окна и Side-панели (Modals & Drawers)
8. [Архитектура данных CRM (Entities Schema)](#8-архитектура-данных-crm-entities-schema)
9. [Рекомендуемый стек для нового проекта CRM](#9-рекомендуемый-стек-для-нового-проекта-crm)

---

## 1. Философия и ДНК Бренда

- **Visual Style:** Футуристичный темный интерфейс (Deep Space Black & Navy) с акцентным неоновым нео-цифровым свечением (Neon Cyan / Electric Blue).
- **Ощущение:** Премиальный дилерский центр спорткаров и электромобилей (Porsche, Tesla, Lucid, BMW M). Интерфейс должен выглядеть как бортовой компьютер гиперкара.
- **Ключевые приемы:**
  - Глубокий темный фон `#050914` без чистого черного `#000000`.
  - Атмосферный неоновый градиентный свет на фоне (Radial Ambient Glow).
  - Полупрозрачные стеклянные карточки `glass-card` с размытием `backdrop-filter: blur(18px)`.
  - Тонкие неоновые рамки `border border-cyan-500/20` с эффектом подсветки при ховере.
  - Мягкие тени с цветным неоновым ореолом `shadow-[0_0_25px_-3px_rgba(56,189,248,0.6)]`.

---

## 2. Цветовая палитра и токены (Color Tokens)

### 2.1. Основные фоновые цвета (Background & Surface)
| Токен | HEX / RGBA | Назначение |
| :--- | :--- | :--- |
| **Canvas Background** | `#050914` | Главный фон приложения / body |
| **Secondary Background** | `#060B19` | Альтернативный фон секций, модальных оверлеев |
| **Card Glass Surface** | `rgba(13, 22, 44, 0.65)` | Поверхность стеклянных карточек CRM |
| **Card Glass Hover** | `rgba(18, 30, 58, 0.80)` | Состояние карточки при наведении |
| **Input Glass Surface** | `rgba(10, 18, 36, 0.70)` | Фон полей ввода, селектов и поиска |
| **Card Border Subtle** | `rgba(56, 189, 248, 0.20)` | Базовая рамка карточек |
| **Card Border Active** | `rgba(56, 189, 248, 0.50)` | Активная рамка при фокусе или ховере |

### 2.2. Неоновые и брендовые акценты (Brand & Accents)
| Название | HEX | Tailwind класс | Применение |
| :--- | :--- | :--- | :--- |
| **Neon Sky / Cyan** | `#38BDF8` | `text-cyan-400`, `bg-cyan-400` | Главный неоновый акцент, активные иконки, свечения |
| **Electric Blue** | `#2563EB` | `bg-blue-600` | Градиенты кнопок, фоновые лучи |
| **Glow Cyan Deep** | `#06B6D4` | `text-cyan-500`, `bg-cyan-500` | Вторичный акцент, бейджи |
| **Navy Accent** | `#1E3A8A` | `bg-blue-900` | Глубокие тени и фоновые пятна |

### 2.3. Семантические статусы CRM (Status & Feedback)
| Статус | HEX | Цвет текста & бейджа | Назначение в CRM |
| :--- | :--- | :--- | :--- |
| **Success / Live** | `#10B981` | `text-emerald-400` / `bg-emerald-500/15 border-emerald-500/30` | Оплачено, тест-драйв подтвержден, сделка закрыта, активная база |
| **Warning / Pending** | `#F59E0B` | `text-amber-400` / `bg-amber-500/15 border-amber-500/30` | Новый лид, ожидает ответа, требует внимания |
| **Urgent / Danger** | `#F43F5E` | `text-rose-400` / `bg-rose-500/15 border-rose-500/30` | Отказ, просроченная заявка, ошибка, кнопка удаления |
| **Info / Tech** | `#38BDF8` | `text-cyan-400` / `bg-cyan-500/15 border-cyan-400/30` | Сервисные напоминания, тип авто (EV), VIP статус |

### 2.4. Текст (Typography Hierarchy)
| Роль | HEX | Tailwind класс | Описание |
| :--- | :--- | :--- | :--- |
| **Headings** | `#FFFFFF` | `text-white` | Заголовки, суммы, цены, имена клиентов |
| **Body Primary** | `#F8FAFC` | `text-slate-100` | Основной читаемый текст |
| **Body Secondary** | `#94A3B8` | `text-slate-300` / `text-slate-400` | Описания, метаданные, лейблы полей |
| **Muted / Disabled** | `#64748B` | `text-slate-500` | Плейсхолдеры, отключенные элементы |

---

## 3. Типографика (Typography)

- **Основной шрифт:** `Plus Jakarta Sans` (Google Fonts)
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  ```
- **Правило CSS:**
  ```css
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  ```

### Шкала размеров для CRM:
- `text-[10px]` — Верхний регистр, трекинг `tracking-wider`, `font-bold` (статусы, бейджи, подписи колонок).
- `text-xs` (12px) — Лейблы инпутов, второстепенные строки таблиц, кнопки тулбара.
- `text-sm` (14px) — Основной текст CRM, значения ячеек таблицы, пункты меню навигации.
- `text-base` (16px) — Имена клиентов, названия автомобилей, заголовки карточек.
- `text-xl` (20px) — Заголовки модалок, блоков статистики.
- `text-2xl` – `text-3xl` (24–30px) — KPI метрики, общая выручка, счетчики заявок.

---

## 4. Эффекты, свечения и Glassmorphism

### Стеклянный градиент фона (Atmospheric Ambient Backdrop)
Поместите этот контейнер фиксированно на задний план любого экрана CRM:
```html
<div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
  <!-- Верхний центральный луч -->
  <div class="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[550px] bg-gradient-to-b from-cyan-500/15 via-blue-600/10 to-transparent rounded-full blur-[140px]" />
  <!-- Левая неоновая сфера -->
  <div class="absolute top-[28%] -left-32 w-[550px] h-[550px] bg-cyan-600/10 rounded-full blur-[160px]" />
  <!-- Правая лазурная сфера -->
  <div class="absolute top-[55%] -right-32 w-[600px] h-[600px] bg-blue-600/12 rounded-full blur-[170px]" />
</div>
```

### Карточки Glassmorphism (CSS спецификация)
```css
/* Базовое стекло */
.glass-card {
  background: rgba(13, 22, 44, 0.65);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(56, 189, 248, 0.2);
  box-shadow: 0 10px 35px 0 rgba(0, 0, 0, 0.45);
}

/* Стекло с анимацией наведения для интерактивных списков */
.glass-card-hover {
  background: rgba(13, 22, 44, 0.65);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(56, 189, 248, 0.2);
  box-shadow: 0 10px 35px 0 rgba(0, 0, 0, 0.45);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.glass-card-hover:hover {
  background: rgba(18, 30, 58, 0.8);
  border-color: rgba(56, 189, 248, 0.5);
  box-shadow: 0 12px 40px -5px rgba(56, 189, 248, 0.3), 0 0 20px rgba(56, 189, 248, 0.2);
  transform: translateY(-2px);
}
```

---

## 5. Готовые конфиги: Tailwind & CSS

### 5.1. `tailwind.config.js` для отдельного проекта CRM
Скопируйте в корень вашей CRM:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050914",
        canvasDark: "#060B19",
        card: "rgba(13, 22, 44, 0.65)",
        cardBorder: "rgba(56, 189, 248, 0.2)",
        neonBlue: "#38BDF8",
        accentBlue: "#2563EB",
        glowCyan: "#06b6d4",
      },
      boxShadow: {
        'neon-blue': '0 0 20px -2px rgba(56, 189, 248, 0.5), 0 0 10px -2px rgba(37, 99, 235, 0.5)',
        'neon-btn-hover': '0 0 35px 3px rgba(56, 189, 248, 0.85), 0 0 20px 2px rgba(37, 99, 235, 0.7)',
        'glow-sm': '0 0 12px rgba(56, 189, 248, 0.4)',
        'glass': '0 10px 35px 0 rgba(0, 0, 0, 0.45)',
      },
      backdropBlur: {
        'glass': '18px',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
```

### 5.2. `src/index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    background-color: #050914;
    color: #f8fafc;
    overflow-x: hidden;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  ::selection {
    background-color: #38bdf8;
    color: #050914;
  }
}

@layer utilities {
  .bg-autohub-ambient {
    background-color: #050914;
    background-image: 
      radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.18) 0%, rgba(37, 99, 235, 0.08) 35%, transparent 70%),
      radial-gradient(circle at 10% 30%, rgba(37, 99, 235, 0.12) 0%, transparent 40%),
      radial-gradient(circle at 90% 60%, rgba(56, 189, 248, 0.14) 0%, transparent 45%),
      radial-gradient(circle at 50% 90%, rgba(30, 58, 138, 0.2) 0%, transparent 60%);
  }

  .glass-card {
    background: rgba(13, 22, 44, 0.65);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border: 1px solid rgba(56, 189, 248, 0.2);
    box-shadow: 0 10px 35px 0 rgba(0, 0, 0, 0.45);
  }

  .glass-input {
    background: rgba(10, 18, 36, 0.7);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(56, 189, 248, 0.25);
    transition: all 0.2s ease-in-out;
  }

  .glass-input:focus {
    outline: none;
    border-color: #38bdf8;
    box-shadow: 0 0 15px rgba(56, 189, 248, 0.35);
  }

  .btn-neon {
    background: linear-gradient(135deg, #2563EB 0%, #38BDF8 100%);
    box-shadow: 0 0 25px -3px rgba(56, 189, 248, 0.6), 0 0 12px -2px rgba(37, 99, 235, 0.4);
    transition: all 0.25s ease-in-out;
  }

  .btn-neon:hover {
    box-shadow: 0 0 35px 3px rgba(56, 189, 248, 0.85), 0 0 20px 2px rgba(37, 99, 235, 0.7);
    transform: translateY(-1px) scale(1.02);
  }

  .btn-neon:active {
    transform: translateY(1px) scale(0.98);
  }

  .btn-outline-neon {
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(56, 189, 248, 0.4);
    backdrop-filter: blur(12px);
    box-shadow: 0 0 15px rgba(56, 189, 248, 0.15);
    transition: all 0.25s ease-in-out;
  }

  .btn-outline-neon:hover {
    border-color: #38bdf8;
    background: rgba(56, 189, 248, 0.12);
    box-shadow: 0 0 20px rgba(56, 189, 248, 0.4);
    transform: translateY(-1px);
  }

  /* Тонкий кастомный скроллбар */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: #050914;
  }
  ::-webkit-scrollbar-thumb {
    background: #1e293b;
    border-radius: 4px;
    border: 1px solid rgba(56, 189, 248, 0.2);
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #38bdf8;
  }
}
```

---

## 6. Библиотека иконок (Lucide Icons Guide)

В проекте используется `lucide-react`. Рекомендуемые соответствия для CRM:

| Сущность CRM | Иконка Lucide | Пример кода |
| :--- | :--- | :--- |
| **Панель / Дашборд** | `LayoutDashboard` | `<LayoutDashboard className="w-4 h-4 text-cyan-400" />` |
| **Клиенты / Лиды** | `Users`, `UserCheck` | `<Users className="w-4 h-4 text-cyan-400" />` |
| **Тест-драйвы (Букинг)** | `CalendarCheck`, `Key` | `<CalendarCheck className="w-4 h-4 text-cyan-400" />` |
| **Автопарк / Склад** | `Car`, `Layers` | `<Car className="w-4 h-4 text-cyan-400" />` |
| **Сделки / Финансы** | `DollarSign`, `BadgePercent` | `<DollarSign className="w-4 h-4 text-emerald-400" />` |
| **Сервис и ТО** | `Wrench`, `Activity` | `<Wrench className="w-4 h-4 text-amber-400" />` |
| **База знаний / Turso** | `Database`, `Sparkles` | `<Database className="w-4 h-4 text-cyan-400" />` |
| **Аналитика & Отчеты** | `TrendingUp`, `BarChart3` | `<TrendingUp className="w-4 h-4 text-cyan-400" />` |
| **Настройки** | `Settings`, `ShieldCheck` | `<Settings className="w-4 h-4 text-slate-400" />` |

---

## 7. UI Компоненты для CRM

### 7.1. Кнопки (Buttons)

#### Основная неоновая кнопка (Primary Action)
```tsx
<button className="py-2.5 px-5 rounded-xl btn-neon text-xs font-bold text-white tracking-wide flex items-center justify-center gap-2 shadow-lg">
  <span>Создать сделку</span>
  <ArrowRight className="w-3.5 h-3.5" />
</button>
```

#### Вторичная стеклянная кнопка (Secondary Outline)
```tsx
<button className="py-2.5 px-4 rounded-xl btn-outline-neon text-xs font-semibold text-slate-200 flex items-center gap-2">
  <Filter className="w-3.5 h-3.5 text-cyan-400" />
  <span>Фильтры</span>
</button>
```

#### Иконка-кнопка тулбара (Icon Action)
```tsx
<button className="p-2.5 rounded-xl glass-card text-slate-300 hover:text-white hover:border-cyan-400/50 transition-colors">
  <RefreshCw className="w-4 h-4" />
</button>
```

---

### 7.2. Поля ввода и фильтры (Inputs & Selects)

#### Поле поиска (Search Input)
```tsx
<div className="relative flex-1">
  <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
  <input
    type="text"
    placeholder="Поиск по имени, VIN, телефону, модели авто..."
    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500"
  />
</div>
```

#### Выпадающий список (Glass Select)
```tsx
<select className="glass-card px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 border border-cyan-500/30 focus:outline-none focus:border-cyan-400">
  <option value="all" className="bg-[#0a1224] text-white">Все статусы</option>
  <option value="new" className="bg-[#0a1224] text-white">Новые заявки</option>
  <option value="in-progress" className="bg-[#0a1224] text-white">В работе</option>
  <option value="done" className="bg-[#0a1224] text-white">Успешно завершен</option>
</select>
```

---

### 7.3. Статусные бейджи (Status Badges)

```tsx
{/* 1. Новый лид (Cyan Glow) */}
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-[11px] font-bold text-cyan-300">
  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
  Новый лид
</span>

{/* 2. Подтверждено / Оплачено (Emerald) */}
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
  Подтверждено
</span>

{/* 3. Требует внимания / Ожидает (Amber) */}
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-[10px] font-bold text-amber-300 uppercase tracking-wider">
  <Clock className="w-3 h-3 text-amber-400" />
  Ожидает звонка
</span>

{/* 4. Отмена / Отказ (Rose) */}
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/15 border border-rose-500/30 text-[10px] font-bold text-rose-300 uppercase tracking-wider">
  <X className="w-3 h-3 text-rose-400" />
  Отказ
</span>
```

---

### 7.4. Метрики и KPI карточки (Stat Cards)

```tsx
<div className="glass-card p-5 rounded-2xl border border-cyan-500/20 relative overflow-hidden group">
  <div className="flex items-center justify-between mb-3">
    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Активные Тест-Драйвы</span>
    <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-400/30 shadow-[0_0_12px_rgba(56,189,248,0.3)]">
      <CalendarCheck className="w-4 h-4" />
    </div>
  </div>
  <div className="flex items-baseline gap-2">
    <span className="text-3xl font-black text-white tracking-tight">48</span>
    <span className="text-xs font-bold text-emerald-400 flex items-center">
      +14% <TrendingUp className="w-3 h-3 ml-0.5" />
    </span>
  </div>
  <p className="text-[11px] text-slate-400 mt-2">За последние 7 дней</p>
</div>
```

---

### 7.5. Таблицы данных CRM (Data Tables)

```tsx
<div className="glass-card rounded-2xl border border-cyan-500/20 overflow-hidden">
  <div className="overflow-x-auto">
    <table className="w-full text-left text-xs text-slate-300">
      <thead className="bg-[#0a1224]/80 text-slate-400 uppercase tracking-wider font-bold border-b border-cyan-500/15">
        <tr>
          <th className="py-3.5 px-4">Клиент</th>
          <th className="py-3.5 px-4">Автомобиль</th>
          <th className="py-3.5 px-4">Дата / Слот</th>
          <th className="py-3.5 px-4">Локация (Шоурум)</th>
          <th className="py-3.5 px-4">Статус</th>
          <th className="py-3.5 px-4 text-right">Действие</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-cyan-500/10">
        <tr className="hover:bg-cyan-500/5 transition-colors">
          <td className="py-3.5 px-4">
            <div className="font-bold text-white">Александр Иванов</div>
            <div className="text-[11px] text-slate-400">+7 (999) 456-78-90</div>
          </td>
          <td className="py-3.5 px-4">
            <div className="font-semibold text-cyan-300">Porsche Taycan 4S</div>
            <div className="text-[10px] text-slate-500">Electric • 530 HP</div>
          </td>
          <td className="py-3.5 px-4">
            <div className="text-white">15 Сен 2026</div>
            <div className="text-[11px] text-slate-400">14:00 - 15:00</div>
          </td>
          <td className="py-3.5 px-4 text-slate-300">Ленинградский проспект, 39</td>
          <td className="py-3.5 px-4">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
              Подтвержден
            </span>
          </td>
          <td className="py-3.5 px-4 text-right">
            <button className="py-1 px-3 rounded-lg btn-outline-neon text-[11px] font-bold text-white">
              Открыть
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

---

### 7.6. Канбан / Pipeline карточки (Deal Cards)

```tsx
<div className="glass-card-hover p-4 rounded-xl border border-cyan-500/20 space-y-3 cursor-grab">
  <div className="flex items-center justify-between">
    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
      Лид с сайта
    </span>
    <span className="text-xs font-black text-white">$89,000</span>
  </div>
  
  <div>
    <h4 className="text-sm font-bold text-white">Михаил Смирнов</h4>
    <p className="text-xs text-slate-400">Интересуется: Zeekr 001 You Edition</p>
  </div>

  <div className="pt-2 border-t border-cyan-500/10 flex items-center justify-between text-[11px] text-slate-400">
    <span className="flex items-center gap-1">
      <Clock className="w-3 h-3 text-cyan-400" /> 12 мин назад
    </span>
    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
      Тест-драйв назначен
    </span>
  </div>
</div>
```

---

### 7.7. Модальные окна (Modal Windows)

```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
  {/* Backdrop */}
  <div className="fixed inset-0 bg-[#050914]/85 backdrop-blur-xl" />

  {/* Modal Window Container */}
  <div className="relative w-full max-w-2xl glass-card rounded-3xl border border-cyan-500/30 p-6 sm:p-8 z-10 shadow-2xl">
    <div className="flex items-center justify-between pb-4 mb-5 border-b border-cyan-500/20">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30">
          <Key className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Карточка Тест-Драйва #TD-8492</h3>
          <p className="text-xs text-slate-400">Создано через онлайн-виджет бронирования</p>
        </div>
      </div>
      <button className="p-2 rounded-xl glass-card text-slate-400 hover:text-white">
        <X className="w-5 h-5" />
      </button>
    </div>

    {/* Содержимое формы модалки */}
    <div className="space-y-4">
      ...
    </div>
  </div>
</div>
```

---

## 8. Архитектура данных CRM (Entities Schema)

Для полной совместимости с основным сайтом AutoHub используйте следующую модель данных в базе CRM:

### 8.1. Тест-драйв / Заявка (Lead / Test Drive Booking)
```typescript
interface BookingLead {
  id: string;                      // "td_1726312891"
  clientName: string;              // "Иван Петров"
  phone: string;                   // "+7 (999) 000-00-00"
  email: string;                   // "ivan@example.com"
  carId: string;                   // "tesla-3", "zeekr-001", "porsche-taycan"
  carName: string;                 // "Tesla Model 3 Performance"
  showroom: string;                // "San Francisco Tech Showroom" | "г. Москва, Ленинградский проспект, 39"
  date: string;                    // "2026-09-16"
  timeSlot: string;                // "14:00 - 15:00"
  status: 'new' | 'confirmed' | 'completed' | 'cancelled';
  managerComment?: string;
  createdAt: string;
}
```

### 8.2. Запись на сервис (Service Appointment)
На основе `src/data/business.ts`:
```typescript
interface ServiceTicket {
  id: string;
  clientName: string;
  phone: string;
  carBrandModel: string;           // "Zeekr 001"
  serviceType: 
    | 'Комплексная диагностика (120 точек)'
    | 'ТО (Замена масла, фильтров)'
    | 'Ремонт и диагностика электромобилей'
    | 'Шиномонтаж и балансировка'
    | 'Детейлинг, полировка и керамика'
    | 'Trade-In оценка';
  estimatedCost: string;           // "от 4 900 ₽"
  date: string;
  status: 'in_queue' | 'in_progress' | 'ready_for_pickup' | 'archived';
}
```

### 8.3. FAQ & Запросы клиентов (Turso DB Integration)
На основе `src/types/chat.types.ts`:
```typescript
interface QAEntry {
  id: string;
  question: string;
  answer?: string;
  asked_count: number;
  status: 'pending' | 'answered';
  created_at: string;
  answered_at?: string;
}
```

---

## 9. Рекомендуемый стек для нового проекта CRM

Чтобы полностью соответствовать архитектуре основного сайта:

1. **Framework:** Next.js 14 (App Router) или Vite + React 18 / TypeScript
2. **Styling:** Tailwind CSS 3.4 + Vanilla CSS стеклянные утилиты
3. **Icons:** `lucide-react`
4. **Анимации:** `framer-motion` (плавные модалки, `layoutId` для переключателей табов и канбан-карточек)
5. **База данных:** Turso (libSQL) — уже настроена и подключена в основном проекте (`@libsql/client`)
6. **Конфетти для закрытых сделок:** `canvas-confetti` (уже используется в BookingModal)

---
*Документация сгенерирована из кодовой базы AutoHub Marketplace.*
