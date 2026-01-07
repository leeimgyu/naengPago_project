import React from 'react';
import styles from './RecipeRegisterActions.module.css';

interface RecipeRegisterActionsProps {
  onCancel: () => void;
  onRegister: () => void;
  isSubmitting?: boolean;
}

const RecipeRegisterActions: React.FC<RecipeRegisterActionsProps> = ({
  onCancel,
  onRegister,
  isSubmitting = false
}) => {
  return (
    <div className={styles.actionsContainer}>
      <div className={styles.actionsWrapper}>
        <button
          className={`${styles.button} ${styles.cancelButton}`}
          onClick={onCancel}
          disabled={isSubmitting}
        >
          취소
        </button>
        <button
          className={`${styles.button} ${styles.confirmButton}`}
          onClick={onRegister}
          disabled={isSubmitting}
        >
          {isSubmitting ? '등록 중...' : '등록하기'}
        </button>
      </div>
    </div>
  );
};

export default RecipeRegisterActions;