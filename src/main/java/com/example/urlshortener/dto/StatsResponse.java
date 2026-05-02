package com.example.urlshortener.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatsResponse {
    private String shortCode;
    private String shortUrl;
    private String longUrl;
    private int clickCount;
    private LocalDateTime createdAt;
}
