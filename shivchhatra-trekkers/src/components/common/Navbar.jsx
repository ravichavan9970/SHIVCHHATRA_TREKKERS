import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, 
  Mountain, 
  ShieldCheck, 
  Search, 
  Menu, 
  X, 
  Lock, 
  TicketCheck, 
  PhoneCall,
  Sparkles,
  Calendar
} from 'lucide-react';
import { useBookings } from '../../context/BookingContext';
import { useTreks } from '../../context/TrekContext';

export default function Navbar({ onOpenAdmin }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { openBookingModal } = useBookings();
  const { treks } = useTreks();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Upcoming Treks", path: "/treks" },
    { name: "Fort Heritage", path: "/forts" },
    { name: "Safety & Gear", path: "/safety" },
    { name: "Track Booking", path: "/track" }
  ];

  const handleQuickBook = () => {
    if (treks && treks.length > 0) {
      openBookingModal(treks[0]);
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/40 py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-400 shadow-md shadow-orange-600/30 group-hover:shadow-orange-500/50 transition-all duration-300 group-hover:scale-105 flex items-center justify-center">
                <img
                  src="/logo.jpg"
                  alt="Shivchhatra Trekkers Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950"></span>
              </span>
            </div>
            
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent font-heading">
                  SHIVCHHATRA
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 font-medium">
                  TREKKERS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">
                शिवछत्र ट्रेकर्स • सह्याद्री मोहीम
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/80 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'text-orange-400 font-semibold shadow-sm' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="navPill"
                      className="absolute inset-0 bg-orange-500/10 rounded-full border border-orange-500/30"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Quick Book Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleQuickBook}
              className="relative group overflow-hidden rounded-xl p-px font-semibold text-sm shadow-lg shadow-orange-600/20 cursor-pointer"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 group-hover:opacity-100 transition-opacity"></span>
              <span className="relative flex items-center space-x-2 px-4 py-2 rounded-[11px] bg-gradient-to-r from-orange-600 to-amber-600 text-white font-medium">
                <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
                <span>Book a Trek</span>
              </span>
            </motion.button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-[#0a0f1d] border-b border-slate-800 shadow-2xl px-4 pt-3 pb-6 space-y-2 mt-3"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-base font-medium ${
                  location.pathname === link.path
                    ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-3 border-t border-slate-800/80 flex flex-col space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleQuickBook();
                }}
                className="flex items-center justify-center space-x-2 w-full py-3 bg-gradient-to-r from-orange-600 to-amber-600 rounded-xl text-white font-semibold text-sm shadow-lg shadow-orange-600/30 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Book Upcoming Trek</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
