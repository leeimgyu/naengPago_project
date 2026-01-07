package com.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 인증 응답 DTO (로그인, 토큰 갱신 응답)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "인증 응답")
public class AuthResponseDTO {

    @Schema(description = "Access Token", example = "eyJhbGciOiJIUzUxMiJ9...")
    private String accessToken;

    @Schema(description = "Refresh Token", example = "eyJhbGciOiJIUzUxMiJ9...")
    private String refreshToken;

    @Schema(description = "토큰 타입", example = "Bearer")
    @Builder.Default
    private String tokenType = "Bearer";

    @Schema(description = "토큰 만료 시간 (초)", example = "3600")
    private long expiresIn;

    @Schema(description = "사용자 정보")
    private UserSummaryDTO user;
}
