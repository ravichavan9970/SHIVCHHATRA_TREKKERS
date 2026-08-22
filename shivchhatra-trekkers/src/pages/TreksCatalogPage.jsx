import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mountain, 
  Search, 
  SlidersHorizontal, 
  Flame, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useTreks } from '../context/TrekContext';
import TrekCard from '../components/trek/TrekCard';
import TrekDetailModal from '../components/trek/TrekDetailModal';

export default function TreksCatalogPage() {
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

  const [selectedTrekForModal, setSelectedTrekForModal] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setSearchQuery('');
    setMaxPrice(5000);
  };

  const difficulties = ['All', 'Easy', 'Moderate', 'Hard'];

  return (
    <div className="min-h-screen bg-[#080c14] pt-24 pb-20">
      
      {/* Top Banner */}
      <div className="relative py-12 bg-slate-950 border-b border-slate-800/80 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5" />
            <span>SAHYADRI EXPEDITIONS & BATCHES</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading">
            All Upcoming Treks & Fort Trails
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Choose from high-altitude summits, historic Maratha fort ridges, dark rock canyons, and secret monsoon waterfalls.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        
        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by fort, region, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Quick Category Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto scrollbar-none pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                    : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-xl border text-xs font-semibold transition-all shrink-0 ${
                showFilters ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Toggle Advanced Filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expandable Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs"
            >
              <div>
                <label className="text-slate-400 font-semibold block mb-2">Difficulty</label>
                <div className="flex gap-2">
                  {difficulties.map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`px-3 py-1 rounded-lg border font-medium ${
                        selectedDifficulty === diff
                          ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-400 font-semibold">Max Price</label>
                  <span className="font-bold text-orange-400">₹{maxPrice}</span>
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

              <div className="flex items-end">
                <button
                  onClick={resetAllFilters}
                  className="w-full py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 font-semibold flex items-center justify-center space-x-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-orange-400" />
                  <span>Reset Filters</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Treks Grid */}
        {treks.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-3 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mx-auto text-2xl">
              🚩
            </div>
            <p className="text-lg font-bold text-white">No Expeditions Currently Scheduled</p>
            <p className="text-xs text-slate-400">All batches have concluded or new Sahyadri routes are being scheduled. Check back soon!</p>
          </div>
        ) : filteredTreks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredTreks.map((trek) => (
              <TrekCard
                key={trek.id}
                trek={trek}
                onSelectTrek={(t) => setSelectedTrekForModal(t)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
            <p className="text-lg font-bold text-white">No Expeditions Found</p>
            <p className="text-xs text-slate-400">Try changing your filters or searching another keyword.</p>
            <button
              onClick={resetAllFilters}
              className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-600/30"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* Trek Detail Modal */}
      <TrekDetailModal
        trek={selectedTrekForModal}
        isOpen={!!selectedTrekForModal}
        onClose={() => setSelectedTrekForModal(null)}
      />
    </div>
  );
}
