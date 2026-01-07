/**
 * Signup Hero Component
 * @description 회원가입 페이지 히어로 섹션
 */

import React from 'react';
import styles from './SignupHero.module.css';

const SignupHero: React.FC = () => {
  return (
    <section className={styles.signupHeroSection}>
      <div className={styles.heroOverlay}>
        <h2>냉파고와 함께 시작하세요</h2>
        <p>냉장고 속 재료로 만드는 스마트한 요리 여정</p>
      </div>
    </section>
  );
};

export default SignupHero;
