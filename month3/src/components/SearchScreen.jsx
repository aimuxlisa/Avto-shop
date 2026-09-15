import React, { useState } from 'react';
import { 
  ArrowLeft, 
  SlidersHorizontal, 
  ChevronDown, 
  Heart, 
  Home, 
  Search, 
  Car, 
  MessageSquare, 
  User,
  MapPin
} from 'lucide-react';

export default function SearchScreen({ onBack, onNavigate, onSelectCar }) {
  const [selectedTag, setSelectedTag] = useState('All');
  const [favorites, setFavorites] = useState({ 0: false, 1: false, 2: false, 3: false });

  const filterTags = ['All', 'SUV', 'Sedan', 'Hatchback', 'Coupe', 'Electric'];

  const cars = [
    {
      id: 'bmw-x5',
      name: 'BMW X5',
      subtitle: '2024 • SUV',
      price: '$65,500',
      location: 'New York, USA',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'audi-a6',
      name: 'Audi A6',
      subtitle: '2023 • Sedan',
      price: '$48,900',
      location: 'Chicago, USA',
      image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'tesla-y',
      name: 'Tesla Model Y',
      subtitle: '2024 • Electric SUV',
      price: '$52,900',
      location: 'San Francisco, USA',
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'mercedes-c',
      name: 'Mercedes C-Class',
      subtitle: '2023 • Sedan',
      price: '$46,200',
      location: 'Miami, USA',
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=400&q=80',
    },
  ];

  const toggleFav = (idx, e) => {
    e.stopPropagation();
    setFavorites(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="relative min-h-[844px] w-full max-w-md mx-auto bg-[#060B19] text-white flex flex-col justify-between overflow-hidden rounded-[40px] border border-cyan-500/20 shadow-2xl">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-72 h-72 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

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

        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-slate-300 hover:text-white hover:border-cyan-400/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-lg font-bold text-white tracking-wide">
            Find Your Car
          </h1>

          <button className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-cyan-400 hover:text-white hover:border-cyan-400/50 transition-colors shadow-[0_0_10px_rgba(56,189,248,0.2)]">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Horizontal Category Tags */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 mb-3">
          {filterTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedTag === tag
                  ? 'btn-neon text-white'
                  : 'glass-card text-slate-300 hover:text-white hover:border-cyan-500/30'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Filter Dropdown Buttons */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-4">
          <button className="glass-card px-3 py-1.5 rounded-xl text-xs text-slate-300 flex items-center gap-1.5 hover:border-cyan-400/40">
            <span>Price</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <button className="glass-card px-3 py-1.5 rounded-xl text-xs text-slate-300 flex items-center gap-1.5 hover:border-cyan-400/40">
            <span>Brand</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <button className="glass-card px-3 py-1.5 rounded-xl text-xs text-slate-300 flex items-center gap-1.5 hover:border-cyan-400/40">
            <span>Year</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <button className="glass-card px-3 py-1.5 rounded-xl text-xs text-cyan-400 flex items-center gap-1.5 hover:border-cyan-400/50">
            <SlidersHorizontal className="w-3 h-3" />
            <span>More Filters</span>
          </button>
        </div>

        {/* Results Count & Sort Dropdown */}
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-xs text-slate-400 font-medium">
            1286 Cars Found
          </span>
          <button className="text-xs text-slate-300 flex items-center gap-1 font-medium hover:text-cyan-400">
            <span>Sort by: <span className="text-cyan-400">Popular</span></span>
            <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>

        {/* Vertical List of Car Cards */}
        <div className="space-y-3.5">
          {cars.map((car, idx) => (
            <div
              key={car.id}
              onClick={() => onSelectCar(car.id)}
              className="glass-card-interactive rounded-3xl p-3 flex gap-3.5 items-center cursor-pointer group"
            >
              {/* Car Thumbnail */}
              <div className="w-32 h-24 rounded-2xl overflow-hidden bg-slate-900/80 relative flex-shrink-0 flex items-center justify-center">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              </div>

              {/* Car Content Info */}
              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                      {car.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {car.subtitle}
                    </p>
                  </div>
                  
                  {/* Favorite Toggle Button */}
                  <button
                    onClick={(e) => toggleFav(idx, e)}
                    className={`w-7 h-7 rounded-lg glass-card flex items-center justify-center transition-colors ${
                      favorites[idx] ? 'text-rose-500 border-rose-500/40' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${favorites[idx] ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>

                {/* Price & Location */}
                <div className="mt-2.5 flex items-end justify-between">
                  <span className="text-sm font-extrabold text-white tracking-tight">
                    {car.price}
                  </span>
                  
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    <span className="truncate max-w-[90px]">{car.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Fixed Sticky Bottom Navigation Bar */}
      <div className="absolute bottom-0 inset-x-0 bg-[#060B19]/85 backdrop-blur-xl border-t border-cyan-500/20 px-6 py-3 flex justify-between items-center z-30">
        <button 
          onClick={() => onNavigate('home')}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        <button 
          onClick={() => onNavigate('search')}
          className="flex flex-col items-center gap-1 text-cyan-400"
        >
          <Search className="w-5 h-5 drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]" />
          <span className="text-[10px] font-semibold">Search</span>
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
