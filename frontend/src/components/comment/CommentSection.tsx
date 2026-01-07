import React from 'react';
import { CommentList } from './CommentList';
import { CommentForm } from './CommentForm';
import './CommentSection.css';
import type { ApiComment } from '../../api/commentApi';
import type { User } from '../../types';
import { createComment, updateComment, deleteComment } from '../../api/commentApi';

interface CommentSectionProps {
  recipeId: number;
  currentUser: User | null;
  comments: ApiComment[];
  loading: boolean;
  error: string | null;
  setComments: React.Dispatch<React.SetStateAction<ApiComment[]>>;
  userHasCommented: boolean;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  recipeId,
  currentUser,
  comments,
  loading,
  error,
  setComments,
  userHasCommented,
}) => {
  const handleAddComment = async (content: string) => {
    if (!currentUser) {
      alert('로그인 후 댓글을 작성할 수 있습니다.');
      return;
    }
    try {
      console.log('💬 댓글 작성 시작 - recipeId:', recipeId, 'userId:', currentUser.userId, 'content:', content);
      const newComment = await createComment(recipeId, content);
      console.log('✅ 댓글 작성 성공:', newComment);
      const commentWithUserData: ApiComment = {
        ...newComment,
        userNickname: currentUser.username,
        userProfileImage: currentUser.profileImage || undefined,
      };
      setComments((prevComments) => [commentWithUserData, ...prevComments]);
    } catch (err) {
      alert('댓글 추가에 실패했습니다.');
      console.error('❌ 댓글 작성 실패:', err);
    }
  };

  const handleUpdateComment = async (commentId: number, newContent: string) => {
    if (!currentUser) {
      alert('로그인 후 댓글을 수정할 수 있습니다.');
      return;
    }
    try {
      const updatedComment = await updateComment(recipeId, commentId, newContent);
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.commentId === commentId
            ? { ...comment, content: updatedComment.content, updatedAt: updatedComment.updatedAt }
            : comment
        )
      );
    } catch (err) {
      alert('댓글 수정에 실패했습니다.');
      console.error('Failed to update comment:', err);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!currentUser) {
      alert('로그인 후 댓글을 삭제할 수 있습니다.');
      return;
    }
    if (window.confirm('이 댓글을 삭제하시겠습니까?')) {
      try {
        await deleteComment(recipeId, commentId);
        setComments((prevComments) => prevComments.filter((comment) => comment.commentId !== commentId));
      } catch (err) {
        alert('댓글 삭제에 실패했습니다.');
        console.error('Failed to delete comment:', err);
      }
    }
  };

  if (loading) {
    return <div className="comment-section">댓글 로딩 중...</div>;
  }

  if (error) {
    return <div className="comment-section error">{error}</div>;
  }

  return (
    <div className="comment-section">
      <div className="comment-section-header">
        <h2>댓글 ({comments.length})</h2>
      </div>

      {currentUser && !userHasCommented ? (
        <CommentForm onSubmit={handleAddComment} />
      ) : (
        currentUser && <p className="already-commented-message">이미 이 레시피에 대한 댓글을 작성하셨습니다.</p>
      )}

      <CommentList
        comments={comments}
        currentUser={currentUser}
        onUpdate={handleUpdateComment}
        onDelete={handleDeleteComment}
      />
    </div>
  );
};