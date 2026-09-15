import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function WelcomeScreen({ onGetStarted }) {
  return (
    <div className="relative min-h-[844px] w-full max-w-md mx-auto bg-[#060B19] text-white flex flex-col justify-between p-6 overflow-hidden rounded-[40px] border border-cyan-500/20 shadow-2xl">
      
      {/* Background Neon Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-[110px] pointer-events-none" />

      {/* Decorative Neon Inner Frame */}
      <div className="absolute inset-3 rounded-[34px] border border-cyan-400/20 pointer-events-none shadow-[inset_0_0_20px_rgba(56,189,248,0.1)]" />

      {/* Top Status Bar Spacer & Indicator */}
      <div className="relative z-10 flex justify-between items-center text-xs text-slate-400 px-3 pt-1">
        <span className="font-semibold text-white">9:41</span>
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5 items-end h-2.5">
            <div className="w-0.5 h-1 bg-white rounded-full"></div>
            <div className="w-0.5 h-1.5 bg-white rounded-full"></div>
            <div className="w-0.5 h-2 bg-white rounded-full"></div>
            <div className="w-0.5 h-2.5 bg-white rounded-full"></div>
          </div>
          <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3C7.5 3 3.7 4.9 1 8l11 13 11-13c-2.7-3.1-6.5-5-11-5z"/>
          </svg>
          <div className="w-5 h-2.5 border border-white rounded-sm p-0.5 flex items-center">
            <div className="w-3 h-full bg-white rounded-2xs"></div>
          </div>
        </div>
      </div>

      {/* Brand Header */}
      <div className="relative z-10 text-center mt-6 flex flex-col items-center">
        {/* Glowing Logo Icon */}
        <div className="relative mb-2 flex items-center justify-center">
          <div className="absolute -inset-2 bg-cyan-400/30 blur-lg rounded-full animate-pulse-slow"></div>
          <svg className="w-24 h-12 text-cyan-400 drop-shadow-[0_0_12px_rgba(56,189,248,0.8)]" viewBox="0 0 100 40" fill="none">
            <path d="M5 28C12 28 18 25 24 20C30 15 42 10 58 10C74 10 82 17 95 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M22 21L36 12C42 8 58 8 68 12L80 21" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1 2"/>
            <circle cx="28" cy="27" r="4.5" stroke="currentColor" strokeWidth="2" fill="#060B19" />
            <circle cx="76" cy="27" r="4.5" stroke="currentColor" strokeWidth="2" fill="#060B19" />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold tracking-wider bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]">
          Auto<span className="text-cyan-400 font-black">Hub</span>
        </h1>
        <p className="text-sm tracking-widest text-cyan-200/80 font-medium uppercase mt-1">
          Drive Your Dream
        </p>

        {/* Divider line */}
        <div className="w-12 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent my-4 opacity-70" />

        <p className="text-xs text-slate-300 max-w-[240px] leading-relaxed">
          Explore. Compare. Drive.<br />All in One Auto Platform.
        </p>
      </div>

      {/* Center 3D Car Visual with Neon Ground Lighting */}
      <div className="relative z-10 my-auto py-2 flex flex-col items-center">
        <div className="relative w-full flex items-center justify-center">
          {/* Luminous Floor Reflections */}
          <div className="absolute -bottom-4 w-72 h-14 bg-gradient-to-r from-cyan-500/40 via-blue-600/40 to-cyan-400/40 blur-xl rounded-full"></div>
          <div className="absolute -bottom-1 w-64 h-2 bg-cyan-400/80 blur-sm rounded-full"></div>

          {/* Supercar Image with High Quality Neon Silhouette */}
          <img
            src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80"
            alt="Futuristic Dark Supercar"
            className="w-full max-w-[340px] object-cover h-56 rounded-2xl drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] z-10 transform hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>

      {/* Bottom Action Area */}
      <div className="relative z-10 flex flex-col items-center gap-4 mb-2">
        {/* Main Neon Action Button */}
        <button
          onClick={onGetStarted}
          className="w-full py-4 px-6 rounded-2xl btn-neon font-semibold text-base flex items-center justify-center gap-2 text-white tracking-wide group"
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Sign In Link */}
        <p className="text-xs text-slate-400">
          Already have an account?{' '}
          <button onClick={onGetStarted} className="text-cyan-400 font-semibold hover:underline">
            Sign In
          </button>
        </p>

        {/* Pagination Indicators */}
        <div className="flex items-center gap-2 mt-2">
          <span className="w-5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
        </div>
      </div>

    </div>
  );
}
