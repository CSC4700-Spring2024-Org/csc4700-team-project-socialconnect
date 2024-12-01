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

    //@Scheduled(cron = "0 */15 * ? * *")
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
        
        FuturePost futurePost = new FuturePost();
        futurePost.setUserInfo(userDetail.getUser());
        futurePost.setCaption(post.getCaption());
        futurePost.setTaggedUsers(post.getTaggedUsers());
        futurePost.setLocation(post.getLocation());
        futurePost.setPostToInsta(post.getPostToInstagram());
        futurePost.setPostToTiktok(post.getPostToTiktok());
        futurePost.setPostDT(postDT);
        futurePost.setPostStatus(0);
        futurePost.setPostToYoutube(false);
        futurePost.setViewedMessage(false);
        Integer futurePostID = futurePostRepository.save(futurePost).getId();

        String[] mediaURLs = new String[files.length];
        for (MultipartFile file : files) {
            try {
                String mediaURL = "https://posts.danbfrost.com/" + fileUploadService.uploadFile(file);
                postMediaRepository.createPostMedia(futurePostID, mediaURL);
            } catch (Exception e) {
                System.out.println(e);
                ErrorDTO errorDTO = new ErrorDTO();
                errorDTO.setError("Error uploading file for future post");

                //Logic to delete future post if one of the uploads fails
                for (String url : mediaURLs) {
                    fileUploadService.deleteFile(url);
                }
                return errorDTO;
            }
        }
        return null;
    }
}
