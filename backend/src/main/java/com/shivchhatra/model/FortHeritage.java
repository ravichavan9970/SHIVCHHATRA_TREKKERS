package com.shivchhatra.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "fort_heritages")
public class FortHeritage {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    private String title;

    @Column(length = 2000)
    private String significance;

    private String altitude;
    private String difficulty;
    private String baseVillage;
    private String bestSeason;

    @Lob
    @Column(columnDefinition = "CLOB")
    private String image;

    @Lob
    @Column(columnDefinition = "CLOB")
    private String keyStructuresRaw;

    @Column(length = 4000)
    private String historySnippet;

    public FortHeritage() {
    }

    public FortHeritage(String id, String name, String title, String significance, String altitude, 
                        String difficulty, String baseVillage, String bestSeason, String image, 
                        List<String> keyStructures, String historySnippet) {
        this.id = id;
        this.name = name;
        this.title = title;
        this.significance = significance;
        this.altitude = altitude;
        this.difficulty = difficulty;
        this.baseVillage = baseVillage;
        this.bestSeason = bestSeason;
        this.image = image;
        setKeyStructures(keyStructures);
        this.historySnippet = historySnippet;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSignificance() {
        return significance;
    }

    public void setSignificance(String significance) {
        this.significance = significance;
    }

    public String getAltitude() {
        return altitude;
    }

    public void setAltitude(String altitude) {
        this.altitude = altitude;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getBaseVillage() {
        return baseVillage;
    }

    public void setBaseVillage(String baseVillage) {
        this.baseVillage = baseVillage;
    }

    public String getBestSeason() {
        return bestSeason;
    }

    public void setBestSeason(String bestSeason) {
        this.bestSeason = bestSeason;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    @JsonIgnore
    public String getKeyStructuresRaw() {
        return keyStructuresRaw;
    }

    public void setKeyStructuresRaw(String keyStructuresRaw) {
        this.keyStructuresRaw = keyStructuresRaw;
    }

    @JsonProperty("keyStructures")
    public List<String> getKeyStructures() {
        if (keyStructuresRaw == null || keyStructuresRaw.trim().isEmpty()) {
            return new ArrayList<>();
        }
        return Arrays.stream(keyStructuresRaw.split(" \\|\\| "))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    @JsonProperty("keyStructures")
    public void setKeyStructures(List<String> list) {
        if (list == null || list.isEmpty()) {
            this.keyStructuresRaw = "";
        } else {
            this.keyStructuresRaw = String.join(" || ", list);
        }
    }

    public String getHistorySnippet() {
        return historySnippet;
    }

    public void setHistorySnippet(String historySnippet) {
        this.historySnippet = historySnippet;
    }
}
