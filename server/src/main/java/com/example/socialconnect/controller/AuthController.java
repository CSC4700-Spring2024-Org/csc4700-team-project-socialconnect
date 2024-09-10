package com.example.socialconnect.controller;

import com.example.socialconnect.dtos.AuthRequestDTO;
import com.example.socialconnect.dtos.JwtResponseDTO;
import com.example.socialconnect.dtos.UserRequest;
import com.example.socialconnect.models.RefreshToken;
import com.example.socialconnect.models.User;
import com.example.socialconnect.repositories.UserRepository;
import com.example.socialconnect.services.JwtService;
import com.example.socialconnect.services.RefreshTokenService;
import com.example.socialconnect.services.UserService;

import jakarta.servlet.http.HttpServletResponse;

import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = {"https://www.danbfrost.com", "http://localhost:3000"}, maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private JwtService jwtService;

    @Autowired
    RefreshTokenService refreshTokenService;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserService userService;

    ModelMapper modelMapper = new ModelMapper();

    @Value("${jwt.cookieExpiry}")
    private int cookieExpiry;

    @Value("${cookie.domain}")
    private String cookieDomain;

    @PostMapping("/login")
    public ResponseEntity<?> AuthenticateAndGetToken(@RequestBody AuthRequestDTO authRequestDTO, HttpServletResponse response){
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequestDTO.getUsername(), authRequestDTO.getPassword()));
        if(authentication.isAuthenticated()){
            User user = (User) authentication.getPrincipal();
            RefreshToken refreshToken = refreshTokenService.updateRefreshToken(user, authRequestDTO.getUserAgent());
            String accessToken = jwtService.generateToken(authRequestDTO.getUsername());

            ResponseCookie.ResponseCookieBuilder cookie = ResponseCookie.from("accessToken", accessToken)
                    .httpOnly(true)
                    .secure(true)
                    .sameSite("None")
                    .path("/")
                    .maxAge(cookieExpiry);
            if (!cookieDomain.equals("localhost")) {
                cookie.domain(cookieDomain);
            }
            
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.build().toString());
            ResponseCookie.ResponseCookieBuilder refreshCookie = ResponseCookie.from("token", refreshToken.getToken())
                    .httpOnly(true)
                    .secure(true)
                    .sameSite("None")
                    .path("/")
                    .maxAge(cookieExpiry * 12 * 24 * 30);
            if (!cookieDomain.equals("localhost")) {
                cookie.domain(cookieDomain);
            }
            response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.build().toString());
            user.setPassword(null);
            return ResponseEntity.ok(user);

        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

    }


    @PostMapping("/refreshToken")
    public ResponseEntity<?> refreshToken(@CookieValue(name="token") String refreshToken, HttpServletResponse response){
        System.out.println(refreshToken);
        Optional<RefreshToken> optionalEntity = refreshTokenService.findByToken(refreshToken);
        RefreshToken refreshTokenObj;
        if (optionalEntity.isPresent()) {
                refreshTokenObj = optionalEntity.get();
        }
        else {
                return ResponseEntity.badRequest().body("Refresh token not found");
        }
        if (refreshTokenService.verifyExpiration(refreshTokenObj) != null) {
                User user = refreshTokenObj.getUserInfo();
                String accessToken = jwtService.generateToken(user.getUsername());
                ResponseCookie.ResponseCookieBuilder cookie = ResponseCookie.from("accessToken", accessToken)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(cookieExpiry);
                if (!cookieDomain.equals("localhost")) {
                    cookie.domain(cookieDomain);
                }
                
                response.addHeader(HttpHeaders.SET_COOKIE, cookie.build().toString());
                ResponseCookie.ResponseCookieBuilder refreshCookie = ResponseCookie.from("token", refreshTokenObj.getToken())
                        .httpOnly(true)
                        .secure(true)
                        .sameSite("None")
                        .path("/")
                        .maxAge(cookieExpiry * 12 * 24 * 30);
                if (!cookieDomain.equals("localhost")) {
                    cookie.domain(cookieDomain);
                }
                response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.build().toString());
                return ResponseEntity.ok(JwtResponseDTO.builder()
                        .accessToken(accessToken)
                        .token(refreshTokenObj.getToken()).build());
        }
        return ResponseEntity.badRequest().body("Refresh token expired");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRequest userRequest, HttpServletResponse response) {
        User userResponse = userService.saveUser(userRequest);
        if (userResponse.getUsername() == null) {
                return ResponseEntity.badRequest().body("Username already taken");
        }
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(userResponse, userRequest.getUserAgent());
        String accessToken = jwtService.generateToken(userRequest.getUsername());
        // set accessToken to cookie header
        ResponseCookie.ResponseCookieBuilder cookie = ResponseCookie.from("accessToken", accessToken)
            .httpOnly(true)
            .secure(true)
            .sameSite("None")
            .path("/")
            .maxAge(cookieExpiry);
        if (!cookieDomain.equals("localhost")) {
            cookie.domain(cookieDomain);
        }

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.build().toString());
        ResponseCookie.ResponseCookieBuilder refreshCookie = ResponseCookie.from("token", refreshToken.getToken())
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(cookieExpiry * 12 * 24 * 30);
        if (!cookieDomain.equals("localhost")) {
            cookie.domain(cookieDomain);
        }
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.build().toString());
        userRequest.setPassword(null);
        return ResponseEntity.ok(userResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@CookieValue("token")String refreshToken, HttpServletResponse response) {
        refreshTokenService.deleteRefreshToken(refreshToken);
        ResponseCookie cookie = ResponseCookie.from("accessToken", "")
                .domain(cookieDomain)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(0)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        ResponseCookie refreshCookie = ResponseCookie.from("token", "")
                .domain(cookieDomain)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(0)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
        return ResponseEntity.ok().body(null);
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok().body(null);
    }
}
