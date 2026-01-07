package com.backend.dto.recipeApi;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RecipeResponse {
    @JsonProperty("COOKRCP01")
    private CookRcp01 cookRcp01;

    @Data
    @NoArgsConstructor
    public static class CookRcp01 {
        @JsonProperty("total_count")
        private String totalCount;
        @JsonProperty("row")
        private List<RecipeApi> row;
        @JsonProperty("RESULT")
        private Result result;
    }

    @Data
    @NoArgsConstructor
    public static class Result {
        @JsonProperty("MSG")
        private String msg;
        @JsonProperty("CODE")
        private String code;
    }
}
