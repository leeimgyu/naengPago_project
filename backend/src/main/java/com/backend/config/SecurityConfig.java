package com.backend.config;

import com.backend.security.SecurityContextPropagationFilter;
import com.backend.security.ReactiveToServletSecurityContextRepository; // ReactiveToServletSecurityContextRepository import 추가
import com.backend.security.jwt.JwtAuthenticationEntryPoint;
import com.backend.security.jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder; // SecurityContextHolder import 추가
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.context.SecurityContextHolderFilter; // Import for SecurityContextHolderFilter
import org.springframework.security.web.context.request.async.WebAsyncManagerIntegrationFilter; // WebAsyncManagerIntegrationFilter import
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Spring Security 설정
 *
 * - Spring Security 6.5.1 최신 패턴 적용
 * - JWT 기반 Stateless 인증
 * - BCrypt 비밀번호 암호화 (strength: 10)
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final UserDetailsService userDetailsService;
    private final ReactiveToServletSecurityContextRepository reactiveToServletSecurityContextRepository;
    private final SecurityContextPropagationFilter securityContextPropagationFilter; // SecurityContextPropagationFilter 주입

    /**
     * 비밀번호 암호화 인코더
     *
     * @return BCryptPasswordEncoder (strength: 10)
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    /**
     * DaoAuthenticationProvider 설정
     *
     * @return DaoAuthenticationProvider
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    /**
     * AuthenticationManager Bean
     *
     * @param authConfig AuthenticationConfiguration
     * @return AuthenticationManager
     * @throws Exception 설정 중 예외
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig)
            throws Exception {
        return authConfig.getAuthenticationManager();
    }

    /**
     * CORS 설정
     *
     * @return CorsConfigurationSource
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 허용할 Origin (프론트엔드 URL)
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",    // React 개발 서버
            "http://localhost:5173",    // Vite 개발 서버
            "http://localhost:8080"     // 같은 포트 테스트용
        ));

        // 허용할 HTTP 메서드
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));

        // 허용할 헤더
        configuration.setAllowedHeaders(List.of("*"));

        // 인증 정보 포함 허용
        configuration.setAllowCredentials(true);

        // 노출할 헤더
        configuration.setExposedHeaders(Arrays.asList("Authorization"));

        // Preflight 요청 캐시 시간 (1시간)
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * WebAsyncManagerIntegrationFilter Bean
     *
     * @return WebAsyncManagerIntegrationFilter
     */
    @Bean
    public WebAsyncManagerIntegrationFilter webAsyncManagerIntegrationFilter() {
        return new WebAsyncManagerIntegrationFilter();
    }

    /**
     * SecurityFilterChain 설정 (Spring Security 6.5.1 최신 패턴)
     *
     * @param http HttpSecurity
     * @return SecurityFilterChain
     * @throws Exception 설정 중 예외
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // CORS 활성화
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // CSRF 비활성화 (JWT 사용으로 불필요)
            .csrf(AbstractHttpConfigurer::disable)

            // 세션 관리: Stateless (JWT 사용)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // SecurityContextRepository 설정
            .securityContext(securityContext -> securityContext
                .securityContextRepository(reactiveToServletSecurityContextRepository)
            )

            // 예외 처리 핸들러
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
            )

            // 인가 규칙
            .authorizeHttpRequests(auth -> auth
                // --- 공개 경로 ---
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/auth/**"
                ).permitAll()

                // OAuth2 경로 (GET 요청 허용)
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/auth/oauth2/**"
                ).permitAll()

                // 인증이 필요한 레시피 GET 엔드포인트 (구체적인 경로 먼저)
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/recipes/*/is-liked",
                    "/api/recipes/liked",
                    "/api/recipes/recommendations/fridge"
                ).authenticated()

                // 공개 GET 경로 (구체적인 경로만)
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/recipes/{id}",
                    "/api/recipes",
                    "/api/recipes/search/**",
                    "/api/recipes/popular",
                    "/api/recipes/latest",
                    "/api/recipes/weekly-recommendation",
                    "/api/recipes/id-by-name",
                    "/api/reviews/**",
                    "/api/v1/recipes/**"
                ).permitAll()

                .requestMatchers(
                    HttpMethod.POST,
                    "/api/recipes/**"
                ).authenticated()
                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/recipes/**"
                ).authenticated()
                .requestMatchers(
                    HttpMethod.DELETE,
                    "/api/recipes/**"
                ).authenticated()

                // 공지사항 조회 API (공개)
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/notices",
                    "/api/notices/**"
                ).permitAll()

                // 공지사항 조회수 증가 API (공개)
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/notices/*/views"
                ).permitAll()

                // 공지사항 생성/수정/삭제는 인증 필요
                .requestMatchers(
                    "/api/notices/**"
                ).authenticated()

                // 파일 관련 경로 (다운로드, 이미지 보기 등) 공개
                .requestMatchers(
                    "/files/**",
                    "/uploads/**",
                    "/api/files/download/**"
                ).permitAll()

                // 지오코딩 API (주소 → 좌표 변환, 공개)
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/geocoding"
                ).permitAll()

                // 주변 식료품점 검색 API (공개)
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/stores/nearby"
                ).permitAll()

                // Swagger UI
                .requestMatchers(
                    "/swagger-ui/**",
                    "/v3/api-docs/**",
                    "/swagger-resources/**"
                ).permitAll()
                
                // --- 댓글 API ---
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/recipes/*/comments"
                ).permitAll()
                .requestMatchers(
                    "/api/recipes/*/comments/**"
                ).authenticated()
                
                // --- 그 외 모든 요청은 인증 필요 ---
                .anyRequest().authenticated()
            )
            // WebAsyncManagerIntegrationFilter를 필터 체인에 추가 (SecurityContextHolderFilter 이전에)
            .addFilterBefore(webAsyncManagerIntegrationFilter(), SecurityContextHolderFilter.class)

            .addFilterBefore(securityContextPropagationFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

            // AuthenticationProvider 설정
            .authenticationProvider(authenticationProvider());


        return http.build();
    }
}
