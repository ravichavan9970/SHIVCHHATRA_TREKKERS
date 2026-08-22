import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, KeyRound, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminLoginModal from '../components/admin/AdminLoginModal';

const AUTH_KEY = 'shivchhatra_admin_auth_v1';

export default function AdminPortalPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
  });

  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pin.trim() === 'shivchhatra2026' || pin.trim() === 'admin123' || pin.trim() === '1234') {
      setIsAuthenticated(true);
      sessionStorage.setItem(AUTH_KEY, 'true');
      setError(false);
      setPin('');
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(AUTH_KEY);
  };

  if (isAuthenticated) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-[#080c14] flex items-center justify-center p-4 pt-24 pb-20">
      <div className="absolute inset-0 bg-radial-gradient opacity-30 pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 relative z-10 backdrop-blur-xl"
      >
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-400 shadow-lg shadow-orange-600/30 mx-auto flex items-center justify-center">
            <img
              src="/logo.jpg"
              alt="Shivchhatra Trekkers Logo"
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-white font-heading">
              Admin Operations Portal
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Authenticate to manage Sahyadri treks, verify participant payments, and configure payment scanner.
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Master Access Passcode
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                autoFocus
                placeholder="Enter passcode (Default: shivchhatra2026)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-slate-950 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                  error ? 'border-red-500 ring-2 ring-red-500/30' : 'border-slate-800 focus:border-orange-500'
                }`}
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 flex items-center space-x-1.5 animate-bounce">
              <span>⚠️ Incorrect passcode. Use <code>shivchhatra2026</code></span>
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-600/30 flex items-center justify-center space-x-2 transition-all"
          >
            <span>Unlock Admin Hub</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
          <p className="text-[11px] text-slate-400">
            Demo Master Key: <code className="text-orange-400 font-bold font-mono">shivchhatra2026</code>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
