'use client';

import React from 'react';
import { ArrowUp, Sparkles, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';
import { BUSINESS_DATA } from '../data/business';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-cyan-500/20 bg-[#03060f] pt-16 pb-12 px-4 lg:px-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-cyan-500/15">
        {/* Brand info */}
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center gap-2">
            <svg className="w-8 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]" viewBox="0 0 100 40" fill="none">
              <path d="M5 28C12 28 18 25 24 20C30 15 42 10 58 10C74 10 82 17 95 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              <path d="M22 21L36 12C42 8 58 8 68 12L80 21" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 3"/>
              <circle cx="28" cy="27" r="4.5" stroke="currentColor" strokeWidth="2.5" fill="#050914" />
              <circle cx="76" cy="27" r="4.5" stroke="currentColor" strokeWidth="2.5" fill="#050914" />
            </svg>
            <span className="text-xl font-extrabold text-white">
              Auto<span className="text-cyan-400">Hub</span>
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed max-w-sm">
            Next-generation digital automotive ecosystem connecting discerning drivers with verified luxury, performance, and electric vehicles worldwide.
          </p>
          <div className="flex items-center gap-2 text-cyan-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Certified Fleet Partner</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Showroom</h4>
          <ul className="space-y-2">
            <li><a href="#catalogue" className="hover:text-cyan-300 transition-colors">Electric Fleet</a></li>
            <li><a href="#catalogue" className="hover:text-cyan-300 transition-colors">Luxury SUVs</a></li>
            <li><a href="#spotlight" className="hover:text-cyan-300 transition-colors">3D Spotlight</a></li>
            <li><a href="#compare" className="hover:text-cyan-300 transition-colors">Vehicle Comparison</a></li>
          </ul>
        </div>

        {/* Finance & Services */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Finance & Services</h4>
          <ul className="space-y-2">
            <li><a href="#calculator" className="hover:text-cyan-300 transition-colors">Loan Calculator</a></li>
            <li><a href="#hero" className="hover:text-cyan-300 transition-colors">150-Point Inspection</a></li>
            <li><a href="#reviews" className="hover:text-cyan-300 transition-colors">Customer Reviews</a></li>
            <li><span className="text-slate-500">Turso Synced FAQ Database</span></li>
          </ul>
        </div>

        {/* Contact info */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Direct Contact</h4>
          <div className="space-y-2 text-slate-300">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              <span>{BUSINESS_DATA.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>concierge@autohub.com</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span>{BUSINESS_DATA.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          © {new Date().getFullYear()} AutoHub Inc. All rights reserved. Powered by Next.js & Gemini 3.5 Flash.
        </div>
        <button
          onClick={scrollToTop}
          className="p-2 rounded-xl glass-card text-slate-300 hover:text-white hover:border-cyan-400 transition-colors flex items-center gap-1.5"
        >
          <span>Back to Top</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
}
