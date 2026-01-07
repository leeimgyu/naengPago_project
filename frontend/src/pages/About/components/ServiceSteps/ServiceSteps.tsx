import React from 'react';
import styles from './ServiceSteps.module.css';

// 이미지 import
import step1Image from '@/assets/image/service/sign.png';
import step2Image from '@/assets/image/service/recipe.png';
import step3Image from '@/assets/image/service/main.png';
import step4Image from '@/assets/image/service/User.png';

interface ServiceStep {
  id: number;
  number: string;
  title: string;
  description: string;
  details: string[];
  imagePath: string;
  imageAlt: string;
}

const stepsData: ServiceStep[] = [
  {
    id: 1,
    number: 'STEP 01',
    title: '회원가입 및 로그인',
    description: '간편하게 시작하는 첫 단계',
    details: [
      '이메일 또는 소셜 계정으로 간편 가입',
      'AI 사진 인식으로 자동 재료 등록'
    ],
    imagePath: step1Image,
    imageAlt: '회원가입 및 등록'
  },
  {
    id: 2,
    number: 'STEP 02',
    title: '재료 등록',
    description: '내 냉장고 맞춤 레시피',
    details: [
      '등록된 재료 기반 최적 레시피 추천',
      '개인 취향과 알레르기 정보 반영'
    ],
    imagePath: step2Image,
    imageAlt: 'AI 추천'
  },
  {
    id: 3,
    number: 'STEP 03',
    title: '요리 시작 하기',
    description: '단계별 가이드로 쉽게',
    details: [
      '사진과 함께하는 단계별 조리 가이드',
      '타이머 기능으로 정확한 조리 시간 관리'
    ],
    imagePath: step3Image,
    imageAlt: '요리하기'
  },
  {
    id: 4,
    number: 'STEP 04',
    title: '사용자 간의 요리 소통',
    description: '경험을 나누고 성장하기',
    details: [
      '댓글로 나누는 요리 소통',
      '별점과 후기로 레시피 평가'
    ],
    imagePath: step4Image,
    imageAlt: '평가 및 공유'
  }
];

const ServiceSteps: React.FC = () => {
  return (
    <section className={styles.stepsSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>서비스 이용 방법</h2>
          <p className={styles.sectionSubtitle}>
            4단계로 쉽게 시작하는 냉파고 서비스
          </p>
        </div>

        <div className={styles.stepsContainer}>
          {stepsData.map((step, index) => (
            <div
              key={step.id}
              className={styles.stepItem}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className={styles.stepHeader}>
                <div className={styles.stepNumber}>{step.number}</div>
              </div>

              <div className={styles.stepContent}>
                <div className={styles.imageWrapper}>
                  <img
                    src={step.imagePath}
                    alt={step.imageAlt}
                    className={styles.stepImage}
                  />
                  <div className={styles.imageOverlay}></div>
                </div>

                <div className={styles.textContent}>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDescription}>{step.description}</p>

                  <ul className={styles.detailsList}>
                    {step.details.map((detail, idx) => (
                      <li key={idx} className={styles.detailItem}>
                        <span className={styles.checkIcon}>✓</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {index < stepsData.length - 1 && (
                <div className={styles.stepArrow}>
                  <span>↓</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSteps;
