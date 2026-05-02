package com.example.urlshortener.repository;

import com.example.urlshortener.model.UrlMapping;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class InMemoryUrlRepository implements UrlRepository {

    private final Map<String, UrlMapping> store = new ConcurrentHashMap<>();

    @Override
    public UrlMapping save(UrlMapping urlMapping) {
        store.put(urlMapping.getShortCode(), urlMapping);
        return urlMapping;
    }

    @Override
    public Optional<UrlMapping> findByShortCode(String shortCode) {
        return Optional.ofNullable(store.get(shortCode));
    }

    @Override
    public boolean existsByShortCode(String shortCode) {
        return store.containsKey(shortCode);
    }

    @Override
    public boolean deleteByShortCode(String shortCode) {
        return store.remove(shortCode) != null;
    }

    @Override
    public void incrementClickCount(String shortCode) {
        store.computeIfPresent(shortCode, (key, mapping) -> {
            mapping.setClickCount(mapping.getClickCount() + 1);
            return mapping;
        });
    }

    @Override
    public Optional<UrlMapping> findByLongUrl(String longUrl) {
        return store.values().stream()
                .filter(m -> m.getLongUrl().equals(longUrl))
                .findFirst();
    }

    @Override
    public List<UrlMapping> findAll() {
        return new ArrayList<>(store.values());
    }
}
