import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ModalProps } from '@/types';
import styles from './SuccessModal.module.css';

interface SuccessModalProps extends Omit<ModalProps, 'children'> {
  autoRedirect?: boolean;
  redirectDelay?: number;
}  

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  autoRedirect = true,
  redirectDelay = 3000
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && autoRedirect) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, redirectDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoRedirect, redirectDelay, navigate]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.modal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={styles.modalContent}>
        <div className={`${styles.modalIcon} ${styles.success}`}>
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <circle cx="30" cy="30" r="28" stroke="#4caf50" strokeWidth="4" />
            <path
              d="M18 30l8 8 16-16"
              stroke="#4caf50"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 id="modal-title">회원가입 완료!</h3>
        <p>냉파고의 회원이 되신 것을 환영합니다.</p>
        <button
          type="button"
          className={styles.btnModal}
          onClick={() => navigate('/login')}
        >
          로그인하러 가기
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
