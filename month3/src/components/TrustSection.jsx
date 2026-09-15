'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, RotateCcw, Zap, Headphones, CheckCircle2 } from 'lucide-react';

export default function TrustSection() {
  const pillars = [
    {
      icon: ShieldCheck,
      title: '150-Point Certified Inspection',
      desc: 'Every luxury and EV model goes through comprehensive mechanical, battery, and electronic diagnostics before delivery.',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
    },
    {
      icon: RotateCcw,
      title: '7-Day / 500 km Money-Back',
      desc: 'Love it or exchange it. If the car does not fit your lifestyle, return it within 7 days for a 100% full refund.',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      icon: Zap,
      title: 'Direct-to-Door Delivery',
      desc: 'Test drive and complete paperwork right from home. We deliver fully charged/serviced vehicles to your doorstep.',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      icon: Headphones,
      title: '24/7 AI Concierge Support',
      desc: 'Instant answers to questions on specs, battery health, maintenance intervals, and loan pre-approvals via Gemini AI.',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
  ];

  return (
    <section className="relative py-16 px-4 lg:px-12 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Why Drivers Choose <span className="text-cyan-400">AutoHub</span>
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm mt-2">
          Experience frictionless car buying engineered with radical transparency and cutting-edge digital service.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-card-hover p-6 rounded-3xl border border-cyan-500/20 flex flex-col items-start"
            >
              <div className={`p-3 rounded-2xl ${pillar.bg} ${pillar.color} mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{pillar.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{pillar.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
