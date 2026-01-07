import React from 'react';
import { ReviewList } from './ReviewList';
import { ReviewForm } from './ReviewForm';
import './ReviewSection.css';
import type { Review } from '../../api/recipeReviewApi';
import type { User } from '../../types';

interface ReviewSectionProps {
  reviews: Review[];
  onAddReview: (review: { rating: number; content: string }) => void;
  currentUser: User | null;
  onUpdate: (reviewId: number, data: { rating: number; content: string }) => void;
  onDelete: (reviewId: number) => void;
  userHasReviewed: boolean;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  reviews,
  onAddReview,
  currentUser,
  onUpdate,
  onDelete,
  userHasReviewed
}) => {
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="review-section">
      <div className="review-section-header">
        <h2>요리 후기</h2>
        <div className="review-stats">
          <span className="rating-stars">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={i < Math.round(parseFloat(averageRating)) ? 'filled' : 'empty'}>
                ★
              </span>
            ))}
          </span>
          <span className="rating-score">{averageRating} ({reviews.length})</span>
        </div>
      </div>
      
      {!userHasReviewed ? (
        <ReviewForm 
          onSubmit={onAddReview}
          onCancel={() => {}}
        />
      ) : (
        <p className="already-reviewed-message">이미 이 레시피에 대한 리뷰를 작성하셨습니다.</p>
      )}

      <ReviewList 
        reviews={reviews}
        currentUser={currentUser}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </div>
  );
};
