/**
 * Vision Content Component
 * @description 비전 콘텐츠를 지그재그 레이아웃으로 표시
 */

import React from 'react';
import styles from './VisionContent.module.css';
import futureImage from '@/assets/image/vision/future.jpg';
import aiImage from '@/assets/image/vision/ai.jpg';
import healthImage from '@/assets/image/vision/health.jpg';
import globalImage from '@/assets/image/vision/global.jpg';

interface VisionSection {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  imagePath: string;
  imageAlt: string;
  isReversed: boolean;
}

const visionData: VisionSection[] = [
  {
    id: 1,
    title: '지속 가능한 미래',
    subtitle: 'Sustainable Future',
    description: '음식물 쓰레기를 줄이고 환경을 보호하는 스마트한 식생활 문화를 만들어갑니다.',
    benefits: [
      '연간 음식물 쓰레기 30% 감소 목표',
      '탄소 배출량 감소를 통한 환경 보호',
      '재료 활용률 극대화로 가계 경제 절감',
      '친환경 식문화 확산 선도'
    ],
    imagePath: futureImage,
    imageAlt: '지속 가능한 미래',
    isReversed: false
  },
  {
    id: 2,
    title: 'AI 혁신',
    subtitle: 'AI Innovation',
    description: '최첨단 인공지능 기술로 개인 맞춤형 식생활 솔루션을 제공합니다.',
    benefits: [
      '딥러닝 기반 재료 인식 및 분석',
      '개인 취향 학습을 통한 맞춤 추천',
      '실시간 영양 성분 분석 및 제안',
      '음성 인식 기반 스마트 요리 가이드'
    ],
    imagePath: aiImage,
    imageAlt: 'AI 혁신',
    isReversed: true
  },
  {
    id: 3,
    title: '건강한 삶',
    subtitle: 'Healthy Life',
    description: '과학적 영양 관리로 가족 모두의 건강한 식생활을 책임집니다.',
    benefits: [
      '개인별 건강 상태 기반 식단 제안',
      '알레르기 및 금기 식품 자동 관리',
      '영양 균형 모니터링 및 피드백',
      '건강 목표 달성을 위한 장기 플랜'
    ],
    imagePath: healthImage,
    imageAlt: '건강한 삶',
    isReversed: false
  },
  {
    id: 4,
    title: '글로벌 확장',
    subtitle: 'Global Expansion',
    description: '전 세계 식문화를 연결하고 공유하는 글로벌 플랫폼으로 성장합니다.',
    benefits: [
      '다국어 지원으로 글로벌 서비스 제공',
      '세계 각국의 레시피 DB 구축',
      '국제 협력을 통한 식문화 교류',
      '2030년까지 50개국 진출 목표'
    ],
    imagePath: globalImage,
    imageAlt: '글로벌 확장',
    isReversed: true
  }
];

const VisionContent: React.FC = () => {
  return (
    <section className={styles.visionContentSection}>
      <div className={styles.container}>
        {visionData.map((vision, index) => (
          <div
            key={vision.id}
            className={`${styles.visionItem} ${vision.isReversed ? styles.reversed : ''}`}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            {/* 이미지 영역 */}
            <div className={styles.imageWrapper}>
              <div className={styles.imageContainer}>
                <img
                  src={vision.imagePath}
                  alt={vision.imageAlt}
                  className={styles.visionImage}
                />
                <div className={styles.imageOverlay}></div>
              </div>
            </div>

            {/* 콘텐츠 영역 */}
            <div className={styles.contentWrapper}>
              <div className={styles.content}>
                <span className={styles.subtitle}>{vision.subtitle}</span>
                <h3 className={styles.title}>{vision.title}</h3>
                <p className={styles.description}>{vision.description}</p>

                <ul className={styles.benefitsList}>
                  {vision.benefits.map((benefit, idx) => (
                    <li key={idx} className={styles.benefitItem}>
                      <span className={styles.checkIcon}>✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VisionContent;
