package com.example.socialconnect.controller;

import com.example.socialconnect.dtos.AuthRequestDTO;
import com.example.socialconnect.dtos.ErrorDTO;
import com.example.socialconnect.dtos.UserRequest;
import com.example.socialconnect.dtos.UserResponse;
import com.example.socialconnect.helpers.CustomUserDetails;
import com.example.socialconnect.models.RefreshToken;
import com.example.socialconnect.models.User;
import com.example.socialconnect.repositories.UserRepository;
import com.example.socialconnect.services.JwtService;
import com.example.socialconnect.services.RefreshTokenService;
import com.example.socialconnect.services.UserService;

import io.jsonwebtoken.io.IOException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.modelmapper.internal.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.repository.query.Param;
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
        System.out.println("hello");
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequestDTO.getUsername(), authRequestDTO.getPassword()));
        System.out.println("AUTHENTICATION DONE");
        if(authentication.isAuthenticated()){
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            if(!userDetails.isEnabled())
            {
                ErrorDTO errorDTO = new ErrorDTO();
                errorDTO.setError("Please Verify Your Email");
                return ResponseEntity.ok(errorDTO);
            }
            User user = userDetails.getUser();
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
                refreshCookie.domain(cookieDomain);
            }
            response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.build().toString());
            user.setPassword(null);
            modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
            Converter<String, Boolean> tokenConverter = context -> context.getSource() != null;
            modelMapper.typeMap(User.class, UserResponse.class).addMappings(mapper -> {
                mapper.using(tokenConverter).map(User::getInstaRefresh, UserResponse::setInstagramConnected);
                mapper.using(tokenConverter).map(User::getTiktokRefresh, UserResponse::setTiktokConnected);
                mapper.using(tokenConverter).map(User::getYoutubeRefresh, UserResponse::setYoutubeConnected);
            });
            UserResponse userResponse = modelMapper.map(user, UserResponse.class);
            return ResponseEntity.ok(userResponse);

        } else {
            ErrorDTO errorDTO = new ErrorDTO();
            errorDTO.setError("Invalid credentials");
            return ResponseEntity.ok(errorDTO);
        }

    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRequest userRequest, HttpServletResponse response, HttpServletRequest request) {
        System.out.println(userRequest.getEmail());
        String randomCode = RandomString.make(64);
        userRequest.setVerificationCode(randomCode);
        userRequest.setEnabled(false);
        User userResponse = userService.saveUser(userRequest);
        if (userResponse.getUsername() == null) {
            ErrorDTO errorDTO = new ErrorDTO();
            errorDTO.setError("Username already taken");
            return ResponseEntity.ok(errorDTO);
        }
        try {
            userService.sendVerificationEmail(userResponse, getSiteURL(request));
        } catch (Exception e) {
            ErrorDTO errorDTO = new ErrorDTO();
            errorDTO.setError("Error sending verification email");
            return ResponseEntity.ok(errorDTO);
        }
        return ResponseEntity.ok().body(null);
        
    }

    @GetMapping("/verify")
    public void verifyUser(@Param("code") String code, HttpServletResponse response) throws IOException, java.io.IOException {
        if (userService.verify(code)) {
            response.sendRedirect("http://localhost:3000/verifySuccess");
        } else {
            response.sendRedirect("http://localhost:3000/verifyFailed");
        }
    }
    


    private String getSiteURL(HttpServletRequest request) {
        String siteURL = request.getRequestURL().toString();
        return siteURL.replace(request.getServletPath(), "");
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