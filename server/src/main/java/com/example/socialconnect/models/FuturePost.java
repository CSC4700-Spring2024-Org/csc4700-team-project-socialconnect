package com.example.socialconnect.models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "FUTURE_POSTS")
public class FuturePost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID", nullable = false)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "USER_ID", referencedColumnName = "ID", nullable = false)
    private User userInfo;

    @OneToMany(mappedBy = "futurePost", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PostMedia> mediaUrls = new ArrayList<>();

    @Column(name = "CAPTION", nullable = false)
    private String caption;

    @Column(name = "TAGGED_USERS")
    private String taggedUsers;

    @Column(name = "LOCATION")
    private String location;

    @Column(name = "POST_DT", nullable = false)
    private LocalDateTime postDT;

    @Column(name = "POST_TO_INSTA", nullable = false)
    private Boolean postToInsta;

    @Column(name = "POST_TO_TIKTOK", nullable = false)
    private Boolean postToTiktok;

    @Column(name="POST_TO_YOUTUBE", nullable=false)
    private Boolean postToYoutube;
}
