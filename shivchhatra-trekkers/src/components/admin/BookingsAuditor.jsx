import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Search, 
  Download, 
  Eye, 
  Clock, 
  FileText, 
  ExternalLink,
  Phone,
  Mail,
  User,
  X,
  Flag,
  Archive,
  Users,
  CreditCard
} from 'lucide-react';
import { useBookings } from '../../context/BookingContext';

export default function BookingsAuditor() {
  const { bookings, verifyBooking, completeBooking, rejectBooking, deleteBooking } = useBookings();
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'history' | 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReceiptModal, setActiveReceiptModal] = useState(null);

  // Segregated counts
  const activeBookingsList = bookings.filter(b => b.status === 'Pending Verification' || b.status === 'Confirmed');
  const historyBookingsList = bookings.filter(b => b.status === 'Completed');

  const currentTabList = activeTab === 'active'
    ? activeBookingsList
    : activeTab === 'history'
    ? historyBookingsList
    : bookings;

  const filteredBookings = currentTabList.filter(b => {
    const q = searchQuery.toLowerCase();
    return !searchQuery ||
      b.id.toLowerCase().includes(q) ||
      b.primaryName.toLowerCase().includes(q) ||
      b.phone.includes(q) ||
      b.trekTitle.toLowerCase().includes(q) ||
      (b.utrNumber && b.utrNumber.toLowerCase().includes(q));
  });

  const getStatusBadge = (status) => {
    if (status === 'Completed') {
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
    if (status === 'Confirmed') {
      return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    }
    if (status === 'Pending Verification') {
      return 'bg-amber-500/15 text-amber-400 border-amber-500/30 animate-pulse';
    }
    return 'bg-red-500/15 text-red-400 border-red-500/30';
  };

  // Export Roster as CSV
  const handleExportCSV = () => {
    const headers = ["Booking ID", "Trek Title", "Batch Date", "Primary Name", "Phone", "Email", "Emergency Phone", "Pickup City", "Pickup Spot", "Trekkers Count", "Amount Paid", "UTR Number", "Status", "Submitted At"];
    const rows = filteredBookings.map(b => [
      `"${b.id}"`,
      `"${b.trekTitle}"`,
      `"${b.batchDate}"`,
      `"${b.primaryName}"`,
      `"${b.phone}"`,
      `"${b.email || ''}"`,
      `"${b.emergencyPhone || ''}"`,
      `"${b.pickupCity}"`,
      `"${b.pickupSpot}"`,
      b.participantsCount,
      b.amountPaid,
      `"${b.utrNumber || ''}"`,
      `"${b.status}"`,
      `"${b.submittedAt}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Shivchhatra_Trekkers_Roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white font-heading">
            Participant Bookings & Trekkers History ({bookings.length} Total)
          </h3>
          <p className="text-xs text-slate-400">
            Active expedition registrations and permanent completed trekkers archive.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-sm transition-all self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export Trek Roster (CSV)</span>
        </button>
      </div>

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

      {/* Bookings Table */}
      <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/50 backdrop-blur-sm">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-4">Pass ID</th>
              <th className="p-4">Trekker Details</th>
              <th className="p-4">Trek & Batch</th>
              <th className="p-4">Payment & UTR</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  {activeTab === 'history'
                    ? 'No completed expeditions in history yet.'
                    : 'No bookings matching search criteria.'}
                </td>
              </tr>
            ) : filteredBookings.map((b) => (
              <tr key={b.id} className="hover:bg-slate-800/30 transition-colors">
                
                {/* ID & Date */}
                <td className="p-4">
                  <span className="font-mono font-bold text-orange-400">{b.id}</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {new Date(b.submittedAt).toLocaleString()}
                  </p>
                </td>

                {/* Primary User & Contact */}
                <td className="p-4">
                  <div className="font-bold text-white text-sm flex items-center space-x-1.5">
                    <span>{b.primaryName}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 space-y-0.5 mt-0.5">
                    <p className="flex items-center space-x-1">
                      <Phone className="w-3 h-3 text-slate-500" />
                      <span>{b.phone}</span>
                    </p>
                    <p className="text-slate-500 text-[10px]">
                      {b.participantsCount} Trekker(s) • Pickup: {b.pickupCity} ({b.pickupSpot})
                    </p>
                  </div>
                </td>

                {/* Trek Details */}
                <td className="p-4">
                  <p className="font-semibold text-white">{b.trekTitle}</p>
                  <p className="text-[11px] text-orange-400/90 font-mono mt-0.5">
                    {b.batchDate}
                  </p>
                </td>

                {/* Payment & UTR */}
                <td className="p-4">
                  <div className="font-mono font-bold text-emerald-400">
                    ₹{b.amountPaid}
                  </div>
                  <div className="text-[11px] font-mono text-slate-300 mt-0.5">
                    UTR: <span className="text-amber-400">{b.utrNumber || 'N/A'}</span>
                  </div>
                  {b.receiptImage && (
                    <button
                      onClick={() => setActiveReceiptModal(b.receiptImage)}
                      className="mt-1 text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View Screenshot</span>
                    </button>
                  )}
                </td>

                {/* Status Badge */}
                <td className="p-4">
                  <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(b.status)}`}>
                    {b.status === 'Completed' && <Flag className="w-3 h-3 text-emerald-400" />}
                    {b.status === 'Confirmed' && <CheckCircle2 className="w-3 h-3" />}
                    {b.status === 'Pending Verification' && <Clock className="w-3 h-3" />}
                    {b.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                    <span>{b.status === 'Completed' ? 'Expedition Completed' : b.status}</span>
                  </span>
                </td>

                {/* Verification Actions */}
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    {b.status === 'Pending Verification' && (
                      <button
                        onClick={() => verifyBooking(b.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold shadow-sm transition-all cursor-pointer"
                        title="Approve & Verify Payment"
                      >
                        Approve
                      </button>
                    )}

                    {b.status === 'Confirmed' && (
                      <button
                        onClick={() => completeBooking(b.id, 'Expedition successfully completed. Preserved in History.')}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 rounded-lg text-[11px] font-bold shadow-sm transition-all cursor-pointer"
                        title="Mark Expedition as Completed and Archive in History"
                      >
                        <Flag className="w-3 h-3 text-emerald-400" />
                        <span>Complete</span>
                      </button>
                    )}

                    {b.status === 'Pending Verification' && (
                      <button
                        onClick={() => {
                          const reason = prompt('Reason for rejection:', 'Payment not received in bank statement');
                          if (reason) rejectBooking(b.id, reason);
                        }}
                        className="px-2 py-1 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg text-[11px] font-medium transition-all cursor-pointer"
                        title="Reject Booking"
                      >
                        Reject
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (window.confirm(`Permanently delete booking ${b.id}?`)) deleteBooking(b.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Receipt Image Modal */}
      <AnimatePresence>
        {activeReceiptModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Payment Receipt Preview</h4>
                <button
                  onClick={() => setActiveReceiptModal(null)}
                  className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-800 max-h-[70vh] flex items-center justify-center bg-black">
                <img
                  src={activeReceiptModal}
                  alt="Payment Receipt"
                  className="max-h-[65vh] w-auto object-contain"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
