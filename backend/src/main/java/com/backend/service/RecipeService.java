package com.backend.service;

import com.backend.dto.RecipeRequestDTO;
import com.backend.dto.RecipeViewHistoryDTO;
import com.backend.dto.RecommendedRecipeDTO;
import com.backend.dto.UnifiedRecipeDTO;
import com.backend.dto.recipeApi.RecipeResponse;
import com.backend.entity.Recipes;
import com.backend.security.userdetails.UserPrincipal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Optional;

public interface RecipeService {

  // 통합 검색 (키워드, 카테고리, 페이징)
  Page<UnifiedRecipeDTO> searchRecipes(String keyword, String rcpPat2, Pageable pageable);

  // 레시피 ID로 조회
  Recipes getRecipeById(Long recipeId);

  // 레시피 생성
  Recipes createRecipe(RecipeRequestDTO requestDTO, UserPrincipal userPrincipal);

  // 레시피 수정
  Recipes updateRecipe(Long recipeId, RecipeRequestDTO requestDTO);

  // 레시피 삭제
  void deleteRecipe(Long recipeId);

  // 인기 레시피 조회
  Page<UnifiedRecipeDTO> getPopularRecipes(Pageable pageable);

  // 최신 레시피 조회
  List<Recipes> getLatestRecipes(int limit);

  // 레시피 조회수 증가
  void incrementViewCount(Long recipeId, UserPrincipal userPrincipal);

  // 사용자가 레시피에 좋아요 추가 (중복 방지)
  Recipes toggleLike(Integer userId, Long recipeId);

  // 식품의약품안전처_조리식품의 레시피 api
  Mono<RecipeResponse> getRecipes(int startIdx, int endIdx);
  Mono<RecipeResponse> getRecipes(int startIdx, int endIdx, String RCP_NM);
  Mono<RecipeResponse> getRecipesForCurrentWeek();
  Mono<RecipeResponse> getRecipesForCurrentWeek(String RCP_NM);

  // 외부 API - rcpSeq: string db - reqSeq: Integer
  // 외부 API 레시피와 로컬 DB 레시피를 연결하는 유일한 공통 식별자가 rcpNm이므로 사용
  Long getOrCreateRecipeIdFromOpenApi(String rcpNm);


  // 사용자가 특정 레시피에 좋아요를 했는지 확인
  boolean isLikedByUser(Integer userId, Long recipeId);

  // 사용자가 좋아요한 모든 레시피 조회
  List<Recipes> getLikedRecipesByUser(Integer userId);

  // 모든 통합 레시피 조회 (DB만 사용)
  List<UnifiedRecipeDTO> getAllUnifiedRecipes();

  // 주간 추천 레시피 조회
  List<Recipes> getWeeklyRecommendedRecipes();

  /**
   * 레시피 조회 기록 저장 또는 업데이트
   */
  void recordRecipeView(Integer userId, Long recipeId);

  /**
   * 사용자의 조회 기록 조회 (최근 조회 순)
   */
  List<RecipeViewHistoryDTO> getUserViewHistory(Integer userId);

  /**
   * 사용자의 조회 기록 조회 (제한된 개수)
   */
  List<RecipeViewHistoryDTO> getUserViewHistory(Integer userId, int limit);

  /**
   * 사용자 냉장고 재료 기반 추천 레시피 조회
   * @param userId 사용자 ID
   * @param limit 추천 레시피 개수 (기본 5개)
   * @return 추천 레시피 목록 (매칭된 재료 포함)
   */
  List<RecommendedRecipeDTO> getRecommendedRecipesByUserFridge(Integer userId, int limit);
}
