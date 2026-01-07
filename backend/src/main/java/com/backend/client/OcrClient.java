package com.backend.client;

import com.backend.dto.Ingredient;
import com.backend.dto.ocr.IngredientsResult;
import com.backend.dto.ocr.OcrRequest;
import com.backend.dto.ocr.OcrResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.time.Duration;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

/**
 * Gemini API를 사용하여 OCR 텍스트 또는 이미지에서 식재료 정보를 추출하는 클라이언트
 */
@Slf4j
@Component
public class OcrClient {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.model}")
    private String model;

    @Value("${gemini.api.timeout:30}")
    private int timeout;

    public OcrClient(@Qualifier("ocrWebClient") WebClient webClient, ObjectMapper objectMapper) {
        this.webClient = webClient;
        this.objectMapper = objectMapper;
    }

    /**
     * 영수증 이미지에서 식재료와 수량 정보를 추출합니다.
     *
     * @param imageFile 영수증 이미지 파일
     * @return 식재료 목록 (Mono)
     */
    public Mono<List<Ingredient>> analyzeReceiptImage(MultipartFile imageFile) {
        if (imageFile == null || imageFile.isEmpty()) {
            log.warn("이미지 파일이 비어있습니다.");
            return Mono.just(Collections.emptyList());
        }

        try {
            String base64Image = Base64.getEncoder().encodeToString(imageFile.getBytes());
            String mimeType = imageFile.getContentType();
            OcrRequest request = buildImageRequest(base64Image, mimeType);

            return webClient.post()
                    .uri("/models/" + model + ":generateContent")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(OcrResponse.class)
                    .map(this::parseIngredients)
                    .timeout(Duration.ofSeconds(timeout))
                    .onErrorResume(e -> {
                        log.error("Gemini API 이미지 분석 실패: {}", e.getMessage(), e);
                        return Mono.just(Collections.emptyList());
                    });

        } catch (IOException e) {
            log.error("이미지 파일 처리 실패: {}", e.getMessage(), e);
            return Mono.error(e);
        }
    }


    /**
     * OCR로 추출된 텍스트에서 식재료와 수량 정보를 추출합니다.
     *
     * @param ocrText OCR로 추출된 영수증 텍스트
     * @return 식재료 목록 (Mono)
     */
    public Mono<List<Ingredient>> extractIngredients(String ocrText) {
        if (ocrText == null || ocrText.trim().isEmpty()) {
            log.warn("OCR 텍스트가 비어있습니다.");
            return Mono.just(Collections.emptyList());
        }

        OcrRequest request = buildRequest(ocrText);

        return webClient.post()
                .uri("/models/" + model + ":generateContent")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(OcrResponse.class)
                .map(this::parseIngredients)
                .timeout(Duration.ofSeconds(timeout))
                .onErrorResume(e -> {
                    log.error("Gemini API 호출 실패: {}", e.getMessage(), e);
                    return Mono.just(Collections.emptyList());
                });
    }

    /**
     * Gemini API 텍스트 요청 객체를 생성합니다.
     */
    private OcrRequest buildRequest(String ocrText) {
        String prompt = String.format(
                "다음은 영수증에서 OCR로 추출한 텍스트입니다. " +
                "이 텍스트에서 식재료와 수량만 추출해주세요. " +
                "식재료가 아닌 항목(음료, 생활용품, 기타 제품 등)은 제외하고, " +
                "실제 요리에 사용되는 식재료만 포함해주세요.\n\n" +
                "영수증 텍스트:\n%s",
                ocrText
        );

        return OcrRequest.builder()
                .contents(List.of(
                        OcrRequest.Content.builder()
                                .parts(List.of(
                                        OcrRequest.Part.builder()
                                                .text(prompt)
                                                .build()
                                ))
                                .build()
                ))
                .generationConfig(buildGenerationConfig())
                .build();
    }

    /**
     * Gemini API 이미지 요청 객체를 생성합니다.
     */
    private OcrRequest buildImageRequest(String base64Image, String mimeType) {
        String prompt = "다음은 영수증 이미지입니다. " +
                        "이 이미지에서 식재료 정보를 추출해주세요. " +
                        "식재료가 아닌 항목(음료, 생활용품, 기타 제품 등)은 제외하고, " +
                        "실제 요리에 사용되는 식재료만 포함해주세요.\n\n" +
                        "**중요 규칙:**\n" +
                        "1. name: 순수 상품명만 추출 (단위/규격 제거)\n" +
                        "   예: '소단량가슴살300g' → name: '소단량가슴살'\n" +
                        "   예: '파프리카(3입/봉)' → name: '파프리카'\n" +
                        "2. unit: 상품의 규격/단위 전체 (숫자 포함)\n" +
                        "   예: '소단량가슴살300g' → unit: '300g'\n" +
                        "   예: '파프리카(3입/봉)' → unit: '(3입/봉)'\n" +
                        "   예: '양상추' → unit: '1개' (기본값)\n" +
                        "3. amount: 영수증의 '수량' 컬럼 값 (구매 개수)\n" +
                        "   예: 영수증에 '수량 1'이면 → amount: 1\n" +
                        "   예: 영수증에 '수량 2'이면 → amount: 2";

        OcrRequest.Part textPart = OcrRequest.Part.builder()
                .text(prompt)
                .build();

        OcrRequest.Part imagePart = OcrRequest.Part.builder()
                .inlineData(OcrRequest.InlineData.builder()
                        .mimeType(mimeType)
                        .data(base64Image)
                        .build())
                .build();

        return OcrRequest.builder()
                .contents(List.of(
                        OcrRequest.Content.builder()
                                .parts(List.of(textPart, imagePart))
                                .build()
                ))
                .generationConfig(buildGenerationConfigForItems()) // 새로운 스키마 빌더 사용
                .build();
    }


    /**
     * Gemini API 응답에서 식재료 정보를 파싱합니다.
     */
    private List<Ingredient> parseIngredients(OcrResponse response) {
        try {
            if (response.getCandidates() == null || response.getCandidates().isEmpty()) {
                log.warn("Gemini API 응답에 candidates가 없습니다.");
                return Collections.emptyList();
            }

            String jsonText = response.getCandidates().get(0)
                    .getContent()
                    .getParts()
                    .get(0)
                    .getText();

            log.info("Gemini API 응답 JSON: {}", jsonText);

            // IngredientsResult 대신 ItemsResult와 같은 새로운 DTO가 필요할 수 있음.
            // 현재는 IngredientsResult를 재활용하되, 필드명이 다를 경우 파싱 오류 발생 가능.
            // 임시로 IngredientsResult를 사용하고, 필요시 새로운 DTO 정의.
            IngredientsResult result = objectMapper.readValue(jsonText, IngredientsResult.class);

            if (result.getItems() == null) { // getIngredients() -> getItems()
                return Collections.emptyList();
            }

            log.info("상품 {}개 추출 완료", result.getItems().size()); // 로그 메시지 변경
            return result.getItems(); // getIngredients() -> getItems()

        } catch (Exception e) {
            log.error("상품 파싱 실패: {}", e.getMessage(), e); // 로그 메시지 변경
            return Collections.emptyList();
        }
    }

    /**
     * 공통 GenerationConfig를 생성합니다. (기존 식재료 스키마)
     */
    private OcrRequest.GenerationConfig buildGenerationConfig() {
        Map<String, Object> schema = Map.of(
                "type", "object",
                "properties", Map.of(
                        "ingredients", Map.of(
                                "type", "array",
                                "items", Map.of(
                                        "type", "object",
                                        "properties", Map.of(
                                                "name", Map.of("type", "string", "description", "순수 상품명 (단위/규격 제외)"),
                                                "unit", Map.of("type", "string", "description", "상품 규격/단위 (예: 300g, (2입/봉), 1kg)"),
                                                "amount", Map.of("type", "integer", "description", "구매 수량 (영수증의 수량 컬럼 값)")
                                        ),
                                        "required", List.of("name", "unit", "amount")
                                )
                        )
                ),
                "required", List.of("ingredients")
        );

        return OcrRequest.GenerationConfig.builder()
                .responseMimeType("application/json")
                .responseSchema(schema)
                .build();
    }

    /**
     * 공통 GenerationConfig를 생성합니다. (모든 상품 스키마)
     */
    private OcrRequest.GenerationConfig buildGenerationConfigForItems() {
        Map<String, Object> schema = Map.of(
                "type", "object",
                "properties", Map.of(
                        "items", Map.of( // 'ingredients' 대신 'items' 사용
                                "type", "array",
                                "items", Map.of(
                                        "type", "object",
                                        "properties", Map.of(
                                                "name", Map.of(
                                                        "type", "string",
                                                        "description", "순수 상품명 (단위/규격 제외)"
                                                ),
                                                "unit", Map.of(
                                                        "type", "string",
                                                        "description", "상품 규격/단위 (예: 300g, (2입/봉), 1kg)"
                                                ),
                                                "amount", Map.of(
                                                        "type", "integer",
                                                        "description", "구매 수량 (영수증의 수량 컬럼 값)"
                                                )
                                        ),
                                        "required", List.of("name", "unit", "amount")
                                )
                        )
                ),
                "required", List.of("items")
        );

        return OcrRequest.GenerationConfig.builder()
                .responseMimeType("application/json")
                .responseSchema(schema)
                .build();
    }
}
