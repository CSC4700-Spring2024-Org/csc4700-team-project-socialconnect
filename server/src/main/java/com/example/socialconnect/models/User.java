package com.example.socialconnect.models;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "USERS")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private long id;
    @Column(name = "USERNAME")
    private String username;
    @JsonIgnore
    @Column(name = "PASSWORD")
    private String password;
    @Column(name = "INSTA_DATE")
    private Date instaDate;
    @Column(name = "INSTA_REFRESH")
    private String instaRefresh;

    @Column(name = "EMAIL")
    private String email;

    @Column(name = "VERIFICATION_CODE", length = 64)
    private String verificationCode;

    @Column(name="ENABLED")
    private boolean enabled;

    @Column(name="TIKTOK_ACCESS")
    private String tiktokAccess;

    @Column(name="TIKTOK_REFRESH")
    private String tiktokRefresh;
}