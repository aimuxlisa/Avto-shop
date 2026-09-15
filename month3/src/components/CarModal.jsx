'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Star, MapPin, Gauge, Zap, Clock, ShieldCheck, ArrowRight, Activity, Calendar } from 'lucide-react';

export default function CarModal({ car, onClose, onBookTestDrive }) {
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!car) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#050914]/80 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl glass-card rounded-3xl border border-cyan-500/30 overflow-hidden shadow-2xl z-10 my-8 max-h-[90vh] flex flex-col"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#050914]/80 backdrop-blur-md border border-cyan-500/30 text-slate-300 hover:text-white hover:border-cyan-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header Photo */}
          <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full overflow-hidden bg-black/50 shrink-0">
            <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050914] via-[#050914]/40 to-transparent" />
            
            <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-bold mb-1">
                  <span>{car.year} • {car.category}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">{car.name}</h2>
                <p className="text-xs text-slate-300">{car.subtitle}</p>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-cyan-300">
                {car.priceDisplay}
              </div>
            </div>
          </div>

          {/* Modal Tabs Header */}
          <div className="flex items-center gap-4 px-6 border-b border-cyan-500/15 shrink-0 bg-[#050914]/60">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'specs', label: 'Full Specifications' },
              { id: 'features', label: 'Included Features' },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative py-3.5 text-xs font-bold transition-colors ${
                    isSelected ? 'text-cyan-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{tab.label}</span>
                  {isSelected && (
                    <motion.div
                      layoutId="carModalTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Modal Body Content (Scrollable) */}
          <div className="p-6 overflow-y-auto space-y-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <p className="text-sm text-slate-300 leading-relaxed">
                  {car.description}
                </p>

                {/* Quick 4 Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="glass-card p-3 rounded-2xl border border-cyan-500/20 text-center">
                    <Zap className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                    <div className="text-[10px] text-slate-400">Range / Fuel</div>
                    <div className="text-sm font-bold text-white">{car.range || car.fuel}</div>
                  </div>
                  <div className="glass-card p-3 rounded-2xl border border-cyan-500/20 text-center">
                    <Clock className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                    <div className="text-[10px] text-slate-400">0 - 100 km/h</div>
                    <div className="text-sm font-bold text-white">{car.acceleration}</div>
                  </div>
                  <div className="glass-card p-3 rounded-2xl border border-cyan-500/20 text-center">
                    <Gauge className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
                    <div className="text-[10px] text-slate-400">Top Speed</div>
                    <div className="text-sm font-bold text-white">{car.topSpeed}</div>
                  </div>
                  <div className="glass-card p-3 rounded-2xl border border-cyan-500/20 text-center">
                    <Activity className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                    <div className="text-[10px] text-slate-400">Peak Output</div>
                    <div className="text-sm font-bold text-white">{car.power}</div>
                  </div>
                </div>

                <div className="glass-card p-4 rounded-2xl border border-cyan-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs text-slate-300">Vehicle Location: <strong className="text-white">{car.location}</strong></span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-300">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{car.rating} ({car.reviews} reviews)</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Brand & Model', val: `${car.brand} ${car.name}` },
                  { label: 'Model Year', val: car.year },
                  { label: 'Body Style', val: car.category },
                  { label: 'Powertrain / Fuel', val: car.fuel || car.type },
                  { label: '0-100 km/h Acceleration', val: car.acceleration },
                  { label: 'Top Velocity', val: car.topSpeed },
                  { label: 'Horsepower Output', val: car.power },
                  { label: 'Transmission', val: car.transmission },
                  { label: 'Range Estimate', val: car.range || 'N/A' },
                  { label: 'Inspection Status', val: '150-Point Certified Pass' },
                ].map((spec) => (
                  <div key={spec.label} className="glass-card p-3 rounded-xl border border-cyan-500/15 flex justify-between items-center text-xs">
                    <span className="text-slate-400">{spec.label}</span>
                    <span className="font-bold text-white">{spec.val}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'features' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(car.features || [
                  'Dual Motor All-Wheel Drive',
                  'Cinematic High-Resolution Touchscreen Display',
                  'Premium Acoustic Glass Roof & Heated Seating',
                  'Full Suite of ADAS Driving Assist Hardware',
                  'High-Output Fast Charging Compatible',
                  '360° Sentry Parking Cameras with Night Vision'
                ]).map((feat) => (
                  <div key={feat} className="flex items-start gap-2.5 p-3 rounded-xl glass-card border border-cyan-500/15 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal Footer with Actions */}
          <div className="p-5 border-t border-cyan-500/15 bg-[#050914]/80 flex items-center justify-between gap-4 shrink-0">
            <div className="text-xs text-slate-400 hidden sm:block">
              Free delivery to your location upon purchase
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl glass-card text-xs font-semibold text-slate-300 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  onBookTestDrive(car);
                }}
                className="flex-1 sm:flex-none py-2.5 px-6 rounded-xl btn-neon text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Book Test Drive for {car.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
