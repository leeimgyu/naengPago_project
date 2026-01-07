import React from 'react';
import { useToast } from '../../../hooks/useToast';
import styles from './SocialLogin.module.css';

interface SocialLoginProps {
  signupMode?: boolean;
}

const SocialLogin: React.FC<SocialLoginProps> = () => {
  const { showToast } = useToast();

  const handleKakaoLogin = () => {
    console.log('카카오 로그인 시작');
    showToast('카카오 로그인 기능은 준비 중입니다.', 'info');
  };

  const handleNaverLogin = () => {
    console.log('네이버 로그인 시작');
    showToast('네이버 로그인 기능은 준비 중입니다.', 'info');
  };

  const handleGoogleLogin = () => {
    console.log('Google 로그인 시작');
    // 백엔드 OAuth 엔드포인트로 리다이렉트
    window.location.href = '/api/auth/oauth2/authorize/google';
  };

  return (
    <div className={styles.socialLogin}>
      <div className={styles.divider}>
        <span>또는</span>
      </div>
      <div className={styles.socialButtons}>
        <button
          type="button"
          className={`${styles.btnSocial} ${styles.btnKakao}`}
          aria-label="카카오로 로그인"
          onClick={handleKakaoLogin}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 0C4.477 0 0 3.58 0 8c0 2.86 1.91 5.37 4.78 6.76-.2.74-.64 2.47-.74 2.87-.11.47.17.46.37.33.16-.1 2.58-1.74 3.58-2.42.64.09 1.31.13 2.01.13 5.523 0 10-3.58 10-8S15.523 0 10 0z"
              fill="currentColor"
            />
          </svg>
          카카오로 로그인
        </button>
        <button
          type="button"
          className={`${styles.btnSocial} ${styles.btnNaver}`}
          aria-label="네이버로 로그인"
          onClick={handleNaverLogin}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M13.6 10.8L6.4 0H0v20h6.4V9.2L13.6 20H20V0h-6.4v10.8z"
              fill="currentColor"
            />
          </svg>
          네이버로 로그인
        </button>
        <button
          type="button"
          className={`${styles.btnSocial} ${styles.btnGoogle}`}
          aria-label="Google로 로그인"
          onClick={handleGoogleLogin}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z"
              fill="#4285F4"
            />
            <path
              d="M13.46 15.13c-.56.38-1.28.62-2.46.62-1.89 0-3.49-1.25-4.06-2.98H3.53v2.52C5.07 17.92 7.36 19 10 19c2.43 0 4.47-.79 5.96-2.18l-2.5-1.69z"
              fill="#34A853"
            />
            <path
              d="M3.99 10c0-.39.07-.77.16-1.13V6.35H.72C.26 7.28 0 8.11 0 10s.26 2.72.72 3.65h3.43V11.13c-.09-.36-.16-.74-.16-1.13z"
              fill="#FBBC05"
            />
            <path
              d="M10 3.88c1.32 0 2.36.57 2.91 1.04l2.19-2.19C13.46 1.45 11.43.62 10 .62 7.36.62 5.07 1.7 3.53 4.33v2.52h3.41c.57-1.73 2.17-2.97 4.06-2.97z"
              fill="#EA4335"
            />
          </svg>
          Google로 로그인
        </button>
      </div>
    </div>
  );
};

export default SocialLogin;
