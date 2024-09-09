package com.example.socialconnect.dtos.InstagramDTOs;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BusinessDiscoveryDataDTO {
    @JsonFormat(with=JsonFormat.Feature.ACCEPT_SINGLE_VALUE_AS_ARRAY)
    public List<PostDTO> data;
}
