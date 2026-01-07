package com.backend.security.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * JWT 인증 필터
 *
 * - Authorization 헤더에서 JWT 토큰 추출
 * - 토큰 검증 후 SecurityContext에 인증 정보 설정
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    // SecurityConfig와 유사하게 공개 경로 목록 정의
    private static final List<String> PERMIT_ALL_PATTERNS = List.of(
            "/api/auth/**",
            "/api/recipes/**",
            "/api/reviews/**",
            "/swagger-ui/**",
            "/v3/api-docs/**"
    );

    // 인증이 필요한 GET 경로 (구체적인 경로가 우선)
    private static final List<String> AUTH_REQUIRED_GET_PATTERNS = List.of(
        "/api/recipes/*/is-liked",
        "/api/recipes/liked",
        "/api/recipes/recommendations/fridge"
    );

    /**
     * JWT 토큰 인증 처리
     */
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getServletPath();
        String method = request.getMethod();

        // 인증이 필요한 GET 경로 체크 (구체적인 경로 먼저)
        boolean isAuthRequiredGet = HttpMethod.GET.name().equalsIgnoreCase(method) &&
                AUTH_REQUIRED_GET_PATTERNS.stream()
                        .anyMatch(pattern -> pathMatcher.match(pattern, path));

        // 공개 경로 체크
        boolean isPermitAll = PERMIT_ALL_PATTERNS.stream()
                .anyMatch(pattern -> pathMatcher.match(pattern, path));

        // 공개된 경로의 GET 요청이거나, /api/auth/로 시작하는 요청은 토큰 검사 없이 통과
        // 단, 인증이 필요한 GET 경로는 제외
        if (!isAuthRequiredGet && isPermitAll && (HttpMethod.GET.name().equalsIgnoreCase(method) || path.startsWith("/api/auth/"))) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = extractTokenFromRequest(request);

            if (token != null && jwtTokenProvider.validateToken(token)) {
                String username = jwtTokenProvider.extractUsername(token);
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authentication.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
                );

                SecurityContextHolder.getContext().setAuthentication(authentication);

                log.debug("JWT 인증 성공: {}", username);
            }
        } catch (Exception e) {
            log.error("JWT 인증 필터 처리 중 오류 발생: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    /**
     * HTTP 요청에서 JWT 토큰 추출
     *
     * @param request HTTP 요청
     * @return JWT 토큰 (없으면 null)
     */
    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
