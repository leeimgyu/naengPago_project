package com.backend.controller;

import com.backend.dto.SignInRequestDTO;
import com.backend.dto.SignUpRequestDTO;
import com.backend.entity.User;
import com.backend.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * AuthController 통합 테스트
 *
 * - Spring Boot 전체 컨텍스트 로드
 * - 실제 데이터베이스 트랜잭션 테스트
 * - HTTP 요청/응답 검증
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        // 각 테스트 전에 데이터베이스 초기화
        userRepository.deleteAll();
    }

    /**
     * 회원가입 정상 동작 테스트
     */
    @Test
    @DisplayName("회원가입 - 정상 케이스")
    void testSignUp_Success() throws Exception {
        // Given
        SignUpRequestDTO request = SignUpRequestDTO.builder()
                .username("testuser")
                .email("test@example.com")
                .password("Test1234")
                .fullName("테스트 사용자")
                .phone("01012345678")
                .build();

        // When & Then
        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("회원가입이 완료되었습니다."))
                .andExpect(jsonPath("$.data.userId").exists())
                .andExpect(jsonPath("$.data.username").value("testuser"))
                .andExpect(jsonPath("$.data.email").value("test@example.com"))
                .andExpect(jsonPath("$.data.fullName").value("테스트 사용자"))
                .andExpect(jsonPath("$.data.phone").value("01012345678"))
                .andDo(print());
    }

    /**
     * 회원가입 - 이메일 중복 테스트
     */
    @Test
    @DisplayName("회원가입 - 이메일 중복 실패")
    void testSignUp_DuplicateEmail() throws Exception {
        // Given: 기존 사용자 생성
        User existingUser = User.builder()
                .username("existinguser")
                .email("test@example.com")
                .passwordHash(passwordEncoder.encode("Test1234"))
                .fullName("기존 사용자")
                .phone("01099999999")
                .isActive(true)
                .isDeleted(false)
                .build();
        userRepository.save(existingUser);

        SignUpRequestDTO request = SignUpRequestDTO.builder()
                .username("newuser")
                .email("test@example.com")  // 중복 이메일
                .password("Test1234")
                .fullName("신규 사용자")
                .phone("01088888888")
                .build();

        // When & Then
        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("중복된 리소스"))
                .andDo(print());
    }

    /**
     * 회원가입 - 입력값 검증 실패 테스트
     */
    @Test
    @DisplayName("회원가입 - 입력값 검증 실패")
    void testSignUp_ValidationFailure() throws Exception {
        // Given: 잘못된 입력값
        SignUpRequestDTO request = SignUpRequestDTO.builder()
                .username("ab")  // 3자 미만
                .email("invalid-email")  // 잘못된 이메일 형식
                .password("short")  // 8자 미만
                .build();

        // When & Then
        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("입력값 검증 실패"))
                .andExpect(jsonPath("$.errors").isArray())
                .andDo(print());
    }

    /**
     * 로그인 정상 동작 테스트
     */
    @Test
    @DisplayName("로그인 - 정상 케이스")
    void testSignIn_Success() throws Exception {
        // Given: 사용자 생성
        User user = User.builder()
                .username("testuser")
                .email("test@example.com")
                .passwordHash(passwordEncoder.encode("Test1234"))
                .fullName("테스트 사용자")
                .isActive(true)
                .isDeleted(false)
                .build();
        userRepository.save(user);

        SignInRequestDTO request = SignInRequestDTO.builder()
                .email("test@example.com")
                .password("Test1234")
                .build();

        // When & Then
        mockMvc.perform(post("/api/auth/signin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("로그인에 성공했습니다."))
                .andExpect(jsonPath("$.data.accessToken").exists())
                .andExpect(jsonPath("$.data.refreshToken").exists())
                .andExpect(jsonPath("$.data.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.data.expiresIn").value(3600))
                .andExpect(jsonPath("$.data.user.email").value("test@example.com"))
                .andDo(print());
    }

    /**
     * 로그인 - 잘못된 비밀번호 테스트
     */
    @Test
    @DisplayName("로그인 - 잘못된 비밀번호")
    void testSignIn_WrongPassword() throws Exception {
        // Given: 사용자 생성
        User user = User.builder()
                .username("testuser")
                .email("test@example.com")
                .passwordHash(passwordEncoder.encode("Test1234"))
                .isActive(true)
                .isDeleted(false)
                .build();
        userRepository.save(user);

        SignInRequestDTO request = SignInRequestDTO.builder()
                .email("test@example.com")
                .password("WrongPassword123")
                .build();

        // When & Then
        mockMvc.perform(post("/api/auth/signin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("인증 실패"))
                .andDo(print());
    }

    /**
     * 로그인 - 존재하지 않는 사용자 테스트
     */
    @Test
    @DisplayName("로그인 - 존재하지 않는 사용자")
    void testSignIn_UserNotFound() throws Exception {
        // Given
        SignInRequestDTO request = SignInRequestDTO.builder()
                .email("nonexistent@example.com")
                .password("Test1234")
                .build();

        // When & Then
        mockMvc.perform(post("/api/auth/signin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andDo(print());
    }

    /**
     * 현재 사용자 정보 조회 - 정상 케이스
     */
    @Test
    @DisplayName("현재 사용자 정보 조회 - 정상 케이스")
    void testGetCurrentUser_Success() throws Exception {
        // Given: 사용자 생성 및 로그인
        User user = User.builder()
                .username("testuser")
                .email("test@example.com")
                .passwordHash(passwordEncoder.encode("Test1234"))
                .fullName("테스트 사용자")
                .isActive(true)
                .isDeleted(false)
                .build();
        userRepository.save(user);

        // 로그인하여 토큰 획득
        SignInRequestDTO signInRequest = SignInRequestDTO.builder()
                .email("test@example.com")
                .password("Test1234")
                .build();

        MvcResult loginResult = mockMvc.perform(post("/api/auth/signin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signInRequest)))
                .andReturn();

        String responseBody = loginResult.getResponse().getContentAsString();
        String accessToken = objectMapper.readTree(responseBody)
                .path("data")
                .path("accessToken")
                .asText();

        // When & Then: 인증된 요청으로 사용자 정보 조회
        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value("test@example.com"))
                .andExpect(jsonPath("$.data.username").value("testuser"))
                .andDo(print());
    }

    /**
     * 현재 사용자 정보 조회 - 인증 없이 요청
     */
    @Test
    @DisplayName("현재 사용자 정보 조회 - 인증 없이 요청")
    void testGetCurrentUser_Unauthorized() throws Exception {
        // When & Then: Authorization 헤더 없이 요청
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized())
                .andDo(print());
    }

    /**
     * 로그아웃 테스트
     */
    @Test
    @DisplayName("로그아웃 - 정상 케이스")
    void testSignOut_Success() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/auth/signout"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("로그아웃되었습니다. 클라이언트에서 토큰을 삭제해주세요."))
                .andDo(print());
    }

    /**
     * 토큰 갱신 테스트
     */
    @Test
    @DisplayName("토큰 갱신 - 정상 케이스")
    void testRefreshToken_Success() throws Exception {
        // Given: 사용자 생성 및 로그인
        User user = User.builder()
                .username("testuser")
                .email("test@example.com")
                .passwordHash(passwordEncoder.encode("Test1234"))
                .isActive(true)
                .isDeleted(false)
                .build();
        userRepository.save(user);

        // 로그인하여 Refresh Token 획득
        SignInRequestDTO signInRequest = SignInRequestDTO.builder()
                .email("test@example.com")
                .password("Test1234")
                .build();

        MvcResult loginResult = mockMvc.perform(post("/api/auth/signin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signInRequest)))
                .andReturn();

        String responseBody = loginResult.getResponse().getContentAsString();
        String refreshToken = objectMapper.readTree(responseBody)
                .path("data")
                .path("refreshToken")
                .asText();

        // When & Then: Refresh Token으로 새 Access Token 발급
        mockMvc.perform(post("/api/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"refreshToken\":\"" + refreshToken + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("토큰이 갱신되었습니다."))
                .andExpect(jsonPath("$.data.accessToken").value(notNullValue()))
                .andExpect(jsonPath("$.data.refreshToken").value(refreshToken))
                .andDo(print());
    }

    /**
     * 토큰 갱신 - 잘못된 Refresh Token
     */
    @Test
    @DisplayName("토큰 갱신 - 잘못된 Refresh Token")
    void testRefreshToken_InvalidToken() throws Exception {
        // Given: 잘못된 토큰
        String invalidToken = "invalid.refresh.token";

        // When & Then
        mockMvc.perform(post("/api/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"refreshToken\":\"" + invalidToken + "\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andDo(print());
    }
}
