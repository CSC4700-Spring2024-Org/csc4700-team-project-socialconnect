package com.example.socialconnect.services;

import java.io.File;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import com.example.socialconnect.dtos.ErrorDTO;
import com.example.socialconnect.dtos.PostResultDTO;
import com.example.socialconnect.dtos.SocialsResponse;
import com.example.socialconnect.dtos.UserResponse;
import com.example.socialconnect.dtos.InstagramDTOs.AccountDTO;
import com.example.socialconnect.dtos.InstagramDTOs.BusinessDiscoveryListDTO;
import com.example.socialconnect.dtos.InstagramDTOs.BusinessWithCommentsDTO;
import com.example.socialconnect.dtos.InstagramDTOs.CommentDTO;
import com.example.socialconnect.dtos.InstagramDTOs.CommentResponseDTO;
import com.example.socialconnect.dtos.InstagramDTOs.ContainerProgressDTO;
import com.example.socialconnect.dtos.InstagramDTOs.CreatePostDTO;
import com.example.socialconnect.dtos.InstagramDTOs.GenericIDDTO;
import com.example.socialconnect.dtos.InstagramDTOs.InsightsDTO;
import com.example.socialconnect.dtos.InstagramDTOs.InsightsResponseDTO;
import com.example.socialconnect.dtos.InstagramDTOs.InstaBusinessAcct;
import com.example.socialconnect.dtos.InstagramDTOs.PostDTO;
import com.example.socialconnect.dtos.TikTokDTOs.AccessTokenRequestDTO;
import com.example.socialconnect.dtos.TikTokDTOs.CombinedTikTokResponseDTO;
import com.example.socialconnect.dtos.TikTokDTOs.TikTokProfileResponseDTO;
import com.example.socialconnect.dtos.TikTokDTOs.TiktokErrorDTO;
import com.example.socialconnect.dtos.TikTokDTOs.VideosListDTO;
import com.example.socialconnect.dtos.YoutubeDTOs.YoutubeAdvancedStatisticsDTO;
import com.example.socialconnect.dtos.YoutubeDTOs.YoutubeAltAnalyticsDTO;
import com.example.socialconnect.dtos.YoutubeDTOs.YoutubeChannelListResponse;
import com.example.socialconnect.dtos.YoutubeDTOs.YoutubeCombinedResponseDTO;
import com.example.socialconnect.dtos.YoutubeDTOs.YoutubeCommentResponseDTO;
import com.example.socialconnect.dtos.YoutubeDTOs.YoutubeErrorDTO;
import com.example.socialconnect.dtos.YoutubeDTOs.YoutubePlaylistItemListResponse;
import com.example.socialconnect.dtos.YoutubeDTOs.YoutubeTokenRequestDTO;
import com.example.socialconnect.dtos.YoutubeDTOs.YoutubeCombinedResponseDTO.YoutubeVideoInfo;
import com.example.socialconnect.helpers.CustomUserDetails;
import com.example.socialconnect.models.User;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.FileContent;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.model.Video;
import com.google.api.services.youtube.model.VideoSnippet;
import com.google.api.services.youtube.model.VideoStatus;

@Service
public class InstagramService {
    @Autowired
    FileUploadService fileUploadService;

    @Autowired
    UserService userService;

    ModelMapper modelMapper = new ModelMapper();

    private static final GsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static HttpTransport HTTP_TRANSPORT;

    @Value("${tiktok.key}")
    private String tiktokClientKey;

    @Value("${tiktok.secret}")
    private String tiktokClientSecret;

    @Value("${tiktok.tokenURL}")
    private String tiktokTokenURL;

    @Value("${tiktok.redirect.uri}")
    private String tiktokRedirectURI;

    @Value("${youtube.clientid}")
    private String youtubeClientID;

    @Value("${youtube.secret}")
    private String youtubeSecret;

    private static final RestTemplate restTemplate = new RestTemplate();
    private static final ExecutorService executor = Executors.newFixedThreadPool(8);

    public Object getSocialsInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetail = (CustomUserDetails) authentication.getPrincipal();
        String instaAccessToken = userDetail.getUser().getInstaRefresh();
        String tiktokAccessToken = userDetail.getUser().getTiktokAccess();
        String youtubeAccessToken = userDetail.getUser().getYoutubeAccess();
    
        if (tiktokAccessToken == null && instaAccessToken == null && youtubeAccessToken == null) {
            return handleError("Please connect at least one social media account");
        }
    
        SocialsResponse socialsRes = new SocialsResponse();
        List<CompletableFuture<?>> futures = new ArrayList<>();
    
        if (instaAccessToken != null) {
            CompletableFuture<Void> instaFuture = CompletableFuture.runAsync(() -> {
                try {
                    Object instaInfo = getInstagramInfo(instaAccessToken);
                    socialsRes.setInstaResponse((BusinessWithCommentsDTO) instaInfo);
                } catch (Exception e) {
                    System.err.println("Error fetching Instagram data: " + e.getMessage());
                }
            }, executor);
            futures.add(instaFuture);
        }
    
        if (tiktokAccessToken != null) {
            CompletableFuture<Void> tiktokFuture = CompletableFuture.runAsync(() -> {
                try {
                    Object tiktokInfo = getTiktokInfo(tiktokAccessToken, userDetail.getUser().getTiktokRefresh(), userDetail.getUser().getId());
                    socialsRes.setTiktokResponse((CombinedTikTokResponseDTO) tiktokInfo);
                } catch (Exception e) {
                    System.err.println("Error fetching TikTok data: " + e.getMessage());
                }
            }, executor);
            futures.add(tiktokFuture);
        }
    
        if (youtubeAccessToken != null) {
            CompletableFuture<Void> youtubeFuture = CompletableFuture.runAsync(() -> {
                try {
                    Object youtubeInfo = getYoutubeVideos(youtubeAccessToken, userDetail.getUser().getYoutubeRefresh(), userDetail.getUser().getId());
                    socialsRes.setYoutubeResponse((YoutubeCombinedResponseDTO) youtubeInfo);
                } catch (Exception e) {
                    System.err.println("Error fetching YouTube data: " + e.getMessage());
                }
            }, executor);
            futures.add(youtubeFuture);
        }

        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
    
