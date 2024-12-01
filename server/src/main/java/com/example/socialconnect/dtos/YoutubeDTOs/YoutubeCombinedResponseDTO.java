package com.example.socialconnect.dtos.YoutubeDTOs;

import java.util.List;

import lombok.Data;

@Data
public class YoutubeCombinedResponseDTO {
    private String profilePicture;
    private List<YoutubeVideoInfo> videos;

    @Data
    public static class YoutubeVideoInfo {
        private YoutubePlaylistItemListResponse.Item.ContentDetails contentDetails;
        private YoutubeAdvancedStatisticsDTO statistics;
        private YoutubePlaylistItemListResponse.Item.Snippet snippet;
        private YoutubeCommentResponseDTO comments;
    }
}
