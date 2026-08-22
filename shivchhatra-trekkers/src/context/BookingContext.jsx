import React, { createContext, useContext, useState, useEffect } from 'react';
import { submitLiveBooking, trackLiveBooking } from '../services/apiService';

const STORAGE_KEY = 'shivchhatra_bookings_v2';

const initialDemoBookings = [];

const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState(() => {
    try {
      localStorage.removeItem('shivchhatra_bookings_data_v1');
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialDemoBookings;
    } catch (e) {
      console.error("Failed to load bookings", e);
      return initialDemoBookings;
    }
  });

  // Modal active states
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeTrekForBooking, setActiveTrekForBooking] = useState(null);
  const [activeBatchForBooking, setActiveBatchForBooking] = useState(null);
  
  // Last confirmed booking for immediate pass preview
  const [lastConfirmedBooking, setLastConfirmedBooking] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch (e) {
      console.error("Failed to save bookings", e);
    }
  }, [bookings]);

  const openBookingModal = (trek, batch = null) => {
    setActiveTrekForBooking(trek);
    setActiveBatchForBooking(batch || (trek.batches && trek.batches[0]) || null);
    setIsBookingOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingOpen(false);
    setActiveTrekForBooking(null);
    setActiveBatchForBooking(null);
  };

  // UTR Validation Helper
  const checkUtrDuplicate = (utr) => {
    if (!utr) return false;
    const cleanUtr = utr.trim().toUpperCase();
    return bookings.some(b => b.utrNumber && b.utrNumber.trim().toUpperCase() === cleanUtr);
  };

  // Submit new booking
  const submitBooking = async (bookingData) => {
    const referenceId = `ST-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking = {
      ...bookingData,
      id: referenceId,
      status: "Pending Verification",
      submittedAt: new Date().toISOString(),
      verifiedAt: null,
      adminNote: "Under automated & manual verification queue"
    };

    try {
      const serverSaved = await submitLiveBooking(newBooking);
      const finalBooking = serverSaved || newBooking;
      setBookings(prev => [finalBooking, ...prev]);
      setLastConfirmedBooking(finalBooking);
      return finalBooking;
    } catch (e) {
      console.warn("Backend server error on submitBooking, saved locally:", e);
      setBookings(prev => [newBooking, ...prev]);
      setLastConfirmedBooking(newBooking);
      return newBooking;
    }
  };

  // Admin Actions
  const verifyBooking = (bookingId, adminNote = "Verified by Admin") => {
    setBookings(prev => prev.map(b => {
      if (b.id !== bookingId) return b;
      return {
        ...b,
        status: "Confirmed",
        verifiedAt: new Date().toISOString(),
        adminNote: adminNote || "Payment confirmed"
      };
    }));
  };

  const rejectBooking = (bookingId, reason = "Invalid UTR or payment not received") => {
    setBookings(prev => prev.map(b => {
      if (b.id !== bookingId) return b;
      return {
        ...b,
        status: "Rejected",
        verifiedAt: new Date().toISOString(),
        adminNote: reason
      };
    }));
  };

  const deleteBooking = (bookingId) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
  };

  const findBooking = (query) => {
    if (!query) return null;
    const q = query.trim().toUpperCase();
    return bookings.find(b => 
      b.id.toUpperCase() === q || 
      b.phone.includes(q) || 
      (b.utrNumber && b.utrNumber.toUpperCase() === q)
    );
  };

  // Dynamic live seat calculation synchronized with active bookings
  const getBatchBookedSeats = (trek, batch = null) => {
    if (!bookings || bookings.length === 0 || !trek) return 0;
    const trekTitleNorm = (trek.title || '').trim().toLowerCase();
    const trekIdNorm = trek.id;

    return bookings
      .filter(b => {
        if (b.status === 'Rejected') return false;
        
        // Match trek by ID or Title
        const bTitleNorm = (b.trekTitle || '').trim().toLowerCase();
        const matchesTrek = (b.trekId && b.trekId === trekIdNorm) || 
                            (bTitleNorm && trekTitleNorm && (bTitleNorm.includes(trekTitleNorm) || trekTitleNorm.includes(bTitleNorm)));
        if (!matchesTrek) return false;

        // If batch is provided, match batch date
        if (batch && batch.date) {
          const bBatch = (b.batchDate || '').trim().toLowerCase();
          const targetBatch = (batch.date || '').trim().toLowerCase();
          if (bBatch && targetBatch && bBatch !== targetBatch && !bBatch.includes(targetBatch) && !targetBatch.includes(bBatch)) {
            return false;
          }
        }
        return true;
      })
      .reduce((sum, b) => sum + (Number(b.participantsCount) || 1), 0);
  };

  const getTrekTotalBookedSeats = (trek) => {
    return getBatchBookedSeats(trek, null);
  };

  return (
    <BookingContext.Provider value={{
      bookings,
      isBookingOpen,
      activeTrekForBooking,
      activeBatchForBooking,
      lastConfirmedBooking,
      setLastConfirmedBooking,
      openBookingModal,
      closeBookingModal,
      submitBooking,
      verifyBooking,
      rejectBooking,
      deleteBooking,
      checkUtrDuplicate,
      findBooking,
      getBatchBookedSeats,
      getTrekTotalBookedSeats
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within BookingProvider');
  }
  return context;
}
