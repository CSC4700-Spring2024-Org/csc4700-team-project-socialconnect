package com.example.socialconnect.dtos.InstagramDTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InsightsDTO 
{
   private String name;
   private String period;
   private List<ValuesDTO> values;
   private String title;
   private String description;
   private String id;
}
