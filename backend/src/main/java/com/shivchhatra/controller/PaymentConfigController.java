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
            d.setSecurityNotice("Verified Official Sahyadri Adventure Portal. Scan through any UPI App (GPay, PhonePe, Paytm, BHIM, CRED).");
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

        PaymentConfig saved = paymentConfigRepository.save(existing);
        return ResponseEntity.ok(saved);
    }
}
