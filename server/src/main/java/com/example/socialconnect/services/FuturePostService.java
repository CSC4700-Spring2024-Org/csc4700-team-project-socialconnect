package com.example.socialconnect.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.socialconnect.dtos.ErrorDTO;
import com.example.socialconnect.dtos.InstagramDTOs.CreatePostDTO;
import com.example.socialconnect.helpers.CustomUserDetails;
import com.example.socialconnect.models.FuturePost;
import com.example.socialconnect.models.PostMedia;
import com.example.socialconnect.repositories.FuturePostRepository;
import com.example.socialconnect.repositories.PostMediaRepository;

@Service
public class FuturePostService {
    @Autowired
    FuturePostRepository futurePostRepository;

    @Autowired
    PostMediaRepository postMediaRepository;

    @Autowired
    InstagramService socialsService;

    @Autowired
    FileUploadService fileUploadService;

    @Scheduled(cron = "0 */15 * ? * *")
    public void postScheduledPosts() {
        List<FuturePost> futurePosts = futurePostRepository.findPosts();
        for (FuturePost post : futurePosts) {
            List<PostMedia> postMedias = postMediaRepository.findMediaFromID(post.getId());
            CreatePostDTO postDTO = new CreatePostDTO();
            postDTO.setCaption(post.getCaption());
            String[] postURLS = new String[postMedias.size()];
            for (int i = 0; i < postMedias.size(); i++) {
                postURLS[i] = postMedias.get(i).getMediaUrl();
            }
            postDTO.setUrls(postURLS);
            socialsService.createInstagramPost(postDTO, null);
        }
    }

    public Object saveFuturePost(CreatePostDTO post, LocalDateTime postDT, MultipartFile[] files) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetail = (CustomUserDetails) authentication.getPrincipal();
        Long userID = userDetail.getUser().getId();
        Long futurePostID = futurePostRepository.createFuturePost(userID, post.getCaption(), post.getTaggedUsers(), post.getLocation(), postDT, post.getPostToInstagram(), post.getPostToTiktok());
        
        for (MultipartFile file : files) {
            try {
                String mediaURL = fileUploadService.uploadFile(file);
                postMediaRepository.createPostMedia(futurePostID, mediaURL);
            } catch (Exception e) {
                ErrorDTO errorDTO = new ErrorDTO();
                errorDTO.setError("Error uploading file for future post");
                return errorDTO;
            }
        }
        return null;
    }
}
