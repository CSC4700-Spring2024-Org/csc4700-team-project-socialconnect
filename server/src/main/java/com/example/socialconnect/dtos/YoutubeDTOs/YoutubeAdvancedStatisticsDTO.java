package com.example.socialconnect.dtos.YoutubeDTOs;

import lombok.Data;

@Data
public class YoutubeAdvancedStatisticsDTO {
    private Integer likes;
    private Integer views;
    private Integer shares;
    private Integer averageViewDuration;
    private Integer comments;
}
