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
public class DataDTO {
    private String access_token;
    private String category;
    private List<CategoryListDTO> category_list;
    private String name;
    private String id;
    private List<String> tasks;
}
