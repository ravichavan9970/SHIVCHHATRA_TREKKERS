package com.shivchhatra.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 1)
public class RateLimitingFilter implements Filter {

    private static final Map<String, RequestBucket> clientBuckets = new ConcurrentHashMap<>();
    private static final int MAX_REQUESTS_PER_MINUTE = 120; // Normal browsing
    private static final int MAX_POST_REQUESTS_PER_MINUTE = 30; // Submission endpoints

    private static class RequestBucket {
        long windowStart = System.currentTimeMillis();
        AtomicInteger totalCount = new AtomicInteger(0);
        AtomicInteger postCount = new AtomicInteger(0);
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        if (request instanceof HttpServletRequest && response instanceof HttpServletResponse) {
            HttpServletRequest httpRequest = (HttpServletRequest) request;
            HttpServletResponse httpResponse = (HttpServletResponse) response;

            if ("OPTIONS".equalsIgnoreCase(httpRequest.getMethod())) {
                chain.doFilter(request, response);
                return;
            }

            String clientIp = getClientIp(httpRequest);
            long now = System.currentTimeMillis();

            RequestBucket bucket = clientBuckets.compute(clientIp, (k, v) -> {
                if (v == null || now - v.windowStart > 60000) {
                    RequestBucket nb = new RequestBucket();
                    nb.windowStart = now;
                    return nb;
                }
                return v;
            });

            int total = bucket.totalCount.incrementAndGet();
            if (total > MAX_REQUESTS_PER_MINUTE) {
                httpResponse.setStatus(429); // HTTP 429 Too Many Requests
                httpResponse.setContentType("application/json");
                httpResponse.getWriter().write("{\"error\": \"Rate limit exceeded. Please wait a moment and try again.\"}");
                return;
            }

            if ("POST".equalsIgnoreCase(httpRequest.getMethod()) || "PUT".equalsIgnoreCase(httpRequest.getMethod())) {
                int posts = bucket.postCount.incrementAndGet();
                if (posts > MAX_POST_REQUESTS_PER_MINUTE) {
                    httpResponse.setStatus(429);
                    httpResponse.setContentType("application/json");
                    httpResponse.getWriter().write("{\"error\": \"Too many write requests. Anti-spam throttle active.\"}");
                    return;
                }
            }
        }

        chain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.trim().isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr() != null ? request.getRemoteAddr() : "unknown";
    }
}