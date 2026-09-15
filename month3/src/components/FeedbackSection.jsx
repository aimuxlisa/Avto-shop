'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Phone, 
  Mail, 
  User, 
  MessageSquare, 
  ShieldCheck, 
  Clock, 
  Building2 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FeedbackSection() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // Honeypot
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedLeadId, setSubmittedLeadId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          contact,
          message,
          website, // honeypot
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Не удалось отправить заявку. Попробуйте еще раз.');
      }

      setSuccess(true);
      setSubmittedLeadId(data.leadId || null);

      // Fire celebratory confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#2563eb', '#3b82f6', '#06b6d4', '#ffffff'],
        });
      } catch (err) {}

      // Reset fields
      setName('');
      setContact('');
      setMessage('');
      setWebsite('');
    } catch (err) {
      console.error('Feedback submit error:', err);
      setErrorMsg(err.message || 'Ошибка связи с сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="feedback" className="relative py-20 px-4 lg:px-12 max-w-7xl mx-auto">
      {/* Background ambient decorative light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card rounded-3xl p-6 sm:p-12 border border-cyan-500/30 relative overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Info & Trust */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Прямая связь с отделом продаж</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Остались вопросы? <br />
                <span className="text-cyan-400">Напишите нам</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                Оставьте заявку на персональный подбор автомобиля, бронирование тест-драйва или оценку Trade-In. Ваша заявка моментально поступит в систему и менеджер свяжется с вами.
              </p>
            </div>

            {/* Quick Benefits Badges */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#0a1224]/80 border border-cyan-500/20">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Быстрый ответ</div>
                  <div className="text-[11px] text-slate-400">Свяжемся в течение 10–15 минут</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#0a1224]/80 border border-cyan-500/20">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Интеграция с CRM</div>
                  <div className="text-[11px] text-slate-400">Заявка регистрируется в единой базе клиентов</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#0a1224]/80 border border-cyan-500/20">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Конфиденциальность</div>
                  <div className="text-[11px] text-slate-400">Ваши данные защищены и не передаются третьим лицам</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Glass Form */}
          <div className="lg:col-span-7">
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-cyan-500/30 bg-[#0a142c]/75 shadow-2xl relative">
              
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-10 text-center space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black text-white">Заявка успешно принята!</h3>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                      Данные успешно переданы в CRM. Наш ведущий специалист свяжется с вами в ближайшее время.
                    </p>
                    {submittedLeadId && (
                      <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-[11px] text-cyan-300 font-mono">
                        Номер заявки в CRM: {submittedLeadId}
                      </div>
                    )}
                    <div className="pt-4">
                      <button
                        onClick={() => setSuccess(false)}
                        className="py-2.5 px-6 rounded-xl btn-outline-neon text-xs font-bold text-white hover:text-cyan-300 transition-colors"
                      >
                        Отправить ещё одну заявку
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="border-b border-cyan-500/15 pb-3 mb-2">
                      <h3 className="text-lg font-bold text-white">Форма обратной связи</h3>
                      <p className="text-xs text-slate-400">Заполните поля ниже для связи с менеджером</p>
                    </div>

                    {errorMsg && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2"
                      >
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                        <span>{errorMsg}</span>
                      </motion.div>
                    )}

                    {/* Honeypot field (hidden from real users, traps bots) */}
                    <div className="hidden" aria-hidden="true">
                      <label htmlFor="website">Website</label>
                      <input
                        id="website"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </div>

                    {/* Name Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-cyan-400" />
                        Ваше имя <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Например: Александр"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full glass-input px-4 py-3 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    {/* Contact Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-cyan-400" />
                        Телефон или Email <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="+7 (___) ___-__-__ или email@domain.com"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        className="w-full glass-input px-4 py-3 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    {/* Message Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                        Ваш вопрос или пожелание <span className="text-rose-400">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Интересует тест-драйв Tesla Model 3 или подбор под ключ..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full glass-input px-4 py-3 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-xl btn-neon text-xs font-bold text-white tracking-wide flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Передача в CRM...
                          </span>
                        ) : (
                          <>
                            <span>Отправить заявку в CRM</span>
                            <Send className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-[10px] text-center text-slate-500">
                      Нажимая «Отправить заявку», вы даете согласие на обработку персональных данных
                    </p>
                  </form>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>
      </motion.div>
    </section>
  );
}
