import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  HeartPulse, 
  Leaf, 
  Radio, 
  Award, 
  Users, 
  Map, 
  BadgeCheck
} from 'lucide-react';

export default function WhyChooseUs() {
  const pillars = [
    {
      icon: ShieldCheck,
      color: "text-orange-400 bg-orange-500/10 border-orange-500/30",
      title: "1:8 Leader to Trekker Ratio",
      desc: "Strictly limited batches with certified Mountaineering graduates (NIM & HMI) guiding and safeguarding every step."
    },
    {
      icon: HeartPulse,
      color: "text-red-400 bg-red-500/10 border-red-500/30",
      title: "Wilderness Trauma First-Aid",
      desc: "Every trek carries hospital-grade trauma kits, splints, emergency oxygen, snake-bite kits, and certified first-responders."
    },
    {
      icon: Leaf,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      title: "Leave No Trace & Fort Sanctity",
      desc: "Strict Zero-Trash policy. We actively conduct clean-up drives, respect local villagers, and enforce zero smoking/alcohol."
    },
    {
      icon: Radio,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
      title: "Satellite Radio & GPS Tracking",
      desc: "24/7 tele-support with live coordinates, local mountain rescue team standby, and reliable communication links."
    }
  ];

  return (
    <section className="py-20 bg-[#090d16] relative overflow-hidden border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>UNCOMPROMISING SAFETY & INTEGRITY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
            Why 15,000+ Trekkers Choose Shivchhatra
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Adventure in the Sahyadris should be thrilling, not risky. We combine technical mountaineering discipline with pure Maharashtrian hospitality.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/90 hover:border-slate-700 backdrop-blur-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${pillar.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white font-heading">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-2 flex items-center space-x-1 text-xs text-slate-500 font-medium">
                  <BadgeCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verified Standard</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
