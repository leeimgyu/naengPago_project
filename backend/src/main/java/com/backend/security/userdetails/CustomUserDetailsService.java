package com.backend.security.userdetails;

import com.backend.entity.User;
import com.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Spring Security UserDetailsService 구현체
 *
 * - 사용자명(username 또는 email)으로 사용자 조회
 * - UserPrincipal로 변환하여 반환
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * 사용자명으로 사용자 조회
     * - username 또는 email로 조회 시도
     *
     * @param usernameOrEmail 사용자명 또는 이메일
     * @return UserDetails
     * @throws UsernameNotFoundException 사용자를 찾을 수 없는 경우
     */
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        log.debug("사용자 조회 시도: {}", usernameOrEmail);

        User user = userRepository.findByUsername(usernameOrEmail)
                .or(() -> userRepository.findByEmail(usernameOrEmail))
                .orElseThrow(() -> new UsernameNotFoundException(
                        "사용자를 찾을 수 없습니다: " + usernameOrEmail
                ));

        if (!user.getIsActive()) {
            throw new UsernameNotFoundException("비활성화된 계정입니다: " + usernameOrEmail);
        }

        if (user.getIsDeleted()) {
            throw new UsernameNotFoundException("삭제된 계정입니다: " + usernameOrEmail);
        }

        return UserPrincipal.create(user);
    }
}
