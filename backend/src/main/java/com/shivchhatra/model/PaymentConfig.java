package com.shivchhatra.model;

import jakarta.persistence.*;

@Entity
@Table(name = "payment_configs")
public class PaymentConfig {

    @Id
    private String id; // default = "default"

    // Option 1: Direct UPI & Merchant Standee
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

    // Option 2: Payment Gateway & Bank API Keys
    private boolean enableGateway;
    private String gatewayProvider; // "razorpay" | "cashfree" | "phonepe"
    private String gatewayKeyId;
    private String gatewayKeySecret;
    private boolean gatewayTestMode;

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

    public boolean isEnableGateway() {
        return enableGateway;
    }

    public void setEnableGateway(boolean enableGateway) {
        this.enableGateway = enableGateway;
    }

    public String getGatewayProvider() {
        return gatewayProvider;
    }

    public void setGatewayProvider(String gatewayProvider) {
        this.gatewayProvider = gatewayProvider;
    }

    public String getGatewayKeyId() {
        return gatewayKeyId;
    }

    public void setGatewayKeyId(String gatewayKeyId) {
        this.gatewayKeyId = gatewayKeyId;
    }

    public String getGatewayKeySecret() {
        return gatewayKeySecret;
    }

    public void setGatewayKeySecret(String gatewayKeySecret) {
        this.gatewayKeySecret = gatewayKeySecret;
    }

    public boolean isGatewayTestMode() {
        return gatewayTestMode;
    }

    public void setGatewayTestMode(boolean gatewayTestMode) {
        this.gatewayTestMode = gatewayTestMode;
    }
}
