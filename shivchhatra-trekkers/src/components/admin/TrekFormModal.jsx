import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Mountain, Save, Image as ImageIcon, Calendar } from 'lucide-react';

export default function TrekFormModal({ isOpen, onClose, onSave, editingTrek = null }) {
  const [formData, setFormData] = useState({
    title: '',
    marathiTitle: '',
    tagline: '',
    category: 'Fort Expeditions',
    region: 'Pune, Maharashtra',
    difficulty: 'Moderate',
    difficultyLevel: 'Moderate',
    elevation: '4,500 ft (1,370 m)',
    duration: '2 Days / 1 Night',
    price: 1599,
    originalPrice: 1999,
    badge: 'Upcoming',
    heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    highlights: [
      'Panoramic view of Sahyadri ranges',
      'Certified mountain trek leaders and safety briefing',
      'Authentic Maharashtrian village food'
    ],
    inclusions: [
      'Private bus travel to & from base',
      'All meals: Breakfast, Lunch, Dinner & Tea',
      'First Aid and Certified Trek Leaders'
    ],
    exclusions: [
      'Personal water bottles and emergency expenses'
    ],
    batches: [
      { id: `b-${Date.now()}-1`, date: 'Next Weekend (Sat - Sun)', totalSeats: 25, bookedSeats: 0, status: 'Available' }
    ],
    pickUpLocations: [
      { city: 'Pune', spots: ['Swargate (11:00 PM)', 'Chandani Chowk (11:30 PM)'] },
      { city: 'Mumbai', spots: ['Dadar (09:00 PM)', 'Thane (09:45 PM)'] }
    ]
  });

  useEffect(() => {
    if (editingTrek) {
      setFormData({
        ...editingTrek,
        highlights: editingTrek.highlights || [],
        inclusions: editingTrek.inclusions || [],
        exclusions: editingTrek.exclusions || [],
        batches: editingTrek.batches || [],
        pickUpLocations: editingTrek.pickUpLocations || []
      });
    } else {
      setFormData({
        title: '',
        marathiTitle: '',
        tagline: '',
        category: 'Fort Expeditions',
        region: 'Pune, Maharashtra',
        difficulty: 'Moderate',
        difficultyLevel: 'Moderate',
        elevation: '4,500 ft (1,370 m)',
        duration: '2 Days / 1 Night',
        price: 1599,
        originalPrice: 1999,
        badge: 'Upcoming',
        heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
        highlights: [
          'Panoramic view of Sahyadri ranges',
          'Certified mountain trek leaders and safety briefing',
          'Authentic Maharashtrian village food'
        ],
        inclusions: [
          'Private bus travel to & from base',
          'All meals: Breakfast, Lunch, Dinner & Tea',
          'First Aid and Certified Trek Leaders'
        ],
        exclusions: [
          'Personal water bottles and emergency expenses'
        ],
        batches: [
          { id: `b-${Date.now()}-1`, date: 'Next Weekend (Sat - Sun)', totalSeats: 25, bookedSeats: 0, status: 'Available' }
        ],
        pickUpLocations: [
          { city: 'Pune', spots: ['Swargate (11:00 PM)', 'Chandani Chowk (11:30 PM)'] },
          { city: 'Mumbai', spots: ['Dadar (09:00 PM)', 'Thane (09:45 PM)'] }
        ]
      });
    }
  }, [editingTrek, isOpen]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  // Batches management
  const addBatch = () => {
    setFormData(prev => ({
      ...prev,
      batches: [
        ...prev.batches,
        { id: `b-${Date.now()}`, date: 'Upcoming Batch Date', totalSeats: 25, bookedSeats: 0, status: 'Available' }
      ]
    }));
  };

  const updateBatch = (index, field, value) => {
    const updated = [...formData.batches];
    updated[index] = { ...updated[index], [field]: field === 'totalSeats' || field === 'bookedSeats' ? Number(value) : value };
    setFormData(prev => ({ ...prev, batches: updated }));
  };

  const removeBatch = (index) => {
    setFormData(prev => ({
      ...prev,
      batches: prev.batches.filter((_, i) => i !== index)
    }));
  };

  // Highlights / Inclusions list helpers
  const handleArrayItemChange = (field, index, value) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData(prev => ({ ...prev, [field]: updated }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a trek title');
      return;
    }
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-[#0b101e] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col my-auto"
        >
          {/* Modal Header */}
          <div className="p-4 sm:p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2">
              <Mountain className="w-5 h-5 text-orange-400" />
              <h3 className="text-base sm:text-lg font-bold text-white font-heading">
                {editingTrek ? 'Edit Trek / Expedition' : 'Add New Upcoming Trek'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Form Content */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-xs sm:text-sm">
            
            {/* Basic Info */}
            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase text-xs tracking-wider text-orange-400">1. Basic Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 text-xs">Trek Title (English) *</label>
                  <input
                    type="text"
                    required
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Rajgad to Torna Ridge Expedition"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 text-xs">Marathi Title</label>
                  <input
                    type="text"
                    name="marathiTitle"
                    value={formData.marathiTitle}
                    onChange={handleChange}
                    placeholder="e.g. राजगड ते तोरणा पदभ्रमण"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-slate-400 block mb-1 text-xs">Tagline / Brief Hook</label>
                  <input
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleChange}
                    placeholder="e.g. The King of Forts to the Citadel of Swarajya"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Categorization & Metrics */}
            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase text-xs tracking-wider text-orange-400">2. Categorization & Metrics</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 text-xs">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-orange-500"
                  >
                    <option value="Fort Expeditions">Fort Expeditions</option>
                    <option value="Weekend">Weekend</option>
                    <option value="High Altitude">High Altitude</option>
                    <option value="Monsoon">Monsoon</option>
                    <option value="Night Treks">Night Treks</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 text-xs">Difficulty</label>
                  <select
                    name="difficultyLevel"
                    value={formData.difficultyLevel}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-orange-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 text-xs">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 text-xs">Original Price (₹)</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 text-xs">Elevation</label>
                  <input
                    type="text"
                    name="elevation"
                    value={formData.elevation}
                    onChange={handleChange}
                    placeholder="e.g. 4,603 ft"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 text-xs">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="e.g. 2 Days / 1 Night"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 text-xs">Region</label>
                  <input
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    placeholder="e.g. Pune, Maharashtra"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 text-xs">Badge Text</label>
                  <input
                    type="text"
                    name="badge"
                    value={formData.badge}
                    onChange={handleChange}
                    placeholder="e.g. Most Popular"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Image Banner URL */}
            <div className="space-y-2">
              <label className="text-slate-400 block text-xs">Hero Image URL</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  name="heroImage"
                  value={formData.heroImage}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-orange-500"
                />
                {formData.heroImage && (
                  <img src={formData.heroImage} alt="preview" className="w-12 h-10 object-cover rounded-lg border border-slate-700" />
                )}
              </div>
            </div>

            {/* Batches & Capacity */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white uppercase text-xs tracking-wider text-orange-400">3. Departure Batches & Slots</h4>
                <button
                  type="button"
                  onClick={addBatch}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5 text-orange-400" />
                  <span>Add Batch</span>
                </button>
              </div>

              <div className="space-y-2">
                {formData.batches.map((batch, bIdx) => (
                  <div key={bIdx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center text-xs">
                    <div className="sm:col-span-5">
                      <input
                        type="text"
                        placeholder="Batch Date (e.g. Aug 29 - 30)"
                        value={batch.date}
                        onChange={(e) => updateBatch(bIdx, 'date', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <input
                        type="number"
                        placeholder="Total Slots"
                        value={batch.totalSeats}
                        onChange={(e) => updateBatch(bIdx, 'totalSeats', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <input
                        type="number"
                        placeholder="Booked"
                        value={batch.bookedSeats}
                        onChange={(e) => updateBatch(bIdx, 'bookedSeats', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
                      />
                    </div>
                    <div className="sm:col-span-1 text-center">
                      <button
                        type="button"
                        onClick={() => removeBatch(bIdx)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white uppercase text-xs tracking-wider text-orange-400">4. Highlights</h4>
                <button
                  type="button"
                  onClick={() => addArrayItem('highlights')}
                  className="text-xs text-orange-400 hover:text-orange-300 flex items-center space-x-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Highlight</span>
                </button>
              </div>
              {formData.highlights.map((hl, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={hl}
                    onChange={(e) => handleArrayItemChange('highlights', idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('highlights', idx)}
                    className="text-red-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Sticky Actions */}
            <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-md shadow-orange-600/30"
              >
                <Save className="w-4 h-4" />
                <span>Save Trek</span>
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
