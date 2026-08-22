import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, KeyRound, ShieldAlert, ArrowRight, X, Sparkles } from 'lucide-react';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pin.trim() === 'Shivchhatra#!*&+$Sahyadri!****2026') {
      onLoginSuccess();
      setPin('');
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2500);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-[#0b101e] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 p-6 space-y-6"
        >
          <div className="flex justify-between items-start">
            <div className="w-16 h-16 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-orange-600 to-amber-500 shadow-lg shadow-orange-600/30 shrink-0 flex items-center justify-center">
              <img
                src="/logo.jpg"
                alt="Shivchhatra Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white font-heading">
              Admin Operations Portal
            </h3>
            <p className="text-xs text-slate-400">
              Enter your master authorization passcode to manage treks, upcoming batches, and payment gateway.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Master Security Key</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="Enter 30-character master passcode"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-950 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                    error ? 'border-red-500 ring-2 ring-red-500/30' : 'border-slate-800 focus:border-orange-500'
                  }`}
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-400 flex items-center space-x-1.5 animate-bounce">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Access Denied: Invalid master security key.</span>
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <span>Unlock Admin Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
