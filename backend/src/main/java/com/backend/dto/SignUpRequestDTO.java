package com.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 회원가입 요청 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "회원가입 요청")
public class SignUpRequestDTO {

    @NotBlank(message = "사용자 이름은 필수입니다")
    @Size(min = 3, max = 50, message = "사용자 이름은 3자 이상 50자 이하여야 합니다")
    @Schema(description = "사용자명", example = "testuser", required = true)
    private String username;

    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "올바른 이메일 형식이어야 합니다")
    @Schema(description = "이메일", example = "test@example.com", required = true)
    private String email;

    @NotBlank(message = "비밀번호는 필수입니다")
    @Size(min = 8, max = 50, message = "비밀번호는 8자 이상 50자 이하여야 합니다")
    @Pattern(
        regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*#?&]{8,}$",
        message = "비밀번호는 영문자와 숫자를 포함해야 합니다"
    )
    @Schema(description = "비밀번호", example = "Test1234", required = true)
    private String password;

    @Size(max = 100, message = "이름은 100자 이하여야 합니다")
    @Schema(description = "전체 이름", example = "테스트 사용자")
    private String fullName;

    @Pattern(regexp = "^[0-9]{10,11}$", message = "전화번호는 10-11자리 숫자여야 합니다")
    @Schema(description = "전화번호", example = "01012345678")
    private String phone;

    @Schema(description = "우편번호", example = "06234")
    @Pattern(regexp = "^[0-9]{5}$", message = "우편번호는 5자리 숫자여야 합니다")
    private String zipcode;

    @Schema(description = "기본 주소", example = "서울시 강남구 테헤란로 123")
    @Size(max = 100, message = "주소는 100자 이하여야 합니다")
    private String address1;

    @Schema(description = "상세 주소", example = "냉파고빌딩 3층")
    @Size(max = 100, message = "상세 주소는 100자 이하여야 합니다")
    private String address2;

    @Schema(description = "OAuth 제공자 (google, kakao, naver)", example = "google")
    private String provider;

    @Schema(description = "OAuth 제공자의 사용자 고유 ID")
    private String providerId;
}
