package com.backend.dto.recipeReview;

import com.backend.entity.RecipeReview;
import com.backend.entity.User; // User 엔티티 import
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeReviewResponseDTO {
    private Long reviewId;
    private Integer recipeId; // Long -> Integer
    private String recipeTitle; // 레시피 제목 추가
    private String recipeImageUrl; // 레시피 이미지 추가
    private Integer userId;
    private String userNickname;
    private String profileImageUrl;
    private Integer rating;
    private String comment;
    private Integer helpfulCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static RecipeReviewResponseDTO fromEntity(RecipeReview recipeReview, User user) {
        return RecipeReviewResponseDTO.builder()
                .reviewId(recipeReview.getReviewId())
                .recipeId(recipeReview.getRecipe().getId()) // getRecipeId() -> getRecipe().getId()
                .recipeTitle(recipeReview.getRecipe().getRcpNm()) // 레시피 제목
                .recipeImageUrl(recipeReview.getRecipe().getAttFileNoMain()) // 레시피 이미지
                .userId(recipeReview.getUserId())
                .userNickname(user.getUsername())
                .profileImageUrl(user.getProfileImage())
                .rating(recipeReview.getRating())
                .comment(recipeReview.getComment())
                .helpfulCount(recipeReview.getHelpfulCount())
                .createdAt(recipeReview.getCreatedAt())
                .updatedAt(recipeReview.getUpdatedAt())
                .build();
    }
}
