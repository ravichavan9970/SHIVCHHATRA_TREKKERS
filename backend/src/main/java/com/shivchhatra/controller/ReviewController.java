package com.shivchhatra.controller;

import com.shivchhatra.model.Review;
import com.shivchhatra.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @GetMapping("/reviews")
    public List<Review> getAllReviews() {
        return reviewRepository.findAllByOrderByDateDesc();
    }

    @GetMapping("/reviews/stats")
    public Map<String, Object> getReviewStats() {
        List<Review> list = reviewRepository.findAll();
        Map<String, Object> res = new HashMap<>();

        if (list.isEmpty()) {
            res.put("averageRating", "0.0");
            res.put("totalReviews", 0);
            Map<Integer, Integer> breakdown = new HashMap<>();
            for (int i = 1; i <= 5; i++) breakdown.put(i, 0);
            res.put("ratingBreakdown", breakdown);
            return res;
        }

        int total = list.size();
        double sum = list.stream().mapToInt(Review::getRating).sum();
        double avg = Math.round((sum / total) * 10.0) / 10.0;

        Map<Integer, Integer> breakdown = new HashMap<>();
        for (int i = 1; i <= 5; i++) breakdown.put(i, 0);
        for (Review r : list) {
            int score = r.getRating();
            breakdown.put(score, breakdown.getOrDefault(score, 0) + 1);
        }

        res.put("averageRating", String.valueOf(avg));
        res.put("totalReviews", total);
        res.put("ratingBreakdown", breakdown);
        return res;
    }

    @PostMapping("/reviews")
    public ResponseEntity<?> submitReview(@RequestBody Review review) {
        if (review.getUserName() == null || review.getUserName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Trekker name is required"));
        }
        if (review.getComment() == null || review.getComment().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Review feedback comment is required"));
        }

        // Clamp rating securely between 1 and 5
        int rating = review.getRating();
        if (rating < 1) rating = 1;
        if (rating > 5) rating = 5;
        review.setRating(rating);

        // Sanitize string lengths
        String name = review.getUserName().trim();
        if (name.length() > 100) name = name.substring(0, 100);
        review.setUserName(name);

        String comment = review.getComment().trim();
        if (comment.length() > 1000) comment = comment.substring(0, 1000);
        review.setComment(comment);

        if (review.getCity() != null) {
            String city = review.getCity().trim();
            if (city.length() > 80) city = city.substring(0, 80);
            review.setCity(city);
        }

        if (review.getId() == null || review.getId().isEmpty()) {
            review.setId("rev-" + System.currentTimeMillis());
        }
        if (review.getDate() == null || review.getDate().isEmpty()) {
            review.setDate(LocalDate.now().toString());
        }
        review.setVerified(true);
        Review saved = reviewRepository.save(review);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/admin/reviews/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable String id) {
        if (reviewRepository.existsById(id)) {
            reviewRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("success", true));
        }
        return ResponseEntity.notFound().build();
    }
}
