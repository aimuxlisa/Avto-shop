'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, MapPin, Gauge, Zap, ArrowRight, SlidersHorizontal, Eye } from 'lucide-react';
import { BRANDS_DATA } from '../data/cars';

export default function InventorySection({
  cars,
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  sortBy,
  setSortBy,
  favorites,
  onToggleFavorite,
  onOpenDetails,
  onBookTestDrive,
}) {
  const categories = ['All', 'SUV', 'Sedan', 'Coupe', 'Electric'];

  return (
    <section id="catalogue" className="relative py-16 px-4 lg:px-12 max-w-7xl mx-auto">
      {/* Header with Title & Live Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Verified Luxury & EV Fleet</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Explore Current <span className="text-cyan-400">Inventory</span>
          </h2>
        </div>

        {/* Sort Select & Filters */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-400 font-semibold hidden sm:inline">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="glass-card px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 border border-cyan-500/30 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          >
            <option value="popular" className="bg-[#0a1224] text-white">Most Popular</option>
            <option value="price-low" className="bg-[#0a1224] text-white">Price: Low to High</option>
            <option value="price-high" className="bg-[#0a1224] text-white">Price: High to Low</option>
            <option value="rating" className="bg-[#0a1224] text-white">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Brand Selection Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        <button
          onClick={() => setSelectedBrand('All')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedBrand === 'All'
              ? 'btn-neon text-white shadow-lg'
              : 'glass-card text-slate-300 hover:text-white hover:border-cyan-400/40'
          }`}
        >
          All Brands ({cars.length})
        </button>
        {BRANDS_DATA.map((b) => (
          <button
            key={b.name}
            onClick={() => setSelectedBrand(b.name)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedBrand === b.name
                ? 'btn-neon text-white shadow-lg'
                : 'glass-card text-slate-300 hover:text-white hover:border-cyan-400/40'
            }`}
          >
            {b.name}
          </button>
        ))}
      </div>

      {/* Body Category Tabs with layoutId */}
      <div className="flex items-center gap-2 mb-8 border-b border-cyan-500/15 pb-4">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                isSelected ? 'text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="inventoryCategoryIndicator"
                  className="absolute inset-0 rounded-xl bg-cyan-500/20 border border-cyan-400/30 shadow-[0_0_15px_rgba(56,189,248,0.25)]"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Animated Cars Grid */}
      {cars.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-cyan-500/20 max-w-lg mx-auto">
          <p className="text-slate-300 text-sm mb-4">No vehicles found matching your criteria.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedBrand('All');
            }}
            className="px-5 py-2.5 rounded-xl btn-neon text-xs font-bold text-white"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {cars.map((car) => {
              const isFav = favorites.includes(car.id);
              return (
                <motion.div
                  key={car.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35 }}
                  whileHover={{ y: -6 }}
                  className="glass-card-hover rounded-3xl overflow-hidden border border-cyan-500/20 flex flex-col group relative"
                >
                  {/* Image Container with Badges */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#0a1224]">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050914] via-transparent to-black/30" />

                    {/* Category / Type Badge */}
                    <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-[#050914]/80 backdrop-blur-md border border-cyan-500/30 text-[11px] font-bold text-cyan-300">
                      {car.type || car.category}
                    </div>

                    {/* Favorite Heart Button */}
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(car.id);
                      }}
                      className="absolute top-3.5 right-3.5 p-2 rounded-full bg-[#050914]/80 backdrop-blur-md border border-cyan-500/30 text-white hover:text-rose-400 transition-colors shadow-lg"
                      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart
                        className={`w-4 h-4 transition-all ${
                          isFav ? 'text-rose-500 fill-rose-500 scale-110' : 'text-slate-300'
                        }`}
                      />
                    </motion.button>

                    {/* Price and Rating Bar */}
                    <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between">
                      <div className="text-xl font-black text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                        {car.priceDisplay}
                      </div>
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#050914]/80 backdrop-blur-md border border-amber-500/30 text-xs font-bold text-amber-300">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{car.rating}</span>
                        <span className="text-[10px] text-slate-400">({car.reviews})</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {car.name}
                      </h3>
                      <p className="text-xs text-slate-400 mb-4">{car.subtitle}</p>

                      {/* Key Specs Pills */}
                      <div className="grid grid-cols-3 gap-2 py-3 border-y border-cyan-500/10 mb-4 text-center">
                        <div className="bg-white/5 rounded-xl p-2">
                          <div className="text-[10px] text-slate-400 uppercase">Range / Fuel</div>
                          <div className="text-xs font-bold text-cyan-300">{car.range || car.fuel}</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-2">
                          <div className="text-[10px] text-slate-400 uppercase">0-100 km/h</div>
                          <div className="text-xs font-bold text-white">{car.acceleration}</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-2">
                          <div className="text-[10px] text-slate-400 uppercase">Power</div>
                          <div className="text-xs font-bold text-white">{car.power}</div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 mt-auto">
                      <button
                        onClick={() => onOpenDetails(car)}
                        className="py-2.5 px-3 rounded-xl btn-outline-neon text-xs font-bold text-cyan-300 flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Specs</span>
                      </button>
                      <button
                        onClick={() => onBookTestDrive(car)}
                        className="py-2.5 px-3 rounded-xl btn-neon text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <span>Test Drive</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
