package com.backend.service;

import com.backend.dto.recipeReview.RecipeReviewRequestDTO;
import com.backend.dto.recipeReview.RecipeReviewResponseDTO;
import com.backend.entity.RecipeReview;
import com.backend.entity.Recipes; // Recipes import
import com.backend.entity.User;
import com.backend.repository.RecipeReviewRepository;
import com.backend.repository.RecipesRepository; // RecipesRepository import
import com.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RecipeReviewService {

    private final RecipeReviewRepository recipeReviewRepository;
    private final UserRepository userRepository;
    private final RecipesRepository recipesRepository; // 의존성 추가

    @Transactional
    public RecipeReviewResponseDTO createReview(RecipeReviewRequestDTO requestDTO) {
        User user = userRepository.findById(requestDTO.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다: " + requestDTO.getUserId()));

        // 레시피 엔티티 조회
        Recipes recipe = recipesRepository.findById(requestDTO.getRecipeId())
                .orElseThrow(() -> new EntityNotFoundException("레시피를 찾을 수 없습니다: " + requestDTO.getRecipeId()));

        RecipeReview recipeReview = RecipeReview.builder()
                .recipe(recipe) // recipeId 대신 조회한 Recipes 객체 설정
                .userId(requestDTO.getUserId())
                .rating(requestDTO.getRating())
                .comment(requestDTO.getComment())
                .build();
        
        RecipeReview savedReview = recipeReviewRepository.save(recipeReview);
        return RecipeReviewResponseDTO.fromEntity(savedReview, user);
    }

    public List<RecipeReviewResponseDTO> getReviewsByRecipeId(Integer recipeId) {
        // 변경된 리포지토리 메서드 호출
        List<RecipeReview> reviews = recipeReviewRepository.findByRecipe_IdOrderByCreatedAtDesc(recipeId);
        return reviews.stream().map(review -> {
            User user = userRepository.findById(review.getUserId())
                    .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다: " + review.getUserId()));
            return RecipeReviewResponseDTO.fromEntity(review, user);
        }).collect(Collectors.toList());
    }

    public List<RecipeReviewResponseDTO> getReviewsByUserId(Integer userId) {
        List<RecipeReview> reviews = recipeReviewRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return reviews.stream().map(review -> {
            User user = userRepository.findById(review.getUserId())
                    .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다: " + review.getUserId()));
            return RecipeReviewResponseDTO.fromEntity(review, user);
        }).collect(Collectors.toList());
    }

    public RecipeReviewResponseDTO getReviewById(Long reviewId) {
        RecipeReview review = recipeReviewRepository.findById(reviewId)
                .orElseThrow(() -> new EntityNotFoundException("리뷰를 찾을 수 없습니다: " + reviewId));
        User user = userRepository.findById(review.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다: " + review.getUserId()));
        return RecipeReviewResponseDTO.fromEntity(review, user);
    }

    @Transactional
    public RecipeReviewResponseDTO updateReview(Long reviewId, RecipeReviewRequestDTO requestDTO) {
        RecipeReview existingReview = recipeReviewRepository.findById(reviewId)
                .orElseThrow(() -> new EntityNotFoundException("리뷰를 찾을 수 없습니다: " + reviewId));
        
        // 기존 엔티티의 필드를 직접 수정
        existingReview.setRating(requestDTO.getRating());
        existingReview.setComment(requestDTO.getComment());
        
        RecipeReview savedReview = recipeReviewRepository.save(existingReview);
        User user = userRepository.findById(savedReview.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다: " + savedReview.getUserId()));

        return RecipeReviewResponseDTO.fromEntity(savedReview, user);
    }

    @Transactional
    public void deleteReview(Long reviewId) {
        if (!recipeReviewRepository.existsById(reviewId)) {
            throw new EntityNotFoundException("리뷰를 찾을 수 없습니다: " + reviewId);
        }
        recipeReviewRepository.deleteById(reviewId);
    }
}
