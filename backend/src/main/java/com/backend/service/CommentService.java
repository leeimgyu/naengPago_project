package com.backend.service;

import com.backend.dto.CommentDTO;

import java.util.List;

public interface CommentService {
  // 댓글 생성
  CommentDTO createComment(Integer recipeId, Integer userId, CommentDTO commentDTO);

  // 댓글 수정
  CommentDTO updateComment(Long commentId, Integer userId, CommentDTO commentDTO);

  // 댓글 삭제
  void deleteComment(Long commentId, Integer userId);

  // 특정 레시피의 댓글 목록 조회
  List<CommentDTO> getCommentsByRecipeId(Integer recipeId);
  List<CommentDTO> getCommentsByUserId(Integer userId);

}

