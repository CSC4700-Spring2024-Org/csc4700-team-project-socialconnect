package com.example.socialconnect.dtos.YoutubeDTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class YoutubeTokenRequestDTO {
    private String scope;
    private String access_token;
    private long expires_in;
    private String refresh_token;
    private String token_type;
}
