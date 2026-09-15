'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Send, Mic, MicOff, ImagePlus, X } from 'lucide-react';
import { MessageImage } from '../../types/chat.types';

interface ChatInputProps {
  onSendMessage: (text: string, image?: MessageImage) => void;
  isBotTyping?: boolean;
  disabled?: boolean;
}

interface AttachmentState extends MessageImage {
  name: string;
}

export default function ChatInput({ onSendMessage, isBotTyping, disabled }: ChatInputProps) {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [attachment, setAttachment] = useState<AttachmentState | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const isDisabled = isBotTyping || disabled;

  const handleSubmit = () => {
    const trimmed = text.trim();
    if ((trimmed.length > 0 || attachment) && !isDisabled) {
      onSendMessage(trimmed, attachment
        ? { base64: attachment.base64, mimeType: attachment.mimeType }
        : undefined);
      setText('');
      setAttachment(null);
      stopListening();
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
  };

  const stopListening = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch {
      /* noop */
    }
    setIsListening(false);
  }, []);

  const initRecognition = useCallback(() => {
    if (recognitionRef.current) return recognitionRef.current;
    if (typeof window === 'undefined') return null;
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return null;

    const recognition = new SR();
    recognition.lang = 'ru-RU';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      setText(prev => {
        const next = (prev + ' ' + transcript).trim();
        return next;
      });
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    return recognition;
  }, []);

  const handleVoiceToggle = () => {
    if (!isListening) {
      const recognition = initRecognition();
      if (!recognition) {
        return;
      }
      try {
        recognition.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    } else {
      stopListening();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1] || '';
      const mimeType = file.type || 'image/jpeg';
      setAttachment({ base64, mimeType, name: file.name });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="bg-[#050914] p-1.5 rounded-2xl border border-cyan-500/30 focus-within:border-cyan-400 focus-within:shadow-[0_0_12px_rgba(56,189,248,0.3)] transition-all">
      {/* Image Attachment Preview */}
      {attachment && (
        <div className="flex items-center gap-2 px-2 pt-2 pb-1.5">
          <div className="relative">
            <img
              src={`data:${attachment.mimeType};base64,${attachment.base64}`}
              alt="Вложение"
              className="w-16 h-12 rounded-lg object-cover border border-cyan-400/50 shadow-[0_0_8px_rgba(56,189,248,0.4)]"
            />
            <button
              type="button"
              onClick={() => setAttachment(null)}
              className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] rounded-full bg-rose-500 text-white flex items-center justify-center hover:bg-rose-400 transition-colors shadow"
              aria-label="Удалить фото"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <span className="text-[10px] text-slate-400 truncate">{attachment.name}</span>
          <button
            type="button"
            disabled={isDisabled}
            onClick={handleSubmit}
            className="ml-auto px-2.5 py-1 rounded-lg btn-neon text-[10px] font-bold text-white"
          >
            Отправить фото
          </button>
        </div>
      )}

      <div className="flex items-end gap-1.5">
        {/* Voice Input Button */}
        <button
          type="button"
          onClick={handleVoiceToggle}
          disabled={isDisabled}
          title={isListening ? 'Остановить запись' : 'Голосовой ввод'}
          aria-label="Голосовой ввод"
          className={`p-2.5 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
            isListening
              ? 'bg-rose-500/20 text-rose-400 border border-rose-400/60 shadow-[0_0_14px_rgba(244,63,94,0.5)] animate-pulse'
              : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10'
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Photo Attachment Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isDisabled}
          title="Прикрепить фото"
          aria-label="Прикрепить фото"
          className="p-2.5 rounded-xl flex items-center justify-center transition-all flex-shrink-0 text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10"
        >
          <ImagePlus className="w-4 h-4" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={isDisabled ? 'Консультант печатает ответ...' : (isListening ? 'Говорите...' : 'Напишите вопрос или прикрепите фото...')}
          disabled={isDisabled}
          className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 px-2 py-2 resize-none focus:outline-none max-h-[90px] scrollbar-none"
        />
        <button
          onClick={handleSubmit}
          disabled={isDisabled || (text.trim().length === 0 && !attachment)}
          className={`p-2.5 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
            (text.trim().length > 0 || attachment) && !isDisabled
              ? 'btn-neon text-white shadow-md'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
          aria-label="Отправить сообщение"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}