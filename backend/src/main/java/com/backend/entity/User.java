package com.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 사용자 엔티티
 *
 * PostgreSQL users 테이블 매핑
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BasicEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @NotBlank(message = "사용자 이름은 필수입니다")
    @Size(min = 3, max = 50, message = "사용자 이름은 3자 이상 50자 이하여야 합니다")
    @Column(name = "username", nullable = false, unique = true, length = 50)
    private String username;

    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "올바른 이메일 형식이어야 합니다")
    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @NotBlank(message = "비밀번호는 필수입니다")
    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Size(max = 100, message = "이름은 100자 이하여야 합니다")
    @Column(name = "full_name", length = 100)
    private String fullName;

    @Pattern(regexp = "^[0-9]{10,11}$", message = "전화번호는 10-11자리 숫자여야 합니다")
    @Column(name = "phone", length = 20)
    private String phone;

    // 우편번호
    @Pattern(regexp = "^[0-9]{5}$", message = "우편번호는 5자리 숫자여야 합니다")
    @Column(name = "zipcode", length = 10)
    private String zipcode;

    // 기본 주소
    @Size(max = 100, message = "주소는 100자 이하여야 합니다")
    @Column(name = "address1", length = 500)
    private String address1;

    // 상세 주소
    @Size(max = 100, message = "상세 주소는 100자 이하여야 합니다")
    @Column(name = "address2", length = 500)
    private String address2;

    @Column(name = "profile_image", length = 255)
    private String profileImage;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Builder.Default
    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @Column(name = "provider")
    private String provider;  // "google", "kakao", "naver" 등

    @Column(name = "provider_id")
    private String providerId;  // 소셜 로그인 제공자의 고유 ID
}
