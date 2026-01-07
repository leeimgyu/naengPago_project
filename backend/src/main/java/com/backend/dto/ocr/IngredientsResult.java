package com.backend.dto.ocr;

import com.backend.dto.Ingredient;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Gemini API로부터 파싱된 식재료 결과 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IngredientsResult {
    @JsonProperty("items")
    private List<Ingredient> items;
}
