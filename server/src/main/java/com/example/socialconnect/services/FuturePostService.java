package com.example.socialconnect.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

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

    //@Scheduled(cron = "0 */15 * ? * *")
    public void postScheduledPosts() {
        List<FuturePost> futurePosts = futurePostRepository.findPosts();
        for (FuturePost post : futurePosts) {
            //filter futurePosts to find all posts for a certain user and add them to list of the URLS
            //create new method in socialsService for posting with URL already made
            List<PostMedia> postMedias = postMediaRepository.findMediaFromID(post.getId());
        }
    }
}
