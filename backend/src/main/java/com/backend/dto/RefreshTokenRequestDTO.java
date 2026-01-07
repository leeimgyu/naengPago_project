package com.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Refresh Token 요청 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "토큰 갱신 요청")
public class RefreshTokenRequestDTO {

    @NotBlank(message = "Refresh Token은 필수입니다")
    @Schema(description = "Refresh Token", example = "eyJhbGciOiJIUzUxMiJ9...", required = true)
    private String refreshToken;
}
