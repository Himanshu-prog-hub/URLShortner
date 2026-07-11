package com.example.urlshortener.service;

import com.example.urlshortener.dto.ShortenRequest;
import com.example.urlshortener.dto.ShortenResponse;
import com.example.urlshortener.dto.StatsResponse;
import com.example.urlshortener.exception.CodeAlreadyExistsException;
import com.example.urlshortener.exception.UrlNotFoundException;
import com.example.urlshortener.model.UrlMapping;
import com.example.urlshortener.model.User;
import com.example.urlshortener.repository.UrlRepository;
import com.example.urlshortener.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UrlShortenerServiceImpl implements UrlShortenerService {

    private final UrlRepository urlRepository;
    private final UserRepository userRepository;
    private final String baseUrl;
    private final int codeLength;

    public UrlShortenerServiceImpl(
            UrlRepository urlRepository,
            UserRepository userRepository,
            @Value("${app.base-url}") String baseUrl,
            @Value("${app.short-code.length}") int codeLength) {
        this.urlRepository = urlRepository;
        this.userRepository = userRepository;
        this.baseUrl = baseUrl;
        this.codeLength = codeLength;
    }

    /* ── shorten ─────────────────────────────────────────── */
    @Transactional
    @Override
    public ShortenResponse shorten(ShortenRequest request, String username) {
        String normalizedLongUrl = normalizeLongUrl(request.getLongUrl());
        User owner = resolveUser(username);

        // Dedup: if no custom code and same URL already exists for this owner, return it
        if (request.getCustomCode() == null || request.getCustomCode().isBlank()) {
            Optional<UrlMapping> existing = (owner != null)
                    ? urlRepository.findByLongUrlAndOwner(normalizedLongUrl, owner)
                    : urlRepository.findByLongUrl(normalizedLongUrl);

            if (existing.isPresent()) {
                UrlMapping m = existing.get();
                return toShortenResponse(m);
            }
        }

        // Resolve or generate short code
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
                .owner(owner)
                .build();

        urlRepository.save(mapping);
        return toShortenResponse(mapping);
    }

    /* ── resolveAndTrack ────────────────────────────────── */
    @Transactional
    @Override
    public String resolveAndTrack(String shortCode) {
        UrlMapping mapping = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new UrlNotFoundException(shortCode));
        urlRepository.incrementClickCount(shortCode);
        return mapping.getLongUrl();
    }

    /* ── getStats ───────────────────────────────────────── */
    @Override
    public StatsResponse getStats(String shortCode) {
        UrlMapping mapping = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new UrlNotFoundException(shortCode));
        return toStatsResponse(mapping);
    }

    /* ── delete ─────────────────────────────────────────── */
    @Transactional
    @Override
    public void delete(String shortCode, String username) {
        UrlMapping mapping = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new UrlNotFoundException(shortCode));

        // Ownership check: only enforce when both caller and mapping have a user
        if (username != null && mapping.getOwner() != null) {
            User owner = resolveUser(username);
            if (owner != null && !mapping.getOwner().getId().equals(owner.getId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "You do not own this portal");
            }
        }

        boolean deleted = urlRepository.deleteByShortCode(shortCode);
        if (!deleted) {
            throw new UrlNotFoundException(shortCode);
        }
    }

    /* ── getAllLinks ─────────────────────────────────────── */
    @Override
    public List<StatsResponse> getAllLinks(String username) {
        if (username == null) {
            // Anonymous — never leak other users' links to unauthenticated callers
            return List.of();
        }
        User owner = resolveUser(username);
        if (owner == null) {
            // JWT was valid but user row is gone — return nothing, not everything
            return List.of();
        }
        return urlRepository.findAllByOwner(owner).stream()
                .map(this::toStatsResponse)
                .collect(Collectors.toList());
    }

    /* ── helpers ─────────────────────────────────────────── */

    /** Look up User by username; returns null if username is null or not found. */
    private User resolveUser(String username) {
        if (username == null) return null;
        return userRepository.findByUsername(username).orElse(null);
    }

    private ShortenResponse toShortenResponse(UrlMapping m) {
        return ShortenResponse.builder()
                .shortCode(m.getShortCode())
                .shortUrl(baseUrl + "/" + m.getShortCode())
                .longUrl(m.getLongUrl())
                .createdAt(m.getCreatedAt())
                .build();
    }

    private StatsResponse toStatsResponse(UrlMapping m) {
        return StatsResponse.builder()
                .shortCode(m.getShortCode())
                .shortUrl(baseUrl + "/" + m.getShortCode())
                .longUrl(m.getLongUrl())
                .clickCount(m.getClickCount())
                .createdAt(m.getCreatedAt())
                .build();
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
            String host   = uri.getHost()   == null ? null : uri.getHost().toLowerCase();

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
            if (uri.getRawQuery()    != null) normalized.append("?").append(uri.getRawQuery());
            if (uri.getRawFragment() != null) normalized.append("#").append(uri.getRawFragment());
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
