package com.example.urlshortener.repository;

import com.example.urlshortener.model.UrlMapping;

import java.util.List;
import java.util.Optional;

public interface UrlRepository {
    UrlMapping save(UrlMapping urlMapping);
    Optional<UrlMapping> findByShortCode(String shortCode);
    boolean existsByShortCode(String shortCode);
    boolean deleteByShortCode(String shortCode);
    void incrementClickCount(String shortCode);
    Optional<UrlMapping> findByLongUrl(String longUrl);
    List<UrlMapping> findAll();
}
