package com.example.socialconnect.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "REFRESH_TOKENS")
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer id;
    @Column(name = "TOKEN")
    private String token;

    @Column(name = "EXPIRY_DATE")
    private Instant expiryDate;

    @OneToOne
    @JoinColumn(name = "USER_ID", referencedColumnName = "ID")
    private User userInfo;

    @Column(name="USER_AGENT")
    private String userAgent;

}
