package com.example.socialconnect.repositories;

import com.example.socialconnect.models.User;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface UserRepository extends CrudRepository<User, Long> {

   public User findByUsername(String username);
   User findFirstById(Long id);

   @Modifying
   @Transactional
   @Query(
      nativeQuery = true,
      value = "UPDATE users SET INSTA_REFRESH = CASE WHEN :token IS NULL THEN NULL ELSE :token END, INSTA_DATE = CURRENT_TIMESTAMP WHERE username = :username"
   )
   void updateInstagram(@Param("token")String token, @Param("username")String username);

   @Query("SELECT u FROM User u WHERE u.verificationCode = :code")
   public User findByVerificationCode(@Param("code") String code);
   
   @Modifying
   @Transactional
   @Query(
      nativeQuery = true,
      value = "UPDATE users SET TIKTOK_ACCESS = CASE WHEN :accessToken IS NULL THEN NULL ELSE :accessToken END, SET TIKTOK_REFRESH = CASE WHEN :refreshToken IS NULL THEN NULL ELSE :refreshToken END WHERE id = :id"
   )
   void updateTiktok(@Param("accessToken") String accessToken, @Param("refreshToken")String refreshToken, @Param("id")Long id);

}