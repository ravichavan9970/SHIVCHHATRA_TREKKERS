import React, { useState, useEffect } from 'react';
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
  Flag
} from 'lucide-react';
import { fetchAdminBookings, verifyAdminBooking, rejectAdminBooking, deleteAdminBooking } from '../../services/api';

export default function BookingsAuditor() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [purgeNotice, setPurgeNotice] = useState('');

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminBookings();
      setBookings(data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleVerify = async (id, primaryName) => {
    try {
      await verifyAdminBooking(id, 'Verified with Bank Records by Master Admin');
      await loadBookings();
    } catch (err) {
      alert('Verification failed: ' + err.message);
    }
  };

  const handleReject = async (id, primaryName) => {
    if (window.confirm(`Reject booking for ${primaryName}? Batch capacity will be automatically restored in the database.`)) {
      try {
        await rejectAdminBooking(id, 'Rejected by Admin: Invalid Transaction / Unpaid');
        await loadBookings();
      } catch (err) {
        alert('Rejection failed: ' + err.message);
      }
    }
  };

  // TRIP DONE: Permanently purge trekker data from servers
  const handleTripDoneAndPurge = async (id, primaryName, trekTitle) => {
    const message = `🏁 TRIP COMPLETED CONFIRMATION:\n\nAre you sure the trek is completed for "${primaryName}" (${trekTitle})?\n\nClicking OK will PERMANENTLY DELETE all personal details, contact number, payment screenshots, and booking records for this trekker from the database servers for privacy compliance.`;
    
    if (window.confirm(message)) {
      try {
        setBookings(prev => prev.filter(b => b.id !== id));
        await deleteAdminBooking(id);
        setPurgeNotice(`✅ Trip marked Done! All server data for ${primaryName} has been permanently deleted.`);
        setTimeout(() => setPurgeNotice(''), 5000);
        await loadBookings();
      } catch (err) {
        alert('Data purge failed: ' + err.message);
        await loadBookings();
      }
    }
  };

  const handleDelete = async (id, primaryName) => {
    if (window.confirm(`Delete booking record for ${primaryName}?`)) {
      try {
        setBookings(prev => prev.filter(b => b.id !== id));
        await deleteAdminBooking(id);
        await loadBookings();
      } catch (err) {
        alert('Delete failed: ' + err.message);
        await loadBookings();
      }
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.primaryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone?.includes(searchQuery) ||
      b.utrNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.trekTitle?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white font-heading">
            Live Booking Audits & Payments Roster ({bookings.length} Total)
          </h3>
          <p className="text-xs text-slate-400">
            Real-time registration transactions and 12-digit UTR anti-fraud tracking.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={loadBookings}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors flex items-center space-x-1.5 text-xs font-semibold cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Success Purge Notification Banner */}
      {purgeNotice && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center space-x-2 shadow-lg"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{purgeNotice}</span>
        </motion.div>
      )}

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Trekker Name, Phone, UTR, Booking ID, or Trek..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="All">All Statuses ({bookings.length})</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending Verification">Pending Verification</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Bookings Table View */}
      <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl overflow-x-auto shadow-2xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              <th className="p-4">Booking ID</th>
              <th className="p-4">Trekker Details</th>
              <th className="p-4">Expedition & Batch</th>
              <th className="p-4">Payment & UTR</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions & Trip Completion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-10 text-center text-slate-500">
                  No booking records matching the search criteria.
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
                      b.status === 'Confirmed'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : b.status === 'Pending Verification'
                        ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 animate-pulse'
                        : 'bg-red-500/15 text-red-400 border-red-500/30'
                    }`}>
                      {b.status === 'Confirmed' && <CheckCircle2 className="w-3 h-3" />}
                      {b.status === 'Pending Verification' && <Clock className="w-3 h-3" />}
                      {b.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                      <span>{b.status}</span>
                    </span>
                    {b.adminNote && (
                      <p className="text-[10px] text-slate-500 mt-1 italic line-clamp-1">{b.adminNote}</p>
                    )}
                  </td>

                  <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                    {/* Verification Action */}
                    {b.status !== 'Confirmed' && (
                      <button
                        onClick={() => handleVerify(b.id, b.primaryName)}
                        className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-400 transition-colors cursor-pointer"
                        title="Verify Payment"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}

                    {/* Rejection Action */}
                    {b.status !== 'Rejected' && (
                      <button
                        onClick={() => handleReject(b.id, b.primaryName)}
                        className="p-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900 border border-amber-500/40 text-amber-400 transition-colors cursor-pointer"
                        title="Reject Transaction"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}

                    {/* TRIP DONE & PURGE SERVER DATA BUTTON */}
                    <button
                      onClick={() => handleTripDoneAndPurge(b.id, b.primaryName, b.trekTitle)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-orange-950/80 hover:bg-orange-900 border border-orange-500/50 hover:border-orange-400 text-orange-300 text-xs font-bold transition-all shadow-sm cursor-pointer group"
                      title="Mark Trip as Done and permanently purge trekker data from servers"
                    >
                      <Flag className="w-3.5 h-3.5 text-orange-400 group-hover:scale-110 transition-transform" />
                      <span>Trip Done (Purge Data)</span>
                    </button>

                    {/* Standard Delete */}
                    <button
                      onClick={() => handleDelete(b.id, b.primaryName)}
                      className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900 border border-red-800/40 text-red-400 transition-colors cursor-pointer"
                      title="Delete Record"
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
