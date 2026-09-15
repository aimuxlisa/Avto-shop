export type MessageRole = 'user' | 'bot';

export interface MessageImage {
  base64: string;
  mimeType: string;
}

export interface Message {
  id: string;              // crypto.randomUUID()
  role: MessageRole;
  text: string;
  timestamp: number;       // unix ms
  source?: 'rule-based' | 'faq-database' | 'gemini' | 'fallback' | 'system';
  image?: MessageImage;
}

export interface ChatState {
  messages: Message[];
  isBotTyping: boolean;
}

export interface QAEntry {
  id: string;                  // crypto.randomUUID()
  question: string;            // Исходный текст вопроса
  normalized_question: string; // lowercase + trim
  answer: string | null;       // null, пока не отвечено
  status: 'pending' | 'answered';
  asked_count: number;         // сколько раз похожий вопрос задавали
  created_at: string;          // ISO-строка
  answered_at: string | null;
}
