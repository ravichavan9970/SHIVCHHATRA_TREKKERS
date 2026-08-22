package com.shivchhatra.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Embeddable
public class PickUpLocation {

    private String city;

    @Column(length = 2000)
    private String spotsRaw;

    public PickUpLocation() {
    }

    public PickUpLocation(String city, List<String> spots) {
        this.city = city;
        setSpots(spots);
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getSpotsRaw() {
        return spotsRaw;
    }

    public void setSpotsRaw(String spotsRaw) {
        this.spotsRaw = spotsRaw;
    }

    @JsonProperty("spots")
    public List<String> getSpots() {
        if (spotsRaw == null || spotsRaw.trim().isEmpty()) {
            return new ArrayList<>();
        }
        return Arrays.stream(spotsRaw.split("\\|\\|"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    @JsonProperty("spots")
    public void setSpots(List<String> spots) {
        if (spots == null || spots.isEmpty()) {
            this.spotsRaw = "";
        } else {
            this.spotsRaw = String.join(" || ", spots);
        }
    }
}
