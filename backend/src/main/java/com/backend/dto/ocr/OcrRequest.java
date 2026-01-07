package com.backend.dto.ocr;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Gemini API 요청 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OcrRequest {
    private List<Content> contents;

    @JsonProperty("generationConfig")
    private GenerationConfig generationConfig;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Content {
        private List<Part> parts;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Part {
        private String text;
        private InlineData inlineData;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InlineData {
        @JsonProperty("mime_type")
        private String mimeType;
        private String data;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GenerationConfig {
        @JsonProperty("responseMimeType")
        private String responseMimeType;

        @JsonProperty("responseSchema")
        private Map<String, Object> responseSchema;
    }
}
