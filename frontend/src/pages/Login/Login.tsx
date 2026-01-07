/**
 * Login Page Component
 * @description 로그인 페이지
 */

import React from 'react';
import { Link } from 'react-router-dom';
import LoginHero from './components/LoginHero/LoginHero';
import LoginForm from './components/LoginForm/LoginForm';
import SocialLogin from '@/components/auth/SocialLogin/SocialLogin';
import styles from './Login.module.css';

const Login: React.FC = () => {
  return (
    <main className={styles.siteMain}>
      {/* Hero Section */}
      <LoginHero />

      {/* Login Form Section */}
      <section className={styles.loginFormSection}>
        <div className={styles.container}>
          <div className={styles.loginCard}>
            <h2 className={styles.formTitle}>로그인</h2>
            <p className={styles.formSubtitle}>냉파고 계정으로 로그인하세요</p>

            {/* Login Form */}
            <LoginForm />

            {/* Additional Links */}
            <div className={styles.formFooter}>
              <Link to="/password-reset" className={styles.linkSecondary}>
                비밀번호 찾기
              </Link>
              <span className={styles.separator}>|</span>
              <Link to="/signup" className={styles.linkPrimary}>
                회원가입
              </Link>
            </div>

            {/* Social Login */}
            <SocialLogin />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
