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
  MessageCircle,
  UserCheck
} from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#060911] border-t border-slate-800/80 pt-10 sm:pt-16 pb-8 sm:pb-12 overflow-hidden">
      {/* Mountain Topography Glow Line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 pb-8 sm:pb-12 border-b border-slate-800/70">
          
          {/* Brand Info & Heritage (5 cols on desktop) */}
          <div className="lg:col-span-5 space-y-3.5">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-400 shadow-md shadow-orange-600/30 shrink-0 flex items-center justify-center">
                <img
                  src="/logo.jpg"
                  alt="Shivchhatra Trekkers Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent font-heading">
                  SHIVCHHATRA TREKKERS
                </span>
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">शिवछत्र ट्रेकर्स • सह्याद्री साहसी परिवार</p>
              </div>
            </Link>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md">
              A passionate mountaineering family preserving the historical sanctity of Sahyadri Forts while organizing high-safety, certified trekking expeditions across Maharashtra.
            </p>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-2.5 max-w-md">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-200">100% Certified Safety Standards</p>
                <p className="text-[10px] text-slate-400">NIM/HMI mountaineers • GPS tracking • Trauma First-Aid</p>
              </div>
            </div>
          </div>

          {/* Quick Links & Popular Forts (2 Columns Side-by-Side on Mobile!) */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-4 sm:gap-6">
            {/* Quick Links */}
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-2.5 sm:mb-4 font-heading">
                Quick Explore
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-400">
                <li>
                  <Link to="/treks" className="hover:text-orange-400 transition-colors">Upcoming Batches</Link>
                </li>
                <li>
                  <Link to="/forts" className="hover:text-orange-400 transition-colors">Fort Encyclopedia</Link>
                </li>
                <li>
                  <Link to="/safety" className="hover:text-orange-400 transition-colors">Gear Checklist</Link>
                </li>
                <li>
                  <Link to="/track" className="hover:text-orange-400 transition-colors">Track Booking</Link>
                </li>
              </ul>
            </div>

            {/* Popular Forts */}
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-2.5 sm:mb-4 font-heading">
                Popular Forts
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-400">
                <li>
                  <Link to="/treks" className="hover:text-orange-400 transition-colors">Rajgad to Torna</Link>
                </li>
                <li>
                  <Link to="/treks" className="hover:text-orange-400 transition-colors">Harishchandragad</Link>
                </li>
                <li>
                  <Link to="/treks" className="hover:text-orange-400 transition-colors">Sandhan Valley</Link>
                </li>
                <li>
                  <Link to="/treks" className="hover:text-orange-400 transition-colors">Kalsubai Peak</Link>
                </li>
                <li>
                  <Link to="/treks" className="hover:text-orange-400 transition-colors">Harihar Fort</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Connect & Support Buttons (3 cols on desktop, compact grid on mobile) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-2.5 sm:mb-4 font-heading">
              Connect With Us
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              {/* WhatsApp Button */}
              <a
                href="https://wa.me/917972733094?text=Hi%20Shivchhatra%20Trekkers,%20I%20would%20like%20to%20inquire%20about%20upcoming%20treks!"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-900/40 text-emerald-300 text-xs font-semibold transition-all group"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
                <span className="truncate">WhatsApp Chat</span>
              </a>

              {/* Call Helpline Button */}
              <a
                href="tel:+917972733094"
                className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-orange-500/50 hover:bg-orange-500/10 text-slate-200 text-xs font-semibold transition-all group"
              >
                <Phone className="w-3.5 h-3.5 text-orange-400 group-hover:scale-110 transition-transform shrink-0" />
                <span className="truncate">Call Helpline</span>
              </a>

              {/* Official Club Instagram Button */}
              <a
                href="https://www.instagram.com/shiv_chhatra_trekkers?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-pink-500/15 border border-orange-500/40 hover:border-orange-500 hover:from-orange-500/25 hover:to-pink-500/25 text-orange-300 text-xs font-semibold transition-all group shadow-sm"
                title="Official Shivchhatra Trekkers Instagram"
              >
                <svg
                  className="w-3.5 h-3.5 text-orange-400 group-hover:scale-110 transition-transform shrink-0"
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
                <span className="truncate">Club Instagram</span>
              </a>

              {/* Founder / Owner Instagram Profile */}
              <a
                href="https://www.instagram.com/roambeyond_?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-orange-500/10 border border-pink-500/30 hover:border-pink-500 hover:from-pink-500/20 hover:to-orange-500/20 text-pink-300 text-xs font-semibold transition-all group"
                title="Founder & Lead Trekker Profile"
              >
                <svg
                  className="w-3.5 h-3.5 text-pink-400 group-hover:scale-110 transition-transform shrink-0"
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
                <span className="truncate">Founder Profile</span>
              </a>

              {/* Email Us Button (full width on mobile if odd item) */}
              <a
                href="mailto:info@shivchhatra.in"
                className="col-span-2 sm:col-span-2 lg:col-span-1 flex items-center justify-center lg:justify-start space-x-2 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-orange-500/50 hover:bg-orange-500/10 text-slate-200 text-xs font-semibold transition-all group"
              >
                <Mail className="w-3.5 h-3.5 text-orange-400 group-hover:scale-110 transition-transform shrink-0" />
                <span className="truncate">info@shivchhatra.in</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Shivchhatra Trekkers. All Rights Reserved.</p>
          <div className="flex items-center space-x-4">
            <Link to="/safety" className="hover:text-slate-300 transition-colors">Safety Rules</Link>
            <Link to="/track" className="hover:text-slate-300 transition-colors">UTR Status</Link>
            <button 
              onClick={scrollToTop} 
              className="text-orange-400 hover:text-orange-300 font-medium flex items-center space-x-1 cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
