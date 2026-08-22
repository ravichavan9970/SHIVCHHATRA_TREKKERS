import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  ChevronDown, 
  Sparkles,
  PhoneCall,
  MessageCircle
} from 'lucide-react';
import { faqs } from '../../data/safetyRules';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-14 sm:py-20 bg-[#080c14] relative overflow-hidden border-t border-slate-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2.5 sm:space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>COMMONLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">
            Everything You Need to Know
          </h2>
          <p className="text-xs sm:text-base text-slate-400">
            Got questions regarding trial difficulty, food, pickup timings, or safety? We have answers.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/60 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-850/50 transition-colors cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-bold text-white font-heading">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-orange-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/40 pt-3"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Custom Inquiry Card (No raw phone number text displayed) */}
        <div className="mt-8 sm:mt-10 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-orange-950/40 to-slate-900 border border-orange-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white font-heading">Have a custom question or group inquiry?</h4>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Our expedition leaders are available 24/7 on WhatsApp & phone.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
            <a
              href="https://wa.me/917972733094?text=Hi%20Shivchhatra%20Trekkers,%20I%20have%20a%20question%20regarding%20upcoming%20treks!"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Inquiry</span>
            </a>

            <a
              href="tel:+917972733094"
              className="px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-md shadow-orange-500/30 transition-all cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Leader</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
