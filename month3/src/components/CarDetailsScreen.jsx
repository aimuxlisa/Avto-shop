import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Star, 
  CheckCircle2, 
  ArrowRight,
  Gauge, 
  Zap, 
  Clock, 
  Activity 
} from 'lucide-react';

export default function CarDetailsScreen({ onBack, onBook }) {
  const [isFavorite, setIsFavorite] = useState(true);

  const specs = [
    { label: 'Range', value: '580', unit: 'km', icon: Zap },
    { label: 'Top Speed', value: '233', unit: 'km/h', icon: Gauge },
    { label: '0-100 km/h', value: '4.4', unit: 'sec', icon: Clock },
    { label: 'Power', value: '346', unit: 'HP', icon: Activity },
  ];

  const features = [
    'Dual Motor All-Wheel Drive',
    '15" Touchscreen Display',
    'Autopilot Included',
    'Premium Interior',
  ];

  return (
    <div className="relative min-h-[844px] w-full max-w-md mx-auto bg-[#060B19] text-white flex flex-col justify-between overflow-hidden rounded-[40px] border border-cyan-500/20 shadow-2xl">
      
      {/* Ambient Neon Backlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-cyan-500/15 rounded-full blur-[110px] pointer-events-none" />

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 pb-28">
        
        {/* Status Bar Indicator */}
        <div className="flex justify-between items-center text-xs text-slate-400 px-1 pt-1 mb-4">
          <span className="font-semibold text-white">9:41</span>
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5 items-end h-2.5">
              <div className="w-0.5 h-1 bg-white rounded-full"></div>
              <div className="w-0.5 h-1.5 bg-white rounded-full"></div>
              <div className="w-0.5 h-2 bg-white rounded-full"></div>
              <div className="w-0.5 h-2.5 bg-white rounded-full"></div>
            </div>
            <div className="w-5 h-2.5 border border-white rounded-sm p-0.5 flex items-center">
              <div className="w-3 h-full bg-white rounded-2xs"></div>
            </div>
          </div>
        </div>

        {/* Top Nav Action Bar */}
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-slate-300 hover:text-white hover:border-cyan-400/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className={`w-10 h-10 rounded-xl glass-card flex items-center justify-center transition-colors ${
                isFavorite ? 'text-rose-500 border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.3)]' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500' : ''}`} />
            </button>
            <button className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-slate-300 hover:text-white hover:border-cyan-400/50 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Car Header Info */}
        <div className="mb-3">
          <h1 className="text-2xl font-bold tracking-tight text-white mb-0.5">
            Tesla Model 3
          </h1>
          <p className="text-sm text-slate-400 font-medium mb-2.5">
            Long Range AWD
          </p>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
            <span>4.8</span>
            <span className="text-slate-400 font-normal">(120 Reviews)</span>
          </div>
        </div>

        {/* Car Photo on Futuristic Glowing Neon Podium */}
        <div className="relative w-full my-4 flex flex-col items-center justify-center">
          
          {/* Neon Circular Ring & Radiant Floor Glow */}
          <div className="relative w-full max-w-[320px] h-48 flex items-center justify-center">
            
            {/* Glowing 3D Base Rings */}
            <div className="absolute bottom-2 w-72 h-20 bg-cyan-500/25 rounded-[100%] blur-xl pointer-events-none"></div>
            <div className="absolute bottom-4 w-64 h-14 rounded-[100%] border-2 border-cyan-400 shadow-[0_0_25px_rgba(56,189,248,0.9),inset_0_0_15px_rgba(56,189,248,0.6)] pointer-events-none"></div>
            <div className="absolute bottom-6 w-52 h-10 rounded-[100%] border border-cyan-300/40 pointer-events-none"></div>

            {/* High Definition Tesla Model 3 */}
            <img
              src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=700&q=80"
              alt="Tesla Model 3 Long Range"
              className="relative z-10 w-72 object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.9)] transform hover:scale-105 transition-transform duration-300"
            />
          </div>

        </div>

        {/* Specs Grid (2x2 Glass Cards) */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {specs.map((item, idx) => (
            <div 
              key={idx}
              className="glass-card rounded-2xl p-2.5 flex flex-col items-center justify-center text-center group hover:border-cyan-400/40 transition-colors"
            >
              <span className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-medium">
                {item.label}
              </span>
              <div className="flex items-baseline gap-0.5">
                <span className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {item.value}
                </span>
                <span className="text-[9px] text-slate-400 font-medium">
                  {item.unit}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* About The Car Section */}
        <div className="glass-card rounded-3xl p-4 mb-4">
          <h3 className="text-sm font-bold text-white mb-2 tracking-wide">
            About The Car
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            Experience the perfect blend of performance, safety, and technology with Tesla Model 3. Built for the future.
          </p>

          {/* Key Features List with Cyan Checkmarks */}
          <div className="space-y-2.5">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-200">
                <div className="w-4 h-4 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <CheckCircle2 className="w-3.5 h-3.5 fill-cyan-400 text-[#060B19]" />
                </div>
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Sticky Bottom Booking Bar */}
      <div className="absolute bottom-0 inset-x-0 bg-[#060B19]/90 backdrop-blur-xl border-t border-cyan-500/20 p-4 px-6 flex items-center justify-between z-30">
        <div>
          <span className="text-[11px] text-slate-400 block font-medium">
            Starting Price
          </span>
          <span className="text-xl font-extrabold text-white tracking-tight">
            $42,990
          </span>
        </div>

        <button
          onClick={onBook}
          className="py-3 px-6 rounded-2xl btn-neon font-semibold text-sm flex items-center gap-2 text-white shadow-lg tracking-wide group"
        >
          <span>Check Availability</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
}
