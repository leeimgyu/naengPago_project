package com.backend.service;

import com.backend.dto.GeocodingResponseDTO;

/**
 * 주소 좌표 변환 서비스 인터페이스
 */
public interface GeocodingService {

    /**
     * 주소를 위도/경도 좌표로 변환
     *
     * @param address 변환할 주소
     * @return 좌표 정보 (위도, 경도)
     */
    GeocodingResponseDTO convertAddressToCoordinates(String address);
}
