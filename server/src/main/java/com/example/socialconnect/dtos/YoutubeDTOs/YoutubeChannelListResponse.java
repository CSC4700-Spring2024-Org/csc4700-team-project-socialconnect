package com.example.socialconnect.dtos.YoutubeDTOs;

import lombok.Data;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class YoutubeChannelListResponse {
    private String kind;
    private String etag;
    private PageInfo pageInfo;
    private List<Item> items;

    @Data
    public static class PageInfo {
        private int totalResults;
        private int resultsPerPage;
    }

    @Data
    public static class Item {
        private String kind;
        private String etag;
        private String id;
        private ContentDetails contentDetails;
        private Snippet snippet;

        @Data
        public static class ContentDetails {
            private RelatedPlaylists relatedPlaylists;

            @Data
            public static class RelatedPlaylists {
                private String uploads;
            }
        }

        @Data
        public static class Snippet {
            private String title;
            private String description;
            private String customUrl;
            private String publishedAt;
            private Thumbnails thumbnails;
            private Localized localized;

            @Data
            public static class Thumbnails {
                @JsonProperty("default")
                private ThumbnailDetails defaultThumbnail;
                private ThumbnailDetails medium;
                private ThumbnailDetails high;

                @Data
                public static class ThumbnailDetails {
                    private String url;
                    private int width;
                    private int height;
                }
            }

            @Data
            public static class Localized {
                private String title;
                private String description;
            }
        }
    }
}

