package com.example.urlshortener.security;

import com.example.urlshortener.service.OAuth2UserServiceImpl;
import com.example.urlshortener.service.OidcUserServiceImpl;
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
    private final OAuth2UserServiceImpl oAuth2UserService;
    private final OidcUserServiceImpl oidcUserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    public SecurityConfig(UserDetailsServiceImpl userDetailsService,
                          JwtAuthFilter jwtAuthFilter,
                          OAuth2UserServiceImpl oAuth2UserService,
                          OidcUserServiceImpl oidcUserService,
                          OAuth2SuccessHandler oAuth2SuccessHandler) {
        this.userDetailsService = userDetailsService;
        this.jwtAuthFilter = jwtAuthFilter;
        this.oAuth2UserService = oAuth2UserService;
        this.oidcUserService = oidcUserService;
        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
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

            // 3. Session policy — IF_REQUIRED lets Spring create a session ONLY for the
            // OAuth2 handshake (storing the state parameter between the redirect to Google
            // and the callback from Google). Regular API calls still use JWT and never
            // touch a session. STATELESS breaks OAuth2 because the state parameter has
            // nowhere to live between the two HTTP round-trips to Google.
            .sessionManagement(s ->
                s.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))

            // 4. Register our authentication provider
            .authenticationProvider(authenticationProvider())

            // 5. Run our JWT filter BEFORE Spring's default form-login filter.
            // This ensures the token is validated and the SecurityContext is populated
            // before any authorisation decisions are made.
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)

            // 6. Google login. Note there is no explicit permitAll() rule added
            // above for /oauth2/authorization/** or /login/oauth2/code/** —
            // none is needed. Those two paths are handled by dedicated OAuth2
            // filters (OAuth2AuthorizationRequestRedirectFilter and
            // OAuth2LoginAuthenticationFilter) that Spring Security inserts
            // earlier in the filter chain than the authorizeHttpRequests
            // check above, so they run — and redirect to Google, or process
            // Google's callback — before the "everything else must be
            // authenticated" rule ever gets a chance to reject the request.
            .oauth2Login(oauth -> oauth
                .userInfoEndpoint(u -> u
                    // Plain OAuth2 flow (non-OIDC providers like GitHub)
                    .userService(oAuth2UserService)
                    // OIDC flow — used by Google when scope includes "openid".
                    // Without this, Spring's default OidcUserService runs and
                    // never saves the user to our DB, causing NoSuchElementException
                    // in OAuth2SuccessHandler.
                    .oidcUserService(oidcUserService)
                )
                .successHandler(oAuth2SuccessHandler)
            );

        return http.build();
    }
}
