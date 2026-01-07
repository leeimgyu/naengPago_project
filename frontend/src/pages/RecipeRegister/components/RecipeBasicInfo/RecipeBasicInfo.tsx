import React from 'react';
import styles from './RecipeBasicInfo.module.css';

interface RecipeBasicInfoProps {
  title: string;
  description: string;
  cookTime: string;
  difficulty: string;
  servings: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onCookTimeChange: (cookTime: string) => void;
  onDifficultyChange: (difficulty: string) => void;
  onServingsChange: (servings: string) => void;
}

const RecipeBasicInfo: React.FC<RecipeBasicInfoProps> = ({
  title,
  description,
  cookTime,
  difficulty,
  servings,
  onTitleChange,
  onDescriptionChange,
  onCookTimeChange,
  onDifficultyChange,
  onServingsChange,
}) => {
  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>레시피 기본 정보</h3>
      <div className={styles.formContainer}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="recipe-title">
            레시피 제목
          </label>
          <input
            className={styles.input}
            id="recipe-title"
            type="text"
            placeholder="예) 매콤한 토마토 스파게티"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="recipe-description">
            한 줄 설명
          </label>
          <input
            className={styles.input}
            id="recipe-description"
            type="text"
            placeholder="예) 간단하게 만들 수 있는 풍미 가득한 스파게티 요리입니다."
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
          />
        </div>
        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="cook-time">
              요리 방법
            </label>
            <select
              className={styles.select}
              id="cook-time"
              value={cookTime}
              onChange={(e) => onCookTimeChange(e.target.value)}
            >
              <option value="" disabled>선택</option>
              <option>볶기</option>
              <option>굽기</option>
              <option>끓이기</option>
              <option>튀기기</option>
              <option>찌기</option>
              <option>기타</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="difficulty">
              요리 종류
            </label>
            <select
              className={styles.select}
              id="difficulty"
              value={difficulty}
              onChange={(e) => onDifficultyChange(e.target.value)}
            >
              <option value="" disabled>선택</option>
              <option>밥</option>
              <option>국&찌개</option>
              <option>후식</option>
              <option>반찬</option>
              <option>일품</option>
              <option>기타</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="servings">
              분량
            </label>
            <select
              className={styles.select}
              id="servings"
              value={servings}
              onChange={(e) => onServingsChange(e.target.value)}
            >
              <option value="" disabled>선택</option>
              <option>1인분</option>
              <option>2인분</option>
              <option>3인분</option>
              <option>4인분</option>
              <option>기타</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecipeBasicInfo;