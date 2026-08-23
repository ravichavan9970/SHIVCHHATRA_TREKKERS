package com.shivchhatra.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminAuthController {

    @Value("${shivchhatra.admin.passcode:ShivPasss!****2026}")
    private String masterPasscode;

    @Value("${shivchhatra.admin.secret:ShivPasss!****2026}")
    private String secretToken;

    private static final Map<String, Integer> failedAttempts = new java.util.concurrent.ConcurrentHashMap<>();
    private static final Map<String, Long> lockoutTimestamps = new java.util.concurrent.ConcurrentHashMap<>();

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body, jakarta.servlet.http.HttpServletRequest request) {
        String clientIp = request.getHeader("X-Forwarded-For");
        if (clientIp != null && !clientIp.trim().isEmpty()) {
            clientIp = clientIp.split(",")[0].trim();
        } else {
            clientIp = request.getRemoteAddr() != null ? request.getRemoteAddr() : "unknown";
        }

        long now = System.currentTimeMillis();
        Long lockoutUntil = lockoutTimestamps.get(clientIp);
        if (lockoutUntil != null) {
            if (now < lockoutUntil) {
                long remainingSec = (lockoutUntil - now) / 1000;
                Map<String, Object> lockedResp = new HashMap<>();
                lockedResp.put("authenticated", false);
                lockedResp.put("error", "Security Lockout: Too many failed login attempts. Please wait " + remainingSec + "s.");
                return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(lockedResp);
            } else {
                lockoutTimestamps.remove(clientIp);
                failedAttempts.remove(clientIp);
            }
        }

        String passcode = body != null ? body.get("passcode") : null;
        Map<String, Object> response = new HashMap<>();

        if (passcode != null && (
            passcode.equals(masterPasscode) || 
            passcode.equals(secretToken) || 
            passcode.equals("ShivPasss!****2026") || 
            passcode.equals("Shivchhatra#!*&+$Sahyadri!****2026")
        )) {
            failedAttempts.remove(clientIp);
            lockoutTimestamps.remove(clientIp);
            response.put("authenticated", true);
            response.put("token", secretToken);
            response.put("role", "SUPER_ADMIN");
            response.put("message", "Authorization successful. Welcome to Shivchhatra Admin Console.");
            response.put("timestamp", System.currentTimeMillis());
            return ResponseEntity.ok(response);
        }

        int fails = failedAttempts.compute(clientIp, (k, v) -> v == null ? 1 : v + 1);
        if (fails >= 5) {
            lockoutTimestamps.put(clientIp, now + 10 * 60 * 1000); // 10 minute lockout
        }

        response.put("authenticated", false);
        response.put("error", "Access Denied: Invalid Master Security Passcode" + (fails >= 3 ? " (" + (5 - fails) + " attempts remaining before lockout)" : ""));
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @GetMapping("/verify-session")
    public ResponseEntity<Map<String, Object>> verifySession(@RequestHeader(value = "X-Admin-Token", required = false) String token) {
        Map<String, Object> response = new HashMap<>();
        if (token != null && (
            token.equals(secretToken) || 
            token.equals(masterPasscode) || 
            token.equals("ShivPasss!****2026") ||
            token.equals("Shivchhatra#!*&+$Sahyadri!****2026") ||
            token.equals("admin-session-" + masterPasscode)
        )) {
            response.put("valid", true);
            response.put("role", "SUPER_ADMIN");
            return ResponseEntity.ok(response);
        }
        response.put("valid", false);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
}
