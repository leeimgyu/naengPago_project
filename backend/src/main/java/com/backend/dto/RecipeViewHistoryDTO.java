package com.backend.dto;

import com.backend.entity.RecipeViewHistory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeViewHistoryDTO {
    private Long viewId;
    private Integer userId;
    private Integer recipeId;
    private String recipeTitle;
    private String recipeImageUrl;
    private LocalDateTime viewedAt;

    public static RecipeViewHistoryDTO fromEntity(RecipeViewHistory entity) {
        return RecipeViewHistoryDTO.builder()
                .viewId(entity.getViewHistoryId())
                .userId(entity.getUser() != null ? entity.getUser().getUserId() : null)
                .recipeId(entity.getRecipe() != null ? entity.getRecipe().getId() : null)
                .recipeTitle(entity.getRecipe() != null ? entity.getRecipe().getRcpNm() : null)
                .recipeImageUrl(entity.getRecipe() != null ? entity.getRecipe().getAttFileNoMain() : null)
                .viewedAt(entity.getLastViewedAt())
                .build();
    }
}