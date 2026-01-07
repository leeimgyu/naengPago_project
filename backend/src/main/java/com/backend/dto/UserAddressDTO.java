package com.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 사용자 주소 정보 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "사용자 주소 정보")
public class UserAddressDTO {

    @Schema(description = "우편번호", example = "06234")
    private String zipcode;

    @Schema(description = "기본 주소", example = "서울특별시 강남구 테헤란로 123")
    private String address1;

    @Schema(description = "상세 주소", example = "냉파고빌딩 3층")
    private String address2;

    @Schema(description = "전체 주소 (address1 + address2)", example = "서울특별시 강남구 테헤란로 123 냉파고빌딩 3층")
    private String fullAddress;

    /**
     * User 엔티티로부터 주소 DTO 생성
     */
    public static UserAddressDTO fromEntity(com.backend.entity.User user) {
        String fullAddress = buildFullAddress(user.getAddress1(), user.getAddress2());

        return UserAddressDTO.builder()
                .zipcode(user.getZipcode())
                .address1(user.getAddress1())
                .address2(user.getAddress2())
                .fullAddress(fullAddress)
                .build();
    }

    /**
     * 전체 주소 생성
     */
    private static String buildFullAddress(String address1, String address2) {
        if (address1 == null && address2 == null) {
            return null;
        }
        if (address1 == null) {
            return address2;
        }
        if (address2 == null) {
            return address1;
        }
        return address1 + " " + address2;
    }
}
