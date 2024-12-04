package com.example.socialconnect.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.socialconnect.models.FuturePost;

@Repository
public interface FuturePostRepository extends CrudRepository<FuturePost, Integer> {
    @Query(
        nativeQuery = true,
        value = "SELECT * FROM future_posts WHERE POST_DT < CURRENT_TIMESTAMP AND POST_STATUS = 0"
    )
    List<FuturePost> findPosts();

    @Query(
        nativeQuery = true,
        value = "INSERT INTO future_posts(USER_ID, CAPTION, TAGGED_USERS, LOCATION, POST_DT, POST_TO_INSTA, POST_TO_TIKTOK, POST_TO_YOUTUBE, POST_STATUS, VIEWED_MESSAGE) " +
                "VALUES(:id, :caption, :taggedUsers, :location, :postDT, :postToInsta, :postToTiktok, FALSE, 0, FALSE) RETURNING ID"
    )
    Long createFuturePost(@Param("id") Long id, 
                        @Param("caption") String caption, 
                        @Param("taggedUsers") String taggedUsers, 
                        @Param("location") String location, 
                        @Param("postDT") LocalDateTime postDT, 
                        @Param("postToInsta") Boolean postToInsta, 
                        @Param("postToTiktok") Boolean postToTiktok);
}
