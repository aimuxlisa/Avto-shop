'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { CARS_DATA } from '../data/cars';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import SpotlightShowroom from '../components/SpotlightShowroom';
import InventorySection from '../components/InventorySection';
import CompareSection from '../components/CompareSection';
import FinanceCalculator from '../components/FinanceCalculator';
import TrustSection from '../components/TrustSection';
import ReviewsSection from '../components/ReviewsSection';
import FeedbackSection from '../components/FeedbackSection';
import Footer from '../components/Footer';
import CarModal from '../components/CarModal';
import BookingModal from '../components/BookingModal';
import AdminPanel from '../components/admin/AdminPanel';
import ChatWidget from '../components/chat/ChatWidget';

export default function AutoHubPage() {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [favorites, setFavorites] = useState(['tesla-3']);

  // Modals state
  const [selectedCarModal, setSelectedCarModal] = useState(null);
  const [bookingModalCar, setBookingModalCar] = useState(null);
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Load favorites from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('autohub_favs');
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('autohub_favs', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Filtered and Sorted Cars
  const filteredCars = useMemo(() => {
    return CARS_DATA.filter((car) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        car.category === selectedCategory ||
        (selectedCategory === 'Electric' && car.type === 'Electric');

      const matchesBrand = selectedBrand === 'All' || car.brand === selectedBrand;

      const matchesSearch =
        car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.brand.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesBrand && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.reviews - a.reviews;
    });
  }, [searchQuery, selectedCategory, selectedBrand, sortBy]);

  const spotlightCar = CARS_DATA.find((c) => c.id === 'tesla-3') || CARS_DATA[0];

  const handleExploreInventory = () => {
    const el = document.getElementById('catalogue');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-[#050914] text-slate-100 relative selection:bg-cyan-500 selection:text-white font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Background Neon Atmospheric Lighting Beams */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top ambient center beam */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[750px] h-[550px] bg-gradient-to-b from-cyan-500/20 via-blue-600/10 to-transparent rounded-full blur-[140px]" />
        
        {/* Left deep cyan orb */}
        <div className="absolute top-[28%] -left-32 w-[550px] h-[550px] bg-cyan-600/12 rounded-full blur-[160px]" />
        
        {/* Right vibrant blue orb */}
        <div className="absolute top-[48%] -right-32 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[170px]" />
        
        {/* Bottom ambient lighting */}
        <div className="absolute bottom-0 left-1/3 w-[800px] h-[500px] bg-cyan-500/10 rounded-full blur-[180px]" />

        {/* Cyber radial grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:48px_48px] opacity-[0.03]" />
      </div>

      {/* Main Content Wrapper */}
      <div className="relative z-10">
        {/* Navbar */}
        <Navbar
          favoritesCount={favorites.length}
          onOpenAdmin={() => setShowAdminModal(true)}
          onBookTestDrive={() => setBookingModalCar(spotlightCar)}
        />

        {/* Hero Section with Live Search */}
        <HeroSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onExploreInventory={handleExploreInventory}
          totalCarsCount={CARS_DATA.length}
        />

        {/* 3D Spotlight Showroom */}
        <SpotlightShowroom
          car={spotlightCar}
          onBookTestDrive={(c) => setBookingModalCar(c)}
          onOpenDetails={(c) => setSelectedCarModal(c)}
        />

        {/* Inventory Catalogue */}
        <InventorySection
          cars={filteredCars}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          sortBy={sortBy}
          setSortBy={setSortBy}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onOpenDetails={(c) => setSelectedCarModal(c)}
          onBookTestDrive={(c) => setBookingModalCar(c)}
        />

        {/* Head-to-Head Comparison Matrix */}
        <CompareSection
          onBookTestDrive={(c) => setBookingModalCar(c)}
        />

        {/* Interactive Loan & Finance Calculator */}
        <FinanceCalculator
          onApplyFinancing={() => setBookingModalCar(spotlightCar)}
        />

        {/* Why Choose AutoHub Pillars */}
        <TrustSection />

        {/* Customer Reviews & Feedback */}
        <ReviewsSection />

        {/* Contact & Feedback Section (Synced to CRM) */}
        <FeedbackSection />

        {/* Footer */}
        <Footer />
      </div>

      {/* Modals & Overlays */}
      {selectedCarModal && (
        <CarModal
          car={selectedCarModal}
          onClose={() => setSelectedCarModal(null)}
          onBookTestDrive={(c) => {
            setSelectedCarModal(null);
            setBookingModalCar(c);
          }}
        />
      )}

      {bookingModalCar && (
        <BookingModal
          car={bookingModalCar}
          onClose={() => setBookingModalCar(null)}
        />
      )}

      {showAdminModal && (
        <AdminPanel
          onClose={() => setShowAdminModal(false)}
        />
      )}

      {/* AI Concierge Chat Widget (Gemini 3.5 Flash + Turso FAQ) */}
      <ChatWidget />
    </main>
  );
}
