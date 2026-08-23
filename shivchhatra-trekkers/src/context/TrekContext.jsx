import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { initialTreks } from '../data/initialTreks';
import { getLiveTreks } from '../services/apiService';

const STORAGE_KEY = 'shivchhatra_treks_v2';

const TrekContext = createContext();

export function TrekProvider({ children }) {
  const [treks, setTreks] = useState(() => {
    try {
      localStorage.removeItem('shivchhatra_treks_data_v1');
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialTreks;
    } catch (e) {
      console.error("Error loading treks from localStorage", e);
      return initialTreks;
    }
  });

  // Fetch live treks from Java backend and poll periodically
  useEffect(() => {
    async function fetchServerTreks() {
      const serverTreks = await getLiveTreks();
      if (Array.isArray(serverTreks) && serverTreks.length > 0) {
        setTreks(serverTreks);
      }
    }
    fetchServerTreks();

    // Poll every 5 seconds for real-time synchronization
    const interval = setInterval(fetchServerTreks, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filter States for user navigation
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [maxPrice, setMaxPrice] = useState(5000);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(treks));
    } catch (e) {
      console.error("Error saving treks to localStorage", e);
    }
  }, [treks]);

  // Admin Actions
  const addTrek = (newTrek) => {
    const trekWithId = {
      ...newTrek,
      id: newTrek.id || `trek-${Date.now()}`,
      rating: newTrek.rating || 5.0,
      reviewsCount: newTrek.reviewsCount || 1,
      batches: newTrek.batches && newTrek.batches.length > 0 ? newTrek.batches : [
        { id: `b-${Date.now()}`, date: "Upcoming Weekend", totalSeats: 25, bookedSeats: 0, status: "Available" }
      ]
    };
    setTreks(prev => [trekWithId, ...prev]);
    return trekWithId;
  };

  const updateTrek = (id, updatedFields) => {
    setTreks(prev => prev.map(trek => trek.id === id ? { ...trek, ...updatedFields } : trek));
  };

  const deleteTrek = (id) => {
    setTreks(prev => prev.filter(trek => trek.id !== id));
  };

  const resetToDefaultTreks = () => {
    setTreks(initialTreks);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateBatchCapacity = (trekId, batchId, bookedIncrement = 1) => {
    setTreks(prev => prev.map(trek => {
      if (trek.id !== trekId) return trek;
      const updatedBatches = (trek.batches || []).map(batch => {
        if (batch.id !== batchId) return batch;
        const newBooked = Math.min(batch.totalSeats, (batch.bookedSeats || 0) + bookedIncrement);
        const remaining = batch.totalSeats - newBooked;
        return {
          ...batch,
          bookedSeats: newBooked,
          status: remaining <= 0 ? "Sold Out" : remaining <= 5 ? `${remaining} Seats Left` : "Available"
        };
      });
      return { ...trek, batches: updatedBatches };
    }));
  };

  const getTrekById = (id) => {
    return treks.find(t => t.id === id);
  };

  // Filtered treks computed list
  const filteredTreks = useMemo(() => {
    return treks.filter(trek => {
      const matchesSearch = !searchQuery || 
        trek.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (trek.marathiTitle && trek.marathiTitle.includes(searchQuery)) ||
        trek.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trek.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || trek.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || 
        trek.difficultyLevel?.toLowerCase() === selectedDifficulty.toLowerCase() ||
        trek.difficulty.toLowerCase().includes(selectedDifficulty.toLowerCase());

      const matchesRegion = selectedRegion === 'All' || trek.region.toLowerCase().includes(selectedRegion.toLowerCase());
      const matchesPrice = trek.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesDifficulty && matchesRegion && matchesPrice;
    });
  }, [treks, searchQuery, selectedCategory, selectedDifficulty, selectedRegion, maxPrice]);

  const categories = useMemo(() => {
    const list = Array.from(new Set(treks.map(t => t.category)));
    return ['All', ...list];
  }, [treks]);

  const regions = useMemo(() => {
    const list = Array.from(new Set(treks.map(t => t.region.split(',')[0].trim())));
    return ['All', ...list];
  }, [treks]);

  return (
    <TrekContext.Provider value={{
      treks,
      filteredTreks,
      categories,
      regions,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
      selectedDifficulty,
      setSelectedDifficulty,
      selectedRegion,
      setSelectedRegion,
      maxPrice,
      setMaxPrice,
      addTrek,
      updateTrek,
      deleteTrek,
      resetToDefaultTreks,
      updateBatchCapacity,
      getTrekById
    }}>
      {children}
    </TrekContext.Provider>
  );
}

export function useTreks() {
  const context = useContext(TrekContext);
  if (!context) {
    throw new Error('useTreks must be used within a TrekProvider');
  }
  return context;
}
