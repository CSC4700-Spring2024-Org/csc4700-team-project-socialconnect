package com.example.socialconnect.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.socialconnect.dtos.ErrorDTO;
import com.example.socialconnect.dtos.PostResultDTO;
import com.example.socialconnect.dtos.InstagramDTOs.CreatePostDTO;
import com.example.socialconnect.helpers.CustomUserDetails;
import com.example.socialconnect.models.FuturePost;
import com.example.socialconnect.models.PostMedia;
import com.example.socialconnect.repositories.FuturePostRepository;
import com.example.socialconnect.repositories.PostMediaRepository;
import com.example.socialconnect.repositories.UserRepository;

@Service
public class FuturePostService {
    @Autowired
    FuturePostRepository futurePostRepository;

    @Autowired
    PostMediaRepository postMediaRepository;

    @Autowired
    UserRepository userRepository;

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
            postDTO.setPostToInstagram(post.getPostToInsta());
            postDTO.setPostToYoutube(post.getPostToYoutube());
            postDTO.setPostToTiktok(post.getPostToTiktok());
            String[] postURLS = new String[postMedias.size()];
            for (int i = 0; i < postMedias.size(); i++) {
                postURLS[i] = postMedias.get(i).getMediaUrl();
            }
            postDTO.setUrls(postURLS);
            Object postRes = socialsService.createPosts(postDTO, null);
            if (postRes instanceof ErrorDTO) {
                String platforms = Stream.of(
                    postDTO.getPostToInstagram() ? "Instagram" : null,
                    postDTO.getPostToTiktok() ? "TikTok" : null,
                    postDTO.getPostToYoutube() ? "YouTube" : null)
                .filter(Objects::nonNull)
                .collect(Collectors.joining(", "));

                String errorMessage = "Error posting to " + platforms + " at " + post.getPostDT();
                userRepository.updatePostStatusMessage(errorMessage, post.getUserInfo().getId());
            } else {
                PostResultDTO postResultDTO = (PostResultDTO) postRes;
                String platforms = Stream.of(
                    postResultDTO.getInstagramLink() != null && !postResultDTO.getInstagramLink().equals("Error") ? "Instagram" : null,
                    postResultDTO.getTiktokLink() != null && !postResultDTO.getTiktokLink().equals("Error") ? "TikTok" : null,
                    postResultDTO.getYoutubeLink() != null && !postResultDTO.getYoutubeLink().equals("Error") ? "YouTube" : null)
                .filter(Objects::nonNull)
                .collect(Collectors.joining(", "));
                userRepository.updatePostStatusMessage("Successfully posted to " + platforms + " at " + post.getPostDT(), post.getUserInfo().getId());
            }
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
        futurePost.setPostToYoutube(false);
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
