package com.backend.dto.ocr;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Gemini API 응답 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OcrResponse {
    private List<Candidate> candidates;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Candidate {
        private Content content;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Content {
        private List<Part> parts;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Part {
        private String text;
    }
}
