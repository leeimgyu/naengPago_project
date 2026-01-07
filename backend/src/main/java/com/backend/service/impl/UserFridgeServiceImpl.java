package com.backend.service.impl;

import com.backend.dto.AddFridgeItemRequestDTO;
import com.backend.dto.UpdateFridgeItemRequestDTO;
import com.backend.dto.UserFridgeDTO;
import com.backend.entity.User;
import com.backend.entity.UserFridge;
import com.backend.repository.UserFridgeRepository;
import com.backend.repository.UserRepository;
import com.backend.service.UserFridgeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 사용자 냉장고 서비스 구현
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserFridgeServiceImpl implements UserFridgeService {

    private final UserFridgeRepository userFridgeRepository;
    private final UserRepository userRepository;

    /**
     * 사용자의 모든 냉장고 재료 조회
     */
    @Override
    @Transactional(readOnly = true)
    public List<UserFridgeDTO> getAllFridgeItems(Integer userId) {
        log.info("사용자 냉장고 재료 조회: userId={}", userId);

        List<UserFridge> fridgeItems = userFridgeRepository.findByUser_UserId(userId);
        log.info("조회된 재료 개수: {}", fridgeItems.size());

        return fridgeItems.stream()
                .map(this::toUserFridgeDTO)
                .collect(Collectors.toList());
    }

    /**
     * 사용자의 카테고리별 재료 조회
     */
    @Override
    @Transactional(readOnly = true)
    public List<UserFridgeDTO> getFridgeItemsByCategory(Integer userId, String category) {
        log.info("카테고리별 냉장고 재료 조회: userId={}, category={}", userId, category);

        List<UserFridge> fridgeItems = userFridgeRepository.findByUser_UserIdAndCategory(userId, category);
        log.info("조회된 재료 개수: {}", fridgeItems.size());

        return fridgeItems.stream()
                .map(this::toUserFridgeDTO)
                .collect(Collectors.toList());
    }

    /**
     * 냉장고 재료 추가
     */
    @Override
    @Transactional
    public UserFridgeDTO addFridgeItem(Integer userId, AddFridgeItemRequestDTO request) {
        log.info("냉장고 재료 추가: userId={}, name={}", userId, request.getName());

        // 사용자 조회
        User user = userRepository.findByUserIdAndIsActiveTrueAndIsDeletedFalse(userId)
                .orElseThrow(() -> {
                    log.warn("사용자 조회 실패: userId={}", userId);
                    return new UsernameNotFoundException("사용자를 찾을 수 없습니다.");
                });

        // UserFridge 엔티티 생성
        UserFridge fridgeItem = UserFridge.builder()
                .user(user)
                .name(request.getName())
                .quantity(request.getQuantity())
                .category(request.getCategory())
                .expiryDate(request.getExpiryDate())
                .build();

        // 저장
        UserFridge savedItem = userFridgeRepository.save(fridgeItem);
        log.info("냉장고 재료 추가 성공: fridgeId={}", savedItem.getFridgeId());

        return toUserFridgeDTO(savedItem);
    }

    /**
     * 냉장고 재료 수정
     */
    @Override
    @Transactional
    public UserFridgeDTO updateFridgeItem(Integer userId, Integer fridgeId, UpdateFridgeItemRequestDTO request) {
        log.info("냉장고 재료 수정: userId={}, fridgeId={}", userId, fridgeId);

        // 재료 조회
        UserFridge fridgeItem = userFridgeRepository.findByFridgeIdAndUser_UserId(fridgeId, userId)
                .orElseThrow(() -> {
                    log.warn("냉장고 재료 조회 실패: fridgeId={}, userId={}", fridgeId, userId);
                    return new IllegalArgumentException("재료를 찾을 수 없습니다.");
                });

        // 재료명 수정
        if (request.getName() != null && !request.getName().isBlank()) {
            fridgeItem.setName(request.getName());
        }

        // 수량 수정
        if (request.getQuantity() != null) {
            fridgeItem.setQuantity(request.getQuantity());
        }

        // 카테고리 수정
        if (request.getCategory() != null && !request.getCategory().isBlank()) {
            fridgeItem.setCategory(request.getCategory());
        }

        // 유통기한 수정
        if (request.getExpiryDate() != null) {
            fridgeItem.setExpiryDate(request.getExpiryDate());
        }

        // 저장
        UserFridge updatedItem = userFridgeRepository.save(fridgeItem);
        log.info("냉장고 재료 수정 성공: fridgeId={}", updatedItem.getFridgeId());

        return toUserFridgeDTO(updatedItem);
    }

    /**
     * 냉장고 재료 삭제
     */
    @Override
    @Transactional
    public void deleteFridgeItem(Integer userId, Integer fridgeId) {
        log.info("냉장고 재료 삭제: userId={}, fridgeId={}", userId, fridgeId);

        // 재료 존재 여부 확인
        UserFridge fridgeItem = userFridgeRepository.findByFridgeIdAndUser_UserId(fridgeId, userId)
                .orElseThrow(() -> {
                    log.warn("냉장고 재료 조회 실패: fridgeId={}, userId={}", fridgeId, userId);
                    return new IllegalArgumentException("재료를 찾을 수 없습니다.");
                });

        // 삭제
        userFridgeRepository.delete(fridgeItem);
        log.info("냉장고 재료 삭제 성공: fridgeId={}", fridgeId);
    }

    /**
     * UserFridge 엔티티를 UserFridgeDTO로 변환
     */
    private UserFridgeDTO toUserFridgeDTO(UserFridge fridgeItem) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        try {
            return UserFridgeDTO.builder()
                    .id(fridgeItem.getFridgeId())
                    .name(fridgeItem.getName())
                    .quantity(fridgeItem.getQuantity())
                    .category(fridgeItem.getCategory())
                    .expiryDate(fridgeItem.getExpiryDate() != null
                            ? fridgeItem.getExpiryDate().format(formatter)
                            : null)
                    .addedAt(fridgeItem.getCreatedAt() != null
                            ? fridgeItem.getCreatedAt().format(formatter)
                            : null)
                    .build();
        } catch (Exception e) {
            log.error("UserFridge -> UserFridgeDTO 변환 실패: fridgeId={}, error={}",
                    fridgeItem.getFridgeId(), e.getMessage(), e);
            throw new RuntimeException("재료 정보 변환 중 오류가 발생했습니다.", e);
        }
    }
}
