import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckSquare, 
  Square, 
  Printer, 
  Sparkles, 
  AlertCircle, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { gearChecklist } from '../../data/safetyRules';

export default function GearChecklistSection() {
  // Store packed item keys
  const [checkedItems, setCheckedItems] = useState({});
  const [activeCategory, setActiveCategory] = useState(gearChecklist[0].category);

  const toggleItem = (categoryName, itemName) => {
    const key = `${categoryName}_${itemName}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const totalItemsCount = gearChecklist.reduce((acc, cat) => acc + cat.items.length, 0);
  const packedItemsCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = Math.round((packedItemsCount / totalItemsCount) * 100);

  const currentCategoryData = gearChecklist.find(c => c.category === activeCategory) || gearChecklist[0];

  const handlePrint = () => {
    try {
      const printWindow = window.open('', '_blank', 'width=800,height=900');
      if (!printWindow) {
        window.print();
        return;
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Shivchhatra Trekkers - Packing Checklist</title>
            <style>
              * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
              body { padding: 20px; color: #0f172a; background: #fff; line-height: 1.35; }
              .header { border-bottom: 2px solid #ea580c; padding-bottom: 10px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: flex-start; }
              .title { font-size: 18px; font-weight: 800; color: #0f172a; }
              .subtitle { font-size: 11px; font-weight: 700; color: #ea580c; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 1px; }
              .contact { font-size: 10px; color: #64748b; margin-top: 2px; }
              .badge { font-size: 10px; font-weight: 700; background: #f8fafc; padding: 4px 8px; border-radius: 6px; border: 1px solid #cbd5e1; }
              .category-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; background: #f1f5f9; padding: 4px 8px; border-left: 3px solid #ea580c; margin-top: 10px; margin-bottom: 6px; }
              .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
              .item { padding: 5px 8px; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 10.5px; display: flex; align-items: flex-start; gap: 6px; page-break-inside: avoid; }
              .item-name { font-weight: 600; color: #1e293b; }
              .item-tip { font-size: 9.5px; color: #64748b; margin-top: 1px; }
              .mandatory { font-size: 8.5px; font-weight: 700; color: #dc2626; background: #fee2e2; border: 1px solid #fca5a5; padding: 1px 4px; border-radius: 3px; text-transform: uppercase; margin-left: auto; white-space: nowrap; }
              .footer { margin-top: 14px; padding-top: 8px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 9.5px; color: #64748b; }
              @media print {
                body { padding: 8px; }
                @page { margin: 8mm; size: auto; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <div class="title">SHIVCHHATRA TREKKERS (शिवछत्र ट्रेकर्स)</div>
                <div class="subtitle">Official Sahyadri Expedition Packing Checklist</div>
                <div class="contact">24/7 Helpline & WhatsApp: +91 79727 33094</div>
              </div>
              <div class="badge">
                Readiness: ${progressPercent}% (${packedItemsCount}/${totalItemsCount} Packed)
              </div>
            </div>

            ${gearChecklist.map(cat => `
              <div>
                <div class="category-title">${cat.category}</div>
                <div class="grid">
                  ${cat.items.map(item => {
                    const key = `${cat.category}_${item.name}`;
                    const isChecked = !!checkedItems[key];
                    return `
                      <div class="item">
                        <span style="font-weight: bold; font-family: monospace; font-size: 12px; color: ${isChecked ? '#16a34a' : '#94a3b8'};">${isChecked ? '☑' : '☐'}</span>
                        <div style="flex: 1;">
                          <div style="display: flex; align-items: center; justify-content: space-between;">
                            <span class="item-name ${isChecked ? 'line-through' : ''}">${item.name}</span>
                            ${item.mandatory ? '<span class="mandatory">Mandatory</span>' : ''}
                          </div>
                          ${item.tip ? `<div class="item-tip">${item.tip}</div>` : ''}
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            `).join('')}

            <div class="footer">
              🚩 Jai Shivray! Be safe, respect fort sanctity, and leave no trace in the Sahyadris.
            </div>

            <script>
              window.onload = function() {
                window.focus();
                window.print();
              };
            </script>
          </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } catch (e) {
      window.print();
    }
  };

  const resetChecklist = () => {
    setCheckedItems({});
  };

  return (
    <section id="gear-checklist" className="py-14 sm:py-20 bg-[#080c14] relative overflow-hidden border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>EXPEDITION PREPARATION</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">
              Interactive Gear & Packing Checklist
            </h2>
            <p className="text-xs sm:text-base text-slate-400">
              Tick off your essential gear before departing. Being well-equipped ensures comfort, safety, and an unforgettable mountain experience.
            </p>
          </div>

          {/* Packing Progress Card */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md w-full sm:w-auto sm:min-w-[260px] space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300">Packing Readiness</span>
              <span className="text-orange-400 font-bold">{progressPercent}% Ready</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>{packedItemsCount} of {totalItemsCount} packed</span>
              <button
                onClick={resetChecklist}
                className="text-slate-500 hover:text-slate-300 flex items-center space-x-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Selector Tabs (Scrollable on mobile) */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none mb-6">
          {gearChecklist.map((cat) => {
            const isSelected = activeCategory === cat.category;
            return (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(cat.category)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-950/40'
                    : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat.category} ({cat.items.length})
              </button>
            );
          })}
        </div>

        {/* Active Checklist Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {currentCategoryData.items.map((item, idx) => {
            const key = `${activeCategory}_${item.name}`;
            const isChecked = !!checkedItems[key];
            return (
              <motion.div
                key={idx}
                whileTap={{ scale: 0.99 }}
                onClick={() => toggleItem(activeCategory, item.name)}
                className={`p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex items-start space-x-3 ${
                  isChecked
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isChecked ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-500 hover:text-slate-400" />
                  )}
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs sm:text-sm font-semibold leading-snug ${isChecked ? 'line-through text-slate-400' : 'text-white'}`}>
                      {item.name}
                    </p>
                    {item.mandatory && (
                      <span className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/30 shrink-0">
                        Mandatory
                      </span>
                    )}
                  </div>
                  {item.tip && (
                    <p className="text-[11px] text-slate-400 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="leading-tight">{item.tip}</span>
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="mt-6 sm:mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 flex items-center space-x-1.5 text-center sm:text-left">
            <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
            <span>Need gear rental (tents/sleeping bags)? Add it during checkout!</span>
          </p>

          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-orange-500/50 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-orange-400" />
            <span>Print / Save Checklist PDF</span>
          </button>
        </div>

      </div>
    </section>
  );
}
