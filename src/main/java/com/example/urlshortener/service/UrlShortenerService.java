package com.example.urlshortener.service;

import com.example.urlshortener.dto.ShortenRequest;
import com.example.urlshortener.dto.ShortenResponse;
import com.example.urlshortener.dto.StatsResponse;

import java.util.List;

public interface UrlShortenerService {
    ShortenResponse shorten(ShortenRequest request);
    String resolveAndTrack(String shortCode);
    StatsResponse getStats(String shortCode);
    void delete(String shortCode);
    List<StatsResponse> getAllLinks();
}
