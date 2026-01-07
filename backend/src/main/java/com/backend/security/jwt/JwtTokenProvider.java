package com.backend.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * JWT 토큰 생성 및 검증 Provider
 *
 * - Access Token, Refresh Token 생성
 * - 토큰 검증 및 파싱
 * - 사용자 정보 추출
 */
@Slf4j
@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-token-validity}")
    private long accessTokenValidity;

    @Value("${jwt.refresh-token-validity}")
    private long refreshTokenValidity;

    /**
     * Secret Key 생성
     * - UTF-8 인코딩을 사용하여 평문 시크릿 키를 바이트 배열로 변환
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Access Token 생성
     *
     * @param userDetails 사용자 정보
     * @return Access Token
     */
    public String generateAccessToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "access");
        return createToken(claims, userDetails.getUsername(), accessTokenValidity);
    }

    /**
     * Refresh Token 생성
     *
     * @param userDetails 사용자 정보
     * @return Refresh Token
     */
    public String generateRefreshToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "refresh");
        return createToken(claims, userDetails.getUsername(), refreshTokenValidity);
    }

    /**
     * JWT 토큰 생성 (공통)
     *
     * @param claims     추가 클레임
     * @param subject    사용자명 (username or email)
     * @param validity   유효기간 (밀리초)
     * @return JWT 토큰
     */
    private String createToken(Map<String, Object> claims, String subject, long validity) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + validity);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * 토큰에서 Claims 추출
     *
     * @param token JWT 토큰
     * @return Claims
     */
    public Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * 토큰에서 사용자명 추출
     *
     * @param token JWT 토큰
     * @return 사용자명
     */
    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    /**
     * 토큰 만료 확인
     *
     * @param token JWT 토큰
     * @return 만료 여부
     */
    public boolean isTokenExpired(String token) {
        try {
            Date expiration = extractClaims(token).getExpiration();
            return expiration.before(new Date());
        } catch (Exception e) {
            return true;
        }
    }

    /**
     * 토큰 검증
     *
     * @param token JWT 토큰
     * @return 유효성 여부
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            log.error("JWT 토큰 검증 실패: {}", e.getMessage());
            return false;
        }
    }
}
