package com.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 프로필 업데이트 요청 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "프로필 업데이트 요청")
public class UpdateProfileRequestDTO {

    @Schema(description = "닉네임 (username 컬럼에 저장)", example = "냉파고맨")
    @Size(max = 50, message = "닉네임은 50자 이하여야 합니다")
    private String nickname;

    @Schema(description = "전화번호", example = "01012345678")
    @Pattern(regexp = "^[0-9]{10,11}$", message = "전화번호는 10-11자리 숫자여야 합니다")
    private String phone;

    @Schema(description = "우편번호", example = "06234")
    @Pattern(regexp = "^[0-9]{5}$", message = "우편번호는 5자리 숫자여야 합니다")
    private String zipcode;

    @Schema(description = "기본 주소", example = "서울시 강남구 테헤란로 123")
    @Size(max = 100, message = "주소는 100자 이하여야 합니다")
    private String address1;  // ⚠️ 변수명 변경: address → address1

    @Schema(description = "상세 주소", example = "냉파고빌딩 3층")
    @Size(max = 100, message = "상세 주소는 100자 이하여야 합니다")
    private String address2;

    @Schema(description = "비밀번호 (변경 시에만)")
    @Size(min = 8, message = "비밀번호는 8자 이상이어야 합니다")
    private String password;

    @Schema(description = "프로필 이미지 URL", example = "https://example.com/profile.jpg")
    private String profileImage;
}
