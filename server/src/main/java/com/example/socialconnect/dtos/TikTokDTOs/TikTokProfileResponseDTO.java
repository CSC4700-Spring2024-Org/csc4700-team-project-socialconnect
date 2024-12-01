package com.example.socialconnect.dtos.TikTokDTOs;

import lombok.Data;

@Data
public class TikTokProfileResponseDTO {
    private TiktokErrorDTO error;
    private TikTokData data;

    @Data
    public static class TikTokData {
        private TikTokUser user;
    }
    @Data
    public static class TikTokUser {
        private String avatar_url;
    }
}
