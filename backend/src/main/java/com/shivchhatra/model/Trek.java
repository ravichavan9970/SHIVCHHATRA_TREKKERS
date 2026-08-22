package com.shivchhatra.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "treks")
public class Trek {

    @Id
    private String id;

    private String title;
    private String marathiTitle;
    private String category;
    private String difficulty;
    private String difficultyLevel;
    private String duration;
    private String elevation;
    private String region;
    private int price;
    private Integer originalPrice;

    @Lob
    @Column(columnDefinition = "CLOB")
    private String heroImage;

    private String badge;
    private double rating;
    private int reviewsCount;

    @Column(length = 2000)
    private String tagline;

    @Column(length = 4000)
    private String overview;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "trek_batches", joinColumns = @JoinColumn(name = "trek_id"))
    private List<TrekBatch> batches = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "trek_pickups", joinColumns = @JoinColumn(name = "trek_id"))
    private List<PickUpLocation> pickUpLocations = new ArrayList<>();

    @Column(length = 5000)
    private String inclusionsJson;

    @Column(length = 5000)
    private String exclusionsJson;

    @Column(length = 5000)
    private String highlightsJson;

    @Column(length = 10000)
    private String itineraryJson;

    @Column(length = 5000)
    private String pickUpLocationsJson;

    public Trek() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMarathiTitle() {
        return marathiTitle;
    }

    public void setMarathiTitle(String marathiTitle) {
        this.marathiTitle = marathiTitle;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(String difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getElevation() {
        return elevation;
    }

    public void setElevation(String elevation) {
        this.elevation = elevation;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public Integer getOriginalPrice() {
        return originalPrice;
    }

    public void setOriginalPrice(Integer originalPrice) {
        this.originalPrice = originalPrice;
    }

    public String getHeroImage() {
        return heroImage;
    }

    public void setHeroImage(String heroImage) {
        this.heroImage = heroImage;
    }

    public String getBadge() {
        return badge;
    }

    public void setBadge(String badge) {
        this.badge = badge;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public int getReviewsCount() {
        return reviewsCount;
    }

    public void setReviewsCount(int reviewsCount) {
        this.reviewsCount = reviewsCount;
    }

    public String getTagline() {
        return tagline;
    }

    public void setTagline(String tagline) {
        this.tagline = tagline;
    }

    public String getOverview() {
        return overview;
    }

    public void setOverview(String overview) {
        this.overview = overview;
    }

    public List<TrekBatch> getBatches() {
        return batches;
    }

    public void setBatches(List<TrekBatch> batches) {
        this.batches = batches;
    }

    public String getInclusionsJson() {
        return inclusionsJson;
    }

    public void setInclusionsJson(String inclusionsJson) {
        this.inclusionsJson = inclusionsJson;
    }

    public String getExclusionsJson() {
        return exclusionsJson;
    }

    public void setExclusionsJson(String exclusionsJson) {
        this.exclusionsJson = exclusionsJson;
    }

    public String getHighlightsJson() {
        return highlightsJson;
    }

    public void setHighlightsJson(String highlightsJson) {
        this.highlightsJson = highlightsJson;
    }

    public String getItineraryJson() {
        return itineraryJson;
    }

    public void setItineraryJson(String itineraryJson) {
        this.itineraryJson = itineraryJson;
    }

    public String getPickUpLocationsJson() {
        return pickUpLocationsJson;
    }

    public void setPickUpLocationsJson(String pickUpLocationsJson) {
        this.pickUpLocationsJson = pickUpLocationsJson;
    }

    public List<PickUpLocation> getPickUpLocations() {
        return pickUpLocations;
    }

    public void setPickUpLocations(List<PickUpLocation> pickUpLocations) {
        this.pickUpLocations = pickUpLocations;
    }
}
