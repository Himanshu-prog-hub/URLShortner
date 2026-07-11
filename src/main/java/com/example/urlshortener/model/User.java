package com.example.urlshortener.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 255)
    private String username;

    @Column(name = "password_hash", nullable = false)
    private String password;
    // Named 'password' so Lombok's @Data generates getPassword()
    // which Spring Security calls during authentication.
    // The value stored is ALWAYS a BCrypt hash — never the plain text.

    @Enumerated(EnumType.STRING)
    // EnumType.STRING stores "ROLE_USER" in the DB column, not "0".
    // NEVER use EnumType.ORDINAL — adding a value anywhere breaks existing rows.
    @Column(nullable = false, length = 20)
    @Builder.Default
    private UserRole role = UserRole.ROLE_USER;

    @Column(nullable = false)
    @Builder.Default
    private boolean enabled = true;
    // Soft-disable: set to false to ban a user without deleting their data.
    // isEnabled() below reads this field — Spring Security rejects disabled users.

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /* ── UserDetails interface ───────────────────────────────────────────────
     * Spring Security calls these methods during authentication and
     * authorisation decisions.  Our User entity implements the interface
     * directly so no extra wrapper class is needed.
     * -------------------------------------------------------------------- */

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // SimpleGrantedAuthority wraps our role string, e.g. "ROLE_USER".
        // Spring Security reads this list when evaluating hasRole() / @PreAuthorize.
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public boolean isAccountNonExpired()     { return true;    }
    // true = accounts never expire.  In production you could check an expiry date.

    @Override
    public boolean isAccountNonLocked()      { return true;    }
    // true = never locked.  In production: lock after N failed login attempts.

    @Override
    public boolean isCredentialsNonExpired() { return true;    }

    @Override
    public boolean isEnabled()               { return enabled; }
    // Reads the 'enabled' DB column.  Set to false via admin endpoint to ban a user.
}
