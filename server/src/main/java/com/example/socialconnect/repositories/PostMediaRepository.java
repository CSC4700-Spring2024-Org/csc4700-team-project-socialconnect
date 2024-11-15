package com.example.socialconnect.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.socialconnect.models.PostMedia;

@Repository
public interface PostMediaRepository extends CrudRepository<PostMedia, Integer> {
    @Query(
        nativeQuery = true,
        value = "SELECT * FROM POST_MEDIA WHERE POST_ID = :id"
    )
    List<PostMedia> findMediaFromID(@Param("id")Integer id);
}