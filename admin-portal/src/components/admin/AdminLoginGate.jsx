import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  Sparkles,
  Server,
  Database,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { loginAdmin, setAdminToken } from '../../services/api';

export default function AdminLoginGate({ onLoginSuccess }) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isServerOffline, setIsServerOffline] = useState(false);

  useEffect(() => {
    // Check if backend server is active
    const checkServerStatus = async () => {
      try {
        const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
        const apiBase = import.meta.env.VITE_API_URL || (isLocal ? 'http://localhost:8080/api' : 'https://shivchhatra-trekkers-bjqg.onrender.com/api');
        const res = await fetch(`${apiBase}/treks`, { method: 'GET' });
        if (!res.ok && res.status >= 500) {
          setIsServerOffline(true);
        } else {
          setIsServerOffline(false);
        }
      } catch (err) {
        setIsServerOffline(true);
      }
    };
    checkServerStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanPass = passcode.trim();
    if (!cleanPass) {
      setError('Please enter your master security passcode');
      return;
    }

    setIsLoading(true);
    setError('');

    // Level 1: Master Dashboard Passcode
    if (
      cleanPass === 'Shivchhatra#!*&+$Sahyadri!****2026' ||
      cleanPass === 'ShivPasss!****2026'
    ) {
      try {
        await loginAdmin(cleanPass).catch((err) => {
          console.warn('Backend login endpoint notice:', err);
        });
      } catch (e) {
        // Fallback safely
      }
      setAdminToken(cleanPass);
      setIsLoading(false);
      onLoginSuccess();
      return;
    }

    try {
      await loginAdmin(cleanPass);
      setIsLoading(false);
      onLoginSuccess();
    } catch (err) {
      setIsLoading(false);
      setError('Access Denied: Invalid Master Security Passcode');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#080c14] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6 relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 mx-auto rounded-full overflow-hidden p-1 bg-gradient-to-tr from-orange-600 to-amber-500 shadow-xl shadow-orange-600/30 flex items-center justify-center">
            <img
              src="/logo.jpg"
              alt="Shivchhatra Trekkers Logo"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white font-heading">
              Shivchhatra Admin Hub
            </h1>
            <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider mt-0.5">
              Enterprise Operations & Security Gateway
            </p>
          </div>
        </div>

        {/* Server Status Warning - Only shown if server is Non-Active / Offline */}
        {isServerOffline && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-2xl bg-red-950/40 border border-red-500/40 flex items-center justify-between text-xs"
          >
            <div className="flex items-center space-x-2">
              <Server className="w-4 h-4 text-red-400" />
              <span className="text-slate-300 font-medium">Backend Server</span>
            </div>
            <div className="flex items-center space-x-1.5 text-red-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>Non-Active / Offline</span>
            </div>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-orange-400" />
              <span>Master Security Passcode</span>
            </label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setError('');
              }}
              placeholder="Enter master dashboard passcode"
              className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-2xl text-white placeholder-slate-500 text-sm font-mono tracking-widest focus:outline-none transition-all"
              autoFocus
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-400 text-xs flex items-center space-x-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-orange-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span>Authenticating Secure Key...</span>
            ) : (
              <>
                <span>Unlock Master Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
