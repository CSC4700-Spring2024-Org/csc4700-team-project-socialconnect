package com.example.socialconnect.dtos.InstagramDTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CreatePostDTO {
    private String[] urls;
    private String caption;
    private String taggedUsers;
    private String location;
    private Boolean postToInstagram;
    private Boolean postToTiktok;
    private Boolean postToYoutube;
}
