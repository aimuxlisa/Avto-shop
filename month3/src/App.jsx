import React, { useState } from 'react';
import { CARS_DATA, BRANDS_DATA } from './data/cars';
import ChatWidget from './components/chat/ChatWidget';
import AdminPanel from './components/admin/AdminPanel';
import { 
  Search, 
  SlidersHorizontal, 
  Heart, 
  Sparkles, 
  Tag, 
  ArrowLeftRight, 
  BadgePercent, 
  Star, 
  CheckCircle2, 
  ArrowRight, 
  MapPin, 
  Gauge, 
  Zap, 
  Clock, 
  Activity, 
  ChevronRight, 
  ChevronDown, 
  X, 
  ShieldCheck, 
  PhoneCall, 
  Fuel, 
  Layers, 
  Calendar,
  Eye,
  Settings
} from 'lucide-react';

export default function App() {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [favorites, setFavorites] = useState(['tesla-3']);
  const [selectedCarModal, setSelectedCarModal] = useState(null);
  const [bookingModalCar, setBookingModalCar] = useState(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [spotlightColor, setSpotlightColor] = useState('dark');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Compare tool state
  const [compareCar1, setCompareCar1] = useState(CARS_DATA[0]);
  const [compareCar2, setCompareCar2] = useState(CARS_DATA[1]);

  // Filter cars based on search, category and brand
  const filteredCars = CARS_DATA.filter((car) => {
    const matchesCategory = selectedCategory === 'All' || car.category === selectedCategory || (selectedCategory === 'Electric' && car.type === 'Electric');
    const matchesBrand = selectedBrand === 'All' || car.brand === selectedBrand;
    const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          car.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          car.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesBrand && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.reviews - a.reviews;
  });

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingModalCar(null);
    }, 2500);
  };

  const spotlightCar = CARS_DATA.find(c => c.id === 'tesla-3');

  const categories = ['All', 'SUV', 'Sedan', 'Coupe', 'Electric'];

  return (
    <div className="min-h-screen bg-[#050914] text-slate-100 relative selection:bg-cyan-500 selection:text-white font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* ========================================================================= */}
      {/* BACKGROUND ATMOSPHERIC NEON BOKEH & LIGHTING (Matching exact mockup mood) */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top ambient center beam */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[550px] bg-gradient-to-b from-cyan-500/20 via-blue-600/10 to-transparent rounded-full blur-[140px]" />
        
        {/* Left deep cyan orb */}
        <div className="absolute top-[28%] -left-32 w-[550px] h-[550px] bg-cyan-600/12 rounded-full blur-[160px]" />
        
        {/* Right vibrant blue orb */}
        <div className="absolute top-[48%] -right-32 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[170px]" />
        
        {/* Bottom ambient lighting */}
        <div className="absolute bottom-0 left-1/3 w-[800px] h-[500px] bg-cyan-500/10 rounded-full blur-[180px]" />

        {/* Subtle cyber vertical light flares */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:48px_48px] opacity-[0.03]" />
      </div>

      {/* Main Content Wrapper */}
      <div className="relative z-10">

        {/* ========================================================================= */}
        {/* TOP NAVIGATION BAR */}
        {/* ========================================================================= */}
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#050914]/80 border-b border-cyan-500/20 px-4 lg:px-12 py-3.5 transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            
            {/* Brand Logo with Neon Car Icon */}
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="relative flex items-center justify-center">
                <div className="absolute -inset-1 bg-cyan-400/40 blur-md rounded-full group-hover:bg-cyan-400/60 transition-colors"></div>
                <svg className="w-9 h-5 text-cyan-400 relative drop-shadow-[0_0_10px_rgba(56,189,248,0.9)]" viewBox="0 0 100 40" fill="none">
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
            <div className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl glass-card border border-cyan-500/20">
              <a href="#hero" className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-cyan-500/20 border border-cyan-400/30 shadow-[0_0_12px_rgba(56,189,248,0.2)]">
                Home
              </a>
              <a href="#catalogue" className="px-4 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                Inventory
              </a>
              <a href="#spotlight" className="px-4 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                3D Spotlight
              </a>
              <a href="#compare" className="px-4 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                Compare
              </a>
              <a href="#brands" className="px-4 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                Brands
              </a>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Admin FAQ Panel Trigger */}
              <button 
                onClick={() => setShowAdminModal(true)}
                className="p-2.5 rounded-xl glass-card hover:border-cyan-400/40 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                title="FAQ База / Admin (/admin)"
              >
                <Settings className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold hidden sm:inline">FAQ Admin</span>
              </button>

              {/* Favorites Counter */}
              <a 
                href="#catalogue"
                className="relative p-2.5 rounded-xl glass-card hover:border-cyan-400/40 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                title="Favorites"
              >
                <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
                <span className="text-xs font-bold text-cyan-300">{favorites.length}</span>
              </a>

              {/* Action Button */}
              <button 
                onClick={() => setBookingModalCar(spotlightCar)}
                className="py-2.5 px-5 rounded-xl btn-neon text-xs font-bold text-white tracking-wide flex items-center gap-2 shadow-lg"
              >
                <span>Book Test Drive</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </nav>

        {/* ========================================================================= */}
        {/* HERO SECTION WITH NEON CAR SHOWCASE & SEARCH BAR */}
        {/* ========================================================================= */}
        <header id="hero" className="relative pt-12 pb-16 px-4 lg:px-12 max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Heading & Fast Search Form */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-5 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Next-Gen Dark Auto Marketplace</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-4">
                Drive Your <br />
                <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(56,189,248,0.4)]">
                  Electric Dream.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed mb-8">
                Explore. Compare. Drive. Discover thousands of verified luxury, sports, and electric vehicles with seamless online booking and transparent pricing.
              </p>

              {/* Fast Search Glass Box */}
              <div className="w-full glass-card rounded-3xl p-4 sm:p-5 border border-cyan-500/30 shadow-2xl">
                
                {/* Search Input Bar */}
                <div className="relative mb-3">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by brand, model (e.g. Tesla, BMW, Audi)..."
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl glass-input text-sm text-white placeholder-slate-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-xs text-slate-400 font-medium mr-1">Body:</span>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        selectedCategory === cat
                          ? 'btn-neon text-white shadow-md'
                          : 'glass-card text-slate-300 hover:text-white hover:border-cyan-500/40'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Dropdowns & Submit */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="glass-input px-3 py-2.5 rounded-xl text-xs text-slate-200 cursor-pointer"
                  >
                    <option value="All" className="bg-[#050914] text-white">All Brands</option>
                    <option value="Tesla" className="bg-[#050914] text-white">Tesla</option>
                    <option value="BMW" className="bg-[#050914] text-white">BMW</option>
                    <option value="Mercedes" className="bg-[#050914] text-white">Mercedes</option>
                    <option value="Audi" className="bg-[#050914] text-white">Audi</option>
                    <option value="Porsche" className="bg-[#050914] text-white">Porsche</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="glass-input px-3 py-2.5 rounded-xl text-xs text-slate-200 cursor-pointer"
                  >
                    <option value="popular" className="bg-[#050914] text-white">Sort: Popular</option>
                    <option value="price-low" className="bg-[#050914] text-white">Price: Low to High</option>
                    <option value="price-high" className="bg-[#050914] text-white">Price: High to Low</option>
                    <option value="rating" className="bg-[#050914] text-white">Top Rated</option>
                  </select>

                  <a
                    href="#catalogue"
                    className="col-span-2 sm:col-span-1 py-2.5 px-4 rounded-xl btn-neon text-xs font-bold text-white text-center flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <span>Search ({filteredCars.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>

            </div>

            {/* Right Column: Hero Visual with Glowing Floor Reflections */}
            <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
              
              {/* Radial background shield & light burst */}
              <div className="absolute w-80 sm:w-[450px] h-80 sm:h-[450px] bg-gradient-to-tr from-cyan-500/25 to-blue-600/20 rounded-full blur-[100px] pointer-events-none" />

              {/* Floating Spec Badges */}
              <div className="absolute top-4 left-2 sm:-left-4 z-20 glass-card p-3 rounded-2xl border border-cyan-400/30 flex items-center gap-3 shadow-xl backdrop-blur-xl animate-pulse-slow">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">0-100 km/h</span>
                  <span className="text-sm font-extrabold text-white">3.5 sec</span>
                </div>
              </div>

              <div className="absolute bottom-6 right-2 sm:-right-4 z-20 glass-card p-3 rounded-2xl border border-cyan-400/30 flex items-center gap-3 shadow-xl backdrop-blur-xl">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center text-cyan-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Certified</span>
                  <span className="text-sm font-extrabold text-white">100% Verified</span>
                </div>
              </div>

              {/* Main Supercar Visual */}
              <div className="relative w-full max-w-[540px] flex flex-col items-center">
                
                {/* Luminous Neon Ground Ring */}
                <div className="absolute -bottom-8 w-full h-24 bg-gradient-to-r from-cyan-500/50 via-blue-500/50 to-cyan-400/50 blur-2xl rounded-full"></div>
                <div className="absolute -bottom-2 w-[85%] h-3 bg-cyan-400 blur-sm rounded-full"></div>

                <img
                  src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1000&q=80"
                  alt="Flagship Supercar"
                  className="relative z-10 w-full object-contain rounded-3xl drop-shadow-[0_25px_35px_rgba(0,0,0,0.9)] transform hover:scale-102 transition-transform duration-500"
                />
              </div>

            </div>

          </div>

          {/* Quick Action Category Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 mt-14">
            {[
              { label: 'New Cars', count: '450+ Available', icon: Sparkles, color: 'text-cyan-400' },
              { label: 'Certified Used', count: '830+ Inspected', icon: Tag, color: 'text-blue-400' },
              { label: 'Instant Compare', count: 'Side-by-Side Tool', icon: ArrowLeftRight, color: 'text-sky-400' },
              { label: 'Favorites', count: `${favorites.length} Saved`, icon: Heart, color: 'text-rose-400' },
              { label: 'Hot Deals', count: 'Up to 15% OFF', icon: BadgePercent, color: 'text-amber-400' },
            ].map((action, idx) => {
              const Icon = action.icon;
              return (
                <a
                  key={idx}
                  href="#catalogue"
                  className="glass-card-hover rounded-2xl p-4 flex items-center gap-3.5 cursor-pointer group"
                >
                  <div className="w-11 h-11 rounded-xl bg-slate-900/80 border border-cyan-500/20 flex items-center justify-center group-hover:border-cyan-400/50 transition-colors shadow-md">
                    <Icon className={`w-5 h-5 ${action.color} drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]`} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {action.label}
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      {action.count}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>

        </header>

        {/* ========================================================================= */}
        {/* INTERACTIVE 3D SPOTLIGHT SECTION (Tesla Model 3 on Glowing Podium) */}
        {/* ========================================================================= */}
        <section id="spotlight" className="py-16 px-4 lg:px-12 max-w-7xl mx-auto border-t border-cyan-500/20">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-3">
              <Star className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
              <span>Spotlight of the Week</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Tesla Model 3 <span className="text-cyan-400">Long Range AWD</span>
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Experience the vehicle designed for pure performance, unmatched safety ratings, and class-leading battery range.
            </p>
          </div>

          <div className="glass-card rounded-[36px] p-6 lg:p-10 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
            
            {/* Inner background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              
              {/* Left Column: Spec Metrics Grid & Key Highlights */}
              <div className="lg:col-span-4 space-y-4">
                
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                    <span>4.8 Rating</span>
                  </div>
                  <span className="text-xs text-slate-400">120 Verified Owner Reviews</span>
                </div>

                {/* 2x2 Specs Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Range', value: spotlightCar.range, icon: Zap },
                    { label: 'Top Speed', value: spotlightCar.topSpeed, icon: Gauge },
                    { label: '0-100 km/h', value: spotlightCar.acceleration, icon: Clock },
                    { label: 'Max Power', value: spotlightCar.power, icon: Activity },
                  ].map((spec, idx) => {
                    const Icon = spec.icon;
                    return (
                      <div key={idx} className="glass-card rounded-2xl p-3.5 flex flex-col items-start border border-cyan-400/20 group hover:border-cyan-400/50 transition-colors">
                        <div className="flex items-center justify-between w-full mb-1.5">
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{spec.label}</span>
                          <Icon className="w-3.5 h-3.5 text-cyan-400" />
                        </div>
                        <span className="text-lg font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                          {spec.value}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* About & Feature Bullets */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2.5">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider text-cyan-300">
                    Key Equipment:
                  </h4>
                  {spotlightCar.features.slice(0, 4).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Center Column: Car on Futuristic Glowing Podium */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center py-6">
                
                {/* 3D Glowing Podium Platform */}
                <div className="relative w-full max-w-[420px] h-64 sm:h-72 flex items-center justify-center">
                  
                  {/* Radiant Neon Floor Halo */}
                  <div className="absolute bottom-2 w-full h-24 bg-cyan-500/30 rounded-[100%] blur-2xl pointer-events-none"></div>
                  
                  {/* Concentric Neon Rings */}
                  <div className="absolute bottom-4 w-[90%] h-20 rounded-[100%] border-2 border-cyan-400 shadow-[0_0_35px_rgba(56,189,248,0.9),inset_0_0_20px_rgba(56,189,248,0.5)] pointer-events-none"></div>
                  <div className="absolute bottom-7 w-[75%] h-14 rounded-[100%] border border-cyan-300/40 pointer-events-none"></div>

                  {/* High Quality Car Image */}
                  <img
                    src={spotlightCar.image}
                    alt="Tesla Model 3"
                    className="relative z-10 w-full object-contain drop-shadow-[0_25px_30px_rgba(0,0,0,0.9)] transform hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Interactive Color Switcher */}
                <div className="flex items-center gap-3 mt-4 glass-card px-4 py-2 rounded-full border border-cyan-400/20">
                  <span className="text-[11px] text-slate-400 font-medium">Color:</span>
                  <button 
                    onClick={() => setSpotlightColor('dark')} 
                    className={`w-5 h-5 rounded-full bg-slate-900 border-2 ${spotlightColor === 'dark' ? 'border-cyan-400 ring-2 ring-cyan-400/40' : 'border-slate-600'}`}
                    title="Solid Black"
                  />
                  <button 
                    onClick={() => setSpotlightColor('white')} 
                    className={`w-5 h-5 rounded-full bg-slate-100 border-2 ${spotlightColor === 'white' ? 'border-cyan-400 ring-2 ring-cyan-400/40' : 'border-slate-600'}`}
                    title="Pearl White"
                  />
                  <button 
                    onClick={() => setSpotlightColor('blue')} 
                    className={`w-5 h-5 rounded-full bg-blue-600 border-2 ${spotlightColor === 'blue' ? 'border-cyan-400 ring-2 ring-cyan-400/40' : 'border-slate-600'}`}
                    title="Deep Blue"
                  />
                  <button 
                    onClick={() => setSpotlightColor('red')} 
                    className={`w-5 h-5 rounded-full bg-rose-600 border-2 ${spotlightColor === 'red' ? 'border-cyan-400 ring-2 ring-cyan-400/40' : 'border-slate-600'}`}
                    title="Red Multi-Coat"
                  />
                </div>

              </div>

              {/* Right Column: Pricing & Booking Panel */}
              <div className="lg:col-span-3 flex flex-col justify-between glass-card p-6 rounded-3xl border border-cyan-400/30 h-full">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                    Transparent Price
                  </span>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-extrabold text-white tracking-tight">
                      {spotlightCar.priceDisplay}
                    </span>
                    <span className="text-xs text-cyan-300 font-medium">or $549/mo</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Available in San Francisco, USA</span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-xs py-1.5 border-b border-white/5">
                      <span className="text-slate-400">Transmission</span>
                      <span className="font-semibold text-white">{spotlightCar.transmission}</span>
                    </div>
                    <div className="flex justify-between text-xs py-1.5 border-b border-white/5">
                      <span className="text-slate-400">Fuel Economy</span>
                      <span className="font-semibold text-white">{spotlightCar.fuel}</span>
                    </div>
                    <div className="flex justify-between text-xs py-1.5 border-b border-white/5">
                      <span className="text-slate-400">Warranty</span>
                      <span className="font-semibold text-cyan-300">8 Years / 160,000 km</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <button
                    onClick={() => setBookingModalCar(spotlightCar)}
                    className="w-full py-3.5 px-4 rounded-2xl btn-neon font-bold text-xs text-white tracking-wider flex items-center justify-center gap-2 shadow-lg group"
                  >
                    <span>Check Availability</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => setSelectedCarModal(spotlightCar)}
                    className="w-full py-3 px-4 rounded-2xl btn-outline-neon font-semibold text-xs text-slate-200 flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>View Full Specs</span>
                  </button>
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* LIVE INVENTORY & CATALOGUE SECTION */}
        {/* ========================================================================= */}
        <section id="catalogue" className="py-16 px-4 lg:px-12 max-w-7xl mx-auto border-t border-cyan-500/20">
          
          {/* Header & Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-semibold tracking-wider uppercase mb-1">
                <Layers className="w-3.5 h-3.5" />
                <span>Verified Stock</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Find Your Car <span className="text-slate-400 font-normal text-lg">({filteredCars.length} results)</span>
              </h2>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'btn-neon text-white shadow-md'
                      : 'glass-card text-slate-300 hover:text-white hover:border-cyan-400/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cars Grid */}
          {filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car) => {
                const isFav = favorites.includes(car.id);
                return (
                  <div
                    key={car.id}
                    className="glass-card-hover rounded-3xl p-4 flex flex-col justify-between border border-cyan-500/20 group relative overflow-hidden"
                  >
                    
                    {/* Top Image Container with Badges */}
                    <div>
                      <div className="relative w-full h-52 rounded-2xl overflow-hidden bg-slate-900/90 mb-4 flex items-center justify-center">
                        <img
                          src={car.image}
                          alt={car.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050914] via-transparent to-transparent opacity-80" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-cyan-500/80 text-white backdrop-blur-md shadow-md">
                            {car.year}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-black/60 text-slate-200 backdrop-blur-md border border-white/10">
                            {car.category}
                          </span>
                        </div>

                        {/* Favorite Button */}
                        <button
                          onClick={() => toggleFavorite(car.id)}
                          className={`absolute top-3 right-3 w-8 h-8 rounded-xl glass-card flex items-center justify-center transition-colors ${
                            isFav ? 'text-rose-500 border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.4)]' : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                        </button>

                        {/* Location bottom overlay */}
                        <div className="absolute bottom-2.5 left-3 flex items-center gap-1 text-[11px] text-slate-300">
                          <MapPin className="w-3 h-3 text-cyan-400" />
                          <span>{car.location}</span>
                        </div>
                      </div>

                      {/* Info & Title */}
                      <div className="px-1">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {car.name}
                          </h3>
                          <div className="flex items-center gap-1 text-xs font-semibold text-cyan-300">
                            <Star className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                            <span>{car.rating}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-400 mb-3">
                          {car.subtitle}
                        </p>

                        {/* Spec Pills */}
                        <div className="grid grid-cols-3 gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900/60 border border-white/5 text-center mb-4">
                          <div>
                            <span className="text-[9px] text-slate-400 uppercase block font-semibold">Power</span>
                            <span className="text-xs font-bold text-slate-200">{car.power}</span>
                          </div>
                          <div className="border-x border-white/5">
                            <span className="text-[9px] text-slate-400 uppercase block font-semibold">0-100</span>
                            <span className="text-xs font-bold text-slate-200">{car.acceleration}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 uppercase block font-semibold">Range</span>
                            <span className="text-xs font-bold text-cyan-300">{car.range}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price & Action Buttons */}
                    <div className="pt-2 px-1 border-t border-white/5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block font-semibold">Price</span>
                        <span className="text-lg font-extrabold text-white tracking-tight">
                          {car.priceDisplay}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedCarModal(car)}
                          className="p-2.5 rounded-xl glass-card text-slate-300 hover:text-white hover:border-cyan-400/40 transition-colors"
                          title="Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setBookingModalCar(car)}
                          className="py-2.5 px-4 rounded-xl btn-neon text-xs font-bold text-white tracking-wide flex items-center gap-1.5 shadow-md"
                        >
                          <span>Reserve</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-12 text-center max-w-md mx-auto">
              <p className="text-base text-slate-300 mb-4">No cars found matching your search criteria.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedBrand('All'); }}
                className="py-2.5 px-5 rounded-xl btn-neon text-xs font-bold text-white"
              >
                Reset Filters
              </button>
            </div>
          )}

        </section>

        {/* ========================================================================= */}
        {/* INTERACTIVE COMPARISON TOOL */}
        {/* ========================================================================= */}
        <section id="compare" className="py-16 px-4 lg:px-12 max-w-7xl mx-auto border-t border-cyan-500/20">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-2">
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Smart Comparison Tool</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Compare Specs Side by Side
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Evaluate performance metrics, power, range, and pricing between any two models.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 lg:p-8 border border-cyan-500/30 shadow-xl">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              
              {/* Car 1 Selector & Card */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-cyan-400/20">
                <div className="mb-3">
                  <label className="text-[11px] text-slate-400 block font-semibold mb-1 uppercase">Select Car A:</label>
                  <select
                    value={compareCar1.id}
                    onChange={(e) => setCompareCar1(CARS_DATA.find(c => c.id === e.target.value))}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs text-white"
                  >
                    {CARS_DATA.map(c => <option key={c.id} value={c.id} className="bg-[#050914]">{c.name} - {c.priceDisplay}</option>)}
                  </select>
                </div>

                <div className="h-44 rounded-xl overflow-hidden mb-4 bg-black/40 relative">
                  <img src={compareCar1.image} alt={compareCar1.name} className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/70 text-xs font-bold text-white">
                    {compareCar1.priceDisplay}
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Power Output:</span>
                    <span className="font-bold text-white">{compareCar1.power}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">0-100 km/h:</span>
                    <span className="font-bold text-cyan-300">{compareCar1.acceleration}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Top Speed:</span>
                    <span className="font-bold text-white">{compareCar1.topSpeed}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Range / Distance:</span>
                    <span className="font-bold text-cyan-300">{compareCar1.range}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400">Fuel / Engine:</span>
                    <span className="font-bold text-white">{compareCar1.fuel}</span>
                  </div>
                </div>
              </div>

              {/* Car 2 Selector & Card */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-cyan-400/20">
                <div className="mb-3">
                  <label className="text-[11px] text-slate-400 block font-semibold mb-1 uppercase">Select Car B:</label>
                  <select
                    value={compareCar2.id}
                    onChange={(e) => setCompareCar2(CARS_DATA.find(c => c.id === e.target.value))}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs text-white"
                  >
                    {CARS_DATA.map(c => <option key={c.id} value={c.id} className="bg-[#050914]">{c.name} - {c.priceDisplay}</option>)}
                  </select>
                </div>

                <div className="h-44 rounded-xl overflow-hidden mb-4 bg-black/40 relative">
                  <img src={compareCar2.image} alt={compareCar2.name} className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/70 text-xs font-bold text-white">
                    {compareCar2.priceDisplay}
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Power Output:</span>
                    <span className="font-bold text-white">{compareCar2.power}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">0-100 km/h:</span>
                    <span className="font-bold text-cyan-300">{compareCar2.acceleration}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Top Speed:</span>
                    <span className="font-bold text-white">{compareCar2.topSpeed}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Range / Distance:</span>
                    <span className="font-bold text-cyan-300">{compareCar2.range}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400">Fuel / Engine:</span>
                    <span className="font-bold text-white">{compareCar2.fuel}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* FEATURED BRANDS SECTION */}
        {/* ========================================================================= */}
        <section id="brands" className="py-16 px-4 lg:px-12 max-w-7xl mx-auto border-t border-cyan-500/20">
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Featured Brands
              </h2>
              <p className="text-xs text-slate-400 mt-1">Official inventory from world leading automakers</p>
            </div>
            <a href="#catalogue" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              <span>View All Brands</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {BRANDS_DATA.map((b, idx) => (
              <div
                key={idx}
                onClick={() => { setSelectedBrand(b.name); }}
                className="glass-card-hover rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-900/80 border border-cyan-500/20 flex items-center justify-center mb-2 text-cyan-400 group-hover:text-white group-hover:border-cyan-400/50 transition-colors">
                  <span className="font-extrabold text-sm">{b.name[0]}</span>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {b.name}
                </h4>
                <span className="text-[10px] text-slate-400 mt-0.5">{b.count}</span>
              </div>
            ))}
          </div>

        </section>

        {/* ========================================================================= */}
        {/* FOOTER */}
        {/* ========================================================================= */}
        <footer className="border-t border-cyan-500/20 bg-[#040711]/90 backdrop-blur-2xl py-12 px-4 lg:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <svg className="w-8 h-4 text-cyan-400" viewBox="0 0 100 40" fill="none">
                  <path d="M5 28C12 28 18 25 24 20C30 15 42 10 58 10C74 10 82 17 95 24" stroke="currentColor" strokeWidth="3"/>
                  <circle cx="28" cy="27" r="4.5" stroke="currentColor" strokeWidth="2.5" fill="#040711" />
                  <circle cx="76" cy="27" r="4.5" stroke="currentColor" strokeWidth="2.5" fill="#040711" />
                </svg>
                <span className="text-lg font-extrabold text-white">Auto<span className="text-cyan-400">Hub</span></span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                The next-generation auto marketplace for luxury, electric, and performance vehicles.
              </p>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Marketplace</h5>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#catalogue" className="hover:text-cyan-300">All Cars</a></li>
                <li><a href="#spotlight" className="hover:text-cyan-300">Electric Spotlight</a></li>
                <li><a href="#compare" className="hover:text-cyan-300">Comparison Tool</a></li>
                <li><a href="#brands" className="hover:text-cyan-300">Top Brands</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Services</h5>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><span className="hover:text-cyan-300 cursor-pointer">Instant Financing</span></li>
                <li><span className="hover:text-cyan-300 cursor-pointer">Doorstep Delivery</span></li>
                <li><span className="hover:text-cyan-300 cursor-pointer">Certified Warranty</span></li>
                <li><span className="hover:text-cyan-300 cursor-pointer">Trade-In Value</span></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Newsletter</h5>
              <p className="text-xs text-slate-400 mb-2.5">Get early alerts on new arrivals and price drops.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Enter email" className="glass-input px-3 py-2 rounded-xl text-xs text-white flex-1" />
                <button className="py-2 px-3.5 rounded-xl btn-neon text-xs font-bold text-white">Join</button>
              </div>
            </div>

          </div>

          <div className="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <span>© 2026 AutoHub Inc. All rights reserved.</span>
            <span>Designed with Glassmorphism & Neon Aesthetics</span>
          </div>
        </footer>

      </div>

      {/* ========================================================================= */}
      {/* CAR DETAILS MODAL (Pop-up on Quick View) */}
      {/* ========================================================================= */}
      {selectedCarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl glass-card rounded-3xl p-6 border border-cyan-500/40 shadow-2xl overflow-y-auto max-h-[90vh]">
            
            <button
              onClick={() => setSelectedCarModal(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-xl glass-card flex items-center justify-center text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{selectedCarModal.brand}</span>
              <span className="text-xs text-slate-400">• {selectedCarModal.category}</span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-1">{selectedCarModal.name}</h3>
            <p className="text-sm text-slate-400 mb-4">{selectedCarModal.subtitle}</p>

            <div className="h-64 rounded-2xl overflow-hidden bg-slate-900 relative mb-4">
              <img src={selectedCarModal.image} alt={selectedCarModal.name} className="w-full h-full object-cover" />
              <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md text-sm font-extrabold text-cyan-300 border border-white/10">
                {selectedCarModal.priceDisplay}
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {selectedCarModal.description}
            </p>

            {/* Spec grid */}
            <div className="grid grid-cols-4 gap-2 mb-4 text-center">
              <div className="glass-card p-2 rounded-xl">
                <span className="text-[9px] text-slate-400 block font-semibold">POWER</span>
                <span className="text-xs font-bold text-white">{selectedCarModal.power}</span>
              </div>
              <div className="glass-card p-2 rounded-xl">
                <span className="text-[9px] text-slate-400 block font-semibold">0-100 KM/H</span>
                <span className="text-xs font-bold text-white">{selectedCarModal.acceleration}</span>
              </div>
              <div className="glass-card p-2 rounded-xl">
                <span className="text-[9px] text-slate-400 block font-semibold">TOP SPEED</span>
                <span className="text-xs font-bold text-white">{selectedCarModal.topSpeed}</span>
              </div>
              <div className="glass-card p-2 rounded-xl">
                <span className="text-[9px] text-slate-400 block font-semibold">RANGE</span>
                <span className="text-xs font-bold text-cyan-300">{selectedCarModal.range}</span>
              </div>
            </div>

            {/* Features list */}
            <div className="space-y-2 mb-6">
              <h5 className="text-xs font-bold text-white uppercase tracking-wider text-cyan-300">Included Features:</h5>
              {selectedCarModal.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  const car = selectedCarModal;
                  setSelectedCarModal(null);
                  setBookingModalCar(car);
                }}
                className="flex-1 py-3 rounded-xl btn-neon text-xs font-bold text-white flex items-center justify-center gap-2"
              >
                <span>Book Test Drive / Check Availability</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BOOKING / TEST DRIVE MODAL */}
      {/* ========================================================================= */}
      {bookingModalCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md glass-card rounded-3xl p-6 border border-cyan-500/40 shadow-2xl">
            
            <button
              onClick={() => { setBookingModalCar(null); setBookingSuccess(false); }}
              className="absolute top-4 right-4 w-8 h-8 rounded-xl glass-card flex items-center justify-center text-slate-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {bookingSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center mx-auto text-cyan-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white">Booking Request Received!</h4>
                <p className="text-xs text-slate-300">
                  Our specialist will contact you shortly regarding the <span className="text-cyan-400 font-semibold">{bookingModalCar.name}</span>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">Reserve Vehicle</span>
                  <h4 className="text-lg font-bold text-white">{bookingModalCar.name}</h4>
                  <p className="text-xs text-slate-400">{bookingModalCar.priceDisplay} • {bookingModalCar.location}</p>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <label className="text-[11px] text-slate-300 block font-medium mb-1">Your Full Name</label>
                    <input required type="text" placeholder="John Doe" className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs text-white" />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-300 block font-medium mb-1">Phone Number</label>
                    <input required type="tel" placeholder="+1 (555) 000-0000" className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs text-white" />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-300 block font-medium mb-1">Preferred Date</label>
                    <input required type="date" defaultValue="2026-09-12" className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs text-white" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl btn-neon text-xs font-bold text-white tracking-wider flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>Confirm Test Drive</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Floating Support Chatbot Widget */}
      <ChatWidget />

      {/* Admin Panel Modal (/admin) */}
      {showAdminModal && (
        <AdminPanel onClose={() => setShowAdminModal(false)} />
      )}

    </div>
  );
}
