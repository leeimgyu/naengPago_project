package com.backend.service.impl;

import com.backend.dto.RecipeViewDTO;
import com.backend.entity.Recipes;
import com.backend.entity.RecipeView;
import com.backend.entity.User;
// import com.backend.mappers.RecipeMapper; // 이제 여기서 직접 사용하지 않으므로 제거
import com.backend.repository.RecipesRepository;
import com.backend.repository.RecipeViewRepository;
import com.backend.repository.UserRepository;
import com.backend.service.RecipeViewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RecipeViewServiceImpl implements RecipeViewService {

    private final RecipeViewRepository recipeViewRepository;
    private final RecipesRepository recipesRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public RecipeView recordView(Integer userId, Integer recipeId) {
        // 비로그인 사용자인 경우, 조회 기록하지 않음
        if (userId == null) {
            log.debug("비로그인 사용자는 조회수를 기록하지 않습니다.");
            return null;
        }

        // 로그인 사용자인 경우, 중복 조회 확인
        boolean alreadyViewed = recipeViewRepository.existsByUser_UserIdAndRecipeId_Id(userId, recipeId);
        if (alreadyViewed) {
            log.debug("이미 조회한 레시피입니다 - userId: {}, recipeId: {}", userId, recipeId);
            return null; // 이미 조회했으므로 추가 작업 없음
        }

        log.debug("로그인 사용자 신규 조회 이력 저장 - userId: {}, recipeId: {}", userId, recipeId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다. ID: " + userId));
        Recipes recipe = recipesRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("레시피를 찾을 수 없습니다. ID: " + recipeId));

        RecipeView recipeView = RecipeView.builder()
                .user(user)
                .recipeId(recipe)
                .viewedAt(LocalDateTime.now())
                .build();

        return recipeViewRepository.save(recipeView);
    }

    @Override
    public List<RecipeViewDTO> getRecentViewedRecipes(Integer userId, int limit) {
        log.debug("사용자의 최근 조회 레시피 조회 - userId: {}, limit: {}", userId, limit);

        Pageable pageable = PageRequest.of(0, limit);
        List<RecipeView> recipeViews = recipeViewRepository.findRecentUniqueViewsByUserId(userId, pageable);

        return recipeViews.stream()
                .map(RecipeViewDTO::fromEntity) // RecipeMapper::fromEntity -> RecipeViewDTO::fromEntity 로 원복
                .collect(Collectors.toList());
    }

    @Override
    public List<RecipeViewDTO> getAllViewHistories(Integer userId) {
        log.debug("사용자의 모든 조회 이력 조회 - userId: {}", userId);

        List<RecipeView> recipeViews = recipeViewRepository.findByUser_UserIdOrderByViewedAtDesc(userId);

        return recipeViews.stream()
                .map(RecipeViewDTO::fromEntity) // RecipeMapper::fromEntity -> RecipeViewDTO::fromEntity 로 원복
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteUserViewHistory(Integer userId) {
        log.debug("사용자의 조회 이력 삭제 - userId: {}", userId);
        recipeViewRepository.deleteByUser_UserId(userId);
    }
}