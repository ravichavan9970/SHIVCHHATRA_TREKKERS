import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  QrCode, 
  Upload, 
  CheckCircle2, 
  ShieldCheck, 
  Save, 
  RefreshCw, 
  AlertCircle,
  Building,
  User,
  Phone,
  CreditCard
} from 'lucide-react';
import { fetchAdminPaymentConfig, updateAdminPaymentConfig } from '../../services/api';

export default function PaymentScannerSettings() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [previewImage, setPreviewImage] = useState('/payment_scanner.jpg');

  const loadConfig = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminPaymentConfig();
      setConfig(data);
      if (data.customScannerImage) {
        setPreviewImage(data.customScannerImage);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setConfig(prev => ({
          ...prev,
          customScannerImage: reader.result,
          enableCustomScanner: true
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAdminPaymentConfig(config);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      alert('Failed to save settings: ' + err.message);
    }
  };

  if (loading || !config) {
    return (
      <div className="p-8 text-center text-slate-400 flex items-center justify-center space-x-2">
        <RefreshCw className="w-5 h-5 animate-spin text-orange-400" />
        <span>Loading Payment Scanner Config from Database...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h3 className="text-lg font-bold text-white font-heading">
          Payment Scanner & Merchant UPI Master Settings
        </h3>
        <p className="text-xs text-slate-400">
          Direct control over the official merchant scanner, UPI ID, and banking details stored in persistent JPA database.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Scanner Image Preview & Upload */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 text-center">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">
              Official QR Scanner Preview
            </h4>

            <div className="relative mx-auto w-48 h-64 rounded-2xl overflow-hidden border-2 border-orange-500/40 bg-white p-2 shadow-xl flex items-center justify-center">
              <img
                src={previewImage}
                alt="Merchant UPI Scanner"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = '/payment_scanner.jpg';
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="block w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 cursor-pointer transition-colors text-center">
                <Upload className="w-3.5 h-3.5 inline mr-1.5 text-orange-400" />
                <span>Upload New QR Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <p className="text-[10px] text-slate-500">Supports JPG, PNG with sharp QR clarity</p>
            </div>
          </div>

          {/* Configuration Form Fields */}
          <div className="md:col-span-2 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 text-xs">
            <h4 className="text-xs font-bold text-white uppercase tracking-wide flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Merchant Bank Account & UPI Details</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Official UPI ID (VPA)</label>
                <div className="relative">
                  <CreditCard className="w-3.5 h-3.5 text-orange-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={config.upiId}
                    onChange={(e) => setConfig({ ...config, upiId: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Account Holder Name</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-orange-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={config.accountHolder}
                    onChange={(e) => setConfig({ ...config, accountHolder: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Bank Name</label>
                <div className="relative">
                  <Building className="w-3.5 h-3.5 text-orange-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={config.bankName}
                    onChange={(e) => setConfig({ ...config, bankName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Merchant Phone / WhatsApp</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-orange-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={config.merchantPhone}
                    onChange={(e) => setConfig({ ...config, merchantPhone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Display Merchant Title</label>
              <input
                type="text"
                value={config.merchantName}
                onChange={(e) => setConfig({ ...config, merchantName: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Security Notice on Checkout</label>
              <textarea
                rows={2}
                value={config.securityNotice || ''}
                onChange={(e) => setConfig({ ...config, securityNotice: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>

            <div className="flex items-center space-x-4 pt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enableCustomScanner}
                  onChange={(e) => setConfig({ ...config, enableCustomScanner: e.target.checked })}
                  className="rounded border-slate-700 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-slate-300 font-medium">Display Custom HDFC QR Scanner</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enableDynamicQR}
                  onChange={(e) => setConfig({ ...config, enableDynamicQR: e.target.checked })}
                  className="rounded border-slate-700 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-slate-300 font-medium">Allow Dynamic Amount QR</span>
              </label>
            </div>
          </div>

        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {isSaved ? (
            <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settings successfully saved to database!</span>
            </span>
          ) : (
            <span className="text-xs text-slate-500">Changes will instantly apply to all visitor checkout modals.</span>
          )}

          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-600/30 flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save to Database</span>
          </button>
        </div>
      </form>
    </div>
  );
}
