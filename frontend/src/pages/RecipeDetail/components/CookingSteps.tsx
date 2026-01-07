import React from 'react';
import styles from './CookingSteps.module.css';

export interface CookingStep {
  id: number;
  title: string;
  description: string;
  image: string;
}

type ViewMode = 'large' | 'small' | 'list';

interface CookingStepsProps {
  steps: CookingStep[];
  viewMode: ViewMode;
}

const BACKEND_URL = 'http://localhost:8080'; // 백엔드 서버 URL 정의

export const CookingSteps: React.FC<CookingStepsProps> = ({ steps, viewMode }) => {
  const getStepClassName = () => { 
    if (viewMode === 'large') return `${styles.stepItem} ${styles.largeImage}`;
    if (viewMode === 'list') return `${styles.stepItem} ${styles.listView}`;
    return styles.stepItem;
  };

  return (
    <div className={styles.cookingSteps}>
      <div className={styles.cookingStepsHeader}>
        <h2>조리순서</h2>
        <span className={styles.stepCount}>{steps.length}단계</span>
      </div>
      <div className={styles.stepsList}>
        {steps.map((step) => {
          // 이미지 URL이 'http'로 시작하면 그대로 사용하고, 그렇지 않으면 백엔드 URL을 앞에 붙여 절대 경로로 만듭니다.
          const fullImageUrl = step.image? step.image.startsWith('http')? 
            step.image: `${BACKEND_URL}${step.image}`: '';
          return (
            <div key={step.id} className={getStepClassName()}>
              <div className={styles.stepImage}>
                {/* 절대 경로 이미지 URL을 사용하여 이미지를 표시합니다. */}
                <img src={fullImageUrl} alt={step.title} />
              </div>
              <div className={styles.stepContent}>
                <div className={styles.stepNumber}>{step.id}</div>
                <div className={styles.stepText}>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDescription}>
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
