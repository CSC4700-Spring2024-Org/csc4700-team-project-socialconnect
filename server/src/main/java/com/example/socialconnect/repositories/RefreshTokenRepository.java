package com.example.socialconnect.repositories;

import com.example.socialconnect.models.RefreshToken;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends CrudRepository<RefreshToken, Integer> {

    Optional<RefreshToken> findByToken(String token);

    @Query(
        nativeQuery = true,
        value = "SELECT * FROM REFRESH_TOKENS WHERE USER_ID = :id"
    )
    Optional<RefreshToken> findByUserId(@Param("id")Long id);

    @Modifying
    @Transactional
    @Query(
        nativeQuery = true,
        value = "UPDATE REFRESH_TOKENS SET TOKEN = NULL, EXPIRY_DATE = CURRENT_TIMESTAMP WHERE TOKEN = :token"
    )
    void deleteByToken(@Param("token")String token);
}
