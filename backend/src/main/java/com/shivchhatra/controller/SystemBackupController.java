package com.shivchhatra.controller;

import com.shivchhatra.model.*;
import com.shivchhatra.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/api")
public class SystemBackupController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TrekRepository trekRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private PaymentConfigRepository paymentConfigRepository;

    @Autowired
    private FortHeritageRepository fortHeritageRepository;

    @Autowired
    private GalleryImageRepository galleryImageRepository;

    @GetMapping("/admin/system/full-export")
    public ResponseEntity<?> exportFullSystemBackup() {
        List<Booking> bookings = bookingRepository.findAllByOrderBySubmittedAtDesc();
        List<Trek> treks = trekRepository.findAll();
        List<Review> reviews = reviewRepository.findAllByOrderByDateDesc();
        List<PaymentConfig> paymentConfigs = paymentConfigRepository.findAll();
        List<FortHeritage> forts = fortHeritageRepository.findAll();
        List<GalleryImage> gallery = galleryImageRepository.findAll();

        Map<String, Object> payload = new HashMap<>();
        payload.put("system", "Shivchhatra Trekkers Enterprise Disaster Recovery Archive");
        payload.put("version", "2.0");
        payload.put("exportedAt", Instant.now().toString());
        payload.put("totalBookings", bookings.size());
        payload.put("totalTreks", treks.size());
        payload.put("totalReviews", reviews.size());
        payload.put("totalPaymentConfigs", paymentConfigs.size());
        payload.put("totalForts", forts.size());
        payload.put("totalGalleryImages", gallery.size());

        payload.put("bookings", bookings);
        payload.put("treks", treks);
        payload.put("reviews", reviews);
        payload.put("paymentConfigs", paymentConfigs);
        payload.put("forts", forts);
        payload.put("gallery", gallery);

        return ResponseEntity.ok(payload);
    }

    @PostMapping("/admin/system/full-import")
    public ResponseEntity<?> importFullSystemBackup(@RequestBody Map<String, Object> payload) {
        if (payload == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Empty payload"));
        }

        int treksSynced = 0;
        int bookingsSynced = 0;
        int reviewsSynced = 0;
        int paymentConfigsSynced = 0;
        int fortsSynced = 0;
        int gallerySynced = 0;

        // 1. Sync Treks
        if (payload.containsKey("treks") && payload.get("treks") instanceof List) {
            List<?> rawList = (List<?>) payload.get("treks");
            for (Object obj : rawList) {
                if (obj instanceof Map) {
                    Map<?, ?> map = (Map<?, ?>) obj;
                    String id = (String) map.get("id");
                    if (id != null) {
                        Trek trek = trekRepository.findById(id).orElse(new Trek());
                        trek.setId(id);
                        if (map.get("title") != null) trek.setTitle((String) map.get("title"));
                        if (map.get("marathiTitle") != null) trek.setMarathiTitle((String) map.get("marathiTitle"));
                        if (map.get("category") != null) trek.setCategory((String) map.get("category"));
                        if (map.get("difficulty") != null) trek.setDifficulty((String) map.get("difficulty"));
                        if (map.get("difficultyLevel") != null) trek.setDifficultyLevel((String) map.get("difficultyLevel"));
                        if (map.get("duration") != null) trek.setDuration((String) map.get("duration"));
                        if (map.get("elevation") != null) trek.setElevation((String) map.get("elevation"));
                        if (map.get("region") != null) trek.setRegion((String) map.get("region"));
                        if (map.get("price") != null) trek.setPrice(((Number) map.get("price")).intValue());
                        if (map.get("originalPrice") != null) trek.setOriginalPrice(((Number) map.get("originalPrice")).intValue());
                        if (map.get("heroImage") != null) trek.setHeroImage((String) map.get("heroImage"));
                        if (map.get("badge") != null) trek.setBadge((String) map.get("badge"));
                        if (map.get("tagline") != null) trek.setTagline((String) map.get("tagline"));
                        if (map.get("overview") != null) trek.setOverview((String) map.get("overview"));
                        if (map.get("inclusionsJson") != null) trek.setInclusionsJson((String) map.get("inclusionsJson"));
                        if (map.get("exclusionsJson") != null) trek.setExclusionsJson((String) map.get("exclusionsJson"));
                        if (map.get("highlightsJson") != null) trek.setHighlightsJson((String) map.get("highlightsJson"));
                        if (map.get("itineraryJson") != null) trek.setItineraryJson((String) map.get("itineraryJson"));
                        if (map.get("pickUpLocationsJson") != null) trek.setPickUpLocationsJson((String) map.get("pickUpLocationsJson"));
                        trekRepository.save(trek);
                        treksSynced++;
                    }
                }
            }
        }

        // 2. Sync Bookings
        if (payload.containsKey("bookings") && payload.get("bookings") instanceof List) {
            List<?> rawList = (List<?>) payload.get("bookings");
            for (Object obj : rawList) {
                if (obj instanceof Map) {
                    Map<?, ?> map = (Map<?, ?>) obj;
                    String id = (String) map.get("id");
                    if (id != null) {
                        Booking booking = bookingRepository.findById(id).orElse(new Booking());
                        booking.setId(id);
                        if (map.get("trekId") != null) booking.setTrekId((String) map.get("trekId"));
                        if (map.get("trekTitle") != null) booking.setTrekTitle((String) map.get("trekTitle"));
                        if (map.get("batchDate") != null) booking.setBatchDate((String) map.get("batchDate"));
                        if (map.get("primaryName") != null) booking.setPrimaryName((String) map.get("primaryName"));
                        if (map.get("phone") != null) booking.setPhone((String) map.get("phone"));
                        if (map.get("email") != null) booking.setEmail((String) map.get("email"));
                        if (map.get("emergencyPhone") != null) booking.setEmergencyPhone((String) map.get("emergencyPhone"));
                        if (map.get("pickupCity") != null) booking.setPickupCity((String) map.get("pickupCity"));
                        if (map.get("pickupSpot") != null) booking.setPickupSpot((String) map.get("pickupSpot"));
                        if (map.get("participantsCount") != null) booking.setParticipantsCount(((Number) map.get("participantsCount")).intValue());
                        if (map.get("amountPaid") != null) booking.setAmountPaid(((Number) map.get("amountPaid")).intValue());
                        if (map.get("discountAmount") != null) booking.setDiscountAmount(((Number) map.get("discountAmount")).intValue());
                        if (map.get("utrNumber") != null) booking.setUtrNumber((String) map.get("utrNumber"));
                        if (map.get("receiptImage") != null) booking.setReceiptImage((String) map.get("receiptImage"));
                        if (map.get("status") != null) booking.setStatus((String) map.get("status"));
                        if (map.get("submittedAt") != null) booking.setSubmittedAt((String) map.get("submittedAt"));
                        if (map.get("verifiedAt") != null) booking.setVerifiedAt((String) map.get("verifiedAt"));
                        if (map.get("completedAt") != null) booking.setCompletedAt((String) map.get("completedAt"));
                        if (map.get("adminNote") != null) booking.setAdminNote((String) map.get("adminNote"));
                        bookingRepository.save(booking);
                        bookingsSynced++;
                    }
                }
            }
        }

        // 3. Sync Reviews
        if (payload.containsKey("reviews") && payload.get("reviews") instanceof List) {
            List<?> rawList = (List<?>) payload.get("reviews");
            for (Object obj : rawList) {
                if (obj instanceof Map) {
                    Map<?, ?> map = (Map<?, ?>) obj;
                    String id = (String) map.get("id");
                    if (id != null) {
                        Review review = reviewRepository.findById(id).orElse(new Review());
                        review.setId(id);
                        if (map.get("userName") != null) review.setUserName((String) map.get("userName"));
                        if (map.get("city") != null) review.setCity((String) map.get("city"));
                        if (map.get("trekTitle") != null) review.setTrekTitle((String) map.get("trekTitle"));
                        if (map.get("rating") != null) review.setRating(((Number) map.get("rating")).intValue());
                        if (map.get("date") != null) review.setDate((String) map.get("date"));
                        if (map.get("comment") != null) review.setComment((String) map.get("comment"));
                        if (map.get("tag") != null) review.setTag((String) map.get("tag"));
                        if (map.get("verified") != null) review.setVerified((Boolean) map.get("verified"));
                        reviewRepository.save(review);
                        reviewsSynced++;
                    }
                }
            }
        }

        // 4. Sync Payment Configs
        if (payload.containsKey("paymentConfigs") && payload.get("paymentConfigs") instanceof List) {
            List<?> rawList = (List<?>) payload.get("paymentConfigs");
            for (Object obj : rawList) {
                if (obj instanceof Map) {
                    Map<?, ?> map = (Map<?, ?>) obj;
                    String id = (String) map.get("id");
                    if (id != null) {
                        PaymentConfig cfg = paymentConfigRepository.findById(id).orElse(new PaymentConfig());
                        cfg.setId(id);
                        if (map.get("merchantName") != null) cfg.setMerchantName((String) map.get("merchantName"));
                        if (map.get("upiId") != null) cfg.setUpiId((String) map.get("upiId"));
                        if (map.get("merchantPhone") != null) cfg.setMerchantPhone((String) map.get("merchantPhone"));
                        if (map.get("accountHolder") != null) cfg.setAccountHolder((String) map.get("accountHolder"));
                        if (map.get("bankName") != null) cfg.setBankName((String) map.get("bankName"));
                        if (map.get("customScannerImage") != null) cfg.setCustomScannerImage((String) map.get("customScannerImage"));
                        if (map.get("enableCustomScanner") != null) cfg.setEnableCustomScanner((Boolean) map.get("enableCustomScanner"));
                        if (map.get("enableDynamicQR") != null) cfg.setEnableDynamicQR((Boolean) map.get("enableDynamicQR"));
                        if (map.get("permitFee") != null) cfg.setPermitFee(((Number) map.get("permitFee")).intValue());
                        if (map.get("securityNotice") != null) cfg.setSecurityNotice((String) map.get("securityNotice"));
                        if (map.get("enableGateway") != null) cfg.setEnableGateway((Boolean) map.get("enableGateway"));
                        if (map.get("gatewayProvider") != null) cfg.setGatewayProvider((String) map.get("gatewayProvider"));
                        if (map.get("gatewayKeyId") != null) cfg.setGatewayKeyId((String) map.get("gatewayKeyId"));
                        if (map.get("gatewayKeySecret") != null) cfg.setGatewayKeySecret((String) map.get("gatewayKeySecret"));
                        if (map.get("gatewayTestMode") != null) cfg.setGatewayTestMode((Boolean) map.get("gatewayTestMode"));
                        paymentConfigRepository.save(cfg);
                        paymentConfigsSynced++;
                    }
                }
            }
        }

        // 5. Sync Forts
        if (payload.containsKey("forts") && payload.get("forts") instanceof List) {
            List<?> rawList = (List<?>) payload.get("forts");
            for (Object obj : rawList) {
                if (obj instanceof Map) {
                    Map<?, ?> map = (Map<?, ?>) obj;
                    String id = (String) map.get("id");
                    if (id != null) {
                        FortHeritage fort = fortHeritageRepository.findById(id).orElse(new FortHeritage());
                        fort.setId(id);
                        if (map.get("name") != null) fort.setName((String) map.get("name"));
                        if (map.get("title") != null) fort.setTitle((String) map.get("title"));
                        if (map.get("significance") != null) fort.setSignificance((String) map.get("significance"));
                        if (map.get("altitude") != null) fort.setAltitude((String) map.get("altitude"));
                        if (map.get("difficulty") != null) fort.setDifficulty((String) map.get("difficulty"));
                        if (map.get("baseVillage") != null) fort.setBaseVillage((String) map.get("baseVillage"));
                        if (map.get("bestSeason") != null) fort.setBestSeason((String) map.get("bestSeason"));
                        if (map.get("image") != null) fort.setImage((String) map.get("image"));
                        if (map.get("historySnippet") != null) fort.setHistorySnippet((String) map.get("historySnippet"));
                        if (map.get("keyStructures") instanceof List) {
                            List<?> ks = (List<?>) map.get("keyStructures");
                            List<String> listStr = new ArrayList<>();
                            for (Object k : ks) { if (k != null) listStr.add(k.toString()); }
                            fort.setKeyStructures(listStr);
                        }
                        fortHeritageRepository.save(fort);
                        fortsSynced++;
                    }
                }
            }
        }

        // 6. Sync Gallery
        if (payload.containsKey("gallery") && payload.get("gallery") instanceof List) {
            List<?> rawList = (List<?>) payload.get("gallery");
            for (Object obj : rawList) {
                if (obj instanceof Map) {
                    Map<?, ?> map = (Map<?, ?>) obj;
                    String id = (String) map.get("id");
                    if (id != null) {
                        GalleryImage img = galleryImageRepository.findById(id).orElse(new GalleryImage());
                        img.setId(id);
                        if (map.get("imageUrl") != null) img.setImageUrl((String) map.get("imageUrl"));
                        if (map.get("caption") != null) img.setCaption((String) map.get("caption"));
                        if (map.get("location") != null) img.setLocation((String) map.get("location"));
                        if (map.get("createdAt") != null) img.setCreatedAt((String) map.get("createdAt"));
                        galleryImageRepository.save(img);
                        gallerySynced++;
                    }
                }
            }
        }

        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("timestamp", Instant.now().toString());
        resp.put("treksSynced", treksSynced);
        resp.put("bookingsSynced", bookingsSynced);
        resp.put("reviewsSynced", reviewsSynced);
        resp.put("paymentConfigsSynced", paymentConfigsSynced);
        resp.put("fortsSynced", fortsSynced);
        resp.put("gallerySynced", gallerySynced);
        resp.put("totalRecordsReplicated", treksSynced + bookingsSynced + reviewsSynced + paymentConfigsSynced + fortsSynced + gallerySynced);

        return ResponseEntity.ok(resp);
    }
}
