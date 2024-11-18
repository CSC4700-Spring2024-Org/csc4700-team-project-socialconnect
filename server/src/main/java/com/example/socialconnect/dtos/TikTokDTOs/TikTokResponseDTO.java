package com.example.socialconnect.dtos.TikTokDTOs;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TikTokResponseDTO {
    private VideosListDTO videosListDTO;
    private List<String> tiktokVideos;
}
