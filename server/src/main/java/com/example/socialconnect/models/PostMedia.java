package com.example.socialconnect.models;

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
@Table(name = "POST_MEDIA")
public class PostMedia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MEDIA_ID", nullable = false)
    private Integer mediaID;

    @ManyToOne
    @JoinColumn(name = "POST_ID", referencedColumnName = "ID", nullable = false)
    private FuturePost futurePost;

    @Column(name = "MEDIA_URL", nullable = false)
    private String mediaUrl;
}
