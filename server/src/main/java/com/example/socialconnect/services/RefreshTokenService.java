package com.example.socialconnect.services;

import com.example.socialconnect.models.RefreshToken;
import com.example.socialconnect.models.User;
import com.example.socialconnect.repositories.RefreshTokenRepository;
import com.example.socialconnect.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {

    @Autowired
    RefreshTokenRepository refreshTokenRepository;

    @Autowired
    UserRepository userRepository;

    public RefreshToken createRefreshToken(User user, String userAgent){
        RefreshToken refreshToken = RefreshToken.builder()
                .userInfo(user)
                .userAgent(userAgent)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(2592000000L))
                .build();
        return refreshTokenRepository.save(refreshToken);
    }

    public RefreshToken updateRefreshToken(User user, String userAgent) {
        Optional<RefreshToken> optionalObj = refreshTokenRepository.findByUserId(user.getId(), userAgent);
        if (optionalObj.isPresent() && Instant.now().isBefore(optionalObj.get().getExpiryDate())) {
            return optionalObj.get();
        }
        if (optionalObj.isPresent()) {
            RefreshToken refreshToken = optionalObj.get();
            refreshToken.setToken(UUID.randomUUID().toString());
            refreshToken.setExpiryDate(Instant.now().plusMillis(2592000000L));
            return refreshTokenRepository.save(refreshToken);
        }
        return createRefreshToken(user, userAgent);
    }

    public void deleteRefreshToken(String token) {
        refreshTokenRepository.deleteByToken(token);
    }


    public Optional<RefreshToken> findByToken(String token){
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken verifyExpiration(RefreshToken token){
        if(token.getExpiryDate().compareTo(Instant.now())<0){
            refreshTokenRepository.delete(token);
            return null;
        }
        return token;

    }

}