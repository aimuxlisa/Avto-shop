import React from 'react';
import { 
  Menu, 
  Bell, 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  Tag, 
  ArrowLeftRight, 
  Heart, 
  BadgePercent, 
  Home, 
  Car, 
  MessageSquare, 
  User,
  ChevronRight
} from 'lucide-react';

export default function HomeScreen({ onNavigate, onSelectCar }) {
  const quickActions = [
    { label: 'New Cars', icon: Sparkles },
    { label: 'Used Cars', icon: Tag },
    { label: 'Compare', icon: ArrowLeftRight },
    { label: 'Favorites', icon: Heart },
    { label: 'Deals', icon: BadgePercent },
  ];

  const featuredBrands = [
    { 
      name: 'Tesla', 
      logo: (
        <svg className="w-6 h-6 fill-current text-white group-hover:text-cyan-400 transition-colors" viewBox="0 0 24 24">
          <path d="M12 4.6c2.8 0 5.4.6 7.6 1.7l.8-2C17.9 3.1 15 2.4 12 2.4S6.1 3.1 3.6 4.3l.8 2C6.6 5.2 9.2 4.6 12 4.6zm-8.8 3.8l1.3 1.7c4.6-2.1 10.4-2.1 15 0l1.3-1.7C15.3 5.9 8.7 5.9 3.2 8.4zm8.8 3.2c-1.3 0-2.4-.1-3.2-.3l-.5 2.2c1.2.3 2.5.4 3.7.4s2.5-.1 3.7-.4l-.5-2.2c-.8.2-1.9.3-3.2.3zm0 3.3c-.6 2.1-1.2 4.8-1.5 7.5h3c-.3-2.7-.9-5.4-1.5-7.5z"/>
        </svg>
      )
    },
    { 
      name: 'BMW', 
      logo: (
        <div className="w-6 h-6 rounded-full border border-white flex items-center justify-center font-bold text-[9px] text-cyan-400 group-hover:border-cyan-400">
          BMW
        </div>
      )
    },
    { 
      name: 'Mercedes', 
      logo: (
        <svg className="w-6 h-6 stroke-current text-white group-hover:text-cyan-400 transition-colors" viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9"/>
          <path d="M12 3v9M12 12l-7.8 4.5M12 12l7.8 4.5"/>
        </svg>
      )
    },
    { 
      name: 'Audi', 
      logo: (
        <div className="flex -space-x-1.5 items-center justify-center">
          <div className="w-3 h-3 rounded-full border border-white group-hover:border-cyan-400"></div>
          <div className="w-3 h-3 rounded-full border border-white group-hover:border-cyan-400"></div>
          <div className="w-3 h-3 rounded-full border border-white group-hover:border-cyan-400"></div>
          <div className="w-3 h-3 rounded-full border border-white group-hover:border-cyan-400"></div>
        </div>
      )
    },
    { 
      name: 'Toyota', 
      logo: (
        <div className="w-6 h-5 rounded-full border border-white flex items-center justify-center group-hover:border-cyan-400">
          <div className="w-4 h-3 rounded-full border border-white group-hover:border-cyan-400"></div>
        </div>
      )
    },
  ];

  const categories = [
    { name: 'SUV', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=300&q=80' },
    { name: 'Sedan', image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=300&q=80' },
    { name: 'Hatchback', image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=300&q=80' },
    { name: 'Coupe', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=300&q=80' },
    { name: 'Electric', image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=300&q=80' },
  ];

  return (
    <div className="relative min-h-[844px] w-full max-w-md mx-auto bg-[#060B19] text-white flex flex-col justify-between overflow-hidden rounded-[40px] border border-cyan-500/20 shadow-2xl">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 pb-24">
        
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

        {/* Top Header Bar */}
        <div className="flex items-center justify-between mb-5">
          <button className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-slate-300 hover:text-white hover:border-cyan-400/40 transition-colors">
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <svg className="w-7 h-4 text-cyan-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]" viewBox="0 0 100 40" fill="none">
              <path d="M5 28C12 28 18 25 24 20C30 15 42 10 58 10C74 10 82 17 95 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="28" cy="27" r="4.5" stroke="currentColor" strokeWidth="2.5" fill="#060B19" />
              <circle cx="76" cy="27" r="4.5" stroke="currentColor" strokeWidth="2.5" fill="#060B19" />
            </svg>
            <h1 className="text-xl font-extrabold tracking-wide bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
              Auto<span className="text-cyan-400">Hub</span>
            </h1>
          </div>

          <button className="relative w-10 h-10 rounded-xl glass-card flex items-center justify-center text-slate-300 hover:text-white hover:border-cyan-400/40 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute 1 top-2 right-2 w-2.5 h-2.5 bg-cyan-400 rounded-full ring-2 ring-[#060B19] shadow-[0_0_6px_rgba(56,189,248,0.9)] flex items-center justify-center text-[7px] font-bold text-black">
              3
            </span>
          </button>
        </div>

        {/* Search Bar with Filter */}
        <div className="flex items-center gap-2.5 mb-6">
          <div 
            onClick={() => onNavigate('search')}
            className="flex-1 h-12 rounded-2xl glass-card px-4 flex items-center gap-3 cursor-pointer hover:border-cyan-400/40 transition-all group"
          >
            <Search className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            <span className="text-sm text-slate-400 select-none">Search cars, brands, models...</span>
          </div>
          <button 
            onClick={() => onNavigate('search')}
            className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400/50 transition-all shadow-[0_0_12px_rgba(56,189,248,0.15)]"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Banner with Neon Shield */}
        <div className="relative rounded-3xl p-5 mb-6 overflow-hidden glass-card border border-cyan-500/30">
          {/* Luminous background badge */}
          <div className="absolute right-2 -bottom-4 w-44 h-44 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none"></div>

          {/* Futuristic Neon Shield Graphic in Background */}
          <div className="absolute right-4 top-2 opacity-20 pointer-events-none">
            <svg className="w-32 h-32 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>

          <div className="relative z-10 max-w-[190px]">
            <h2 className="text-lg font-bold leading-tight mb-1 text-white">
              Find Your <br />
              <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]">Perfect Car</span>
            </h2>
            <p className="text-[11px] text-slate-300 leading-snug mb-3">
              Explore thousands of cars from trusted dealers near you.
            </p>
            <button 
              onClick={() => onSelectCar('tesla-3')}
              className="py-2 px-4 rounded-xl btn-neon text-xs font-semibold text-white tracking-wide flex items-center gap-1.5"
            >
              Explore Now
            </button>
          </div>

          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80"
            alt="Hero Car"
            className="absolute -right-6 -bottom-1 w-44 object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)] pointer-events-none"
          />

          {/* Banner Pagination Indicator */}
          <div className="flex items-center gap-1.5 justify-center mt-3">
            <span className="w-4 h-1 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(56,189,248,0.8)]"></span>
            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
          </div>
        </div>

        {/* Quick Actions (5 buttons in a row) */}
        <div className="grid grid-cols-5 gap-2 mb-6">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                onClick={() => onNavigate('search')}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div className="w-13 h-13 p-3 rounded-2xl glass-card-interactive flex items-center justify-center text-cyan-400 group-hover:text-white group-hover:bg-gradient-to-b group-hover:from-blue-600 group-hover:to-cyan-500 shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
                  <Icon className="w-5 h-5 drop-shadow-[0_0_6px_rgba(56,189,248,0.6)]" />
                </div>
                <span className="text-[10px] font-medium text-slate-300 group-hover:text-cyan-300 text-center tracking-tight truncate w-full">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Featured Brands */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-bold text-white tracking-wide">Featured Brands</h3>
            <button 
              onClick={() => onNavigate('search')}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center font-medium gap-0.5"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {featuredBrands.map((brand, idx) => (
              <div
                key={idx}
                onClick={() => onNavigate('search')}
                className="glass-card-interactive rounded-2xl p-2.5 flex flex-col items-center justify-center gap-1.5 cursor-pointer group"
              >
                <div className="w-7 h-7 flex items-center justify-center">
                  {brand.logo}
                </div>
                <span className="text-[10px] font-semibold text-slate-300 group-hover:text-cyan-300">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Categories */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-bold text-white tracking-wide">Popular Categories</h3>
            <button 
              onClick={() => onNavigate('search')}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center font-medium gap-0.5"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                onClick={() => onNavigate('search')}
                className="flex-shrink-0 w-24 glass-card-interactive rounded-2xl p-2 flex flex-col items-center gap-1.5 cursor-pointer group"
              >
                <div className="w-full h-12 rounded-xl overflow-hidden bg-slate-900/60 relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <span className="text-[11px] font-medium text-slate-200 group-hover:text-cyan-300">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Fixed Sticky Bottom Navigation Bar */}
      <div className="absolute bottom-0 inset-x-0 bg-[#060B19]/85 backdrop-blur-xl border-t border-cyan-500/20 px-6 py-3 flex justify-between items-center z-30">
        <button 
          onClick={() => onNavigate('home')}
          className="flex flex-col items-center gap-1 text-cyan-400"
        >
          <Home className="w-5 h-5 drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]" />
          <span className="text-[10px] font-semibold">Home</span>
        </button>

        <button 
          onClick={() => onNavigate('search')}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px]">Search</span>
        </button>

        <button 
          onClick={() => onNavigate('details')}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <Car className="w-5 h-5" />
          <span className="text-[10px]">My Garage</span>
        </button>

        <button 
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px]">Messages</span>
        </button>

        <button 
          onClick={() => onNavigate('welcome')}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Profile</span>
        </button>
      </div>

    </div>
  );
}
