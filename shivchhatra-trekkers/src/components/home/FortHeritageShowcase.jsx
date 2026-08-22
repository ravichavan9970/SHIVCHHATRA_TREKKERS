import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Mountain, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Compass, 
  ArrowRight,
  BookOpen,
  Landmark
} from 'lucide-react';
import { fortsGuide as defaultForts } from '../../data/fortsGuide';
import { getLiveForts } from '../../services/apiService';
import { Link } from 'react-router-dom';

export default function FortHeritageShowcase() {
  const [forts, setForts] = useState(() => Array.isArray(defaultForts) && defaultForts.length > 0 ? defaultForts : []);
  const [selectedFort, setSelectedFort] = useState(() => (Array.isArray(defaultForts) && defaultForts[0]) ? defaultForts[0] : null);

  // Sync with live Java backend database
  useEffect(() => {
    async function loadForts() {
      try {
        const liveData = await getLiveForts();
        if (Array.isArray(liveData) && liveData.length > 0) {
          setForts(liveData);
          setSelectedFort(prev => {
            if (!prev) return liveData[0];
            const match = liveData.find(f => f.id === prev.id);
            return match || liveData[0];
          });
        }
      } catch (err) {
        console.warn('Error loading live forts, using fallback:', err);
      }
    }
    loadForts();

    const interval = setInterval(loadForts, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeFort = selectedFort || (forts && forts[0]) || (defaultForts && defaultForts[0]) || null;
  const displayedForts = (forts && forts.length > 0) ? forts.slice(0, 8) : (defaultForts ? defaultForts.slice(0, 8) : []);

  return (
    <section id="fort-heritage" className="py-20 bg-[#080c14] relative overflow-hidden border-t border-slate-800/80">
      {/* Mesh Background */}
      <div className="absolute inset-0 bg-radial-gradient opacity-30 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Landmark className="w-3.5 h-3.5" />
            <span>🚩 सह्याद्रीचे दुर्गवैभव • SHIVKALIN SACRED FORTS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
            Shivkalin Forts of Chhatrapati Shivaji Maharaj
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Every stone in the Sahyadris echoes with the courage of Hindavi Swarajya. Explore the impregnable citadels, secret rock needles, and royal capitals we trek across.
          </p>
        </div>

        {/* Interactive Fort Selector & Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Fort Tabs List (Flush with Right Card, Zero Scrollbar) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-2">
            {displayedForts.map((fort) => {
              const isSelected = activeFort?.id === fort.id;
              return (
                <div
                  key={fort.id}
                  onClick={() => setSelectedFort(fort)}
                  className={`p-3 sm:p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 relative flex-1 flex flex-col justify-center ${
                    isSelected
                      ? 'bg-slate-900/95 border-orange-500 shadow-lg shadow-orange-950/40'
                      : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate">
                      <h4 className={`text-sm sm:text-base font-bold font-heading truncate ${isSelected ? 'text-orange-400' : 'text-white'}`}>
                        {fort.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{fort.title}</p>
                    </div>
                    <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono shrink-0">
                      {fort.altitude ? String(fort.altitude).split('/')[0] : 'Sahyadri'}
                    </span>
                  </div>

                  {isSelected && (
                    <motion.div
                      layoutId="fortSelectionBar"
                      className="absolute left-0 top-2.5 bottom-2.5 w-1 bg-gradient-to-b from-orange-500 to-amber-500 rounded-r-full"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Active Fort Showcase Card */}
          {activeFort && (
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFort.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6"
                >
                  {/* Image Banner */}
                  <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-slate-950">
                    <img
                      src={activeFort.image}
                      alt={activeFort.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                    
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                      <div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-orange-500 text-white shadow-md">
                          {activeFort.difficulty || 'Moderate'}
                        </span>
                        <h3 className="text-2xl font-black text-white font-heading mt-2 drop-shadow-md">
                          {activeFort.name}
                        </h3>
                      </div>

                      {activeFort.bestSeason && (
                        <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs text-amber-400 font-semibold flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{String(activeFort.bestSeason).split('(')[0]}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* History & Significance */}
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                      <p className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">
                        Historical Significance
                      </p>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {activeFort.significance}
                      </p>
                    </div>

                    {activeFort.historySnippet && (
                      <p className="text-xs text-slate-400 italic bg-amber-500/5 p-3 rounded-xl border border-amber-500/20">
                        "{activeFort.historySnippet}"
                      </p>
                    )}
                  </div>

                  {/* Key Fortifications Grid */}
                  {activeFort.keyStructures && Array.isArray(activeFort.keyStructures) && activeFort.keyStructures.length > 0 && (
                    <div>
                      <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Key Historical Structures & Bastions
                      </h5>
                      <div className="grid grid-cols-2 gap-2">
                        {activeFort.keyStructures.map((structure, idx) => (
                          <div key={idx} className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80 text-xs text-slate-300 flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0"></span>
                            <span className="truncate">{structure}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action CTA */}
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-slate-400 flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-orange-400" />
                      <span>Base: {activeFort.baseVillage || 'Sahyadri Range'}</span>
                    </span>

                    <Link
                      to="/treks"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold shadow-md shadow-orange-600/30 flex items-center space-x-1.5 transition-all"
                    >
                      <span>View Upcoming Batch</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                </motion.div>
              </AnimatePresence>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
