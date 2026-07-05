package com.example.urlshortener.service;

import com.example.urlshortener.dto.AuthRequest;
import com.example.urlshortener.dto.AuthResponse;
import com.example.urlshortener.exception.UsernameAlreadyExistsException;
import com.example.urlshortener.model.User;
import com.example.urlshortener.model.UserRole;
import com.example.urlshortener.repository.UserRepository;
import com.example.urlshortener.security.JwtUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final long expirationMs;

    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtils jwtUtils,
            AuthenticationManager authenticationManager,
            @Value("${app.jwt.expiration-ms}") long expirationMs) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.authenticationManager = authenticationManager;
        this.expirationMs = expirationMs;
    }

    /* ── register ─────────────────────────────────────────────────────────── */

    @Override
    @Transactional
    public AuthResponse register(AuthRequest request) {

        // 1. Check username is not already taken
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UsernameAlreadyExistsException(request.getUsername());
        }

        // 2. Hash the password — NEVER store plain text.
        //    BCrypt generates a random salt and hashes with 2^12 rounds.
        //    Each call produces a DIFFERENT hash even for the same input.
        String passwordHash = passwordEncoder.encode(request.getPassword());

        // 3. Build and persist the User entity
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordHash)          // stores the BCrypt hash
                .role(UserRole.ROLE_USER)         // all new users start as ROLE_USER
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        // 4. Issue a JWT immediately — user is logged in straight after registration
        String token = jwtUtils.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .role(user.getRole().name())
                .expiresIn(expirationMs)
                .build();
    }

    /* ── login ────────────────────────────────────────────────────────────── */

    @Override
    public AuthResponse login(AuthRequest request) {

        // authenticationManager.authenticate() runs the full Spring Security flow:
        //   1. Calls UserDetailsServiceImpl.loadUserByUsername(username)
        //   2. BCrypt-encodes the submitted password and compares with stored hash
        //   3. Checks isEnabled(), isAccountNonLocked(), isCredentialsNonExpired()
        // If any check fails, it throws BadCredentialsException → caught by GlobalExceptionHandler → 401
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()   // plain password — Spring hashes + compares internally
                )
        );

        // If we reach here, authentication succeeded.
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtUtils.generateToken(userDetails);

        // Load the full User to get role for the response
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .role(user.getRole().name())
                .expiresIn(expirationMs)
                .build();
    }
}
