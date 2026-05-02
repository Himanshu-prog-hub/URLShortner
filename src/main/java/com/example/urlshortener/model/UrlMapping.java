package com.example.urlshortener.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UrlMapping {
    private String shortCode;
    private String longUrl;
    private LocalDateTime createdAt;
    private int clickCount;
}
