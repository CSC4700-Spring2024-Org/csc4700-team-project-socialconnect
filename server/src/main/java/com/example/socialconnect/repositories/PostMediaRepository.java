package com.example.socialconnect.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.socialconnect.models.PostMedia;

@Repository
public interface PostMediaRepository extends CrudRepository<PostMedia, Integer> {
    @Query(
        nativeQuery = true,
        value = "SELECT * FROM post_media WHERE POST_ID = :id"
    )
    List<PostMedia> findMediaFromID(@Param("id")Integer id);

    @Modifying
    @Transactional
    @Query(
        nativeQuery = true,
        value = "INSERT INTO post_media(MEDIA_URL, POST_ID) VALUES(:mediaURL, :postID)"
    )
    void createPostMedia(@Param("postID") Integer postID, @Param("mediaURL") String mediaURL);

    @Modifying
    @Transactional
    @Query(
        nativeQuery = true,
        value = "DELETE FROM post_media WHERE media_id = :mediaID"
    )
    void deletePostMedia(@Param("mediaID") Integer mediaID);
}