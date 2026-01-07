package com.backend.repository;

import com.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * User 엔티티 리포지토리
 */
@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    /**
     * 이메일로 사용자 조회
     *
     * @param email 이메일
     * @return Optional<User>
     */
    Optional<User> findByEmail(String email);

    /**
     * 사용자명으로 사용자 조회
     *
     * @param username 사용자명
     * @return Optional<User>
     */
    Optional<User> findByUsername(String username);

    /**
     * 이메일 존재 여부 확인
     *
     * @param email 이메일
     * @return 존재하면 true
     */
    boolean existsByEmail(String email);

    /**
     * 사용자명 존재 여부 확인
     *
     * @param username 사용자명
     * @return 존재하면 true
     */
    boolean existsByUsername(String username);

    /**
     * 활성 사용자 중 사용자명 존재 여부 확인
     *
     * @param username 사용자명
     * @return 존재하면 true
     */
    boolean existsByUsernameAndIsActiveTrueAndIsDeletedFalse(String username);

    /**
     * userId로 활성 사용자 조회
     *
     * @param userId 사용자 ID
     * @return Optional<User>
     */
    Optional<User> findByUserIdAndIsActiveTrueAndIsDeletedFalse(Integer userId);

    /**
     * OAuth provider와 providerId로 사용자 조회
     *
     * @param provider OAuth 제공자 (google, kakao, naver)
     * @param providerId OAuth 제공자의 사용자 고유 ID
     * @return Optional<User>
     */
    Optional<User> findByProviderAndProviderId(String provider, String providerId);
}
