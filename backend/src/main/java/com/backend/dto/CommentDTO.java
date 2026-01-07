package com.backend.dto;

import com.backend.entity.Comment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentDTO {
    private Long commentId;
    private Integer userId;
    private Integer recipeId; // Long -> Integer
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 사용자 정보 (프론트엔드 렌더링을 위해 필요)
    private String userNickname;
    private String userProfileImage;

    // 레시피 정보 (마이페이지 댓글 목록에서 필요)
    private String recipeTitle;
    private String recipeImageUrl;

    // Entity to DTO
    public static CommentDTO fromEntity(Comment comment) {
        return CommentDTO.builder()
                .commentId(comment.getCommentId())
                .userId(comment.getUserId())
                .recipeId(comment.getRecipe().getId())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }

}