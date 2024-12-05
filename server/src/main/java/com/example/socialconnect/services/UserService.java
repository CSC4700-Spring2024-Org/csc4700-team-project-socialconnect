package com.example.socialconnect.services;

import com.example.socialconnect.dtos.UserRequest;
import com.example.socialconnect.dtos.UserResponse;
import com.example.socialconnect.models.User;

import jakarta.mail.MessagingException;
import java.io.UnsupportedEncodingException;

public interface UserService {

    User saveUser(UserRequest userRequest);

    UserResponse getUser();

    String updateInstagram(String token);

    UserResponse updateTiktok(String accessToken, String refreshToken, Long id);

    UserResponse updateYoutube(String accessToken, String refreshToken, Long id);

    void sendVerificationEmail(User user, String siteURL) throws MessagingException, UnsupportedEncodingException;

    boolean verify(String verificationCode);

    void updatePostStatusMessage(String message, Long id);

}
