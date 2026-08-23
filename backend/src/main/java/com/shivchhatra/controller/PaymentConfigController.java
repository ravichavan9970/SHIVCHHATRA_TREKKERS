package com.shivchhatra.controller;

import com.shivchhatra.model.PaymentConfig;
import com.shivchhatra.repository.PaymentConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class PaymentConfigController {

    @Autowired
    private PaymentConfigRepository paymentConfigRepository;

    @GetMapping("/payment-config")
    public ResponseEntity<PaymentConfig> getPaymentConfig() {
        PaymentConfig config = paymentConfigRepository.findById("default").orElseGet(() -> {
            PaymentConfig d = new PaymentConfig();
            d.setId("default");
            d.setMerchantName("Shivchhatra Trekkers (Ravindra Chavan)");
            d.setUpiId("7447661921@hdfc");
            d.setMerchantPhone("+91 74476 61921");
            d.setAccountHolder("RAVINDRA LAXMAN CHAVAN");
            d.setBankName("HDFC Bank");
            d.setCustomScannerImage("/payment_scanner.jpg");
            d.setEnableCustomScanner(true);
            d.setEnableDynamicQR(true);
            d.setPermitFee(100);
            d.setEnableGateway(false);
            d.setGatewayProvider("razorpay");
            d.setSecurityNotice("Verified Official Sahyadri Adventure Portal. Scan through any UPI App (GPay, PhonePe, Paytm, BHIM, CRED).");
            return paymentConfigRepository.save(d);
        });

        // Security: Create sanitized copy for public visitors with gatewayKeySecret masked/excluded
        PaymentConfig safeCopy = new PaymentConfig();
        safeCopy.setId(config.getId());
        safeCopy.setMerchantName(config.getMerchantName());
        safeCopy.setUpiId(config.getUpiId());
        safeCopy.setMerchantPhone(config.getMerchantPhone());
        safeCopy.setAccountHolder(config.getAccountHolder());
        safeCopy.setBankName(config.getBankName());
        safeCopy.setCustomScannerImage(config.getCustomScannerImage());
        safeCopy.setEnableCustomScanner(config.isEnableCustomScanner());
        safeCopy.setEnableDynamicQR(config.isEnableDynamicQR());
        safeCopy.setPermitFee(config.getPermitFee());
        safeCopy.setSecurityNotice(config.getSecurityNotice());
        safeCopy.setEnableGateway(config.isEnableGateway());
        safeCopy.setGatewayProvider(config.getGatewayProvider());
        safeCopy.setGatewayKeyId(config.getGatewayKeyId()); // Public Key ID is safe for checkout frontend
        safeCopy.setGatewayKeySecret(null); // NEVER leak gateway secret key to public visitors
        safeCopy.setGatewayTestMode(config.isGatewayTestMode());

        return ResponseEntity.ok(safeCopy);
    }

    @GetMapping("/admin/payment-config")
    public ResponseEntity<PaymentConfig> getAdminPaymentConfig() {
        PaymentConfig config = paymentConfigRepository.findById("default").orElseGet(() -> {
            PaymentConfig d = new PaymentConfig();
            d.setId("default");
            return paymentConfigRepository.save(d);
        });
        return ResponseEntity.ok(config);
    }

    @PutMapping("/admin/payment-config")
    public ResponseEntity<PaymentConfig> updatePaymentConfig(@RequestBody PaymentConfig updated) {
        PaymentConfig existing = paymentConfigRepository.findById("default").orElseGet(() -> {
            PaymentConfig d = new PaymentConfig();
            d.setId("default");
            return d;
        });

        // Option 1
        if (updated.getMerchantName() != null) existing.setMerchantName(updated.getMerchantName());
        if (updated.getUpiId() != null) existing.setUpiId(updated.getUpiId());
        if (updated.getMerchantPhone() != null) existing.setMerchantPhone(updated.getMerchantPhone());
        if (updated.getAccountHolder() != null) existing.setAccountHolder(updated.getAccountHolder());
        if (updated.getBankName() != null) existing.setBankName(updated.getBankName());
        if (updated.getCustomScannerImage() != null) existing.setCustomScannerImage(updated.getCustomScannerImage());
        existing.setEnableCustomScanner(updated.isEnableCustomScanner());
        existing.setEnableDynamicQR(updated.isEnableDynamicQR());
        if (updated.getPermitFee() > 0) existing.setPermitFee(updated.getPermitFee());
        if (updated.getSecurityNotice() != null) existing.setSecurityNotice(updated.getSecurityNotice());

        // Option 2 (Gateway & Keys)
        existing.setEnableGateway(updated.isEnableGateway());
        if (updated.getGatewayProvider() != null) existing.setGatewayProvider(updated.getGatewayProvider());
        if (updated.getGatewayKeyId() != null) existing.setGatewayKeyId(updated.getGatewayKeyId());
        if (updated.getGatewayKeySecret() != null && !updated.getGatewayKeySecret().trim().isEmpty() && !updated.getGatewayKeySecret().startsWith("••••")) {
            existing.setGatewayKeySecret(updated.getGatewayKeySecret().trim());
        }
        existing.setGatewayTestMode(updated.isGatewayTestMode());

        PaymentConfig saved = paymentConfigRepository.save(existing);
        return ResponseEntity.ok(saved);
    }
}
