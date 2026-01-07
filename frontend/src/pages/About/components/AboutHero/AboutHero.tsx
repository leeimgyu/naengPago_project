import React from 'react';
import styles from './AboutHero.module.css';
import CeoImage from '@/assets/image/about/ceo-image.jpg';

const AboutHero: React.FC = () => {
  return (
    <section className={styles.aboutHeroSection}>
      <div className={styles.heroContainer}>
        {/* 좌측: CEO 이미지 */}
        <div className={styles.imageSection}>
          <div className={styles.imageWrapper}>
            <img
              src={CeoImage}
              alt="냉파고 대표"
              className={styles.ceoImage}
            />
            <div className={styles.imageOverlay}>
              <h3 className={styles.ceoName}>정재헌</h3>
              <p className={styles.ceoTitle}>대표이사 / CEO</p>
            </div>
          </div>
        </div>

        {/* 우측: 인사말 텍스트 */}
        <div className={styles.greetingSection}>
          <h2 className={styles.greetingTitle}>
            안녕하세요,
            <br />
            <span className={styles.highlight}>냉파고</span>를 찾아주셔서 감사합니다.
          </h2>

          <div className={styles.greetingText}>
            <p>
              우리 모두는 때때로 냉장고를 열어보며 "오늘은 뭘 먹지?"라는 고민에 빠집니다.
              냉파고는 바로 이 순간을 위해 탄생했습니다.
            </p>

            <p>
              냉장고 속 재료만으로도 맛있는 요리를 만들 수 있다는 믿음으로,
              우리는 AI 기반의 레시피 추천 서비스를 시작했습니다.
            </p>

            <p>
              냉파고는 단순한 레시피 검색을 넘어, 여러분의 식생활 파트너가 되고자 합니다.
              냉장고 속 재료를 현명하게 활용하고, 음식물 쓰레기를 줄이며,
              건강하고 지속가능한 식문화를 만들어가는 것이 우리의 목표입니다.
            </p>

            <p>
              매일매일 새로운 요리의 즐거움을 발견하고,
              소중한 가족과 친구들과 함께 나누는 행복한 식탁을 만들어보세요.
              앞으로도 냉파고는 여러분의 주방에서 가장 든든한 동반자가 되겠습니다.
              여러분의 소중한 의견과 응원을 기다립니다.
            </p>

            <p className={styles.signature}>
              감사합니다.
              <br />
              <strong>냉파고 대표이사 정재헌</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
