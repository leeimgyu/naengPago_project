package com.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Kakao Geocoding API 응답 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "주소 좌표 변환 응답")
public class GeocodingResponseDTO {

    @Schema(description = "입력한 주소", example = "서울특별시 강남구 테헤란로 212")
    private String address;

    @Schema(description = "위도", example = "37.4979502")
    private Double latitude;

    @Schema(description = "경도", example = "127.0276368")
    private Double longitude;

    /**
     * Kakao API 원본 응답 구조
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class KakaoApiResponse {
        private Meta meta;
        private List<Document> documents;

        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class Meta {
            @JsonProperty("total_count")
            private Integer totalCount;
        }

        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class Document {
            @JsonProperty("address_name")
            private String addressName;

            @JsonProperty("road_address")
            private RoadAddress roadAddress;

            private Address address;

            @JsonProperty("x")
            private String longitude;  // 경도

            @JsonProperty("y")
            private String latitude;   // 위도

            @Data
            @NoArgsConstructor
            @AllArgsConstructor
            public static class RoadAddress {
                @JsonProperty("address_name")
                private String addressName;
            }

            @Data
            @NoArgsConstructor
            @AllArgsConstructor
            public static class Address {
                @JsonProperty("address_name")
                private String addressName;
            }
        }
    }
}
