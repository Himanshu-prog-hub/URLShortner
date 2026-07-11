package com.example.urlshortener.security;

import com.example.urlshortener.model.User;
import com.example.urlshortener.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

// This is the ONLY place in the OAuth2 flow that talks to JwtUtils. Everything
// before this point (Google's consent screen, OAuth2UserServiceImpl) is Spring
// Security's own machinery running behind the scenes — it authenticates the
// user and stores the result in the SecurityContext, but the browser is still
// sitting on Google's redirect with nothing useful in hand. This handler is
// the bridge back to OUR app: it fires the instant Spring Security considers
// the user successfully authenticated, mints a JWT exactly like
// AuthServiceImpl.login() does, and sends the browser to the frontend with
// that token attached.
@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final String redirectUri;

    public OAuth2SuccessHandler(
            JwtUtils jwtUtils,
            UserRepository userRepository,
            @Value("${app.oauth2.redirect-uri}") String redirectUri) {
        this.jwtUtils = jwtUtils;
        this.userRepository = userRepository;
        this.redirectUri = redirectUri;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException {

        // authentication.getPrincipal() here is the same OAuth2User that
        // OAuth2UserServiceImpl.loadUser() returned a moment ago — Spring
        // Security carried it through the handshake for us.
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        // Look up OUR User row (guaranteed to exist — OAuth2UserServiceImpl
        // already created it if this was a first-time login) so we have a
        // real User implementing UserDetails to hand to JwtUtils, exactly
        // the same object shape AuthServiceImpl uses for password logins.
        User user = userRepository.findByUsername(email).orElseThrow();
        String token = jwtUtils.generateToken(user);

        // sendRedirect (inherited from the parent handler) issues an HTTP
        // redirect to the Next.js frontend, with the JWT riding along as a
        // query parameter. The frontend's /oauth-callback page (Step 2G)
        // reads it from there.
        getRedirectStrategy().sendRedirect(request, response, redirectUri + "?token=" + token);
    }
}
