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
    public String id;
    public String caption;
    public Integer like_count;
    public Integer comments_count;
    public String timestamp;
    public String username;
    public String media_product_type;
    public String media_type;
    public String permalink;
    public String media_url;
}