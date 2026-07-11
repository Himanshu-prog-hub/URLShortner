package com.example.urlshortener.service;

import com.example.urlshortener.model.User;
import com.example.urlshortener.model.UserRole;
import com.example.urlshortener.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

// Spring Security calls loadUser() automatically once Google has confirmed the
// user's identity and handed back their profile (name, email, picture, etc).
// Our job here is narrow: translate that Google profile into a row in OUR
// users table, so the rest of the app (JwtUtils, UrlMapping.owner, ...) can
// keep working with our own User entity exactly as it does for
// username/password accounts.
@Service
public class OAuth2UserServiceImpl extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public OAuth2UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException {
        // super.loadUser() does the actual network call to Google's
        // userinfo endpoint using the access token Spring already obtained
        // during the OAuth2 handshake. It returns Google's profile as a
        // generic OAuth2User — we don't control its shape, Google does.
        OAuth2User oAuth2User = super.loadUser(request);

        String email = oAuth2User.getAttribute("email");

        // We reuse "username" as the login identifier for both password and
        // OAuth accounts, so a Google user's email IS their username here.
        // findByUsername + orElseGet: look the user up; if this is their
        // first ever Google login, create the row on the spot.
        userRepository.findByUsername(email).orElseGet(() ->
                userRepository.save(User.builder()
                        .username(email)
                        .password("") // no password for OAuth-only accounts — see explanation
                        .role(UserRole.ROLE_USER)
                        .enabled(true)
                        .createdAt(LocalDateTime.now())
                        .build())
        );

        // We still return Google's OAuth2User (not our own User) — this is
        // what Spring Security stores as the Authentication principal for
        // this request. OAuth2SuccessHandler reads the email back off of it
        // to look up our own User row a second time.
        return oAuth2User;
    }
}
