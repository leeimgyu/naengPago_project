/**
 * Login Hero Component
 * @description 로그인 페이지 히어로 섹션
 */

import React from 'react';
import styles from './LoginHero.module.css';

const LoginHero: React.FC = () => {
  return (
    <section className={styles.loginHeroSection}>
      <div className={styles.heroOverlay}>
        <h2>만나서 반가워요</h2>
        <p>냉파고와 함께하는 요리 생활</p>
      </div>
    </section>
  );
};

export default LoginHero;
