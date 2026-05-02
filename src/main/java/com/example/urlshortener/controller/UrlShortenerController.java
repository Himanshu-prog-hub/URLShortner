package com.example.urlshortener.controller;

import com.example.urlshortener.dto.ShortenRequest;
import com.example.urlshortener.dto.ShortenResponse;
import com.example.urlshortener.dto.StatsResponse;
import com.example.urlshortener.service.UrlShortenerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UrlShortenerController {

    private final UrlShortenerService urlShortenerService;

    public UrlShortenerController(UrlShortenerService urlShortenerService) {
        this.urlShortenerService = urlShortenerService;
    }

    @GetMapping("/links")
    public ResponseEntity<List<StatsResponse>> getAllLinks() {
        return ResponseEntity.ok(urlShortenerService.getAllLinks());
    }

    @PostMapping("/shorten")
    public ResponseEntity<ShortenResponse> shorten(@Valid @RequestBody ShortenRequest request) {
        ShortenResponse response = urlShortenerService.shorten(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{code:[a-zA-Z0-9_-]+}")
    public ResponseEntity<Void> redirect(@PathVariable String code) {
        String longUrl = urlShortenerService.resolveAndTrack(code);
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.LOCATION, longUrl);
        return ResponseEntity.status(HttpStatus.FOUND).headers(headers).build();
    }

    @GetMapping("/stats/{code}")
    public ResponseEntity<StatsResponse> getStats(@PathVariable String code) {
        return ResponseEntity.ok(urlShortenerService.getStats(code));
    }

    @DeleteMapping("/shorten/{code}")
    public ResponseEntity<Void> delete(@PathVariable String code) {
        urlShortenerService.delete(code);
        return ResponseEntity.noContent().build();
    }
}
