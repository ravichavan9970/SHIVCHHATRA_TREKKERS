import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getLiveReviews, submitLiveReview } from '../services/apiService';

const STORAGE_KEY = 'shivchhatra_reviews_v2';

const initialReviews = [];

const ReviewContext = createContext();

export function ReviewProvider({ children }) {
  const [reviews, setReviews] = useState(() => {
    try {
      localStorage.removeItem('shivchhatra_reviews_data_v1');
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialReviews;
    } catch (e) {
      console.error("Failed to load reviews", e);
      return initialReviews;
    }
  });

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [targetTrekForReview, setTargetTrekForReview] = useState(null);

  // Sync with live Java backend and poll periodically
  useEffect(() => {
    async function fetchServerReviews() {
      const serverRevs = await getLiveReviews();
      if (Array.isArray(serverRevs)) {
        setReviews(serverRevs);
      }
    }
    fetchServerReviews();

    const interval = setInterval(fetchServerReviews, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    } catch (e) {
      console.error("Failed to save reviews", e);
    }
  }, [reviews]);

  const openReviewModal = (trek = null) => {
    setTargetTrekForReview(trek);
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setTargetTrekForReview(null);
  };

  const addReview = async (newReview) => {
    const reviewWithId = {
      ...newReview,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      verified: true
    };
    try {
      const saved = await submitLiveReview(reviewWithId);
      const finalRev = saved || reviewWithId;
      setReviews(prev => [finalRev, ...prev]);
      return finalRev;
    } catch (e) {
      console.warn("Error posting review to Java backend, saving locally:", e);
      setReviews(prev => [reviewWithId, ...prev]);
      return reviewWithId;
    }
  };

  const deleteReview = (id) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  // Real Dynamic Aggregated Metrics
  const stats = useMemo(() => {
    if (reviews.length === 0) {
      return { averageRating: "0.0", totalReviews: 0, ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    }

    const total = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + Number(r.rating || 5), 0);
    const avg = (sum / total).toFixed(1);

    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      const score = Math.round(Number(r.rating) || 5);
      if (breakdown[score] !== undefined) breakdown[score]++;
    });

    return {
      averageRating: avg,
      totalReviews: total,
      ratingBreakdown: breakdown
    };
  }, [reviews]);

  return (
    <ReviewContext.Provider value={{
      reviews,
      stats,
      isReviewModalOpen,
      targetTrekForReview,
      openReviewModal,
      closeReviewModal,
      addReview,
      deleteReview
    }}>
      {children}
    </ReviewContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
}
