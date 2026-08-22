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

    @Value("${shivchhatra.admin.passcode:Shivchhatra#!*&+$Sahyadri!****2026}")
    private String masterPasscode;

    @Value("${shivchhatra.admin.secret:Shivchhatra#!*&+$Sahyadri!****2026}")
    private String secretToken;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        String passcode = body.get("passcode");
        Map<String, Object> response = new HashMap<>();

        if (passcode != null && (passcode.equals(masterPasscode) || passcode.equals(secretToken))) {
            response.put("authenticated", true);
            response.put("token", secretToken);
            response.put("role", "SUPER_ADMIN");
            response.put("message", "Authorization successful. Welcome to Shivchhatra Admin Console.");
            response.put("timestamp", System.currentTimeMillis());
            return ResponseEntity.ok(response);
        }

        response.put("authenticated", false);
        response.put("error", "Access Denied: Invalid Master Security Passcode");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @GetMapping("/verify-session")
    public ResponseEntity<Map<String, Object>> verifySession(@RequestHeader(value = "X-Admin-Token", required = false) String token) {
        Map<String, Object> response = new HashMap<>();
        if (token != null && (token.equals(secretToken) || token.equals(masterPasscode) || token.equals("admin-session-" + masterPasscode))) {
            response.put("valid", true);
            response.put("role", "SUPER_ADMIN");
            return ResponseEntity.ok(response);
        }
        response.put("valid", false);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
}
