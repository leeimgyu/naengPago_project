package com.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * 사용자 냉장고 재료 응답 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "사용자 냉장고 재료 정보")
public class UserFridgeDTO {

    @Schema(description = "냉장고 재료 ID", example = "1")
    private Integer id;

    @Schema(description = "재료명", example = "토마토")
    private String name;

    @Schema(description = "수량", example = "3개")
    private String quantity;

    @Schema(description = "카테고리", example = "채소")
    private String category;

    @Schema(description = "유통기한", example = "2025-01-20")
    private String expiryDate;

    @Schema(description = "추가일시", example = "2025-01-13")
    private String addedAt;
}
