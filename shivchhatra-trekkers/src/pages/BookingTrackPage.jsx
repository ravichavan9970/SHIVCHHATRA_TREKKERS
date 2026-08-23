import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  Search, 
  TicketCheck, 
  ShieldCheck, 
  Printer, 
  Share2, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Phone, 
  MapPin, 
  Calendar, 
  Sparkles, 
  ShieldAlert, 
  Trash2,
  Download,
  FileText
} from 'lucide-react';
import { useBookings } from '../context/BookingContext';
import { trackLiveBooking } from '../services/apiService';

export default function BookingTrackPage() {
  const { findBooking, deleteBooking } = useBookings();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedBooking, setSearchedBooking] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const cleanQuery = searchQuery.trim();
    if (!cleanQuery) return;
    
    setIsSearching(true);
    let found = null;
    try {
      // Query live server database first to get real-time verified status
      found = await trackLiveBooking(cleanQuery);
      if (!found) {
        // When server has purged/deleted this record (e.g. Trip Done), clear from phone local storage too!
        deleteBooking(cleanQuery);
        setSearchedBooking(null);
      } else {
        setSearchedBooking(found);
      }
    } catch (err) {
      console.warn('Live server query failed:', err);
      // Only fallback to local if server is genuinely unreachable (offline)
      found = findBooking(cleanQuery);
      setSearchedBooking(found);
    }
    setHasSearched(true);
    setIsSearching(false);
  };

  // Real-time polling: Automatically reflect status when Admin verifies/rejects or purges in Admin Portal
  useEffect(() => {
    if (!searchedBooking || !searchedBooking.id) return;

    const interval = setInterval(async () => {
      try {
        const fresh = await trackLiveBooking(searchedBooking.id);
        if (!fresh) {
          // If deleted on server (Trip Done), immediately purge from local view
          deleteBooking(searchedBooking.id);
          setSearchedBooking(null);
        } else if (JSON.stringify(fresh) !== JSON.stringify(searchedBooking)) {
          setSearchedBooking(fresh);
        }
      } catch (e) {
        // ignore
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [searchedBooking]);

  const handlePrintPass = (booking) => {
    if (!booking) return;
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
            <title>Boarding Pass - ${booking.id}</title>
            <style>
              * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
              body { padding: 24px; color: #0f172a; background: #fff; line-height: 1.4; }
              .pass { border: 2px solid #ea580c; border-radius: 12px; padding: 20px; position: relative; }
              .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 16px; }
              .brand { font-size: 20px; font-weight: 800; color: #0f172a; }
              .sub { font-size: 11px; font-weight: 700; color: #ea580c; text-transform: uppercase; }
              .ref { text-align: right; font-family: monospace; font-size: 13px; font-weight: 800; color: #ea580c; }
              .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px; }
              .label { font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 600; }
              .val { font-size: 13px; font-weight: 700; color: #1e293b; margin-top: 2px; }
              .squad { border-top: 1px solid #e2e8f0; padding-top: 12px; margin-bottom: 16px; }
              .pills { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
              .pill { background: #f1f5f9; border: 1px solid #cbd5e1; padding: 3px 8px; border-radius: 6px; font-size: 11px; }
              .footer { border-top: 2px dashed #cbd5e1; padding-top: 12px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #64748b; }
              @media print {
                body { padding: 10px; }
                @page { margin: 10mm; size: auto; }
              }
            </style>
          </head>
          <body>
            <div class="pass">
              <div class="header">
                <div>
                  <div class="brand">SHIVCHHATRA TREKKERS</div>
                  <div class="sub">Official Expedition Boarding Pass</div>
                  <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Trek: <strong>${booking.trekTitle}</strong></div>
                </div>
                <div class="ref">
                  <div style="font-size: 10px; color: #64748b;">Pass Reference</div>
                  <div>${booking.id}</div>
                  <div style="font-size: 10px; color: #16a34a; margin-top: 2px;">● Status: ${booking.status}</div>
                </div>
              </div>

              <div class="grid">
                <div>
                  <div class="label">Lead Trekker</div>
                  <div class="val">${booking.primaryName}</div>
                </div>
                <div>
                  <div class="label">Mobile / WhatsApp</div>
                  <div class="val">${booking.phone}</div>
                </div>
                <div>
                  <div class="label">Departure Batch</div>
                  <div class="val" style="color: #ea580c;">${booking.batchDate}</div>
                </div>
                <div>
                  <div class="label">Pickup Point</div>
                  <div class="val">${booking.pickupCity} - ${booking.pickupSpot}</div>
                </div>
                <div>
                  <div class="label">Total Paid</div>
                  <div class="val" style="color: #16a34a;">₹${booking.amountPaid}</div>
                </div>
                <div>
                  <div class="label">Bank Reference (UTR)</div>
                  <div class="val" style="font-family: monospace; font-size: 11px;">${booking.utrNumber || 'Verified'}</div>
                </div>
              </div>

              <div class="squad">
                <div class="label">Registered Squad (${booking.participantsCount} Trekkers):</div>
                <div class="pills">
                  ${booking.participants ? booking.participants.map((p, idx) => `
                    <div class="pill">${p.name || `Trekker ${idx + 1}`} (${p.age}y, ${p.gender})</div>
                  `).join('') : `<div class="pill">${booking.primaryName}</div>`}
                </div>
              </div>

              <div class="footer">
                <div>24/7 Helpline: <strong>+91 79727 33094</strong></div>
                <div>Show this official pass at the boarding pickup point.</div>
              </div>
            </div>

            <script>
              window.onload = function() {
                window.focus();
                window.print();
                window.onafterprint = function() { window.close(); };
              };
            </script>
          </body>
        </html>
      `;

      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } catch (e) {
      window.print();
    }
  };

  const handleDownloadPDF = async (booking) => {
    if (!booking) return;
    setIsDownloadingPdf(true);
    try {
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '680px';
      container.style.padding = '16px';
      container.style.background = '#ffffff';
      container.style.color = '#0f172a';
      container.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

      container.innerHTML = `
        <div style="border: 2px solid #ea580c; border-radius: 12px; padding: 20px; background: #ffffff; box-sizing: border-box;">
          <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 16px;">
            <div>
              <div style="font-size: 20px; font-weight: 800; color: #0f172a;">SHIVCHHATRA TREKKERS</div>
              <div style="font-size: 11px; font-weight: 700; color: #ea580c; text-transform: uppercase;">Official Expedition Boarding Pass</div>
              <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Trek: <strong style="color: #0f172a;">${booking.trekTitle}</strong></div>
            </div>
            <div style="text-align: right; font-family: monospace; font-size: 13px; font-weight: 800; color: #ea580c;">
              <div style="font-size: 10px; color: #64748b; font-weight: normal;">Pass Reference</div>
              <div>${booking.id}</div>
              <div style="font-size: 10px; color: #16a34a; margin-top: 2px;">● Status: ${booking.status}</div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px;">
            <div>
              <div style="font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 600;">Lead Trekker</div>
              <div style="font-size: 13px; font-weight: 700; color: #1e293b; margin-top: 2px;">${booking.primaryName}</div>
            </div>
            <div>
              <div style="font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 600;">Mobile / WhatsApp</div>
              <div style="font-size: 13px; font-weight: 700; color: #1e293b; margin-top: 2px;">${booking.phone}</div>
            </div>
            <div>
              <div style="font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 600;">Departure Batch</div>
              <div style="font-size: 13px; font-weight: 700; color: #ea580c; margin-top: 2px;">${booking.batchDate}</div>
            </div>
            <div>
              <div style="font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 600;">Pickup Point</div>
              <div style="font-size: 13px; font-weight: 700; color: #1e293b; margin-top: 2px;">${booking.pickupCity} - ${booking.pickupSpot}</div>
            </div>
            <div>
              <div style="font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 600;">Total Paid</div>
              <div style="font-size: 13px; font-weight: 800; color: #16a34a; margin-top: 2px;">₹${booking.amountPaid}</div>
            </div>
            <div>
              <div style="font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 600;">Bank Reference (UTR)</div>
              <div style="font-size: 11px; font-family: monospace; font-weight: 700; color: #1e293b; margin-top: 2px;">${booking.utrNumber || 'Verified'}</div>
            </div>
          </div>

          <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; margin-bottom: 16px;">
            <div style="font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 600;">Registered Squad (${booking.participantsCount} Trekkers):</div>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px;">
              ${booking.participants ? booking.participants.map((p, idx) => `
                <div style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 3px 8px; border-radius: 6px; font-size: 11px; color: #1e293b;">
                  ${p.name || `Trekker ${idx + 1}`} (${p.age}y, ${p.gender})
                </div>
              `).join('') : `<div style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 3px 8px; border-radius: 6px; font-size: 11px;">${booking.primaryName}</div>`}
            </div>
          </div>

          <div style="border-top: 2px dashed #cbd5e1; padding-top: 12px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #64748b;">
            <div>24/7 Helpline: <strong style="color: #0f172a;">+91 79727 33094</strong></div>
            <div>Show this official pass at the boarding pickup point.</div>
          </div>
        </div>
      `;

      document.body.appendChild(container);
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });
      document.body.removeChild(container);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a5'
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const renderWidth = pageWidth - (margin * 2);
      const renderHeight = (canvas.height * renderWidth) / canvas.width;
      const posY = (pageHeight - renderHeight) / 2;

      pdf.addImage(imgData, 'PNG', margin, Math.max(posY, 10), renderWidth, renderHeight);
      pdf.save(`Shivchhatra_Boarding_Pass_${booking.id}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      handlePrintPass(booking);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'Confirmed':
        return {
          badge: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          text: 'Expedition Seat Confirmed & Verified',
          desc: 'Your payment UTR is verified by Shivchhatra leadership. Your expedition boarding pass is active.'
        };
      case 'Rejected':
        return {
          badge: 'bg-red-500/10 border-red-500/30 text-red-400',
          text: 'Payment UTR Verification Failed',
          desc: 'Your transaction reference could not be matched with bank records. Please contact support on WhatsApp.'
        };
      default:
        return {
          badge: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          text: 'Under Automated UTR Verification',
          desc: 'Your 12-digit transaction ID is being validated against bank records. Usually verified within 15–30 minutes.'
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] pt-24 pb-20">
      
      {/* Top Banner */}
      <div className="relative py-12 sm:py-16 bg-slate-950 border-b border-slate-800/80 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold">
            <TicketCheck className="w-3.5 h-3.5" />
            <span>EXPEDITION DISPATCH TRACKER</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading">
            Track Booking & Download Pass
          </h1>
          <p className="text-xs sm:text-base text-slate-400 max-w-2xl mx-auto">
            Input your Booking Reference ID (e.g. ST-2026-XXXX), Phone Number, or 12-Digit UTR to verify status and retrieve your boarding pass.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        
        {/* Search Bar Widget */}
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="p-2 sm:p-2.5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Booking ID (ST-2026-...), 10-Digit Phone, or 12-Digit UTR..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-orange-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{isSearching ? 'Searching...' : 'Track Pass'}</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-500 text-center">
            Real-time synchronization with active live server database.
          </p>
        </form>

        {/* Search Results Display */}
        <AnimatePresence mode="wait">
          {hasSearched && searchedBooking && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Status Banner */}
              <div className={`p-4 rounded-2xl border ${getStatusDisplay(searchedBooking.status).badge} flex items-start space-x-3`}>
                <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold">{getStatusDisplay(searchedBooking.status).text}</h4>
                  <p className="text-xs opacity-90 mt-0.5">{getStatusDisplay(searchedBooking.status).desc}</p>
                </div>
              </div>

              {/* Boarding Pass Ticket */}
              <div 
                id="printable-boarding-pass"
                className="p-6 rounded-3xl bg-slate-900 border-2 border-orange-500/40 shadow-2xl relative overflow-hidden space-y-5"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">OFFICIAL EXPEDITION PASS</span>
                    <h3 className="text-xl font-extrabold text-white font-heading">
                      {searchedBooking.trekTitle}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400">Pass Reference</p>
                    <p className="text-sm font-mono font-bold text-amber-400">{searchedBooking.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="text-slate-500 text-[10px]">Lead Trekker</p>
                    <p className="text-white font-semibold text-sm">{searchedBooking.primaryName}</p>
                  </div>

                  <div>
                    <p className="text-slate-500 text-[10px]">Contact Mobile</p>
                    <p className="text-white font-semibold">{searchedBooking.phone}</p>
                  </div>

                  <div>
                    <p className="text-slate-500 text-[10px]">Departure Batch</p>
                    <p className="text-orange-400 font-semibold">{searchedBooking.batchDate}</p>
                  </div>

                  <div>
                    <p className="text-slate-500 text-[10px]">Pickup Point</p>
                    <p className="text-white font-semibold">{searchedBooking.pickupCity} ({searchedBooking.pickupSpot})</p>
                  </div>

                  <div>
                    <p className="text-slate-500 text-[10px]">Amount Paid</p>
                    <p className="text-emerald-400 font-extrabold text-base">₹{searchedBooking.amountPaid}</p>
                  </div>

                  <div>
                    <p className="text-slate-500 text-[10px]">Bank UTR Ref</p>
                    <p className="text-white font-mono">{searchedBooking.utrNumber || 'Submitted'}</p>
                  </div>
                </div>

                {/* Squad List */}
                <div className="pt-2 border-t border-slate-800/80">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold mb-1">
                    Registered Participants ({searchedBooking.participantsCount}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {searchedBooking.participants?.map((p, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200">
                        {p.name || `Trekker ${idx + 1}`} ({p.age}y, {p.gender})
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => handleDownloadPDF(searchedBooking)}
                  disabled={isDownloadingPdf}
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-lg shadow-orange-600/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>{isDownloadingPdf ? 'Generating PDF...' : 'Download Pass (PDF)'}</span>
                </button>

                <button
                  onClick={() => handlePrintPass(searchedBooking)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-sm transition-all cursor-pointer hover:border-orange-500/40"
                >
                  <Printer className="w-4 h-4 text-orange-400" />
                  <span>Print Boarding Pass</span>
                </button>

                <a
                  href={`https://wa.me/917972733094?text=${encodeURIComponent(`Jai Shivray! My booking ID is ${searchedBooking.id} for trek ${searchedBooking.trekTitle}. Please share batch updates.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>WhatsApp Expedition Lead</span>
                </a>
              </div>
            </motion.div>
          )}

          {hasSearched && !searchedBooking && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3 shadow-xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-xl">
                🚩
              </div>
              <h4 className="text-base font-bold text-white">No Active Booking Found</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                We could not find any active booking matching <span className="text-orange-400 font-bold">"{searchQuery}"</span>.
              </p>
              <p className="text-[11px] text-slate-500 max-w-md mx-auto italic">
                ℹ️ If this trek was completed, all personal participant details and payment records have been securely purged from the servers for privacy.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
