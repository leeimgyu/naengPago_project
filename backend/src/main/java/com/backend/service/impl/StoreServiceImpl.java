package com.backend.service.impl;

import com.backend.dto.KakaoLocalResponseDTO;
import com.backend.dto.StoreDTO;
import com.backend.dto.StoreSearchResponseDTO;
import com.backend.service.StoreService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * 식료품점 검색 서비스 구현체
 * Kakao Local API를 사용하여 주변 식료품점 검색
 */
@Slf4j
@Service
public class StoreServiceImpl implements StoreService {

    private final WebClient webClient;
    private final String kakaoRestApiKey;

    /**
     * 카카오 카테고리 코드 매핑
     */
    private static final Map<String, String> CATEGORY_MAP = Map.of(
            "MT1", "대형마트",
            "CS2", "편의점"
    );

    /**
     * 검색할 카테고리 목록
     */
    private static final List<String> SEARCH_CATEGORIES = List.of("MT1", "CS2");

    public StoreServiceImpl(
            WebClient.Builder webClientBuilder,
            @Value("${kakao.api.key}") String kakaoRestApiKey) {
        this.webClient = webClientBuilder.baseUrl("https://dapi.kakao.com").build();
        this.kakaoRestApiKey = kakaoRestApiKey;

        // Kakao API 키 검증
        if (kakaoRestApiKey == null || kakaoRestApiKey.trim().isEmpty()) {
            log.error("❌ Kakao REST API 키가 설정되지 않았습니다!");
            log.error("application.yml 파일에서 kakao.api.key를 설정해주세요.");
        } else {
            log.info("✅ Kakao REST API 키가 정상적으로 설정되었습니다 (키 길이: {})", kakaoRestApiKey.length());
        }
    }

    @Override
    public StoreSearchResponseDTO searchNearbyStores(Double latitude, Double longitude, Integer radius) {
        log.info("주변 식료품점 검색 요청 - 위도: {}, 경도: {}, 반경: {}m", latitude, longitude, radius);

        // 파라미터 검증
        if (latitude == null || longitude == null) {
            throw new IllegalArgumentException("위도와 경도는 필수 입력값입니다.");
        }

        // 반경 기본값 설정 (1km)
        int searchRadius = (radius != null && radius > 0) ? radius : 1000;

        // Kakao API 키 검증
        if (kakaoRestApiKey == null || kakaoRestApiKey.trim().isEmpty()) {
            log.error("❌ Kakao REST API 키가 설정되지 않았습니다.");
            throw new RuntimeException("Kakao API 키가 설정되지 않았습니다. 관리자에게 문의하세요.");
        }

        try {
            // 모든 카테고리 검색 결과를 합치기
            List<StoreDTO> allStores = new ArrayList<>();

            for (String categoryCode : SEARCH_CATEGORIES) {
                List<StoreDTO> categoryStores = searchByCategory(
                        categoryCode,
                        latitude,
                        longitude,
                        searchRadius
                );
                allStores.addAll(categoryStores);
                log.info("카테고리 {} 검색 완료: {}개 매장 발견", categoryCode, categoryStores.size());
            }

            // 거리순 정렬 (가까운 순)
            allStores.sort(Comparator.comparing(StoreDTO::getDistance, Comparator.nullsLast(Integer::compareTo)));

            // 최대 15개로 제한
            List<StoreDTO> limitedStores = allStores.stream()
                    .limit(15)
                    .collect(Collectors.toList());

            log.info("✅ 총 {}개 매장 검색 완료 (반환: {}개)", allStores.size(), limitedStores.size());

            return StoreSearchResponseDTO.builder()
                    .stores(limitedStores)
                    .totalCount(limitedStores.size())
                    .build();

        } catch (Exception e) {
            log.error("주변 식료품점 검색 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("주변 식료품점 검색에 실패했습니다: " + e.getMessage());
        }
    }

    /**
     * 특정 카테고리로 장소 검색
     *
     * @param categoryCode 카테고리 코드 (MT1, CS2 등)
     * @param latitude     위도
     * @param longitude    경도
     * @param radius       검색 반경 (미터)
     * @return 검색된 매장 목록
     */
    private List<StoreDTO> searchByCategory(String categoryCode, Double latitude, Double longitude, Integer radius) {
        log.debug("카테고리 검색 - 코드: {}, 위도: {}, 경도: {}, 반경: {}m", categoryCode, latitude, longitude, radius);

        try {
            // Kakao Local API 호출
            KakaoLocalResponseDTO response = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/v2/local/search/category.json")
                            .queryParam("category_group_code", categoryCode)
                            .queryParam("x", longitude)  // 경도
                            .queryParam("y", latitude)   // 위도
                            .queryParam("radius", radius)
                            .queryParam("size", 15)
                            .build())
                    .header("Authorization", "KakaoAK " + kakaoRestApiKey)
                    .retrieve()
                    .onStatus(HttpStatusCode::is4xxClientError, clientResponse -> {
                        log.error("❌ Kakao API 클라이언트 오류: {} - API 키를 확인해주세요", clientResponse.statusCode());
                        return clientResponse.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("❌ 에러 응답: {}", errorBody);
                                    return Mono.error(new RuntimeException("Kakao API 인증 실패. API 키를 확인해주세요."));
                                });
                    })
                    .onStatus(HttpStatusCode::is5xxServerError, clientResponse -> {
                        log.error("❌ Kakao API 서버 오류: {}", clientResponse.statusCode());
                        return Mono.error(new RuntimeException("Kakao API 서버 오류가 발생했습니다"));
                    })
                    .bodyToMono(KakaoLocalResponseDTO.class)
                    .block();

