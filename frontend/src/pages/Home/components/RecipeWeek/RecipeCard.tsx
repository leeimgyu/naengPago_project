import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RecipeCard as RecipeCardProps } from '@/types';
import styles from './RecipeWeek.module.css';
import rightArrow from '@/assets/image/icon/right-arrow.png';
import { getOrCreateRecipeIdFromOpenApi } from '@/api/recipeApi';

// 'link' prop은 더 이상 사용되지 않으므로 타입에서 제거합니다.
const RecipeCard: React.FC<Omit<RecipeCardProps, 'link'>> = ({ day, dayColor, image, name }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // 이벤트 객체를 받아 preventDefault를 호출할 수 있도록 핸들러를 수정합니다.
  const handleClick = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault(); // a 태그의 기본 네비게이션 동작을 막습니다.

    if (isLoading) return;

    setIsLoading(true);
    try {
      const dbId = await getOrCreateRecipeIdFromOpenApi(name);
      navigate(`/recipe/${dbId}`);
    } catch (error) {
      console.error("레시피 ID를 가져오는 데 실패했습니다.", error);
      alert("레시피 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 최상위 요소를 a 태그로 변경하고, onClick 핸들러를 연결합니다.
    // href에는 SEO와 우클릭 새 탭 열기를 위한 대체 경로를 제공합니다.
    <a
      href={`/recipe/by-name/${name}`} 
      onClick={handleClick}
      className={styles.recipeCard}
    >
      {isLoading && <div className={styles.loadingOverlay}><span>Loading...</span></div>}
      <h3 style={dayColor ? { color: dayColor } : undefined}>{day}</h3>
      <img className={styles.recipeImg} src={image} alt={`${day} Recipe`} />
      <span className={styles.recipeName}>{name}</span>
      <img
        className={styles.recipeArrow}
        src={rightArrow}
        alt="right-arrow"
      />
    </a>
  );
};

export default RecipeCard;