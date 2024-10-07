package com.example.socialconnect.dtos.InstagramDTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BusinessDiscoveryDTO {
    private String username;
    private String website;
    private String name;
    private Long ig_id;
    private String id;
    private String profile_picture_url;
    private String biography;
    private Integer follows_count;
    private Integer followers_count;
    private Integer media_count;
    private BusinessDiscoveryDataDTO media; 
}