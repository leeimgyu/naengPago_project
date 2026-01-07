package com.backend.dto;

import lombok.Builder;
import lombok.Data;

/**
 * 영수증에서 추출한 개별 상품 정보
 */
@Data
@Builder
public class ProductItem {
    /**
     * 상품명
     */
    private String productName;

    /**
     * 수량
     */
    private Integer quantity;

    /**
     * 단가 (옵션)
     */
    private String unitPrice;

    /**
     * 금액 (옵션)
     */
    private String totalPrice;

    /**
     * 바코드 (옵션)
     */
    private String barcode;
}
