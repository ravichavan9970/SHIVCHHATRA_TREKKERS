package com.shivchhatra.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "gallery_images")
public class GalleryImage {

    @Id
    private String id;

    @Lob
    @Column(columnDefinition = "CLOB", nullable = false)
    private String imageUrl;

    private String caption;
    private String location;
    private String createdAt;

    public GalleryImage() {
    }

    public GalleryImage(String id, String imageUrl, String caption, String location, String createdAt) {
        this.id = id;
        this.imageUrl = imageUrl;
        this.caption = caption;
        this.location = location;
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
