import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  HeartPulse, 
  Leaf, 
  Radio, 
  CheckSquare, 
  AlertTriangle, 
  Award,
  Users,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import GearChecklistSection from '../components/home/GearChecklistSection';
import { safetyProtocols } from '../data/safetyRules';

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-[#080c14] pt-24 pb-20">
      
      {/* Top Banner */}
      <div className="relative py-14 bg-slate-950 border-b border-slate-800/80 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>NIM / HMI CERTIFIED MOUNTAIN DISCIPLINE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading">
            Trekking Safety Protocols & Ethics
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Our gold-standard mountain safety systems, emergency wilderness response, and Leave-No-Trace heritage conservation pledge.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        
        {/* Safety Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {safetyProtocols.map((protocol, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-heading">{protocol.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{protocol.desc}</p>
            </div>
          ))}
        </div>

        {/* Golden Rules on Forts */}
        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xl border border-orange-500/40">
              🚩
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-heading">The Shivchhatra Mountain Code</h2>
              <p className="text-xs text-slate-400">Mandatory conduct for all participants across Maharashtra</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
              <h4 className="font-bold text-red-400 flex items-center space-x-1.5 font-heading">
                <AlertTriangle className="w-4 h-4" />
                <span>Zero Tolerance Policy</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Consumption or carrying of alcohol, smoking, vapes, and narcotics is strictly prohibited. Offenders are immediately handed over to local law authorities.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
              <h4 className="font-bold text-emerald-400 flex items-center space-x-1.5 font-heading">
                <Leaf className="w-4 h-4" />
                <span>Leave No Trace & Clean Forts</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Carry all non-biodegradable waste (wrappers, plastic bottles) back to city disposal points. We actively conduct cleanliness seva on fort ruins.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
              <h4 className="font-bold text-orange-400 flex items-center space-x-1.5 font-heading">
                <Users className="w-4 h-4" />
                <span>Leader Commands & Buddy System</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stay on marked trails. No straying into fog or cliff edges. Always inform your designated buddy and trek lead before stepping away.
              </p>
            </div>
          </div>
        </div>

        {/* Gear Checklist Section Embedded */}
        <GearChecklistSection />

      </div>
    </div>
  );
}
