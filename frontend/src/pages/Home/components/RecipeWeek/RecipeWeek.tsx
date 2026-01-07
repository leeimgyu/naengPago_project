import React, { useState, useEffect } from 'react';
import RecipeCard from './RecipeCard';
import type { RecipeCard as RecipeCardType } from '@/types';
// getWeeklyRecipes와 ApiRecipe는 더 이상 사용되지 않으므로 import 제거
import { getWeeklyRecommendedRecipes } from '@/api/recipeApi'; // 새로운 API 함수 import
import type { ApiRecipe } from '@/api/recipeApi'; // ApiRecipe 타입 import
import styles from './RecipeWeek.module.css';


const weekDays = [
  { day: 'MON', dayColor: '#000' },
  { day: 'TUE', dayColor: '#000' },
  { day: 'WED', dayColor: '#000' },
  { day: 'THU', dayColor: '#000' },
  { day: 'FRI', dayColor: '#000' },
  { day: 'SAT', dayColor: '#6691EE' },
  { day: 'SUN', dayColor: '#F44637' }
];

const RecipeWeek: React.FC = () => {
  const [recipes, setRecipes] = useState<RecipeCardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeeklyRecipes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const apiResponse = await getWeeklyRecommendedRecipes();
        
        if (apiResponse.COOKRCP01.RESULT.CODE !== 'INFO-000') {
          throw new Error(apiResponse.COOKRCP01.RESULT.MSG);
        }

        const openApiRecipes = apiResponse.COOKRCP01.row;
        const transformedRecipes = openApiRecipes.slice(0, 7).map((recipe: ApiRecipe, index: number) => {
          return {
            ...weekDays[index],
            image: recipe.ATT_FILE_NO_MAIN, // 필드명 변경
            name: recipe.RCP_NM,             // 필드명 변경
          };
        });

        setRecipes(transformedRecipes);
      } catch (err) {
        setError('레시피를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.');
        console.error(">>> [Debug] 함수에서 에러 발생:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeeklyRecipes();
  }, []);

  return (
    <section className={styles.weekRecipeSection}>
      <div className={styles.container}>
        <div className={styles.recipeGrid}>
          <div className={styles.sectionTitle}>
            <h2 style={{fontWeight: '500'}}>Recipe of the Week</h2>
            <p style={{ fontSize: '1rem' , color: '#555' }}>
              " 냉장고 속 재료로 완성하는 이번주 추천 레시피
            </p>
            <p style={{ fontSize: '1rem' , color: '#555' }}>
              &nbsp;&nbsp;&nbsp;이번 주의 요리를 달력에서 바로 발견하세요. "
            </p>
            <div className={styles.shortcutBox}>
              <a href="#">
                <span style={{ fontSize: '1.1rem' }}>
                  Before This Week — 다시 꺼내보는 한 주의 기록
                </span>
              </a>
              <a href="/recipe/week">
                <button type="button">click here!</button>
              </a>
            </div>
          </div>

          {isLoading && (
            <div className={styles.loadingState}>
              <p>이번 주 레시피를 열심히 준비 중입니다...</p>
            </div>
          )}
          {error && !isLoading && (
            <div className={styles.errorState}>
              <p>{error}</p>
            </div>
          )}
          {!isLoading && !error && recipes.map((recipe, index) => (
            <RecipeCard key={index} {...recipe} />
          ))}

          <a href="/recipe/all" className={`${styles.recipeCard} ${styles.recipeSearchBox}`}>
            <div className={styles.recipeSearchText}>
              <h3>Recipe Search</h3>
              <p>원하는 레시피를 쉽고 빠르게 찾아보세요.</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default RecipeWeek;
