package com.backend.dto;

import java.util.List;
import lombok.Builder;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UnifiedRecipeDTO {
    private String id;
    private Long dbId; // 내부 DB ID (리뷰, 댓글용)
    private String source;
    private String title;
    private String imageUrl;
    private String description;
    private String ingredients;
    private String instructions;
    private List<CookingStepDTO> cookingSteps;
    private String infoWgt; 
    private Integer likeCount;
    private Integer viewCount;
    private Integer userId;
    private String nickName; // nickName -> nickname으로 수정
    private String author; // "운영자" 또는 외부 API 작성자
    private String rcpPat2;
    private String rcpWay2;
}

