package com.backend.repository;

import com.backend.entity.UserFridge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 사용자 냉장고 Repository
 */
@Repository
public interface UserFridgeRepository extends JpaRepository<UserFridge, Integer> {

    /**
     * 특정 사용자의 모든 냉장고 재료 조회
     *
     * @param userId 사용자 ID
     * @return 재료 목록
     */
    List<UserFridge> findByUser_UserId(Integer userId);

    /**
     * 특정 사용자의 특정 재료 조회
     *
     * @param fridgeId 냉장고 재료 ID
     * @param userId   사용자 ID
     * @return 재료 정보
     */
    Optional<UserFridge> findByFridgeIdAndUser_UserId(Integer fridgeId, Integer userId);

    /**
     * 특정 사용자의 카테고리별 재료 조회
     *
     * @param userId   사용자 ID
     * @param category 카테고리
     * @return 재료 목록
     */
    List<UserFridge> findByUser_UserIdAndCategory(Integer userId, String category);

    /**
     * 특정 사용자의 재료 삭제
     *
     * @param fridgeId 냉장고 재료 ID
     * @param userId   사용자 ID
     */
    void deleteByFridgeIdAndUser_UserId(Integer fridgeId, Integer userId);
}

