package com.backend.dto;

import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReceiptOcrResult {
    private String extractedText;
    private String totalPaymentPrice;
    private List<BoundingBox> boundingBoxes;
    private List<ProductItem> products;
    private List<Ingredient> ingredients;

    @Data
    @Builder
    public static class BoundingBox {
        private String text;
        private List<Vertex> vertices;
    }

    @Data
    @Builder
    public static class Vertex {
        private Integer x;
        private Integer y;
    }
}