            // 응답 검증
            if (response == null || response.getDocuments() == null) {
                log.warn("카테고리 {} 검색 결과 없음", categoryCode);
                return Collections.emptyList();
            }

            // DTO 변환
            String categoryName = CATEGORY_MAP.getOrDefault(categoryCode, "기타");

            return response.getDocuments().stream()
                    .map(doc -> convertToStoreDTO(doc, categoryName))
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("카테고리 {} 검색 중 오류: {}", categoryCode, e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    /**
     * Kakao API 응답을 StoreDTO로 변환
     *
     * @param document     Kakao API 문서
     * @param categoryName 카테고리명
     * @return StoreDTO
     */
    private StoreDTO convertToStoreDTO(KakaoLocalResponseDTO.Document document, String categoryName) {
        // 도로명 주소 우선, 없으면 지번 주소 사용
        String address = (document.getRoadAddressName() != null && !document.getRoadAddressName().isEmpty())
                ? document.getRoadAddressName()
                : document.getAddressName();

        // 거리 변환 (문자열 → 정수)
        Integer distance = null;
        try {
            if (document.getDistance() != null && !document.getDistance().isEmpty()) {
                distance = Integer.parseInt(document.getDistance());
            }
        } catch (NumberFormatException e) {
            log.warn("거리 변환 실패: {}", document.getDistance());
        }

        // 카테고리별 일반적인 영업시간 설정 (카카오 API에서 영업시간 정보 미제공)
        String hours = getDefaultHoursByCategory(categoryName);

        return StoreDTO.builder()
                .id(document.getId())
                .name(document.getPlaceName())
                .category(categoryName)
                .address(address)
                .phone(document.getPhone())
                .hours(hours)
                .distance(distance)
                .position(StoreDTO.Position.builder()
                        .lat(parseDouble(document.getY()))
                        .lng(parseDouble(document.getX()))
                        .build())
                .build();
    }

    /**
     * 카테고리별 기본 영업시간 반환
     * (카카오 로컬 API에서 영업시간 정보를 제공하지 않아 임시로 일반적인 영업시간 제공)
     *
     * @param categoryName 카테고리명
     * @return 영업시간 문자열
     */
    private String getDefaultHoursByCategory(String categoryName) {
        switch (categoryName) {
            case "대형마트":
                return "매일 09:00 - 22:00";
            case "편의점":
                return "24시간 영업";
            default:
                return "영업시간 정보 없음";
        }
    }

    /**
     * 문자열을 Double로 안전하게 변환
     *
     * @param value 변환할 문자열
     * @return Double 값 또는 null
     */
    private Double parseDouble(String value) {
        try {
            return (value != null && !value.isEmpty()) ? Double.parseDouble(value) : null;
        } catch (NumberFormatException e) {
            log.warn("Double 변환 실패: {}", value);
            return null;
        }
    }
}
