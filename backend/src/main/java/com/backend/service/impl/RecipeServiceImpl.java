package com.backend.service.impl;

import com.backend.client.RecipeClient;
import com.backend.dto.RecipeRequestDTO;
import com.backend.dto.RecipeViewHistoryDTO;
import com.backend.dto.RecommendedRecipeDTO;
import com.backend.dto.UnifiedRecipeDTO;
import com.backend.dto.recipeApi.RecipeApi;
import com.backend.dto.recipeApi.RecipeResponse;
import com.backend.entity.RecipeLike;
import com.backend.entity.RecipeViewHistory;
import com.backend.entity.Recipes;
import com.backend.entity.User;
import com.backend.mappers.RecipeMapper;
import com.backend.repository.RecipeLikeRepository;
import com.backend.repository.RecipeViewHistoryRepository;
import com.backend.repository.RecipesRepository;
import com.backend.repository.UserRepository;
import com.backend.security.userdetails.UserPrincipal;
import com.backend.service.RecipeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import reactor.core.publisher.Mono;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RecipeServiceImpl implements RecipeService {

  // recipeRepository 대신 RecipesRepository로 변경
  private final RecipesRepository recipesRepository;
  private final RecipeLikeRepository recipeLikeRepository;
  private final RecipeViewHistoryRepository recipeViewHistoryRepository;
  private final UserRepository userRepository;
  private final RecipeClient recipeClient;

  @Override
  public Page<UnifiedRecipeDTO> searchRecipes(String keyword, String rcpPat2, Pageable pageable) {
    log.debug("통합 검색 실행 - 키워드: {}, 카테고리: {}", keyword, rcpPat2);

    Page<Recipes> recipesPage;

    boolean hasKeyword = StringUtils.hasText(keyword);
    boolean hasRcpPat2 = StringUtils.hasText(rcpPat2);

    if (hasKeyword && hasRcpPat2) {
      // Case 1: 키워드와 카테고리가 모두 제공된 경우
      recipesPage = recipesRepository.searchByCategoryAndKeyword(rcpPat2, keyword, pageable);
    } else if (hasKeyword) {
      // Case 2: 키워드만 제공된 경우
      recipesPage = recipesRepository.searchByKeyword(keyword, pageable);
    } else if (hasRcpPat2) {
      // Case 3: 카테고리만 제공된 경우
      recipesPage = recipesRepository.findByRcpPat2(rcpPat2, pageable);
    } else {
      // Case 4: 아무 조건도 없는 경우, 최신순으로 모든 레시피를 페이지별로 반환
      recipesPage = recipesRepository.findAll(PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("createdAt").descending()));
    }

    // Page<Recipes>를 Page<UnifiedRecipeDTO>로 변환
    return recipesPage.map(RecipeMapper::fromEntity);
  }

  @Override
  public Page<UnifiedRecipeDTO> getPopularRecipes(Pageable pageable) {
    log.debug("인기 레시피 조회 - 페이지 번호: {}, 페이지 크기: {}", pageable.getPageNumber(), pageable.getPageSize());
    Page<Recipes> recipesPage = recipesRepository.findByOrderByLikeCountDesc(pageable);
    return recipesPage.map(RecipeMapper::fromEntity);
  }

  @Override
  public Recipes getRecipeById(Long recipeId) {
    log.debug("레시피 조회 - ID: {}", recipeId);
    // Recipes 엔티티의 ID는 Integer이므로, recipeId (Long)를 Integer로 변환해야 함
    return recipesRepository.findById(recipeId.intValue())
            .orElseThrow(() -> new RuntimeException("레시피를 찾을 수 없습니다. ID: " + recipeId));
  }

  @Override
  @Transactional
  public Recipes createRecipe(RecipeRequestDTO requestDTO, UserPrincipal userPrincipal) {
    log.debug("레시피 생성 - 제목: {}", requestDTO.getRcpNm());
    User user = userRepository.findById(userPrincipal.getId())
        .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다. ID: " + userPrincipal.getId()));

    Recipes recipe = RecipeMapper.toEntity(requestDTO);
    recipe.setUser(user); // 생성된 레시피에 사용자 정보 설정
    return recipesRepository.save(recipe);
  }

  @Override
  @Transactional
  public Recipes updateRecipe(Long recipeId, RecipeRequestDTO requestDTO) {
    log.debug("레시피 수정 - ID: {}", recipeId);
    Recipes existingRecipe = getRecipeById(recipeId);

    // DTO의 값으로 기존 엔티티 업데이트
    existingRecipe.setRcpNm(requestDTO.getRcpNm());
    existingRecipe.setRcpWay2(requestDTO.getRcpWay2());
    existingRecipe.setRcpPat2(requestDTO.getRcpPat2());
    existingRecipe.setRcpPartsDtls(requestDTO.getRcpPartsDtls());
    existingRecipe.setHashTag(requestDTO.getHashTag());
    existingRecipe.setRcpNaTip(requestDTO.getRcpNaTip());
    existingRecipe.setAttFileNoMain(requestDTO.getAttFileNoMain());
    existingRecipe.setAttFileNoMk(requestDTO.getAttFileNoMk());
    existingRecipe.setInfoEng(requestDTO.getInfoEng());
    existingRecipe.setInfoCar(requestDTO.getInfoCar());
    existingRecipe.setInfoPro(requestDTO.getInfoPro());
    existingRecipe.setInfoFat(requestDTO.getInfoFat());
    existingRecipe.setInfoNa(requestDTO.getInfoNa());
    existingRecipe.setInfoWgt(requestDTO.getInfoWgt());

    // Manual fields 업데이트
    existingRecipe.setManual01(requestDTO.getManual01());
    existingRecipe.setManual02(requestDTO.getManual02());
    existingRecipe.setManual03(requestDTO.getManual03());
    existingRecipe.setManual04(requestDTO.getManual04());
    existingRecipe.setManual05(requestDTO.getManual05());
    existingRecipe.setManual06(requestDTO.getManual06());
    existingRecipe.setManual07(requestDTO.getManual07());
    existingRecipe.setManual08(requestDTO.getManual08());
    existingRecipe.setManual09(requestDTO.getManual09());
    existingRecipe.setManual10(requestDTO.getManual10());
    existingRecipe.setManual11(requestDTO.getManual11());
    existingRecipe.setManual12(requestDTO.getManual12());
    existingRecipe.setManual13(requestDTO.getManual13());
    existingRecipe.setManual14(requestDTO.getManual14());
    existingRecipe.setManual15(requestDTO.getManual15());
    existingRecipe.setManual16(requestDTO.getManual16());
    existingRecipe.setManual17(requestDTO.getManual17());
    existingRecipe.setManual18(requestDTO.getManual18());
    existingRecipe.setManual19(requestDTO.getManual19());
    existingRecipe.setManual20(requestDTO.getManual20());

    // Manual image fields 업데이트
    existingRecipe.setManualImg01(requestDTO.getManualImg01());
    existingRecipe.setManualImg02(requestDTO.getManualImg02());
    existingRecipe.setManualImg03(requestDTO.getManualImg03());
    existingRecipe.setManualImg04(requestDTO.getManualImg04());
    existingRecipe.setManualImg05(requestDTO.getManualImg05());
    existingRecipe.setManualImg06(requestDTO.getManualImg06());
    existingRecipe.setManualImg07(requestDTO.getManualImg07());
    existingRecipe.setManualImg08(requestDTO.getManualImg08());
    existingRecipe.setManualImg09(requestDTO.getManualImg09());
    existingRecipe.setManualImg10(requestDTO.getManualImg10());
    existingRecipe.setManualImg11(requestDTO.getManualImg11());
    existingRecipe.setManualImg12(requestDTO.getManualImg12());
    existingRecipe.setManualImg13(requestDTO.getManualImg13());
    existingRecipe.setManualImg14(requestDTO.getManualImg14());
    existingRecipe.setManualImg15(requestDTO.getManualImg15());
    existingRecipe.setManualImg16(requestDTO.getManualImg16());
    existingRecipe.setManualImg17(requestDTO.getManualImg17());
    existingRecipe.setManualImg18(requestDTO.getManualImg18());
    existingRecipe.setManualImg19(requestDTO.getManualImg19());
    existingRecipe.setManualImg20(requestDTO.getManualImg20());

    return recipesRepository.save(existingRecipe);
  }

  @Override
  @Transactional
  public void deleteRecipe(Long recipeId) {
    log.debug("레시피 삭제 - ID: {}", recipeId);
    Recipes recipe = getRecipeById(recipeId);
    recipesRepository.delete(recipe);
  }

  @Override
  public List<Recipes> getLatestRecipes(int limit) {
    log.debug("최신 레시피 조회 - 개수: {}", limit);
    return recipesRepository.findAllByOrderByCreatedAtDesc().stream().limit(limit).collect(Collectors.toList());
  }

  // 좋아요 증감 로직은 toggleLike 메서드에서 처리되므로 incrementLikeCount와 decrementLikeCount는 제거합니다.

  @Override
  @Transactional
  public void incrementViewCount(Long recipeId, UserPrincipal userPrincipal) {
    // 1. 레시피 엔티티의 조회수(view_count)를 항상 증가시킵니다.
    Recipes recipe = getRecipeById(recipeId);
    recipe.setViewCount(recipe.getViewCount() + 1);
    recipesRepository.save(recipe);

    // 2. 로그인한 사용자의 경우, RecipeView 테이블에 조회 이력을 남깁니다.
    if (userPrincipal != null) {
      Integer userId = userPrincipal.getId();
      log.debug("로그인 사용자 조회 이력 기록 - recipeId: {}, userId: {}", recipeId, userId);
      recordRecipeView(userId, recipeId);
    } else {
      log.debug("비로그인 사용자 조회수 증가 - recipeId: {}", recipeId);
    }
  }


  @Override
  @Transactional
  public Recipes toggleLike(Integer userId, Long recipeId) {
    log.debug("레시피 좋아요 토글 - 사용자 ID: {}, 레시피 ID: {}", userId, recipeId);

    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다. ID: " + userId));
    Recipes recipe = getRecipeById(recipeId);

    boolean alreadyLiked = recipeLikeRepository.existsByUser_UserIdAndRecipeId_Id(userId, recipeId.intValue());
    if (alreadyLiked) {
      recipeLikeRepository.deleteByUser_UserIdAndRecipeId_Id(userId, recipeId.intValue());
      recipe.setLikeCount(recipe.getLikeCount() - 1);
      log.debug("레시피 좋아요 취소됨");
    } else {
      RecipeLike recipeLike = RecipeLike.builder().user(user).recipeId(recipe).build();
      recipeLikeRepository.save(recipeLike);
      recipe.setLikeCount(recipe.getLikeCount() + 1);
      log.debug("레시피 좋아요 추가됨");
    }
    return recipesRepository.save(recipe);
  }

  @Override
  public boolean isLikedByUser(Integer userId, Long recipeId) {
    log.debug("사용자 좋아요 여부 확인 - 사용자 ID: {}, 레시피 ID: {}", userId, recipeId);
    // existsByUser_UserIdAndRecipe_RecipeId도 existsByUser_UserIdAndRecipeId_Id로 변경
    return recipeLikeRepository.existsByUser_UserIdAndRecipeId_Id(userId, recipeId.intValue());
  }

  @Override
  public List<Recipes> getLikedRecipesByUser(Integer userId) {
    log.debug("사용자가 좋아요한 레시피 조회 - 사용자 ID: {}", userId);
    List<RecipeLike> recipeLikes = recipeLikeRepository.findByUser_UserId(userId);
    // RecipeLike::getRecipes 메서드 대신 RecipeLike::getRecipeId 메서드 사용
    return recipeLikes.stream().map(RecipeLike::getRecipeId).collect(Collectors.toList());
  }

  @Override
  public List<UnifiedRecipeDTO> getAllUnifiedRecipes() {
    log.debug("모든 통합 레시피 조회 시작 (DB only) - 등록 시간 기준 최신순");

    // 1. 모든 레시피를 등록된 시간(createdAt) 기준 최신순으로 조회
    List<Recipes> allRecipes = recipesRepository.findAllByOrderByCreatedAtDesc();
    List<User> allUsers = userRepository.findAll();

    // 2. 사용자 ID를 키로 하는 맵을 생성하여 빠른 조회를 위함
    Map<Integer, User> userMap = allUsers.stream()
        .collect(Collectors.toMap(User::getUserId, user -> user));
    // 3. 레시피를 DTO로 변환하면서 사용자 정보 주입
    List<UnifiedRecipeDTO> combinedList = allRecipes.stream()
        .map(recipe -> {
            UnifiedRecipeDTO dto = RecipeMapper.fromEntity(recipe);

            // RecipeMapper에서 user 정보를 사용해 nickname, author, userId를 채웠을 것입니다.
            // 여기서는 매퍼의 결과를 신뢰하고 dto에서 userId를 가져와 추가 검증 로직에 사용합니다.
            Integer userId = dto.getUserId();

            if (userId != null && userMap.containsKey(userId)) {
                // userMap을 사용하는 이 로직은 RecipeMapper에서 이미 처리되었을 가능성이 높으므로
                // 여기서는 DTO에 이미 채워진 author/nickname을 신뢰합니다.
                // 만약 RecipeMapper에서 User 객체 자체를 매핑할 수 없는 상황이었다면,
                // 이 userMap을 통해 nickname/author를 채우는 로직이 필요했습니다.
            } else {
                // userId가 없거나, 해당 유저를 찾을 수 없는 경우
                // RecipeMapper에서 이미 "운영자"로 설정했을 것입니다.
            }
            return dto;
        })
        .collect(Collectors.toList());

    log.debug("통합 레시피 목록 생성 완료. 총 {}개.", combinedList.size());

    return combinedList;
  }

  @Override
  public List<Recipes> getWeeklyRecommendedRecipes() {
    log.debug("주간 추천 레시피 조회");
    return recipesRepository.findRandomRecipes(7);
  }

  @Transactional
  public void recordRecipeView(Integer userId, Long recipeId) {
    log.debug("레시피 조회 기록 저장 - 사용자 ID: {}, 레시피 ID: {}", userId, recipeId);

    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다. ID: " + userId));

    Recipes recipe = getRecipeById(recipeId);

    // 기존 조회 기록이 있는지 확인
    recipeViewHistoryRepository.findByUserIdAndRecipeId(Long.valueOf(userId), recipeId)
        .ifPresentOrElse(
            // 기존 기록이 있으면 조회수 증가 및 lastViewedAt 업데이트
            viewHistory -> {
              viewHistory.incrementViewCount();
              recipeViewHistoryRepository.save(viewHistory);
              log.debug("조회 기록 업데이트 - 조회수: {}", viewHistory.getViewCount());
            },
            // 새로운 조회 기록 생성
            () -> {
              RecipeViewHistory newViewHistory = RecipeViewHistory.builder()
                  .user(user)
                  .recipe(recipe)
                  .build();
              recipeViewHistoryRepository.save(newViewHistory);
              log.debug("새로운 조회 기록 생성");
            }
        );
  }

  @Override
  public List<RecipeViewHistoryDTO> getUserViewHistory(Integer userId) {
    log.debug("사용자 조회 기록 조회 - 사용자 ID: {}", userId);

    List<RecipeViewHistory> viewHistories = recipeViewHistoryRepository
        .findByUserIdOrderByLastViewedAtDesc(Long.valueOf(userId));

    return viewHistories.stream()
        .map(RecipeViewHistoryDTO::fromEntity)
        .collect(Collectors.toList());
  }

  @Override
  public List<RecipeViewHistoryDTO> getUserViewHistory(Integer userId, int limit) {
    log.debug("사용자 조회 기록 조회 (제한) - 사용자 ID: {}, 개수: {}", userId, limit);

    List<RecipeViewHistory> viewHistories = recipeViewHistoryRepository
        .findTopNByUserIdOrderByLastViewedAtDesc(
            Long.valueOf(userId),
            org.springframework.data.domain.PageRequest.of(0, limit)
        );

    return viewHistories.stream()
        .map(RecipeViewHistoryDTO::fromEntity)
        .collect(Collectors.toList());
  }

  // 식품의약품안전처_조리식품의 레시피 api implement
  @Override
  public Mono<RecipeResponse> getRecipes(int startIdx, int endIdx) {
    return recipeClient.fetchRecipes(startIdx, endIdx);
  }

  @Override
  public Mono<RecipeResponse> getRecipes(int startIdx, int endIdx, String RCP_NM) {
    return recipeClient.fetchRecipes(startIdx, endIdx, RCP_NM);
  }

  @Override
  public Mono<RecipeResponse> getRecipesForCurrentWeek() {
    LocalDate today = LocalDate.now();
    LocalDate monday = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
    LocalDate sunday = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));

    int startIdx = monday.getDayOfMonth();
    int endIdx = sunday.getDayOfMonth();

    if (startIdx > endIdx) {
      startIdx = 1;
      endIdx = startIdx + 6;
    }

    return getRecipes(startIdx, endIdx);
  }

  @Override
  public Mono<RecipeResponse> getRecipesForCurrentWeek(String RCP_NM) {
    LocalDate today = LocalDate.now();
    LocalDate monday = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
    LocalDate sunday = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));

    int startIdx = monday.getDayOfMonth();
    int endIdx = sunday.getDayOfMonth();

    if (startIdx > endIdx) {
      startIdx = 1;
      endIdx = startIdx + 6;
    }

    return getRecipes(startIdx, endIdx, RCP_NM);
  }

  @Override
  @Transactional
  // 외부 API 레시피 이름으로 DB에 있는 레시피 ID를 찾거나 새로 생성하여 ID를 반환
  public Long getOrCreateRecipeIdFromOpenApi(String rcpNm) {
    // 1. rcpNm으로 내부 DB에서 레시피를 먼저 찾아봅니다.
    Optional<Recipes> existingRecipe = recipesRepository.findByRcpNm(rcpNm);

    if (existingRecipe.isPresent()) {
      // 2. 만약 DB에 이미 존재하면, 해당 레시피의 ID를 즉시 반환합니다.
      log.debug("DB에서 '{}' 레시피를 찾았습니다. ID: {}", rcpNm, existingRecipe.get().getId());
      return existingRecipe.get().getId().longValue();
    } else {
      // 3. DB에 없다면, 외부 API에서 해당 레시피 정보를 가져옵니다.
      log.debug("DB에 '{}' 레시피가 없어 외부 API에서 조회합니다.", rcpNm);
      RecipeResponse response = recipeClient.fetchRecipes(1, 1, rcpNm).block(); // 동기적으로 결과를 기다림

      if (response == null || response.getCookRcp01().getRow().isEmpty()) {
        throw new RuntimeException("외부 API에서 레시피를 찾을 수 없습니다: " + rcpNm);
      }

      RecipeApi recipeApi = response.getCookRcp01().getRow().get(0);

      // 4. RecipeMapper를 사용해 외부 API 데이터를 Recipes 엔티티로 변환합니다.
      Recipes newRecipe = RecipeMapper.toEntity(recipeApi);
      // API에서 가져온 레시피는 특정 사용자가 작성한 것이 아니므로 user 필드는 null로 둡니다.

      // 5. 변환된 레시피를 DB에 저장합니다.
      Recipes savedRecipe = recipesRepository.save(newRecipe);
      log.debug("외부 API 레시피를 DB에 새로 저장했습니다. New ID: {}", savedRecipe.getId());

      // 6. 새로 저장된 레시피의 ID를 반환합니다.
      return savedRecipe.getId().longValue();
    }
  }

  @Override
  public List<RecommendedRecipeDTO> getRecommendedRecipesByUserFridge(Integer userId, int limit) {
    log.debug("사용자 냉장고 기반 추천 레시피 조회 - 사용자 ID: {}, 개수: {}", userId, limit);

    // 1. 사용자 냉장고 재료와 매칭되는 레시피 조회
    List<Recipes> recommendedRecipes = recipesRepository.findRecommendedRecipesByUserFridge(userId, limit);

    // 2. 각 레시피에 대해 매칭된 재료 목록을 조회하고 DTO로 변환
    return recommendedRecipes.stream()
        .map(recipe -> {
          // 매칭된 재료 목록 조회
          List<String> matchedIngredients = recipesRepository.findMatchedIngredientsByRecipeAndUser(
              recipe.getId(),
              userId
          );

          // RecommendedRecipeDTO로 변환
          return RecommendedRecipeDTO.builder()
              .recipeId(recipe.getId().longValue())
              .title(recipe.getRcpNm())
              .imageUrl(recipe.getAttFileNoMain())
              .cookingTime(null) // Recipes 엔티티에 조리시간 필드가 없어 null로 설정
              .difficulty(recipe.getRcpWay2())
              .matchedIngredients(matchedIngredients)
              .build();
        })
        .collect(Collectors.toList());
  }
}
