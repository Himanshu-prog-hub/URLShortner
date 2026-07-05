package com.example.urlshortener.controller;

import com.example.urlshortener.dto.AuthRequest;
import com.example.urlshortener.dto.AuthResponse;
import com.example.urlshortener.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// AuthController is intentionally thin — it only handles HTTP concerns:
// parsing the request, calling the service, shaping the response.
// All business logic (password hashing, JWT generation, duplication checks)
// lives in AuthServiceImpl so it can be unit-tested independently.

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // POST /auth/register
    // Permitted to anonymous users — matched by SecurityConfig: /auth/**  permitAll()
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // POST /auth/login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
