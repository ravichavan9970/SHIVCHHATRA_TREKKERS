import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Quote, 
  ShieldCheck, 
  Heart, 
  Camera,
  CheckCircle2, 
  Sparkles, 
  Edit3, 
  Plus,
  MapPin
} from 'lucide-react';
import { useReviews } from '../../context/ReviewContext';
import { getLiveGallery } from '../../services/apiService';

export default function TestimonialsGallery() {
  const { reviews, stats, openReviewModal } = useReviews();
  const [galleryPhotos, setGalleryPhotos] = useState([]);

  // Sync with live Java backend for dynamic gallery
  useEffect(() => {
    async function loadGallery() {
      const livePhotos = await getLiveGallery();
      if (Array.isArray(livePhotos)) {
        setGalleryPhotos(livePhotos);
      }
    }
    loadGallery();

    const interval = setInterval(loadGallery, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="reviews-section" className="py-20 bg-[#090d16] relative overflow-hidden border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Review CTA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <Heart className="w-3.5 h-3.5 fill-amber-400" />
              <span>COMMUNITY STORIES & RATINGS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
              Voices from the Sahyadri Trails
            </h2>
            <div className="flex items-center space-x-3 text-sm text-slate-400">
              <div className="flex items-center space-x-1 text-yellow-400">
                <span className="font-bold text-base text-white">{stats.averageRating}</span>
                <Star className="w-4 h-4 fill-yellow-400" />
              </div>
              <span>•</span>
              <span>Based on {stats.totalReviews} verified trekker reviews</span>
            </div>
          </div>

          {/* Rate Trek CTA Button */}
          <button
            onClick={() => openReviewModal()}
            className="px-5 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-orange-600/30 flex items-center space-x-2 transition-all shrink-0 hover:scale-102"
          >
            <Edit3 className="w-4 h-4" />
            <span>Rate Your Expedition / Write a Review</span>
          </button>
        </div>

        {/* Live User Reviews Cards Grid */}
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {reviews.slice(0, 6).map((t, idx) => (
              <motion.div
                key={t.id || idx}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/90 shadow-xl backdrop-blur-md flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-yellow-400">
                      {[...Array(Number(t.rating) || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400" />
                      ))}
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-orange-400">
                      {t.tag || 'Trekker'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                    "{t.comment}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <p className="text-xs sm:text-sm font-bold text-white font-heading">{t.userName}</p>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" title="Verified Trekker" />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {t.trekTitle} {t.city ? `• ${t.city}` : ''}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {t.date}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4 rounded-3xl bg-slate-900/40 border border-slate-800/80 mb-16 space-y-3 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-xl">
              ⭐
            </div>
            <p className="text-base font-bold text-white font-heading">No Reviews Yet</p>
            <p className="text-xs text-slate-400">
              Be the first trekker to share your Sahyadri summit memory and rate an expedition!
            </p>
          </div>
        )}

        {/* Photo Moments Grid (Managed by Admin) */}
        {galleryPhotos.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white font-heading flex items-center space-x-2">
                <Camera className="w-5 h-5 text-orange-400" />
                <span>Unfiltered Trail Moments</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">#ShivchhatraTrekkers</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {galleryPhotos.map((item, idx) => (
                <div key={item.id || idx} className="relative h-44 sm:h-52 rounded-2xl overflow-hidden group border border-slate-800/80 bg-slate-950">
                  <img
                    src={item.imageUrl}
                    alt={item.caption || 'Trekker Memory'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <span className="text-xs font-bold text-white font-heading">{item.caption || 'Sahyadri Moment'}</span>
                    {item.location && (
                      <span className="text-[10px] text-orange-300 flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-orange-400" />
                        <span>{item.location}</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
