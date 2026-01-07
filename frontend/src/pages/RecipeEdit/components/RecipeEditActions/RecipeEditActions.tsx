import React from 'react';
import styles from './RecipeEditActions.module.css';

interface RecipeEditActionsProps {
  onCancel: () => void;
  onSave: () => void;
}

const RecipeEditActions: React.FC<RecipeEditActionsProps> = ({ onCancel, onSave }) => {
  return (
    <div className={styles.actionsContainer}>
      <div className={styles.actionsWrapper}>
        <button className={`${styles.button} ${styles.cancelButton}`} onClick={onCancel}>
          취소
        </button>
        <button className={`${styles.button} ${styles.confirmButton}`} onClick={onSave}>
          수정 완료
        </button>
      </div>
    </div>
  );
};

export default RecipeEditActions;
