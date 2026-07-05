package com.example.urlshortener.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtils {

    private final SecretKey key;
    private final long expirationMs;
    private final String issuer;

    public JwtUtils(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-ms}") long expirationMs,
            @Value("${app.jwt.issuer}") String issuer) {
        // Decoders.BASE64.decode() converts the Base64-encoded secret string to bytes.
        // Keys.hmacShaKeyFor() selects HS256 / HS384 / HS512 based on key length.
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
        this.expirationMs = expirationMs;
        this.issuer = issuer;
    }

    /* ── Token generation ─────────────────────────────────────────────────── */

    public String generateToken(UserDetails userDetails) {
        // Build a claims map with the user's role as a custom claim.
        // The role is read from the first GrantedAuthority — e.g. "ROLE_USER".
        Map<String, Object> extraClaims = new HashMap<>();
        userDetails.getAuthorities().stream()
                .findFirst()
                .ifPresent(a -> extraClaims.put("role", a.getAuthority()));

        return Jwts.builder()
                .claims(extraClaims)           // custom claims (role) — added first
                .subject(userDetails.getUsername())  // sub claim: who the token is for
                .issuer(issuer)                      // iss claim: identifies our app
                .issuedAt(new Date())                // iat claim: creation time
                .expiration(new Date(System.currentTimeMillis() + expirationMs)) // exp
                .signWith(key)                       // sign with HMAC-SHA key
                .compact();                          // serialise to header.payload.signature
    }

    /* ── Claim extraction ─────────────────────────────────────────────────── */

    /**
     * Generic extractor — pass any Claims → T function.
     * Example: extractClaim(token, Claims::getSubject)
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        return claimsResolver.apply(extractAllClaims(token));
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /* ── Validation ───────────────────────────────────────────────────────── */

    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            // Valid if: username matches AND token is not yet expired
            return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
        } catch (JwtException | IllegalArgumentException e) {
            // Catches: expired, malformed, unsupported, invalid signature
            return false;
        }
    }

    /* ── Internal helpers ─────────────────────────────────────────────────── */

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Claims extractAllClaims(String token) {
        // parseSignedClaims() both verifies the HMAC signature AND checks expiry.
        // Throws ExpiredJwtException, MalformedJwtException, etc. on failure.
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
