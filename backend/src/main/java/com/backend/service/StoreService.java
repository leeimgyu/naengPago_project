package com.backend.service;

import com.backend.dto.StoreSearchResponseDTO;

/**
 * 식료품점 검색 서비스 인터페이스
 */
public interface StoreService {

    /**
     * 주변 식료품점 검색
     *
     * @param latitude  위도
     * @param longitude 경도
     * @param radius    검색 반경 (미터, 기본값: 1000)
     * @return 검색된 매장 목록
     */
    StoreSearchResponseDTO searchNearbyStores(Double latitude, Double longitude, Integer radius);
}
