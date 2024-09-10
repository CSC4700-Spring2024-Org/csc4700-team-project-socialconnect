package com.example.socialconnect.services;

import com.example.socialconnect.dtos.UserRequest;
import com.example.socialconnect.dtos.UserResponse;
import com.example.socialconnect.dtos.InstagramDTOs.FacebookResponseDTO;
import com.example.socialconnect.models.User;
import com.example.socialconnect.repositories.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserRepository userRepository;

    ModelMapper modelMapper = new ModelMapper();

    @Value("${fb.appId}")
    private String fb_id;

    @Value("${fb.secret}")
    private String fb_secret;

    @Override
    public User saveUser(UserRequest userRequest) {
        if(userRequest.getUsername() == null){
            throw new RuntimeException("Parameter username is not found in request..!!");
        } else if(userRequest.getPassword() == null){
            throw new RuntimeException("Parameter password is not found in request..!!");
        }

        if (userRepository.findByUsername(userRequest.getUsername()) != null) {
            return new User();
        }
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = userRequest.getPassword();
        String encodedPassword = encoder.encode(rawPassword);

        User user = modelMapper.map(userRequest, User.class);
        user.setPassword(encodedPassword);

        userRepository.save(user);

        return user;
    }

    @Override
    public UserResponse getUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetail = (UserDetails) authentication.getPrincipal();
        String usernameFromAccessToken = userDetail.getUsername();
        User user = userRepository.findByUsername(usernameFromAccessToken);
        UserResponse userResponse = modelMapper.map(user, UserResponse.class);
        return userResponse;
    }

    @Override
    public String updateInstagram(String token) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetail = (UserDetails) authentication.getPrincipal();
        String usernameFromAcessToken = userDetail.getUsername();
        if (token.equals("None")) {
            userRepository.updateInstagram(null, usernameFromAcessToken);
            return null;
        }
        else {
            System.out.println("TOKEN = " + token);
            RestTemplate restTemplate = new RestTemplate();
            FacebookResponseDTO result = restTemplate.getForObject("https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id="+fb_id+"&client_secret="+fb_secret+"&fb_exchange_token="+token, FacebookResponseDTO.class);
            userRepository.updateInstagram(result.getAccess_token(), usernameFromAcessToken);
            return result.getAccess_token();
        }
    }
}