'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Message } from '../../types/chat.types';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { ArrowDown } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  isBotTyping: boolean;
  onQuickPrompt?: (prompt: string) => void;
  onSelectSuggestion?: (prompt: string) => void;
}

export default function MessageList({
  messages,
  isBotTyping,
  onQuickPrompt,
  onSelectSuggestion,
}: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);

  const handlePromptClick = (text: string) => {
    if (onQuickPrompt) onQuickPrompt(text);
    else if (onSelectSuggestion) onSelectSuggestion(text);
  };

  const scrollToBottom = (smooth = true) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
    const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 60;
    setShowScrollBottomBtn(!isNearBottom);
  };

  useEffect(() => {
    if (!showScrollBottomBtn) {
      scrollToBottom(true);
    }
  }, [messages, isBotTyping]);

  const quickPrompts = [
    'Сколько стоит ТО?',
    'Где вы находитесь?',
    'Ремонт электромобилей Tesla',
    'Записаться на тест-драйв',
  ];

  return (
    <div className="relative flex-1 overflow-hidden flex flex-col">
      {/* Scrollable Messages Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-1 no-scrollbar select-text"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isBotTyping && <TypingIndicator />}

        {/* Quick Suggestion Chips */}
        {messages.length === 1 && (
          <div className="pt-3 pb-1">
            <span className="text-[10px] text-slate-400 font-semibold block mb-2 px-1">
              Быстрые вопросы:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePromptClick(prompt)}
                  className="px-2.5 py-1.5 rounded-xl glass-card text-[11px] text-cyan-300 hover:text-white hover:border-cyan-400/50 transition-colors text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating "Scroll to Bottom" Button */}
      {showScrollBottomBtn && (
        <button
          onClick={() => scrollToBottom(true)}
          className="absolute bottom-3 right-4 px-3 py-1.5 rounded-full btn-neon text-[10px] font-bold text-white shadow-xl flex items-center gap-1.5 z-20 animate-bounce"
        >
          <ArrowDown className="w-3.5 h-3.5" />
          <span>Новые сообщения</span>
        </button>
      )}
    </div>
  );
}
