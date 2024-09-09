package com.example.socialconnect.services;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.example.socialconnect.dtos.InstagramDTOs.AccountDTO;
import com.example.socialconnect.dtos.InstagramDTOs.BusinessDiscoveryListDTO;
import com.example.socialconnect.dtos.InstagramDTOs.BusinessWithCommentsDTO;
import com.example.socialconnect.dtos.InstagramDTOs.CommentDTO;
import com.example.socialconnect.dtos.InstagramDTOs.CommentResponseDTO;
import com.example.socialconnect.dtos.InstagramDTOs.InstaBusinessAcct;

@Service
public class InstagramService {
    public BusinessWithCommentsDTO getInstagramInfo(String accessToken) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://graph.facebook.com/v19.0/me/accounts?access_token="+accessToken;
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(url);
        URI uri = builder.build().toUri();
        AccountDTO response = restTemplate.getForObject(uri, AccountDTO.class);

        url = "https://graph.facebook.com/v19.0/" + response.data.get(0).id + "?access_token=" + accessToken + "&fields=instagram_business_account";
        builder = UriComponentsBuilder.fromUriString(url);
        uri = builder.build().toUri();
        InstaBusinessAcct res2 = restTemplate.getForObject(uri, InstaBusinessAcct.class);

        url = "https://graph.facebook.com/v19.0/"+res2.instagram_business_account.id+"?fields=username&access_token="+accessToken;
        builder = UriComponentsBuilder.fromUriString(url);
        uri = builder.build().toUri();
        CommentDTO res3 = restTemplate.getForObject(uri, CommentDTO.class);
        
        url = "https://graph.facebook.com/v19.0/"+res3.id+"?fields=business_discovery.username("+res3.username+"){username,website,name,ig_id,id,profile_picture_url,biography,follows_count,followers_count,media_count,media{id,caption,like_count,comments_count,timestamp,username,media_product_type,media_type,owner,permalink,media_url,children{media_url}}}&access_token="+accessToken;
        builder = UriComponentsBuilder.fromUriString(url);
        uri = builder.build().toUri();
        BusinessDiscoveryListDTO res4 = restTemplate.getForObject(uri, BusinessDiscoveryListDTO.class);
        
        List<CommentDTO> commentsRes = new ArrayList<CommentDTO>();
        for (int i = 0; i < Math.min(res4.business_discovery.media.data.size(), 10); i++) {
            url = "https://graph.facebook.com/v19.0/"+res4.business_discovery.media.data.get(i).id+"/comments?fields=username,text,timestamp,replies{username,text,timestamp}&access_token="+accessToken;
            builder = UriComponentsBuilder.fromUriString(url);
            uri = builder.build().toUri();
            CommentResponseDTO commentRes = restTemplate.getForObject(uri, CommentResponseDTO.class);
            commentsRes.addAll(commentRes.data);
        }

        BusinessWithCommentsDTO overallResponse = new BusinessWithCommentsDTO();
        overallResponse.business_discovery = res4;
        overallResponse.comments = commentsRes;
        
        return overallResponse;
    }
}
