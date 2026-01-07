package com.backend.repository;

import com.backend.entity.RecipeLike;
import com.backend.entity.Recipes; // Recipes 엔티티 import
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecipeLikeRepository extends JpaRepository<RecipeLike, Long> {

    // 사용자와 레시피로 좋아요 조회
    Optional<RecipeLike> findByUser_UserIdAndRecipeId_Id(Integer userId, Integer recipeId);

    // 사용자가 좋아요한 모든 레시피 조회 (JOIN FETCH로 Lazy Loading 해결)
    @Query("""
        SELECT rl
        FROM RecipeLike rl
        JOIN FETCH rl.recipeId
        JOIN FETCH rl.user
        WHERE rl.user.userId = :userId
        ORDER BY rl.createdAt DESC
        """)
    List<RecipeLike> findByUser_UserId(@Param("userId") Integer userId);

    // 특정 레시피의 모든 좋아요 조회
    List<RecipeLike> findByRecipeId_Id(Integer recipeId);

    // 사용자가 특정 레시피에 좋아요를 했는지 확인
    boolean existsByUser_UserIdAndRecipeId_Id(Integer userId, Integer recipeId);

    // 사용자와 레시피로 좋아요 삭제
    void deleteByUser_UserIdAndRecipeId_Id(Integer userId, Integer recipeId);

    // 특정 레시피의 좋아요 개수 조회
    long countByRecipeId_Id(Integer recipeId);
}
