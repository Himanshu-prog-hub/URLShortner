package com.example.urlshortener.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.urlshortener.model.UrlMapping;

public interface IUrlMappingJpaRepository extends JpaRepository<UrlMapping,Long>{
    Optional<UrlMapping> findByShortCode(String shortCode);
    boolean existsByShortCode(String shortCode);
    long deleteByShortCode(String code);
    @Modifying
    @Query("Update UrlMapping u SET u.clickCount = u.clickCount + 1 WHERE u.shortCode = :code")
    void incrementClickCount(@Param("code") String shortCode);
    Optional<UrlMapping> findByLongUrl(String longUrl);
}
