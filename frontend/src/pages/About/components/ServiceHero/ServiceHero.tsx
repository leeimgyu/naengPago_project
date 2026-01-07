import React from 'react';
import styles from './ServiceHero.module.css';

const ServiceHero: React.FC = () => {
  return (
    <section className={styles.serviceHeroSection}>
      <div className={styles.heroOverlay}>
        <h2 className={styles.heroTitle}>How It Works</h2>
        <p className={styles.heroSubtitle}>
          냉파고 서비스 이용 가이드
        </p>
        <p className={styles.heroDescription}>
          4단계로 쉽게 시작하는 스마트한 요리 여정
        </p>
      </div>
    </section>
  );
};

export default ServiceHero;
