package com.backend.exception;

/**
 * 리소스 없음 예외
 *
 * 요청한 리소스를 찾을 수 없을 때 발생
 * (예: 존재하지 않는 사용자 ID)
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
