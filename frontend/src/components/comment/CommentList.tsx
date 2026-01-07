import React from 'react';
import { CommentItem } from './CommentItem'; // CommentItem 임포트
import type { ApiComment } from '../../api/commentApi'; // type 키워드 추가
import type { User } from '../../types'; // User 타입 임포트 // type 키워드 추가
import './CommentList.css';

interface CommentListProps {
  comments: ApiComment[];
  currentUser: User | null;
  onUpdate: (commentId: number, content: string) => void;
  onDelete: (commentId: number) => void;
}

export const CommentList: React.FC<CommentListProps> = ({ comments, currentUser, onUpdate, onDelete }) => {
  if (comments.length === 0) {
    return <div className="no-comments">아직 작성된 댓글이 없습니다.</div>;
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <CommentItem
          key={comment.commentId}
          comment={comment}
          currentUser={currentUser}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};