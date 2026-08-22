import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  MessageSquare, 
  User, 
  MapPin, 
  Mountain, 
  Send 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useReviews } from '../../context/ReviewContext';
import { useTreks } from '../../context/TrekContext';

const RATING_LABELS = {
  1: "Needs Improvement ⚠️",
  2: "Fair Experience 👍",
  3: "Good Expedition ⛰️",
  4: "Very Good & Safe 🌟",
  5: "Exceptional / Jai Shivray! 🚩"
};

const TAG_OPTIONS = [
  "Summit Achiever",
  "First-Time Trekker",
  "Family Expedition",
  "Solo Explorer",
  "Weekend Adventurer",
  "Heritage Lover"
];

export default function ReviewModal() {
  const { isReviewModalOpen, closeReviewModal, addReview, targetTrekForReview } = useReviews();
  const { treks } = useTreks();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [userName, setUserName] = useState('');
  const [city, setCity] = useState('');
  const [selectedTrekTitle, setSelectedTrekTitle] = useState('');
  const [comment, setComment] = useState('');
  const [selectedTag, setSelectedTag] = useState('Summit Achiever');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (targetTrekForReview) {
      setSelectedTrekTitle(targetTrekForReview.title || '');
    } else if (treks && treks.length > 0) {
      setSelectedTrekTitle(treks[0].title);
    }
  }, [targetTrekForReview, treks, isReviewModalOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) return;

    addReview({
      userName: userName.trim(),
      city: city.trim() || 'Maharashtra',
      trekTitle: selectedTrekTitle || 'Sahyadri Fort Expedition',
      rating: Number(rating),
      comment: comment.trim(),
      tag: selectedTag
    });

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.warn("Confetti error", err);
    }

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setUserName('');
      setCity('');
      setComment('');
      setRating(5);
      closeReviewModal();
    }, 1800);
  };

  if (!isReviewModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeReviewModal}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="relative w-full max-w-lg bg-[#0b101e] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 p-6 sm:p-7 space-y-6"
        >
          {/* Close Button */}
          <button
            onClick={closeReviewModal}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-all border border-slate-800"
          >
            <X className="w-4 h-4" />
          </button>

          {isSuccess ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto text-3xl shadow-lg shadow-emerald-500/20">
                🚩
              </div>
              <h3 className="text-xl font-extrabold text-white font-heading">
                Dhanyavad! Review Submitted
              </h3>
              <p className="text-xs text-slate-300">
                Your rating has been recorded and added to our live community score.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Header */}
              <div className="text-center space-y-1.5 pt-2">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-orange-400" />
                  <span>COMMUNITY TREKKER RATING</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
                  Rate Your Expedition Experience
                </h3>
                <p className="text-xs text-slate-400">
                  Share your honest feedback to guide fellow Sahyadri trekkers.
                </p>
              </div>

              {/* Interactive Star Rating Selector */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col items-center justify-center space-y-2">
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1.5 focus:outline-none transition-transform hover:scale-125"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          (hoverRating || rating) >= star
                            ? 'text-yellow-400 fill-yellow-400 filter drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]'
                            : 'text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-xs font-bold text-amber-400 font-heading">
                  {RATING_LABELS[hoverRating || rating]}
                </p>
              </div>

              {/* Form Input Fields */}
              <div className="space-y-3.5">
                
                {/* Name & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Your Name *</label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Patil"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Your City / Location</label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        placeholder="e.g. Pune, Mumbai"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Trek Select */}
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Trek / Fort Completed</label>
                  <div className="relative">
                    <Mountain className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    {treks && treks.length > 0 ? (
                      <select
                        value={selectedTrekTitle}
                        onChange={(e) => setSelectedTrekTitle(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-orange-500"
                      >
                        {treks.map((t) => (
                          <option key={t.id} value={t.title} className="bg-slate-900 text-white">
                            {t.title}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        placeholder="e.g. Rajgad, Harishchandragad, Kalsubai..."
                        value={selectedTrekTitle}
                        onChange={(e) => setSelectedTrekTitle(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                      />
                    )}
                  </div>
                </div>

                {/* Trekker Tag Pills */}
                <div>
                  <label className="text-xs text-slate-400 block mb-1.5">Trekker Badge</label>
                  <div className="flex flex-wrap gap-1.5">
                    {TAG_OPTIONS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setSelectedTag(tag)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          selectedTag === tag
                            ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Comment */}
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Your Feedback & Experience *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Tell us about the trails, leader guidance, food, safety, and your summit moments..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-600/30 flex items-center justify-center space-x-2 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Submit Rating & Review</span>
              </button>

            </form>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
