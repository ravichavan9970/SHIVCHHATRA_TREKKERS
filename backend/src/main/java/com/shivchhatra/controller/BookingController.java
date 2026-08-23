package com.shivchhatra.controller;

import com.shivchhatra.model.Booking;
import com.shivchhatra.model.Trek;
import com.shivchhatra.model.TrekBatch;
import com.shivchhatra.repository.BookingRepository;
import com.shivchhatra.repository.TrekRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/api")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TrekRepository trekRepository;

    @GetMapping("/admin/bookings")
    public List<Booking> getAllBookings() {
        return bookingRepository.findAllByOrderBySubmittedAtDesc();
    }

    @GetMapping("/bookings/track")
    public ResponseEntity<Booking> trackBooking(@RequestParam("query") String query) {
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        List<Booking> matches = bookingRepository.searchBooking(query.trim());
        if (!matches.isEmpty()) {
            return ResponseEntity.ok(matches.get(0));
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/bookings")
    public ResponseEntity<?> submitBooking(@RequestBody Booking booking) {
        if (booking.getUtrNumber() == null || booking.getUtrNumber().trim().length() < 6) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Valid 12-digit UTR transaction number is required"));
        }

        // Input validation & sanitation
        if (booking.getPrimaryName() == null || booking.getPrimaryName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Lead trekker name is required"));
        }
        if (booking.getPhone() == null || booking.getPhone().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Contact phone number is required"));
        }

        // Anti-Fraud: Check for duplicate UTR
        String cleanUtr = booking.getUtrNumber().trim();
        if (bookingRepository.existsByUtrNumberIgnoreCase(cleanUtr)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Collections.singletonMap("error", "Duplicate UTR: Transaction " + cleanUtr + " has already been used for another booking."));
        }

        if (booking.getId() == null || booking.getId().isEmpty()) {
            int rand = 1000 + new Random().nextInt(9000);
            String candidateId = "ST-2026-" + rand;
            while (bookingRepository.existsById(candidateId)) {
                rand = 1000 + new Random().nextInt(9000);
                candidateId = "ST-2026-" + rand;
            }
            booking.setId(candidateId);
        }

        booking.setPrimaryName(com.shivchhatra.security.SanitizationUtil.sanitizeWithLimit(booking.getPrimaryName(), 100));
        booking.setPhone(com.shivchhatra.security.SanitizationUtil.sanitizeWithLimit(booking.getPhone(), 25));
        if (booking.getEmail() != null) booking.setEmail(com.shivchhatra.security.SanitizationUtil.sanitizeWithLimit(booking.getEmail(), 120));
        if (booking.getEmergencyPhone() != null) booking.setEmergencyPhone(com.shivchhatra.security.SanitizationUtil.sanitizeWithLimit(booking.getEmergencyPhone(), 25));
        if (booking.getPickupCity() != null) booking.setPickupCity(com.shivchhatra.security.SanitizationUtil.sanitizeWithLimit(booking.getPickupCity(), 80));
        if (booking.getPickupSpot() != null) booking.setPickupSpot(com.shivchhatra.security.SanitizationUtil.sanitizeWithLimit(booking.getPickupSpot(), 100));
        if (booking.getParticipantsCount() <= 0) {
            booking.setParticipantsCount(1);
        }

        booking.setUtrNumber(cleanUtr);
        booking.setStatus("Pending Verification");
        booking.setSubmittedAt(Instant.now().toString());
        booking.setVerifiedAt(null);
        if (booking.getAdminNote() == null) {
            booking.setAdminNote("Automated submission recorded in database");
        }

        // Dynamically update batch seats in database
        if (booking.getTrekId() != null) {
            trekRepository.findById(booking.getTrekId()).ifPresent(trek -> {
                if (trek.getBatches() != null) {
                    for (TrekBatch b : trek.getBatches()) {
                        if (booking.getBatchDate() == null || b.getDate().equalsIgnoreCase(booking.getBatchDate())) {
                            int count = booking.getParticipantsCount() > 0 ? booking.getParticipantsCount() : 1;
                            b.setBookedSeats(Math.min(b.getTotalSeats(), b.getBookedSeats() + count));
                            int remaining = b.getTotalSeats() - b.getBookedSeats();
                            b.setStatus(remaining <= 0 ? "Batch Full" : remaining <= 5 ? remaining + " Seats Left" : "Available");
                            break;
                        }
                    }
                    trekRepository.save(trek);
                }
            });
        }

        Booking saved = bookingRepository.save(booking);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/admin/bookings/{id}/verify")
    public ResponseEntity<Booking> verifyBooking(@PathVariable String id, @RequestBody(required = false) Map<String, String> body) {
        return bookingRepository.findById(id).map(booking -> {
            booking.setStatus("Confirmed");
            booking.setVerifiedAt(Instant.now().toString());
            if (body != null) {
                if (body.containsKey("adminNote")) booking.setAdminNote(body.get("adminNote"));
                else if (body.containsKey("note")) booking.setAdminNote(body.get("note"));
                else booking.setAdminNote("Payment verified with bank records by Admin");
            } else {
                booking.setAdminNote("Payment verified with bank records by Admin");
            }
            return ResponseEntity.ok(bookingRepository.save(booking));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/admin/bookings/{id}/reject")
    public ResponseEntity<Booking> rejectBooking(@PathVariable String id, @RequestBody(required = false) Map<String, String> body) {
        return bookingRepository.findById(id).map(booking -> {
            booking.setStatus("Rejected");
            booking.setVerifiedAt(Instant.now().toString());
            if (body != null) {
                if (body.containsKey("adminNote")) booking.setAdminNote(body.get("adminNote"));
                else if (body.containsKey("reason")) booking.setAdminNote(body.get("reason"));
                else if (body.containsKey("note")) booking.setAdminNote(body.get("note"));
                else booking.setAdminNote("Rejected: Invalid transaction ref or unpaid");
            } else {
                booking.setAdminNote("Rejected: Invalid transaction ref or unpaid");
            }

            // Release batch seats in database
            if (booking.getTrekId() != null) {
                trekRepository.findById(booking.getTrekId()).ifPresent(trek -> {
                    if (trek.getBatches() != null) {
                        for (TrekBatch b : trek.getBatches()) {
                            if (booking.getBatchDate() == null || b.getDate().equalsIgnoreCase(booking.getBatchDate())) {
                                int count = booking.getParticipantsCount() > 0 ? booking.getParticipantsCount() : 1;
                                b.setBookedSeats(Math.max(0, b.getBookedSeats() - count));
                                int remaining = b.getTotalSeats() - b.getBookedSeats();
                                b.setStatus(remaining <= 0 ? "Batch Full" : remaining <= 5 ? remaining + " Seats Left" : "Available");
                                break;
                            }
                        }
                        trekRepository.save(trek);
                    }
                });
            }

            return ResponseEntity.ok(bookingRepository.save(booking));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/admin/bookings/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable String id) {
        if (bookingRepository.existsById(id)) {
            bookingRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("success", true));
        }
        return ResponseEntity.notFound().build();
    }
}
