package com.example.socialconnect.helpers;

import com.example.socialconnect.models.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails {
    private String email;
    private String username;
    private String password;
    private User user;
    Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(User byUsername) {
        this.username = byUsername.getUsername();
        this.password= byUsername.getPassword();
        this.email = byUsername.getEmail();
        this.user = byUsername;
        List<GrantedAuthority> auths = new ArrayList<>();

        auths.add(new SimpleGrantedAuthority("USER"));
        this.authorities = auths;
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    public String getEmail() {
        return email;
    }
    
    public User getUser() {
        return user;
    }
    
    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return user.isEnabled();
    }
}
