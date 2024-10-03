package com.example.socialconnect.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.socialconnect.dtos.InstagramDTOs.CreatePostDTO;
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

    @PostMapping("/createInstagramPost")
    public ResponseEntity<?> createInstagramPost(@RequestPart("post") CreatePostDTO postDTO, @RequestPart("file") MultipartFile file, @RequestParam String token) {
        return ResponseEntity.ok(instagramService.createInstagramPost(postDTO, file, token));
    }
}
