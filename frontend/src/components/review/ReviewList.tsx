import React from 'react';
import { ReviewItem } from './ReviewItem'; // ReviewItem import
import type { Review } from '../../api/recipeReviewApi';
import type { User } from '../../types';
import './ReviewList.css';

interface ReviewListProps {
  reviews: Review[];
  currentUser: User | null;
  onUpdate: (reviewId: number, data: { rating: number; content: string }) => void;
  onDelete: (reviewId: number) => void;
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews, currentUser, onUpdate, onDelete }) => {
  if (reviews.length === 0) {
    return <div className="no-reviews">현재 등록된 리뷰가 없습니다.</div>;
  }

  return (
    <div className="review-list">
      {reviews.map((review) => (
        <ReviewItem
          key={review.reviewId}
          review={review}
          currentUser={currentUser}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
