'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QAEntry } from '../../types/chat.types';
import { getQuestionsFromDb, answerQuestionInDb } from '../../lib/turso';
import { 
  Lock, 
  Unlock, 
  HelpCircle, 
  CheckCircle2, 
  Flame, 
  Clock, 
  Save, 
  Sparkles, 
  RefreshCw,
  X,
  Database
} from 'lucide-react';

interface AdminPanelProps {
  onClose: () => void;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [questions, setQuestions] = useState<QAEntry[]>([]);
  const [answerInputs, setAnswerInputs] = useState<Record<string, string>>({});
  const [showAnsweredList, setShowAnsweredList] = useState(false);
  const [savedSuccessId, setSavedSuccessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const list = await getQuestionsFromDb();
      setQuestions(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === 'admin' || password.trim() === '12345') {
      setIsAuthenticated(true);
      setLoginError('');
      loadQuestions();
    } else {
      setLoginError('Неверный пароль. (Демо-пароль: admin)');
    }
  };

  const handleSaveAnswer = async (id: string) => {
    const text = answerInputs[id];
    if (!text || !text.trim()) return;

    await answerQuestionInDb(id, text.trim());
    setSavedSuccessId(id);
    setTimeout(() => setSavedSuccessId(null), 2000);
    
    // Перезагружаем список из Turso
    await loadQuestions();
  };

  const pendingQuestions = questions.filter(q => q.status === 'pending');
  const answeredQuestions = questions.filter(q => q.status === 'answered');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#050914]/85 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl glass-card rounded-3xl border border-cyan-500/30 overflow-hidden shadow-2xl z-10 p-6 sm:p-8 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-cyan-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 shadow-[0_0_12px_rgba(56,189,248,0.3)]">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>AutoHub Turso FAQ Manager</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live Cloud DB
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  libsql://avto-muxlisa.aws-ap-northeast-1.turso.io
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAuthenticated && (
                <button
                  onClick={loadQuestions}
                  disabled={loading}
                  className="p-2 rounded-xl glass-card text-slate-300 hover:text-white hover:border-cyan-400 transition-colors"
                  title="Обновить из Turso"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-xl glass-card text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {!isAuthenticated ? (
            /* Login View */
            <form onSubmit={handleLogin} className="max-w-sm mx-auto my-12 w-full space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-2 border border-cyan-400/30">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Вход в панель FAQ базы</h3>
              <p className="text-xs text-slate-400">Введите пароль администратора для модерации вопросов клиентов</p>

              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Пароль (демо: admin)"
                  className="w-full px-4 py-3 rounded-xl glass-input text-xs text-white placeholder-slate-500"
                />
                {loginError && <p className="text-xs text-rose-400 mt-2">{loginError}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl btn-neon text-xs font-bold text-white shadow-lg"
              >
                Войти в систему
              </button>
            </form>
          ) : (
            /* Authenticated Moderation View */
            <div className="flex-1 overflow-y-auto space-y-6 pr-1">
              {/* Tab selector */}
              <div className="flex items-center gap-3 border-b border-cyan-500/15 pb-3">
                <button
                  onClick={() => setShowAnsweredList(false)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    !showAnsweredList
                      ? 'btn-neon text-white shadow-md'
                      : 'glass-card text-slate-400 hover:text-white'
                  }`}
                >
                  Ожидают ответа ({pendingQuestions.length})
                </button>
                <button
                  onClick={() => setShowAnsweredList(true)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    showAnsweredList
                      ? 'btn-neon text-white shadow-md'
                      : 'glass-card text-slate-400 hover:text-white'
                  }`}
                >
                  Опубликованные FAQ ({answeredQuestions.length})
                </button>
              </div>

              {/* List of Pending Questions */}
              {!showAnsweredList ? (
                pendingQuestions.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    Все вопросы от клиентов отвечены и синхронизированы в Turso!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingQuestions.map((q) => (
                      <div key={q.id} className="glass-card p-4 rounded-2xl border border-amber-500/30 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2">
                            <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-bold text-white">{q.question}</p>
                              <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                                <span className="flex items-center gap-1 text-amber-300">
                                  <Flame className="w-3 h-3" />
                                  Спросили: {q.asked_count} раз(а)
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(q.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-cyan-500/10">
                          <textarea
                            rows={2}
                            placeholder="Введите экспертный ответ для базы знаний..."
                            value={answerInputs[q.id] || ''}
                            onChange={(e) => setAnswerInputs({ ...answerInputs, [q.id]: e.target.value })}
                            className="w-full glass-input px-3 py-2 rounded-xl text-xs text-white placeholder-slate-500"
                          />
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleSaveAnswer(q.id)}
                              disabled={!answerInputs[q.id]?.trim()}
                              className="py-1.5 px-4 rounded-xl btn-neon text-xs font-bold text-white flex items-center gap-1.5 shadow-md disabled:opacity-50"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>{savedSuccessId === q.id ? 'Сохранено в Turso!' : 'Опубликовать ответ'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                /* List of Answered FAQ */
                <div className="space-y-3">
                  {answeredQuestions.map((q) => (
                    <div key={q.id} className="glass-card p-4 rounded-2xl border border-cyan-500/20 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{q.question}</span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          FAQ Активен
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5">
                        {q.answer}
                      </p>
                      <div className="text-[10px] text-slate-500 flex justify-between">
                        <span>Запросов: {q.asked_count}</span>
                        <span>{q.answered_at ? new Date(q.answered_at).toLocaleDateString() : ''}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
