/**
 * Contact Hero Component
 * @description Contact Us 페이지의 히어로 섹션
 */

import React from 'react';
import styles from './ContactHero.module.css';

const ContactHero: React.FC = () => {
  return (
    <section className={styles.contactHeroSection}>
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            무엇을 <span className={styles.highlight}>도와드릴까요</span>?
          </h1>
          <p className={styles.heroSubtitle}>
            냉파고 고객센터에서는 항상 여러분의 의견을 기다리고 있습니다.
            <br />
            문의사항이나 궁금한 점이 있으시면 언제든지 연락해주세요.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;
