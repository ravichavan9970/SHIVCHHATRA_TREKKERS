import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mountain, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  ShieldCheck, 
  ArrowRight, 
  Flame,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useBookings } from '../../context/BookingContext';

export default function TrekCard({ trek, onSelectTrek }) {
  const { openBookingModal, getBatchBookedSeats } = useBookings();

  const getDifficultyColor = (level) => {
    const l = (level || trek.difficultyLevel || '').toLowerCase();
    if (l === 'easy') return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    if (l === 'moderate') return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    return 'bg-red-500/15 text-red-400 border-red-500/30';
  };

  const primaryBatch = trek.batches && trek.batches.length > 0 ? trek.batches[0] : null;
  const bookedSeats = primaryBatch ? (getBatchBookedSeats ? getBatchBookedSeats(trek, primaryBatch) : (primaryBatch.bookedSeats || 0)) : 0;
  const totalSeats = primaryBatch?.totalSeats || 25;
  const seatsRemaining = Math.max(0, totalSeats - bookedSeats);
  const percentFilled = Math.min(100, Math.round((bookedSeats / totalSeats) * 100));

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative rounded-2xl overflow-hidden bg-slate-900/90 border border-slate-800 hover:border-orange-500/40 shadow-xl hover:shadow-2xl hover:shadow-orange-950/40 flex flex-col transition-all duration-300"
    >
      {/* Top Banner Image with Overlay */}
      <div className="relative h-56 sm:h-60 overflow-hidden">
        <img
          src={trek.heroImage}
          alt={trek.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border backdrop-blur-md ${getDifficultyColor(trek.difficultyLevel)}`}>
            {trek.difficulty}
          </span>

          {trek.badge && (
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-500 text-white shadow-md shadow-orange-500/30 flex items-center space-x-1">
              <Flame className="w-3.5 h-3.5 fill-white" />
              <span>{trek.badge}</span>
            </span>
          )}
        </div>

        {/* Bottom Image Overlay: Marathi Title & Rating */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            {trek.marathiTitle && (
              <p className="text-xs font-semibold text-orange-400 tracking-wide font-heading">
                {trek.marathiTitle}
              </p>
            )}
            <p className="text-xs text-slate-300 flex items-center space-x-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-orange-400" />
              <span>{trek.region}</span>
            </p>
          </div>

          <div className="px-2 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-slate-800 flex items-center space-x-1 text-xs font-bold text-yellow-400">
            <Star className="w-3.5 h-3.5 fill-yellow-400" />
            <span>{trek.rating}</span>
            <span className="text-slate-400 font-normal">({trek.reviewsCount})</span>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors font-heading leading-snug">
            {trek.title}
          </h3>

          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {trek.tagline}
          </p>

          {/* Key Metrics Chips */}
          <div className="grid grid-cols-2 gap-2 pt-3">
            <div className="px-2.5 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-center space-x-1.5">
              <Mountain className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span className="truncate">{trek.elevation}</span>
            </div>
            <div className="px-2.5 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{trek.duration}</span>
            </div>
          </div>

          {/* Seat Filling Progress Bar */}
          {primaryBatch && (
            <div className="pt-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-orange-400" />
                  <span className="truncate max-w-[150px]">{primaryBatch.date}</span>
                </span>
                <span className={`font-semibold ${seatsRemaining <= 5 ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`}>
                  {seatsRemaining <= 0 ? 'Batch Full' : `${seatsRemaining} seats left`}
                </span>
              </div>

              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    percentFilled > 80 ? 'bg-gradient-to-r from-amber-500 to-red-500' : 'bg-gradient-to-r from-emerald-500 to-orange-500'
                  }`}
                  style={{ width: `${percentFilled}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Footer: Pricing & Action Buttons */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-xl font-extrabold text-white font-heading">
                ₹{trek.price}
              </span>
              {trek.originalPrice && (
                <span className="text-xs text-slate-500 line-through">
                  ₹{trek.originalPrice}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-400 font-medium block">
              Meals & Transport Included
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onSelectTrek(trek)}
              className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
            >
              Details
            </button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => openBookingModal(trek, primaryBatch)}
              disabled={seatsRemaining <= 0}
              className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all flex items-center space-x-1 ${
                seatsRemaining <= 0
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-orange-600/30'
              }`}
            >
              <span>{seatsRemaining <= 0 ? 'Waitlist' : 'Book'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
