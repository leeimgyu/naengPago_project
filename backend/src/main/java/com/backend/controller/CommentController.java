package com.backend.controller;

import com.backend.dto.CommentDTO;
import com.backend.security.userdetails.UserPrincipal;
import com.backend.service.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CommentController {

  private final CommentService commentService;

  // 특정 레시피에 댓글 생성
  @PostMapping("/recipes/{recipeId}/comments")
  public ResponseEntity<CommentDTO> createComment(
      @PathVariable Integer recipeId,
      @AuthenticationPrincipal UserPrincipal userPrincipal,
      @RequestBody CommentDTO commentDTO) {
    if (userPrincipal == null) {
      log.warn("댓글 생성 요청: 인증되지 않은 사용자");
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    log.info("댓글 생성 요청 - recipeId: {}, userId: {}", recipeId, userPrincipal.getId());
    CommentDTO createdComment = commentService.createComment(recipeId, userPrincipal.getId(), commentDTO);
    return ResponseEntity.status(HttpStatus.CREATED).body(createdComment);
  }

  // 특정 레시피의 댓글 목록 조회
  @GetMapping("/recipes/{recipeId}/comments")
  public ResponseEntity<List<CommentDTO>> getCommentsByRecipeId(@PathVariable Integer recipeId) {
    log.info("댓글 목록 조회 요청 - recipeId: {}", recipeId);
    List<CommentDTO> comments = commentService.getCommentsByRecipeId(recipeId);
    return ResponseEntity.ok(comments);
  }

  // 특정 사용자가 작성한 댓글 목록 조회
  @GetMapping("/comments/user/{userId}")
  public ResponseEntity<List<CommentDTO>> getCommentsByUserId(@PathVariable("userId") Integer userId, @AuthenticationPrincipal UserPrincipal userPrincipal) {
    // 본인 또는 관리자만 조회가 가능하도록 하는 로직을 추가할 수 있습니다.
    // 예: if (!userPrincipal.getId().equals(userId) && !userPrincipal.isAdmin()) { return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); }
    log.info("사용자 댓글 목록 조회 요청 - userId: {}", userId);
    List<CommentDTO> comments = commentService.getCommentsByUserId(userId);
    return ResponseEntity.ok(comments);
  }


  // 댓글 수정
  @PutMapping("/recipes/{recipeId}/comments/{commentId}")
  public ResponseEntity<CommentDTO> updateComment(
      @PathVariable Integer recipeId,
      @PathVariable Long commentId,
      @AuthenticationPrincipal UserPrincipal userPrincipal,
      @RequestBody CommentDTO commentDTO) {
    if (userPrincipal == null) {
      log.warn("댓글 수정 요청: 인증되지 않은 사용자");
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    log.info("댓글 수정 요청 - commentId: {}, userId: {}", commentId, userPrincipal.getId());
    try {
      CommentDTO updatedComment = commentService.updateComment(commentId, userPrincipal.getId(), commentDTO);
      return ResponseEntity.ok(updatedComment);
    } catch (SecurityException e) {
      log.warn("댓글 수정 권한 없음: commentId: {}, userId: {}", commentId, userPrincipal.getId());
      return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    } catch (IllegalArgumentException e) {
      log.warn("댓글 수정 실패: {}", e.getMessage());
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
  }

  // 댓글 삭제
  @DeleteMapping("/recipes/{recipeId}/comments/{commentId}")
  public ResponseEntity<Void> deleteComment(
      @PathVariable Integer recipeId,
      @PathVariable Long commentId,
      @AuthenticationPrincipal UserPrincipal userPrincipal) {
    if (userPrincipal == null) {
      log.warn("댓글 삭제 요청: 인증되지 않은 사용자");
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    log.info("댓글 삭제 요청 - commentId: {}, userId: {}", commentId, userPrincipal.getId());
    try {
      commentService.deleteComment(commentId, userPrincipal.getId());
      return ResponseEntity.noContent().build();
    } catch (SecurityException e) {
      log.warn("댓글 삭제 권한 없음: commentId: {}, userId: {}", commentId, userPrincipal.getId());
      return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    } catch (IllegalArgumentException e) {
      log.warn("댓글 삭제 실패: {}", e.getMessage());
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
  }
}