package com.example.socialconnect.dtos.TikTokDTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CombinedTikTokResponseDTO {
    private VideosListDTO videos;
    private String profilePicture;
}
