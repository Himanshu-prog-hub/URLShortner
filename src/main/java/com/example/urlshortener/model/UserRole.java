package com.example.urlshortener.model;

/**
 * Role enum stored as a VARCHAR in the 'users.role' column.
 *
 * Spring Security convention: role names must start with ROLE_.
 * getAuthorities() returns SimpleGrantedAuthority(role.name())
 * which gives Spring Security "ROLE_USER" or "ROLE_ADMIN".
 *
 * hasRole("USER")  matches ROLE_USER  — Spring adds ROLE_ prefix automatically.
 * hasRole("ADMIN") matches ROLE_ADMIN — same.
 *
 * @EnumType.STRING (set on the entity field) stores the full string "ROLE_USER"
 * in the DB, NOT the ordinal integer.  Never use EnumType.ORDINAL — it breaks
 * the moment you reorder or add values to this enum.
 */
public enum UserRole {
    ROLE_USER,   // default — can shorten URLs and manage own portals
    ROLE_ADMIN   // can delete any URL, future admin endpoints
}
