package com.example.socialconnect.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.socialconnect.services.FileUploadService;

@CrossOrigin(origins = {"https://www.danbfrost.com", "http://localhost:3000"}, maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api")
public class FileUploadController {
    @Autowired
    private FileUploadService fileUploadService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(MultipartFile file) {
        try {
            return ResponseEntity.ok().body(fileUploadService.uploadFile(file));
        } catch (Exception e) {
            return ResponseEntity.ok().body("Error formatting file");
        }
    }
}
