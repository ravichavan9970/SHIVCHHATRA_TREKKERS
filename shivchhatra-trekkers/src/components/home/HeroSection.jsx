import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Compass, 
  Mountain, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  ArrowRight,
  Flame,
  Search,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useTreks } from '../../context/TrekContext';
import { useBookings } from '../../context/BookingContext';
import { useReviews } from '../../context/ReviewContext';
import { getLiveBookingStats } from '../../services/apiService';

export default function HeroSection({ onExploreClick }) {
  const { treks, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, categories } = useTreks();
  const { bookings } = useBookings();
  const { stats, openReviewModal } = useReviews();
  const [liveCompletedTrekkers, setLiveCompletedTrekkers] = useState(null);

  const recoverLocalTrekkersCount = () => {
    const keys = [
      'shivchhatra_bookings_permanent_archive',
      'shivchhatra_admin_bookings_cache',
      'shivchhatra_bookings_v4',
      'shivchhatra_bookings_backup'
    ];
    let maxFound = 0;
    for (const k of keys) {
      try {
        const raw = localStorage.getItem(k);
        if (raw) {
          const list = JSON.parse(raw);
          if (Array.isArray(list)) {
            const count = list
              .filter(b => b && (b.status === 'Completed' || b.status === 'Confirmed'))
              .reduce((sum, b) => sum + (Number(b.participantsCount) || 1), 0);
            if (count > maxFound) maxFound = count;
          }
        }
      } catch (e) {}
    }
    return maxFound;
  };

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const data = await getLiveBookingStats();
        if (isMounted && data) {
          const count = (typeof data.completedTrekkers === 'number' && data.completedTrekkers > 0)
            ? data.completedTrekkers
            : ((typeof data.verifiedTrekkers === 'number') ? data.verifiedTrekkers : 0);
          setLiveCompletedTrekkers(count);
        }
      } catch (e) {}
    };
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Count completed/verified trekkers from live server database + local completed bookings + permanent vault
  const localCompletedCount = bookings
    .filter(b => b && (b.status === 'Completed' || b.status === 'Confirmed'))
    .reduce((sum, b) => sum + (Number(b.participantsCount) || 1), 0);

  const vaultCount = recoverLocalTrekkersCount();
  const serverCount = (liveCompletedTrekkers !== null && liveCompletedTrekkers !== undefined) ? liveCompletedTrekkers : 0;
  const totalTrekkersCount = Math.max(serverCount, localCompletedCount, vaultCount);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onExploreClick) onExploreClick();
  };

  return (
    <section className="relative min-h-[92vh] sm:min-h-[95vh] flex items-center justify-center pt-24 sm:pt-28 pb-14 sm:pb-20 overflow-hidden bg-[#080c14]">
      {/* Wallpaper Background Image with Cinematic Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(8, 12, 20, 0.68) 0%, rgba(8, 12, 20, 0.84) 65%, #080c14 100%), url('/hero_bg.jpg'), url('https://wallpaperaccess.com/full/11738414.jpg')`
        }}
      ></div>

      {/* Subtle Topography Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>
      
      {/* Saffron & Emerald Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[700px] h-[300px] sm:h-[500px] bg-orange-600/20 rounded-full blur-[100px] sm:blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-emerald-600/15 rounded-full blur-[90px] sm:blur-[110px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="text-center max-w-4xl mx-auto space-y-4 sm:space-y-6">
          
          {/* Top Badge with Framer Motion */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center space-x-1.5 sm:space-x-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-300 text-[11px] sm:text-sm font-semibold tracking-wide shadow-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-ping"></span>
            <span>🚩 सह्याद्रीचे शिलेदार • Maharashtra's Premier Adventure Club</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-heading leading-[1.2] sm:leading-[1.15]"
          >
            Sacred Footsteps of Chhatrapati Shivaji Maharaj, <br />
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent drop-shadow-sm">
              Sahyadri’s Majestic Heights.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-300 text-xs sm:text-lg max-w-2xl mx-auto leading-relaxed px-2"
          >
            Experience authentic high-altitude fort expeditions, thrilling ridge traverses, and ancient rock staircases guided by certified mountaineers with 100% verified safety.
          </motion.p>

          {/* Quick Search & Filter Widget */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="pt-1 sm:pt-2 max-w-3xl mx-auto"
          >
            <form 
              onSubmit={handleSearchSubmit}
              className="p-2 sm:p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by fort, peak, or region..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex-1 sm:w-auto px-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-300 focus:outline-none focus:border-orange-500 min-w-0"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-slate-900 text-white">
                      {cat === 'All' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-orange-600/30 flex items-center justify-center space-x-1.5 shrink-0 transition-all hover:scale-102 cursor-pointer"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>

          {/* Real Dynamic Live Stats */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="pt-4 sm:pt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 max-w-4xl mx-auto"
          >
            <div className="p-3 sm:p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm">
              <p className="text-xl sm:text-3xl font-extrabold text-orange-400 font-heading">
                {treks.length}
              </p>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5">Active Expeditions</p>
            </div>

            <div className="p-3 sm:p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm">
              <p className="text-xl sm:text-3xl font-extrabold text-amber-400 font-heading">
                {totalTrekkersCount > 0 ? totalTrekkersCount : 0}
              </p>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5">Verified Trekkers</p>
            </div>

            <div className="p-3 sm:p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm">
              <p className="text-xl sm:text-3xl font-extrabold text-emerald-400 font-heading">100%</p>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5">Verified UPI Gateway</p>
            </div>

            <button
              type="button"
              onClick={() => openReviewModal && openReviewModal()}
              className="p-3 sm:p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-yellow-500/50 backdrop-blur-sm transition-all group text-center cursor-pointer"
              title="Click to Rate or Review"
            >
              <div className="flex items-center justify-center space-x-1">
                <span className="text-xl sm:text-3xl font-extrabold text-yellow-400 font-heading">
                  {stats?.averageRating || '4.9'}
                </span>
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400 inline" />
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 group-hover:text-yellow-400 transition-colors font-medium flex items-center justify-center space-x-1 mt-0.5">
                <span>{stats?.totalReviews || '120+'} Trekker Reviews</span>
              </p>
            </button>
          </motion.div>

        </div>
      </div>

      {/* Down Arrow indicator */}
      <div className="hidden sm:block absolute bottom-3 left-1/2 -translate-x-1/2 text-slate-500 animate-bounce">
        <ChevronDown className="w-6 h-6" />
      </div>
    </section>
  );
}
