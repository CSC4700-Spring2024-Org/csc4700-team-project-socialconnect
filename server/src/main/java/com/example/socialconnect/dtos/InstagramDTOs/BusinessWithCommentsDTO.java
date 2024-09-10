package com.example.socialconnect.dtos.InstagramDTOs;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BusinessWithCommentsDTO {
    private BusinessDiscoveryListDTO business_discovery;
    private List<CommentDTO> comments;
}
