package com.shivchhatra.model;

import jakarta.persistence.*;

@Entity
@Table(name = "payment_configs")
public class PaymentConfig {

    @Id
    private String id; // default = "default"

    private String merchantName;
    private String upiId;
    private String merchantPhone;
    private String accountHolder;
    private String bankName;

    @Lob
    @Column(columnDefinition = "CLOB")
    private String customScannerImage;

    private boolean enableCustomScanner;
    private boolean enableDynamicQR;
    private int permitFee;

    @Column(length = 2000)
    private String securityNotice;

    public PaymentConfig() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMerchantName() {
        return merchantName;
    }

    public void setMerchantName(String merchantName) {
        this.merchantName = merchantName;
    }

    public String getUpiId() {
        return upiId;
    }

    public void setUpiId(String upiId) {
        this.upiId = upiId;
    }

    public String getMerchantPhone() {
        return merchantPhone;
    }

    public void setMerchantPhone(String merchantPhone) {
        this.merchantPhone = merchantPhone;
    }

    public String getAccountHolder() {
        return accountHolder;
    }

    public void setAccountHolder(String accountHolder) {
        this.accountHolder = accountHolder;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getCustomScannerImage() {
        return customScannerImage;
    }

    public void setCustomScannerImage(String customScannerImage) {
        this.customScannerImage = customScannerImage;
    }

    public boolean isEnableCustomScanner() {
        return enableCustomScanner;
    }

    public void setEnableCustomScanner(boolean enableCustomScanner) {
        this.enableCustomScanner = enableCustomScanner;
    }

    public boolean isEnableDynamicQR() {
        return enableDynamicQR;
    }

    public void setEnableDynamicQR(boolean enableDynamicQR) {
        this.enableDynamicQR = enableDynamicQR;
    }

    public int getPermitFee() {
        return permitFee;
    }

    public void setPermitFee(int permitFee) {
        this.permitFee = permitFee;
    }

    public String getSecurityNotice() {
        return securityNotice;
    }

    public void setSecurityNotice(String securityNotice) {
        this.securityNotice = securityNotice;
    }
}
