import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Plus, 
  Trash2, 
  RefreshCw, 
  MapPin, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  X,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { fetchAdminGallery, createAdminGalleryPhoto, deleteAdminGalleryPhoto } from '../../services/api';

export default function GalleryManager() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newPhoto, setNewPhoto] = useState({
    imageUrl: '',
    caption: '',
    location: ''
  });

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminGallery();
      setPhotos(data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const handleDelete = async (id, caption) => {
    if (window.confirm(`Delete photo ${caption ? `"${caption}"` : ''}?`)) {
      try {
        setPhotos(prev => prev.filter(p => p.id !== id));
        await deleteAdminGalleryPhoto(id);
        await loadPhotos();
      } catch (err) {
        alert('Failed to delete photo: ' + err.message);
        await loadPhotos();
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
        setNewPhoto(prev => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPhoto.imageUrl.trim()) {
      alert('Please provide an Image URL or upload a photo');
      return;
    }

    try {
      await createAdminGalleryPhoto({
        imageUrl: newPhoto.imageUrl.trim(),
        caption: newPhoto.caption.trim() || 'Sahyadri Expedition Moment',
        location: newPhoto.location.trim() || 'Sahyadri Range'
      });
      setIsAdding(false);
      setNewPhoto({ imageUrl: '', caption: '', location: '' });
      await loadPhotos();
    } catch (err) {
      alert('Failed to save photo: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Camera className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white font-heading">
              Unfiltered Trail Moments Manager ({photos.length} Photos)
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Curate and manage raw expedition moments showcased on the public website homepage.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadPhotos}
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            title="Refresh Gallery"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-600/30 flex items-center space-x-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Trail Moment</span>
          </button>
        </div>
      </div>

      {/* Add Photo Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-2 text-white font-bold font-heading">
                  <Camera className="w-5 h-5 text-orange-400" />
                  <span>Add New Trail Moment Photo</span>
                </div>
                <button
                  onClick={() => setIsAdding(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image URL / Upload */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300">
                    Photo Source (Direct URL or Upload) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://images.unsplash.com/... or paste image URL"
                    value={newPhoto.imageUrl}
                    onChange={(e) => setNewPhoto({ ...newPhoto, imageUrl: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-orange-500"
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
                    <span className="text-[11px] text-slate-500">Supports JPG, PNG, WEBP, Unsplash</span>
                  </div>
                </div>

                {/* Live Preview Box */}
                <div className="w-full h-36 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-800 overflow-hidden relative flex items-center justify-center">
                  {newPhoto.imageUrl ? (
                    <div className="w-full h-full relative">
                      <img
                        src={newPhoto.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const errBox = e.currentTarget.parentElement?.querySelector('.img-err');
                          if (errBox) errBox.classList.remove('hidden');
                        }}
                        onLoad={(e) => {
                          e.currentTarget.style.display = 'block';
                          const errBox = e.currentTarget.parentElement?.querySelector('.img-err');
                          if (errBox) errBox.classList.add('hidden');
                        }}
                      />
                      <div className="img-err hidden w-full h-full absolute inset-0 bg-red-950/70 border border-red-800 flex flex-col items-center justify-center p-2 text-red-300 text-xs">
                        <AlertCircle className="w-5 h-5 mb-1 text-red-400" />
                        <span>Invalid or Broken Image Link</span>
                      </div>
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[10px] font-bold text-white border border-white/20">
                        Live Preview
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-600 text-xs space-y-1">
                      <ImageIcon className="w-6 h-6 text-slate-700" />
                      <span>No image preview available</span>
                    </div>
                  )}
                </div>

                {/* Caption & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Caption / Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sunrise above the clouds"
                      value={newPhoto.caption}
                      onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Location / Fort
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rajgad, Kalsubai, Torna"
                      value={newPhoto.location}
                      onChange={(e) => setNewPhoto({ ...newPhoto, location: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-lg shadow-orange-600/30"
                  >
                    Publish to Website
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Photos Grid */}
      {photos.length === 0 ? (
        <div className="text-center py-20 px-4 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mx-auto text-2xl">
            📷
          </div>
          <h3 className="text-lg font-bold text-white font-heading">No Trail Moments Added</h3>
          <p className="text-xs text-slate-400">
            Click "Add Trail Moment" above to upload or paste photos of summit views, camping nights, and ridge hikes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <motion.div
              key={photo.id}
              layout
              className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between"
            >
              {/* Image Preview */}
              <div className="relative h-48 overflow-hidden bg-slate-950">
                <img
                  src={photo.imageUrl}
                  alt={photo.caption || 'Trail Moment'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Location Badge */}
                {photo.location && (
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-md text-[10px] font-semibold text-orange-300 border border-slate-800 flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-orange-400" />
                    <span>{photo.location}</span>
                  </span>
                )}

                {/* Delete button on hover */}
                <button
                  onClick={() => handleDelete(photo.id, photo.caption)}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white shadow-lg opacity-90 group-hover:opacity-100 transition-opacity"
                  title="Delete Photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Caption Card */}
              <div className="p-3.5 bg-slate-900 border-t border-slate-800/80">
                <p className="text-xs font-bold text-white font-heading truncate">
                  {photo.caption || 'Trail Memory'}
                </p>
                <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                  <span className="font-mono">{photo.location || 'Sahyadri'}</span>
                  <span>{photo.createdAt ? new Date(photo.createdAt).toLocaleDateString() : 'Recent'}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
}
