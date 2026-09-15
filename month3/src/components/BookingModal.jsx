'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Clock, User, Phone, Mail, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BookingModal({ car, onClose }) {
  const [step, setStep] = useState(1);
  const [showroom, setShowroom] = useState('San Francisco Tech Showroom');
  const [date, setDate] = useState('2026-09-15');
  const [timeSlot, setTimeSlot] = useState('14:00 - 15:00');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(true);
    
    // Fire festive celebratory confetti
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#2563eb', '#3b82f6', '#06b6d4', '#ffffff'],
      });
    } catch (err) {
      console.log('Confetti triggered', err);
    }
  };

  if (!car) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#050914]/80 backdrop-blur-xl"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg glass-card rounded-3xl border border-cyan-500/30 overflow-hidden shadow-2xl z-10 p-6 sm:p-8"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-[#050914]/80 text-slate-400 hover:text-white border border-cyan-500/20"
          >
            <X className="w-5 h-5" />
          </button>

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>VIP Experience</span>
                </div>
                <h2 className="text-2xl font-black text-white">
                  Schedule a Test Drive
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Selected Model: <strong className="text-cyan-300">{car.name} ({car.subtitle})</strong>
                </p>
              </div>

              {/* Showroom Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  Select Experience Center
                </label>
                <select
                  value={showroom}
                  onChange={(e) => setShowroom(e.target.value)}
                  className="w-full glass-card px-4 py-2.5 rounded-xl text-xs font-semibold text-white border border-cyan-500/30 focus:outline-none"
                >
                  <option value="San Francisco Tech Showroom" className="bg-[#0a1224]">San Francisco Tech Showroom (Silicon Valley)</option>
                  <option value="New York Executive Hub" className="bg-[#0a1224]">New York Executive Hub (Manhattan)</option>
                  <option value="Los Angeles Beach Pavilion" className="bg-[#0a1224]">Los Angeles Beach Pavilion (Santa Monica)</option>
                  <option value="Direct Home Delivery Test Drive" className="bg-[#0a1224]">Direct Home Delivery (We bring the car to you)</option>
                </select>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    required
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full glass-card px-3.5 py-2.5 rounded-xl text-xs text-white border border-cyan-500/30 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    Time Window
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full glass-card px-3 py-2.5 rounded-xl text-xs text-white border border-cyan-500/30 focus:outline-none"
                  >
                    <option value="10:00 - 11:00" className="bg-[#0a1224]">10:00 AM - 11:00 AM</option>
                    <option value="12:00 - 13:00" className="bg-[#0a1224]">12:00 PM - 01:00 PM</option>
                    <option value="14:00 - 15:00" className="bg-[#0a1224]">02:00 PM - 03:00 PM</option>
                    <option value="16:00 - 17:00" className="bg-[#0a1224]">04:00 PM - 05:00 PM</option>
                    <option value="18:00 - 19:00" className="bg-[#0a1224]">06:00 PM - 07:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 pt-2">
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Full Name (e.g. Michael Smith)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-400"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number (+1 (555) 000-0000)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-400"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl btn-neon text-xs font-bold text-white tracking-wider flex items-center justify-center gap-2 shadow-xl mt-4"
              >
                <span>Confirm VIP Reservation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="text-center py-8 space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12 }}
                className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 flex items-center justify-center mx-auto"
              >
                <CheckCircle2 className="w-9 h-9" />
              </motion.div>

              <h3 className="text-2xl font-black text-white">VIP Test Drive Reserved!</h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                Your test drive for <strong className="text-cyan-300">{car.name}</strong> has been scheduled for{' '}
                <strong className="text-white">{date}</strong> at <strong className="text-white">{timeSlot}</strong>.
              </p>

              <div className="p-4 rounded-2xl glass-card border border-cyan-500/20 text-xs text-slate-300 text-left space-y-1">
                <div>Showroom: <span className="font-semibold text-white">{showroom}</span></div>
                <div>Customer: <span className="font-semibold text-white">{name || 'Guest VIP'}</span> ({phone})</div>
                <div>Status: <span className="text-emerald-400 font-bold">Confirmed • Concierge Dispatched</span></div>
              </div>

              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl btn-neon text-xs font-bold text-white shadow-lg mt-4"
              >
                Back to Showroom
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
