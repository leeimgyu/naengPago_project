package com.backend.repository;

import com.backend.entity.RecipeViewHistory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecipeViewHistoryRepository extends JpaRepository<RecipeViewHistory, Long> {

    /**
     * 특정 사용자와 레시피에 대한 조회 기록 조회
     */
    @Query("SELECT vh FROM RecipeViewHistory vh WHERE vh.user.userId = :userId AND vh.recipe.id = :recipeId")
    Optional<RecipeViewHistory> findByUserIdAndRecipeId(@Param("userId") Long userId, @Param("recipeId") Long recipeId);

    /**
     * 특정 사용자의 조회 기록을 최근 조회 순으로 조회
     */
    @Query("SELECT vh FROM RecipeViewHistory vh WHERE vh.user.userId = :userId ORDER BY vh.lastViewedAt DESC")
    List<RecipeViewHistory> findByUserIdOrderByLastViewedAtDesc(@Param("userId") Long userId);

    /**
     * 특정 사용자의 조회 기록을 최근 조회 순으로 제한된 개수만큼 조회
     */
    @Query("SELECT vh FROM RecipeViewHistory vh WHERE vh.user.userId = :userId ORDER BY vh.lastViewedAt DESC")
    List<RecipeViewHistory> findTopNByUserIdOrderByLastViewedAtDesc(@Param("userId") Long userId, PageRequest pageRequest);

    /**
     * 특정 레시피의 전체 조회수 합산 (모든 사용자의 view_count 합계)
     */
    @Query("SELECT COALESCE(SUM(vh.viewCount), 0) FROM RecipeViewHistory vh WHERE vh.recipe.id = :recipeId")
    Integer getTotalViewCountByRecipeId(@Param("recipeId") Long recipeId);
}
