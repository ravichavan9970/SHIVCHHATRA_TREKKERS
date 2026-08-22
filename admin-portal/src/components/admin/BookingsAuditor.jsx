import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  RefreshCw
} from 'lucide-react';
import { fetchAdminBookings, verifyAdminBooking, rejectAdminBooking, deleteAdminBooking } from '../../services/api';

export default function BookingsAuditor() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

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
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors"
            title="Refresh Bookings"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, Name, Phone, UTR..."
              className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 w-64"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
          >
            <option value="All">All Statuses</option>
            <option value="Pending Verification">Pending Verification</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-800 font-heading">
            <tr>
              <th className="p-4">Pass ID & Date</th>
              <th className="p-4">Lead Trekker</th>
              <th className="p-4">Trek & Batch</th>
              <th className="p-4">Amount & UTR Reference</th>
              <th className="p-4">Verification Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredBookings.map((b) => (
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
                      className="mt-1 text-[10px] text-cyan-400 hover:underline flex items-center space-x-1"
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
                  {b.status !== 'Confirmed' && (
                    <button
                      onClick={() => handleVerify(b.id, b.primaryName)}
                      className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-400 transition-colors"
                      title="Verify Payment"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}

                  {b.status !== 'Rejected' && (
                    <button
                      onClick={() => handleReject(b.id, b.primaryName)}
                      className="p-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900 border border-amber-500/40 text-amber-400 transition-colors"
                      title="Reject Transaction"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(b.id, b.primaryName)}
                    className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900 text-red-400 transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white">Payment Screenshot Proof</h4>
              <button onClick={() => setSelectedReceipt(null)} className="text-slate-400 hover:text-white">✕</button>
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
