package com.backend.dto.recipeReview;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeReviewRequestDTO {
    private Integer recipeId;
    private Integer userId;
    private Integer rating;
    private String comment;
}