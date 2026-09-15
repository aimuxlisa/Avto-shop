import { QAEntry } from '../types/chat.types';

/**
 * Нормализация текста вопроса: lowercase, удаление знаков препинания и лишних пробелов.
 */
export function normalizeQuestion(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'«»]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Вычисление коэффициента схожести Дайса (Sørensen–Dice coefficient) по биграммам.
 * Возвращает значение от 0.0 до 1.0.
 */
export function calculateSimilarity(str1: string, str2: string): number {
  const s1 = normalizeQuestion(str1);
  const s2 = normalizeQuestion(str2);

  if (s1 === s2) return 1.0;
  if (s1.length < 2 || s2.length < 2) {
    return s1 === s2 ? 1.0 : 0.0;
  }

  // Получаем биграммы
  const getBigrams = (str: string) => {
    const bigrams = new Map<string, number>();
    for (let i = 0; i < str.length - 1; i++) {
      const bigram = str.substring(i, i + 2);
      bigrams.set(bigram, (bigrams.get(bigram) || 0) + 1);
    }
    return bigrams;
  };

  const bigrams1 = getBigrams(s1);
  const bigrams2 = getBigrams(s2);

  let intersectionSize = 0;
  for (const [bigram, count1] of bigrams1.entries()) {
    if (bigrams2.has(bigram)) {
      intersectionSize += Math.min(count1, bigrams2.get(bigram)!);
    }
  }

  const totalBigrams = (s1.length - 1) + (s2.length - 1);
  return (2.0 * intersectionSize) / totalBigrams;
}

/**
 * Поиск подходящего ответа среди уже отвеченных вопросов базы (status: 'answered').
 * Порог схожести по умолчанию: 0.6
 */
export function findAnswer(
  userQuestion: string, 
  database: QAEntry[], 
  threshold: number = 0.6
): { answer: string; matchedQuestion: string; score: number } | null {
  const normUser = normalizeQuestion(userQuestion);
  const answeredList = database.filter(item => item.status === 'answered' && item.answer);

  let bestMatch: { answer: string; matchedQuestion: string; score: number } | null = null;
  let maxScore = 0;

  for (const item of answeredList) {
    const score = calculateSimilarity(normUser, item.normalized_question || item.question);
    if (score > maxScore && score >= threshold) {
      maxScore = score;
      bestMatch = {
        answer: item.answer!,
        matchedQuestion: item.question,
        score
      };
    }
  }

  return bestMatch;
}
