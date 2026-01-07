package com.backend.controller;

import com.backend.dto.ApiResponseDTO;
import com.backend.dto.GeocodingResponseDTO;
import com.backend.service.GeocodingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 주소 좌표 변환 API 컨트롤러
 */
@Slf4j
@RestController
@RequestMapping("/api/geocoding")
@RequiredArgsConstructor
@Tag(name = "Geocoding", description = "주소 좌표 변환 API")
public class GeocodingController {

    private final GeocodingService geocodingService;

    /**
     * 주소를 위도/경도 좌표로 변환
     *
     * @param address 변환할 주소
     * @return 좌표 정보
     */
    @GetMapping
    @Operation(summary = "주소를 좌표로 변환", description = "입력한 주소를 위도/경도 좌표로 변환합니다")
    public ResponseEntity<ApiResponseDTO<GeocodingResponseDTO>> convertAddressToCoordinates(
            @Parameter(description = "변환할 주소", example = "서울특별시 강남구 테헤란로 212")
            @RequestParam String address) {

        log.info("주소 좌표 변환 API 호출 - 주소: {}", address);

        try {
            // 주소 검증
            if (address == null || address.trim().isEmpty()) {
                return ResponseEntity
                        .badRequest()
                        .body(ApiResponseDTO.failure("주소를 입력해주세요"));
            }

            // 좌표 변환
            GeocodingResponseDTO result = geocodingService.convertAddressToCoordinates(address);

            return ResponseEntity.ok(
                    ApiResponseDTO.success(result, "주소 좌표 변환에 성공했습니다")
            );

        } catch (IllegalArgumentException e) {
            log.warn("잘못된 요청: {}", e.getMessage());
            return ResponseEntity
                    .badRequest()
                    .body(ApiResponseDTO.failure(e.getMessage()));

        } catch (RuntimeException e) {
            // 주소를 찾을 수 없는 경우
            if (e.getMessage().contains("찾을 수 없습니다")) {
                log.warn("주소를 찾을 수 없음: {}", address);
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(ApiResponseDTO.failure(e.getMessage()));
            }

            // 기타 서버 오류
            log.error("주소 좌표 변환 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponseDTO.failure("주소 좌표 변환에 실패했습니다. 상세 오류: " + e.getMessage()));
        } catch (Exception e) {
            log.error("예상하지 못한 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponseDTO.failure("서버 오류가 발생했습니다: " + e.getMessage()));
        }
    }
}
