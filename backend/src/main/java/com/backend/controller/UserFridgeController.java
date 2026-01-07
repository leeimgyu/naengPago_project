package com.backend.controller;

import com.backend.dto.AddFridgeItemRequestDTO;
import com.backend.dto.ApiResponseDTO;
import com.backend.dto.UpdateFridgeItemRequestDTO;
import com.backend.dto.UserFridgeDTO;
import com.backend.security.userdetails.UserPrincipal;
import com.backend.service.UserFridgeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 사용자 냉장고 API 컨트롤러
 */
@Slf4j
@RestController
@RequestMapping("/api/fridge")
@RequiredArgsConstructor
@Tag(name = "UserFridge", description = "사용자 냉장고 API")
public class UserFridgeController {

    private final UserFridgeService userFridgeService;

    /**
     * 사용자의 모든 냉장고 재료 조회
     */
    @GetMapping
    @Operation(summary = "냉장고 재료 목록 조회", description = "현재 사용자의 모든 냉장고 재료를 조회합니다.")
    public ResponseEntity<ApiResponseDTO<List<UserFridgeDTO>>> getAllFridgeItems(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            log.info("냉장고 재료 목록 조회 요청: userId={}", userPrincipal.getId());

            List<UserFridgeDTO> fridgeItems = userFridgeService.getAllFridgeItems(userPrincipal.getId());

            log.info("냉장고 재료 목록 조회 성공: userId={}, count={}", userPrincipal.getId(), fridgeItems.size());

            return ResponseEntity.ok(
                    ApiResponseDTO.success(fridgeItems, "냉장고 재료 목록을 조회했습니다.")
            );
        } catch (Exception e) {
            log.error("냉장고 재료 목록 조회 실패: userId={}, error={}", userPrincipal.getId(), e.getMessage(), e);
            return ResponseEntity.status(500).body(
                    ApiResponseDTO.failure("냉장고 재료 목록 조회에 실패했습니다: " + e.getMessage())
            );
        }
    }

    /**
     * 카테고리별 냉장고 재료 조회
     */
    @GetMapping("/category/{category}")
    @Operation(summary = "카테고리별 재료 조회", description = "특정 카테고리의 냉장고 재료를 조회합니다.")
    public ResponseEntity<ApiResponseDTO<List<UserFridgeDTO>>> getFridgeItemsByCategory(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String category) {
        log.info("카테고리별 재료 조회 요청: userId={}, category={}", userPrincipal.getId(), category);

        List<UserFridgeDTO> fridgeItems = userFridgeService.getFridgeItemsByCategory(
                userPrincipal.getId(), category);

        return ResponseEntity.ok(
                ApiResponseDTO.success(fridgeItems, "카테고리별 재료 목록을 조회했습니다.")
        );
    }

    /**
     * 냉장고 재료 추가
     */
    @PostMapping
    @Operation(summary = "냉장고 재료 추가", description = "새로운 재료를 냉장고에 추가합니다.")
    public ResponseEntity<ApiResponseDTO<UserFridgeDTO>> addFridgeItem(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody AddFridgeItemRequestDTO request) {
        try {
            log.info("냉장고 재료 추가 요청: userId={}, name={}", userPrincipal.getId(), request.getName());

            UserFridgeDTO fridgeItem = userFridgeService.addFridgeItem(userPrincipal.getId(), request);

            log.info("냉장고 재료 추가 성공: userId={}, fridgeId={}", userPrincipal.getId(), fridgeItem.getId());

            return ResponseEntity.ok(
                    ApiResponseDTO.success(fridgeItem, "재료가 추가되었습니다.")
            );
        } catch (Exception e) {
            log.error("냉장고 재료 추가 실패: userId={}, error={}", userPrincipal.getId(), e.getMessage(), e);
            return ResponseEntity.status(500).body(
                    ApiResponseDTO.failure("재료 추가에 실패했습니다: " + e.getMessage())
            );
        }
    }

    /**
     * 냉장고 재료 수정
     */
    @PutMapping("/{fridgeId}")
    @Operation(summary = "냉장고 재료 수정", description = "냉장고 재료 정보를 수정합니다.")
    public ResponseEntity<ApiResponseDTO<UserFridgeDTO>> updateFridgeItem(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Integer fridgeId,
            @Valid @RequestBody UpdateFridgeItemRequestDTO request) {
        log.info("냉장고 재료 수정 요청: userId={}, fridgeId={}", userPrincipal.getId(), fridgeId);

        UserFridgeDTO fridgeItem = userFridgeService.updateFridgeItem(
                userPrincipal.getId(), fridgeId, request);

        return ResponseEntity.ok(
                ApiResponseDTO.success(fridgeItem, "재료가 수정되었습니다.")
        );
    }

    /**
     * 냉장고 재료 삭제
     */
    @DeleteMapping("/{fridgeId}")
    @Operation(summary = "냉장고 재료 삭제", description = "냉장고에서 재료를 삭제합니다.")
    public ResponseEntity<ApiResponseDTO<Void>> deleteFridgeItem(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Integer fridgeId) {
        log.info("냉장고 재료 삭제 요청: userId={}, fridgeId={}", userPrincipal.getId(), fridgeId);

        userFridgeService.deleteFridgeItem(userPrincipal.getId(), fridgeId);

        return ResponseEntity.ok(
                ApiResponseDTO.success(null, "재료가 삭제되었습니다.")
        );
    }
}
