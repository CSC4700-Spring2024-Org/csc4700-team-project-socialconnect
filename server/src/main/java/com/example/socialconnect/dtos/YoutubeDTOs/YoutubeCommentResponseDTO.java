package com.example.socialconnect.dtos.YoutubeDTOs;

import lombok.Data;
import java.util.List;

@Data
public class YoutubeCommentResponseDTO {
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
        private Snippet snippet;

        @Data
        public static class Snippet {
            private String channelId;
            private String videoId;
            private TopLevelComment topLevelComment;
            private boolean canReply;
            private int totalReplyCount;
            private boolean isPublic;

            @Data
            public static class TopLevelComment {
                private String kind;
                private String etag;
                private String id;
                private CommentSnippet snippet;

                @Data
                public static class CommentSnippet {
                    private String channelId;
                    private String videoId;
                    private String textDisplay;
                    private String textOriginal;
                    private String authorDisplayName;
                    private String authorProfileImageUrl;
                    private String authorChannelUrl;
                    private AuthorChannelId authorChannelId;
                    private boolean canRate;
                    private String viewerRating;
                    private int likeCount;
                    private String publishedAt;
                    private String updatedAt;

                    @Data
                    public static class AuthorChannelId {
                        private String value;
                    }
                }
            }
        }
    }
}
