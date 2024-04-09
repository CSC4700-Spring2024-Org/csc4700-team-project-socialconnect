package com.example.socialconnect.dtos;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserResponse {
    private Long id;
    private String username;
    private Date instaDate;
    private String instaRefresh;
}
