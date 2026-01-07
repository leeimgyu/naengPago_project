import React, { useState } from 'react';
import type { ApiComment } from '../../api/commentApi'; // type 키워드 추가
import type { User } from '../../types'; // User 타입 임포트 // type 키워드 추가
import { Pencil, Trash2 } from 'lucide-react'; // 아이콘 import
import './CommentItem.css'; // CommentItem 전용 CSS 파일

// 기본 프로필 이미지 URL (필요시 프로젝트에 맞는 실제 URL로 변경)
const DEFAULT_PROFILE_IMAGE = '/public/icon/person.png'; 

interface CommentItemProps {
  comment: ApiComment;
  currentUser: User | null;
  onUpdate: (commentId: number, content: string) => void;
  onDelete: (commentId: number) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment, currentUser, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  // 현재 사용자가 댓글 작성자인지 확인
  const isMine = currentUser?.userId === comment.userId;

  // 수정 버튼 클릭 핸들러
  const handleUpdate = () => {
    if (editedContent.trim() === '') {
      alert('댓글 내용을 입력해주세요.');
      return;
    }
    onUpdate(comment.commentId, editedContent);
    setIsEditing(false);
  };

  // 삭제 버튼 클릭 핸들러
  const handleDelete = () => {
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      onDelete(comment.commentId);
    }
  };

  // 날짜 포맷팅 함수 (선택 사항)
  const formatDateTime = (dateTimeString: string | undefined) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className={`comment-item ${isMine ? 'is-mine' : ''}`}>
      <div className="comment-header">
        <div className="comment-author">
          <div className="author-avatar">
            {comment.userProfileImage ? (
              <img 
                src={comment.userProfileImage} 
                alt={`${comment.userNickname || `사용자 ${comment.userId}`}의 프로필 사진`}
                onError={(e) => { e.currentTarget.src = DEFAULT_PROFILE_IMAGE; }}
              />
            ) : (
              // 닉네임이 없을 경우 'U' (Unknown) 표시, 있을 경우 첫 글자 표시
              comment.userNickname ? comment.userNickname.charAt(0) : 'U'
            )}
          </div>
          <span className="author-name">{comment.userNickname || `사용자 ${comment.userId}`}</span>
        </div>
        {isMine && !isEditing && ( // 내 댓글이고 수정 중이 아닐 때만 버튼 표시
          <div className="comment-actions">
            <button onClick={() => setIsEditing(true)} title="수정">
              <Pencil size={18} /> 
            </button>
            <button onClick={handleDelete} title="삭제">
              <Trash2 size={18} /> 
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <textarea 
          className="edit-textarea"
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          rows={3}
        />
      ) : (
        <p className="comment-content">{comment.content}</p>
      )}

      <div className="comment-footer">
        <span className="comment-date">작성일: {formatDateTime(comment.createdAt)}</span>
        {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
          <span className="comment-date"> (수정일: {formatDateTime(comment.updatedAt)})</span>
        )}
      </div>

      {isEditing && (
        <div className="edit-actions">
          <button 
            className="cancel-btn"
            onClick={() => {
              setIsEditing(false);
              setEditedContent(comment.content); // 수정 취소 시 원래 내용으로 복원
            }}>
            취소
          </button>
          <button className="save-btn" onClick={handleUpdate}>
            저장
          </button>
        </div>
      )}
    </div>
  );
};
