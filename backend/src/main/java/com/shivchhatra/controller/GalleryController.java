package com.shivchhatra.controller;

import com.shivchhatra.model.GalleryImage;
import com.shivchhatra.repository.GalleryImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class GalleryController {

    @Autowired
    private GalleryImageRepository galleryImageRepository;

    @GetMapping("/gallery")
    public List<GalleryImage> getGalleryImages() {
        return galleryImageRepository.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping("/admin/gallery")
    public ResponseEntity<GalleryImage> addGalleryImage(@RequestBody GalleryImage item) {
        if (item.getId() == null || item.getId().trim().isEmpty()) {
            item.setId("gal-" + System.currentTimeMillis());
        }
        if (item.getCreatedAt() == null || item.getCreatedAt().trim().isEmpty()) {
            item.setCreatedAt(Instant.now().toString());
        }
        GalleryImage saved = galleryImageRepository.save(item);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/admin/gallery/{id}")
    public ResponseEntity<?> deleteGalleryImage(@PathVariable String id) {
        if (galleryImageRepository.existsById(id)) {
            galleryImageRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("success", true));
        }
        return ResponseEntity.notFound().build();
    }
}
