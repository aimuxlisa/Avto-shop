'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Settings, ArrowRight, Sparkles } from 'lucide-react';

export default function Navbar({ favoritesCount, onOpenAdmin, onBookTestDrive }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'hero', label: 'Home' },
    { id: 'catalogue', label: 'Inventory' },
    { id: 'spotlight', label: '3D Spotlight' },
    { id: 'compare', label: 'Compare' },
    { id: 'calculator', label: 'Finance' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'feedback', label: 'Contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`sticky top-0 z-50 transition-all duration-300 px-4 lg:px-12 py-3.5 ${
        scrolled
          ? 'backdrop-blur-2xl bg-[#050914]/90 border-b border-cyan-500/25 shadow-[0_10px_30px_rgba(0,0,0,0.6)]'
          : 'backdrop-blur-md bg-[#050914]/70 border-b border-cyan-500/15'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo with Neon Car Icon */}
        <a href="#hero" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-1.5 bg-cyan-400/40 blur-md rounded-full group-hover:bg-cyan-400/70 transition-all duration-300" />
            <svg className="w-9 h-5 text-cyan-400 relative drop-shadow-[0_0_12px_rgba(56,189,248,0.9)]" viewBox="0 0 100 40" fill="none">
              <path d="M5 28C12 28 18 25 24 20C30 15 42 10 58 10C74 10 82 17 95 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              <path d="M22 21L36 12C42 8 58 8 68 12L80 21" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 3"/>
              <circle cx="28" cy="27" r="4.5" stroke="currentColor" strokeWidth="2.5" fill="#050914" />
              <circle cx="76" cy="27" r="4.5" stroke="currentColor" strokeWidth="2.5" fill="#050914" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-wider text-white">
              Auto<span className="text-cyan-400 font-black">Hub</span>
            </span>
            <span className="text-[9px] tracking-widest text-cyan-300/70 font-semibold uppercase -mt-1 hidden sm:inline">
              Drive Your Dream
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-2xl glass-card border border-cyan-500/20">
          {navLinks.map((link) => {
            const isActive = activeLink === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setActiveLink(link.id)}
                className={`relative px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors duration-200 ${
                  isActive ? 'text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute inset-0 rounded-xl bg-cyan-500/20 border border-cyan-400/40 shadow-[0_0_15px_rgba(56,189,248,0.25)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </a>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Admin / FAQ Manager Trigger */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenAdmin}
            className="p-2.5 rounded-xl glass-card hover:border-cyan-400/40 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
            title="FAQ Turso Database Manager"
          >
            <Settings className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold hidden sm:inline">FAQ Admin</span>
          </motion.button>

          {/* Favorites Counter */}
          <motion.a
            href="#catalogue"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2.5 rounded-xl glass-card hover:border-cyan-400/40 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
            title="View Favorites"
          >
            <Heart className={`w-4 h-4 transition-colors ${favoritesCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
            <span className="text-xs font-bold text-cyan-300">{favoritesCount}</span>
          </motion.a>

          {/* Book Test Drive Button */}
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(56,189,248,0.6)' }}
            whileTap={{ scale: 0.97 }}
            onClick={onBookTestDrive}
            className="py-2.5 px-5 rounded-xl btn-neon text-xs font-bold text-white tracking-wide flex items-center gap-2 shadow-lg"
          >
            <span>Book Test Drive</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
