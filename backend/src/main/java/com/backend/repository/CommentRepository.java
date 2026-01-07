package com.backend.repository;

import com.backend.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    // 특정 레시피의 댓글 목록 조회 (최신순) - JOIN FETCH 추가
    @Query("""
        SELECT c
        FROM Comment c
        JOIN FETCH c.recipe
        WHERE c.recipe.id = :recipeId
        ORDER BY c.createdAt DESC
        """)
    List<Comment> findByRecipe_IdOrderByCreatedAtDesc(@Param("recipeId") Integer recipeId);

    /**
     * 특정 사용자의 댓글 목록 조회 (최신순) - JOIN FETCH 추가
     *
     * @param userId 사용자 ID
     * @return 해당 사용자의 댓글 목록
     */
    @Query("""
        SELECT c
        FROM Comment c
        JOIN FETCH c.recipe
        WHERE c.userId = :userId
        ORDER BY c.createdAt DESC
        """)
    List<Comment> findByUserIdOrderByCreatedAtDesc(@Param("userId") Integer userId);

}
