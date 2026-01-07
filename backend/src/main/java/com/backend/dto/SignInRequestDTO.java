package com.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 로그인 요청 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "로그인 요청")
public class SignInRequestDTO {

    @NotBlank(message = "이메일은 필수입니다")
    @Schema(description = "이메일", example = "test@example.com", required = true)
    private String email;

    @NotBlank(message = "비밀번호는 필수입니다")
    @Schema(description = "비밀번호", example = "Test1234", required = true)
    private String password;
}
