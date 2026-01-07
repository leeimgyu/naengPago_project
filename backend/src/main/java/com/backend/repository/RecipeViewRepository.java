package com.backend.repository;

import com.backend.entity.RecipeView;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeViewRepository extends JpaRepository<RecipeView, Long> {

    // 사용자가 조회한 모든 레시피 조회 (최신순)
    @Query("""
        SELECT rv
        FROM RecipeView rv
        JOIN FETCH rv.recipeId
        JOIN FETCH rv.user
        WHERE rv.user.userId = :userId
        ORDER BY rv.viewedAt DESC
        """)
    List<RecipeView> findByUser_UserIdOrderByViewedAtDesc(@Param("userId") Integer userId);

    // 사용자가 조회한 레시피를 최신순으로 제한된 개수만큼 조회
    List<RecipeView> findByUser_UserIdOrderByViewedAtDesc(Integer userId, Pageable pageable);

    // 사용자가 최근 조회한 레시피 목록 (중복 제거, 최신 조회만)
    @Query("""
        SELECT rv
        FROM RecipeView rv
        JOIN FETCH rv.recipeId
        JOIN FETCH rv.user
        WHERE rv.user.userId = :userId
        AND rv.viewedAt = (
            SELECT MAX(rv2.viewedAt)
            FROM RecipeView rv2
            WHERE rv2.user.userId = :userId
            AND rv2.recipeId.id = rv.recipeId.id
        )
        ORDER BY rv.viewedAt DESC
        """)
    List<RecipeView> findRecentUniqueViewsByUserId(@Param("userId") Integer userId, Pageable pageable);

    // 특정 레시피의 조회 이력 삭제
    void deleteByRecipeId_Id(Integer recipeId);

    // 사용자의 모든 조회 이력 삭제 (누락된 메서드 추가)
    void deleteByUser_UserId(Integer userId);

    // 사용자가 특정 레시피를 조회했는지 확인
    boolean existsByUser_UserIdAndRecipeId_Id(Integer userId, Integer recipeId);

    // 특정 레시피의 총 조회수 계산
    long countByRecipeId_Id(Integer recipeId);
}
