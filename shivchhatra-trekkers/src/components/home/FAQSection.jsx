import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  ChevronDown, 
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { faqs } from '../../data/safetyRules';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-20 bg-[#080c14] relative overflow-hidden border-t border-slate-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>COMMONLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
            Everything You Need to Know
          </h2>
          <p className="text-sm text-slate-400">
            Clear guidelines on safety, bookings, solo travel, and logistics before embarking on your expedition.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-slate-900/90 border-orange-500/40 shadow-lg shadow-orange-950/20'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4"
                >
                  <span className={`text-sm sm:text-base font-bold font-heading ${isOpen ? 'text-orange-400' : 'text-white'}`}>
                    {faq.q}
                  </span>
                  <div className={`p-1 rounded-full bg-slate-900 border border-slate-800 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-orange-400' : 'text-slate-400'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Support Banner */}
        <div className="mt-10 p-5 rounded-2xl bg-gradient-to-r from-orange-950/40 to-slate-900 border border-orange-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="text-sm font-bold text-white font-heading">Have a custom question or group inquiry?</h4>
            <p className="text-xs text-slate-400">Our expedition leaders are available 24/7 on WhatsApp & phone.</p>
          </div>
          <a
            href="tel:+917972733094"
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-md shadow-orange-500/30 transition-all shrink-0"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call +91 79727 33094</span>
          </a>
        </div>

      </div>
    </section>
  );
}
