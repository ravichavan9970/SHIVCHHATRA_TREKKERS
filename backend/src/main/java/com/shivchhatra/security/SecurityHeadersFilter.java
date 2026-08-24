package com.shivchhatra.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 5)
public class SecurityHeadersFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        if (response instanceof HttpServletResponse) {
            HttpServletResponse httpServletResponse = (HttpServletResponse) response;
            
            // OWASP Recommended Defensive Headers
            httpServletResponse.setHeader("X-Content-Type-Options", "nosniff");
            httpServletResponse.setHeader("X-Frame-Options", "SAMEORIGIN");
            httpServletResponse.setHeader("X-XSS-Protection", "1; mode=block");
            httpServletResponse.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
            httpServletResponse.setHeader("Permissions-Policy", "geolocation=(), camera=(), microphone=()");
            
            // Cache control for admin endpoints
            if (request instanceof HttpServletRequest) {
                HttpServletRequest httpRequest = (HttpServletRequest) request;
                if (httpRequest.getRequestURI().contains("/api/admin")) {
                    httpServletResponse.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
                    httpServletResponse.setHeader("Pragma", "no-cache");
                }
            }
        }
        
        chain.doFilter(request, response);
    }
}