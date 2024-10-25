package com.example.socialconnect.dtos.TikTokDTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AccessTokenRequestDTO {
    private String open_id;
    private String scope;
    private String access_token;
    private long expires_in;
    private String refresh_token;
    private long refresh_expires_in;
    private String token_type;
    private String error_description;
}
