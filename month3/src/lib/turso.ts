import { QAEntry } from '../types/chat.types';
import { normalizeQuestion, calculateSimilarity } from './qaMatch';

const TURSO_URL = process.env.NEXT_PUBLIC_TURSO_DATABASE_URL || process.env.TURSO_DATABASE_URL || 'https://avto-muxlisa.aws-ap-northeast-1.turso.io';
const TURSO_TOKEN = process.env.NEXT_PUBLIC_TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODkxMzA0ODcsImlkIjoiMDFhMDkwN2EtZGEwMS03OGJiLWJhODctM2Y3NDEzMTFiYjg1Iiwia2lkIjoiTVZVdHdoSGh3RjZuVDFIeUR3REhUYmJLWTRLeUdwQ0VDMG1jeWhIYnBBayIsInJpZCI6Ijg0ODY1OGZlLTkyNTMtNGQ5ZS1hMWQwLWI3NWJlNWYxMjZlOSJ9.iF8qpRpTmE7LDG0XuDObyRcgxhwzJPKWS2xsDlK_93ZS93ptILrpAisQabiRjcj4T7nItc22RVKgnBcggp4SCA';

const LOCAL_STORAGE_KEY = 'autohub_turso_questions_v2';

// Начальные демонстрационные вопросы для FAQ
const DEFAULT_INITIAL_QUESTIONS: QAEntry[] = [
  {
    id: 'faq-1',
    question: 'Можно ли приехать со своими запчастями и маслом?',
    normalized_question: 'можно ли приехать со своими запчастями и маслом',
    answer: 'Да, вы можете привезти свои оригинальные запчасти или сертифицированное масло. Мы выполним работы с гарантией на саму установку.',
    status: 'answered',
    asked_count: 14,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    answered_at: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 'faq-2',
    question: 'Есть ли у вас зона ожидания для клиентов?',
    normalized_question: 'есть ли у вас зона ожидания для клиентов',
    answer: 'Да, в нашем центре оборудована комфортная клиентская лаунж-зона с панорамным видом на сервисную зону, зерновым кофе, Wi-Fi и PS5.',
    status: 'answered',
    asked_count: 9,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    answered_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'faq-3',
    question: 'Сколько стоит полировка кузова керамикой для кроссовера?',
    normalized_question: 'сколько стоит полировка кузова керамикой для кроссовера',
    answer: null,
    status: 'pending',
    asked_count: 3,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    answered_at: null
  }
];

let dbInitialized = false;

function getNormalizedTursoHttpUrl(url: string): string {
  let u = url.trim();
  if (u.startsWith('libsql://')) {
    u = 'https://' + u.slice('libsql://'.length);
  }
  if (!u.startsWith('http://') && !u.startsWith('https://')) {
    u = 'https://' + u;
  }
  return u.replace(/\/+$/, '');
}

/**
 * Выполнение SQL запроса к Turso HTTP API
 */
