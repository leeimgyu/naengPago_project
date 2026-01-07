package com.backend.controller;

import com.backend.dto.RecipeRequestDTO;
import com.backend.dto.RecipeViewHistoryDTO;
import com.backend.dto.RecommendedRecipeDTO;
import com.backend.dto.UnifiedRecipeDTO;
import com.backend.dto.recipeApi.RecipeResponse;
import com.backend.entity.Recipes;
import com.backend.mappers.RecipeMapper;
import com.backend.repository.UserRepository;
import com.backend.security.userdetails.UserPrincipal;
import com.backend.service.RecipeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
public class RecipeController {

  private final RecipeService recipeService;
  private final UserRepository userRepository;

  // 통합 검색
  @GetMapping("/search")
  public ResponseEntity<Page<UnifiedRecipeDTO>> searchRecipes(
      @RequestParam(required = false) String keyword,
      @RequestParam(required = false) String rcpPat2,
      Pageable pageable) {
    log.info("레시피 통합 검색 - 키워드: {}, 카테고리: {}", keyword, rcpPat2);
    Page<UnifiedRecipeDTO> recipesPage = recipeService.searchRecipes(keyword, rcpPat2, pageable);
    return ResponseEntity.ok(recipesPage);
  }

  // 모든 레시피 조회
  @GetMapping
  public ResponseEntity<List<UnifiedRecipeDTO>> getAllRecipes() {
    log.info("모든 레시피 조회 요청");
    List<UnifiedRecipeDTO> recipes = recipeService.getAllUnifiedRecipes();
    return ResponseEntity.ok(recipes);
  }

  // 레시피 ID로 조회
  @GetMapping("/{recipeId}")
  public ResponseEntity<UnifiedRecipeDTO> getRecipeById(
      @PathVariable Long recipeId,
      @AuthenticationPrincipal UserPrincipal userPrincipal) {
    log.info("레시피 조회 요청 - ID: {}", recipeId);

    Recipes recipesEntity = recipeService.getRecipeById(recipeId);
    recipeService.incrementViewCount(recipeId, userPrincipal);

    return ResponseEntity.ok(RecipeMapper.fromEntity(recipesEntity));

  }

  // 레시피 생성
  @PostMapping
  public ResponseEntity<UnifiedRecipeDTO> createRecipe(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                       @RequestBody RecipeRequestDTO requestDTO) {
    log.info("레시피 생성 요청 - 제목: {}, 사용자 ID: {}", requestDTO.getRcpNm(),
        userPrincipal != null ? userPrincipal.getId() : "null");

    if (userPrincipal == null) {
      throw new BadCredentialsException("인증되지 않은 사용자입니다.");
    }

    Recipes createdRecipe = recipeService.createRecipe(requestDTO, userPrincipal);
    return ResponseEntity.status(HttpStatus.CREATED).body(RecipeMapper.fromEntity(createdRecipe));
  }

  // 레시피 수정
  @PutMapping("/{recipeId}")
  public ResponseEntity<UnifiedRecipeDTO> updateRecipe(
      @AuthenticationPrincipal UserPrincipal userPrincipal,
      @PathVariable Long recipeId,
      @RequestBody RecipeRequestDTO requestDTO) {
    log.info("레시피 수정 요청 - ID: {}, 사용자 ID: {}", recipeId,
        userPrincipal != null ? userPrincipal.getId() : "null");

    if (userPrincipal == null) {
      throw new BadCredentialsException("인증되지 않은 사용자입니다.");
    }

    Recipes updatedRecipe = recipeService.updateRecipe(recipeId, requestDTO);
    return ResponseEntity.ok(RecipeMapper.fromEntity(updatedRecipe));
  }

  // 레시피 삭제
  @DeleteMapping("/{recipeId}")
  public ResponseEntity<Void> deleteRecipe(
      @AuthenticationPrincipal UserPrincipal userPrincipal,
      @PathVariable Long recipeId) {
    log.info("레시피 삭제 요청 - ID: {}", recipeId,
        userPrincipal != null ? userPrincipal.getId() : "null");

    if (userPrincipal == null) {
      throw new BadCredentialsException("인증되지 않은 사용자입니다.");
    }

    recipeService.deleteRecipe(recipeId);
    return ResponseEntity.noContent().build();
  }

  // 인기 레시피 조회 (좋아요 수 기준)
  @GetMapping("/popular")
  public ResponseEntity<Page<UnifiedRecipeDTO>> getPopularRecipes(Pageable pageable) {
    log.info("인기 레시피 조회 - 페이지: {}", pageable.getPageNumber());
    Page<UnifiedRecipeDTO> recipes = recipeService.getPopularRecipes(pageable);
    return ResponseEntity.ok(recipes);
  }

