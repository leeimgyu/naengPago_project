package com.backend.controller;

import com.backend.dto.RecipeViewDTO;
import com.backend.entity.RecipeView;
import com.backend.security.userdetails.UserPrincipal;
import com.backend.service.RecipeViewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// 레시피 조회 이력 컨트롤러
@Slf4j
@RestController
@RequestMapping("/api/recipe-views")
@RequiredArgsConstructor
public class RecipeViewController {

    private final RecipeViewService recipeViewService;

    // 레시피 조회 이력 저장
    // 사용자가 레시피를 조회할 때 프론트엔드에서 호출
    @PostMapping
    public ResponseEntity<Void> recordView(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam Integer recipeId) { // Long -> Integer

        log.info("레시피 조회 이력 저장 요청 - recipeId: {}, userId: {}",
                recipeId, userPrincipal != null ? userPrincipal.getId() : "null");

        // 인증 확인
        if (userPrincipal == null) {
            throw new BadCredentialsException("인증되지 않은 사용자입니다.");
        }

        recipeViewService.recordView(userPrincipal.getId(), recipeId);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // 사용자의 최근 조회 레시피 목록 조회 (중복 제거)
    @GetMapping("/recent")
    public ResponseEntity<List<RecipeViewDTO>> getRecentViewedRecipes(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "10") int limit) {

        log.info("최근 조회 레시피 조회 요청 - userId: {}, limit: {}",
                userPrincipal != null ? userPrincipal.getId() : "null", limit);

        // 인증 확인
        if (userPrincipal == null) {
            throw new BadCredentialsException("인증되지 않은 사용자입니다.");
        }

        List<RecipeViewDTO> recentViews = recipeViewService.getRecentViewedRecipes(
                userPrincipal.getId(), limit);

        return ResponseEntity.ok(recentViews);
    }

    // 사용자의 모든 조회 이력 조회
    @GetMapping
    public ResponseEntity<List<RecipeViewDTO>> getAllViewHistories(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        log.info("모든 조회 이력 조회 요청 - userId: {}",
                userPrincipal != null ? userPrincipal.getId() : "null");

        // 인증 확인
        if (userPrincipal == null) {
            throw new BadCredentialsException("인증되지 않은 사용자입니다.");
        }

        List<RecipeViewDTO> viewHistories = recipeViewService.getAllViewHistories(
                userPrincipal.getId());

        return ResponseEntity.ok(viewHistories);
    }

    // 사용자의 조회 이력 삭제
    @DeleteMapping
    public ResponseEntity<Void> deleteViewHistory(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        log.info("조회 이력 삭제 요청 - userId: {}",
                userPrincipal != null ? userPrincipal.getId() : "null");

        // 인증 확인
        if (userPrincipal == null) {
            throw new BadCredentialsException("인증되지 않은 사용자입니다.");
        }

        recipeViewService.deleteUserViewHistory(userPrincipal.getId());

        return ResponseEntity.noContent().build();
    }
}