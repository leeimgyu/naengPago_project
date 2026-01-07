import React, { useState } from 'react';
import './ReviewForm.css';

interface ReviewFormProps {
  onSubmit: (review: { rating: number; content: string }) => void;
  onCancel: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onSubmit({
      rating,
      content
    });

    setContent('');
    setRating(5);
    setIsFocused(false);
  };

  return (
    <div className="review-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="요리 후기를 남겨보세요..."
            rows={isFocused ? 4 : 2}
          />
        </div>

        {isFocused && (
          <>
            <div className="form-group">
              <div className="rating-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`rating-star ${star <= rating ? 'filled' : ''}`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={() => {
                  setIsFocused(false);
                  setContent('');
                  setRating(5);
                }}
              >
                취소
              </button>
              <button type="submit" className="submit-btn">
                후기 등록
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};