        return socialsRes;
    }

    private Object getInstagramInfo(String accessToken) {
        try {
            InstaBusinessAcct res2 = getInstagramBusinessAccount(accessToken);
    
            String url = "https://graph.facebook.com/v19.0/" + res2.getInstagram_business_account().getId() + "?fields=username&access_token=" + accessToken;
            UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(url);
            URI uri = builder.build().toUri();
            CommentDTO res3 = restTemplate.getForObject(uri, CommentDTO.class);
    
            url = "https://graph.facebook.com/v19.0/" + res3.getId() + "?fields=business_discovery.username(" + res3.getUsername() + "){username,website,name,ig_id,id,profile_picture_url,biography,follows_count,followers_count,media_count,media{id,caption,like_count,comments_count,timestamp,username,media_product_type,media_type,owner,permalink,media_url,children{media_url}}}&access_token=" + accessToken;
            builder = UriComponentsBuilder.fromUriString(url);
            uri = builder.build().toUri();
            BusinessDiscoveryListDTO res4 = restTemplate.getForObject(uri, BusinessDiscoveryListDTO.class);
    
            List<CompletableFuture<List<CommentDTO>>> commentFutures = new ArrayList<>();
            List<CompletableFuture<List<InsightsDTO>>> insightsFutures = new ArrayList<>();
    
            for (int i = 0; i < Math.min(res4.getBusiness_discovery().getMedia().getData().size(), 20); i++) {
                String mediaId = res4.getBusiness_discovery().getMedia().getData().get(i).getId();
    
                CompletableFuture<List<CommentDTO>> commentFuture = CompletableFuture.supplyAsync(() -> {
                    String commentUrl = "https://graph.facebook.com/v19.0/" + mediaId + "/comments?fields=username,text,timestamp,replies{username,text,timestamp}&access_token=" + accessToken;
                    UriComponentsBuilder commentBuilder = UriComponentsBuilder.fromUriString(commentUrl);
                    URI commentUri = commentBuilder.build().toUri();
                    CommentResponseDTO commentRes = restTemplate.getForObject(commentUri, CommentResponseDTO.class);
                    return commentRes != null ? commentRes.getData() : new ArrayList<>();
                }, executor);
                commentFutures.add(commentFuture);
    
                CompletableFuture<List<InsightsDTO>> insightsFuture = CompletableFuture.supplyAsync(() -> {
                    String insightsUrl = "https://graph.facebook.com/v19.0/" + mediaId + "/insights?metric=ig_reels_avg_watch_time,reach,saved,comments,shares,ig_reels_aggregated_all_plays_count&access_token=" + accessToken;
                    UriComponentsBuilder insightsBuilder = UriComponentsBuilder.fromUriString(insightsUrl);
                    URI insightsUri = insightsBuilder.build().toUri();
                    InsightsResponseDTO insightRes = restTemplate.getForObject(insightsUri, InsightsResponseDTO.class);
                    return insightRes != null ? insightRes.getData() : new ArrayList<>();
                }, executor);
                insightsFutures.add(insightsFuture);
            }
    
            List<CommentDTO> commentsRes = new ArrayList<>();
            List<InsightsDTO> insightsRes = new ArrayList<>();
    
            for (CompletableFuture<List<CommentDTO>> commentFuture : commentFutures) {
                commentsRes.addAll(commentFuture.join());
            }
            for (CompletableFuture<List<InsightsDTO>> insightsFuture : insightsFutures) {
                insightsRes.addAll(insightsFuture.join());
            }
    
            BusinessWithCommentsDTO overallResponse = new BusinessWithCommentsDTO();
            overallResponse.setBusiness_discovery(res4);
            overallResponse.setComments(commentsRes);
            overallResponse.setInsights(insightsRes);
    
            return overallResponse;
        } catch (Exception e) {
            ErrorDTO dto = new ErrorDTO();
            String jsonPart = e.getMessage().substring(e.getMessage().indexOf("{"), e.getMessage().lastIndexOf("}") + 1);

            // Parse the JSON using Jackson
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode;
            try {
                 jsonNode = objectMapper.readTree(jsonPart);
            } catch (Exception e2) {
                return e2;
            }

            int errorCode = jsonNode.path("error").path("code").asInt();
            String errorMessage = jsonNode.path("error").path("message").asText();
            dto.setError(errorMessage);
            dto.setCode(errorCode);
            
            return dto;
        }
    }

    private Object getTiktokInfo(String accessToken, String refreshToken, Long id) {
        String url = "https://open.tiktokapis.com/v2/video/list/?fields=video_description,share_url,like_count,comment_count,share_count,view_count,id,create_time";
        URI uri = UriComponentsBuilder.fromUriString(url).build().toUri();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
    
        Map<String, Object> bodyParams = new HashMap<>();
        bodyParams.put("max_count", 20);
        org.springframework.http.HttpEntity<Map<String, Object>> entity = new org.springframework.http.HttpEntity<>(bodyParams, headers);
    
        Object result = fetchTiktokVideos(uri, entity);
        if (result instanceof VideosListDTO && ((VideosListDTO)result).getData() != null) {
            CombinedTikTokResponseDTO combinedRes = new CombinedTikTokResponseDTO();
            combinedRes.setVideos(((VideosListDTO)result));
            url = "https://open.tiktokapis.com/v2/user/info/?fields=avatar_url";
            uri = UriComponentsBuilder.fromUriString(url).build().toUri();
        
            entity = new org.springframework.http.HttpEntity<>(headers);
            TikTokProfileResponseDTO tiktokProfile = restTemplate.exchange(uri, HttpMethod.GET, entity, TikTokProfileResponseDTO.class).getBody();
            if (tiktokProfile.getError().getCode().equals("ok")) {
                combinedRes.setProfilePicture(tiktokProfile.getData().getUser().getAvatar_url());
            } else {
                combinedRes.setProfilePicture(null);
            }
            return combinedRes;
        }
    
        if (result instanceof ErrorDTO || "access_token_invalid".equals(((VideosListDTO)result).getError().getCode())) {
            Object refreshResponse = refreshTiktokToken(refreshToken, id);
            if (refreshResponse instanceof ErrorDTO) {
                return refreshResponse;
            } else {
                accessToken = ((AccessTokenRequestDTO)refreshResponse).getAccess_token();
                headers.set("Authorization", "Bearer " + accessToken);
                entity = new org.springframework.http.HttpEntity<>(bodyParams, headers);
                result = fetchTiktokVideos(uri, entity);
            }
        }
    
        if (result instanceof VideosListDTO) {
            CombinedTikTokResponseDTO combinedRes = new CombinedTikTokResponseDTO();
            combinedRes.setVideos(((VideosListDTO)result));
            url = "https://open.tiktokapis.com/v2/user/info/?fields=avatar_url";
            uri = UriComponentsBuilder.fromUriString(url).build().toUri();
        
            entity = new org.springframework.http.HttpEntity<>(headers);
            TikTokProfileResponseDTO tiktokProfile = restTemplate.exchange(uri, HttpMethod.GET, entity, TikTokProfileResponseDTO.class).getBody();
            if (tiktokProfile.getError().getCode().equals("ok")) {
                combinedRes.setProfilePicture(tiktokProfile.getData().getUser().getAvatar_url());
            } else {
                combinedRes.setProfilePicture(null);
            }
            return combinedRes;
        } else {
            return handleError("Something went wrong fetching TikTok page");
        }   
    }
    
    private Object fetchTiktokVideos(URI uri, org.springframework.http.HttpEntity<Map<String, Object>> entity) {
        try {
            ResponseEntity<VideosListDTO> response = restTemplate.exchange(uri, HttpMethod.POST, entity, VideosListDTO.class);
            return response.getBody();
        } catch (Exception e) {
            System.out.println(e);
            return handleError("Something went wrong fetching TikTok page");
        }
    }

    private ErrorDTO handleError(String message) {
        ErrorDTO errorDTO = new ErrorDTO();
        errorDTO.setError(message);
        return errorDTO;
    }

    private InstaBusinessAcct getInstagramBusinessAccount(String accessToken) {
        String url = "https://graph.facebook.com/v19.0/me/accounts?access_token="+accessToken;
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(url);
        URI uri = builder.build().toUri();
        AccountDTO accountsRes = restTemplate.getForObject(uri, AccountDTO.class);

        url = "https://graph.facebook.com/v19.0/" + accountsRes.getData().get(0).getId() + "?access_token=" + accessToken + "&fields=instagram_business_account";
        builder = UriComponentsBuilder.fromUriString(url);
        uri = builder.build().toUri();
        InstaBusinessAcct instagramAccountRes = restTemplate.getForObject(uri, InstaBusinessAcct.class);
        return instagramAccountRes;
    }

    public Object createPosts(CreatePostDTO postDTO, MultipartFile[] files, User user) {
        String instaAccess;
        String youtubeAccess;
        if (user == null) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            CustomUserDetails userDetail = (CustomUserDetails) authentication.getPrincipal();
            instaAccess = userDetail.getUser().getInstaRefresh();
            youtubeAccess = userDetail.getUser().getYoutubeAccess();
        } else {
            instaAccess = user.getInstaRefresh();
            youtubeAccess = user.getYoutubeAccess();
        }
        
        if (youtubeAccess == null && postDTO.getPostToYoutube() || instaAccess == null && postDTO.getPostToInstagram()) {
            return handleError("Please connect your accounts");
        }
        List<String> postUrls = new ArrayList<String>();
        if (postDTO.getPostToInstagram() || postDTO.getPostToTiktok()) {
            try {
                if (files != null) {
                    for (int i = 0; i < files.length; i++) {
                        postUrls.add("https://posts.danbfrost.com/" + fileUploadService.uploadFile(files[i]));
                    }
                } else {
                    postUrls = Arrays.asList(postDTO.getUrls());
                }
            } catch (Exception e) {
                System.out.println(e);
                return handleError("Error uploading files");
            }
        }
        
        PostResultDTO postResultDTO = new PostResultDTO();
        if (postDTO.getPostToYoutube()) {
            Object youtubeRes;
            if (files != null) {
                youtubeRes = createYoutubePost(youtubeAccess, postDTO, files[0]);
            } else {
                youtubeRes = createYoutubePost(youtubeAccess, postDTO, null);
            }
            if (youtubeRes instanceof ErrorDTO) {
                postResultDTO.setYoutubeLink("Error");
            } else {
                postResultDTO.setYoutubeLink((String)youtubeRes);
            }
        }
        if (postDTO.getPostToInstagram()) {
            Object instagramRes = createInstagramPost(postDTO, files, instaAccess, postUrls);
            if (instagramRes instanceof ErrorDTO) {
                postResultDTO.setInstagramLink("Error");
            } else {
                postResultDTO.setInstagramLink((String)instagramRes);
            }
        }

        for (int i = 0; i < postUrls.size(); i++) {
            fileUploadService.deleteFile(postUrls.get(i));
        }
        if (postResultDTO.getInstagramLink() == null && postResultDTO.getYoutubeLink() == null) {
            return handleError("Error creating posts");
        }
        return postResultDTO;
    }

    private Object createInstagramPost(CreatePostDTO postDTO, MultipartFile[] files, String accessToken, List<String> postUrls) {
        UriComponentsBuilder builder;
        URI uri;
        try {
            InstaBusinessAcct instagramAccountRes = getInstagramBusinessAccount(accessToken);

            String[] postContainerResArr = new String[postUrls.size()];
            for (int i = 0; i < postUrls.size(); i++) {
                String fileExtension = postUrls.get(i).substring(postUrls.get(i).lastIndexOf("."));
                System.out.println(fileExtension);
                if (postUrls.size() == 1) {
                    if (fileExtension.equalsIgnoreCase(".mp4") || fileExtension.equalsIgnoreCase(".mov")) {
                        builder = UriComponentsBuilder
                            .fromUriString("https://graph.facebook.com/v19.0/" + instagramAccountRes.getInstagram_business_account().getId() + "/media")
                            .queryParam("media_type", "REELS")
                            .queryParam("video_url", postUrls.get(i))
                            .queryParam("caption", postDTO.getCaption())
                            .queryParam("share_to_feed", "true")
                            .queryParam("access_token", accessToken);
                    } else {
                        builder = UriComponentsBuilder
                            .fromUriString("https://graph.facebook.com/v19.0/" + instagramAccountRes.getInstagram_business_account().getId() + "/media")
                            .queryParam("caption", postDTO.getCaption())
                            .queryParam("image_url", postUrls.get(i))
                            .queryParam("access_token", accessToken);
                    }
                } else {
                    if (fileExtension.equalsIgnoreCase(".mp4") || fileExtension.equalsIgnoreCase(".mov")) {
                        builder = UriComponentsBuilder
                            .fromUriString("https://graph.facebook.com/v19.0/" + instagramAccountRes.getInstagram_business_account().getId() + "/media")
                            .queryParam("media_type", "VIDEO")
                            .queryParam("video_url", postUrls.get(i))
                            .queryParam("caption", postDTO.getCaption())
                            .queryParam("is_carousel_item", "true")
                            .queryParam("access_token", accessToken);
                    } else {
                        builder = UriComponentsBuilder
                            .fromUriString("https://graph.facebook.com/v19.0/" + instagramAccountRes.getInstagram_business_account().getId() + "/media")
                            .queryParam("image_url", postUrls.get(i))
                            .queryParam("caption", postDTO.getCaption())
                            .queryParam("is_carousel_item", "true")
                            .queryParam("access_token", accessToken);
                    }
                }
                uri = builder.build().encode().toUri();

                postContainerResArr[i] = restTemplate.postForObject(uri, null, GenericIDDTO.class).getId().toString();
                System.out.println(postContainerResArr[i]);
            }

            GenericIDDTO overallRes = null;
            if (postContainerResArr.length > 1) {
                builder = UriComponentsBuilder
                            .fromUriString("https://graph.facebook.com/v19.0/" + instagramAccountRes.getInstagram_business_account().getId() + "/media")
                            .queryParam("media_type", "CAROUSEL")
                            .queryParam("children", String.join(",",postContainerResArr))
                            .queryParam("access_token", accessToken);
                uri = builder.build().encode().toUri();
                overallRes = restTemplate.postForObject(uri, overallRes, GenericIDDTO.class);
            }

            int count = 0;
            while (count < 5) {
                String url = "https://graph.facebook.com/v19.0/" + (overallRes != null ? overallRes.getId() : postContainerResArr[0]) + "?fields=status_code,status&access_token=" + accessToken;
                builder = UriComponentsBuilder.fromUriString(url);
                uri = builder.build().toUri();
                ContainerProgressDTO containerProgress = restTemplate.getForObject(uri, ContainerProgressDTO.class);
                System.out.println(containerProgress.getStatus_code());

                if (containerProgress.getStatus_code().equals("FINISHED")) {
                    break;
                } else if (containerProgress.getStatus_code().equals("ERROR")) {
                    ErrorDTO dto = new ErrorDTO();
                    dto.setError(containerProgress.getStatus());
                    return dto;
                } else {
                    Thread.sleep(30000);
                }
                count++;
                if (count == 5) {
                    ErrorDTO dto = new ErrorDTO();
                    dto.setError("Error creating post container. Please try again later.");
                    return dto;
                }
            }

            String url = "https://graph.facebook.com/v19.0/" + instagramAccountRes.getInstagram_business_account().getId() + "/media_publish?creation_id=" + (overallRes != null ? overallRes.getId() : postContainerResArr[0]) + "&access_token=" + accessToken;
            builder = UriComponentsBuilder.fromUriString(url);
            uri = builder.build().toUri();
            GenericIDDTO publishPostRes = restTemplate.postForObject(uri, null, GenericIDDTO.class);
            
            url = "https://graph.facebook.com/v19.0/" + publishPostRes.getId() + "?fields=permalink&access_token=" + accessToken;
            builder = UriComponentsBuilder.fromUriString(url);
            uri = builder.build().toUri();
            PostDTO mediaURLRes = restTemplate.getForObject(uri, PostDTO.class);
            System.out.println(mediaURLRes.getPermalink());
            
            return mediaURLRes.getPermalink();
        } catch (Exception e) {
            ErrorDTO dto = new ErrorDTO();
            String jsonPart = e.getMessage().substring(e.getMessage().indexOf("{"), e.getMessage().lastIndexOf("}") + 1);

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode;
            try {
                 jsonNode = objectMapper.readTree(jsonPart);
            } catch (Exception e2) {
                return e2;
            }

            int errorCode = jsonNode.path("error").path("code").asInt();
            String errorMessage = jsonNode.path("error").path("message").asText();
            dto.setError(errorMessage);
            dto.setCode(errorCode);
            
            return dto;
        }
    }

    private Object createYoutubePost(String accessToken, CreatePostDTO postDTO, MultipartFile file) {
        try {
            HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();

            YouTube youtube = new YouTube.Builder(HTTP_TRANSPORT, JSON_FACTORY, request -> {
                request.getHeaders().set("Authorization", "Bearer " + accessToken);
            }).setApplicationName("Social Connect").build();

            VideoSnippet snippet = new VideoSnippet();
            snippet.setTitle(postDTO.getCaption());
            snippet.setDescription(postDTO.getCaption());
            snippet.setTags(List.of("Shorts", "YouTube"));

            VideoStatus status = new VideoStatus();
            status.setPrivacyStatus("public");

            FileContent mediaContent;
            if (file != null) {
                mediaContent = new FileContent("video/*", new File(System.getProperty("user.dir") + "/uploads/processed_" + file.getOriginalFilename()));
            } else {
                mediaContent = new FileContent("video/*", new File("/uploads/" + postDTO.getUrls()[0].substring(postDTO.getUrls()[0].lastIndexOf("/"))));
            }
            Video video = new Video();
            video.setSnippet(snippet);
            video.setStatus(status);

            YouTube.Videos.Insert videoInsert = youtube.videos().insert("snippet,status", video, mediaContent);
            Video returnedVideo = videoInsert.execute();
            System.out.println(returnedVideo.getId());
            return "https://youtube.com/shorts/" + returnedVideo.getId();
        } catch (Exception e) {
            System.out.println(e);
            return handleError("Something went wrong posting to YouTube");
        }
        
    }

    private Object createTiktokPost(String accessToken, CreatePostDTO postDTO, String postURL) {
        try {
            String url = "https://open.tiktokapis.com/v2/post/publish/video/init/";

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + accessToken);
            headers.set("Content-Type","application/json; charset=UTF-8");
        
            Map<String, Object> postInfo = new HashMap<>();
            postInfo.put("title", postDTO.getCaption());
            postInfo.put("privacy_level", "MUTUAL_FOLLOW_FRIEND");

            Map<String, Object> sourceInfo = new HashMap<>();
            sourceInfo.put("source", "FILE_UPLOAD");

            Map<String, Object> bodyParams = new HashMap<>();
            bodyParams.put("post_info", postInfo);
            bodyParams.put("source_info", sourceInfo);

            org.springframework.http.HttpEntity<Map<String, Object>> entity = new org.springframework.http.HttpEntity<>(bodyParams, headers);
            //TODO: Find return format from Postman
            return null;
        } catch (Exception e) {
            System.out.println(e);
            ErrorDTO dto = new ErrorDTO();
            dto.setError("Something went wrong posting to TikTok. Please try again later");
            return dto;
        }
    }

    public Object replyYoutubeComment(CommentDTO commentDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetail = (CustomUserDetails) authentication.getPrincipal();
        String accessToken = userDetail.getUser().getYoutubeAccess();
        if (accessToken == null) {
            ErrorDTO dto = new ErrorDTO();
            dto.setError("Please connect your YouTube account");
            return dto;
        }
        try {
            String requestBody = String.format(
                "{ \"snippet\": { \"parentId\": \"%s\", \"textOriginal\": \"%s\" } }",
                commentDTO.getId(), commentDTO.getText()
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);

            org.springframework.http.HttpEntity<String> request = new org.springframework.http.HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                "https://www.googleapis.com/youtube/v3/comments?part=snippet", request, String.class
            );
            if (response.getStatusCode() == HttpStatusCode.valueOf(200)) {
                return "Reply posted successfully!";
            } else {
                return handleError("Something went wrong replying to comment. Please try again later");
            }
        } catch (Error e) {
            System.out.println(e);
            return handleError("Something went wrong replying to comment. Please try again later");
        }
    }

    public Object replyComment(CommentDTO commentDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetail = (CustomUserDetails) authentication.getPrincipal();
        String accessToken = userDetail.getUser().getInstaRefresh();
        if (accessToken == null) {
            ErrorDTO dto = new ErrorDTO();
            dto.setError("Please connect your Instagram account");
            return dto;
        }
        try {
            String url = "https://graph.facebook.com/v19.0/" + commentDTO.getId() + "/replies?message=" + commentDTO.getText() +"&access_token="+accessToken;
            UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(url);
            URI uri = builder.build().toUri();
            GenericIDDTO commentID = restTemplate.postForObject(uri, null, GenericIDDTO.class);
            System.out.println(commentID.getId());

            url = "https://graph.facebook.com/v19.0/" + commentID.getId() + "?fields=username,id,text,timestamp&access_token="+accessToken;
            builder = UriComponentsBuilder.fromUriString(url);
            uri = builder.build().toUri();
            CommentDTO comment = restTemplate.getForObject(uri, CommentDTO.class);
            System.out.println(comment.getText());
            return comment;
        } catch (Exception e) {
            ErrorDTO dto = new ErrorDTO();
            String jsonPart = e.getMessage().substring(e.getMessage().indexOf("{"), e.getMessage().lastIndexOf("}") + 1);

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode;
            try {
                 jsonNode = objectMapper.readTree(jsonPart);
            } catch (Exception e2) {
                return e2;
            }

            int errorCode = jsonNode.path("error").path("code").asInt();
            String errorMessage = jsonNode.path("error").path("message").asText();
            dto.setError(errorMessage);
            dto.setCode(errorCode);
            System.out.println(dto.getError());
            
            return dto;
        }
    }

    public Object tiktokCallback(String code, String state) {
        try {
            String decodedCode = URLDecoder.decode(code, StandardCharsets.UTF_8.name());
            URIBuilder builder = new URIBuilder(tiktokTokenURL); 
            HttpPost post = new HttpPost(builder.build());

            List<NameValuePair> urlParameters = new ArrayList<>();
            urlParameters.add(new BasicNameValuePair("code", decodedCode));
            urlParameters.add(new BasicNameValuePair("grant_type", "authorization_code"));
            urlParameters.add(new BasicNameValuePair("client_key", tiktokClientKey));
            urlParameters.add(new BasicNameValuePair("client_secret", tiktokClientSecret));
            urlParameters.add(new BasicNameValuePair("redirect_uri", tiktokRedirectURI));

            post.setEntity(new UrlEncodedFormEntity(urlParameters));
            post.setHeader("Content-Type", "application/x-www-form-urlencoded");
            CloseableHttpClient httpclient = HttpClients.createDefault();
            CloseableHttpResponse httpResponse = httpclient.execute(post);

            HttpEntity entity = httpResponse.getEntity();
            String responseString = EntityUtils.toString(entity, StandardCharsets.UTF_8);

            ObjectMapper objectMapper = new ObjectMapper();
            AccessTokenRequestDTO accessTokenResponse = objectMapper.readValue(responseString, AccessTokenRequestDTO.class);

            UserResponse userResponse;
            if (accessTokenResponse.getAccess_token() != null && accessTokenResponse.getRefresh_token() != null && accessTokenResponse.getError_description() == null) {
                userResponse = userService.updateTiktok(accessTokenResponse.getAccess_token(), accessTokenResponse.getRefresh_token(), Long.parseLong(state.split("-")[1]));
            } else {
                ErrorDTO dto = new ErrorDTO();
                dto.setError("Error getting TikTok access token");
                return dto;
            }

            if (accessTokenResponse.getError_description() != null) {
                return accessTokenResponse.getError_description();
            }
            return userResponse;
        } catch (Exception e) {
            System.out.println(e);
            ErrorDTO dto = new ErrorDTO();
            dto.setError("Something went wrong logging in. Please try again later");
            return dto;
        }
    }

    public Object youtubeCallback(String code, String state) {
        try {
            URIBuilder builder = new URIBuilder("https://oauth2.googleapis.com/token"); 
            HttpPost post = new HttpPost(builder.build());

            List<NameValuePair> urlParameters = new ArrayList<>();
            urlParameters.add(new BasicNameValuePair("code", code));
            urlParameters.add(new BasicNameValuePair("grant_type", "authorization_code"));
            urlParameters.add(new BasicNameValuePair("client_id", youtubeClientID));
            urlParameters.add(new BasicNameValuePair("client_secret", youtubeSecret));
            urlParameters.add(new BasicNameValuePair("redirect_uri", "https://api.danbfrost.com/api/youtubeCallback"));

            post.setEntity(new UrlEncodedFormEntity(urlParameters));
            post.setHeader("Content-Type", "application/x-www-form-urlencoded");
            CloseableHttpClient httpclient = HttpClients.createDefault();
            CloseableHttpResponse httpResponse = httpclient.execute(post);

            HttpEntity entity = httpResponse.getEntity();
            String responseString = EntityUtils.toString(entity, StandardCharsets.UTF_8);

            ObjectMapper objectMapper = new ObjectMapper();
            YoutubeTokenRequestDTO accessTokenResponse = objectMapper.readValue(responseString, YoutubeTokenRequestDTO.class);

            UserResponse userResponse;
            if (accessTokenResponse.getAccess_token() != null && accessTokenResponse.getRefresh_token() != null) {
                userResponse = userService.updateYoutube(accessTokenResponse.getAccess_token(), accessTokenResponse.getRefresh_token(), Long.parseLong(state.split("-")[1]));
            } else {
                ErrorDTO dto = new ErrorDTO();
                dto.setError("Error getting YouTube access token");
                return dto;
            }

            return userResponse;
        } catch (Exception e) {
            System.out.println(e);
            ErrorDTO dto = new ErrorDTO();
            dto.setError("Something went wrong logging in. Please try again later");
            return dto;
        }
    }

    public Object refreshYoutubeToken(String refreshToken, Long userID) {
        try {
            URIBuilder builder = new URIBuilder("https://oauth2.googleapis.com/token");
            HttpPost post = new HttpPost(builder.build());

            List<NameValuePair> urlParameters = new ArrayList<>();
            urlParameters.add(new BasicNameValuePair("grant_type", "refresh_token"));
            urlParameters.add(new BasicNameValuePair("client_id", youtubeClientID));
            urlParameters.add(new BasicNameValuePair("client_secret", youtubeSecret));
            urlParameters.add(new BasicNameValuePair("refresh_token", refreshToken));

            post.setEntity(new UrlEncodedFormEntity(urlParameters));
            post.setHeader("Content-Type", "application/x-www-form-urlencoded");
            CloseableHttpClient httpclient = HttpClients.createDefault();
            CloseableHttpResponse httpResponse = httpclient.execute(post);

            HttpEntity entity = httpResponse.getEntity();
            String responseString = EntityUtils.toString(entity, StandardCharsets.UTF_8);

            ObjectMapper objectMapper = new ObjectMapper();
            YoutubeTokenRequestDTO accessTokenResponse = objectMapper.readValue(responseString, YoutubeTokenRequestDTO.class);

            if (accessTokenResponse.getAccess_token() != null) {
                userService.updateYoutube(accessTokenResponse.getAccess_token(), refreshToken, userID);
            } else {
                ErrorDTO dto = new ErrorDTO();
                dto.setError("Error getting YouTube access token");
                return dto;
            }

            return accessTokenResponse;
        } catch (Exception e) {
            System.out.println(e);
            ErrorDTO dto = new ErrorDTO();
            dto.setError("Something went wrong logging in. Please try again later");
            return dto;
        }
    }

    private Object getYoutubeVideos(String accessToken, String refreshToken, Long userID) {
        Object youtubeRes = fetchYoutubeStatistics(accessToken);
        if (youtubeRes instanceof ErrorDTO) {
            Object refreshRes = refreshYoutubeToken(refreshToken, userID);
            if (refreshRes instanceof ErrorDTO) {
                return refreshRes;
            } else {
                return fetchYoutubeStatistics(((YoutubeTokenRequestDTO) refreshRes).getAccess_token());
            }
        }
        return youtubeRes;
    }

    private Object fetchYoutubeStatistics(String accessToken) {
        if (accessToken == null) {
            ErrorDTO dto = new ErrorDTO();
            dto.setError("Please connect your YouTube account");
            return dto;
        }

        try {
            String channelUrl = "https://www.googleapis.com/youtube/v3/channels";
            String channelParams = UriComponentsBuilder.fromHttpUrl(channelUrl)
                .queryParam("part", "contentDetails,snippet")
                .queryParam("mine", "true")
                .toUriString();

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);

            org.springframework.http.HttpEntity<?> entity = new org.springframework.http.HttpEntity<>(headers);
            YoutubeChannelListResponse channelResponse = restTemplate.exchange(channelParams, HttpMethod.GET, entity, YoutubeChannelListResponse.class)
                .getBody();
            String uploadsPlaylistId = channelResponse
                .getItems().get(0).getContentDetails().getRelatedPlaylists().getUploads();

            String playlistUrl = "https://www.googleapis.com/youtube/v3/playlistItems";
            String playlistParams = UriComponentsBuilder.fromHttpUrl(playlistUrl)
                .queryParam("part", "contentDetails,snippet")
                .queryParam("playlistId", uploadsPlaylistId)
                .queryParam("maxResults", "20")
                .toUriString();
            
            YoutubePlaylistItemListResponse playlistResponse = restTemplate.exchange(playlistParams, HttpMethod.GET, entity, YoutubePlaylistItemListResponse.class)
                .getBody();
            List<CompletableFuture<YoutubeAltAnalyticsDTO>> analyticsFutures = new ArrayList<>();

            for (int i = 0; i < Math.min(playlistResponse.getItems().size(), 20); i++) {
                YoutubePlaylistItemListResponse.Item playlistItem = playlistResponse.getItems().get(i);

                CompletableFuture<YoutubeAltAnalyticsDTO> commentFuture = CompletableFuture.supplyAsync(() -> {
                    String url = "https://youtubeanalytics.googleapis.com/v2/reports?endDate=" + playlistItem.getContentDetails().getVideoPublishedAt().substring(0,10) +
                                "&startDate=" + playlistItem.getContentDetails().getVideoPublishedAt().substring(0,10) +
                                "&metrics=views,likes,shares,averageViewDuration,comments&ids=channel==MINE&dimensions=video&filters=video==" + playlistItem.getContentDetails().getVideoId() +
                                "&access_token=" + accessToken;
                                
                    UriComponentsBuilder commentBuilder = UriComponentsBuilder.fromUriString(url);
                    URI commentUri = commentBuilder.build().toUri();
                    
                    YoutubeAltAnalyticsDTO analyticsRes = restTemplate.getForObject(commentUri, YoutubeAltAnalyticsDTO.class);
                    return analyticsRes != null ? analyticsRes : new YoutubeAltAnalyticsDTO();
                }, executor);
                
                analyticsFutures.add(commentFuture);
            }

            List<YoutubeAltAnalyticsDTO> res = new ArrayList<>();
            for (CompletableFuture<YoutubeAltAnalyticsDTO> analyticsFuture : analyticsFutures) {
                res.add(analyticsFuture.join());
            }
            YoutubeCombinedResponseDTO combinedResponse = new YoutubeCombinedResponseDTO();
            combinedResponse.setVideos(mergeData(playlistResponse.getItems(), res, accessToken));
            combinedResponse.setProfilePicture(channelResponse.getItems().get(0).getSnippet().getThumbnails().getMedium().getUrl());
            return combinedResponse;

        } catch (Exception e) {
            System.out.println(e);
            return handleError("Error fetching YouTube videos");
        }
    }

    private List<YoutubeVideoInfo> mergeData(List<YoutubePlaylistItemListResponse.Item> playlistItems, List<YoutubeAltAnalyticsDTO> analyticsData, String accessToken) {
        Map<String, Object[]> analyticsMap = new HashMap<>();
        for (YoutubeAltAnalyticsDTO analytics : analyticsData) {
            if (analytics.getRows() != null && !analytics.getRows().isEmpty()) {
                if (analytics.getRows().get(0).length > 0 && analytics.getRows().get(0)[0] instanceof String) {
                    String videoId = (String) analytics.getRows().get(0)[0];
                    analyticsMap.put(videoId, analytics.getRows().get(0));
                }
            }
        }

        return playlistItems.stream()
                .map(item -> {
                    Object[] stats = analyticsMap.get(item.getContentDetails().getVideoId());
                    YoutubeVideoInfo videoDTO = new YoutubeVideoInfo();
                    videoDTO.setContentDetails(item.getContentDetails());
                    videoDTO.setSnippet(item.getSnippet());
                    YoutubeAdvancedStatisticsDTO statsDTO = new YoutubeAdvancedStatisticsDTO();
                    if (stats != null && stats.length > 0) {
                        statsDTO.setViews((Integer)stats[1]);
                        statsDTO.setLikes((Integer)stats[2]);
                        statsDTO.setShares((Integer)stats[3]);
                        statsDTO.setAverageViewDuration((Integer)stats[4]);
                        statsDTO.setComments((Integer)stats[5]);
                    }
                    if (statsDTO.getComments() != null && statsDTO.getComments() != 0) {
                        String url = UriComponentsBuilder.fromUriString("https://www.googleapis.com/youtube/v3/commentThreads")
                            .queryParam("part", "snippet")
                            .queryParam("videoId", item.getContentDetails().getVideoId())
                            .queryParam("maxResults", 100)
                            .build().toUriString();
                    
                        HttpHeaders headers = new HttpHeaders();
                        headers.setBearerAuth(accessToken);
            
                        org.springframework.http.HttpEntity<?> entity = new org.springframework.http.HttpEntity<>(headers);
                        YoutubeCommentResponseDTO commentsResponse = restTemplate.exchange(url, HttpMethod.GET, entity, YoutubeCommentResponseDTO.class).getBody();
                        videoDTO.setComments(commentsResponse);
                    }
                    videoDTO.setStatistics(stats != null && stats.length > 0 ? statsDTO : null);
                    return videoDTO;
                })
                .collect(Collectors.toList());
    }

    public Object refreshTiktokToken(String refreshToken, Long userID) {
        try {
            URIBuilder builder = new URIBuilder(tiktokTokenURL); 
            HttpPost post = new HttpPost(builder.build());

            List<NameValuePair> urlParameters = new ArrayList<>();
            urlParameters.add(new BasicNameValuePair("grant_type", "refresh_token"));
            urlParameters.add(new BasicNameValuePair("client_key", tiktokClientKey));
            urlParameters.add(new BasicNameValuePair("client_secret", tiktokClientSecret));
            urlParameters.add(new BasicNameValuePair("refresh_token", refreshToken));

            post.setEntity(new UrlEncodedFormEntity(urlParameters));
            post.setHeader("Content-Type", "application/x-www-form-urlencoded");
            CloseableHttpClient httpclient = HttpClients.createDefault();
            CloseableHttpResponse httpResponse = httpclient.execute(post);

            HttpEntity entity = httpResponse.getEntity();
            String responseString = EntityUtils.toString(entity, StandardCharsets.UTF_8);

            ObjectMapper objectMapper = new ObjectMapper();
            AccessTokenRequestDTO accessTokenResponse = objectMapper.readValue(responseString, AccessTokenRequestDTO.class);

            if (accessTokenResponse.getAccess_token() != null && accessTokenResponse.getRefresh_token() != null && accessTokenResponse.getError_description() == null) {
                userService.updateTiktok(accessTokenResponse.getAccess_token(), accessTokenResponse.getRefresh_token(), userID);
            } else {
                ErrorDTO dto = new ErrorDTO();
                dto.setError("Error getting TikTok access token");
                return dto;
            }

            if (accessTokenResponse.getError_description() != null) {
                return accessTokenResponse.getError_description();
            }
            return accessTokenResponse;
        } catch (Exception e) {
            System.out.println(e);
            ErrorDTO dto = new ErrorDTO();
            dto.setError("Something went wrong logging in. Please try again later");
            return dto;
        }
    }

    public Object tiktokLogout() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetail = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetail.getUser();
        String accessToken = user.getTiktokAccess();
        if (accessToken == null) {
            ErrorDTO dto = new ErrorDTO();
            dto.setError("Please connect your TikTok account");
            return dto;
        }

        try {
            URIBuilder builder = new URIBuilder("https://open.tiktokapis.com/v2/oauth/revoke/"); 
            HttpPost post = new HttpPost(builder.build());

            List<NameValuePair> urlParameters = new ArrayList<>();
            urlParameters.add(new BasicNameValuePair("client_key", tiktokClientKey));
            urlParameters.add(new BasicNameValuePair("client_secret", tiktokClientSecret));
            urlParameters.add(new BasicNameValuePair("token", accessToken));

            post.setEntity(new UrlEncodedFormEntity(urlParameters));
            post.setHeader("Content-Type", "application/x-www-form-urlencoded");
            CloseableHttpClient httpclient = HttpClients.createDefault();
            CloseableHttpResponse httpResponse = httpclient.execute(post);

            HttpEntity entity = httpResponse.getEntity();
            String responseString = EntityUtils.toString(entity, StandardCharsets.UTF_8);
            System.out.println(responseString);

            if (responseString != null) {
                ObjectMapper objectMapper = new ObjectMapper();
                TiktokErrorDTO tiktokLogoutResponse = objectMapper.readValue(responseString, TiktokErrorDTO.class);    
                System.out.println(tiktokLogoutResponse.getMessage());

                ErrorDTO dto = new ErrorDTO();
                dto.setError("Error logging out of TikTok");
                return dto;
            } else {
                userService.updateTiktok(null, null, userDetail.getUser().getId());
                user.setPassword(null);
                user.setTiktokAccess(null);
                user.setTiktokRefresh(null);
                modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
                Converter<String, Boolean> tokenConverter = context -> context.getSource() != null;
                modelMapper.typeMap(User.class, UserResponse.class).addMappings(mapper -> {
                    mapper.using(tokenConverter).map(User::getInstaRefresh, UserResponse::setInstagramConnected);
                    mapper.using(tokenConverter).map(User::getTiktokAccess, UserResponse::setTiktokConnected);
                    mapper.using(tokenConverter).map(User::getYoutubeRefresh, UserResponse::setYoutubeConnected);
                });
                UserResponse userResponse = modelMapper.map(user, UserResponse.class);
                System.out.println("TIKTOK LOGOUT USER RESPONSE: " + userResponse);
                return userResponse;
            }

        } catch (Exception e) {
            System.out.println(e);
            ErrorDTO dto = new ErrorDTO();
            dto.setError("Something went wrong logging out. Please try again later");
            return dto;
        }
    }

    public Object youtubeLogout() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetail = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetail.getUser();
        String accessToken = user.getYoutubeAccess();
        if (accessToken == null) {
            ErrorDTO dto = new ErrorDTO();
            dto.setError("Please connect your YouTube account");
            return dto;
        }

        try {
            URIBuilder builder = new URIBuilder("https://oauth2.googleapis.com/revoke");
            HttpPost post = new HttpPost(builder.build());

            List<NameValuePair> urlParameters = new ArrayList<>();
            urlParameters.add(new BasicNameValuePair("token", accessToken));

            post.setEntity(new UrlEncodedFormEntity(urlParameters));
            post.setHeader("Content-Type", "application/x-www-form-urlencoded");
            CloseableHttpClient httpclient = HttpClients.createDefault();
            CloseableHttpResponse httpResponse = httpclient.execute(post);

            if (httpResponse.getStatusLine().getStatusCode() == 200) {
                userService.updateYoutube(null, null, userDetail.getUser().getId());
                user.setPassword(null);
                user.setYoutubeAccess(null);
                user.setYoutubeRefresh(null);
                modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
                Converter<String, Boolean> tokenConverter = context -> context.getSource() != null;
                modelMapper.typeMap(User.class, UserResponse.class).addMappings(mapper -> {
                    mapper.using(tokenConverter).map(User::getInstaRefresh, UserResponse::setInstagramConnected);
                    mapper.using(tokenConverter).map(User::getYoutubeAccess, UserResponse::setYoutubeConnected);
                    mapper.using(tokenConverter).map(User::getYoutubeRefresh, UserResponse::setYoutubeConnected);
                });
                UserResponse userResponse = modelMapper.map(user, UserResponse.class);
                return userResponse;
            } else {
                ObjectMapper objectMapper = new ObjectMapper();
                YoutubeErrorDTO youtubeLogoutResponse = objectMapper.readValue(httpResponse.getEntity().getContent(), YoutubeErrorDTO.class);
                System.out.println(youtubeLogoutResponse.getError());
                ErrorDTO dto = new ErrorDTO();
                dto.setError("Error logging out of YouTube");
                return dto;
            }

        } catch (Exception e) {
            System.out.println(e);
            ErrorDTO dto = new ErrorDTO();
            dto.setError("Something went wrong logging out. Please try again later");
            return dto;
        }
    }

}
