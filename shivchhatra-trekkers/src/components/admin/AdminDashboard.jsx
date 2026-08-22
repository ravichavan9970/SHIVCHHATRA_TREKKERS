import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mountain, 
  Users, 
  CreditCard, 
  QrCode, 
  ShieldCheck, 
  Clock, 
  LogOut, 
  TrendingUp,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useTreks } from '../../context/TrekContext';
import { useBookings } from '../../context/BookingContext';
import { useReviews } from '../../context/ReviewContext';
import TrekManager from './TrekManager';
import BookingsAuditor from './BookingsAuditor';
import PaymentScannerSettings from './PaymentScannerSettings';
import ReviewsAuditor from './ReviewsAuditor';
import { Star } from 'lucide-react';

export default function AdminDashboard({ onLogout }) {
  const { treks } = useTreks();
  const { bookings } = useBookings();
  const { stats } = useReviews();
  const [activeTab, setActiveTab] = useState('treks'); // 'treks' | 'bookings' | 'reviews' | 'payment'

  // Computed metrics
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.amountPaid || 0), 0);
  const totalTrekkers = bookings.reduce((sum, b) => sum + (b.participantsCount || 1), 0);
  const pendingCount = bookings.filter(b => b.status === 'Pending Verification').length;
  const activeTreksCount = treks.length;

  const tabs = [
    { id: 'treks', label: 'Trek & Batch Manager', icon: Mountain, count: activeTreksCount },
    { id: 'bookings', label: 'Bookings & Payments Auditor', icon: Users, count: pendingCount > 0 ? `${pendingCount} Pending` : null, alert: pendingCount > 0 },
    { id: 'reviews', label: 'Trekker Reviews & Ratings', icon: Star, count: `${stats.totalReviews} (${stats.averageRating}★)` },
    { id: 'payment', label: 'Payment Scanner & UPI Settings', icon: QrCode }
  ];

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-2xl">
          <div className="flex items-center space-x-3.5">
            <div className="w-14 h-14 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-orange-600 to-amber-500 shadow-lg shadow-orange-600/30 shrink-0 flex items-center justify-center">
              <img
                src="/logo.jpg"
                alt="Shivchhatra Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
                  Shivchhatra Admin Hub
                </h1>
                <span className="px-2.5 py-0.5 rounded-md bg-orange-500/15 border border-orange-500/30 text-orange-400 text-[10px] font-bold uppercase tracking-wider">
                  Master Console
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Operations, Batch Inventories, UTR Audits & Payment Gateway Control
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-xl flex items-center space-x-2 transition-all self-start sm:self-auto"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>Lock & Exit Portal</span>
          </button>
        </div>

        {/* 4 Stats Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-1 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Total Revenue</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              ₹{totalRevenue.toLocaleString()}
            </p>
            <p className="text-[11px] text-emerald-400">From verified participant payments</p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-1 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Trekkers Booked</span>
              <Users className="w-4 h-4 text-orange-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              {totalTrekkers}
            </p>
            <p className="text-[11px] text-slate-400">{bookings.length} Total registration groups</p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-1 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Pending Verifications</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-heading">
              {pendingCount}
            </p>
            <p className="text-[11px] text-slate-400">{pendingCount > 0 ? 'Action required in Auditor' : 'All transactions up to date'}</p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-1 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Active Expeditions</span>
              <Mountain className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              {activeTreksCount}
            </p>
            <p className="text-[11px] text-slate-400">Published on client site</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
                  isSelected
                    ? 'text-white bg-slate-900 border border-orange-500/40 shadow-lg'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-orange-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.count && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    tab.alert ? 'bg-amber-500 text-black animate-pulse' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Tab View */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === 'treks' && <TrekManager />}
          {activeTab === 'bookings' && <BookingsAuditor />}
          {activeTab === 'reviews' && <ReviewsAuditor />}
          {activeTab === 'payment' && <PaymentScannerSettings />}
        </motion.div>

      </div>
    </div>
  );
}
