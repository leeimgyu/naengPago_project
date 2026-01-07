package com.backend.dto;

import com.backend.entity.RecipeView;
import com.backend.entity.Recipes;
import com.backend.mappers.RecipeMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeViewDTO {
    private Long viewId;
    private Integer userId;
    private Integer recipeId;
    private String recipeTitle;
    private String recipeDescription;
    private String recipeImageUrl;
    private String recipeDifficulty;
    private Integer recipeCookingTime;
    private Integer recipeLikeCount;
    private Integer recipeViewCount;
    private LocalDateTime viewedAt;
    private LocalDateTime createdAt;

    // RecipeView 엔티티를 DTO로 변환하는 정적 메서드
    public static RecipeViewDTO fromEntity(RecipeView recipeView) {
        Recipes recipesEntity = recipeView.getRecipeId();

        // RecipeMapper의 public 헬퍼 메서드를 호출
        Integer cookingTime = RecipeMapper.parseCookingTimeFromInfoWgt(recipesEntity.getInfoWgt());

        return RecipeViewDTO.builder()
                .viewId(recipeView.getViewId())
                .userId(recipeView.getUser().getUserId())
                .recipeId(recipesEntity.getId())
                .recipeTitle(recipesEntity.getRcpNm())
                .recipeDescription(recipesEntity.getRcpNaTip())
                .recipeImageUrl(recipesEntity.getAttFileNoMain())
                .recipeDifficulty(recipesEntity.getRcpWay2())
                .recipeCookingTime(cookingTime)
                .recipeLikeCount(recipesEntity.getLikeCount())
                .recipeViewCount(recipesEntity.getViewCount())
                .viewedAt(recipeView.getViewedAt())
                .createdAt(recipeView.getCreatedAt())
                .build();
    }
}