package com.backend.security.userdetails;

import com.backend.entity.User;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

/**
 * Spring Security UserDetails 구현체
 *
 * - User 엔티티를 Spring Security의 UserDetails로 변환
 * - 인증 및 권한 관리에 사용
 */
@Getter
@RequiredArgsConstructor
public class UserPrincipal implements UserDetails {

    private final User user;

    /**
     * 사용자 ID (PK) 반환
     */
    public Integer getId() {
        return user.getUserId();
    }

    /**
     * 사용자명 반환 (username)
     */
    @Override
    public String getUsername() {
        return user.getUsername();
    }

    /**
     * 이메일 반환
     */
    public String getEmail() {
        return user.getEmail();
    }

    /**
     * 비밀번호 반환
     */
    @Override
    public String getPassword() {
        return user.getPasswordHash();
    }

    /**
     * 권한 목록 반환
     * TODO: 추후 Role 테이블 추가 시 수정 필요
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    }

    /**
     * 계정 만료 여부
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * 계정 잠금 여부
     */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /**
     * 자격 증명 만료 여부
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * 계정 활성화 여부
     */
    @Override
    public boolean isEnabled() {
        return user.getIsActive() && !user.getIsDeleted();
    }

    /**
     * User 엔티티로부터 UserPrincipal 생성
     *
     * @param user User 엔티티
     * @return UserPrincipal
     */
    public static UserPrincipal create(User user) {
        return new UserPrincipal(user);
    }
}
