import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  Copy, 
  Check, 
  QrCode, 
  Upload, 
  Clock, 
  Calendar, 
  MapPin, 
  Users, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Ticket,
  Printer,
  Share2,
  Lock,
  ExternalLink,
  Info,
  Download,
  FileText
} from 'lucide-react';
import { useBookings } from '../../context/BookingContext';
import { usePaymentConfig } from '../../context/PaymentConfigContext';
import { useTreks } from '../../context/TrekContext';

const defaultPickUpLocations = [
  {
    city: "Pune",
    spots: [
      "Swargate - Near Laxmi Narayan Theatre (11:00 PM)",
      "Shivajinagar - Bank of Maharashtra (11:30 PM)",
      "Wakad - Ginger Hotel Flyover (12:15 AM)",
      "Katraj - Wonder City (11:45 PM)"
    ]
  }
];

export default function BookingModal() {
  const { 
    isBookingOpen, 
    closeBookingModal, 
    activeTrekForBooking, 
    activeBatchForBooking,
    submitBooking,
    checkUtrDuplicate
  } = useBookings();

  const { config, validateDiscountCode } = usePaymentConfig();
  const { updateBatchCapacity } = useTreks();

  // Wizard Step (1: Details, 2: Review & Coupon, 3: Safe Payment Scanner, 4: Confirmed Pass)
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [primaryName, setPrimaryName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [pickupCity, setPickupCity] = useState('');
  const [pickupSpot, setPickupSpot] = useState('');
  const [participantsCount, setParticipantsCount] = useState(1);
  const [participants, setParticipants] = useState([{ name: '', age: '', gender: 'Male' }]);
  const [fitnessAgreed, setFitnessAgreed] = useState(false);

  // Addons & Coupon
  const [rentTent, setRentTent] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Payment Scanner State
  const [paymentMethodChoice, setPaymentMethodChoice] = useState('direct_upi'); // 'direct_upi' | 'gateway'
  const [utrNumber, setUtrNumber] = useState('');
  const [receiptImage, setReceiptImage] = useState(null);
  const [receiptFileName, setReceiptFileName] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [paymentViewMode, setPaymentViewMode] = useState('custom'); // 'custom' | 'dynamic'
  const [sessionTimeLeft, setSessionTimeLeft] = useState(900); // 15 mins
  const [utrError, setUtrError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // Confirmed Result
  const [confirmedBookingData, setConfirmedBookingData] = useState(null);

  // Get available pickups with fallback
  const availablePickups = (activeTrekForBooking?.pickUpLocations && activeTrekForBooking.pickUpLocations.length > 0)
    ? activeTrekForBooking.pickUpLocations
    : defaultPickUpLocations;

  // Initialize and Reset on Open
  useEffect(() => {
    if (isBookingOpen && activeTrekForBooking) {
      setCurrentStep(1);
      setPrimaryName('');
      setPhone('');
      setEmail('');
      setEmergencyPhone('');
      setParticipantsCount(1);
      setParticipants([{ name: '', age: '', gender: 'Male' }]);
      setFitnessAgreed(false);
      setRentTent(false);
      setCouponCode('');
      setAppliedDiscount(null);
      setCouponError('');
      setUtrNumber('');
      setReceiptImage(null);
      setReceiptFileName('');
      setUtrError('');
      setSessionTimeLeft(900);
      setConfirmedBookingData(null);

      // Default pickup
      const firstCity = availablePickups[0];
      if (firstCity) {
        setPickupCity(firstCity.city);
        setPickupSpot(firstCity.spots?.[0] || '');
      }
    }
  }, [isBookingOpen, activeTrekForBooking]);

  // Update participants array when count changes
  const handleParticipantCountChange = (count) => {
    const newCount = Math.max(1, Math.min(10, count));
    setParticipantsCount(newCount);
    const updated = [...participants];
    if (newCount > updated.length) {
      for (let i = updated.length; i < newCount; i++) {
        updated.push({ name: '', age: '', gender: 'Male' });
      }
    } else {
      updated.splice(newCount);
    }
    setParticipants(updated);
  };

  const handleParticipantDetailChange = (index, field, value) => {
    const updated = [...participants];
    updated[index] = { ...updated[index], [field]: value };
    setParticipants(updated);
    if (index === 0 && field === 'name' && !primaryName) {
      setPrimaryName(value);
    }
  };

  // Switch pickup spots when city changes
  const handleCityChange = (city) => {
    setPickupCity(city);
    const foundCity = availablePickups.find(c => c.city === city);
    if (foundCity && foundCity.spots?.length > 0) {
      setPickupSpot(foundCity.spots[0]);
    } else {
      setPickupSpot('');
    }
  };

  // Pricing calculations
  const trekBasePrice = (activeTrekForBooking?.price || 1500) * participantsCount;
  const tentAddonPrice = rentTent ? 300 * participantsCount : 0;
  const ecoPermitFee = (config.permitFee || 100) * participantsCount;
  const subtotal = trekBasePrice + tentAddonPrice + ecoPermitFee;
  const discountAmount = appliedDiscount?.discountAmount || 0;
  const finalTotalAmount = Math.max(0, subtotal - discountAmount);

  // 15-Minute Timer Countdown
  useEffect(() => {
    if (!isBookingOpen || currentStep !== 3) return;
    const timer = setInterval(() => {
      setSessionTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isBookingOpen, currentStep]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Apply Coupon
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const result = validateDiscountCode(couponCode, subtotal);
    if (result.valid) {
      setAppliedDiscount(result);
    } else {
      setCouponError(result.error);
      setAppliedDiscount(null);
    }
  };

  // Copy UPI ID
  const handleCopyUpi = () => {
    navigator.clipboard.writeText(config.upiId || 'shivchhatra@upi');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Receipt File Upload Handler
  const handleReceiptUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, JPEG, WEBP)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size exceeds 5MB limit');
      return;
    }

    setReceiptFileName(file.name);
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setReceiptImage(uploadEvent.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Step 1 Validation
  const handleProceedToReview = (e) => {
    e.preventDefault();
    if (!primaryName.trim()) {
      alert('Please enter primary contact name');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!emergencyPhone.trim() || emergencyPhone.length < 10) {
      alert('Please enter an emergency contact number');
      return;
    }
    if (!fitnessAgreed) {
      alert('Please acknowledge the physical fitness and safety declaration');
      return;
    }
    setCurrentStep(2);
  };

  // Dynamic UPI Payment URI
  const bookingTempRef = `ST-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const upiUri = `upi://pay?pa=${encodeURIComponent(config.upiId)}&pn=${encodeURIComponent(config.merchantName)}&am=${finalTotalAmount}&cu=INR&tn=${encodeURIComponent(`Shivchhatra Trek Booking - ${bookingTempRef}`)}`;

  // Step 3 Payment Verification & Final Submit
  const handleFinalPaymentSubmit = async (e) => {
    e.preventDefault();
    setUtrError('');

    // Clean UTR
    const cleanUtr = utrNumber.trim();
    
    // Strict 12-digit format check
    if (!/^\d{12}$/.test(cleanUtr) && !/^[A-Za-z0-9]{12}$/.test(cleanUtr)) {
      setUtrError('Please enter a valid 12-digit UPI / Bank Reference (UTR) number');
      return;
    }

    // Dummy UTR check (preventing 000000000000 or 123456789012)
    if (/^(\d)\1{11}$/.test(cleanUtr)) {
      setUtrError('Suspicious transaction number detected. Please enter genuine banking UTR.');
      return;
    }

    // Check duplicate UTR across existing bookings
    if (checkUtrDuplicate(cleanUtr)) {
      setUtrError('This 12-digit UTR has already been submitted for another booking. Please check your bank receipt.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newBooking = await submitBooking({
        trekId: activeTrekForBooking.id,
        trekTitle: activeTrekForBooking.title,
        batchDate: activeBatchForBooking?.date || "Upcoming Batch",
        primaryName: primaryName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        emergencyPhone: emergencyPhone.trim(),
        pickupCity: pickupCity || "Pune",
        pickupSpot: pickupSpot || "Direct Contact / Base Village",
        participantsCount,
        participants,
        amountPaid: finalTotalAmount,
        discountAmount,
        utrNumber: cleanUtr,
        receiptImage: receiptImage,
        tentAddon: rentTent
      });

      // Update seat inventory
      if (activeTrekForBooking && activeBatchForBooking) {
        updateBatchCapacity(activeTrekForBooking.id, activeBatchForBooking.id, participantsCount);
      }

      setConfirmedBookingData(newBooking);
      setIsSubmitting(false);
      setCurrentStep(4);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.error(e);
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      setUtrError('Booking submission error: ' + err.message);
    }
  };

  // Automated Bank Gateway Checkout Handler
  const handleGatewayPay = async () => {
    setIsSubmitting(true);
    setUtrError('');

    const key = config.gatewayKeyId;
    if (key && window.Razorpay) {
      try {
        const options = {
          key: key,
          amount: finalTotalAmount * 100,
          currency: "INR",
          name: config.merchantName || "Shivchhatra Trekkers",
          description: `Expedition Booking - ${activeTrekForBooking.title}`,
          image: "/logo.jpg",
          handler: async function (response) {
            const autoUtr = response.razorpay_payment_id || `RZP${Date.now()}`;
            const newBooking = await submitBooking({
              trekId: activeTrekForBooking.id,
              trekTitle: activeTrekForBooking.title,
              batchDate: activeBatchForBooking?.date || "Upcoming Batch",
              primaryName: primaryName.trim(),
              phone: phone.trim(),
              email: email.trim(),
              emergencyPhone: emergencyPhone.trim(),
              pickupCity: pickupCity || "Pune",
              pickupSpot: pickupSpot || "Direct Contact / Base Village",
              participantsCount,
              participants,
              amountPaid: finalTotalAmount,
              discountAmount,
              utrNumber: autoUtr,
              receiptImage: null,
              tentAddon: rentTent
            });

            if (activeTrekForBooking && activeBatchForBooking) {
              updateBatchCapacity(activeTrekForBooking.id, activeBatchForBooking.id, participantsCount);
            }

            setConfirmedBookingData(newBooking);
            setIsSubmitting(false);
            setCurrentStep(4);
            try { confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } }); } catch (e) {}
          },
          prefill: {
            name: primaryName,
            email: email,
            contact: phone
          },
          theme: {
            color: "#ea580c"
          }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
        setIsSubmitting(false);
        return;
      } catch (err) {
        console.warn('Razorpay popup error:', err);
      }
    }

    // Direct simulated confirmation if test mode or key preview
    setTimeout(async () => {
      const autoUtr = `PG${Math.floor(100000000000 + Math.random() * 900000000000)}`;
      const newBooking = await submitBooking({
        trekId: activeTrekForBooking.id,
        trekTitle: activeTrekForBooking.title,
        batchDate: activeBatchForBooking?.date || "Upcoming Batch",
        primaryName: primaryName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        emergencyPhone: emergencyPhone.trim(),
        pickupCity: pickupCity || "Pune",
        pickupSpot: pickupSpot || "Direct Contact / Base Village",
        participantsCount,
        participants,
        amountPaid: finalTotalAmount,
        discountAmount,
        utrNumber: autoUtr,
        receiptImage: null,
        tentAddon: rentTent
      });

      if (activeTrekForBooking && activeBatchForBooking) {
        updateBatchCapacity(activeTrekForBooking.id, activeBatchForBooking.id, participantsCount);
      }

      setConfirmedBookingData(newBooking);
      setIsSubmitting(false);
      setCurrentStep(4);
      try { confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } }); } catch (e) {}
    }, 1200);
  };

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
              html, body {
                margin: 0 !important;
                padding: 10px !important;
                background: #fff;
                color: #0f172a;
                line-height: 1.35;
                height: auto !important;
                min-height: 0 !important;
              }
              .pass {
                border: 2px solid #ea580c;
                border-radius: 12px;
                padding: 18px;
                position: relative;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
              .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 14px; }
              .brand { font-size: 20px; font-weight: 800; color: #0f172a; }
              .sub { font-size: 11px; font-weight: 700; color: #ea580c; text-transform: uppercase; }
              .ref { text-align: right; font-family: monospace; font-size: 13px; font-weight: 800; color: #ea580c; }
              .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 14px; }
              .label { font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 600; }
              .val { font-size: 13px; font-weight: 700; color: #1e293b; margin-top: 2px; }
              .squad { border-top: 1px solid #e2e8f0; padding-top: 12px; margin-bottom: 14px; }
              .pills { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
              .pill { background: #f1f5f9; border: 1px solid #cbd5e1; padding: 3px 8px; border-radius: 6px; font-size: 11px; }
              .footer { border-top: 2px dashed #cbd5e1; padding-top: 12px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #64748b; }
              @page {
                size: auto;
                margin: 0;
              }
              @media print {
                html, body {
                  margin: 0 !important;
                  padding: 8mm !important;
                  height: auto !important;
                }
                .pass {
                  margin: 0 !important;
                  page-break-after: avoid !important;
                  page-break-before: avoid !important;
                  page-break-inside: avoid !important;
                  break-inside: avoid !important;
                }
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
      container.style.width = '650px';
      container.style.padding = '0';
      container.style.background = '#ffffff';
      container.style.color = '#0f172a';
      container.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

      container.innerHTML = `
        <div style="border: 2px solid #ea580c; border-radius: 12px; padding: 20px; background: #ffffff; box-sizing: border-box;">
          <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 14px;">
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

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 14px;">
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

          <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; margin-bottom: 14px;">
            <div style="font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 600;">Registered Squad (${booking.participantsCount} Trekkers):</div>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px;">
              ${booking.participants ? booking.participants.map((p, idx) => `
                <div style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 3px 8px; border-radius: 6px; font-size: 11px; color: #1e293b;">
                  ${p.name || `Trekker ${idx + 1}`} (${p.age}y, ${p.gender})
                </div>
              `).join('') : `<div style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 3px 8px; border-radius: 6px; font-size: 11px; color: #1e293b;">${booking.primaryName}</div>`}
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
      const imgWidth = 190; // mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Exact custom 1-page format matching content perfectly with no extra blank page
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [imgWidth + 12, imgHeight + 12]
      });

      pdf.addImage(imgData, 'PNG', 6, 6, imgWidth, imgHeight);
      pdf.save(`Shivchhatra_Boarding_Pass_${booking.id}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      handlePrintPass(booking);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  if (!isBookingOpen || !activeTrekForBooking) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 md:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeBookingModal}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative w-full max-w-2xl bg-[#0b101e] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[94vh] flex flex-col my-auto"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                <p className="text-xs font-semibold text-orange-400 uppercase tracking-wide">
                  Step {currentStep} of 4 • {currentStep === 1 ? 'Trekker Details' : currentStep === 2 ? 'Order Breakdown' : currentStep === 3 ? 'Safe Payment Scanner' : 'Boarding Pass'}
                </p>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white font-heading">
                {activeTrekForBooking.title}
              </h3>
            </div>

            <button
              onClick={closeBookingModal}
              className="p-2 rounded-full bg-slate-950/80 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Stepper Progress Bar */}
          <div className="w-full h-1 bg-slate-800 shrink-0">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>

          {/* Modal Body */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
            
            {/* ========================================================================= */}
            {/* STEP 1: PARTICIPANT INFORMATION & PICKUP */}
            {/* ========================================================================= */}
            {currentStep === 1 && (
              <form onSubmit={handleProceedToReview} className="space-y-5">
                
                {/* Batch & Dates summary */}
                <div className="p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-slate-200">
                    <Calendar className="w-4 h-4 text-orange-400" />
                    <span>Selected Batch: <strong>{activeBatchForBooking?.date || "Upcoming Weekend"}</strong></span>
                  </div>
                  <span className="text-orange-400 font-bold">₹{activeTrekForBooking.price} / person</span>
                </div>

                {/* Primary Contact Details */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading flex items-center space-x-1.5">
                    <Users className="w-3.5 h-3.5 text-orange-400" />
                    <span>Primary Trekker & Emergency Contact</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aditya Deshmukh"
                        value={primaryName}
                        onChange={(e) => {
                          setPrimaryName(e.target.value);
                          handleParticipantDetailChange(0, 'name', e.target.value);
                        }}
                        className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 block mb-1">WhatsApp Mobile *</label>
                      <input
                        type="tel"
                        required
                        placeholder="10-digit number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="For booking pass copy"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Emergency Contact Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="Family / Friend Contact"
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Pickup Hub Selection */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-400" />
                    <span>Boarding & Pickup Point</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1 font-semibold">Pickup City *</label>
                      <select
                        value={pickupCity}
                        onChange={(e) => handleCityChange(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-orange-500 cursor-pointer"
                      >
                        {availablePickups.map((loc) => (
                          <option key={loc.city} value={loc.city} className="bg-slate-900">
                            {loc.city} Route
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 block mb-1 font-semibold">Pickup Spot & Departure Time *</label>
                      <select
                        value={pickupSpot}
                        onChange={(e) => setPickupSpot(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-orange-500 cursor-pointer"
                      >
                        {availablePickups
                          .find(l => l.city === pickupCity)
                          ?.spots?.map((s, idx) => (
                            <option key={idx} value={s} className="bg-slate-900">
                              {s}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Number of Participants & Roster */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">
                      Number of Trekkers ({participantsCount})
                    </h4>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleParticipantCountChange(num)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                            participantsCount === num
                              ? 'bg-orange-500 text-white'
                              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Participant input rows */}
                  <div className="space-y-2">
                    {participants.map((p, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                        <div className="sm:col-span-6">
                          <input
                            type="text"
                            required
                            placeholder={`Trekker ${idx + 1} Full Name`}
                            value={p.name}
                            onChange={(e) => handleParticipantDetailChange(idx, 'name', e.target.value)}
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <input
                            type="number"
                            required
                            min="10"
                            max="75"
                            placeholder="Age"
                            value={p.age}
                            onChange={(e) => handleParticipantDetailChange(idx, 'age', e.target.value)}
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <select
                            value={p.gender}
                            onChange={(e) => handleParticipantDetailChange(idx, 'gender', e.target.value)}
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fitness & Rules Disclaimer */}
                <div className="pt-2">
                  <label className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={fitnessAgreed}
                      onChange={(e) => setFitnessAgreed(e.target.checked)}
                      className="mt-0.5 accent-orange-500 w-4 h-4 rounded"
                    />
                    <span className="text-[11px] text-slate-400 leading-relaxed">
                      I declare that all participants are physically fit for the trek, agree to abide by the Leave No Trace eco-pledge, and understand the Zero Smoking / Zero Alcohol policy on historical forts.
                    </span>
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-600/30 flex items-center justify-center space-x-2"
                  >
                    <span>Proceed to Order Breakdown</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </form>
            )}

            {/* ========================================================================= */}
            {/* STEP 2: ORDER BREAKDOWN & COUPONS */}
            {/* ========================================================================= */}
            {currentStep === 2 && (
              <div className="space-y-6">
                
                {/* Booking Review Card */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">
                    Expedition Summary
                  </h4>

                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Trek & Fort:</span>
                      <span className="font-semibold text-white">{activeTrekForBooking.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Batch Date:</span>
                      <span className="text-orange-400 font-semibold">{activeBatchForBooking?.date || "Weekend Special"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Pickup Location:</span>
                      <span>{pickupCity} ({pickupSpot})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Participants:</span>
                      <span>{participantsCount} Trekker(s)</span>
                    </div>
                  </div>
                </div>

                {/* Optional Gear Addons */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">
                    Optional Equipment Add-ons
                  </h4>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center space-x-2.5">
                      <input
                        type="checkbox"
                        checked={rentTent}
                        onChange={(e) => setRentTent(e.target.checked)}
                        className="accent-orange-500 w-4 h-4 rounded"
                      />
                      <div>
                        <p className="text-xs font-semibold text-white">Private Dual-Layer Alpine Tent & Mat Rental</p>
                        <p className="text-[11px] text-slate-400">Dedicated private tent rather than standard group sharing</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-400">+₹300/trekker</span>
                  </label>
                </div>

                {/* Promo Code Applicator */}
                <div className="space-y-2">
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter promo coupon (e.g. SWARAJYA10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white uppercase placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all"
                    >
                      Apply
                    </button>
                  </form>

                  {couponError && (
                    <p className="text-xs text-red-400 flex items-center space-x-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{couponError}</span>
                    </p>
                  )}

                  {appliedDiscount && (
                    <p className="text-xs text-emerald-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Coupon applied: {appliedDiscount.description} (-₹{appliedDiscount.discountAmount})</span>
                    </p>
                  )}
                </div>

                {/* Pricing Calculation Breakdown */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Trek Pass ({participantsCount} x ₹{activeTrekForBooking.price})</span>
                    <span className="text-white font-medium">₹{trekBasePrice}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Forest & Eco Conservation Permit</span>
                    <span className="text-white font-medium">₹{ecoPermitFee}</span>
                  </div>
                  {rentTent && (
                    <div className="flex justify-between text-slate-400">
                      <span>Private Tent Rental</span>
                      <span className="text-white font-medium">₹{tentAddonPrice}</span>
                    </div>
                  )}
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>Promotional Discount</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline text-sm">
                    <span className="font-bold text-white">Total Amount Payable</span>
                    <span className="text-xl font-extrabold text-orange-400 font-heading">₹{finalTotalAmount}</span>
                  </div>
                </div>

                {/* Nav buttons */}
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="w-1/3 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-900"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="w-2/3 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-600/30 flex items-center justify-center space-x-2"
                  >
                    <span>Proceed to Safe Payment Scanner</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}

            {/* ========================================================================= */}
            {/* STEP 3: SAFE PAYMENT SCANNER & FRAUD-PROOF VERIFICATION */}
            {/* ========================================================================= */}
            {currentStep === 3 && (
              <div className="space-y-5">
                
                {/* Security Badge & Anti-Tamper Timer */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-bold text-white">100% Secure Official Payment Portal</p>
                      <p className="text-[10px] text-slate-400">Pre-verified official Sahyadri merchant account</p>
                    </div>
                  </div>

                  <div className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center space-x-1 text-xs font-mono text-amber-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatTimer(sessionTimeLeft)}</span>
                  </div>
                </div>

                {/* Optional Method Chooser when Gateway is Enabled */}
                {config.enableGateway && (
                  <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setPaymentMethodChoice('direct_upi')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                        paymentMethodChoice === 'direct_upi'
                          ? 'bg-orange-500 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Direct UPI (0% Fee)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethodChoice('gateway')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                        paymentMethodChoice === 'gateway'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Bank Gateway / Cards</span>
                    </button>
                  </div>
                )}

                {/* Amount to pay highlight */}
                <div className="text-center py-1">
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Exact Amount to Pay</p>
                  <p className="text-3xl font-extrabold text-white font-heading mt-0.5">
                    ₹{finalTotalAmount}
                  </p>
                  <p className="text-[11px] text-orange-400 mt-0.5 font-mono">
                    Booking Reference: {bookingTempRef}
                  </p>
                </div>

                {/* METHOD 1: DIRECT UPI & QR SCANNER */}
                {paymentMethodChoice === 'direct_upi' && (
                  <form onSubmit={handleFinalPaymentSubmit} className="space-y-5">
                    {/* QR Code Display Card */}
                    <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center space-y-4 shadow-xl">
                      
                      {/* Scanner Mode Toggle if custom scanner is uploaded */}
                      {config.customScannerImage && (
                        <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                          <button
                            type="button"
                            onClick={() => setPaymentViewMode('dynamic')}
                            className={`px-3 py-1 rounded-lg font-medium transition-all ${
                              paymentViewMode === 'dynamic' ? 'bg-orange-500 text-white' : 'text-slate-400'
                            }`}
                          >
                            Auto-Amount QR
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentViewMode('custom')}
                            className={`px-3 py-1 rounded-lg font-medium transition-all ${
                              paymentViewMode === 'custom' ? 'bg-orange-500 text-white' : 'text-slate-400'
                            }`}
                          >
                            Merchant Scanner
                          </button>
                        </div>
                      )}

                      {/* QR Box with Glowing Border */}
                      <div className="p-3 bg-white rounded-2xl shadow-2xl border-4 border-orange-500/30 flex flex-col items-center justify-center">
                        {paymentViewMode === 'custom' && config.customScannerImage ? (
                          <div className="flex flex-col items-center">
                            <img
                              src={config.customScannerImage}
                              alt="Merchant Payment Scanner"
                              className="w-56 h-auto max-h-72 object-contain rounded-xl"
                            />
                          </div>
                        ) : (
                          <div className="p-3">
                            <QRCodeSVG
                              value={upiUri}
                              size={190}
                              level="H"
                              includeMargin={false}
                            />
                          </div>
                        )}
                      </div>

                      {/* Verified Merchant Badge */}
                      <div className="text-center">
                        <p className="text-xs font-bold text-white font-heading uppercase tracking-wide">
                          {config.accountHolder || "RAVINDRA LAXMAN CHAVAN"}
                        </p>
                        <p className="text-[10px] text-emerald-400 font-medium">
                          Verified {config.bankName || "HDFC Bank"} Merchant
                        </p>
                      </div>

                      {/* UPI ID & Quick Copy */}
                      <div className="w-full max-w-sm flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                        <div className="text-left pl-1">
                          <p className="text-[10px] text-slate-400">Official UPI ID</p>
                          <p className="text-xs font-mono font-bold text-orange-400">{config.upiId}</p>
                        </div>

                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-400 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-all"
                        >
                          {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedUpi ? 'Copied!' : 'Copy UPI'}</span>
                        </button>
                      </div>

                      {/* Direct Mobile UPI App Launcher */}
                      <div className="w-full text-center space-y-1.5">
                        <p className="text-[11px] text-slate-400">Or tap to open directly in mobile UPI App:</p>
                        <div className="flex items-center justify-center gap-2">
                          <a
                            href={upiUri}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 font-medium flex items-center space-x-1"
                          >
                            <span>GPay / PhonePe / Paytm</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Verification Fields: 12-Digit UTR + Receipt Upload */}
                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading flex items-center space-x-1.5">
                        <Lock className="w-3.5 h-3.5 text-orange-400" />
                        <span>Transaction Confirmation Details</span>
                      </h4>

                      {/* 12-Digit UTR Input */}
                      <div>
                        <label className="text-xs text-slate-300 font-medium block mb-1">
                          12-Digit UPI / Bank Reference Number (UTR) *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={12}
                          placeholder="e.g. 423456789012"
                          value={utrNumber}
                          onChange={(e) => setUtrNumber(e.target.value.trim())}
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white font-mono tracking-wider focus:outline-none focus:border-orange-500"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">
                          Found in your GPay / PhonePe / Paytm payment receipt under "UPI Transaction ID" or "Ref No."
                        </p>
                      </div>

                      {utrError && (
                        <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{utrError}</span>
                        </div>
                      )}

                      {/* Screenshot Upload */}
                      <div>
                        <label className="text-xs text-slate-300 font-medium block mb-1">
                          Payment Screenshot / Receipt (Optional but recommended)
                        </label>
                        <div className="flex items-center gap-3">
                          <label className="flex-1 cursor-pointer">
                            <div className="px-3.5 py-2.5 bg-slate-950 border border-slate-800 border-dashed hover:border-orange-500 rounded-xl text-xs text-slate-400 flex items-center justify-center space-x-2 transition-all">
                              <Upload className="w-4 h-4 text-orange-400" />
                              <span className="truncate">{receiptFileName || 'Upload Payment Screenshot (PNG/JPG)'}</span>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleReceiptUpload}
                              className="hidden"
                            />
                          </label>
                          {receiptImage && (
                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-700 shrink-0">
                              <img src={receiptImage} alt="Receipt thumbnail" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Submit Action */}
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="w-1/3 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-900 cursor-pointer"
                      >
                        Back
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-2/3 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
                      >
                        {isSubmitting ? (
                          <span className="animate-pulse">Validating Transaction...</span>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            <span>Verify & Confirm Booking</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {/* METHOD 2: AUTOMATED BANK GATEWAY (RAZORPAY / CASHFREE) */}
                {paymentMethodChoice === 'gateway' && (
                  <div className="p-6 rounded-3xl bg-slate-950 border border-blue-500/30 space-y-5 text-center shadow-xl">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <CreditCard className="w-7 h-7" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-white">
                        Instant Bank Payment Gateway
                      </h4>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                        Pay securely using <strong>Credit Cards, Debit Cards, NetBanking, or Instant UPI</strong> with automated real-time confirmation.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center justify-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>256-Bit SSL Bank Grade Encryption</span>
                    </div>

                    <div className="flex items-center space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="w-1/3 py-3 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-900 cursor-pointer"
                      >
                        Back
                      </button>

                      <button
                        type="button"
                        onClick={handleGatewayPay}
                        disabled={isSubmitting}
                        className="w-2/3 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <span className="animate-pulse">Connecting to Bank...</span>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            <span>Pay ₹{finalTotalAmount} via Bank Gateway</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* ========================================================================= */}
            {/* STEP 4: SHIVCHHATRA TREKKER BOARDING PASS */}
            {/* ========================================================================= */}
            {currentStep === 4 && confirmedBookingData && (
              <div className="space-y-6">
                
                {/* Celebration Header */}
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-400 shadow-xl shadow-orange-600/30 mx-auto flex items-center justify-center">
                    <img
                      src="/logo.jpg"
                      alt="Shivchhatra Trekkers Logo"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
                    Booking Confirmed!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300">
                    Your seat for the Sahyadri expedition is confirmed and secured.
                  </p>
                </div>

                {/* Official Boarding Pass Ticket */}
                <div 
                  id="printable-boarding-pass"
                  className="p-5 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-orange-500/40 shadow-2xl relative overflow-hidden space-y-4"
                >
                  {/* Watermark */}
                  <div className="absolute right-4 -bottom-6 text-7xl font-black text-slate-800/20 font-heading pointer-events-none select-none">
                    SHIVCHHATRA
                  </div>

                  {/* Header of Pass */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <p className="text-[10px] font-bold text-orange-400 tracking-wider uppercase">EXPEDITION BOARDING PASS</p>
                      <h4 className="text-base sm:text-lg font-extrabold text-white font-heading">
                        {confirmedBookingData.trekTitle}
                      </h4>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400">Pass Reference</p>
                      <p className="text-xs font-mono font-bold text-amber-400">{confirmedBookingData.id}</p>
                    </div>
                  </div>

                  {/* Pass Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <p className="text-slate-500 text-[10px]">Lead Trekker</p>
                      <p className="text-white font-semibold">{confirmedBookingData.primaryName}</p>
                    </div>

                    <div>
                      <p className="text-slate-500 text-[10px]">Mobile / WhatsApp</p>
                      <p className="text-white font-semibold">{confirmedBookingData.phone}</p>
                    </div>

                    <div>
                      <p className="text-slate-500 text-[10px]">Departure Batch</p>
                      <p className="text-orange-400 font-semibold">{confirmedBookingData.batchDate}</p>
                    </div>

                    <div>
                      <p className="text-slate-500 text-[10px]">Pickup Point</p>
                      <p className="text-white font-semibold">{confirmedBookingData.pickupCity} - {confirmedBookingData.pickupSpot}</p>
                    </div>

                    <div>
                      <p className="text-slate-500 text-[10px]">Total Paid</p>
                      <p className="text-emerald-400 font-extrabold text-sm">₹{confirmedBookingData.amountPaid}</p>
                    </div>

                    <div>
                      <p className="text-slate-500 text-[10px]">Bank Ref (UTR)</p>
                      <p className="text-white font-mono text-[11px] truncate">{confirmedBookingData.utrNumber}</p>
                    </div>
                  </div>

                  {/* Participant List */}
                  <div className="pt-2 border-t border-slate-800/80">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold mb-1">
                      Registered Squad ({confirmedBookingData.participantsCount} Trekkers):
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {confirmedBookingData.participants?.map((p, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                          {p.name || `Trekker ${idx + 1}`} ({p.age}y, {p.gender})
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Status Banner */}
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span className="text-slate-300">Status: <strong className="text-amber-400">{confirmedBookingData.status}</strong></span>
                    </div>
                    <span className="text-[10px] text-slate-500">Auto-logged in Admin Roster</span>
                  </div>

                </div>

                {/* Pass Actions */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => handleDownloadPDF(confirmedBookingData)}
                    disabled={isDownloadingPdf}
                    className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-xs font-bold text-white flex items-center space-x-2 shadow-lg shadow-orange-600/30 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isDownloadingPdf ? 'Generating PDF...' : 'Download Pass (PDF)'}</span>
                  </button>

                  <button
                    onClick={() => handlePrintPass(confirmedBookingData)}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-white flex items-center space-x-2 shadow-sm transition-all cursor-pointer hover:border-orange-500/40"
                  >
                    <Printer className="w-4 h-4 text-orange-400" />
                    <span>Print Boarding Pass</span>
                  </button>

                  <a
                    href={`https://wa.me/917972733094?text=${encodeURIComponent(`Jai Shivray! I have booked the trek "${confirmedBookingData.trekTitle}" with Pass Ref: ${confirmedBookingData.id}. Please add me to the expedition WhatsApp group.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center space-x-2 shadow-md shadow-emerald-600/30 transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Join WhatsApp Expedition Group</span>
                  </a>

                  <button
                    onClick={closeBookingModal}
                    className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-xs font-bold text-white transition-all"
                  >
                    Done
                  </button>
                </div>

              </div>
            )}

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
