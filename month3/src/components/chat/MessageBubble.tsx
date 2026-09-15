import React from 'react';
import { Message } from '../../types/chat.types';
import { Bot, User, Sparkles, Database, Zap } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const timeFormatted = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex gap-2.5 my-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
      
      {/* Bot Avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 flex-shrink-0 mt-0.5 shadow-[0_0_10px_rgba(56,189,248,0.3)]">
          <Bot className="w-4 h-4" />
        </div>
      )}

      {/* Bubble Container */}
      <div className={`max-w-[82%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs leading-relaxed ${
        isUser
          ? 'btn-neon text-white rounded-br-none shadow-md font-medium'
          : 'glass-card text-slate-100 rounded-bl-none border border-cyan-500/20 shadow-lg'
      }`}>
        
        {/* Source Badge for Bot */}
        {!isUser && message.source && (
          <div className="flex items-center gap-1 text-[9px] text-cyan-300/80 uppercase tracking-wider font-semibold mb-1.5 border-b border-white/5 pb-1">
            {message.source === 'rule-based' && (
              <>
                <Zap className="w-3 h-3 text-cyan-400" />
                <span>Мгновенный ответ</span>
              </>
            )}
            {message.source === 'faq-database' && (
              <>
                <Database className="w-3 h-3 text-sky-400" />
                <span>База знаний сервиса</span>
              </>
            )}
            {message.source === 'gemini' && (
              <>
                <Sparkles className="w-3 h-3 text-cyan-300" />
                <span>AutoHub AI Консультант</span>
              </>
            )}
          </div>
        )}

        {/* Message Image */}
        {message.image && (
          <img
            src={`data:${message.image.mimeType};base64,${message.image.base64}`}
            alt="Фото от пользователя"
            className="mt-1 mb-2 max-w-full max-h-48 rounded-xl object-cover border border-white/10 shadow-md"
          />
        )}

        {/* Message Text with preserved line breaks */}
        <p className="whitespace-pre-line">{message.text}</p>

        {/* Timestamp */}
        <div className={`text-[9px] mt-1.5 text-right font-normal ${
          isUser ? 'text-cyan-100/70' : 'text-slate-400'
        }`}>
          {timeFormatted}
        </div>

      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-7 h-7 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300 flex-shrink-0 mt-0.5">
          <User className="w-4 h-4" />
        </div>
      )}

    </div>
  );
}
