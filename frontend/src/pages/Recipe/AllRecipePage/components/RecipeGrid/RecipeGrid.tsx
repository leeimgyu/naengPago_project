import { useState } from "react";
import RecipeCard from "../RecipeCard/RecipeCard";
import styles from "./RecipeGrid.module.css";
import { type UnifiedRecipe } from "../../../../../api/recipeApi";
import RecipePagination from "../RecipePagination/RecipePagination";

interface RecipeGridProps {
  recipes: UnifiedRecipe[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalElements: number;
}

const RecipeGrid = ({
  recipes,
  isLoading,
  error,
  currentPage,
  totalPages,
  onPageChange,
  totalElements
}: RecipeGridProps) => {
  // 정렬 옵션은 클라이언트 사이드에서 관리
  const [sortOption, setSortOption] = useState("최신순");

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  const getSortedRecipes = () => {
    const sorted = [...recipes];
    if (sortOption === "인기순") {
      return sorted.sort((a, b) => (b.likeCount ?? 0) - (a.likeCount ?? 0));
    }
    // '최신순' 및 기타의 경우, 백엔드에서 이미 정렬된 상태로 오므로 그대로 반환
    return sorted;
  };

  if (isLoading) {
    return (
      <div className={styles["recipe-container"]}>
        <div className={styles["loading"]}>레시피를 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles["recipe-container"]}>
        <div className={styles["error"]}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const sortedRecipes = getSortedRecipes();

  return (
    <div className={styles["recipe-container"]}>
      <div className={styles["result-info"]}>
        <div className={styles["result-count"]}>
          총 <span>{totalElements}개</span>의 레시피
        </div>
        <select
          className={styles["sort-dropdown"]}
          value={sortOption}
          onChange={handleSortChange}
        >
          <option>최신순</option>
          <option>인기순</option>
        </select>
      </div>
      <div className={styles["recipe-grid"]}>
        {sortedRecipes.length > 0 ? (
          sortedRecipes.map((recipe) => (
            <RecipeCard key={`${recipe.source}-${recipe.id}`} recipe={recipe} />
          ))
        ) : (
          <div className={styles['no-results']}>검색 결과가 없습니다.</div>
        )}
      </div>
      {totalPages > 1 && (
        <RecipePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default RecipeGrid;