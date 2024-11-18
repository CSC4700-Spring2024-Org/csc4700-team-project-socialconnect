package com.example.socialconnect.controller;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import com.example.socialconnect.dtos.InstagramDTOs.CommentDTO;
import com.example.socialconnect.dtos.InstagramDTOs.CreatePostDTO;
import com.example.socialconnect.helpers.CustomUserDetails;
import com.example.socialconnect.services.FuturePostService;
import com.example.socialconnect.services.InstagramService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@CrossOrigin(origins = {"https://www.danbfrost.com", "http://localhost:3000"}, maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api")
public class InstagramController {
    @Autowired
    InstagramService instagramService;

    @Autowired
    FuturePostService futurePostService;

    @Value("${tiktok.key}")
    private String tiktokClientKey;

    @Value("${tiktok.redirect.uri}")
    private String tiktokRedirectURI;

    @Value("${cookie.domain}")
    private String cookieDomain;

    @GetMapping("/instagramProfile")
    public ResponseEntity<?> getInstagramProfile() {
        return ResponseEntity.ok(instagramService.getSocialsInfo());
    }

    @PostMapping("/createInstagramPost")
    public ResponseEntity<?> createInstagramPost(@RequestPart("post") CreatePostDTO postDTO, @RequestPart("file") MultipartFile[] file) {
        return ResponseEntity.ok(instagramService.createInstagramPost(postDTO, file));
    }

    @PostMapping("schedulePost")
    public ResponseEntity<?> schedulePost(@RequestPart("post") CreatePostDTO postDTO, @RequestPart("file") MultipartFile[] file, @RequestPart("datetime") LocalDateTime postDT) {
        return ResponseEntity.ok(futurePostService.saveFuturePost(postDTO, postDT, file));
    }

    @PostMapping("/replyInstagram")
    public ResponseEntity<?> replyInstagram(@RequestBody CommentDTO commentDTO) {
        return ResponseEntity.ok(instagramService.replyComment(commentDTO));
    }

    @PostMapping("/tiktokLogout")
    public ResponseEntity<?> tiktokLogout() {
        return ResponseEntity.ok(instagramService.tiktokLogout());
    }

    @GetMapping("/tiktokInitializeLogin")
    public ResponseEntity<?> tiktokInitializeLogin(HttpServletResponse response) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetail = (CustomUserDetails) authentication.getPrincipal();
        Long userID = userDetail.getUser().getId();

        String csrfState = UUID.randomUUID().toString().replace("-", "").substring(0,10) + "-" +userID;
        String result = "";
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
        for (int i = 0; i < characters.length(); i++) {
            result += characters.charAt((int)(Math.floor(Math.random() * characters.length())));
        }
        try {
            String url = UriComponentsBuilder.fromHttpUrl("https://www.tiktok.com/v2/auth/authorize/")
            .queryParam("client_key", URLEncoder.encode(tiktokClientKey, StandardCharsets.UTF_8.toString()))
            .queryParam("scope", URLEncoder.encode("user.info.basic,user.info.profile,user.info.stats,video.publish,video.upload,video.list", StandardCharsets.UTF_8.toString()))
            .queryParam("response_type", URLEncoder.encode("code", StandardCharsets.UTF_8.toString()))
            .queryParam("redirect_uri", URLEncoder.encode(tiktokRedirectURI, StandardCharsets.UTF_8.toString()))
            .queryParam("state", URLEncoder.encode(csrfState, StandardCharsets.UTF_8.toString()))
            .queryParam("code_challenge", URLEncoder.encode(result, StandardCharsets.UTF_8.toString()))
            .queryParam("code_challenge_method", URLEncoder.encode("S256", StandardCharsets.UTF_8.toString()))
            .build(false)
            .toUriString();

            ResponseCookie.ResponseCookieBuilder cookie = ResponseCookie.from("csrfState", csrfState)
                    .httpOnly(true)
                    .secure(true)
                    .sameSite("None")
                    .path("/")
                    .maxAge(300);

        if (!cookieDomain.equals("localhost")) {
            cookie.domain(cookieDomain);
        }
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.build().toString());
        return ResponseEntity.ok(url);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error generating login URL");
        }
    }

    @GetMapping("/tiktokCallback/")
    public ResponseEntity<?> tiktokCallback(@RequestParam("code") String code, @RequestParam("state") String state, HttpServletRequest request, HttpServletResponse response) throws IOException{
        String csrfStateFromCookie = getCSRFStateFromCookie(request);

        if (csrfStateFromCookie != null && csrfStateFromCookie.equals(state)) {
            response.sendRedirect("https://danbfrost.com/profile");
            return ResponseEntity.ok(instagramService.tiktokCallback(code, state));
        }
        else 
            return ResponseEntity.badRequest().build();
    }

    private String getCSRFStateFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                System.out.println("COOKIE: " + cookie.getName());
                if ("csrfState".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
