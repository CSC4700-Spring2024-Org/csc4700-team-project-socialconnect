package com.example.socialconnect.configurations;

import com.example.socialconnect.helpers.UserDetailsServiceImpl;
import com.example.socialconnect.models.RefreshToken;
import com.example.socialconnect.models.User;
import com.example.socialconnect.services.JwtService;
import com.example.socialconnect.services.RefreshTokenService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    UserDetailsServiceImpl userDetailsServiceImpl;

    @Autowired
    RefreshTokenService refreshTokenService;

    @Value("${jwt.cookieExpiry}")
    private int cookieExpiry;

    @Value("${cookie.domain}")
    private String cookieDomain;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String token = null;
        String username = null;
        String refreshTokenStr = null;
        RefreshToken refreshToken = null;

        if(request.getCookies() != null){
            for(Cookie cookie: request.getCookies()){
                if(cookie.getName().equals("accessToken")){
                    token = cookie.getValue();
                }
                if (cookie.getName().equals("token")) {
                    refreshTokenStr = cookie.getValue();
                }
            }
        }

        if (token != null) {
            username = jwtService.extractUsername(token);
        }

        if (refreshTokenStr != null) {
            Optional<RefreshToken> optionalObj = refreshTokenService.findByToken(refreshTokenStr);
            if (optionalObj.isPresent()) {
                refreshToken = optionalObj.get();
            }
        }

        if (token == null || (username != null && jwtService.isTokenExpired(token))) {
            if (refreshToken != null && refreshTokenService.verifyExpiration(refreshToken) != null) {
                User user = refreshToken.getUserInfo();
                token = jwtService.generateToken(user.getUsername());

                ResponseCookie.ResponseCookieBuilder cookie = ResponseCookie.from("accessToken", token)
                    .httpOnly(true)
                    .secure(true)
                    .sameSite("None")
                    .path("/")
                    .maxAge(cookieExpiry);

                if (!cookieDomain.equals("localhost")) {
                    cookie.domain(cookieDomain);
                }
                response.addHeader(HttpHeaders.SET_COOKIE, cookie.build().toString());
            } else {
                filterChain.doFilter(request, response);
                return;
            }
        }

        if(username != null){
            UserDetails userDetails = userDetailsServiceImpl.loadUserByUsername(username);
            if(jwtService.validateToken(token, userDetails)){
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}
