package com.backend.service.impl;

import com.backend.dto.CommentDTO;
import com.backend.entity.Comment;
import com.backend.entity.Recipes;
import com.backend.entity.User;
import com.backend.repository.CommentRepository;
import com.backend.repository.RecipesRepository;
import com.backend.repository.UserRepository;
import com.backend.service.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import static com.backend.entity.QRecipes.recipes;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final RecipesRepository recipesRepository;

    @Override
    @Transactional
    public CommentDTO createComment(Integer recipeId, Integer userId, CommentDTO commentDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다. ID: " + userId));
        Recipes recipe = recipesRepository.findById(recipeId)
                .orElseThrow(() -> new IllegalArgumentException("레시피를 찾을 수 없습니다. ID: " + recipeId));

        Comment comment = Comment.builder()
                .userId(userId)
                .recipe(recipe) // recipeId 대신 조회한 Recipes 객체 설정
                .content(commentDTO.getContent())
                .build();

        Comment savedComment = commentRepository.save(comment);

        CommentDTO resultDto = CommentDTO.fromEntity(savedComment);
        resultDto.setUserNickname(user.getUsername());
        resultDto.setUserProfileImage(user.getProfileImage());
        
        return resultDto;
    }

    @Override
    public List<CommentDTO> getCommentsByRecipeId(Integer recipeId) {
        List<Comment> comments = commentRepository.findByRecipe_IdOrderByCreatedAtDesc(recipeId); // 변경된 메서드 이름 사용
        return comments.stream()
                .map(comment -> {
                    CommentDTO dto = CommentDTO.fromEntity(comment);
                    User user = userRepository.findById(comment.getUserId()).orElse(null);
                    if (user != null) {
                        dto.setUserNickname(user.getUsername());
                        dto.setUserProfileImage(user.getProfileImage());
                    } else {
                        dto.setUserNickname("알 수 없는 사용자");
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CommentDTO updateComment(Long commentId, Integer userId, CommentDTO commentDTO) {
        Comment existingComment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다. ID: " + commentId));

        if (!existingComment.getUserId().equals(userId)) {
            throw new SecurityException("댓글을 수정할 권한이 없습니다.");
        }

        existingComment.setContent(commentDTO.getContent());
        Comment updatedComment = commentRepository.save(existingComment);
        
        CommentDTO resultDto = CommentDTO.fromEntity(updatedComment);
        User user = userRepository.findById(updatedComment.getUserId()).orElse(null);
        if (user != null) {
            resultDto.setUserNickname(user.getUsername());
            resultDto.setUserProfileImage(user.getProfileImage());
        }
        return resultDto;
    }

    @Override
    @Transactional
    public void deleteComment(Long commentId, Integer userId) {
        Comment existingComment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다. ID: " + commentId));

        if (!existingComment.getUserId().equals(userId)) {
            throw new SecurityException("댓글을 삭제할 권한이 없습니다.");
        }

        commentRepository.delete(existingComment);
    }

    // 댓글 불러오기
    @Override
    public List<CommentDTO> getCommentsByUserId(Integer userId) {
        List<Comment> comments = commentRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return comments.stream()
                .map(comment -> {
                    CommentDTO dto = CommentDTO.fromEntity(comment);
                    // 사용자 정보 설정
                    User user = userRepository.findById(comment.getUserId()).orElse(null);
                    if (user != null) {
                        dto.setUserNickname(user.getUsername());
                        dto.setUserProfileImage(user.getProfileImage());
                    } else {
                        dto.setUserNickname("알 수 없는 사용자");
                    }
                    // 레시피 정보 추가 (레시피 제목과 이미지)
                    Recipes recipe = comment.getRecipe();
                    if (recipe != null) {
                        dto.setRecipeTitle(recipe.getRcpNm());
                        dto.setRecipeImageUrl(recipe.getAttFileNoMain());
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
