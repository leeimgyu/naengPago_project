package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 식재료 정보 DTO
 * Gemini API를 통해 영수증에서 추출된 식재료 정보
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Ingredient {
    /**
     * 식재료명 (순수 상품명)
     */
    private String name;

    /**
     * 상품 규격/단위 (예: 300g, (2입/봉), 1kg)
     */
    private String unit;

    /**
     * 구매 수량 (영수증의 수량 컬럼 값)
     */
    private Integer amount;
}
