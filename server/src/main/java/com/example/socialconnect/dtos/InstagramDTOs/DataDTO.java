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
    public String access_token;
    public String category;
    public List<CategoryListDTO> category_list;
    public String name;
    public String id;
    public List<String> tasks;
}
