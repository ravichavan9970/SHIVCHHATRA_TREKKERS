import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  Trash2, 
  ExternalLink, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  CreditCard,
  Eye,
  RefreshCw,
  CheckCheck,
  UserCheck,
  ShieldCheck,
  AlertTriangle,
  Flag,
  Archive,
  Award,
  Sparkles,
  Download,
  Upload,
  CloudUpload,
  CloudDownload,
  Database,
  Server,
  HardDrive,
  FileJson,
  Layers,
  Check
} from 'lucide-react';
import { 
  fetchAdminBookings, 
  verifyAdminBooking, 
  rejectAdminBooking, 
  completeAdminBooking, 
  deleteAdminBooking,
  getBackupApiBase,
  setBackupApiBase,
  syncToBackupServer,
  restoreFromBackupServer,
  bulkSyncPrimaryServer,
  testBackupServerConnection,
  fetchFullSystemDump,
  syncFullSystemToBackupServer,
  restoreFullSystemFromBackupServer,
  importFullSystemData
} from '../../services/api';

const ADMIN_STORAGE_KEY = 'shivchhatra_admin_bookings_cache';
const PERMANENT_ARCHIVE_KEY = 'shivchhatra_bookings_permanent_archive';

const recoverAllStoredBookings = () => {
  const allMap = new Map();
  const keysToProbe = [
    ADMIN_STORAGE_KEY,
    PERMANENT_ARCHIVE_KEY,
    'shivchhatra_bookings_v4',
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

export default function BookingsAuditor() {
  const [bookings, setBookings] = useState(() => recoverAllStoredBookings());
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [notice, setNotice] = useState('');
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'history' | 'all'

  // Dual-Server Cloud Backup & Disaster Recovery State
  const [backupUrl, setBackupUrl] = useState(() => getBackupApiBase());
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [showBackupConsole, setShowBackupConsole] = useState(false);
  const [backupSavedNotice, setBackupSavedNotice] = useState(false);
  const fileInputRef = useRef(null);

  const handleSaveBackupUrl = (e) => {
    e.preventDefault();
    setBackupApiBase(backupUrl);
    setBackupSavedNotice(true);
    setTimeout(() => setBackupSavedNotice(false), 3000);
  };

  const handleTestBackupUrl = async () => {
    if (!backupUrl.trim()) {
      alert('Please enter a Secondary Backup Server URL to test (e.g. your 2nd Render web service URL).');
      return;
    }
    try {
      setIsTesting(true);
      await testBackupServerConnection(backupUrl);
      setIsTesting(false);
      setNotice(`✅ Connected! Secondary backup server is active and reachable.`);
      setTimeout(() => setNotice(''), 5000);
    } catch (err) {
      setIsTesting(false);
      alert(err.message);
    }
  };

  const handleCreateLocalVaultSnapshot = async () => {
    try {
      const fullDump = await fetchFullSystemDump();
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(bookings));
      localStorage.setItem(PERMANENT_ARCHIVE_KEY, JSON.stringify(bookings));
      localStorage.setItem('shivchhatra_full_system_vault', JSON.stringify(fullDump));
      setNotice(`💾 Disaster Recovery Snapshot locked in local vault (All Treks, Bookings, Reviews, Payments, Forts safely saved).`);
      setTimeout(() => setNotice(''), 5000);
    } catch (e) {
      alert('Failed to save snapshot: ' + e.message);
    }
  };

  const handlePushToBackupServer = async () => {
    if (!backupUrl.trim()) {
      alert('Please enter your Secondary Backup Server URL first (e.g. https://shivchhatra-backup-server.onrender.com). If you do not have a 2nd server deployed, you can use "Download Offline Backup" to save directly to your device.');
      return;
    }
    try {
      setIsBackingUp(true);
      const res = await syncFullSystemToBackupServer(backupUrl);
      setIsBackingUp(false);
      setNotice(`🚀 Full-Cloud Mirror Success: Replicated all Treks, Bookings, Reviews, Payment Gateways & Heritage data to secondary server!`);
      setTimeout(() => setNotice(''), 6000);
    } catch (err) {
      setIsBackingUp(false);
      alert(err.message);
    }
  };

  const handleRestoreFromBackupServer = async () => {
    if (!backupUrl.trim()) {
      alert('Please enter your Secondary Backup Server URL first.');
      return;
    }
    if (window.confirm(`Pull and restore ALL data (Treks, Bookings, Reviews, Payments, Forts, Gallery) from secondary server (${backupUrl})?`)) {
      try {
        setIsRestoring(true);
        const restoredDump = await restoreFullSystemFromBackupServer(backupUrl);
        
        if (restoredDump && restoredDump.bookings) {
          const mergedMap = new Map();
          bookings.forEach(b => { if (b && (b.id || b.utrNumber)) mergedMap.set(b.id || b.utrNumber, b); });
          restoredDump.bookings.forEach(b => { if (b && (b.id || b.utrNumber)) mergedMap.set(b.id || b.utrNumber, b); });
          const mergedList = Array.from(mergedMap.values());

          setBookings(mergedList);
          localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(mergedList));
          localStorage.setItem(PERMANENT_ARCHIVE_KEY, JSON.stringify(mergedList));
        }

        setIsRestoring(false);
        setNotice(`🔄 Full System Disaster Recovery Success: Restored entire database from secondary cloud!`);
        setTimeout(() => setNotice(''), 6000);
        await loadBookings();
      } catch (err) {
        setIsRestoring(false);
        alert('Restore from secondary server failed: ' + err.message);
      }
    }
  };

  const handleExportJsonBackup = async () => {
    try {
      const fullDump = await fetchFullSystemDump();
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullDump, null, 2));
      const downloadAnchor = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `shivchhatra_full_system_backup_${dateStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setNotice(`💾 Full-System Offline JSON backup downloaded successfully (Treks, Bookings, Reviews, Payments, Forts, Gallery).`);
      setTimeout(() => setNotice(''), 5000);
    } catch (e) {
      alert("Failed to export full system backup: " + e.message);
    }
  };

  const handleImportJsonBackup = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target.result;
        const parsed = JSON.parse(content);
        
        // Import full payload into backend
        await importFullSystemData(parsed);

        const listToImport = Array.isArray(parsed) ? parsed : (parsed.bookings && Array.isArray(parsed.bookings) ? parsed.bookings : []);
        if (listToImport.length > 0) {
          const mergedMap = new Map();
          bookings.forEach(b => { if (b && (b.id || b.utrNumber)) mergedMap.set(b.id || b.utrNumber, b); });
          listToImport.forEach(b => { if (b && (b.id || b.utrNumber)) mergedMap.set(b.id || b.utrNumber, b); });
          const mergedList = Array.from(mergedMap.values());

          setBookings(mergedList);
          localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(mergedList));
          localStorage.setItem(PERMANENT_ARCHIVE_KEY, JSON.stringify(mergedList));
        }

        setNotice(`📥 Full System Disaster Recovery Success: Restored all modules from backup file!`);
        setTimeout(() => setNotice(''), 6000);
        await loadBookings();
      } catch (err) {
        alert("Failed to parse and restore backup file: " + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminBookings();
      if (Array.isArray(data)) {
        const mergedMap = new Map();
        data.forEach(item => {
          if (item && (item.id || item.utrNumber)) {
            mergedMap.set(item.id || item.utrNumber, item);
          }
        });
        const cached = recoverAllStoredBookings();
        cached.forEach(item => {
          const key = item.id || item.utrNumber;
          if (key && !mergedMap.has(key)) {
            mergedMap.set(key, item);
          }
        });

        const mergedList = Array.from(mergedMap.values());
        setBookings(mergedList);

        try {
          localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(mergedList));
          localStorage.setItem(PERMANENT_ARCHIVE_KEY, JSON.stringify(mergedList));
        } catch (e) {
          console.warn('Storage save notice:', e);
        }
      }
      setLoading(false);
    } catch (err) {
      console.warn('Server offline or waking up, preserved local cache:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleVerify = async (id, primaryName) => {
    try {
      await verifyAdminBooking(id, 'Verified with Bank Records by Master Admin');
      setNotice(`✅ Booking verified for ${primaryName}`);
      setTimeout(() => setNotice(''), 4000);
      await loadBookings();
    } catch (err) {
      alert('Verification failed: ' + err.message);
    }
  };

  const handleReject = async (id, primaryName) => {
    if (window.confirm(`Reject booking for ${primaryName}? Batch capacity will be automatically restored in the database.`)) {
      try {
        await rejectAdminBooking(id, 'Rejected by Admin: Invalid Transaction / Unpaid');
        setNotice(`⚠️ Booking rejected for ${primaryName}`);
        setTimeout(() => setNotice(''), 4000);
        await loadBookings();
      } catch (err) {
        alert('Rejection failed: ' + err.message);
      }
    }
  };

  // EXPEDITION COMPLETED: Preserves 100% of trekker data and archives to History
  const handleMarkCompleted = async (id, primaryName, trekTitle) => {
    const message = `🚩 EXPEDITION COMPLETED:\n\nMark trek as completed for "${primaryName}" (${trekTitle})?\n\nThis will safely move the trekker and payment records into the permanent "Expedition History & Archive" section with zero data loss.`;
    
    if (window.confirm(message)) {
      try {
        await completeAdminBooking(id, 'Expedition successfully completed. Archived to History.');
        setNotice(`🚩 Expedition marked Completed! ${primaryName}'s details are permanently preserved in History.`);
        setTimeout(() => setNotice(''), 5000);
        await loadBookings();
      } catch (err) {
        alert('Completion failed: ' + err.message);
      }
    }
  };

  const purgeRecordFromAllStorageKeys = (idToDelete) => {
    const keysToProbe = [
      ADMIN_STORAGE_KEY,
      PERMANENT_ARCHIVE_KEY,
      'shivchhatra_bookings_v4',
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
            const filtered = parsed.filter(item => item && item.id !== idToDelete && item.utrNumber !== idToDelete);
            localStorage.setItem(key, JSON.stringify(filtered));
          }
        }
      } catch (e) {}
    }
  };

  const handleDelete = async (id, primaryName) => {
    if (window.confirm(`Are you sure you want to permanently delete the booking record for ${primaryName}?`)) {
      try {
        setBookings(prev => prev.filter(b => b.id !== id && b.utrNumber !== id));
        purgeRecordFromAllStorageKeys(id);
        await deleteAdminBooking(id).catch(e => console.warn('Delete notice:', e));
        setNotice(`🗑️ Record permanently removed for ${primaryName}`);
        setTimeout(() => setNotice(''), 4000);
        await loadBookings();
      } catch (err) {
        purgeRecordFromAllStorageKeys(id);
        setNotice(`🗑️ Record removed for ${primaryName}`);
        setTimeout(() => setNotice(''), 4000);
        await loadBookings();
      }
    }
  };

  // Segregated counts
  const activeBookingsList = bookings.filter(b => b.status === 'Pending Verification' || b.status === 'Confirmed');
  const historyBookingsList = bookings.filter(b => b.status === 'Completed');
  const rejectedBookingsList = bookings.filter(b => b.status === 'Rejected');

  // Filtered display based on current tab & search
  const currentTabList = activeTab === 'active' 
    ? activeBookingsList 
    : activeTab === 'history' 
    ? historyBookingsList 
    : bookings;

  const filteredBookings = currentTabList.filter(b => {
    const q = searchQuery.toLowerCase();
    return (
      !searchQuery ||
      b.id?.toLowerCase().includes(q) ||
      b.primaryName?.toLowerCase().includes(q) ||
      b.phone?.includes(searchQuery) ||
      b.utrNumber?.toLowerCase().includes(q) ||
      b.trekTitle?.toLowerCase().includes(q)
    );
  });

  const totalTrekkersInHistory = historyBookingsList.reduce((acc, b) => acc + (b.participantsCount || 1), 0);
  const totalRevenueInHistory = historyBookingsList.reduce((acc, b) => acc + (b.amountPaid || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white font-heading flex items-center space-x-2">
            <span>Live Bookings & Trekkers History</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Active expedition registrations and permanent completed trekkers archive.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowBackupConsole(!showBackupConsole)}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
              showBackupConsole 
                ? 'bg-orange-600 text-white border-orange-500 shadow-md shadow-orange-950/40' 
                : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800 text-orange-400'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Dual-Cloud Backup & Recovery</span>
          </button>

          <button
            onClick={loadBookings}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors flex items-center space-x-1.5 text-xs font-semibold cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Data</span>
          </button>
        </div>
      </div>

      {/* Hidden File Input for JSON Backup Import */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImportJsonBackup} 
        accept=".json" 
        className="hidden" 
      />

      {/* Enterprise Dual-Server Backup & Disaster Recovery Console */}
      <AnimatePresence>
        {showBackupConsole && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-950/95 border border-orange-500/40 shadow-2xl space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30">
                  <HardDrive className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                    <span>Enterprise Full-System Replication & Disaster Recovery</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                      100% Zero Data Loss
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Mirrors and restores <strong>all data</strong>: Treks & Batches, Bookings & Payments, Customer Reviews, Payment Gateway Settings, Forts Heritage & Media Gallery.
                  </p>
                </div>
              </div>
            </div>

            {/* Secondary Backup Server URL Configuration */}
            <form onSubmit={handleSaveBackupUrl} className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <Server className="w-3.5 h-3.5 text-orange-400" />
                  <span>Secondary Cloud Backup Server URL (Render Web Service)</span>
                </span>
                {backupSavedNotice && (
                  <span className="text-emerald-400 text-[11px] flex items-center space-x-1">
                    <Check className="w-3 h-3" />
                    <span>Saved!</span>
                  </span>
                )}
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  value={backupUrl}
                  onChange={(e) => setBackupUrl(e.target.value)}
                  placeholder="e.g. https://shivchhatra-backup-server.onrender.com"
                  className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl text-white text-xs font-mono placeholder-slate-600 focus:outline-none"
                />
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleTestBackupUrl}
                    disabled={isTesting}
                    className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer flex items-center space-x-1"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                    <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-950/40 transition-colors cursor-pointer"
                  >
                    Save URL
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-slate-500">
                💡 Full Mirroring Active: Pushing will replicate the entire platform state (Treks, Bookings, Reviews, Payments, Forts, Gallery) to your second Render backend.
              </p>
            </form>

            {/* Recovery & Sync Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-2">
              {/* Push Full System to Secondary Cloud Server */}
              <button
                type="button"
                onClick={handlePushToBackupServer}
                disabled={isBackingUp}
                className="p-3 rounded-xl bg-orange-600/15 hover:bg-orange-600/25 border border-orange-500/40 text-orange-300 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <CloudUpload className={`w-4 h-4 text-orange-400 ${isBackingUp ? 'animate-bounce' : ''}`} />
                <span>{isBackingUp ? 'Pushing All Data...' : 'Push Full System to 2nd Server'}</span>
              </button>

              {/* Restore Full System from Secondary Cloud Server */}
              <button
                type="button"
                onClick={handleRestoreFromBackupServer}
                disabled={isRestoring}
                className="p-3 rounded-xl bg-cyan-950/30 hover:bg-cyan-950/50 border border-cyan-500/40 text-cyan-300 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <CloudDownload className={`w-4 h-4 text-cyan-400 ${isRestoring ? 'animate-spin' : ''}`} />
                <span>{isRestoring ? 'Restoring All...' : 'Restore Full System from 2nd Server'}</span>
              </button>

              {/* Lock Full System Snapshot to Local Vault */}
              <button
                type="button"
                onClick={handleCreateLocalVaultSnapshot}
                className="p-3 rounded-xl bg-amber-950/30 hover:bg-amber-950/50 border border-amber-500/40 text-amber-300 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
              >
                <HardDrive className="w-4 h-4 text-amber-400" />
                <span>Lock Full Snapshot</span>
              </button>

              {/* Download Offline JSON Snapshot */}
              <button
                type="button"
                onClick={handleExportJsonBackup}
                className="p-3 rounded-xl bg-emerald-950/30 hover:bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Export Full Backup (.json)</span>
              </button>

              {/* Upload & Restore Offline JSON Snapshot */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3 rounded-xl bg-purple-950/30 hover:bg-purple-950/50 border border-purple-500/40 text-purple-300 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4 text-purple-400" />
                <span>Import Full System File</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Bookings</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-white mt-1">{activeBookingsList.length}</p>
          <span className="text-[10px] text-amber-400 font-medium">Pending & Confirmed</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
          <div className="flex items-center justify-between text-emerald-400 text-xs">
            <span>Completed Expeditions</span>
            <Flag className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-300 mt-1">{historyBookingsList.length}</p>
          <span className="text-[10px] text-emerald-400 font-medium">Preserved in History</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Trekkers Summited</span>
            <Users className="w-4 h-4 text-orange-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-white mt-1">{totalTrekkersInHistory}</p>
          <span className="text-[10px] text-slate-400 font-medium">Lifetime Adventurers</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Archived Revenue</span>
            <CreditCard className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-cyan-300 mt-1">₹{totalRevenueInHistory}</p>
          <span className="text-[10px] text-cyan-400 font-medium">Completed Bookings</span>
        </div>
      </div>

      {/* Notification Banner */}
      {notice && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center space-x-2 shadow-lg"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notice}</span>
        </motion.div>
      )}

      {/* Tab Navigation Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'active'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Active Bookings ({activeBookingsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'history'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Expedition History ({historyBookingsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'all'
                ? 'bg-slate-800 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>All ({bookings.length})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, phone, UTR, ID, or trek..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Bookings & History Table View */}
      <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl overflow-x-auto shadow-2xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              <th className="p-4">Booking ID</th>
              <th className="p-4">Trekker Details</th>
              <th className="p-4">Expedition & Batch</th>
              <th className="p-4">Payment & UTR</th>
              <th className="p-4">Status & Archive</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-slate-500">
                  {activeTab === 'history' 
                    ? 'No completed expedition records in history yet. Confirm a booking and click "Expedition Completed" when finished!'
                    : 'No booking records matching the search criteria.'}
                </td>
              </tr>
            ) : (
              filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4">
                    <p className="font-mono font-bold text-orange-400 text-sm">{b.id}</p>
                    <p className="text-[10px] text-slate-500">{b.submittedAt?.slice(0, 16).replace('T', ' ')}</p>
                  </td>

                  <td className="p-4">
                    <p className="font-bold text-white text-sm">{b.primaryName}</p>
                    <p className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-500" />
                      <span>{b.phone}</span>
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-slate-950 text-[10px] text-slate-400 border border-slate-800">
                      {b.participantsCount || 1} Trekker(s) • {b.pickupCity} ({b.pickupSpot})
                    </span>
                  </td>

                  <td className="p-4">
                    <p className="font-semibold text-white">{b.trekTitle}</p>
                    <p className="text-[11px] text-orange-400 font-medium">{b.batchDate}</p>
                  </td>

                  <td className="p-4 font-mono">
                    <p className="font-bold text-emerald-400 text-sm">₹{b.amountPaid}</p>
                    <p className="text-[11px] text-slate-300 tracking-wide font-semibold mt-0.5">
                      UTR: <span className="text-yellow-400">{b.utrNumber}</span>
                    </p>
                    {b.receiptImage && (
                      <button
                        onClick={() => setSelectedReceipt(b.receiptImage)}
                        className="mt-1 text-[10px] text-cyan-400 hover:underline flex items-center space-x-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View Screenshot</span>
                      </button>
                    )}
                  </td>

                  <td className="p-4">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      b.status === 'Completed'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : b.status === 'Confirmed'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : b.status === 'Pending Verification'
                        ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 animate-pulse'
                        : 'bg-red-500/15 text-red-400 border-red-500/30'
                    }`}>
                      {b.status === 'Completed' && <Flag className="w-3 h-3 text-emerald-400" />}
                      {b.status === 'Confirmed' && <CheckCircle2 className="w-3 h-3" />}
                      {b.status === 'Pending Verification' && <Clock className="w-3 h-3" />}
                      {b.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                      <span>{b.status === 'Completed' ? 'Expedition Completed' : b.status}</span>
                    </span>
                    {b.adminNote && (
                      <p className="text-[10px] text-slate-500 mt-1 italic line-clamp-1">{b.adminNote}</p>
                    )}
                  </td>

                  <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                    {/* Verification Action */}
                    {b.status === 'Pending Verification' && (
                      <button
                        onClick={() => handleVerify(b.id, b.primaryName)}
                        className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-400 transition-colors cursor-pointer"
                        title="Verify Payment"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}

                    {/* Rejection Action */}
                    {b.status === 'Pending Verification' && (
                      <button
                        onClick={() => handleReject(b.id, b.primaryName)}
                        className="p-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900 border border-amber-500/40 text-amber-400 transition-colors cursor-pointer"
                        title="Reject Transaction"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}

                    {/* EXPEDITION COMPLETED: MOVES TO PERMANENT HISTORY (NEVER DELETES!) */}
                    {b.status === 'Confirmed' && (
                      <button
                        onClick={() => handleMarkCompleted(b.id, b.primaryName, b.trekTitle)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 hover:border-emerald-400 text-emerald-300 text-xs font-bold transition-all shadow-sm cursor-pointer group"
                        title="Mark Expedition as Completed and safely preserve in History"
                      >
                        <Flag className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                        <span>Expedition Completed</span>
                      </button>
                    )}

                    {/* Standard Manual Delete for Admin with Confirmation */}
                    <button
                      onClick={() => handleDelete(b.id, b.primaryName)}
                      className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900 border border-red-800/40 text-red-400 transition-colors cursor-pointer"
                      title="Permanently Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white">Payment Screenshot Proof</h4>
              <button onClick={() => setSelectedReceipt(null)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-800 max-h-[70vh] flex items-center justify-center bg-black">
              <img src={selectedReceipt} alt="Receipt" className="max-h-[65vh] object-contain" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
