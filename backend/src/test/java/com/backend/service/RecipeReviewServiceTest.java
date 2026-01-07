package com.backend.service;

import com.backend.dto.recipeReview.RecipeReviewRequestDTO;
import com.backend.entity.RecipeReview;
import com.backend.repository.RecipeReviewRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional // 테스트 후 롤백을 위해 추가
class RecipeReviewServiceTest {

    @Autowired
    private RecipeReviewService recipeReviewService;

    @Autowired
    private RecipeReviewRepository recipeReviewRepository;

    @Test
    @DisplayName("리뷰 생성 테스트: DTO를 사용하여 리뷰를 생성하고 DB에 저장되는지 확인한다.")
    void createReviewAndVerifyInDb() {
        // given: 테스트를 위한 데이터 준비
        long recipeId = 2L;
        Integer userId = 3;
        int rating = 5;
        String comment = "테스트용 리뷰입니다. 정말 맛있어요!";

        RecipeReviewRequestDTO requestDTO = RecipeReviewRequestDTO.builder()
                .recipeId(recipeId)
                .userId(userId)
                .rating(rating)
                .comment(comment)
                .build();

        // when: 서비스의 createReview 메서드 호출
        RecipeReview savedReview = recipeReviewService.createReview(requestDTO);

        // then: 반환된 객체 및 DB 저장 결과 검증
        assertNotNull(savedReview, "저장된 리뷰 객체는 null이 아니어야 합니다.");
        assertNotNull(savedReview.getReviewId(), "저장된 리뷰는 ID를 가져야 합니다.");

        // Repository를 통해 DB에서 다시 조회하여 검증
        RecipeReview foundReview = recipeReviewRepository.findById(savedReview.getReviewId())
                .orElseThrow(() -> new AssertionError("DB에서 해당 ID의 리뷰를 찾을 수 없습니다."));

        assertEquals(recipeId, foundReview.getRecipeId(), "저장된 recipeId가 요청과 일치해야 합니다.");
        assertEquals(userId, foundReview.getUserId(), "저장된 userId가 요청과 일치해야 합니다.");
        assertEquals(rating, foundReview.getRating(), "저장된 rating이 요청과 일치해야 합니다.");
        assertEquals(comment, foundReview.getComment(), "저장된 comment가 요청과 일치해야 합니다.");
        
        System.out.println("테스트 성공: 서비스 계층을 통한 리뷰가 DB에 정상적으로 저장되었습니다. ID: " + foundReview.getReviewId());
    }

    @Test
    @DisplayName("리뷰 직접 저장 테스트: 엔티티를 직접 생성하여 Repository를 통해 DB에 저장되는지 확인한다.")
    void createReviewDirectlyByRepository() {
        // given: 테스트를 위한 엔티티 직접 생성
        long recipeId = 1L; // 다른 ID 사용
        Integer userId = 119;   // 다른 ID 사용
        int rating = 4;
        String comment = "리포지토리 직접 테스트용 리뷰입니다.";

        RecipeReview review = RecipeReview.builder()
                .recipeId(recipeId)
                .userId(userId)
                .rating(rating)
                .comment(comment)
                .build();

        // when: Repository를 통해 엔티티 저장
        RecipeReview savedReview = recipeReviewRepository.save(review);

        // then: 반환된 객체 및 DB 저장 결과 검증
        assertNotNull(savedReview, "저장된 리뷰 객체는 null이 아니어야 합니다.");
        assertNotNull(savedReview.getReviewId(), "저장된 리뷰는 ID를 가져야 합니다.");

        // DB에서 다시 조회하여 검증
        RecipeReview foundReview = recipeReviewRepository.findById(savedReview.getReviewId())
                .orElseThrow(() -> new AssertionError("DB에서 해당 ID의 리뷰를 찾을 수 없습니다."));

        assertEquals(recipeId, foundReview.getRecipeId(), "저장된 recipeId가 요청과 일치해야 합니다.");
        assertEquals(userId, foundReview.getUserId(), "저장된 userId가 요청과 일치해야 합니다.");
        assertEquals(rating, foundReview.getRating(), "저장된 rating이 요청과 일치해야 합니다.");
        assertEquals(comment, foundReview.getComment(), "저장된 comment가 요청과 일치해야 합니다.");
        
        System.out.println("테스트 성공: 리포지토리를 통한 리뷰가 DB에 정상적으로 저장되었습니다. ID: " + foundReview.getReviewId());
    }
}
