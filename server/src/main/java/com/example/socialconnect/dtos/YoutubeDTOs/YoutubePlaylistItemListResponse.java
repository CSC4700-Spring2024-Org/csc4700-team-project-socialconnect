package com.example.socialconnect.dtos.YoutubeDTOs;

import lombok.Data;
import java.util.List;

@Data
public class YoutubePlaylistItemListResponse {
    private String kind;
    private String etag;
    private String nextPageToken;
    private List<Item> items;
    private PageInfo pageInfo;

    @Data
    public static class Item {
        private String kind;
        private String etag;
        private String id;
        private Snippet snippet;
        private ContentDetails contentDetails;

        @Data
        public static class Snippet {
            private String publishedAt;
            private String channelId;
            private String title;
            private String description;
            private Thumbnails thumbnails;
            private String channelTitle;
            private String playlistId;
            private int position;
            private ResourceId resourceId;
            private String videoOwnerChannelTitle;
            private String videoOwnerChannelId;

            @Data
            public static class Thumbnails {
                private Thumbnail defaultThumbnail;
                private Thumbnail medium;
                private Thumbnail high;
                private Thumbnail standard;
                private Thumbnail maxres;

                @Data
                public static class Thumbnail {
                    private String url;
                    private int width;
                    private int height;
                }
            }

            @Data
            public static class ResourceId {
                private String kind;
                private String videoId;
            }
        }

        @Data
        public static class ContentDetails {
            private String videoId;
            private String videoPublishedAt;
        }
    }

    @Data
    public static class PageInfo {
        private int totalResults;
        private int resultsPerPage;
    }
}

