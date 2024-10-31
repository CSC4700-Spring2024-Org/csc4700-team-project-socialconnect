package com.example.socialconnect.dtos;

import com.example.socialconnect.dtos.InstagramDTOs.BusinessWithCommentsDTO;
import com.example.socialconnect.dtos.TikTokDTOs.VideosListDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SocialsResponse {
    private BusinessWithCommentsDTO instaResponse;
    private VideosListDTO tiktokResponse;
}
