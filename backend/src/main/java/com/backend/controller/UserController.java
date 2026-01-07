package com.backend.controller;

import com.backend.dto.ApiResponseDTO;
import com.backend.dto.ReceiptOcrResult;
import com.backend.dto.AuthResponseDTO;
import com.backend.dto.UpdateProfileRequestDTO;
import com.backend.dto.UserAddressDTO;
import com.backend.dto.UserFridgeDTO;
import com.backend.dto.UserSummaryDTO;
import com.backend.security.userdetails.UserPrincipal;
import com.backend.service.OcrService;
import com.backend.service.UserService;
import com.backend.service.UserFridgeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 사용자 관련 REST API 컨트롤러
 *
 * - 프로필 조회, 수정
 */
@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User", description = "사용자 API")
public class UserController {

  private final UserService userService;
  private final OcrService ocrService;
  private final UserFridgeService userFridgeService;

  /**
   * 프로필 조회
   *
   * @param userPrincipal 현재 인증된 사용자
   * @return 사용자 프로필 정보
   */
  @GetMapping("/profile")
  @Operation(summary = "프로필 조회", description = "현재 로그인한 사용자의 프로필을 조회합니다.")
  public ResponseEntity<ApiResponseDTO<UserSummaryDTO>> getProfile(
      @AuthenticationPrincipal UserPrincipal userPrincipal) {
    if (userPrincipal == null) {
      throw new BadCredentialsException("인증되지 않은 사용자입니다.");
    }

    UserSummaryDTO userProfile = userService.getUserProfile(userPrincipal.getId());
    return ResponseEntity
        .ok(ApiResponseDTO.success(userProfile, "프로필 조회에 성공했습니다."));
  }

  /**
   * 프로필 업데이트
   *
   * @param userPrincipal 현재 인증된 사용자
   * @param request 업데이트 요청 데이터
   * @return 업데이트된 사용자 정보
   */
  @PutMapping("/profile")
  @Operation(summary = "프로필 업데이트", description = "현재 로그인한 사용자의 프로필을 업데이트합니다.")
  public ResponseEntity<ApiResponseDTO<AuthResponseDTO>> updateProfile(
      @AuthenticationPrincipal UserPrincipal userPrincipal,
      @Valid @RequestBody UpdateProfileRequestDTO request) {
    if (userPrincipal == null) {
      throw new BadCredentialsException("인증되지 않은 사용자입니다.");
    }

    AuthResponseDTO authResponse = userService.updateProfile(userPrincipal.getId(), request);
    return ResponseEntity
        .ok(ApiResponseDTO.success(authResponse, "프로필이 업데이트되었습니다."));
  }

  /**
   * 주소 조회
   *
   * @param userPrincipal 현재 인증된 사용자
   * @return 사용자 주소 정보
   */
  @GetMapping("/address")
  @Operation(summary = "주소 조회", description = "현재 로그인한 사용자의 주소 정보를 조회합니다.")
  public ResponseEntity<ApiResponseDTO<UserAddressDTO>> getAddress(
      @AuthenticationPrincipal UserPrincipal userPrincipal) {
    if (userPrincipal == null) {
      throw new BadCredentialsException("인증되지 않은 사용자입니다.");
    }

    UserAddressDTO address = userService.getUserAddress(userPrincipal.getId());
    return ResponseEntity
        .ok(ApiResponseDTO.success(address, "주소 조회에 성공했습니다."));
  }

  /**
   * 닉네임 중복 확인
   *
   * @param nickname 확인할 닉네임
   * @return 사용 가능 여부
   */
  @GetMapping("/check-nickname")
  @Operation(summary = "닉네임 중복 확인", description = "닉네임 사용 가능 여부를 확인합니다.")
  public ResponseEntity<ApiResponseDTO<Boolean>> checkNickname(
      @RequestParam String nickname) {
    boolean isAvailable = userService.isNicknameAvailable(nickname);
    String message = isAvailable ? "사용 가능한 닉네임입니다." : "이미 사용 중인 닉네임입니다.";
    return ResponseEntity
        .ok(ApiResponseDTO.success(isAvailable, message));
  }

  @PostMapping(value = "/ocr", consumes = "multipart/form-data", produces = "application/json")
  public Mono<ResponseEntity<ReceiptOcrResult>> uploadReceiptForOcr(@AuthenticationPrincipal UserPrincipal userPrincipal,
      @RequestParam("file") MultipartFile file) {
    if (userPrincipal == null) {
      throw new BadCredentialsException("인증되지 않은 사용자입니다.");
    }

    return ocrService.performOcr(file)
        .map(ResponseEntity::ok)
        .defaultIfEmpty(ResponseEntity.notFound().build());
  }
  /**
   * 유통기한 임박 재료 조회 (D-7 이내)
   *
   * @param userPrincipal 현재 인증된 사용자
   * @return 유통기한 임박 재료 목록
   */
  @GetMapping("/fridge/expiring")
  @Operation(summary = "유통기한 임박 재료 조회", description = "D-7 이내 유통기한 임박 재료를 조회합니다.")
  public ResponseEntity<ApiResponseDTO<List<UserFridgeDTO>>> getExpiringItems(
      @AuthenticationPrincipal UserPrincipal userPrincipal) {
    if (userPrincipal == null) {
      throw new BadCredentialsException("인증되지 않은 사용자입니다.");
    }

    List<UserFridgeDTO> items = userFridgeService.getAllFridgeItems(userPrincipal.getId());

    // 유통기한 7일 이내 및 지난 재료 필터링
    LocalDate today = LocalDate.now();
    LocalDate checkDate = today.plusDays(7);

    List<UserFridgeDTO> expiringItems = items.stream()
        .filter(item -> {
          if (item.getExpiryDate() == null || item.getExpiryDate().isEmpty()) {
            return false;
          }
          LocalDate expiryDate = LocalDate.parse(item.getExpiryDate());
          // 유통기한이 7일 이내이거나 이미 지난 재료 포함
          return !expiryDate.isAfter(checkDate);
        })
        .collect(Collectors.toList());

    return ResponseEntity.ok(ApiResponseDTO.success(expiringItems,
        "유통기한 임박 재료 " + expiringItems.size() + "개를 조회했습니다."));
  }

}