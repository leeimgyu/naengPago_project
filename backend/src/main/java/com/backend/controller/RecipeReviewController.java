package com.backend.controller;

import com.backend.dto.recipeReview.RecipeReviewRequestDTO;
import com.backend.dto.recipeReview.RecipeReviewResponseDTO;
import com.backend.entity.RecipeReview;
import com.backend.service.RecipeReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class RecipeReviewController {

    private final RecipeReviewService recipeReviewService;

   // 리뷰 생성
    @PostMapping
    public ResponseEntity<RecipeReviewResponseDTO> createReview(@RequestBody RecipeReviewRequestDTO requestDTO) {
        RecipeReviewResponseDTO createdReview = recipeReviewService.createReview(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdReview);
    }

    // 레시피 기준 리뷰 조회
    @GetMapping("/recipe/{recipeId}")
    public ResponseEntity<List<RecipeReviewResponseDTO>> getReviewsByRecipeId(@PathVariable Integer recipeId) { // Long -> Integer
        List<RecipeReviewResponseDTO> reviews = recipeReviewService.getReviewsByRecipeId(recipeId);
        return ResponseEntity.ok(reviews);
    }

    // 사용자 기준 리뷰 조회
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RecipeReviewResponseDTO>> getReviewsByUserId(@PathVariable Integer userId) {
        List<RecipeReviewResponseDTO> reviews = recipeReviewService.getReviewsByUserId(userId);
        return ResponseEntity.ok(reviews);
    }

    // 특정 리뷰 기준 조회
    @GetMapping("/{reviewId}")
    public ResponseEntity<RecipeReviewResponseDTO> getReviewById(@PathVariable Long reviewId) {
        RecipeReviewResponseDTO review = recipeReviewService.getReviewById(reviewId);
        return ResponseEntity.ok(review);
    }

   // 리뷰 수정
    @PutMapping("/{reviewId}")
    public ResponseEntity<RecipeReviewResponseDTO> updateReview(@PathVariable Long reviewId, @RequestBody RecipeReviewRequestDTO requestDTO) {
        RecipeReviewResponseDTO updatedReview = recipeReviewService.updateReview(reviewId, requestDTO);
        return ResponseEntity.ok(updatedReview);
    }

    // 리뷰 삭제
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Map<String, String>> deleteReview(@PathVariable Long reviewId) {
        recipeReviewService.deleteReview(reviewId);
        String message = "리뷰 ID " + reviewId + "가 삭제되었습니다.";
        Map<String, String> response = Map.of("message", message);
        return ResponseEntity.ok(response);
    }
}