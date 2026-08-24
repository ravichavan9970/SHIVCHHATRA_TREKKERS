import React, { createContext, useContext, useState, useEffect } from 'react';
import { submitLiveBooking, trackLiveBooking } from '../services/apiService';

const STORAGE_KEY = 'shivchhatra_bookings_v4';
const PERMANENT_ARCHIVE_KEY = 'shivchhatra_bookings_permanent_archive';

const recoverAllStoredBookings = () => {
  const allMap = new Map();
  const keysToProbe = [
    PERMANENT_ARCHIVE_KEY,
    STORAGE_KEY,
    'shivchhatra_admin_bookings_cache',
    'shivchhatra_bookings_v3',
    'shivchhatra_bookings_v2',
    'shivchhatra_bookings_data_v1',
    'shivchhatra_bookings_backup'
  ];

  for (const key of keysToProbe) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach(item => {
            if (item && (item.id || item.utrNumber)) {
              const uniqueKey = item.id || item.utrNumber;
              if (!allMap.has(uniqueKey)) {
                allMap.set(uniqueKey, item);
              }
            }
          });
        }
      }
    } catch (e) {
      // Ignore individual corrupted keys
    }
  }
  return Array.from(allMap.values());
};

const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState(() => recoverAllStoredBookings());

  // Modal active states
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeTrekForBooking, setActiveTrekForBooking] = useState(null);
  const [activeBatchForBooking, setActiveBatchForBooking] = useState(null);
  
  // Last confirmed booking for immediate pass preview
  const [lastConfirmedBooking, setLastConfirmedBooking] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
      localStorage.setItem(PERMANENT_ARCHIVE_KEY, JSON.stringify(bookings));
      localStorage.setItem('shivchhatra_bookings_backup', JSON.stringify(bookings));
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

  const completeBooking = (bookingId, note = "Expedition completed successfully. Preserved in History.") => {
    setBookings(prev => prev.map(b => {
      if (b.id !== bookingId) return b;
      return {
        ...b,
        status: "Completed",
        completedAt: new Date().toISOString(),
        adminNote: note
      };
    }));
  };

  const deleteBooking = (queryOrId) => {
    if (!queryOrId) return;
    const q = queryOrId.trim().toUpperCase();
    setBookings(prev => {
      const updated = prev.filter(b => 
        b.id.toUpperCase() !== q && 
        !b.phone?.includes(q) && 
        (!b.utrNumber || b.utrNumber.toUpperCase() !== q)
      );
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const findBooking = (query) => {
    if (!query) return null;
    const q = query.trim().toUpperCase();
    return bookings.find(b => 
      b.id?.toUpperCase() === q || 
      b.phone?.includes(q) || 
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
      completeBooking,
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
