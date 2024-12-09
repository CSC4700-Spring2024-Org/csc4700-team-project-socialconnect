package com.example.socialconnect.dtos.YoutubeDTOs;

import java.util.List;

import lombok.Data;

@Data
public class YoutubeAltAnalyticsDTO {
    private String kind;
    private List<Object[]> rows;
    private List<ColumnHeader> columnHeaders;

    @Data
    public static class ColumnHeader {
        private String name;
        private String columnType;
        private String dataType;
    }
}
