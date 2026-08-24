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
  Pencil,
  Image as ImageIcon
} from 'lucide-react';
import { 
  fetchAdminGallery, 
  createAdminGalleryPhoto, 
  updateAdminGalleryPhoto, 
  deleteAdminGalleryPhoto 
} from '../../services/api';

export default function GalleryManager() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notice, setNotice] = useState('');
  
  const [newPhoto, setNewPhoto] = useState({
    imageUrl: '',
    caption: '',
    location: ''
  });

  const [editingPhoto, setEditingPhoto] = useState({
    id: '',
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
        setNotice('🗑️ Photo removed successfully');
        setTimeout(() => setNotice(''), 4000);
        await loadPhotos();
      } catch (err) {
        alert('Failed to delete photo: ' + err.message);
        await loadPhotos();
      }
    }
  };

  const handleEditClick = (photo) => {
    setEditingPhoto({
      id: photo.id,
      imageUrl: photo.imageUrl || '',
      caption: photo.caption || '',
      location: photo.location || ''
    });
    setIsEditing(true);
  };

  const handleFileUpload = (e, target = 'new') => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (target === 'edit') {
          setEditingPhoto(prev => ({ ...prev, imageUrl: reader.result }));
        } else {
          setNewPhoto(prev => ({ ...prev, imageUrl: reader.result }));
        }
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
      setNotice('✨ Trail moment added to public gallery!');
      setTimeout(() => setNotice(''), 4000);
      await loadPhotos();
    } catch (err) {
      alert('Failed to save photo: ' + err.message);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingPhoto.id || !editingPhoto.imageUrl.trim()) {
      alert('Please provide an Image URL or upload a photo');
      return;
    }

    try {
      await updateAdminGalleryPhoto(editingPhoto.id, {
        imageUrl: editingPhoto.imageUrl.trim(),
        caption: editingPhoto.caption.trim() || 'Sahyadri Expedition Moment',
        location: editingPhoto.location.trim() || 'Sahyadri Range'
      });
      setIsEditing(false);
      setNotice('✅ Photo info updated successfully!');
      setTimeout(() => setNotice(''), 4000);
      await loadPhotos();
    } catch (err) {
      alert('Failed to update photo: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Notice Banner */}
      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 rounded-2xl bg-orange-950/70 border border-orange-700/50 text-orange-200 text-xs font-semibold flex items-center justify-between shadow-lg"
          >
            <span>{notice}</span>
            <button onClick={() => setNotice('')} className="p-1 hover:text-white"><X className="w-3.5 h-3.5" /></button>
          </motion.div>
        )}
      </AnimatePresence>

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
            Curate, edit, and manage raw expedition moments showcased on the public website homepage.
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
                        onChange={(e) => handleFileUpload(e, 'new')}
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
                      />
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

      {/* Edit Photo Info Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-2 text-white font-bold font-heading">
                  <Pencil className="w-5 h-5 text-amber-400" />
                  <span>Edit Trail Moment Info</span>
                </div>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300">
                    Photo Source (Direct URL or Upload Replacement) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://images.unsplash.com/... or paste image URL"
                    value={editingPhoto.imageUrl}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, imageUrl: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-orange-500"
                  />

                  <div className="flex items-center space-x-2">
                    <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center space-x-1.5 transition-all">
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>Upload Replacement Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'edit')}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[11px] text-slate-500">Supports JPG, PNG, WEBP</span>
                  </div>
                </div>

                {/* Live Preview Box */}
                <div className="w-full h-36 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-800 overflow-hidden relative flex items-center justify-center">
                  {editingPhoto.imageUrl ? (
                    <div className="w-full h-full relative">
                      <img
                        src={editingPhoto.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-amber-500/30">
                        Updated Preview
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
                      placeholder="e.g. Sunrise at Kalsubai Summit"
                      value={editingPhoto.caption}
                      onChange={(e) => setEditingPhoto({ ...editingPhoto, caption: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Location / Fort
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rajgad Fort, Pune"
                      value={editingPhoto.location}
                      onChange={(e) => setEditingPhoto({ ...editingPhoto, location: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-600/30 flex items-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Changes</span>
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
              className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-slate-700 shadow-xl flex flex-col justify-between transition-all"
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

                {/* Action Buttons Overlay: Edit Info + Delete */}
                <div className="absolute top-2.5 right-2.5 flex items-center space-x-1.5">
                  <button
                    onClick={() => handleEditClick(photo)}
                    className="p-1.5 rounded-lg bg-slate-950/90 hover:bg-amber-600 text-amber-300 hover:text-white border border-slate-700/80 hover:border-amber-500 shadow-lg transition-all cursor-pointer"
                    title="Edit Info (Caption, Location, Photo)"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(photo.id, photo.caption)}
                    className="p-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white shadow-lg opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Caption Card & Edit Action */}
              <div className="p-3.5 bg-slate-900 border-t border-slate-800/80 space-y-2">
                <div>
                  <p className="text-xs font-bold text-white font-heading truncate">
                    {photo.caption || 'Trail Memory'}
                  </p>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                    <span className="font-mono text-orange-400/90">{photo.location || 'Sahyadri'}</span>
                    <span>{photo.createdAt ? new Date(photo.createdAt).toLocaleDateString() : 'Recent'}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                  <button
                    onClick={() => handleEditClick(photo)}
                    className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>Edit Info</span>
                  </button>
                  <button
                    onClick={() => handleDelete(photo.id, photo.caption)}
                    className="text-[11px] font-semibold text-red-400/70 hover:text-red-400 flex items-center space-x-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
}
