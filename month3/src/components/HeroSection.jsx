'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, X, ShieldCheck, Zap, Award, ArrowRight } from 'lucide-react';

export default function HeroSection({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onExploreInventory,
  totalCarsCount
}) {
  const categories = ['All', 'SUV', 'Sedan', 'Coupe', 'Electric'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section id="hero" className="relative pt-10 pb-14 px-4 lg:px-12 max-w-7xl mx-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center text-center max-w-4xl mx-auto"
      >
        {/* Floating Neon Badge */}
        <motion.div variants={itemVariants}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-5 shadow-[0_0_20px_rgba(56,189,248,0.25)] backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Next-Gen Electric & Luxury Automotive Marketplace</span>
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-6"
        >
          Drive Your <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(56,189,248,0.45)]">
            Electric Dream.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed mb-8"
        >
          Explore, compare and book next-generation luxury, sports and electric vehicles with transparent pricing, certified multi-point inspection, and a 24/7 AI concierge.
        </motion.p>

        {/* Interactive Search Card with Glassmorphism */}
        <motion.div
          variants={itemVariants}
          className="w-full max-w-2xl glass-card rounded-3xl p-4 sm:p-5 border border-cyan-500/30 shadow-2xl backdrop-blur-2xl mb-10"
        >
          {/* Live Search Input */}
          <div className="relative mb-3.5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by brand, model (e.g. Tesla Model 3, BMW X5, Porsche)..."
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl glass-input text-sm text-white placeholder-slate-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                title="Clear Search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Interactive Category Filter Pills with layoutId spring animation */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-slate-400 font-medium mr-1 hidden sm:inline">Body:</span>
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors duration-200 ${
                      isSelected ? 'text-white' : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="activeCategoryPill"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 shadow-[0_0_15px_rgba(56,189,248,0.4)]"
                        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10">{cat}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={onExploreInventory}
              className="ml-auto px-4 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-bold hover:bg-cyan-500/25 transition-all flex items-center gap-1.5 group"
            >
              <span>{totalCarsCount} Cars Available</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Quick Highlights / Trust Badges */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl"
        >
          <div className="glass-card rounded-2xl p-3.5 flex items-center gap-3 border border-cyan-500/15">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white">150+ Point Certified</div>
              <div className="text-[11px] text-slate-400">Full vehicle health report</div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-3.5 flex items-center gap-3 border border-cyan-500/15">
            <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400">
              <Zap className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white">Instant Booking</div>
              <div className="text-[11px] text-slate-400">Test drive at your door</div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-3.5 flex items-center gap-3 border border-cyan-500/15">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white">7-Day Guarantee</div>
              <div className="text-[11px] text-slate-400">100% money-back policy</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
