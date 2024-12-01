package com.example.socialconnect.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserResponse {
    private Long id;
    private String username;
    private Boolean instagramConnected;
    private String email;
    private String verificationCode;
    private Boolean enabled;
    private Boolean tiktokConnected;
    private Boolean youtubeConnected;
}
