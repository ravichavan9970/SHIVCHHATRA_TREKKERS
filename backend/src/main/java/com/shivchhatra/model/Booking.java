package com.shivchhatra.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    private String id; // e.g. ST-2026-8941

    private String trekId;
    private String trekTitle;
    private String batchDate;
    private String primaryName;
    private String phone;
    private String email;
    private String emergencyPhone;
    private String pickupCity;
    private String pickupSpot;
    private int participantsCount;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "booking_participants", joinColumns = @JoinColumn(name = "booking_id"))
    private List<Participant> participants = new ArrayList<>();

    private int amountPaid;
    private int discountAmount;

    @Column(nullable = false, length = 100)
    private String utrNumber;

    @Lob
    @Column(columnDefinition = "CLOB")
    private String receiptImage;

    private String status; // "Pending Verification" | "Confirmed" | "Rejected"
    private String submittedAt;
    private String verifiedAt;
    private String adminNote;

    public Booking() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTrekId() {
        return trekId;
    }

    public void setTrekId(String trekId) {
        this.trekId = trekId;
    }

    public String getTrekTitle() {
        return trekTitle;
    }

    public void setTrekTitle(String trekTitle) {
        this.trekTitle = trekTitle;
    }

    public String getBatchDate() {
        return batchDate;
    }

    public void setBatchDate(String batchDate) {
        this.batchDate = batchDate;
    }

    public String getPrimaryName() {
        return primaryName;
    }

    public void setPrimaryName(String primaryName) {
        this.primaryName = primaryName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getEmergencyPhone() {
        return emergencyPhone;
    }

    public void setEmergencyPhone(String emergencyPhone) {
        this.emergencyPhone = emergencyPhone;
    }

    public String getPickupCity() {
        return pickupCity;
    }

    public void setPickupCity(String pickupCity) {
        this.pickupCity = pickupCity;
    }

    public String getPickupSpot() {
        return pickupSpot;
    }

    public void setPickupSpot(String pickupSpot) {
        this.pickupSpot = pickupSpot;
    }

    public int getParticipantsCount() {
        return participantsCount;
    }

    public void setParticipantsCount(int participantsCount) {
        this.participantsCount = participantsCount;
    }

    public List<Participant> getParticipants() {
        return participants;
    }

    public void setParticipants(List<Participant> participants) {
        this.participants = participants;
    }

    public int getAmountPaid() {
        return amountPaid;
    }

    public void setAmountPaid(int amountPaid) {
        this.amountPaid = amountPaid;
    }

    public int getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(int discountAmount) {
        this.discountAmount = discountAmount;
    }

    public String getUtrNumber() {
        return utrNumber;
    }

    public void setUtrNumber(String utrNumber) {
        this.utrNumber = utrNumber;
    }

    public String getReceiptImage() {
        return receiptImage;
    }

    public void setReceiptImage(String receiptImage) {
        this.receiptImage = receiptImage;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(String submittedAt) {
        this.submittedAt = submittedAt;
    }

    public String getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(String verifiedAt) {
        this.verifiedAt = verifiedAt;
    }

    public String getAdminNote() {
        return adminNote;
    }

    public void setAdminNote(String adminNote) {
        this.adminNote = adminNote;
    }
}
