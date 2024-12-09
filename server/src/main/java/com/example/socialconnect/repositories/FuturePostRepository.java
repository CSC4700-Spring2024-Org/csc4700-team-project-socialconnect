package com.example.socialconnect.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.socialconnect.models.FuturePost;

import jakarta.transaction.Transactional;

@Repository
public interface FuturePostRepository extends CrudRepository<FuturePost, Integer> {
    @Query(
        nativeQuery = true,
        value = "SELECT * FROM future_posts WHERE POST_DT <= CURRENT_TIMESTAMP"
    )
    List<FuturePost> findPosts();

    @Modifying
    @Transactional
    @Query(
        nativeQuery = true,
        value = "DELETE FROM future_posts WHERE id = :id"
    )
    void deleteFuturePost(@Param("id") Integer id);
}
