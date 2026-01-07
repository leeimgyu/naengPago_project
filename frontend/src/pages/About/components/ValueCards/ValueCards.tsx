/**
 * Value Cards Component
 * @description 냉파고의 미래가치와 솔루션을 보여주는 카드 섹션
 */

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ValueCards.module.css';

interface ValueCard {
  id: number;
  title: string;
  description: string;
}

const valueData: ValueCard[] = [
  {
    id: 1,
    title: '지속가능한 식문화',
    description: '냉장고 속 재료를 현명하게 활용하여 음식물 쓰레기를 최소화하고, 환경을 생각하는 건강한 식문화를 만들어갑니다.'
  },
  {
    id: 2,
    title: 'AI 기반 레시피 추천',
    description: '인공지능이 당신의 냉장고 재료를 분석하여 최적의 레시피를 추천합니다. 매번 새로운 요리의 즐거움을 경험하세요.'
  },
  {
    id: 3,
    title: '스마트 재료 관리',
    description: '유통기한 관리부터 재료 소진 알림까지, 냉장고 속 재료를 똑똑하게 관리하여 낭비를 줄이고 효율성을 높입니다.'
  },
  {
    id: 4,
    title: '맞춤형 요리 가이드',
    description: '초보부터 전문가까지, 수준별 맞춤 레시피와 단계별 가이드로 누구나 쉽게 따라할 수 있는 요리 경험을 제공합니다.'
  },
  {
    id: 5,
    title: '가족 건강 관리',
    description: '가족 구성원의 알레르기, 선호도, 영양 정보를 고려한 건강한 식단을 제안하여 온 가족의 건강을 책임집니다.'
  },
  {
    id: 6,
    title: '글로벌 레시피 공유',
    description: '전 세계 사용자들과 레시피를 공유하고, 다양한 문화의 요리를 경험하며, 함께 성장하는 글로벌 커뮤니티를 만듭니다.'
  }
];

const ValueCards: React.FC = () => {
  return (
    <section className={styles.valueCardsSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            냉파고가 만들어가는
            <br />
            <span className={styles.highlight}>더 나은 내일</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            우리는 단순한 레시피 서비스를 넘어, 지속가능하고 건강한 식문화를 만들어갑니다.
          </p>
        </div>

        <div className={styles.cardsGrid}>
          {valueData.map((card, index) => (
            <div
              key={card.id}
              className={styles.valueCard}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardDescription}>{card.description}</p>
              <div className={styles.cardAccent}></div>
            </div>
          ))}
        </div>

        <div className={styles.ctaSection}>
          <h3 className={styles.ctaTitle}>냉파고와 함께 시작하세요</h3>
          <p className={styles.ctaText}>
            지금 바로 가입하고 냉장고 속 재료로 만드는 맛있는 요리를 경험해보세요.
          </p>
          <div className={styles.ctaButtons}>
            <Link to="/signup" className={styles.btnPrimary}>
              무료로 시작하기
            </Link>
            <Link to="/" className={styles.btnSecondary}>
              서비스 둘러보기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueCards;
