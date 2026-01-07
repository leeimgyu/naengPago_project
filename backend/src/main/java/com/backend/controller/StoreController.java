package com.backend.controller;

import com.backend.dto.ApiResponseDTO;
import com.backend.dto.StoreSearchResponseDTO;
import com.backend.service.StoreService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 주변 식료품점 검색 API 컨트롤러
 */
@Slf4j
@RestController
@RequestMapping("/api/stores")
@RequiredArgsConstructor
@Tag(name = "Store", description = "주변 식료품점 검색 API")
public class StoreController {

    private final StoreService storeService;

    /**
     * 주변 식료품점 검색
     *
     * @param lat    위도
     * @param lng    경도
     * @param radius 검색 반경 (미터, 기본값: 1000)
     * @return 검색된 매장 목록
     */
    @GetMapping("/nearby")
    @Operation(summary = "주변 식료품점 검색", description = "위도/경도 기준으로 주변 식료품점을 검색합니다 (대형마트, 편의점)")
    public ResponseEntity<ApiResponseDTO<StoreSearchResponseDTO>> searchNearbyStores(
            @Parameter(description = "위도", example = "37.5665", required = true)
            @RequestParam(name = "lat") Double lat,

            @Parameter(description = "경도", example = "126.9780", required = true)
            @RequestParam(name = "lng") Double lng,

            @Parameter(description = "검색 반경 (미터)", example = "1000")
            @RequestParam(name = "radius", required = false, defaultValue = "1000") Integer radius) {

        log.info("주변 식료품점 검색 API 호출 - 위도: {}, 경도: {}, 반경: {}m", lat, lng, radius);

        try {
            // 파라미터 검증
            if (lat == null || lng == null) {
                return ResponseEntity
                        .badRequest()
                        .body(ApiResponseDTO.failure("위도(lat)와 경도(lng)는 필수 입력값입니다"));
            }

            // 위도/경도 범위 검증
            if (lat < -90 || lat > 90) {
                return ResponseEntity
                        .badRequest()
                        .body(ApiResponseDTO.failure("위도는 -90 ~ 90 범위 내의 값이어야 합니다"));
            }

            if (lng < -180 || lng > 180) {
                return ResponseEntity
                        .badRequest()
                        .body(ApiResponseDTO.failure("경도는 -180 ~ 180 범위 내의 값이어야 합니다"));
            }

            // 반경 범위 검증 (최대 20km)
            if (radius != null && (radius < 0 || radius > 20000)) {
                return ResponseEntity
                        .badRequest()
                        .body(ApiResponseDTO.failure("검색 반경은 0 ~ 20000(20km) 범위 내의 값이어야 합니다"));
            }

            // 식료품점 검색
            StoreSearchResponseDTO result = storeService.searchNearbyStores(lat, lng, radius);

            return ResponseEntity.ok(
                    ApiResponseDTO.success(result, "주변 식료품점 검색에 성공했습니다")
            );

        } catch (IllegalArgumentException e) {
            log.warn("잘못된 요청: {}", e.getMessage());
            return ResponseEntity
                    .badRequest()
                    .body(ApiResponseDTO.failure(e.getMessage()));

        } catch (RuntimeException e) {
            log.error("주변 식료품점 검색 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponseDTO.failure("주변 식료품점 검색에 실패했습니다. 상세 오류: " + e.getMessage()));

        } catch (Exception e) {
            log.error("예상하지 못한 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponseDTO.failure("서버 오류가 발생했습니다: " + e.getMessage()));
        }
    }
}
