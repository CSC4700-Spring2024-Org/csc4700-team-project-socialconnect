package com.example.socialconnect.dtos.InstagramDTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ContainerProgressDTO {
    private String status_code;
    private String id;
    private String status;
}
