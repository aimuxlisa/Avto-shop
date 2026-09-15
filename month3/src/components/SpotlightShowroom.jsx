'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gauge, Zap, Clock, Activity, ArrowRight, Check } from 'lucide-react';

const SPOTLIGHT_COLORS = [
  {
    id: 'dark',
    name: 'Stealth Obsidian',
    hex: '#111827',
    border: 'border-slate-600',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80',
    accent: 'from-slate-700 to-slate-900',
  },
  {
    id: 'white',
    name: 'Glacier Pearl',
    hex: '#f8fafc',
    border: 'border-slate-200',
    image: 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1200&q=80',
    accent: 'from-slate-100 to-slate-300',
  },
  {
    id: 'blue',
    name: 'Deep Blue Metallic',
    hex: '#1d4ed8',
    border: 'border-blue-500',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
    accent: 'from-blue-600 to-cyan-500',
  },
  {
    id: 'red',
    name: 'Ultra Crimson Red',
    hex: '#dc2626',
    border: 'border-red-500',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    accent: 'from-red-600 to-rose-500',
  },
];

export default function SpotlightShowroom({ car, onBookTestDrive, onOpenDetails }) {
  const [selectedColor, setSelectedColor] = useState(SPOTLIGHT_COLORS[0]);

  return (
    <section id="spotlight" className="relative py-16 px-4 lg:px-12 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card rounded-3xl p-6 sm:p-10 border border-cyan-500/30 overflow-hidden relative"
      >
        {/* Ambient background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Interactive 3D Showroom Spotlight</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {car?.name || 'Tesla Model 3'}{' '}
              <span className="text-cyan-400 font-normal text-lg sm:text-xl">({car?.subtitle || 'Long Range AWD'})</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl font-black text-cyan-300">
              {car?.priceDisplay || '$42,990'}
            </span>
            <button
              onClick={() => onBookTestDrive(car)}
              className="py-2 px-5 rounded-xl btn-neon text-xs font-bold text-white tracking-wide flex items-center gap-2 shadow-lg"
            >
              <span>Drive Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Spotlight Showcase Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left / Center: Interactive Car Showcase with Neon Podium */}
          <div className="lg:col-span-8 flex flex-col items-center justify-center relative">
            {/* Podium Lighting Ring */}
            <div className="relative w-full max-w-xl aspect-[16/9] flex items-center justify-center">
              {/* Podium Base */}
              <div className="absolute bottom-4 w-4/5 h-16 rounded-[100%] podium-glow-layer podium-ring-outer opacity-80 blur-[2px] transform rotateX(65deg)" />
              <div className="absolute bottom-6 w-3/5 h-10 rounded-[100%] bg-cyan-400/30 blur-xl" />

              {/* Animated Vehicle Image */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedColor.id}
                  initial={{ opacity: 0, scale: 0.94, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-10 w-full h-full flex items-center justify-center"
                >
                  <img
                    src={selectedColor.image}
                    alt={`${car?.name} - ${selectedColor.name}`}
                    className="max-h-80 w-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)] rounded-2xl"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Interactive Color Switcher */}
            <div className="mt-4 flex items-center gap-3 bg-[#0a1224]/80 p-2 rounded-2xl border border-cyan-500/20 backdrop-blur-md">
              <span className="text-xs font-medium text-slate-400 pl-2">Finish:</span>
              <div className="flex items-center gap-2">
                {SPOTLIGHT_COLORS.map((col) => {
                  const isCurrent = selectedColor.id === col.id;
                  return (
                    <motion.button
                      key={col.id}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedColor(col)}
                      className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isCurrent ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#050914] scale-110 shadow-[0_0_15px_rgba(56,189,248,0.6)]' : 'opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: col.hex }}
                      title={col.name}
                    >
                      {isCurrent && (
                        <Check className={`w-3.5 h-3.5 ${col.id === 'white' ? 'text-black' : 'text-white'}`} />
                      )}
                    </motion.button>
                  );
                })}
              </div>
              <span className="text-xs font-semibold text-cyan-300 pr-2">{selectedColor.name}</span>
            </div>
          </div>

          {/* Right: Telemetry & Performance Meters */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
              Vehicle Telemetry & Specs
            </h3>

            {/* Metric 1: Range */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-card rounded-2xl p-4 border border-cyan-500/20 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">EPA Est. Range</div>
                  <div className="text-lg font-extrabold text-white">{car?.range || '580 km'}</div>
                </div>
              </div>
              <div className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-md">
                100% Electric
              </div>
            </motion.div>

            {/* Metric 2: 0-100 km/h */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-card rounded-2xl p-4 border border-cyan-500/20 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">0 - 100 km/h</div>
                  <div className="text-lg font-extrabold text-white">{car?.acceleration || '4.4 sec'}</div>
                </div>
              </div>
              <div className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md">
                Dual Motor AWD
              </div>
            </motion.div>

            {/* Metric 3: Top Speed */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-card rounded-2xl p-4 border border-cyan-500/20 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-400">
                  <Gauge className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Top Speed</div>
                  <div className="text-lg font-extrabold text-white">{car?.topSpeed || '233 km/h'}</div>
                </div>
              </div>
              <div className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md">
                Direct Drive
              </div>
            </motion.div>

            {/* Metric 4: Peak Power */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-card rounded-2xl p-4 border border-cyan-500/20 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Peak Power</div>
                  <div className="text-lg font-extrabold text-white">{car?.power || '346 HP'}</div>
                </div>
              </div>
              <div className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded-md">
                510 Nm Torque
              </div>
            </motion.div>

            <button
              onClick={() => onOpenDetails(car)}
              className="w-full mt-2 py-3 rounded-xl btn-outline-neon text-xs font-bold text-cyan-300 flex items-center justify-center gap-2"
            >
              <span>View Full Specifications & Options</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
