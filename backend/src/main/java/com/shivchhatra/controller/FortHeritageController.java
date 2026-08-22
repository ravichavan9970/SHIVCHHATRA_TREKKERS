package com.shivchhatra.controller;

import com.shivchhatra.model.FortHeritage;
import com.shivchhatra.repository.FortHeritageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class FortHeritageController {

    @Autowired
    private FortHeritageRepository fortHeritageRepository;

    @GetMapping("/forts")
    public List<FortHeritage> getAllForts() {
        return fortHeritageRepository.findAll();
    }

    @GetMapping("/forts/{id}")
    public ResponseEntity<FortHeritage> getFortById(@PathVariable String id) {
        return fortHeritageRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/admin/forts")
    public ResponseEntity<FortHeritage> createFort(@RequestBody FortHeritage fort) {
        if (fort.getId() == null || fort.getId().trim().isEmpty()) {
            fort.setId("fort-" + System.currentTimeMillis());
        }
        FortHeritage saved = fortHeritageRepository.save(fort);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/admin/forts/{id}")
    public ResponseEntity<FortHeritage> updateFort(@PathVariable String id, @RequestBody FortHeritage updated) {
        return fortHeritageRepository.findById(id).map(existing -> {
            if (updated.getName() != null) existing.setName(updated.getName());
            if (updated.getTitle() != null) existing.setTitle(updated.getTitle());
            if (updated.getSignificance() != null) existing.setSignificance(updated.getSignificance());
            if (updated.getAltitude() != null) existing.setAltitude(updated.getAltitude());
            if (updated.getDifficulty() != null) existing.setDifficulty(updated.getDifficulty());
            if (updated.getBaseVillage() != null) existing.setBaseVillage(updated.getBaseVillage());
            if (updated.getBestSeason() != null) existing.setBestSeason(updated.getBestSeason());
            if (updated.getImage() != null) existing.setImage(updated.getImage());
            if (updated.getKeyStructures() != null) existing.setKeyStructures(updated.getKeyStructures());
            if (updated.getHistorySnippet() != null) existing.setHistorySnippet(updated.getHistorySnippet());

            FortHeritage saved = fortHeritageRepository.save(existing);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/admin/forts/{id}")
    public ResponseEntity<?> deleteFort(@PathVariable String id) {
        if (fortHeritageRepository.existsById(id)) {
            fortHeritageRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("success", true));
        }
        return ResponseEntity.notFound().build();
    }
}
