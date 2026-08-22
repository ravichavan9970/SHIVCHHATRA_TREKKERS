package com.shivchhatra.controller;

import com.shivchhatra.model.Trek;
import com.shivchhatra.repository.TrekRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class TrekController {

    @Autowired
    private TrekRepository trekRepository;

    @GetMapping("/treks")
    public List<Trek> getAllTreks() {
        return trekRepository.findAll();
    }

    @GetMapping("/treks/{id}")
    public ResponseEntity<Trek> getTrekById(@PathVariable String id) {
        return trekRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/admin/treks")
    public ResponseEntity<Trek> createTrek(@RequestBody Trek trek) {
        if (trek.getId() == null || trek.getId().isEmpty()) {
            trek.setId("trek-" + System.currentTimeMillis());
        }
        if (trek.getRating() <= 0) {
            trek.setRating(5.0);
        }
        if (trek.getReviewsCount() <= 0) {
            trek.setReviewsCount(1);
        }
        Trek saved = trekRepository.save(trek);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/admin/treks/{id}")
    public ResponseEntity<Trek> updateTrek(@PathVariable String id, @RequestBody Trek updated) {
        return trekRepository.findById(id).map(existing -> {
            existing.setTitle(updated.getTitle());
            existing.setMarathiTitle(updated.getMarathiTitle());
            existing.setCategory(updated.getCategory());
            existing.setDifficulty(updated.getDifficulty());
            existing.setDifficultyLevel(updated.getDifficultyLevel());
            existing.setDuration(updated.getDuration());
            existing.setElevation(updated.getElevation());
            existing.setRegion(updated.getRegion());
            existing.setPrice(updated.getPrice());
            existing.setOriginalPrice(updated.getOriginalPrice());
            existing.setHeroImage(updated.getHeroImage());
            existing.setBadge(updated.getBadge());
            existing.setTagline(updated.getTagline());
            existing.setOverview(updated.getOverview());
            if (updated.getBatches() != null) {
                existing.setBatches(updated.getBatches());
            }
            if (updated.getPickUpLocations() != null) {
                existing.setPickUpLocations(updated.getPickUpLocations());
            }
            if (updated.getInclusionsJson() != null) existing.setInclusionsJson(updated.getInclusionsJson());
            if (updated.getExclusionsJson() != null) existing.setExclusionsJson(updated.getExclusionsJson());
            if (updated.getHighlightsJson() != null) existing.setHighlightsJson(updated.getHighlightsJson());
            if (updated.getItineraryJson() != null) existing.setItineraryJson(updated.getItineraryJson());
            if (updated.getPickUpLocationsJson() != null) existing.setPickUpLocationsJson(updated.getPickUpLocationsJson());

            return ResponseEntity.ok(trekRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/admin/treks/{id}")
    public ResponseEntity<?> deleteTrek(@PathVariable String id) {
        if (trekRepository.existsById(id)) {
            trekRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("success", true));
        }
        return ResponseEntity.notFound().build();
    }
}
