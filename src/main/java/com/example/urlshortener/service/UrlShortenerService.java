package com.example.urlshortener.service;

import com.example.urlshortener.dto.ShortenRequest;
import com.example.urlshortener.dto.ShortenResponse;
import com.example.urlshortener.dto.StatsResponse;

import java.util.List;

public interface UrlShortenerService {

    /** Shorten a URL, optionally associating it with the given username. */
    ShortenResponse shorten(ShortenRequest request, String username);

    /** Resolve a short code to the original URL and increment click count. Public — no auth. */
    String resolveAndTrack(String shortCode);

    /** Get stats for a single code. */
    StatsResponse getStats(String shortCode);

    /** Delete a portal. Ownership is enforced when username is non-null. */
    void delete(String shortCode, String username);

    /** List all portals owned by the given username. */
    List<StatsResponse> getAllLinks(String username);
}
