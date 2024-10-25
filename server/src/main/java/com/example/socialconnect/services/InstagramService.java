package com.example.socialconnect.services;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import com.example.socialconnect.dtos.ErrorDTO;
import com.example.socialconnect.dtos.InstagramDTOs.AccountDTO;
import com.example.socialconnect.dtos.InstagramDTOs.BusinessDiscoveryListDTO;
import com.example.socialconnect.dtos.InstagramDTOs.BusinessWithCommentsDTO;
import com.example.socialconnect.dtos.InstagramDTOs.CommentDTO;
import com.example.socialconnect.dtos.InstagramDTOs.CommentResponseDTO;
import com.example.socialconnect.dtos.InstagramDTOs.ContainerProgressDTO;
import com.example.socialconnect.dtos.InstagramDTOs.CreatePostDTO;
import com.example.socialconnect.dtos.InstagramDTOs.GenericIDDTO;
import com.example.socialconnect.dtos.InstagramDTOs.InstaBusinessAcct;
import com.example.socialconnect.dtos.InstagramDTOs.PostDTO;
import com.example.socialconnect.dtos.TikTokDTOs.AccessTokenRequestDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class InstagramService {
    @Autowired
    FileUploadService fileUploadService;

    @Autowired
    UserService userService;

    @Value("${tiktok.key}")
    private String tiktokClientKey;

    @Value("${tiktok.secret}")
    private String tiktokClientSecret;

    @Value("${tiktok.tokenURL}")
    private String tiktokTokenURL;

    @Value("${tiktok.redirect.uri}")
    private String tiktokRedirectURI;

    public Object getInstagramInfo(String accessToken) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://graph.facebook.com/v19.0/me/accounts?access_token="+accessToken;
            UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(url);
            URI uri = builder.build().toUri();
            AccountDTO response = restTemplate.getForObject(uri, AccountDTO.class);

            url = "https://graph.facebook.com/v19.0/" + response.getData().get(0).getId() + "?access_token=" + accessToken + "&fields=instagram_business_account";
            builder = UriComponentsBuilder.fromUriString(url);
            uri = builder.build().toUri();
            InstaBusinessAcct res2 = restTemplate.getForObject(uri, InstaBusinessAcct.class);

            url = "https://graph.facebook.com/v19.0/"+res2.getInstagram_business_account().getId()+"?fields=username&access_token="+accessToken;
            builder = UriComponentsBuilder.fromUriString(url);
            uri = builder.build().toUri();
            CommentDTO res3 = restTemplate.getForObject(uri, CommentDTO.class);
            
            url = "https://graph.facebook.com/v19.0/"+res3.getId()+"?fields=business_discovery.username("+res3.getUsername()+"){username,website,name,ig_id,id,profile_picture_url,biography,follows_count,followers_count,media_count,media{id,caption,like_count,comments_count,timestamp,username,media_product_type,media_type,owner,permalink,media_url,children{media_url}}}&access_token="+accessToken;
            builder = UriComponentsBuilder.fromUriString(url);
            uri = builder.build().toUri();
            BusinessDiscoveryListDTO res4 = restTemplate.getForObject(uri, BusinessDiscoveryListDTO.class);
            
            List<CommentDTO> commentsRes = new ArrayList<CommentDTO>();
            for (int i = 0; i < Math.min(res4.getBusiness_discovery().getMedia().getData().size(), 10); i++) {
                url = "https://graph.facebook.com/v19.0/"+res4.getBusiness_discovery().getMedia().getData().get(i).getId()+"/comments?fields=username,text,timestamp,replies{username,text,timestamp}&access_token="+accessToken;
                builder = UriComponentsBuilder.fromUriString(url);
                uri = builder.build().toUri();
                CommentResponseDTO commentRes = restTemplate.getForObject(uri, CommentResponseDTO.class);
                commentsRes.addAll(commentRes.getData());
            }

            BusinessWithCommentsDTO overallResponse = new BusinessWithCommentsDTO();
            overallResponse.setBusiness_discovery(res4);
            overallResponse.setComments(commentsRes);
            
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

    public Object createInstagramPost(CreatePostDTO postDTO, MultipartFile file, String accessToken) {
        try {
            String postUrl = "https://posts.danbfrost.com/" + fileUploadService.uploadFile(file);

            RestTemplate restTemplate = new RestTemplate();
            String url = "https://graph.facebook.com/v19.0/me/accounts?access_token="+accessToken;
            UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(url);
            URI uri = builder.build().toUri();
            AccountDTO accountsRes = restTemplate.getForObject(uri, AccountDTO.class);

            url = "https://graph.facebook.com/v19.0/" + accountsRes.getData().get(0).getId() + "?access_token=" + accessToken + "&fields=instagram_business_account";
            builder = UriComponentsBuilder.fromUriString(url);
            uri = builder.build().toUri();
            InstaBusinessAcct instagramAccountRes = restTemplate.getForObject(uri, InstaBusinessAcct.class);

            url = "https://graph.facebook.com/v19.0/" + instagramAccountRes.getInstagram_business_account().getId() + "/media?media_type=REELS&video_url=" + postDTO.getUrls()[0] + "&caption=" + postDTO.getCaption() + "&share_to_feed=true&access_token=" + accessToken;
            builder = UriComponentsBuilder.fromUriString(url);
            uri = builder.build().toUri();
            GenericIDDTO postContainerRes = restTemplate.postForObject(uri, null, GenericIDDTO.class);
            System.out.println(postContainerRes.getId());

            int count = 0;
            while (count < 5) {
                url = "https://graph.facebook.com/v19.0/" + postContainerRes.getId() + "?fields=status_code,status&access_token=" + accessToken;
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

            url = "https://graph.facebook.com/v19.0/" + instagramAccountRes.getInstagram_business_account().getId() + "/media_publish?creation_id=" + postContainerRes.getId() + "&access_token=" + accessToken;
            builder = UriComponentsBuilder.fromUriString(url);
            uri = builder.build().toUri();
            GenericIDDTO publishPostRes = restTemplate.postForObject(uri, null, GenericIDDTO.class);
            
            url = "https://graph.facebook.com/v19.0/" + publishPostRes.getId() + "?fields=permalink&access_token=" + accessToken;
            builder = UriComponentsBuilder.fromUriString(url);
            uri = builder.build().toUri();
            PostDTO mediaURLRes = restTemplate.getForObject(uri, PostDTO.class);
            System.out.println(mediaURLRes.getPermalink());

            fileUploadService.deleteFile(postUrl);
            
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

    public Object replyComment(String accessToken, CommentDTO commentDTO) {
        System.out.println(commentDTO.getId() + " " + commentDTO.getText());
        try {
            RestTemplate restTemplate = new RestTemplate();
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
        System.out.println("CODE:" + code);
        try {
            String decodedCode = URLDecoder.decode(code, StandardCharsets.UTF_8.name());
            RestTemplate restTemplate = new RestTemplate();
            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("client_key", tiktokClientKey);
            params.add("client_secret", tiktokClientSecret);
            params.add("code", decodedCode);
            params.add("grant_type", "authorization_code");
            params.add("redirect_uri", tiktokRedirectURI);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.add(HttpHeaders.CACHE_CONTROL, "no-cache");
            System.out.println(headers);
            HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, headers);
            System.out.println(entity);

            AccessTokenRequestDTO accessTokenResponse = restTemplate.postForObject(tiktokTokenURL, entity, AccessTokenRequestDTO.class);
            System.out.println(accessTokenResponse);
            if (accessTokenResponse.getAccess_token() != null && accessTokenResponse.getRefresh_token() != null && accessTokenResponse.getError_description() == null) {
                userService.updateTiktok(accessTokenResponse.getAccess_token(), accessTokenResponse.getRefresh_token(), Long.parseLong(state.split("-")[1]));
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
            ErrorDTO dto = new ErrorDTO();
            String jsonPart = e.getMessage().substring(e.getMessage().indexOf("{"), e.getMessage().lastIndexOf("}") + 1);

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode;
            try {
                 jsonNode = objectMapper.readTree(jsonPart);
            } catch (Exception e2) {
                return e2;
            }

            String errorMessage = jsonNode.path("error_description").asText();
            dto.setError(errorMessage);
            return dto;
        }
    }

}
