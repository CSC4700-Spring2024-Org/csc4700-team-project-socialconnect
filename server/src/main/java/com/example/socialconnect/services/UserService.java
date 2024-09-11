package com.example.socialconnect.services;

import com.example.socialconnect.dtos.UserRequest;
import com.example.socialconnect.dtos.UserResponse;
import com.example.socialconnect.models.User;

public interface UserService {

    User saveUser(UserRequest userRequest);

    UserResponse getUser();

    String updateInstagram(String token);

}
