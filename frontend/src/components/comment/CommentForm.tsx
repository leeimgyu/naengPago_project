import React, { useState } from 'react';
import './CommentForm.css';

interface CommentFormProps {
  onSubmit: (content: string) => void; // content만 받도록 변경
}

export const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onSubmit(content); // content만 전달

    setContent('');
    setIsFocused(false);
  };

  return (
    <div className="comment-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="레시피에 대한 의견을 남겨주세요..."
            rows={isFocused ? 3 : 2}
          />
        </div>

        {isFocused && (
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={() => {
                setIsFocused(false);
                setContent('');
              }}
            >
              취소
            </button>
            <button type="submit" className="submit-btn">
              댓글 등록
            </button>
          </div>
        )}
      </form>
    </div>
  );
};