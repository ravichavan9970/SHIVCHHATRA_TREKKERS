import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  MapPin, 
  Mountain, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Star, 
  Users, 
  Flame, 
  Sparkles,
  ArrowRight,
  Bus,
  Utensils,
  Tent,
  AlertCircle
} from 'lucide-react';
import { useBookings } from '../../context/BookingContext';
import { useReviews } from '../../context/ReviewContext';

export default function TrekDetailModal({ trek, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('itinerary');
  const [selectedBatch, setSelectedBatch] = useState(trek?.batches?.[0] || null);
  const { openBookingModal, getBatchBookedSeats } = useBookings();
  const { openReviewModal } = useReviews();

  if (!isOpen || !trek) return null;

  const handleBookNow = () => {
    onClose();
    openBookingModal(trek, selectedBatch || trek.batches?.[0]);
  };

  const tabs = [
    { id: 'itinerary', label: 'Day-by-Day Itinerary' },
    { id: 'highlights', label: 'Highlights & Overview' },
    { id: 'inclusions', label: 'Inclusions & Exclusions' },
    { id: 'pickups', label: 'Pickups & Batches' }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 md:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative w-full max-w-4xl bg-[#0b101d] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col my-auto"
        >
          {/* Header Image Banner */}
          <div className="relative h-64 sm:h-72 shrink-0 overflow-hidden">
            <img
              src={trek.heroImage}
              alt={trek.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b101d] via-[#0b101d]/60 to-transparent"></div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/70 hover:bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-all z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Banner Content */}
            <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/40">
                  {trek.category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/80 text-slate-300 border border-slate-700">
                  {trek.difficulty}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openReviewModal(trek);
                  }}
                  className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-yellow-500/50 text-xs font-bold text-yellow-400 transition-all cursor-pointer group"
                  title="Click to submit your rating"
                >
                  <Star className="w-3.5 h-3.5 fill-yellow-400" />
                  <span>{trek.rating}</span>
                  <span className="text-slate-400 font-normal">({trek.reviewsCount} reviews)</span>
                  <span className="text-orange-400 font-semibold group-hover:underline pl-1">• Rate Trek</span>
                </button>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                {trek.title}
              </h2>
              {trek.marathiTitle && (
                <p className="text-sm font-semibold text-orange-400 font-heading">
                  {trek.marathiTitle}
                </p>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 sm:p-4 bg-slate-900/60 border-y border-slate-800 text-xs shrink-0">
            <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <Mountain className="w-4 h-4 text-orange-400 shrink-0" />
              <div>
                <p className="text-slate-500 text-[10px]">Altitude</p>
                <p className="text-slate-200 font-semibold truncate">{trek.elevation}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="text-slate-500 text-[10px]">Duration</p>
                <p className="text-slate-200 font-semibold truncate">{trek.duration}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <p className="text-slate-500 text-[10px]">Region</p>
                <p className="text-slate-200 font-semibold truncate">{trek.region}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <p className="text-slate-500 text-[10px]">Safety Lead</p>
                <p className="text-slate-200 font-semibold truncate">Certified NIM/HMI</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-2 px-4 sm:px-6 pt-3 border-b border-slate-800 shrink-0 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold transition-all relative whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-orange-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="modalActiveTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Body Contents (Scrollable) */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
            
            {/* TAB 1: ITINERARY */}
            {activeTab === 'itinerary' && (
              <div className="space-y-6">
                {trek.itinerary && trek.itinerary.length > 0 ? (
                  trek.itinerary.map((dayItem, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                      <div className="flex items-center space-x-2">
                        <span className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 font-bold text-xs flex items-center justify-center border border-orange-500/40">
                          {idx + 1}
                        </span>
                        <h4 className="text-base font-bold text-white font-heading">
                          {dayItem.day}
                        </h4>
                      </div>

                      <div className="relative pl-6 space-y-4 border-l border-slate-800 ml-3.5">
                        {dayItem.schedule.map((item, sIdx) => (
                          <div key={sIdx} className="relative group">
                            <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-slate-700 group-hover:bg-orange-500 transition-colors border-2 border-slate-950"></div>
                            <span className="text-xs font-semibold text-orange-400 block mb-0.5">
                              {item.time}
                            </span>
                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                              {item.event}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">Detailed itinerary will be shared upon booking.</p>
                )}
              </div>
            )}

            {/* TAB 2: HIGHLIGHTS */}
            {activeTab === 'highlights' && (
              <div className="space-y-5">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 font-heading">
                    Expedition Highlights
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {trek.highlights && trek.highlights.map((hl, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start space-x-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-slate-300 leading-relaxed">{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/20 space-y-2">
                  <h5 className="text-sm font-bold text-orange-300 font-heading flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-orange-400" />
                    <span>The Shivchhatra Promise</span>
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    We follow strict leave-no-trace ethics and maintain authentic Sahyadri historical narratives led by certified fort scholars.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: INCLUSIONS & EXCLUSIONS */}
            {activeTab === 'inclusions' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-emerald-500/20 space-y-3">
                  <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-2 font-heading">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>What's Included</span>
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                    {trek.inclusions?.map((inc, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-emerald-400">✓</span>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-red-500/20 space-y-3">
                  <h4 className="text-sm font-bold text-red-400 uppercase tracking-wider flex items-center space-x-2 font-heading">
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span>What's Excluded</span>
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                    {trek.exclusions?.map((exc, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-red-400">✕</span>
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 4: PICKUPS & BATCHES */}
            {activeTab === 'pickups' && (
              <div className="space-y-6">
                {/* Available Batches */}
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 font-heading">
                    Select Upcoming Batch
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {trek.batches?.map((b) => {
                      const booked = getBatchBookedSeats ? getBatchBookedSeats(trek, b) : (b.bookedSeats || 0);
                      const available = Math.max(0, b.totalSeats - booked);
                      return (
                        <div
                          key={b.id}
                          onClick={() => setSelectedBatch(b)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                            selectedBatch?.id === b.id
                              ? 'bg-orange-500/10 border-orange-500 text-white'
                              : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span>{b.date}</span>
                            <span className="px-2 py-0.5 rounded bg-slate-950 text-orange-400 border border-slate-800">
                              {available <= 0 ? 'Batch Full' : `${available} Available`}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">
                            {available} slots available of {b.totalSeats} ({booked} booked)
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Pickup Hubs */}
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 font-heading flex items-center space-x-2">
                    <Bus className="w-4 h-4 text-orange-400" />
                    <span>Boarding & Pickup Hubs</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {trek.pickUpLocations?.map((loc, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                        <p className="text-xs font-bold text-orange-400 mb-2 uppercase">{loc.city} Route</p>
                        <ul className="space-y-1 text-xs text-slate-300">
                          {loc.spots.map((spot, sIdx) => (
                            <li key={sIdx} className="flex items-center space-x-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                              <span>{spot}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Sticky Modal Footer */}
          <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
            <div>
              <p className="text-[11px] text-slate-400">Total Price Per Person</p>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-extrabold text-white font-heading">₹{trek.price}</span>
                {trek.originalPrice && (
                  <span className="text-sm text-slate-500 line-through">₹{trek.originalPrice}</span>
                )}
                <span className="text-xs text-emerald-400 font-medium">All Taxes & Permits Included</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-900 text-slate-300 text-xs font-semibold transition-all w-1/2 sm:w-auto"
              >
                Close
              </button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBookNow}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-orange-600/30 flex items-center justify-center space-x-2 w-1/2 sm:w-auto"
              >
                <span>Book This Expedition</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
