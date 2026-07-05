package com.example.urlshortener.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;      // JWT — client stores this and sends it with every request
    private String username;   // echoed back so the client knows who just logged in
    private String role;       // e.g. "ROLE_USER" — client can use this for UI decisions
    private long expiresIn;    // milliseconds until the token expires (convenience for client)
}
