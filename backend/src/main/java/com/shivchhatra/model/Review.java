package com.shivchhatra.model;

import jakarta.persistence.*;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    private String id;

    private String userName;
    private String city;
    private String trekTitle;
    private int rating;
    private String date;

    @Column(length = 2000)
    private String comment;

    private String tag;
    private boolean verified;

    public Review() {
    }

    public Review(String id, String userName, String city, String trekTitle, int rating, String date, String comment, String tag, boolean verified) {
        this.id = id;
        this.userName = userName;
        this.city = city;
        this.trekTitle = trekTitle;
        this.rating = rating;
        this.date = date;
        this.comment = comment;
        this.tag = tag;
        this.verified = verified;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getTrekTitle() {
        return trekTitle;
    }

    public void setTrekTitle(String trekTitle) {
        this.trekTitle = trekTitle;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }
}
