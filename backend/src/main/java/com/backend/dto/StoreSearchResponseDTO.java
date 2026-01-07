package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 식료품점 검색 응답 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoreSearchResponseDTO {

    /**
     * 검색된 매장 목록
     */
    private List<StoreDTO> stores;

    /**
     * 총 매장 수
     */
    private Integer totalCount;
}
