import React from 'react';
import styles from './ServicePreparationModal.module.css';

interface ServicePreparationModalProps {
  onClose: () => void;
}

export const ServicePreparationModal: React.FC<ServicePreparationModalProps> = ({ onClose }) => {
  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>알림</h2>
        <p className={styles.modalMessage}>주간레시피 준비 중입니다! 곧 만나요.</p>
        <div className={styles.modalActions}>
          <button onClick={onClose} className={styles.confirmButton}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
