'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../../hooks/useChat';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { MessageSquare, X, Trash2, Bot, Sparkles, Shield } from 'lucide-react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isBotTyping, handleUserMessage, clearChat } = useChat();

  return (
    <div id="chat-widget-slot" className="fixed bottom-5 right-5 z-50">
      {/* Floating Chat Trigger Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsOpen(true)}
            className="relative group p-4 rounded-full btn-neon text-white shadow-[0_0_25px_rgba(56,189,248,0.7)] flex items-center justify-center transition-all"
            aria-label="Open AutoHub AI Concierge"
          >
            <div className="absolute -inset-1 bg-cyan-400 rounded-full blur-md opacity-40 group-hover:opacity-75 transition-opacity animate-pulse" />
            <MessageSquare className="w-6 h-6 relative z-10 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            
            {/* Online green indicator pulse */}
            <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#050914] rounded-full shadow-[0_0_8px_rgba(52,211,153,0.9)] z-20" />
            
            {/* Tooltip on hover */}
            <span className="hidden sm:block absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-1.5 rounded-xl glass-card text-xs font-semibold text-white border border-cyan-400/30 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
              AI Concierge 24/7
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Chat Window (Mobile full screen, desktop floating widget) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 sm:inset-auto sm:right-5 sm:bottom-5 w-full sm:w-[380px] h-full sm:h-[560px] glass-card sm:rounded-[28px] border sm:border-cyan-500/30 shadow-[0_15px_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden z-50 bg-[#050914]/95 backdrop-blur-2xl"
          >
            {/* Top Chat Header */}
            <div className="px-4 py-3.5 bg-gradient-to-r from-slate-900/90 via-blue-950/70 to-slate-900/90 border-b border-cyan-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(56,189,248,0.4)]">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-[#050914] shadow-[0_0_5px_rgba(52,211,153,0.9)]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold text-white tracking-wide">AutoHub Concierge</h3>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                      AI 3.5
                    </span>
                  </div>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online • Turso FAQ Ready
                  </p>
                </div>
              </div>

              {/* Chat Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                  title="Clear Chat History"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                  title="Minimize"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-[#050914]/60">
              <MessageList
                messages={messages}
                isBotTyping={isBotTyping}
                onSelectSuggestion={(text) => handleUserMessage(text)}
              />
            </div>

            {/* Input Box */}
            <div className="p-3 bg-[#070e22]/90 border-t border-cyan-500/20 backdrop-blur-md">
              <ChatInput
                onSendMessage={handleUserMessage}
                disabled={isBotTyping}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
