import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  Star,
  Camera,
  Landmark,
  Server,
  Database,
  RefreshCw,
  ChevronDown
} from 'lucide-react';
import AdminLoginGate from './components/admin/AdminLoginGate';
import TrekManager from './components/admin/TrekManager';
import BookingsAuditor from './components/admin/BookingsAuditor';
import ReviewsAuditor from './components/admin/ReviewsAuditor';
import PaymentScannerSettings from './components/admin/PaymentScannerSettings';
import GalleryManager from './components/admin/GalleryManager';
import FortHeritageManager from './components/admin/FortHeritageManager';
import { 
  getAdminToken, 
  clearAdminToken, 
  fetchAdminTreks, 
  fetchAdminBookings, 
  fetchAdminReviewStats 
} from './services/api';

export default function App() {
  // Always lock by default unless explicitly authenticated via the Master Passcode
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = getAdminToken();
    return !!token && (token === 'ShivPasss!****2026' || token === 'Shivchhatra#!*&+$Sahyadri!****2026');
  });

  const [activeTab, setActiveTab] = useState('treks'); // 'treks' | 'bookings' | 'reviews' | 'payment'

  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalTrekkers: 0,
    pendingCount: 0,
    activeTreksCount: 0,
    averageRating: '0.0',
    totalReviews: 0
  });

  const loadMetrics = async () => {
    try {
      const [treks, bookings, reviewStats] = await Promise.all([
        fetchAdminTreks().catch(() => []),
        fetchAdminBookings().catch(() => []),
        fetchAdminReviewStats().catch(() => ({ averageRating: '0.0', totalReviews: 0 }))
      ]);

      const rev = bookings.reduce((sum, b) => sum + (b.amountPaid || 0), 0);
      const trekkers = bookings.reduce((sum, b) => sum + (b.participantsCount || 1), 0);
      const pending = bookings.filter(b => b.status === 'Pending Verification').length;

      setMetrics({
        totalRevenue: rev,
        totalTrekkers: trekkers,
        pendingCount: pending,
        activeTreksCount: treks.length,
        averageRating: reviewStats.averageRating || '0.0',
        totalReviews: reviewStats.totalReviews || 0
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadMetrics();
    }
  }, [isAuthenticated, activeTab]);

  useEffect(() => {
    const handleAuthFailed = () => {
      setIsAuthenticated(false);
    };
    window.addEventListener('admin_auth_failed', handleAuthFailed);
    return () => window.removeEventListener('admin_auth_failed', handleAuthFailed);
  }, []);

  const handleLogout = () => {
    clearAdminToken();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLoginGate onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const tabs = [
    { id: 'treks', label: 'Trek & Batch Manager', icon: Mountain, count: metrics.activeTreksCount },
    { id: 'bookings', label: 'Bookings & Payments Auditor', icon: Users, count: metrics.pendingCount > 0 ? `${metrics.pendingCount} Pending` : null, alert: metrics.pendingCount > 0 },
    { id: 'reviews', label: 'Trekker Reviews & Ratings', icon: Star, count: `${metrics.totalReviews} (${metrics.averageRating}★)` },
    { id: 'forts', label: 'Sacred Forts Heritage', icon: Landmark },
    { id: 'gallery', label: 'Trail Moments Gallery', icon: Camera },
    { id: 'payment', label: 'Payment Scanner & UPI Settings', icon: QrCode }
  ];

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 p-3 sm:p-6 lg:p-8 space-y-5 sm:space-y-6">
      <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6">
        
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center space-x-3 sm:space-x-3.5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-orange-600 to-amber-500 shadow-lg shadow-orange-600/30 shrink-0 flex items-center justify-center">
              <img
                src="/logo.jpg"
                alt="Shivchhatra Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-2xl font-extrabold text-white font-heading">
                  Shivchhatra Operations Hub
                </h1>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-extrabold tracking-wider uppercase">
                  Production Master
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                Sahyadri Fort Expeditions Enterprise Command Center
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 sm:space-x-3">
            <button
              onClick={loadMetrics}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors cursor-pointer"
              title="Refresh Global Metrics"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 text-red-300 text-xs font-bold flex items-center space-x-1.5 sm:space-x-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Lock Terminal</span>
            </button>
          </div>
        </div>

        {/* Global Key Business Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-3.5 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[11px] sm:text-xs font-bold">
              <span>Verified Revenue</span>
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
            </div>
            <p className="text-xl sm:text-3xl font-extrabold text-white font-heading">
              ₹{metrics.totalRevenue.toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] sm:text-[11px] text-emerald-400 font-semibold flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Direct Bank Settlement</span>
            </p>
          </div>

          <div className="p-3.5 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[11px] sm:text-xs font-bold">
              <span>Trekkers</span>
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
            </div>
            <p className="text-xl sm:text-3xl font-extrabold text-white font-heading">
              {metrics.totalTrekkers}
            </p>
            <p className="text-[10px] sm:text-[11px] text-slate-400">Total participants</p>
          </div>

          <div className="p-3.5 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[11px] sm:text-xs font-bold">
              <span>Pending UTRs</span>
              <AlertCircle className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${metrics.pendingCount > 0 ? 'text-amber-400 animate-bounce' : 'text-slate-500'}`} />
            </div>
            <p className={`text-xl sm:text-3xl font-extrabold font-heading ${metrics.pendingCount > 0 ? 'text-amber-400' : 'text-white'}`}>
              {metrics.pendingCount}
            </p>
            <p className="text-[10px] sm:text-[11px] text-slate-400">Awaiting verification</p>
          </div>

          <div className="p-3.5 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[11px] sm:text-xs font-bold">
              <span>Active Treks</span>
              <Mountain className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400" />
            </div>
            <p className="text-xl sm:text-3xl font-extrabold text-white font-heading">
              {metrics.activeTreksCount}
            </p>
            <p className="text-[10px] sm:text-[11px] text-slate-400">In live database</p>
          </div>
        </div>

        {/* Mobile Management View Dropdown Selector (Active on mobile screens) */}
        <div className="sm:hidden space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Navigation Module:
          </label>
          <div className="relative">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-900 border-2 border-orange-500/60 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-orange-500 shadow-xl appearance-none pr-10 cursor-pointer"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id} className="bg-slate-950 text-white font-semibold py-2">
                  {tab.label} {tab.count !== null && tab.count !== undefined ? `(${tab.count})` : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="w-5 h-5 text-orange-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Desktop Tab Switcher (Visible on tablets and laptops) */}
        <div className="hidden sm:flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'text-white bg-slate-900 border border-orange-500/40 shadow-lg'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-orange-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.count !== null && tab.count !== undefined && (
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
          {activeTab === 'forts' && <FortHeritageManager />}
          {activeTab === 'gallery' && <GalleryManager />}
          {activeTab === 'payment' && <PaymentScannerSettings />}
        </motion.div>

      </div>
    </div>
  );
}
