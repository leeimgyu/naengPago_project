package com.backend.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 전역 예외 처리 핸들러
 *
 * 모든 REST API 예외를 일관된 JSON 형식으로 응답
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Bean Validation 실패 처리
     *
     * @param ex MethodArgumentNotValidException
     * @return 400 Bad Request
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        log.error("Validation 오류: {}", ex.getMessage());

        List<Map<String, String>> errors = new ArrayList<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            Map<String, String> errorDetail = new HashMap<>();
            errorDetail.put("field", ((FieldError) error).getField());
            errorDetail.put("message", error.getDefaultMessage());
            errors.add(errorDetail);
        });

        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "입력값 검증 실패");
        response.put("errors", errors);
        response.put("timestamp", OffsetDateTime.now().toString());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * 중복 리소스 예외 처리
     *
     * @param ex DuplicateResourceException
     * @return 409 Conflict
     */
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<Map<String, Object>> handleDuplicateResourceException(DuplicateResourceException ex) {
        log.error("중복 리소스 오류: {}", ex.getMessage());

        Map<String, String> error = new HashMap<>();
        error.put("field", "resource");
        error.put("message", ex.getMessage());

        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "중복된 리소스");
        response.put("errors", List.of(error));
        response.put("timestamp", OffsetDateTime.now().toString());

        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    /**
     * 리소스 없음 예외 처리
     *
     * @param ex ResourceNotFoundException
     * @return 404 Not Found
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResourceNotFoundException(ResourceNotFoundException ex) {
        log.error("리소스 없음 오류: {}", ex.getMessage());

        Map<String, String> error = new HashMap<>();
        error.put("field", "resource");
        error.put("message", ex.getMessage());

        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "리소스를 찾을 수 없음");
        response.put("errors", List.of(error));
        response.put("timestamp", OffsetDateTime.now().toString());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    /**
     * 잘못된 인증 정보 예외 처리
     *
     * @param ex InvalidCredentialsException
     * @return 401 Unauthorized
     */
    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidCredentialsException(InvalidCredentialsException ex) {
        log.error("인증 정보 오류: {}", ex.getMessage());

        Map<String, String> error = new HashMap<>();
        error.put("field", "credentials");
        error.put("message", ex.getMessage());

        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "인증 실패");
        response.put("errors", List.of(error));
        response.put("timestamp", OffsetDateTime.now().toString());

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    /**
     * 잘못된 토큰 예외 처리
     *
     * @param ex InvalidTokenException
     * @return 401 Unauthorized
     */
    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidTokenException(InvalidTokenException ex) {
        log.error("토큰 오류: {}", ex.getMessage());

        Map<String, String> error = new HashMap<>();
        error.put("field", "token");
        error.put("message", ex.getMessage());

        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "유효하지 않은 토큰");
        response.put("errors", List.of(error));
        response.put("timestamp", OffsetDateTime.now().toString());

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    /**
     * Spring Security BadCredentialsException 처리
     *
     * @param ex BadCredentialsException
     * @return 401 Unauthorized
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentialsException(BadCredentialsException ex) {
        log.error("잘못된 인증 정보: {}", ex.getMessage());

        Map<String, String> error = new HashMap<>();
        error.put("field", "credentials");
        error.put("message", "이메일 또는 비밀번호가 올바르지 않습니다.");

        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "인증 실패");
        response.put("errors", List.of(error));
        response.put("timestamp", OffsetDateTime.now().toString());

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    /**
     * UsernameNotFoundException 처리
     *
     * @param ex UsernameNotFoundException
     * @return 401 Unauthorized
     */
    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleUsernameNotFoundException(UsernameNotFoundException ex) {
        log.error("사용자 없음: {}", ex.getMessage());

        Map<String, String> error = new HashMap<>();
        error.put("field", "user");
        error.put("message", "사용자를 찾을 수 없습니다.");

        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "인증 실패");
        response.put("errors", List.of(error));
        response.put("timestamp", OffsetDateTime.now().toString());

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    /**
     * 기타 모든 예외 처리
     *
     * @param ex Exception
     * @return 500 Internal Server Error
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGlobalException(Exception ex) {
        log.error("서버 오류: ", ex);

        Map<String, String> error = new HashMap<>();
        error.put("field", "server");
        error.put("message", "서버 내부 오류가 발생했습니다.");

        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "서버 오류");
        response.put("errors", List.of(error));
        response.put("timestamp", OffsetDateTime.now().toString());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
