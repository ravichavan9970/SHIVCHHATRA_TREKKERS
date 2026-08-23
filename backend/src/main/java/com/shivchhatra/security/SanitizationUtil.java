package com.shivchhatra.security;

import java.util.regex.Pattern;

public class SanitizationUtil {

    private static final Pattern SCRIPT_TAG_PATTERN = Pattern.compile("(?i)<script[^>]*>[\\s\\S]*?</script>");
    private static final Pattern HTML_TAG_PATTERN = Pattern.compile("<[^>]+>");
    private static final Pattern DANGEROUS_ATTRIBUTES = Pattern.compile("(?i)(javascript:|onerror=|onload=|onclick=|eval\\()");

    public static String sanitize(String input) {
        if (input == null) return null;
        String cleaned = SCRIPT_TAG_PATTERN.matcher(input).replaceAll("");
        cleaned = DANGEROUS_ATTRIBUTES.matcher(cleaned).replaceAll("");
        cleaned = HTML_TAG_PATTERN.matcher(cleaned).replaceAll("");
        return cleaned.trim();
    }

    public static String sanitizeWithLimit(String input, int maxLength) {
        if (input == null) return null;
        String clean = sanitize(input);
        if (clean.length() > maxLength) {
            clean = clean.substring(0, maxLength);
        }
        return clean;
    }
}
