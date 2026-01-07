package com.backend.service.impl;

import com.backend.dto.GeocodingResponseDTO;
import com.backend.service.GeocodingService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

/**
 * 주소 좌표 변환 서비스 구현체
 * Kakao REST API를 사용하여 주소를 위도/경도로 변환
 */
@Slf4j
@Service
public class GeocodingServiceImpl implements GeocodingService {

    private final WebClient webClient;
    private final String kakaoRestApiKey;

    public GeocodingServiceImpl(
            WebClient.Builder webClientBuilder,
            @Value("${kakao.api.key}") String kakaoRestApiKey) {
        this.webClient = webClientBuilder.baseUrl("https://dapi.kakao.com").build();
        this.kakaoRestApiKey = kakaoRestApiKey;

        // Kakao API 키 검증
        if (kakaoRestApiKey == null || kakaoRestApiKey.trim().isEmpty()
                || "YOUR_KAKAO_REST_API_KEY_HERE".equals(kakaoRestApiKey)) {
            log.error("❌ Kakao REST API 키가 설정되지 않았습니다!");
            log.error("application.yml 파일에서 kakao.api.key를 설정해주세요.");
        } else {
            log.info("✅ Kakao REST API 키가 정상적으로 설정되었습니다 (키 길이: {})", kakaoRestApiKey.length());
        }
    }

    @Override
    public GeocodingResponseDTO convertAddressToCoordinates(String address) {
        log.info("주소 좌표 변환 요청: {}", address);

        if (address == null || address.trim().isEmpty()) {
            throw new IllegalArgumentException("주소를 입력해주세요");
        }

        // Kakao API 키 검증
        if (kakaoRestApiKey == null || kakaoRestApiKey.trim().isEmpty()
                || "YOUR_KAKAO_REST_API_KEY_HERE".equals(kakaoRestApiKey)) {
            log.error("❌ Kakao REST API 키가 설정되지 않았습니다. application.yml을 확인해주세요.");
            throw new RuntimeException("Kakao API 키가 설정되지 않았습니다. 관리자에게 문의하세요.");
        }

        try {
            log.debug("Kakao API 호출 준비 - URL: https://dapi.kakao.com/v2/local/search/address.json?query={}", address);

            // Kakao REST API 호출
            GeocodingResponseDTO.KakaoApiResponse response = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/v2/local/search/address.json")
                            .queryParam("query", address)
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
                    .bodyToMono(GeocodingResponseDTO.KakaoApiResponse.class)
                    .block();

            log.debug("Kakao API 응답 수신 완료");

            // 응답 검증
            if (response == null || response.getDocuments() == null || response.getDocuments().isEmpty()) {
                log.warn("주소를 찾을 수 없음: {}", address);
                throw new RuntimeException("해당 주소를 찾을 수 없습니다");
            }

            // 첫 번째 결과 사용
            GeocodingResponseDTO.KakaoApiResponse.Document document = response.getDocuments().get(0);

            // 응답 DTO 생성
            GeocodingResponseDTO result = GeocodingResponseDTO.builder()
                    .address(address)
                    .latitude(Double.parseDouble(document.getLatitude()))
                    .longitude(Double.parseDouble(document.getLongitude()))
                    .build();

            log.info("좌표 변환 성공 - 주소: {}, 위도: {}, 경도: {}",
                    address, result.getLatitude(), result.getLongitude());

            return result;

        } catch (Exception e) {
            log.error("주소 좌표 변환 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("주소 좌표 변환에 실패했습니다: " + e.getMessage());
        }
    }
}
