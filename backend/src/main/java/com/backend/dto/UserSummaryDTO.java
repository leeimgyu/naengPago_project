package com.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 사용자 요약 정보 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "사용자 요약 정보")
public class UserSummaryDTO {

    @Schema(description = "사용자 ID", example = "1")
    private Integer userId;

    @Schema(description = "사용자명 (로그인 ID)", example = "testuser")
    private String username;

    @Schema(description = "이메일", example = "test@example.com")
    private String email;

    @Schema(description = "전체 이름", example = "테스트 사용자")
    private String fullName;

    @Schema(description = "닉네임 (화면 표시용, username과 동일)", example = "냉파고맨")
    private String nickname;

    @Schema(description = "전화번호", example = "01012345678")
    private String phone;

    @Schema(description = "우편번호", example = "06234")
    private String zipcode;

    @Schema(description = "기본 주소", example = "서울시 강남구 테헤란로 123")
    private String address1;

    @Schema(description = "상세 주소", example = "냉파고빌딩 3층")
    private String address2;

    @Schema(description = "프로필 이미지 URL", example = "https://example.com/profile.jpg")
    private String profileImage;
}
