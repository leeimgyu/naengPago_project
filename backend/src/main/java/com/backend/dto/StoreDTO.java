package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 식료품점 정보 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoreDTO {

    /**
     * 매장 고유 ID (카카오 place_id)
     */
    private String id;

    /**
     * 매장명
     */
    private String name;

    /**
     * 카테고리 (대형마트, 편의점 등)
     */
    private String category;

    /**
     * 주소
     */
    private String address;

    /**
     * 전화번호
     */
    private String phone;

    /**
     * 영업시간
     */
    private String hours;

    /**
     * 거리 (미터 단위)
     */
    private Integer distance;

    /**
     * 위치 좌표
     */
    private Position position;

    /**
     * 위치 좌표 정보
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Position {
        /**
         * 위도
         */
        private Double lat;

        /**
         * 경도
         */
        private Double lng;
    }
}
