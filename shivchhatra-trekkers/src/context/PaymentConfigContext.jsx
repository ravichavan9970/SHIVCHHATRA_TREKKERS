import React, { createContext, useContext, useState, useEffect } from 'react';
import { getLivePaymentConfig } from '../services/apiService';

const STORAGE_KEY = 'shivchhatra_payment_config_v2';

const defaultPaymentConfig = {
  merchantName: "Shivchhatra Trekkers (Ravindra Chavan)",
  upiId: "7447661921@hdfc",
  merchantPhone: "+91 74476 61921",
  accountHolder: "RAVINDRA LAXMAN CHAVAN",
  bankName: "HDFC Bank",
  customScannerImage: "/payment_scanner.jpg",
  enableCustomScanner: true,
  enableDynamicQR: true,
  requireReceiptUpload: true,
  taxPercentage: 0, // Zero hidden taxes
  permitFee: 100, // Standard Sahyadri forest eco-permit included
  securityNotice: "Verified Official Sahyadri Adventure Portal. Scan through any UPI App (GPay, PhonePe, Paytm, BHIM, CRED).",
  discounts: [
    { code: "SWARAJYA10", discountPercent: 10, minAmount: 1500, description: "10% Off on Heritage Fort Expeditions" },
    { code: "SAHYADRI5", discountPercent: 5, minAmount: 1000, description: "5% Welcome Trekker Discount" },
    { code: "GROUPTREK", discountPercent: 15, minAmount: 4000, description: "15% Off for Squads of 3+" }
  ]
};

const PaymentConfigContext = createContext();

export function PaymentConfigProvider({ children }) {
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultPaymentConfig, ...JSON.parse(saved) } : defaultPaymentConfig;
    } catch (e) {
      console.error("Failed to load payment config", e);
      return defaultPaymentConfig;
    }
  });

  // Sync with live Java backend and poll periodically
  useEffect(() => {
    async function fetchServerPaymentConfig() {
      const serverConfig = await getLivePaymentConfig();
      if (serverConfig && serverConfig.upiId) {
        setConfig(prev => ({
          ...prev,
          ...serverConfig,
          customScannerImage: serverConfig.customScannerImage || prev.customScannerImage
        }));
      }
    }
    fetchServerPaymentConfig();

    const interval = setInterval(fetchServerPaymentConfig, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error("Failed to save payment config", e);
    }
  }, [config]);

  const updateConfig = (newSettings) => {
    setConfig(prev => ({ ...prev, ...newSettings }));
  };

  const uploadCustomScanner = (base64OrUrl) => {
    setConfig(prev => ({ ...prev, customScannerImage: base64OrUrl, enableCustomScanner: true }));
  };

  const removeCustomScanner = () => {
    setConfig(prev => ({ ...prev, customScannerImage: null }));
  };

  const validateDiscountCode = (code, subtotal) => {
    if (!code) return { valid: false, error: "Please enter a coupon code" };
    const found = config.discounts.find(d => d.code.toUpperCase() === code.trim().toUpperCase());
    if (!found) {
      return { valid: false, error: "Invalid coupon code" };
    }
    if (subtotal < found.minAmount) {
      return { valid: false, error: `Minimum booking amount of ₹${found.minAmount} required for ${found.code}` };
    }
    const discountAmount = Math.round((subtotal * found.discountPercent) / 100);
    return { valid: true, discountAmount, discountPercent: found.discountPercent, code: found.code, description: found.description };
  };

  return (
    <PaymentConfigContext.Provider value={{
      config,
      updateConfig,
      uploadCustomScanner,
      removeCustomScanner,
      validateDiscountCode
    }}>
      {children}
    </PaymentConfigContext.Provider>
  );
}

export function usePaymentConfig() {
  const context = useContext(PaymentConfigContext);
  if (!context) {
    throw new Error('usePaymentConfig must be used within PaymentConfigProvider');
  }
  return context;
}
