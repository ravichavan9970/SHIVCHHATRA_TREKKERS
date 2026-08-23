import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  AlertCircle, 
  Mountain, 
  MapPin, 
  Calendar,
  Sparkles,
  RefreshCw,
  Clock,
  Navigation
} from 'lucide-react';
import { fetchAdminTreks, createAdminTrek, updateAdminTrek, deleteAdminTrek } from '../../services/api';

const defaultPickUpLocations = [
  {
    city: "Pune",
    spots: [
      "Swargate - Near Laxmi Narayan Theatre (11:00 PM)",
      "Shivajinagar - Bank of Maharashtra (11:30 PM)",
      "Wakad - Ginger Hotel Flyover (12:15 AM)",
      "Katraj - Wonder City (11:45 PM)"
    ]
  }
];

export default function TrekManager() {
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTrek, setCurrentTrek] = useState(null);

  const loadTreks = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminTreks();
      setTreks(data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTreks();
  }, []);

  const handleEdit = (trek) => {
    setCurrentTrek({
      ...trek,
      pickUpLocations: (trek.pickUpLocations && trek.pickUpLocations.length > 0)
        ? JSON.parse(JSON.stringify(trek.pickUpLocations))
        : JSON.parse(JSON.stringify(defaultPickUpLocations))
    });
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentTrek({
      id: 'trek-' + Date.now(),
      title: '',
      marathiTitle: '',
      category: 'Heritage Forts',
      difficulty: 'Moderate',
      difficultyLevel: 'Moderate',
      duration: '1 Day',
      elevation: '3,000 ft',
      region: 'Pune',
      price: 1499,
      originalPrice: 1999,
      heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      badge: 'Popular',
      rating: 5.0,
      reviewsCount: 1,
      tagline: '',
      overview: '',
      batches: [
        { id: 'b-' + Date.now(), date: 'Upcoming Weekend (Sat - Sun)', totalSeats: 25, bookedSeats: 0, status: 'Available' }
      ],
      pickUpLocations: JSON.parse(JSON.stringify(defaultPickUpLocations))
    });
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentTrek.title) return;

    try {
      const exists = treks.some(t => t.id === currentTrek.id);
      if (exists) {
        await updateAdminTrek(currentTrek.id, currentTrek);
      } else {
        await createAdminTrek(currentTrek);
      }
      await loadTreks();
      setIsEditing(false);
      setCurrentTrek(null);
    } catch (err) {
      alert('Failed to save trek: ' + err.message);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete trek: ${title}?`)) {
      try {
        setTreks(prev => prev.filter(t => t.id !== id));
        await deleteAdminTrek(id);
        await loadTreks();
      } catch (err) {
        alert('Failed to delete trek: ' + err.message);
        await loadTreks();
      }
    }
  };

  const addBatch = () => {
    const newBatch = {
      id: 'b-' + Date.now(),
      date: 'Next Weekend (Sat - Sun)',
      totalSeats: 25,
      bookedSeats: 0,
      status: 'Available'
    };
    setCurrentTrek(prev => ({
      ...prev,
      batches: [...(prev.batches || []), newBatch]
    }));
  };

  const removeBatch = (batchId) => {
    setCurrentTrek(prev => ({
      ...prev,
      batches: prev.batches.filter(b => b.id !== batchId)
    }));
  };

  const updateBatch = (batchId, field, val) => {
    setCurrentTrek(prev => ({
      ...prev,
      batches: prev.batches.map(b => {
        if (b.id === batchId) {
          const updated = { ...b, [field]: val };
          if (field === 'totalSeats' || field === 'bookedSeats') {
            const rem = updated.totalSeats - updated.bookedSeats;
            updated.status = rem <= 0 ? 'Batch Full' : rem <= 5 ? `${rem} Seats Left` : 'Available';
          }
          return updated;
        }
        return b;
      })
    }));
  };

  // Pickup Locations Helpers
  const addPickupCity = () => {
    setCurrentTrek(prev => ({
      ...prev,
      pickUpLocations: [
        ...(prev.pickUpLocations || []),
        { city: 'Nashik', spots: ['Dwarka Circle (11:00 PM)', 'CBS Stand (11:30 PM)'] }
      ]
    }));
  };

  const removePickupCity = (cityIndex) => {
    setCurrentTrek(prev => ({
      ...prev,
      pickUpLocations: prev.pickUpLocations.filter((_, idx) => idx !== cityIndex)
    }));
  };

  const updateCityName = (cityIndex, newCity) => {
    setCurrentTrek(prev => {
      const updated = [...(prev.pickUpLocations || [])];
      updated[cityIndex] = { ...updated[cityIndex], city: newCity };
      return { ...prev, pickUpLocations: updated };
    });
  };

  const addSpotToCity = (cityIndex) => {
    setCurrentTrek(prev => {
      const updated = [...(prev.pickUpLocations || [])];
      const spots = [...(updated[cityIndex].spots || []), 'New Pickup Spot & Time (11:00 PM)'];
      updated[cityIndex] = { ...updated[cityIndex], spots };
      return { ...prev, pickUpLocations: updated };
    });
  };

  const updateSpot = (cityIndex, spotIndex, newSpot) => {
    setCurrentTrek(prev => {
      const updated = [...(prev.pickUpLocations || [])];
      const spots = [...(updated[cityIndex].spots || [])];
      spots[spotIndex] = newSpot;
      updated[cityIndex] = { ...updated[cityIndex], spots };
      return { ...prev, pickUpLocations: updated };
    });
  };

  const removeSpot = (cityIndex, spotIndex) => {
    setCurrentTrek(prev => {
      const updated = [...(prev.pickUpLocations || [])];
      const spots = updated[cityIndex].spots.filter((_, idx) => idx !== spotIndex);
      updated[cityIndex] = { ...updated[cityIndex], spots };
      return { ...prev, pickUpLocations: updated };
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white font-heading">
            Live Treks & Batch Inventories ({treks.length} Expeditions)
          </h3>
          <p className="text-xs text-slate-400">
            Real-time synchronization with Java Spring Boot backend and persistent H2 database.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={loadTreks}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleAddNew}
            className="px-4 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-600/30 flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Trek</span>
          </button>
        </div>
      </div>

      {/* Trek Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-800 font-heading">
            <tr>
              <th className="p-4">Trek Expedition</th>
              <th className="p-4">Category & Difficulty</th>
              <th className="p-4">Price</th>
              <th className="p-4">Batches & Live Capacity</th>
              <th className="p-4">Pickup Routes</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {treks.map((t) => (
              <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={t.heroImage}
                      alt={t.title}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0"
                    />
                    <div>
                      <p className="font-bold text-white text-sm">{t.title}</p>
                      {t.marathiTitle && (
                        <p className="text-[11px] text-orange-400 font-medium">{t.marathiTitle}</p>
                      )}
                      <p className="text-[11px] text-slate-500">{t.region} • {t.elevation}</p>
                    </div>
                  </div>
                </td>

                <td className="p-4">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-950 text-slate-300 border border-slate-800">
                    {t.category}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">{t.difficulty}</p>
                </td>

                <td className="p-4 font-bold text-white">
                  ₹{t.price}
                  {t.originalPrice && (
                    <span className="block text-[10px] text-slate-500 line-through">₹{t.originalPrice}</span>
                  )}
                </td>

                <td className="p-4 space-y-1">
                  {t.batches?.map((b) => (
                    <div key={b.id || b.date} className="flex items-center space-x-2 text-[11px]">
                      <span className="font-medium text-slate-200">{b.date}:</span>
                      <span className="text-orange-400 font-mono font-bold">
                        {b.bookedSeats || 0}/{b.totalSeats}
                      </span>
                    </div>
                  ))}
                </td>

                <td className="p-4 space-y-1">
                  {t.pickUpLocations && t.pickUpLocations.length > 0 ? (
                    t.pickUpLocations.map((p, idx) => (
                      <div key={idx} className="text-[11px] text-slate-300">
                        <strong className="text-orange-400">{p.city}:</strong> {p.spots?.length || 0} spot(s)
                      </div>
                    ))
                  ) : (
                    <span className="text-slate-500 italic text-[10px]">Standard Hubs</span>
                  )}
                </td>

                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(t)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                    title="Edit Trek"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id, t.title)}
                    className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 transition-colors cursor-pointer"
                    title="Delete Trek"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit / Create Modal */}
      <AnimatePresence>
        {isEditing && currentTrek && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white font-heading">
                  {treks.some(t => t.id === currentTrek.id) ? 'Edit Expedition Dossier' : 'Create New Expedition'}
                </h3>
                <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                
                {/* Titles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Trek Title (English) *</label>
                    <input
                      type="text"
                      value={currentTrek.title}
                      onChange={(e) => setCurrentTrek({ ...currentTrek, title: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Marathi Title</label>
                    <input
                      type="text"
                      value={currentTrek.marathiTitle || ''}
                      onChange={(e) => setCurrentTrek({ ...currentTrek, marathiTitle: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Pricing and Region */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      value={currentTrek.price}
                      onChange={(e) => setCurrentTrek({ ...currentTrek, price: Number(e.target.value) })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Original Price (₹)</label>
                    <input
                      type="number"
                      value={currentTrek.originalPrice || ''}
                      onChange={(e) => setCurrentTrek({ ...currentTrek, originalPrice: Number(e.target.value) })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Category *</label>
                    <select
                      value={currentTrek.category}
                      onChange={(e) => setCurrentTrek({ ...currentTrek, category: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                    >
                      {[
                        "Heritage Forts",
                        "Fort Expeditions",
                        "Sunrise Summits",
                        "Thrill & Technical",
                        "Monsoon Waterfalls",
                        "Overnight Camping",
                        "Jungle & Wildlife Trails"
                      ].map((cat) => (
                        <option key={cat} value={cat} className="bg-slate-900">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Difficulty *</label>
                    <select
                      value={currentTrek.difficulty}
                      onChange={(e) => {
                        const val = e.target.value;
                        const level = val.includes('Easy') ? 'Easy' : val.includes('Challenging') || val.includes('Hard') || val.includes('Thrill') ? 'Challenging' : 'Moderate';
                        setCurrentTrek({ ...currentTrek, difficulty: val, difficultyLevel: level });
                      }}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                    >
                      {[
                        "Easy (Beginner Friendly)",
                        "Easy to Moderate",
                        "Moderate",
                        "Moderate to High",
                        "Challenging Endurance",
                        "High Thrill (80° Rock Steps / Technical)",
                        "Hard / Extreme"
                      ].map((diff) => (
                        <option key={diff} value={diff} className="bg-slate-900">
                          {diff}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Region / Location</label>
                    <input
                      type="text"
                      value={currentTrek.region}
                      onChange={(e) => setCurrentTrek({ ...currentTrek, region: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Altitude / Elevation</label>
                    <input
                      type="text"
                      value={currentTrek.elevation}
                      onChange={(e) => setCurrentTrek({ ...currentTrek, elevation: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-400 font-bold">Hero Image URL</label>
                    <span className="text-[10px] text-slate-500">Live thumbnail preview enabled</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 items-start">
                    <div className="flex-1 w-full space-y-1.5">
                      <input
                        type="text"
                        value={currentTrek.heroImage}
                        onChange={(e) => setCurrentTrek({ ...currentTrek, heroImage: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-orange-500"
                      />
                      <p className="text-[11px] text-slate-400">
                        Paste any image link (Unsplash, imgur, or your hosted web asset).
                      </p>
                    </div>

                    {/* Live Image Preview Box */}
                    <div className="w-full sm:w-48 h-24 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-800 flex items-center justify-center overflow-hidden relative shrink-0">
                      {currentTrek.heroImage ? (
                        <div className="w-full h-full relative">
                          <img
                            src={currentTrek.heroImage}
                            alt="Hero Preview"
                            className="w-full h-full object-cover rounded-xl"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.parentElement?.querySelector('.img-error-fallback');
                              if (fallback) fallback.classList.remove('hidden');
                            }}
                            onLoad={(e) => {
                              e.currentTarget.style.display = 'block';
                              const fallback = e.currentTarget.parentElement?.querySelector('.img-error-fallback');
                              if (fallback) fallback.classList.add('hidden');
                            }}
                          />
                          <div className="img-error-fallback hidden w-full h-full absolute inset-0 bg-red-950/60 border border-red-800 rounded-xl flex flex-col items-center justify-center p-2 text-center text-red-300 text-[10px]">
                            <AlertCircle className="w-4 h-4 mb-0.5 text-red-400" />
                            <span>Invalid Image URL</span>
                          </div>
                          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md text-[9px] font-bold text-white border border-white/20">
                            Live Preview
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-600 text-[10px] p-2 text-center">
                          <Mountain className="w-5 h-5 mb-1 text-slate-700" />
                          <span>No Image URL</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Tagline</label>
                  <textarea
                    rows={2}
                    value={currentTrek.tagline || ''}
                    onChange={(e) => setCurrentTrek({ ...currentTrek, tagline: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                {/* Batches Section */}
                <div className="space-y-2 border-t border-slate-800 pt-3">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-300 font-bold flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-orange-400" />
                      <span>Departure Batches & Capacities</span>
                    </label>
                    <button
                      type="button"
                      onClick={addBatch}
                      className="text-orange-400 hover:text-orange-300 font-bold text-xs flex items-center space-x-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Batch</span>
                    </button>
                  </div>

                  {currentTrek.batches?.map((b) => (
                    <div key={b.id} className="grid grid-cols-4 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 items-center">
                      <input
                        type="text"
                        value={b.date}
                        onChange={(e) => updateBatch(b.id, 'date', e.target.value)}
                        placeholder="Batch Date"
                        className="col-span-2 p-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white"
                      />
                      <input
                        type="number"
                        value={b.totalSeats}
                        onChange={(e) => updateBatch(b.id, 'totalSeats', Number(e.target.value))}
                        placeholder="Total Seats"
                        className="p-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-orange-400 font-bold">{b.bookedSeats} Booked</span>
                        <button
                          type="button"
                          onClick={() => removeBatch(b.id)}
                          className="p-1 text-red-400 hover:text-red-300 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pickup Locations & Departure Times Section */}
                <div className="space-y-3 border-t border-slate-800 pt-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-slate-300 font-bold flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Boarding & Pickup Locations (Cities & Spots with Times)</span>
                      </label>
                      <p className="text-[10px] text-slate-500">
                        These cities and pickup spots will populate in the booking checkout dropdown.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addPickupCity}
                      className="text-emerald-400 hover:text-emerald-300 font-bold text-xs flex items-center space-x-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add City Route</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {currentTrek.pickUpLocations?.map((loc, cityIdx) => (
                      <div key={cityIdx} className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 flex-1 max-w-xs">
                            <span className="text-xs text-slate-400 font-bold">City:</span>
                            <input
                              type="text"
                              value={loc.city}
                              onChange={(e) => updateCityName(cityIdx, e.target.value)}
                              placeholder="e.g. Pune, Mumbai, Nashik"
                              className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs font-bold"
                            />
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => addSpotToCity(cityIdx)}
                              className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] text-orange-400 font-semibold flex items-center space-x-1 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Spot</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => removePickupCity(cityIdx)}
                              className="p-1 text-red-400 hover:text-red-300 cursor-pointer"
                              title="Delete City Route"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Spots in this city */}
                        <div className="space-y-1.5 pl-4 border-l-2 border-slate-800">
                          {loc.spots?.map((spot, spotIdx) => (
                            <div key={spotIdx} className="flex items-center space-x-2">
                              <Clock className="w-3 h-3 text-slate-500 shrink-0" />
                              <input
                                type="text"
                                value={spot}
                                onChange={(e) => updateSpot(cityIdx, spotIdx, e.target.value)}
                                placeholder="e.g. Swargate - Near Laxmi Narayan Theatre (11:00 PM)"
                                className="flex-1 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs"
                              />
                              <button
                                type="button"
                                onClick={() => removeSpot(cityIdx, spotIdx)}
                                className="p-1 text-slate-500 hover:text-red-400 cursor-pointer"
                                title="Remove Spot"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-orange-600/30 flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save to Database</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
