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
  X
} from 'lucide-react';
import { useBookings } from '../../context/BookingContext';

export default function BookingsAuditor() {
  const { bookings, verifyBooking, rejectBooking, deleteBooking } = useBookings();
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReceiptModal, setActiveReceiptModal] = useState(null);

  const filteredBookings = bookings.filter(b => {
    const matchesStatus = filterStatus === 'All' || b.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchesQuery = !searchQuery ||
      b.id.toLowerCase().includes(q) ||
      b.primaryName.toLowerCase().includes(q) ||
      b.phone.includes(q) ||
      b.trekTitle.toLowerCase().includes(q) ||
      (b.utrNumber && b.utrNumber.toLowerCase().includes(q));

    return matchesStatus && matchesQuery;
  });

  const getStatusBadge = (status) => {
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
            Participant Bookings & Payment Auditor ({bookings.length} Total)
          </h3>
          <p className="text-xs text-slate-400">
            Verify 12-digit UPI transaction references, inspect payment screenshots, approve bookings, and export rosters.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-sm transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export Trek Roster (CSV)</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by ID, name, phone, or UTR..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
          {['All', 'Pending Verification', 'Confirmed', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filterStatus === status
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-800 font-heading">
            <tr>
              <th className="p-4">Ref ID & Date</th>
              <th className="p-4">Trek & Batch</th>
              <th className="p-4">Lead Trekker & Contacts</th>
              <th className="p-4">Amount & UTR</th>
              <th className="p-4">Receipt</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Verification Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredBookings.map((b) => (
              <tr key={b.id} className="hover:bg-slate-800/30 transition-colors">
                
                {/* Ref ID */}
                <td className="p-4">
                  <p className="font-mono font-bold text-white text-xs">{b.id}</p>
                  <p className="text-[10px] text-slate-500">{new Date(b.submittedAt).toLocaleDateString()} {new Date(b.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </td>

                {/* Trek & Batch */}
                <td className="p-4">
                  <p className="font-bold text-white text-xs">{b.trekTitle}</p>
                  <p className="text-[11px] text-orange-400">{b.batchDate}</p>
                  <p className="text-[10px] text-slate-400">Pickup: {b.pickupCity} ({b.pickupSpot})</p>
                </td>

                {/* Lead Trekker */}
                <td className="p-4">
                  <p className="font-bold text-white text-xs">{b.primaryName} ({b.participantsCount} Trekkers)</p>
                  <p className="text-[11px] text-slate-400 flex items-center space-x-1">
                    <Phone className="w-3 h-3 text-orange-400" />
                    <span>{b.phone}</span>
                  </p>
                  {b.emergencyPhone && (
                    <p className="text-[10px] text-slate-500">Emerg: {b.emergencyPhone}</p>
                  )}
                </td>

                {/* Amount & UTR */}
                <td className="p-4">
                  <p className="font-bold text-white text-xs">₹{b.amountPaid}</p>
                  <p className="font-mono text-[10px] text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 inline-block mt-0.5">
                    UTR: {b.utrNumber || 'N/A'}
                  </p>
                </td>

                {/* Receipt Screenshot */}
                <td className="p-4">
                  {b.receiptImage ? (
                    <button
                      onClick={() => setActiveReceiptModal(b.receiptImage)}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-orange-400 rounded-lg text-[10px] font-semibold flex items-center space-x-1 border border-slate-700"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View Receipt</span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-500">No screenshot</span>
                  )}
                </td>

                {/* Status Badge */}
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${getStatusBadge(b.status)}`}>
                    {b.status}
                  </span>
                </td>

                {/* Verification Actions */}
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    {b.status !== 'Confirmed' && (
                      <button
                        onClick={() => verifyBooking(b.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold shadow-sm transition-all"
                        title="Approve & Verify Payment"
                      >
                        Approve
                      </button>
                    )}

                    {b.status !== 'Rejected' && (
                      <button
                        onClick={() => {
                          const reason = prompt('Reason for rejection:', 'Payment not received in bank statement');
                          if (reason) rejectBooking(b.id, reason);
                        }}
                        className="px-2 py-1 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg text-[11px] font-medium transition-all"
                        title="Reject Booking"
                      >
                        Reject
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete booking ${b.id}?`)) deleteBooking(b.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
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
                  className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
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
