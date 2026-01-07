package com.backend.exception;

/**
 * 잘못된 인증 정보 예외
 *
 * 로그인 시 이메일 또는 비밀번호가 잘못되었을 때 발생
 */
public class InvalidCredentialsException extends RuntimeException {

    public InvalidCredentialsException(String message) {
        super(message);
    }

    public InvalidCredentialsException(String message, Throwable cause) {
        super(message, cause);
    }
}
