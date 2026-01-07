package com.backend.repository;

import com.backend.entity.Recipes;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecipesRepository extends JpaRepository<Recipes, Integer> {

  // 레시피 이름으로 정확히 일치하는 레시피 조회
  Optional<Recipes> findByRcpNm(String rcpNm);

    // 요리 종류(rcpPat2)로 레시피 검색 (페이징 처리)
    Page<Recipes> findByRcpPat2(String rcpPat2, Pageable pageable);

    // 최신 레시피 조회 (createdAt 필드 기준 내림차순 정렬)
    List<Recipes> findAllByOrderByCreatedAtDesc();

    // 키워드로 레시피 이름 또는 재료 검색 (페이징 처리)
    @Query("SELECT r FROM Recipes r WHERE r.rcpNm LIKE %:keyword% OR r.rcpPartsDtls LIKE %:keyword%")
    Page<Recipes> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    // 카테고리(요리 종류) 내에서 키워드로 레시피 이름 또는 재료 검색 (페이징 처리)
    @Query("SELECT r FROM Recipes r WHERE r.rcpPat2 = :rcpPat2 AND (r.rcpNm LIKE %:keyword% OR r.rcpPartsDtls LIKE %:keyword%)")
    Page<Recipes> searchByCategoryAndKeyword(@Param("rcpPat2") String rcpPat2, @Param("keyword") String keyword, Pageable pageable);

  // 좋아요 수(likeCount) 기준 내림차순 정렬하여 페이지네이션
  Page<Recipes> findByOrderByLikeCountDesc(Pageable pageable);

  // 주간 추천 레시피용 임의 레시피 조회
  @Query(value = "SELECT * FROM recipes ORDER BY RANDOM() LIMIT :limit", nativeQuery = true)
  List<Recipes> findRandomRecipes(@Param("limit") int limit);

    /**
     * 사용자 냉장고 재료를 기반으로 추천 레시피 조회
     * @param userId 사용자 ID
     * @param limit 추천 레시피 개수
     * @return 추천 레시피 목록
     */
    @Query(value = """
        SELECT r.*
        FROM recipes r
        WHERE EXISTS (
            SELECT 1
            FROM user_fridge uf
            WHERE r.rcp_parts_dtls LIKE '%' || uf.name || '%'
            AND uf.user_id = :userId
        )
        ORDER BY RANDOM()
        LIMIT :limit
        """, nativeQuery = true)
    List<Recipes> findRecommendedRecipesByUserFridge(
        @Param("userId") Integer userId,
        @Param("limit") int limit
    );

    /**
     * 특정 레시피에 매칭된 사용자 냉장고 재료 조회
     * @param recipeId 레시피 ID (rcp_seq)
     * @param userId 사용자 ID
     * @return 매칭된 재료 이름 목록
     */
    @Query(value = """
        SELECT DISTINCT uf.name
        FROM user_fridge uf
        WHERE uf.user_id = :userId
        AND EXISTS (
            SELECT 1 FROM recipes r
            WHERE r.rcp_seq = :recipeId
            AND r.rcp_parts_dtls LIKE '%' || uf.name || '%'
        )
        """, nativeQuery = true)
    List<String> findMatchedIngredientsByRecipeAndUser(
        @Param("recipeId") Integer recipeId,
        @Param("userId") Integer userId
    );
}

  

