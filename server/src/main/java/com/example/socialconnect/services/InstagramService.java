package com.example.socialconnect.services;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
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
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class InstagramService {
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

    public Object createInstagramPost(CreatePostDTO postDTO, String accessToken) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://graph.facebook.com/v19.0/me/accounts?access_token="+accessToken;
            UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(url);
            URI uri = builder.build().toUri();
            AccountDTO response = restTemplate.getForObject(uri, AccountDTO.class);
            System.out.println("LOL");

            url = "https://graph.facebook.com/v19.0/" + response.getData().get(0).getId() + "?access_token=" + accessToken + "&fields=instagram_business_account";
            builder = UriComponentsBuilder.fromUriString(url);
            uri = builder.build().toUri();
            InstaBusinessAcct res2 = restTemplate.getForObject(uri, InstaBusinessAcct.class);
            System.out.println("LOL");

            url = "https://graph.facebook.com/v19.0/" + res2.getInstagram_business_account().getId() + "/media?media_type=REELS&video_url=" + postDTO.getUrls()[0] + "&caption=" + postDTO.getCaption() + "&share_to_feed=true&access_token=" + accessToken;
            builder = UriComponentsBuilder.fromUriString(url);
            uri = builder.build().toUri();
            GenericIDDTO res3 = restTemplate.postForObject(uri, null, GenericIDDTO.class);
            System.out.println("LOL");
            
            int count = 0;
            while (count < 5) {
                url = "https://graph.facebook.com/v19.0/" + res3.getId() + "?fields=status_code&access_token=" + accessToken;
                builder = UriComponentsBuilder.fromUriString(url);
                uri = builder.build().toUri();
                ContainerProgressDTO containerProgress = restTemplate.getForObject(uri, ContainerProgressDTO.class);
                System.out.println("LOL");
                if (containerProgress.getStatus_code().equals("FINISHED")) {
                    break;
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

            url = "https://graph.facebook.com/v19.0/" + res2.getInstagram_business_account().getId() + "/media_publish?creation_id=" + res3.getId() + "&access_token=" + accessToken;
            builder = UriComponentsBuilder.fromUriString(url);
            uri = builder.build().toUri();
            GenericIDDTO res4 = restTemplate.postForObject(uri, null, GenericIDDTO.class);
            System.out.println("LOL");

            url = "https://graph.facebook.com/v19.0/" + res4.getId() + "?fields=media_url&access_token=" + accessToken;
            builder = UriComponentsBuilder.fromUriString(url);
            uri = builder.build().toUri();
            PostDTO mediaURLRes = restTemplate.getForObject(uri, PostDTO.class);
            System.out.println("LOL");
            return mediaURLRes.getMedia_url();
        } catch (Exception e) {
            System.out.println(e);
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
}
