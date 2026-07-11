package com.example.urlshortener.service;

import com.example.urlshortener.model.User;
import com.example.urlshortener.model.UserRole;
import com.example.urlshortener.repository.UserRepository;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

// When the OAuth2 scope includes "openid", Google uses the OpenID Connect (OIDC)
// protocol, not plain OAuth2.  Spring Security routes OIDC logins through
// OidcUserService — NOT OAuth2UserService.  Our OAuth2UserServiceImpl is therefore
// never called for Google logins, so the user never gets saved to the database,
// and OAuth2SuccessHandler's findByUsername() throws NoSuchElementException.
//
// This class fixes that: it extends the default OidcUserService (which handles
// all the OIDC token validation and userinfo fetch), then adds our one extra
// step — finding or creating the matching row in OUR users table.
@Service
public class OidcUserServiceImpl extends OidcUserService {

    private final UserRepository userRepository;

    public OidcUserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        // super.loadUser() validates the ID token, calls Google's userinfo endpoint,
        // and returns an OidcUser with all the standard claims (email, name, picture…).
        OidcUser oidcUser = super.loadUser(userRequest);

        // OidcUser.getEmail() is a typed shortcut for getAttribute("email").
        String email = oidcUser.getEmail();

        if (email != null) {
            // Same logic as OAuth2UserServiceImpl: look up existing user, or create
            // a new one on first Google login.  We store the email as the username
            // so it works as a unique login identifier across both auth methods.
            userRepository.findByUsername(email).orElseGet(() ->
                userRepository.save(User.builder()
                    .username(email)
                    .password("")   // no password for OIDC/OAuth accounts
                    .role(UserRole.ROLE_USER)
                    .enabled(true)
                    .createdAt(LocalDateTime.now())
                    .build())
            );
        }

        // Return Google's OidcUser — Spring Security stores this as the Authentication
        // principal.  OAuth2SuccessHandler will cast it back to OAuth2User and read
        // the email attribute to look up our User row for JWT generation.
        return oidcUser;
    }
}
