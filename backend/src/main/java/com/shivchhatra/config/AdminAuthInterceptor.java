package com.shivchhatra.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AdminAuthInterceptor implements HandlerInterceptor {

    @Value("${shivchhatra.admin.passcode:shivchhatra2026}")
    private String adminPasscode;

    @Value("${shivchhatra.admin.secret:shivchhatra-sahyadri-secret-master-token-key-2026}")
    private String secretToken;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // Allow CORS pre-flight requests
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        // Allow login endpoint without prior token
        String path = request.getRequestURI();
        if (path.endsWith("/api/admin/login") || path.endsWith("/api/admin/auth/login")) {
            return true;
        }

        // Extract token or passcode from headers
        String token = request.getHeader("X-Admin-Token");
        String authHeader = request.getHeader("Authorization");

        if (token == null && authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }

        if (token != null && (token.equals(secretToken) || token.equals(adminPasscode) || token.equals("admin-session-" + adminPasscode))) {
            return true;
        }

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"Unauthorized: Valid Admin Token or Passcode required\"}");
        return false;
    }
}
