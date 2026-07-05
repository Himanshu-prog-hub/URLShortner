package com.example.urlshortener.service;

import com.example.urlshortener.dto.AuthRequest;
import com.example.urlshortener.dto.AuthResponse;

public interface AuthService {

    /**
     * Register a new user, hash their password, save to DB, return a JWT.
     * Throws UsernameAlreadyExistsException if the username is taken.
     */
    AuthResponse register(AuthRequest request);

    /**
     * Authenticate username + password via Spring Security's AuthenticationManager.
     * Returns a JWT on success.
     * Throws BadCredentialsException (→ 401) on wrong credentials.
     */
    AuthResponse login(AuthRequest request);
}
