package com.backend.exception;

/**
 * 중복 리소스 예외
 *
 * 이미 존재하는 리소스를 생성하려고 할 때 발생
 * (예: 이미 존재하는 이메일/사용자명으로 회원가입)
 */
public class DuplicateResourceException extends RuntimeException {

    public DuplicateResourceException(String message) {
        super(message);
    }

    public DuplicateResourceException(String message, Throwable cause) {
        super(message, cause);
    }
}
