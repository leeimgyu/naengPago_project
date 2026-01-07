package com.backend.repository;

import com.backend.entity.RecipeReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RecipeReviewRepository extends JpaRepository<RecipeReview, Long> {

    // 특정 레시피에 달린 모든 리뷰를 찾습니다.
    @Query("""
        SELECT rr
        FROM RecipeReview rr
        JOIN FETCH rr.recipe
        WHERE rr.recipe.id = :recipeId
        ORDER BY rr.createdAt DESC
        """)
    List<RecipeReview> findByRecipe_IdOrderByCreatedAtDesc(@Param("recipeId") Integer recipeId);

    // 특정 사용자가 작성한 모든 리뷰를 찾습니다 (생성일 기준 내림차순).
    @Query("""
        SELECT rr
        FROM RecipeReview rr
        JOIN FETCH rr.recipe
        WHERE rr.userId = :userId
        ORDER BY rr.createdAt DESC
        """)
    List<RecipeReview> findByUserIdOrderByCreatedAtDesc(@Param("userId") Integer userId);
}