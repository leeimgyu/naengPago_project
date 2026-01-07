package com.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * 냉장고 재료 수정 요청 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "냉장고 재료 수정 요청")
public class UpdateFridgeItemRequestDTO {

    @Schema(description = "재료명", example = "방울토마토")
    @Size(max = 100, message = "재료명은 100자 이하여야 합니다")
    private String name;

    @Schema(description = "수량", example = "5개")
    @Size(max = 50, message = "수량은 50자 이하여야 합니다")
    private String quantity;

    @Schema(description = "카테고리", example = "채소")
    @Size(max = 50, message = "카테고리는 50자 이하여야 합니다")
    private String category;

    @Schema(description = "유통기한", example = "2025-01-25")
    private LocalDate expiryDate;
}
