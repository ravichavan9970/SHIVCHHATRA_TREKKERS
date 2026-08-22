package com.shivchhatra.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class TrekBatch {

    private String id;
    private String date;
    private int totalSeats;
    private int bookedSeats;
    private String status;

    public TrekBatch() {
    }

    public TrekBatch(String id, String date, int totalSeats, int bookedSeats, String status) {
        this.id = id;
        this.date = date;
        this.totalSeats = totalSeats;
        this.bookedSeats = bookedSeats;
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public int getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(int totalSeats) {
        this.totalSeats = totalSeats;
    }

    public int getBookedSeats() {
        return bookedSeats;
    }

    public void setBookedSeats(int bookedSeats) {
        this.bookedSeats = bookedSeats;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
