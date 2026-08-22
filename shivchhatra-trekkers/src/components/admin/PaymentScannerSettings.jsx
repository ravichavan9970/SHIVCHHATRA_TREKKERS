import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  QrCode, 
  Upload, 
  Trash2, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  DollarSign,
  Tag,
  Plus
} from 'lucide-react';
import { usePaymentConfig } from '../../context/PaymentConfigContext';

export default function PaymentScannerSettings() {
  const { config, updateConfig, uploadCustomScanner, removeCustomScanner } = usePaymentConfig();
  
  const [formData, setFormData] = useState({
    merchantName: config.merchantName,
    upiId: config.upiId,
    merchantPhone: config.merchantPhone,
    accountHolder: config.accountHolder,
    bankName: config.bankName,
    permitFee: config.permitFee || 100,
    enableCustomScanner: config.enableCustomScanner,
    enableDynamicQR: config.enableDynamicQR
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, JPEG, WEBP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      uploadCustomScanner(uploadEvent.target.result);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* Top Header */}
      <div>
        <h3 className="text-lg font-bold text-white font-heading">
          Payment Scanner & Gateway Configuration
        </h3>
        <p className="text-xs text-slate-400">
          Upload and replace your custom payment QR scanner, set merchant UPI details, and manage payment security rules.
        </p>
      </div>

      {savedSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center space-x-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Payment Gateway & Scanner configuration updated successfully!</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Scanner Image Manager */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading flex items-center space-x-1.5">
                <QrCode className="w-4 h-4 text-orange-400" />
                <span>Custom Payment Scanner</span>
              </h4>
              {config.customScannerImage && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  Active
                </span>
              )}
            </div>

            {/* Scanner Preview */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col items-center justify-center space-y-3 min-h-[220px]">
              {config.customScannerImage ? (
                <div className="relative group">
                  <img
                    src={config.customScannerImage}
                    alt="Custom Payment Scanner"
                    className="w-48 h-48 sm:w-52 sm:h-52 object-contain rounded-xl border border-slate-700 bg-white p-2"
                  />
                  <button
                    type="button"
                    onClick={removeCustomScanner}
                    className="absolute -top-2 -right-2 p-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-lg transition-all"
                    title="Remove custom scanner"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-2 py-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-slate-400 font-medium">No custom scanner uploaded</p>
                  <p className="text-[11px] text-slate-500 max-w-[200px]">
                    The system is currently using dynamic real-time generated UPI QR codes.
                  </p>
                </div>
              )}
            </div>

            {/* Upload Action */}
            <div>
              <label className="block cursor-pointer">
                <div className="px-4 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-2 shadow-md shadow-orange-600/30 transition-all text-center">
                  <Upload className="w-4 h-4" />
                  <span>{config.customScannerImage ? 'Replace Scanner Image' : 'Upload Scanner Image'}</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <p className="text-[10px] text-slate-500 mt-2 text-center">
                Supports high-res PNG, JPG, or WEBP payment scanner graphics.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Gateway Settings Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSaveSettings} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading text-orange-400">
              Merchant & UPI Details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="text-slate-400 block mb-1">Official UPI ID (VPA) *</label>
                <input
                  type="text"
                  required
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleInputChange}
                  placeholder="e.g. shivchhatra@okhdfcbank"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Merchant Display Name *</label>
                <input
                  type="text"
                  required
                  name="merchantName"
                  value={formData.merchantName}
                  onChange={handleInputChange}
                  placeholder="Shivchhatra Trekkers"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Merchant Contact Phone</label>
                <input
                  type="text"
                  name="merchantPhone"
                  value={formData.merchantPhone}
                  onChange={handleInputChange}
                  placeholder="+91 98234 56789"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Account Holder Name</label>
                <input
                  type="text"
                  name="accountHolder"
                  value={formData.accountHolder}
                  onChange={handleInputChange}
                  placeholder="Shivchhatra Adventure Foundation"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  placeholder="HDFC Bank / SBI"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Forest Eco Permit Fee (₹)</label>
                <input
                  type="number"
                  name="permitFee"
                  value={formData.permitFee}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Security Notice Preview */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-400 leading-relaxed">
                <strong>Anti-Fraud Security Enabled:</strong> The checkout validates 12-digit UTR bank numbers, flags suspicious or duplicate transaction IDs, and limits booking payment sessions to 15 minutes.
              </p>
            </div>

            {/* Save Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-600/30 flex items-center space-x-2 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Payment Settings</span>
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
}
