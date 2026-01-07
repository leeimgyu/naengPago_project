package com.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 카카오 로컬 API 응답 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KakaoLocalResponseDTO {

    /**
     * 검색 결과 메타 정보
     */
    private Meta meta;

    /**
     * 검색된 장소 목록
     */
    private List<Document> documents;

    /**
     * 메타 정보
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Meta {
        /**
         * 검색된 문서 수
         */
        @JsonProperty("total_count")
        private Integer totalCount;

        /**
         * 중복 제거된 문서 수
         */
        @JsonProperty("pageable_count")
        private Integer pageableCount;

        /**
         * 현재 페이지가 마지막 페이지인지 여부
         */
        @JsonProperty("is_end")
        private Boolean isEnd;
    }

    /**
     * 장소 문서
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Document {
        /**
         * 장소 ID
         */
        private String id;

        /**
         * 장소명
         */
        @JsonProperty("place_name")
        private String placeName;

        /**
         * 카테고리명
         */
        @JsonProperty("category_name")
        private String categoryName;

        /**
         * 카테고리 그룹 코드
         */
        @JsonProperty("category_group_code")
        private String categoryGroupCode;

        /**
         * 카테고리 그룹명
         */
        @JsonProperty("category_group_name")
        private String categoryGroupName;

        /**
         * 전화번호
         */
        private String phone;

        /**
         * 지번 주소
         */
        @JsonProperty("address_name")
        private String addressName;

        /**
         * 도로명 주소
         */
        @JsonProperty("road_address_name")
        private String roadAddressName;

        /**
         * X 좌표 (경도)
         */
        private String x;

        /**
         * Y 좌표 (위도)
         */
        private String y;

        /**
         * 장소 상세 URL
         */
        @JsonProperty("place_url")
        private String placeUrl;

        /**
         * 중심 좌표까지의 거리 (미터 단위)
         */
        private String distance;
    }
}
