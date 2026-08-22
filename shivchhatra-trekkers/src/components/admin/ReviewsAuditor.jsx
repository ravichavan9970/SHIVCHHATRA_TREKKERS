import React from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Trash2, 
  CheckCircle2, 
  MessageSquare, 
  User, 
  MapPin, 
  Mountain,
  Plus
} from 'lucide-react';
import { useReviews } from '../../context/ReviewContext';

export default function ReviewsAuditor() {
  const { reviews, stats, deleteReview, openReviewModal } = useReviews();

  const handleDelete = (id, userName) => {
    if (window.confirm(`Delete review from ${userName}?`)) {
      deleteReview(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white font-heading">
            Trekker Ratings & Reviews Auditor ({stats.totalReviews} Total)
          </h3>
          <p className="text-xs text-slate-400">
            Real community ratings submitted by trekkers. Live average: <strong className="text-yellow-400">{stats.averageRating} ★</strong>
          </p>
        </div>

        <button
          onClick={() => openReviewModal()}
          className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-600/30 flex items-center space-x-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Review</span>
        </button>
      </div>

      {/* Ratings Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <p className="text-xs text-slate-400">Community Average</p>
          <div className="flex items-center space-x-1 mt-1">
            <span className="text-2xl font-black text-yellow-400 font-heading">{stats.averageRating}</span>
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <p className="text-xs text-slate-400">Total Reviews</p>
          <p className="text-2xl font-black text-white font-heading mt-1">{stats.totalReviews}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <p className="text-xs text-slate-400">5-Star Ratings</p>
          <p className="text-2xl font-black text-emerald-400 font-heading mt-1">{stats.ratingBreakdown[5] || 0}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <p className="text-xs text-slate-400">4-Star Ratings</p>
          <p className="text-2xl font-black text-amber-400 font-heading mt-1">{stats.ratingBreakdown[4] || 0}</p>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-800 font-heading">
            <tr>
              <th className="p-4">Trekker & Location</th>
              <th className="p-4">Trek Expedition</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Review Feedback</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {reviews.map((r) => (
              <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center space-x-1.5 font-bold text-white">
                    <span>{r.userName}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <p className="text-[11px] text-slate-400">{r.city || 'Maharashtra'}</p>
                </td>

                <td className="p-4">
                  <p className="font-semibold text-orange-400">{r.trekTitle}</p>
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-slate-950 text-[10px] text-slate-400 border border-slate-800">
                    {r.tag || 'Trekker'}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex items-center space-x-0.5 text-yellow-400 font-bold">
                    <span>{r.rating}</span>
                    <Star className="w-3.5 h-3.5 fill-yellow-400" />
                  </div>
                </td>

                <td className="p-4 max-w-xs">
                  <p className="text-slate-300 line-clamp-2 italic">"{r.comment}"</p>
                </td>

                <td className="p-4 text-slate-400 font-mono text-[11px]">
                  {r.date}
                </td>

                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDelete(r.id, r.userName)}
                    className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 transition-colors"
                    title="Delete Review"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
