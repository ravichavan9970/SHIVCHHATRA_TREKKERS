import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Mountain, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  RefreshCw, 
  X, 
  Upload, 
  AlertCircle, 
  Check, 
  Info,
  Castle,
  Landmark,
  Image as ImageIcon
} from 'lucide-react';
import { fetchAdminForts, createAdminFort, updateAdminFort, deleteAdminFort } from '../../services/api';

export default function FortHeritageManager() {
  const [forts, setForts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFort, setCurrentFort] = useState(null);
  const [structureInput, setStructureInput] = useState('');

  const loadForts = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminForts();
      setForts(data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForts();
  }, []);

  const handleAddNew = () => {
    setCurrentFort({
      id: 'fort-' + Date.now(),
      name: '',
      title: '',
      significance: '',
      altitude: '3,500 ft / 1,066 m',
      difficulty: 'Moderate',
      baseVillage: '',
      bestSeason: 'July to February',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80',
      keyStructures: ['Main Entrance (Mahadarwaja)', 'Ballekilla Citadel', 'Water Cisterns (Devtaki)'],
      historySnippet: ''
    });
    setIsEditing(true);
  };

  const handleEdit = (fort) => {
    setCurrentFort({
      ...fort,
      keyStructures: Array.isArray(fort.keyStructures) ? [...fort.keyStructures] : []
    });
    setIsEditing(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete fort: ${name}?`)) {
      try {
        setForts(prev => prev.filter(f => f.id !== id));
        await deleteAdminFort(id);
        await loadForts();
      } catch (err) {
        alert('Failed to delete fort: ' + err.message);
        await loadForts();
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentFort(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addStructure = () => {
    if (!structureInput.trim()) return;
    setCurrentFort(prev => ({
      ...prev,
      keyStructures: [...(prev.keyStructures || []), structureInput.trim()]
    }));
    setStructureInput('');
  };

  const removeStructure = (idx) => {
    setCurrentFort(prev => ({
      ...prev,
      keyStructures: prev.keyStructures.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentFort.name.trim()) {
      alert('Fort Name is required');
      return;
    }

    try {
      const exists = forts.some(f => f.id === currentFort.id);
      if (exists) {
        await updateAdminFort(currentFort.id, currentFort);
      } else {
        await createAdminFort(currentFort);
      }
      setIsEditing(false);
      setCurrentFort(null);
      await loadForts();
    } catch (err) {
      alert('Failed to save fort: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Landmark className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white font-heading">
              Shivkalin Fort Heritage Manager ({forts.length} Sacred Forts)
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Publish and edit historical lore, architecture bastions, elevations, and guides for sacred forts of Chhatrapati Shivaji Maharaj.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadForts}
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            title="Refresh Forts"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleAddNew}
            className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-600/30 flex items-center space-x-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Sacred Fort</span>
          </button>
        </div>
      </div>

      {/* Forts Grid */}
      {forts.length === 0 ? (
        <div className="text-center py-20 px-4 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mx-auto text-2xl">
            🚩
          </div>
          <h3 className="text-lg font-bold text-white font-heading">No Forts in Database</h3>
          <p className="text-xs text-slate-400">
            Click "Add Sacred Fort" above to create an entry for a heritage fort.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forts.map((fort) => (
            <motion.div
              key={fort.id}
              layout
              className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-orange-500/50 transition-colors"
            >
              <div>
                {/* Photo Banner */}
                <div className="relative h-48 bg-slate-950 overflow-hidden">
                  <img
                    src={fort.image}
                    alt={fort.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                  
                  {/* Elevation & Difficulty Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950/90 backdrop-blur-md text-[11px] font-bold text-orange-300 border border-slate-800 font-mono">
                      {fort.altitude?.split('/')[0] || fort.altitude}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950/90 backdrop-blur-md text-[10px] font-semibold text-slate-300 border border-slate-800">
                      {fort.difficulty}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-lg font-black text-white font-heading truncate">
                      {fort.name}
                    </h3>
                    <p className="text-xs text-orange-400 font-semibold truncate">
                      {fort.title}
                    </p>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-4 text-xs">
                  <p className="text-slate-300 line-clamp-3 leading-relaxed">
                    {fort.significance}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 py-2 border-y border-slate-800/80">
                    <div className="flex items-center space-x-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                      <span className="truncate">{fort.baseVillage || 'Sahyadri'}</span>
                    </div>
                    <div className="flex items-center space-x-1 truncate">
                      <Calendar className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                      <span className="truncate">{fort.bestSeason || 'Oct to Feb'}</span>
                    </div>
                  </div>

                  {/* Key Structures */}
                  {fort.keyStructures && fort.keyStructures.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Key Bastions & Landmarks</span>
                      <div className="flex flex-wrap gap-1">
                        {fort.keyStructures.slice(0, 3).map((st, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] text-slate-300">
                            {st}
                          </span>
                        ))}
                        {fort.keyStructures.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-slate-950 text-[10px] text-orange-400">
                            +{fort.keyStructures.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => handleEdit(fort)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-orange-400" />
                  <span>Edit Info</span>
                </button>

                <button
                  onClick={() => handleDelete(fort.id, fort.name)}
                  className="p-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
                  title="Delete Fort"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit / Add Modal */}
      <AnimatePresence>
        {isEditing && currentFort && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-2.5">
                  <Landmark className="w-5 h-5 text-orange-400" />
                  <h3 className="text-lg font-bold text-white font-heading">
                    {forts.some(f => f.id === currentFort.id) ? `Edit: ${currentFort.name}` : 'Add New Sacred Fort'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                {/* Fort Name & Subtitle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">
                      Fort Name & Marathi Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pratapgad (प्रतापगड)"
                      value={currentFort.name}
                      onChange={(e) => setCurrentFort({ ...currentFort, name: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">
                      Historical Subtitle / Tagline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. The Valour Fort of Afzal Khan Victory (शौर्यदुर्ग)"
                      value={currentFort.title}
                      onChange={(e) => setCurrentFort({ ...currentFort, title: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Significance / Overview */}
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Historical Significance & Strategic Importance *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe Shivaji Maharaj's history, construction, battles, and significance..."
                    value={currentFort.significance}
                    onChange={(e) => setCurrentFort({ ...currentFort, significance: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white leading-relaxed focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Quote / History Snippet */}
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Historical Quote / Battle Lore
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. 'Shivaji Maharaj considered Rajgad the most impregnable fort in Hindustan...'"
                    value={currentFort.historySnippet}
                    onChange={(e) => setCurrentFort({ ...currentFort, historySnippet: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white italic focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Elevation, Difficulty, Base, Season */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Elevation / Height</label>
                    <input
                      type="text"
                      placeholder="4,514 ft / 1,376 m"
                      value={currentFort.altitude}
                      onChange={(e) => setCurrentFort({ ...currentFort, altitude: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Difficulty</label>
                    <input
                      type="text"
                      placeholder="Moderate to Hard"
                      value={currentFort.difficulty}
                      onChange={(e) => setCurrentFort({ ...currentFort, difficulty: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Base Village</label>
                    <input
                      type="text"
                      placeholder="Gunjavane / Pali (Pune)"
                      value={currentFort.baseVillage}
                      onChange={(e) => setCurrentFort({ ...currentFort, baseVillage: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Best Season</label>
                    <input
                      type="text"
                      placeholder="July to February"
                      value={currentFort.bestSeason}
                      onChange={(e) => setCurrentFort({ ...currentFort, bestSeason: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                </div>

                {/* Fort Image Source & Live Preview */}
                <div className="space-y-2">
                  <label className="block font-bold text-slate-300">
                    Fort Image (URL or Upload)
                  </label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/... or paste image link"
                    value={currentFort.image}
                    onChange={(e) => setCurrentFort({ ...currentFort, image: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs"
                  />
                  <div className="flex items-center space-x-2">
                    <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center space-x-1.5 transition-all">
                      <Upload className="w-3.5 h-3.5 text-orange-400" />
                      <span>Upload Local Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[11px] text-slate-500">Auto-converts to high-res CLOB storage</span>
                  </div>

                  {/* Preview Thumbnail */}
                  <div className="h-32 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden relative flex items-center justify-center mt-2">
                    {currentFort.image ? (
                      <img
                        src={currentFort.image}
                        alt="Fort Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-slate-600">No Image Specified</span>
                    )}
                  </div>
                </div>

                {/* Key Structures / Bastions Manager */}
                <div className="space-y-2">
                  <label className="block font-bold text-slate-300">
                    Key Historical Structures & Bastions
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="e.g. Suvela Machi & Nedhe (Rock Needle)"
                      value={structureInput}
                      onChange={(e) => setStructureInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addStructure(); }}}
                      className="flex-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                    <button
                      type="button"
                      onClick={addStructure}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-orange-400 font-bold rounded-xl border border-slate-700"
                    >
                      Add Landmark
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(currentFort.keyStructures || []).map((st, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-white flex items-center space-x-1.5"
                      >
                        <span>{st}</span>
                        <button
                          type="button"
                          onClick={() => removeStructure(idx)}
                          className="text-slate-400 hover:text-red-400"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold shadow-lg shadow-orange-600/30"
                  >
                    Save Fort Details
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
