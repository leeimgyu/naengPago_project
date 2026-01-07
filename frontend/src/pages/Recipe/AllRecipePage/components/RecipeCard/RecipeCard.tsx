import { Link } from 'react-router-dom';
import styles from './RecipeCard.module.css';

import type { UnifiedRecipe } from '../../../../../api/recipeApi';

type RecipeCardProps = {
  recipe: UnifiedRecipe;
};

const BACKEND_URL = 'http://localhost:8080'; // 백엔드 서버 URL 정의

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const imageUrl = recipe.imageUrl? recipe.imageUrl.startsWith('http')
      ? recipe.imageUrl: `${BACKEND_URL}${recipe.imageUrl}`: '';

  // 디버깅: 이미지 URL 확인
  console.log('Recipe:', recipe.title);
  console.log('Original imageUrl:', recipe.imageUrl);
  console.log('Final imageUrl:', imageUrl);

  return (
    <Link to={`/recipe/${recipe.dbId}`} className={styles['recipe-card-link']}>
      <div className={styles['recipe-card']}>
        {recipe.imageUrl ? (
          // 절대 경로 이미지 URL을 사용하여 이미지를 표시합니다.
          <img src={imageUrl} alt={recipe.title} className={styles['recipe-image']} />
        ) : (
          <div className={`${styles['recipe-image']} ${styles.default}`}></div>
        )}
        <div className={styles['recipe-content']}>
          <span className={styles['recipe-category']}>{recipe.rcpPat2}</span>
          <h3 className={styles['recipe-title']}>{recipe.title}</h3>
          <p className={styles['recipe-desc']}>{recipe.description}</p>
          <div className={styles['recipe-meta']}>
            <span>🍳 {recipe.rcpWay2 || '-'}</span>
            <span>👀 {recipe.viewCount ?? 0}</span>
            <span>♥️ {recipe.likeCount ?? 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;