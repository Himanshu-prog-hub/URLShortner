package com.example.urlshortener.repository;

import com.example.urlshortener.model.UrlMapping;
import com.example.urlshortener.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IUrlMappingJpaRepository extends JpaRepository<UrlMapping, Long> {

    Optional<UrlMapping> findByShortCode(String shortCode);
    boolean existsByShortCode(String shortCode);
    long deleteByShortCode(String code);

    @Modifying
    @Query("UPDATE UrlMapping u SET u.clickCount = u.clickCount + 1 WHERE u.shortCode = :code")
    void incrementClickCount(@Param("code") String shortCode);

    Optional<UrlMapping> findByLongUrl(String longUrl);
    Optional<UrlMapping> findByLongUrlAndOwner(String longUrl, User owner);
    List<UrlMapping> findAllByOwner(User owner);
}
