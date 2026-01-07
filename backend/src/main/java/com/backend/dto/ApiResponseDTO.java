package com.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

/**
 * 공통 API 응답 DTO
 *
 * @param <T> 응답 데이터 타입
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "API 응답")
public class ApiResponseDTO<T> {

    @Schema(description = "성공 여부", example = "true")
    private boolean success;

    @Schema(description = "응답 메시지", example = "요청이 성공적으로 처리되었습니다")
    private String message;

    @Schema(description = "응답 데이터")
    private T data;

    @Schema(description = "타임스탬프", example = "2024-01-15T10:30:00+09:00")
    @Builder.Default
    private String timestamp = OffsetDateTime.now().toString();

    /**
     * 성공 응답 생성 (데이터 포함)
     *
     * @param data    응답 데이터
     * @param message 메시지
     * @param <T>     데이터 타입
     * @return ApiResponseDTO
     */
    public static <T> ApiResponseDTO<T> success(T data, String message) {
        return ApiResponseDTO.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .build();
    }

    /**
     * 성공 응답 생성 (데이터 없음)
     *
     * @param message 메시지
     * @param <T>     데이터 타입
     * @return ApiResponseDTO
     */
    public static <T> ApiResponseDTO<T> success(String message) {
        return ApiResponseDTO.<T>builder()
                .success(true)
                .message(message)
                .build();
    }

    /**
     * 실패 응답 생성
     *
     * @param message 메시지
     * @param <T>     데이터 타입
     * @return ApiResponseDTO
     */
    public static <T> ApiResponseDTO<T> failure(String message) {
        return ApiResponseDTO.<T>builder()
                .success(false)
                .message(message)
                .build();
    }
}
