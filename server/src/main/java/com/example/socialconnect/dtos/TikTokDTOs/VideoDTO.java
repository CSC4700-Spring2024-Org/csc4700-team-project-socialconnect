package com.example.socialconnect.dtos.TikTokDTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VideoDTO {
    private int like_count;
    private int share_count;
    private String video_description;
    private int view_count;
    private int comment_count;
    private int create_time;
    private String embed_link;
    private String id;
}
