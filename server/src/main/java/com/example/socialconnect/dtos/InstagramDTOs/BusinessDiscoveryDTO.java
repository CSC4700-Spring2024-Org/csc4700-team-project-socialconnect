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
    public String username;
    public String website;
    public String name;
    public Long ig_id;
    public String id;
    public String profile_picture_url;
    public String biography;
    public Integer follows_count;
    public Integer followers_count;
    public Integer media_count;
    public BusinessDiscoveryDataDTO media; 
}