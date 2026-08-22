import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Filter, 
  Mountain, 
  Flame, 
  Compass, 
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import { useTreks } from '../../context/TrekContext';
import TrekCard from '../trek/TrekCard';

export default function UpcomingTreksSection({ onSelectTrek }) {
  const { 
    treks,
    filteredTreks, 
    categories, 
    selectedCategory, 
    setSelectedCategory,
    selectedDifficulty,
    setSelectedDifficulty,
    searchQuery,
    setSearchQuery,
    maxPrice,
    setMaxPrice
  } = useTreks();

  const [showFilters, setShowFilters] = useState(false);

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setSearchQuery('');
    setMaxPrice(5000);
  };

  const difficulties = ['All', 'Easy', 'Moderate', 'Hard'];

  return (
    <section id="upcoming-treks" className="py-20 bg-[#090d16] relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 fill-orange-400" />
              <span>UPCOMING EXPEDITIONS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
              Upcoming Batches & Weekend Trails
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Hand-crafted Sahyadri expeditions with certified leaders, safety equipment, transport, and authentic village meals.
            </p>
          </div>

          {/* Quick Filter Toggle */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                showFilters 
                  ? 'bg-orange-500/15 border-orange-500/40 text-orange-300' 
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 text-orange-400" />
              <span>Filter Trails</span>
            </button>
          </div>
        </div>

        {/* Filters Drawer */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 mb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 backdrop-blur-xl shadow-2xl"
            >
              {/* Search Bar */}
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-2">Search Fort / Trek</label>
                <input
                  type="text"
                  placeholder="e.g. Rajgad, Kalsubai..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Category Pills */}
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-2">Expedition Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty Pills */}
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-2">Endurance Level</label>
                <div className="flex flex-wrap gap-1.5">
                  {difficulties.map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        selectedDifficulty === diff
                          ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-400">Max Budget</label>
                  <span className="text-xs font-bold text-orange-400">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="800"
                  max="4000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              {/* Reset action */}
              <div className="flex items-end">
                <button
                  onClick={resetAllFilters}
                  className="flex items-center justify-center space-x-1.5 w-full py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-orange-400" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Treks Grid */}
        {treks.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/40 border border-slate-800/80 space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mx-auto text-2xl">
              🚩
            </div>
            <h3 className="text-lg font-bold text-white font-heading">No Expeditions Currently Scheduled</h3>
            <p className="text-xs text-slate-400">
              All upcoming batches have concluded or new Sahyadri routes are being scheduled. Check back soon!
            </p>
          </div>
        ) : filteredTreks.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            <AnimatePresence>
              {filteredTreks.map((trek) => (
                <TrekCard
                  key={trek.id}
                  trek={trek}
                  onSelectTrek={onSelectTrek}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/40 border border-slate-800/80 space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mx-auto text-2xl">
              🏔️
            </div>
            <h3 className="text-lg font-bold text-white font-heading">No Expeditions Match Your Filter</h3>
            <p className="text-xs text-slate-400">
              Try adjusting your search query, difficulty, or price range to find available upcoming Sahyadri treks.
            </p>
            <button
              onClick={resetAllFilters}
              className="px-5 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold shadow-md shadow-orange-500/30"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