async function executeTursoQuery(sql: string, args: any[] = []): Promise<any> {
  const endpoint = `${getNormalizedTursoHttpUrl(TURSO_URL)}/v2/pipeline`;
  
  const formattedArgs = args.map(arg => {
    if (arg === null || arg === undefined) return { type: 'null' };
    if (typeof arg === 'number') {
      return Number.isInteger(arg) ? { type: 'integer', value: arg.toString() } : { type: 'float', value: arg };
    }
    if (typeof arg === 'boolean') return { type: 'integer', value: arg ? '1' : '0' };
    return { type: 'text', value: String(arg) };
  });

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TURSO_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [
        {
          type: 'execute',
          stmt: {
            sql,
            args: formattedArgs
          }
        },
        { type: 'close' }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Turso HTTP Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const execResult = data.results?.[0]?.response?.result;
  return execResult;
}

/**
 * Автоматическая инициализация схемы таблицы в Turso
 */
async function initTursoSchema() {
  if (dbInitialized) return;
  try {
    await executeTursoQuery(`
      CREATE TABLE IF NOT EXISTS questions (
        id TEXT PRIMARY KEY,
        question TEXT NOT NULL,
        normalized_question TEXT NOT NULL,
        answer TEXT,
        status TEXT DEFAULT 'pending',
        asked_count INTEGER DEFAULT 1,
        created_at TEXT NOT NULL,
        answered_at TEXT
      );
    `);

    // Проверяем, есть ли уже записи. Если база пуста, добавляем начальные демо-вопросы
    const countRes = await executeTursoQuery(`SELECT COUNT(*) as cnt FROM questions;`);
    const countVal = countRes?.rows?.[0]?.[0]?.value || countRes?.rows?.[0]?.value;
    const count = parseInt(countVal || '0', 10);
    
    if (count === 0) {
      for (const item of DEFAULT_INITIAL_QUESTIONS) {
        await executeTursoQuery(
          `INSERT INTO questions (id, question, normalized_question, answer, status, asked_count, created_at, answered_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
          [item.id, item.question, item.normalized_question, item.answer, item.status, item.asked_count, item.created_at, item.answered_at]
        );
      }
    }
    dbInitialized = true;
  } catch (err) {
    console.warn('Failed to init Turso schema, falling back to local mode:', err);
  }
}

/**
 * Получить все вопросы из Turso (с локальным кэшем и fallback)
 */
export async function getQuestionsFromDb(): Promise<QAEntry[]> {
  try {
    await initTursoSchema();
    const result = await executeTursoQuery(
      `SELECT id, question, normalized_question, answer, status, asked_count, created_at, answered_at 
       FROM questions ORDER BY asked_count DESC, created_at DESC;`
    );

    if (result && result.rows) {
      const cols = result.cols?.map((c: any) => c.name) || ['id', 'question', 'normalized_question', 'answer', 'status', 'asked_count', 'created_at', 'answered_at'];
      const entries: QAEntry[] = result.rows.map((row: any[]) => {
        const obj: any = {};
        row.forEach((cell, idx) => {
          const colName = cols[idx];
          obj[colName] = cell?.value ?? null;
        });
        return {
          id: String(obj.id || ''),
          question: String(obj.question || ''),
          normalized_question: String(obj.normalized_question || ''),
          answer: obj.answer ? String(obj.answer) : null,
          status: (obj.status as 'pending' | 'answered') || 'pending',
          asked_count: parseInt(obj.asked_count || '1', 10),
          created_at: String(obj.created_at || new Date().toISOString()),
          answered_at: obj.answered_at ? String(obj.answered_at) : null
        };
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
      }
      return entries;
    }
  } catch (err) {
    console.warn('Could not fetch from Turso directly, checking localStorage/defaults:', err);
  }

  // Local storage fallback
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
  }
  return DEFAULT_INITIAL_QUESTIONS;
}

/**
 * Сохранить/обновить вопрос в Turso:
 * Если вопрос уже задавался — увеличиваем asked_count.
 * Если вопрос новый — создаем с status: 'pending'.
 */
export async function recordQuestionToDb(questionText: string): Promise<QAEntry> {
  const list = await getQuestionsFromDb();
  const normalized = normalizeQuestion(questionText);

  // Ищем похожий вопрос среди существующих
  let existing = list.find(item => {
    return calculateSimilarity(normalized, item.normalized_question) >= 0.75;
  });

  if (existing) {
    existing.asked_count += 1;
    try {
      await executeTursoQuery(
        `UPDATE questions SET asked_count = asked_count + 1 WHERE id = ?;`,
        [existing.id]
      );
    } catch (err) {
      console.warn('Failed to update Turso question count:', err);
    }
    saveLocalQuestions(list);
    return existing;
  }

  // Создаем новую запись
  const newEntry: QAEntry = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `q-${Date.now()}`,
    question: questionText.trim(),
    normalized_question: normalized,
    answer: null,
    status: 'pending',
    asked_count: 1,
    created_at: new Date().toISOString(),
    answered_at: null
  };

  try {
    await executeTursoQuery(
      `INSERT INTO questions (id, question, normalized_question, answer, status, asked_count, created_at, answered_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [newEntry.id, newEntry.question, newEntry.normalized_question, newEntry.answer, newEntry.status, newEntry.asked_count, newEntry.created_at, newEntry.answered_at]
    );
  } catch (err) {
    console.warn('Failed to insert new question into Turso:', err);
  }

  list.unshift(newEntry);
  saveLocalQuestions(list);
  return newEntry;
}

/**
 * Ответ администратора на вопрос (обновляет Turso и кэш)
 */
export async function answerQuestionInDb(id: string, answerText: string): Promise<QAEntry | null> {
  const list = await getQuestionsFromDb();
  const target = list.find(item => item.id === id);
  if (!target) return null;

  target.answer = answerText.trim();
  target.status = 'answered';
  target.answered_at = new Date().toISOString();

  try {
    await executeTursoQuery(
      `UPDATE questions SET answer = ?, status = 'answered', answered_at = ? WHERE id = ?;`,
      [target.answer, target.answered_at, target.id]
    );
  } catch (err) {
    console.warn('Failed to answer question in Turso:', err);
  }

  saveLocalQuestions(list);
  return target;
}

function saveLocalQuestions(list: QAEntry[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  }
}
