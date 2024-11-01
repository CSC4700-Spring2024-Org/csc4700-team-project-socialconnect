package com.example.socialconnect.dtos.TikTokDTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TiktokErrorDTO {
    private String code;
    private String message;
    private String log_id;
}
