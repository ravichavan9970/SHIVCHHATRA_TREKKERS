import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mountain, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Heart, 
  ExternalLink,
  Lock,
  ArrowUpRight,
  Sparkles,
  MessageCircle
} from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#060911] border-t border-slate-800/80 pt-16 pb-12 overflow-hidden">
      {/* Mountain Topography Glow Line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/70">
          
          {/* Brand Info & Heritage */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-14 h-14 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-400 shadow-md shadow-orange-600/30 shrink-0 flex items-center justify-center">
                <img
                  src="/logo.jpg"
                  alt="Shivchhatra Trekkers Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent font-heading">
                  SHIVCHHATRA TREKKERS
                </span>
                <p className="text-[11px] text-slate-400 font-medium">शिवछत्र ट्रेकर्स • सह्याद्री साहसी परिवार</p>
              </div>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              A passionate mountaineering family preserving the historical sanctity of Sahyadri Forts while organizing high-safety, certified trekking expeditions across Maharashtra.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-200">100% Certified Safety Standards</p>
                <p className="text-[11px] text-slate-400">NIM/HMI mountaineers • GPS tracking • Trauma First-Aid</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-heading flex items-center space-x-1.5">
              <span>Quick Explore</span>
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/treks" className="hover:text-orange-400 transition-colors flex items-center space-x-1">
                  <span>Upcoming Batches</span>
                </Link>
              </li>
              <li>
                <Link to="/forts" className="hover:text-orange-400 transition-colors flex items-center space-x-1">
                  <span>Fort Heritage Encyclopedia</span>
                </Link>
              </li>
              <li>
                <Link to="/safety" className="hover:text-orange-400 transition-colors flex items-center space-x-1">
                  <span>Gear Packing Checklist</span>
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-orange-400 transition-colors flex items-center space-x-1">
                  <span>Track Booking Status</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Expeditions */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-heading">
              Popular Forts
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/treks" className="hover:text-orange-400 transition-colors">Rajgad to Torna Ridge</Link>
              </li>
              <li>
                <Link to="/treks" className="hover:text-orange-400 transition-colors">Harishchandragad Clifftop</Link>
              </li>
              <li>
                <Link to="/treks" className="hover:text-orange-400 transition-colors">Sandhan Valley Canyon</Link>
              </li>
              <li>
                <Link to="/treks" className="hover:text-orange-400 transition-colors">Kalsubai Sunrise Summit</Link>
              </li>
              <li>
                <Link to="/treks" className="hover:text-orange-400 transition-colors">Harihar Vertical Stairs</Link>
              </li>
            </ul>
          </div>

          {/* Connect & Support Buttons */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-heading">
              Connect With Us
            </h4>
            <div className="flex flex-col space-y-2.5">
              {/* WhatsApp Button */}
              <a
                href="https://wa.me/917972733094?text=Hi%20Shivchhatra%20Trekkers,%20I%20would%20like%20to%20inquire%20about%20upcoming%20treks!"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-900/40 text-emerald-300 text-xs font-semibold transition-all group"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
                <span>WhatsApp Chat</span>
              </a>

              {/* Call Helpline Button */}
              <a
                href="tel:+917972733094"
                className="flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-orange-500/50 hover:bg-orange-500/10 text-slate-200 text-xs font-semibold transition-all group"
              >
                <Phone className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform shrink-0" />
                <span>Call Helpline</span>
              </a>

              {/* Email Us Button */}
              <a
                href="mailto:info@shivchhatra.in"
                className="flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-orange-500/50 hover:bg-orange-500/10 text-slate-200 text-xs font-semibold transition-all group"
              >
                <Mail className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform shrink-0" />
                <span>Email Us</span>
              </a>

              {/* Instagram Button */}
              <a
                href="https://www.instagram.com/roambeyond_?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-orange-500/10 border border-pink-500/30 hover:border-pink-500 hover:from-pink-500/20 hover:to-orange-500/20 text-pink-300 text-xs font-semibold transition-all group"
              >
                <svg
                  className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span>Instagram Profile</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Shivchhatra Trekkers. All Rights Reserved. Built with honour for Sahyadri.</p>
          <div className="flex items-center space-x-6">
            <Link to="/safety" className="hover:text-slate-300 transition-colors">Safety Rules</Link>
            <Link to="/track" className="hover:text-slate-300 transition-colors">UTR Verification</Link>
            <button 
              onClick={scrollToTop} 
              className="text-orange-400 hover:text-orange-300 font-medium flex items-center space-x-1 cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
