package com.example.socialconnect.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.socialconnect.services.InstagramService;

@CrossOrigin(origins = {"https://www.danbfrost.com", "http://localhost:3000"}, maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api")
public class InstagramController {
    @Autowired
    InstagramService instagramService;

    @GetMapping("/instagramProfile")
    public ResponseEntity<?> getInstagramProfile(@RequestParam String token) {
        return ResponseEntity.ok(instagramService.getInstagramInfo(token));
    }
}
