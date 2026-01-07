import React, { useState } from 'react';
import type { Review } from '../../api/recipeReviewApi';
import type { User } from '../../types'; // User 타입 import
import { Pencil, Trash2 } from 'lucide-react'; // 아이콘 import 추가
import './ReviewItem.css'; // 새로운 CSS 파일 import

// 기본 프로필 이미지 URL (필요시 프로젝트에 맞는 실제 URL로 변경)
const DEFAULT_PROFILE_IMAGE = '/path/to/default/profile/image.png'; 

interface ReviewItemProps {
  review: Review;
  currentUser: User | null;
  onUpdate: (reviewId: number, data: { rating: number; content: string }) => void;
  onDelete: (reviewId: number) => void;
}

export const ReviewItem: React.FC<ReviewItemProps> = ({ review, currentUser, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(review.comment);
  const [editedRating, setEditedRating] = useState(review.rating);

  const isMine = currentUser?.userId === review.userId;

  const handleUpdate = () => {
    onUpdate(review.reviewId, { rating: editedRating, content: editedContent });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('정말로 이 후기를 삭제하시겠습니까?')) {
      onDelete(review.reviewId);
    }
  };

  return (
    <div className={`review-item ${isMine ? 'is-mine' : ''}`}>
      <div className="review-header">
        <div className="review-author">
          <div className="author-avatar">
            {review.profileImageUrl ? (
              <img 
                src={review.profileImageUrl} 
                alt={`${review.userNickname || `사용자 ${review.userId}`}의 프로필 사진`}
                onError={(e) => { e.currentTarget.src = DEFAULT_PROFILE_IMAGE; }}
              />
            ) : (
              review.userNickname ? review.userNickname.charAt(0) : 'U'
            )}
          </div>
          <span className="author-name">{review.userNickname || `사용자 ${review.userId}`}</span>
        </div>
        {isMine && !isEditing && (
          <div className="review-actions">
            <button onClick={() => setIsEditing(true)} title="수정">
              <Pencil size={18} /> 
            </button>
            <button onClick={handleDelete} title="삭제">
              <Trash2 size={18} /> 
            </button>
          </div>
        )}
      </div>

      <div className="review-rating">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={`star ${i < (isEditing ? editedRating : review.rating) ? 'filled' : ''} ${isEditing ? 'editable' : ''}`}
                onClick={() => isEditing && setEditedRating(i + 1)}>
            ★
          </span>
        ))}
      </div>
      
      {isEditing ? (
        <textarea 
          className="edit-textarea"
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
        />
      ) : (
        <p className="review-content">{review.comment}</p>
      )}

      {isEditing && (
        <div className="edit-actions">
          <button onClick={() => setIsEditing(false)}>취소</button>
          <button onClick={handleUpdate}>저장</button>
        </div>
      )}
    </div>
  );
};
