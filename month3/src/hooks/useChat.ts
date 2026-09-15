import { useState, useCallback } from 'react';
import { Message, MessageImage } from '../types/chat.types';
import { getBotResponse } from '../lib/chatBot';
import { getQuestionsFromDb, recordQuestionToDb } from '../lib/turso';
import { findAnswer } from '../lib/qaMatch';
import { callGeminiApi, ensurePhotoDisclaimer } from '../lib/gemini';

const INITIAL_GREETING_MESSAGE: Message = {
  id: 'welcome-msg',
  role: 'bot',
  text: 'Здравствуйте! Я ассистент сервиса AutoHub. Чем могу вам помочь? Вы можете спросить о ценах на ТО, диагностике, графике работы или записаться на сервис.',
  timestamp: Date.now(),
  source: 'rule-based'
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_GREETING_MESSAGE]);
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false);

  const handleUserMessage = useCallback(async (text: string, image?: MessageImage) => {
    const trimmed = (text || '').trim();
    if ((!trimmed && !image) || isBotTyping) return;

    // 1. Добавляем сообщение пользователя в список
    const userMsg: Message = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `msg-${Date.now()}`,
      role: 'user',
      text: image && !trimmed ? '📷 Фото' : trimmed,
      timestamp: Date.now(),
      image
    };

    setMessages(prev => [...prev, userMsg]);
    setIsBotTyping(true);

    try {
      // -------------------------------------------------------------
      // СОХРАНЕНИЕ ВОПРОСА: фиксируем каждый вопрос из чата в Turso,
      // чтобы он появился в админке (FAQ Manager) — модераторы увидят
      // его в списке "Ожидают ответа" и смогут опубликовать ответ.
      // -------------------------------------------------------------
      if (trimmed) {
        try {
          await recordQuestionToDb(trimmed);
        } catch (err) {
          console.warn('Failed to record question to DB:', err);
        }
      }

      // -------------------------------------------------------------
      // ФОТО: приблизительный ответ по изображению (Gemini Vision / fallback)
      // -------------------------------------------------------------
      if (image) {
        const photoReplyText = await callGeminiApi(
          trimmed || 'Проанализируйте прикрепленное фото автомобиля или детали и дайте приблизительную оценку.',
          undefined,
          image
        );

        const botReply: Message = {
          id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `bot-${Date.now()}`,
          role: 'bot',
          text: ensurePhotoDisclaimer(photoReplyText),
          timestamp: Date.now(),
          source: 'gemini'
        };

        setMessages(prev => [...prev, botReply]);
        return;
      }

      // -------------------------------------------------------------
      // УРОВЕНЬ 1: Rule-based intents (бесплатно, локально, мгновенно)
      // -------------------------------------------------------------
      const ruleBasedResult = getBotResponse(trimmed);
      
      if (ruleBasedResult.matched && ruleBasedResult.reply) {
        // Декоративная задержка 350-450ms для естественности
        await new Promise(res => setTimeout(res, 400));

        const botReply: Message = {
          id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `bot-${Date.now()}`,
          role: 'bot',
          text: ruleBasedResult.reply,
          timestamp: Date.now(),
          source: 'rule-based'
        };

        setMessages(prev => [...prev, botReply]);
        return;
      }

      // -------------------------------------------------------------
      // УРОВЕНЬ 2: Проверка накопительной базы FAQ (Turso / libSQL)
      // -------------------------------------------------------------
      const currentDb = await getQuestionsFromDb();
      const faqMatch = findAnswer(trimmed, currentDb, 0.6);

      if (faqMatch) {
        // Найден проверенный ответ, кураторский ответ из базы
        await new Promise(res => setTimeout(res, 350));

        const botReply: Message = {
          id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `bot-${Date.now()}`,
          role: 'bot',
          text: faqMatch.answer,
          timestamp: Date.now(),
          source: 'faq-database'
        };

        setMessages(prev => [...prev, botReply]);
        return;
      }

      // -------------------------------------------------------------
      // УРОВЕНЬ 3: Вызов Gemini API
      // (вопрос уже записан в базу выше)
      // -------------------------------------------------------------
      const geminiReplyText = await callGeminiApi(trimmed);

      const botReply: Message = {
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `bot-${Date.now()}`,
        role: 'bot',
        text: geminiReplyText,
        timestamp: Date.now(),
        source: 'gemini'
      };

      setMessages(prev => [...prev, botReply]);

    } catch (error) {
      console.error('Chat processing error:', error);
      
      // Fallback при сетевой ошибке
      const errorReply: Message = {
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `err-${Date.now()}`,
        role: 'bot',
        text: 'Извините, возникла временная задержка связи. Вы можете позвонить нам напрямую по номеру +7 (495) 123-45-67.',
        timestamp: Date.now(),
        source: 'fallback'
      };
      setMessages(prev => [...prev, errorReply]);
    } finally {
      setIsBotTyping(false);
    }
  }, [isBotTyping]);

  const clearChat = useCallback(() => {
    setMessages([INITIAL_GREETING_MESSAGE]);
  }, []);

  return {
    messages,
    isBotTyping,
    handleUserMessage,
    clearChat
  };
}
