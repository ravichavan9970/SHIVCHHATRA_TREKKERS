import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Mountain, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Compass, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { fortsGuide as defaultForts } from '../data/fortsGuide';
import { getLiveForts } from '../services/apiService';
import { Link } from 'react-router-dom';

export default function FortGuidePage() {
  const [forts, setForts] = useState(defaultForts);

  useEffect(() => {
    async function loadForts() {
      const data = await getLiveForts();
      if (Array.isArray(data) && data.length > 0) {
        setForts(data);
      }
    }
    loadForts();

    const interval = setInterval(loadForts, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#080c14] pt-24 pb-20">
      
      {/* Top Banner */}
      <div className="relative py-14 bg-slate-950 border-b border-slate-800/80 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <span>🚩 सह्याद्रीचे अभेद्य किल्ले • MARATHA HERITAGE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading">
            Shivkalin Forts Heritage Guide
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Discover the military architecture, legendary battlefields, and sacred summits fortified by Chhatrapati Shivaji Maharaj.
          </p>
        </div>
      </div>

      {/* Forts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {forts.map((fort, idx) => (
            <motion.div
              key={fort.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-3xl overflow-hidden bg-slate-900/70 border border-slate-800 hover:border-orange-500/40 shadow-xl backdrop-blur-md flex flex-col justify-between"
            >
              {/* Fort Image */}
              <div>
                <div className="relative h-56 bg-slate-950 overflow-hidden">
                  <img
                    src={fort.image}
                    alt={fort.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                  
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950/90 backdrop-blur-md text-[11px] font-bold text-orange-300 border border-slate-800 font-mono">
                      {fort.altitude?.split('/')[0] || fort.altitude}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950/90 backdrop-blur-md text-[10px] font-semibold text-slate-300 border border-slate-800">
                      {fort.difficulty}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-xl font-bold text-white font-heading">{fort.name}</h3>
                    <p className="text-xs text-orange-400 font-semibold mt-0.5">{fort.title}</p>
                  </div>
                </div>

                <div className="p-6 space-y-4 text-xs">
                  <p className="text-slate-300 leading-relaxed">{fort.significance}</p>

                  <div className="grid grid-cols-2 gap-3 py-2 border-y border-slate-800/80 text-[11px] text-slate-400">
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                      <span className="truncate">{fort.baseVillage}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                      <span className="truncate">{fort.bestSeason}</span>
                    </div>
                  </div>

                  {fort.keyStructures && fort.keyStructures.length > 0 && (
                    <div className="space-y-1.5">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Key Bastions & Landmarks</h4>
                      <div className="flex flex-wrap gap-1">
                        {fort.keyStructures.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] text-slate-300">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {fort.historySnippet && (
                    <p className="text-[11px] text-slate-400 italic bg-amber-500/5 p-3 rounded-xl border border-amber-500/20">
                      "{fort.historySnippet}"
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Ready to conquer {fort.name.split(' ')[0]}?</span>
                <Link
                  to="/treks"
                  className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-600/30 flex items-center space-x-1.5 transition-all"
                >
                  <span>Book Trek</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
