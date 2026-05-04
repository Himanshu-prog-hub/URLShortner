package com.example.urlshortener.service;

import com.example.urlshortener.dto.ShortenRequest;
import com.example.urlshortener.dto.ShortenResponse;
import com.example.urlshortener.dto.StatsResponse;
import com.example.urlshortener.exception.CodeAlreadyExistsException;
import com.example.urlshortener.exception.UrlNotFoundException;
import com.example.urlshortener.model.UrlMapping;
import com.example.urlshortener.repository.UrlRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UrlShortenerServiceImpl implements UrlShortenerService {

    private final UrlRepository urlRepository;
    private final String baseUrl;
    private final int codeLength;

    public UrlShortenerServiceImpl(
            UrlRepository urlRepository,
            @Value("${app.base-url}") String baseUrl,
            @Value("${app.short-code.length}") int codeLength) {
        this.urlRepository = urlRepository;
        this.baseUrl = baseUrl;
        this.codeLength = codeLength;
    }

    @Transactional
    @Override
    public ShortenResponse shorten(ShortenRequest request) {
        String normalizedLongUrl = normalizeLongUrl(request.getLongUrl());

        // If no custom code requested and URL was already shortened, return existing entry
        if (request.getCustomCode() == null || request.getCustomCode().isBlank()) {
            Optional<UrlMapping> existing = urlRepository.findByLongUrl(normalizedLongUrl);
            if (existing.isPresent()) {
                UrlMapping m = existing.get();
                return ShortenResponse.builder()
                        .shortCode(m.getShortCode())
                        .shortUrl(baseUrl + "/" + m.getShortCode())
                        .longUrl(m.getLongUrl())
                        .createdAt(m.getCreatedAt())
                        .build();
            }
        }

        String shortCode;
        if (request.getCustomCode() != null && !request.getCustomCode().isBlank()) {
            if (urlRepository.existsByShortCode(request.getCustomCode())) {
                throw new CodeAlreadyExistsException(request.getCustomCode());
            }
            shortCode = request.getCustomCode();
        } else {
            shortCode = generateUniqueCode();
        }

        UrlMapping mapping = UrlMapping.builder()
                .shortCode(shortCode)
                .longUrl(normalizedLongUrl)
                .createdAt(LocalDateTime.now())
                .clickCount(0)
                .build();

        urlRepository.save(mapping);

        return ShortenResponse.builder()
                .shortCode(shortCode)
                .shortUrl(baseUrl + "/" + shortCode)
                .longUrl(normalizedLongUrl)
                .createdAt(mapping.getCreatedAt())
                .build();
    }

    @Transactional
    @Override
    public String resolveAndTrack(String shortCode) {
        UrlMapping mapping = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new UrlNotFoundException(shortCode));
        urlRepository.incrementClickCount(shortCode);
        return mapping.getLongUrl();
    }

    @Transactional
    @Override
    public StatsResponse getStats(String shortCode) {
        UrlMapping mapping = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new UrlNotFoundException(shortCode));
        return StatsResponse.builder()
                .shortCode(mapping.getShortCode())
                .shortUrl(baseUrl + "/" + shortCode)
                .longUrl(mapping.getLongUrl())
                .clickCount(mapping.getClickCount())
                .createdAt(mapping.getCreatedAt())
                .build();
    }

    @Transactional
    @Override
    public void delete(String shortCode) {
        boolean deleted = urlRepository.deleteByShortCode(shortCode);
        if (!deleted) {
            throw new UrlNotFoundException(shortCode);
        }
    }

    @Override
    public List<StatsResponse> getAllLinks() {
        return urlRepository.findAll().stream()
                .map(m -> StatsResponse.builder()
                        .shortCode(m.getShortCode())
                        .shortUrl(baseUrl + "/" + m.getShortCode())
                        .longUrl(m.getLongUrl())
                        .clickCount(m.getClickCount())
                        .createdAt(m.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    private String generateUniqueCode() {
        String code;
        do {
            code = UUID.randomUUID().toString()
                    .replace("-", "")
                    .substring(0, codeLength);
        } while (urlRepository.existsByShortCode(code));
        return code;
    }

    private String normalizeLongUrl(String longUrl) {
        String trimmed = longUrl.trim();
        try {
            URI uri = new URI(trimmed).normalize();
            String scheme = uri.getScheme() == null ? null : uri.getScheme().toLowerCase();
            String host = uri.getHost() == null ? null : uri.getHost().toLowerCase();

            if (scheme == null || host == null) {
                return trimTrailingSlash(trimmed);
            }

            int port = uri.getPort();
            if (("http".equals(scheme) && port == 80) || ("https".equals(scheme) && port == 443)) {
                port = -1;
            }

            String path = uri.getRawPath();
            if (path == null || "/".equals(path)) {
                path = "";
            } else {
                path = trimTrailingSlash(path);
            }

            StringBuilder normalized = new StringBuilder();
            normalized.append(scheme).append("://");
            if (uri.getRawUserInfo() != null) {
                normalized.append(uri.getRawUserInfo()).append("@");
            }
            normalized.append(host);
            if (port != -1) {
                normalized.append(":").append(port);
            }
            normalized.append(path);
            if (uri.getRawQuery() != null) {
                normalized.append("?").append(uri.getRawQuery());
            }
            if (uri.getRawFragment() != null) {
                normalized.append("#").append(uri.getRawFragment());
            }
            return normalized.toString();
        } catch (Exception ex) {
            return trimTrailingSlash(trimmed);
        }
    }

    private String trimTrailingSlash(String value) {
        if (value.length() > 1 && value.endsWith("/")) {
            return value.substring(0, value.length() - 1);
        }
        return value;
    }
}
