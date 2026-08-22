import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Trash2, 
  CheckCircle2, 
  Plus,
  RefreshCw,
  X
} from 'lucide-react';
import { fetchAdminReviews, fetchAdminReviewStats, deleteAdminReview, createAdminReview } from '../../services/api';

export default function ReviewsAuditor() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ averageRating: '0.0', totalReviews: 0, ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newReview, setNewReview] = useState({
    userName: '',
    city: 'Pune',
    trekTitle: 'Rajgad to Torna Ridge Expedition',
    rating: 5,
    comment: '',
    tag: 'Summit Achiever'
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [revs, st] = await Promise.all([
        fetchAdminReviews(),
        fetchAdminReviewStats()
      ]);
      setReviews(revs || []);
      setStats(st || { averageRating: '0.0', totalReviews: 0, ratingBreakdown: {} });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id, userName) => {
    if (window.confirm(`Delete review from ${userName}?`)) {
      try {
        setReviews(prev => prev.filter(r => r.id !== id));
        await deleteAdminReview(id);
        await loadData();
      } catch (err) {
        console.error('Delete review error:', err);
        alert('Failed to delete review: ' + err.message);
        await loadData();
      }
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.userName || !newReview.comment) return;

    try {
      await createAdminReview(newReview);
      setIsAdding(false);
      setNewReview({
        userName: '',
        city: 'Pune',
        trekTitle: 'Rajgad to Torna Ridge Expedition',
        rating: 5,
        comment: '',
        tag: 'Summit Achiever'
      });
      await loadData();
    } catch (err) {
      alert('Failed to create review: ' + err.message);
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
            Real community ratings stored in JPA database. Live average: <strong className="text-yellow-400">{stats.averageRating} ★</strong>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-600/30 flex items-center space-x-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Review</span>
          </button>
        </div>
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
          <p className="text-2xl font-black text-emerald-400 font-heading mt-1">{stats.ratingBreakdown?.[5] || 0}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <p className="text-xs text-slate-400">4-Star Ratings</p>
          <p className="text-2xl font-black text-amber-400 font-heading mt-1">{stats.ratingBreakdown?.[4] || 0}</p>
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

      {/* Add Review Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-bold text-white">Add Verified Community Review</h4>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Trekker Name</label>
                <input
                  type="text"
                  value={newReview.userName}
                  onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                  placeholder="e.g. Rahul Patil"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">City</label>
                  <input
                    type="text"
                    value={newReview.city}
                    onChange={(e) => setNewReview({ ...newReview, city: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Rating (1-5)</label>
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                    <option value={3}>3 Stars ★★★☆☆</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Trek Expedition</label>
                <input
                  type="text"
                  value={newReview.trekTitle}
                  onChange={(e) => setNewReview({ ...newReview, trekTitle: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Review Feedback</label>
                <textarea
                  rows={3}
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Share trekker experience..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
