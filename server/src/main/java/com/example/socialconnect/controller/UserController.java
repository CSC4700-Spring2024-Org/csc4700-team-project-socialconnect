package com.example.socialconnect.controller;

import com.example.socialconnect.dtos.*;
import com.example.socialconnect.helpers.CustomUserDetails;
import com.example.socialconnect.models.User;
import com.example.socialconnect.services.RefreshTokenService;
import com.example.socialconnect.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = {"https://www.danbfrost.com", "http://localhost:3000"}, maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    RefreshTokenService refreshTokenService;

    @PostMapping(value = "/save")
    public ResponseEntity<User> saveUser(@RequestBody UserRequest userRequest) {
        try {
            User userResponse = userService.saveUser(userRequest);
            userResponse.setPassword(null);
            return ResponseEntity.ok(userResponse);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getUserProfile() {
        try {
            UserResponse userResponse = userService.getUser();
            return ResponseEntity.ok().body(userResponse);
        } catch (Exception e){
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/setInstagram")
    public ResponseEntity<String> setInstagramToken(@RequestBody RefreshTokenRequestDTO token) {
        try {
            String res = userService.updateInstagram(token.getToken());
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/removeMessage")
    public ResponseEntity<?> removeMessage() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            CustomUserDetails userDetail = (CustomUserDetails) authentication.getPrincipal();
            Long userID = userDetail.getUser().getId();
            userService.updatePostStatusMessage(null, userID);
            return ResponseEntity.ok().body(null);
        } catch (Exception e) {
            ErrorDTO error = new ErrorDTO();
            error.setError("Error removing post status message");
            return ResponseEntity.ok().body(error);
        }
    }

}
