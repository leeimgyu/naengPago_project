package com.backend.controller;

import com.backend.dto.ApiResponseDTO;
import com.backend.dto.AuthResponseDTO;
import com.backend.dto.RefreshTokenRequestDTO;
import com.backend.dto.SignInRequestDTO;
import com.backend.dto.SignUpRequestDTO;
import com.backend.dto.UserSummaryDTO;
import com.backend.security.userdetails.UserPrincipal;
import com.backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 인증 관련 REST API 컨트롤러
 *
 * - 회원가입, 로그인, 토큰 갱신
 * - 현재 사용자 정보 조회
 * - 로그아웃 (클라이언트 측 토큰 삭제)
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "인증 API")
public class AuthController {

    private final AuthService authService;

    /**
     * 회원가입
     *
     * @param signUpRequest 회원가입 요청 DTO
     * @return 생성된 사용자 정보
     */
    @PostMapping("/signup")
    @Operation(summary = "회원가입", description = "새로운 사용자를 등록합니다.")
    public ResponseEntity<ApiResponseDTO<UserSummaryDTO>> signUp(
            @Valid @RequestBody SignUpRequestDTO signUpRequest) {
        try {
            log.info("회원가입 요청: email={}", signUpRequest.getEmail());
            UserSummaryDTO userSummary = authService.signUp(signUpRequest);
            log.info("회원가입 성공: email={}, userId={}", signUpRequest.getEmail(), userSummary.getUserId());
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(ApiResponseDTO.success(userSummary, "회원가입이 완료되었습니다."));
        } catch (Exception e) {
            log.error("회원가입 실패: email={}, error={}", signUpRequest.getEmail(), e.getMessage(), e);
            return ResponseEntity.status(500).body(
                    ApiResponseDTO.failure("회원가입에 실패했습니다: " + e.getMessage())
            );
        }
    }

    /**
     * 로그인
     *
     * @param signInRequest 로그인 요청 DTO
     * @return JWT 토큰 및 사용자 정보
     */
    @PostMapping("/signin")
    @Operation(summary = "로그인", description = "이메일과 비밀번호로 로그인합니다.")
    public ResponseEntity<ApiResponseDTO<AuthResponseDTO>> signIn(
            @Valid @RequestBody SignInRequestDTO signInRequest) {
        try {
            log.info("로그인 요청: email={}", signInRequest.getEmail());
            AuthResponseDTO authResponse = authService.signIn(signInRequest);
            log.info("로그인 성공: email={}", signInRequest.getEmail());
            return ResponseEntity
                    .ok(ApiResponseDTO.success(authResponse, "로그인에 성공했습니다."));
        } catch (org.springframework.security.core.userdetails.UsernameNotFoundException e) {
            // 사용자를 찾을 수 없는 경우 (아이디 오류)
            log.warn("로그인 실패 - 사용자 없음: email={}", signInRequest.getEmail());
            return ResponseEntity.status(404).body(
                    ApiResponseDTO.failure("존재하지 않는 아이디입니다.")
            );
        } catch (BadCredentialsException e) {
            // 비밀번호가 틀린 경우
            log.warn("로그인 실패 - 비밀번호 불일치: email={}", signInRequest.getEmail());
            return ResponseEntity.status(401).body(
                    ApiResponseDTO.failure("비밀번호가 틀렸습니다.")
            );
        } catch (Exception e) {
            // 기타 예외
            log.error("로그인 실패: email={}, error={}", signInRequest.getEmail(), e.getMessage(), e);
            return ResponseEntity.status(500).body(
                    ApiResponseDTO.failure("로그인에 실패했습니다: " + e.getMessage())
            );
        }
    }

    /**
     * 토큰 갱신
     *
     * @param refreshTokenRequest Refresh Token 요청 DTO
     * @return 새로운 Access Token 및 사용자 정보
     */
    @PostMapping("/refresh")
    @Operation(summary = "토큰 갱신", description = "Refresh Token으로 새로운 Access Token을 발급받습니다.")
    public ResponseEntity<ApiResponseDTO<AuthResponseDTO>> refreshToken(
            @Valid @RequestBody RefreshTokenRequestDTO refreshTokenRequest) {
        AuthResponseDTO authResponse = authService.refreshToken(refreshTokenRequest);
        return ResponseEntity
                .ok(ApiResponseDTO.success(authResponse, "토큰이 갱신되었습니다."));
    }

    /**
     * 현재 사용자 정보 조회
     *
     * @param userPrincipal 현재 인증된 사용자
     * @return 사용자 요약 정보
     */
    @GetMapping("/me")
    @Operation(summary = "현재 사용자 정보 조회", description = "인증된 사용자의 정보를 조회합니다.")
    public ResponseEntity<ApiResponseDTO<UserSummaryDTO>> getCurrentUser(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            throw new BadCredentialsException("인증되지 않은 사용자입니다.");
        }

        UserSummaryDTO userSummary = authService.getCurrentUser(userPrincipal.getId());
        return ResponseEntity
                .ok(ApiResponseDTO.success(userSummary, "사용자 정보 조회에 성공했습니다."));
    }

    /**
     * 로그아웃
     *
     * 참고: JWT는 stateless 방식이므로 서버에서 토큰을 무효화할 수 없습니다.
     * 클라이언트에서 Access Token과 Refresh Token을 삭제해야 합니다.
     *
     * @return 로그아웃 성공 메시지
     */
    @PostMapping("/signout")
    @Operation(summary = "로그아웃", description = "로그아웃합니다. (클라이언트에서 토큰 삭제 필요)")
    public ResponseEntity<ApiResponseDTO<Void>> signOut() {
        return ResponseEntity
                .ok(ApiResponseDTO.success("로그아웃되었습니다. 클라이언트에서 토큰을 삭제해주세요."));
    }
}
