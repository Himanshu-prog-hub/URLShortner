package com.example.urlshortener.exception;

public class UrlNotFoundException extends RuntimeException {

    private final String shortCode;

    public UrlNotFoundException(String shortCode) {
        super("No URL found for short code: " + shortCode);
        this.shortCode = shortCode;
    }

    public String getShortCode() {
        return shortCode;
    }
}
