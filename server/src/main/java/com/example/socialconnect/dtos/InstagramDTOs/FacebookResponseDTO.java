package com.example.socialconnect.dtos.InstagramDTOs;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FacebookResponseDTO {
    private String access_token;
    private String token_type;
    private int expires_in;
}