  // 최신 레시피 조회
  @GetMapping("/latest")
  public ResponseEntity<List<UnifiedRecipeDTO>> getLatestRecipes(
      @RequestParam(defaultValue = "10") int limit) {
    log.info("최신 레시피 조회 - 개수: {}", limit);

    List<UnifiedRecipeDTO> recipes = recipeService.getLatestRecipes(limit).stream()
        .map(RecipeMapper::fromEntity)
        .collect(Collectors.toList());

    return ResponseEntity.ok(recipes);
  }

  @PostMapping("/{recipeId}/toggle-like")
  public ResponseEntity<UnifiedRecipeDTO> toggleLike(
      @AuthenticationPrincipal UserPrincipal userPrincipal,
      @PathVariable Long recipeId) {
    log.info("레시피 좋아요 토글 요청 - 사용자 ID: {}, 레시피 ID: {}",
        userPrincipal != null ? userPrincipal.getId() : "null", recipeId);

    if (userPrincipal == null) {
      throw new BadCredentialsException("인증되지 않은 사용자입니다.");
    }

    Recipes recipe = recipeService.toggleLike(userPrincipal.getId(), recipeId);
    return ResponseEntity.ok(RecipeMapper.fromEntity(recipe));
  }

  // 사용자가 특정 레시피에 좋아요를 했는지 확인
  @GetMapping("/{recipeId}/is-liked")
  public ResponseEntity<Boolean> isLikedByUser(
      @AuthenticationPrincipal UserPrincipal userPrincipal,
      @PathVariable Long recipeId) {
    log.info("레시피 좋아요 여부 확인 - 사용자 ID: {}, 레시피 ID: {}",
        userPrincipal != null ? userPrincipal.getId() : "null", recipeId);

    if (userPrincipal == null) {
      return ResponseEntity.ok(false); // 로그인 안 한 사용자는 항상 false
    }

    boolean isLiked = recipeService.isLikedByUser(userPrincipal.getId(), recipeId);
    return ResponseEntity.ok(isLiked);
  }

  // 사용자가 좋아요한 모든 레시피 조회
  @GetMapping("/liked")
  public ResponseEntity<List<UnifiedRecipeDTO>> getLikedRecipesByUser(
      @AuthenticationPrincipal UserPrincipal userPrincipal) {
    log.info("사용자가 좋아요한 레시피 조회 - 사용자 ID: {}",
        userPrincipal != null ? userPrincipal.getId() : "null");

    if (userPrincipal == null) {
      throw new BadCredentialsException("인증되지 않은 사용자입니다.");
    }

    List<UnifiedRecipeDTO> recipes = recipeService.getLikedRecipesByUser(userPrincipal.getId()).stream()
        .map(RecipeMapper::fromEntity)
        .collect(Collectors.toList());

    return ResponseEntity.ok(recipes);
  }

  // 주간 추천 레시피 조회
  @GetMapping("/weekly-recommendation")
  public Mono<RecipeResponse> getWeeklyRecommendedRecipes() {
    log.info("주간 추천 레시피 조회 요청 (OpenAPI)");
    return recipeService.getRecipesForCurrentWeek();
  }

  // rcpNm으로 DB 레시피 ID를 조회하거나, 없으면 생성 후 ID 반환
  @GetMapping("/id-by-name")
  public ResponseEntity<Long> getRecipeIdByName(@RequestParam String rcpNm) {
    log.info("rcpNm으로 레시피 ID 조회/생성 요청 - 이름: {}", rcpNm);
    Long recipeId = recipeService.getOrCreateRecipeIdFromOpenApi(rcpNm);
    return ResponseEntity.ok(recipeId);
  }

  /**
   * 사용자의 조회 기록 조회
   */
  @GetMapping("/view-history")
  public ResponseEntity<List<RecipeViewHistoryDTO>> getUserViewHistory(
      @RequestParam Integer userId,
      @RequestParam(required = false) Integer limit) {
    log.info("사용자 조회 기록 조회 - 사용자 ID: {}, 제한: {}", userId, limit);

    List<RecipeViewHistoryDTO> viewHistory;
    if (limit != null && limit > 0) {
      viewHistory = recipeService.getUserViewHistory(userId, limit);
    } else {
      viewHistory = recipeService.getUserViewHistory(userId);
    }

    return ResponseEntity.ok(viewHistory);
  }

  /**
   * 사용자 냉장고 재료 기반 추천 레시피 조회
   */
  @GetMapping("/recommendations/fridge")
  public ResponseEntity<List<RecommendedRecipeDTO>> getRecommendedRecipesByUserFridge(
      @AuthenticationPrincipal UserPrincipal userPrincipal,
      @RequestParam(defaultValue = "5") int limit) {
    log.info("냉장고 기반 추천 레시피 조회 - 사용자 ID: {}, 개수: {}",
        userPrincipal != null ? userPrincipal.getId() : "null", limit);

    if (userPrincipal == null) {
      throw new BadCredentialsException("인증되지 않은 사용자입니다.");
    }

    List<RecommendedRecipeDTO> recommendedRecipes =
        recipeService.getRecommendedRecipesByUserFridge(userPrincipal.getId(), limit);

    return ResponseEntity.ok(recommendedRecipes);
  }
}
