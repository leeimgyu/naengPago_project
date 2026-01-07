package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 사용자 냉장고 재료 기반 추천 레시피 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendedRecipeDTO {

    /**
     * 레시피 ID
     */
    private Long recipeId;

    /**
     * 레시피 제목
     */
    private String title;

    /**
     * 레시피 이미지 URL
     */
    private String imageUrl;

    /**
     * 조리 시간 (분)
     */
    private Integer cookingTime;

    /**
     * 난이도 (조리 방법 - rcpWay2)
     */
    private String difficulty;

    /**
     * 사용자 냉장고와 매칭된 재료 목록
     */
    private List<String> matchedIngredients;
}
