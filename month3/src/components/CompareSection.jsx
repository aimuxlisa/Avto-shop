'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Check, Trophy, Zap, Gauge, Clock, DollarSign, Star } from 'lucide-react';
import { CARS_DATA } from '../data/cars';

export default function CompareSection({ onBookTestDrive }) {
  const [car1, setCar1] = useState(CARS_DATA[0]);
  const [car2, setCar2] = useState(CARS_DATA[1]);

  // Numeric parsers for comparison
  const parseAccel = (str) => parseFloat(str?.replace(/[^0-9.]/g, '') || '5');
  const parsePower = (str) => parseInt(str?.replace(/[^0-9]/g, '') || '300', 10);
  const parseSpeed = (str) => parseInt(str?.replace(/[^0-9]/g, '') || '200', 10);

  const accel1 = parseAccel(car1?.acceleration);
  const accel2 = parseAccel(car2?.acceleration);
  const power1 = parsePower(car1?.power);
  const power2 = parsePower(car2?.power);
  const speed1 = parseSpeed(car1?.topSpeed);
  const speed2 = parseSpeed(car2?.topSpeed);

  return (
    <section id="compare" className="relative py-16 px-4 lg:px-12 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card rounded-3xl p-6 sm:p-10 border border-cyan-500/30 relative overflow-hidden"
      >
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-3">
            <ArrowLeftRight className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Comparison Matrix</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Head-to-Head <span className="text-cyan-400">Battle</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Select any two models from our fleet to compare performance, acceleration, range, and pricing side-by-side.
          </p>
        </div>

        {/* Car Selectors & Photos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-10">
          {/* Car 1 */}
          <div className="glass-card rounded-2xl p-5 border border-cyan-500/20 flex flex-col items-center text-center">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Vehicle #1
            </label>
            <select
              value={car1?.id}
              onChange={(e) => setCar1(CARS_DATA.find((c) => c.id === e.target.value))}
              className="w-full glass-card px-4 py-2.5 rounded-xl text-sm font-bold text-white border border-cyan-500/30 mb-4 focus:outline-none"
            >
              {CARS_DATA.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#0a1224] text-white">
                  {c.name} — {c.priceDisplay}
                </option>
              ))}
            </select>

            <div className="w-full aspect-[16/10] rounded-xl overflow-hidden mb-4 bg-black/40">
              <img src={car1?.image} alt={car1?.name} className="w-full h-full object-cover" />
            </div>

            <h3 className="text-xl font-extrabold text-white">{car1?.name}</h3>
            <p className="text-xs text-cyan-300 font-semibold mb-3">{car1?.subtitle}</p>
            <div className="text-2xl font-black text-white mb-4">{car1?.priceDisplay}</div>

            <button
              onClick={() => onBookTestDrive(car1)}
              className="w-full py-2.5 rounded-xl btn-neon text-xs font-bold text-white"
            >
              Book {car1?.name}
            </button>
          </div>

          {/* Car 2 */}
          <div className="glass-card rounded-2xl p-5 border border-cyan-500/20 flex flex-col items-center text-center">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Vehicle #2
            </label>
            <select
              value={car2?.id}
              onChange={(e) => setCar2(CARS_DATA.find((c) => c.id === e.target.value))}
              className="w-full glass-card px-4 py-2.5 rounded-xl text-sm font-bold text-white border border-cyan-500/30 mb-4 focus:outline-none"
            >
              {CARS_DATA.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#0a1224] text-white">
                  {c.name} — {c.priceDisplay}
                </option>
              ))}
            </select>

            <div className="w-full aspect-[16/10] rounded-xl overflow-hidden mb-4 bg-black/40">
              <img src={car2?.image} alt={car2?.name} className="w-full h-full object-cover" />
            </div>

            <h3 className="text-xl font-extrabold text-white">{car2?.name}</h3>
            <p className="text-xs text-cyan-300 font-semibold mb-3">{car2?.subtitle}</p>
            <div className="text-2xl font-black text-white mb-4">{car2?.priceDisplay}</div>

            <button
              onClick={() => onBookTestDrive(car2)}
              className="w-full py-2.5 rounded-xl btn-neon text-xs font-bold text-white"
            >
              Book {car2?.name}
            </button>
          </div>
        </div>

        {/* Animated Comparison Meters */}
        <div className="space-y-6 max-w-3xl mx-auto">
          {/* Comparison 1: 0-100 km/h (Lower is better) */}
          <div className="glass-card p-4 rounded-2xl border border-cyan-500/20">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className={`flex items-center gap-1.5 ${accel1 <= accel2 ? 'text-cyan-300' : 'text-slate-400'}`}>
                {accel1 <= accel2 && <Trophy className="w-3.5 h-3.5 text-amber-400" />}
                {car1?.acceleration}
              </span>
              <span className="text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                0 - 100 km/h (Faster wins)
              </span>
              <span className={`flex items-center gap-1.5 ${accel2 <= accel1 ? 'text-cyan-300' : 'text-slate-400'}`}>
                {car2?.acceleration}
                {accel2 <= accel1 && <Trophy className="w-3.5 h-3.5 text-amber-400" />}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 h-3 bg-black/40 rounded-full overflow-hidden p-0.5">
              <div className="flex justify-end">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (8 / (accel1 || 1)) * 50)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
                />
              </div>
              <div className="flex justify-start">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (8 / (accel2 || 1)) * 50)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Comparison 2: Peak Power (Higher is better) */}
          <div className="glass-card p-4 rounded-2xl border border-cyan-500/20">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className={`flex items-center gap-1.5 ${power1 >= power2 ? 'text-cyan-300' : 'text-slate-400'}`}>
                {power1 >= power2 && <Trophy className="w-3.5 h-3.5 text-amber-400" />}
                {car1?.power}
              </span>
              <span className="text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                Peak Power (HP)
              </span>
              <span className={`flex items-center gap-1.5 ${power2 >= power1 ? 'text-cyan-300' : 'text-slate-400'}`}>
                {car2?.power}
                {power2 >= power1 && <Trophy className="w-3.5 h-3.5 text-amber-400" />}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 h-3 bg-black/40 rounded-full overflow-hidden p-0.5">
              <div className="flex justify-end">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (power1 / 650) * 100)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
                />
              </div>
              <div className="flex justify-start">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (power2 / 650) * 100)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Comparison 3: Top Speed */}
          <div className="glass-card p-4 rounded-2xl border border-cyan-500/20">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className={`flex items-center gap-1.5 ${speed1 >= speed2 ? 'text-cyan-300' : 'text-slate-400'}`}>
                {speed1 >= speed2 && <Trophy className="w-3.5 h-3.5 text-amber-400" />}
                {car1?.topSpeed}
              </span>
              <span className="text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                Top Speed (km/h)
              </span>
              <span className={`flex items-center gap-1.5 ${speed2 >= speed1 ? 'text-cyan-300' : 'text-slate-400'}`}>
                {car2?.topSpeed}
                {speed2 >= speed1 && <Trophy className="w-3.5 h-3.5 text-amber-400" />}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 h-3 bg-black/40 rounded-full overflow-hidden p-0.5">
              <div className="flex justify-end">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (speed1 / 320) * 100)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
                />
              </div>
              <div className="flex justify-start">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (speed2 / 320) * 100)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
