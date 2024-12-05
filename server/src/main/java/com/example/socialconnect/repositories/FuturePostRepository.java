package com.example.socialconnect.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.example.socialconnect.models.FuturePost;

@Repository
public interface FuturePostRepository extends CrudRepository<FuturePost, Integer> {
    @Query(
        nativeQuery = true,
        value = "SELECT * FROM future_posts WHERE POST_DT < CURRENT_TIMESTAMP"
    )
    List<FuturePost> findPosts();
}
