import React from 'react';

export default function TypingIndicator() {
  return (
    <div 
      className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl glass-card w-fit border border-cyan-500/20 text-cyan-400 my-1 animate-pulse"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Бот печатает сообщение...</span>
      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"></div>
    </div>
  );
}
