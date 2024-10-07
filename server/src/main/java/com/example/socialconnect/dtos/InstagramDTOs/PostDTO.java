package com.example.socialconnect.dtos.InstagramDTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostDTO {
    private String id;
    private String caption;
    private Integer like_count;
    private Integer comments_count;
    private String timestamp;
    private String username;
    private String media_product_type;
    private String media_type;
    private String permalink;
    private String media_url;
}