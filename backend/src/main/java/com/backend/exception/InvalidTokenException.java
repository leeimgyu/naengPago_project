package com.backend.exception;

/**
 * 잘못된 토큰 예외
 *
 * JWT 토큰이 유효하지 않거나 만료되었을 때 발생
 */
public class InvalidTokenException extends RuntimeException {

    public InvalidTokenException(String message) {
        super(message);
    }

    public InvalidTokenException(String message, Throwable cause) {
        super(message, cause);
    }
}
