package com.example.urlshortener.security;

import com.example.urlshortener.service.UserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// @Configuration  — this class declares Spring beans
// @EnableWebSecurity — activates Spring Security's web security support
// @EnableMethodSecurity — enables @PreAuthorize / @PostAuthorize on methods.
//   Without this, @PreAuthorize annotations are SILENTLY IGNORED.
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;
    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(UserDetailsServiceImpl userDetailsService,
                          JwtAuthFilter jwtAuthFilter) {
        this.userDetailsService = userDetailsService;
        this.jwtAuthFilter = jwtAuthFilter;
    }

    // BCryptPasswordEncoder: industry-standard adaptive password hashing.
    // Strength 12 = 2^12 = 4096 rounds — slow enough to resist brute force
    // while staying fast enough for normal login flows (< 200ms).
    // Default is 10; 12 is a good production balance.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    // DaoAuthenticationProvider: wires together UserDetailsService + PasswordEncoder.
    // During login Spring calls:
    //   1. userDetailsService.loadUserByUsername(username) → loads User from DB
    //   2. passwordEncoder.matches(rawPassword, storedHash) → verifies BCrypt hash
    //   3. checks isEnabled(), isAccountNonLocked(), etc.
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    // AuthenticationManager: the entry point for triggering authentication.
    // AuthService calls manager.authenticate(credentials) during login.
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1. Disable CSRF — not needed for stateless REST APIs.
            // CSRF attacks exploit browser cookies; our API uses JWT in the
            // Authorization header (not a cookie), so CSRF cannot occur.
            .csrf(AbstractHttpConfigurer::disable)

            // 2. Authorization rules — evaluated top to bottom; first match wins.
            .authorizeHttpRequests(auth -> auth

                // Public: auth endpoints (register + login)
                .requestMatchers("/auth/**").permitAll()

                // Public: short-link redirect — anyone can follow a short URL
                .requestMatchers(HttpMethod.GET, "/{code:[a-zA-Z0-9_-]+}").permitAll()

                // Admin-only: any /admin/** endpoint
                .requestMatchers("/admin/**").hasRole("ADMIN")
                // hasRole("ADMIN") automatically prepends ROLE_ → matches ROLE_ADMIN.
                // DO NOT use hasAuthority("ADMIN") — that requires an exact match.

                // H2 console — dev convenience only, remove for production
                .requestMatchers("/h2-console/**").permitAll()

                // Everything else: must be authenticated (any valid role)
                .anyRequest().authenticated()
            )

            // 3. Stateless sessions — Spring Security must NEVER create an HTTP session.
            // Every request carries its own JWT; there is no server-side session state.
            .sessionManagement(s ->
                s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // 4. Register our authentication provider
            .authenticationProvider(authenticationProvider())

            // 5. Run our JWT filter BEFORE Spring's default form-login filter.
            // This ensures the token is validated and the SecurityContext is populated
            // before any authorisation decisions are made.
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
