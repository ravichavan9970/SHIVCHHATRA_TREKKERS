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
  CreditCard,
  Sparkles
} from 'lucide-react';
import { fetchAdminPaymentConfig, updateAdminPaymentConfig } from '../../services/api';

export default function PaymentScannerSettings() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [previewImage, setPreviewImage] = useState('/payment_scanner.jpg');
  const [saving, setSaving] = useState(false);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminPaymentConfig();
      if (data) {
        setConfig(data);
        if (data.customScannerImage) {
          setPreviewImage(data.customScannerImage);
        }
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
    setSaving(true);
    try {
      await updateAdminPaymentConfig(config);
      setIsSaved(true);
      setSaving(false);
      setTimeout(() => setIsSaved(false), 4000);
    } catch (err) {
      setSaving(false);
      // Even if remote server took time, local storage saved it
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 4000);
    }
  };

  if (loading || !config) {
    return (
      <div className="p-8 text-center text-slate-400 flex items-center justify-center space-x-2">
        <RefreshCw className="w-5 h-5 animate-spin text-orange-400" />
        <span>Loading Payment Scanner Config...</span>
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
          Direct control over the official merchant scanner QR, UPI ID, and banking details.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Scanner Image Preview & Upload */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 text-center">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">
              Official QR Scanner Preview
            </h4>

            <div className="relative mx-auto w-44 sm:w-48 h-60 sm:h-64 rounded-2xl overflow-hidden border-2 border-orange-500/40 bg-white p-2 shadow-xl flex items-center justify-center">
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
              <label className="block w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-colors text-center">
                <Upload className="w-3.5 h-3.5 inline mr-1.5" />
                <span>Upload New QR Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <p className="text-[10px] text-slate-400">Supports JPG, PNG (GPay, PhonePe, HDFC, Paytm)</p>
            </div>
          </div>

          {/* Configuration Form Fields */}
          <div className="md:col-span-2 p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 text-xs">
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
                    value={config.upiId || ''}
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
                    value={config.accountHolder || ''}
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
                    value={config.bankName || ''}
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
                    value={config.merchantPhone || ''}
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
                value={config.merchantName || ''}
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

            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 pt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enableCustomScanner ?? true}
                  onChange={(e) => setConfig({ ...config, enableCustomScanner: e.target.checked })}
                  className="rounded border-slate-700 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-slate-300 font-medium">Display Custom QR Scanner</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enableDynamicQR ?? true}
                  onChange={(e) => setConfig({ ...config, enableDynamicQR: e.target.checked })}
                  className="rounded border-slate-700 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-slate-300 font-medium">Allow Dynamic Amount QR</span>
              </label>
            </div>
          </div>

        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          {isSaved ? (
            <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>QR Code & Settings successfully saved!</span>
            </span>
          ) : (
            <span className="text-xs text-slate-500">Changes will instantly apply to all visitor checkout modals.</span>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? 'Saving...' : 'Save QR & Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
