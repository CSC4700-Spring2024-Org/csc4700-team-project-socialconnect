package com.example.socialconnect.configurations;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.web.AuthenticationEntryPoint;

import java.io.IOException;
import java.io.PrintWriter;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.AuthenticationException;

public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException{
        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        String errorMessage;
        if (authException instanceof BadCredentialsException) {
            errorMessage = "Invalid username/password";
        } else if (authException instanceof DisabledException) {
            errorMessage = "Please verify your account";
        } else {
            errorMessage = "Authentication failed";
        }

        PrintWriter writer = response.getWriter();
        writer.write(errorMessage);
    }
}