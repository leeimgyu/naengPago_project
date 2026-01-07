// src/components/fridge/components/FridgePanelContent.tsx
import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../FridgePanel.module.css";
import { useAuth } from "@/hooks/useAuth";
import type { FridgeTab } from "./FridgeTabs";
import {
  getAllFridgeItems,
  getRecommendedRecipesByFridge,
  type RecommendedRecipe,
} from "@/api/fridgeApi";

interface FridgePanelContentProps {
  activeTab: FridgeTab;
  onClose: () => void;
}

interface FridgeItem {
  id: number;
  name: string;
  quantity: string;
  category: string;
  addedAt: string;
  expiryDate?: string;
}

interface Recipe {
  id: number;
  title: string;
  imageUrl: string;
  cookingTime: number | null;
  difficulty?: string;
  matchedIngredients: string[]; // 매칭된 재료 목록
}

const FridgePanelContent: React.FC<FridgePanelContentProps> = ({
  activeTab,
  onClose,
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fridgeItems, setFridgeItems] = useState<FridgeItem[]>([]);
  const [recommendedRecipes, setRecommendedRecipes] = useState<Recipe[]>([]);
  const [recipesLoading, setRecipesLoading] = useState(false);

  // --- Mock API Call ---
  const fetchFridgeItems = useCallback(async () => {
    if (!isAuthenticated) {
      setError("로그인이 필요합니다.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("sessionToken");
      if (!token) {
        setError("인증 토큰이 없습니다.");
        return;
      }

      const items = await getAllFridgeItems(token);
      setFridgeItems(items);
    } catch (err) {
      setError("냉장고 재료를 불러오는 중 오류가 발생했습니다.");
      console.error("Failed to fetch fridge items:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

 const loadRecommendedRecipes = useCallback(async () => {
    if (!isAuthenticated) return;

    setRecipesLoading(true);
    try {
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("sessionToken");
      if (!token) {
        console.error("인증 토큰이 없습니다.");
        return;
      }

      // 캐싱 로직: 오늘 날짜로 저장된 추천 레시피가 있는지 확인
      const today = new Date().toDateString(); // "Thu Dec 12 2025" 형식
      const cachedDate = localStorage.getItem("recommendedRecipesDate");
      const cachedRecipes = localStorage.getItem("recommendedRecipes");

      // 오늘 날짜의 캐시가 있으면 사용
      if (cachedDate === today && cachedRecipes) {
        const parsedRecipes = JSON.parse(cachedRecipes);
        setRecommendedRecipes(parsedRecipes);
        setRecipesLoading(false);
        return;
      }

      // 캐시가 없거나 날짜가 다르면 API 호출
      const recipes = await getRecommendedRecipesByFridge(token, 5);

      const formattedRecipes: Recipe[] = recipes.map((recipe) => ({
        id: recipe.recipeId,
        title: recipe.title,
        imageUrl: recipe.imageUrl,
        cookingTime: recipe.cookingTime,
        difficulty: recipe.difficulty,
        matchedIngredients: recipe.matchedIngredients,
      }));

      // 결과가 있을 때만 오늘 날짜와 함께 localStorage에 저장
      if (formattedRecipes.length > 0) {
        localStorage.setItem("recommendedRecipesDate", today);
        localStorage.setItem("recommendedRecipes", JSON.stringify(formattedRecipes));
      }

      setRecommendedRecipes(formattedRecipes);
    } catch (err) {
      console.error("추천 레시피 로드 실패:", err);
      setRecommendedRecipes([]);
    } finally {
      setRecipesLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchFridgeItems();
    loadRecommendedRecipes();
  }, [fetchFridgeItems, loadRecommendedRecipes]);

  // 보유 재료가 변경되면 추천 레시피 캐시 무효화 후 재조회
  useEffect(() => {
    if (fridgeItems.length > 0) {
      // 캐시 삭제
      localStorage.removeItem("recommendedRecipes");
      localStorage.removeItem("recommendedRecipesDate");
      // 추천 레시피 재조회
      loadRecommendedRecipes();
    }
  }, [fridgeItems.length, loadRecommendedRecipes]);

  const handleRecipeClick = (recipeId: number) => {
    navigate(`/recipe/${recipeId}`);
    onClose();
  };

  const handleViewAllIngredients = () => {
    navigate("/mypage", { state: { tab: "fridge" } });
    onClose();
  };

  // 유통기한 계산 함수
  const getDaysRemaining = (expiryDate?: string): number | null => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className={styles.content}>
      {isLoading ? (
        <p className={styles.loadingText}>냉장고 재료를 불러오는 중...</p>
      ) : error ? (
        <p className={styles.errorMessage}>{error}</p>
      ) : (
        <>
          {/* 추천 레시피 탭 */}
          {activeTab === "recipes" && (
            <div className={styles.recommendationSection}>
              <h3 className={styles.sectionTitle}>
                🍳 이 재료로 만들 수 있어요!
              </h3>

              {fridgeItems.length === 0 ? (
                <p className={styles.emptyMessage}>
                  냉장고에 재료를 추가하면 추천 레시피를 볼 수 있어요!
                </p>
              ) : recipesLoading ? (
                <div className={styles.loading}>
                  <p>추천 레시피를 불러오는 중...</p>
                </div>
              ) : recommendedRecipes.length === 0 ? (
                <div className={styles.empty}>
                  <p>추천할 레시피가 없습니다.</p>
                </div>
              ) : (
                <div className={styles.recipeList}>
                  {recommendedRecipes.map((recipe) => (
                    <div
                      key={recipe.id}
                      className={styles.recipeCard}
                      onClick={() => handleRecipeClick(recipe.id)}
                    >
                      <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        className={styles.recipeImage}
                      />
                      <div className={styles.recipeInfo}>
                        <h4 className={styles.recipeTitle}>{recipe.title}</h4>
                        <div className={styles.recipeMeta}>
                          {recipe.cookingTime && (
                            <span>⏱️ {recipe.cookingTime}분</span>
                          )}
                        </div>
                        {recipe.matchedIngredients.length > 0 && (
                          <div className={styles.matchedIngredients}>
                            {recipe.matchedIngredients.map(
                              (ingredient, idx) => (
                                <span
                                  key={idx}
                                  className={styles.ingredientTag}
                                >
                                  {ingredient}
                                </span>
                              )
                            )}
                          </div>
                        )}
                      </div>
                      <button className={styles.viewButton}>보기 →</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 보유 재료 탭 */}
          {activeTab === "ingredients" && (
            <div className={styles.ingredientSection}>
              <h3 className={styles.sectionTitle}>보유 재료</h3>
              {fridgeItems.length === 0 ? (
                <p className={styles.emptyMessage}>
                  냉장고가 비었어요. 신선한 재료를 추가해보세요!
                </p>
              ) : (
                <>
                  <div className={styles.ingredientList}>
                    {fridgeItems.map((item) => {
                      const daysRemaining = getDaysRemaining(item.expiryDate);
                      return (
                        <div key={item.id} className={styles.ingredientItem}>
                          <div className={styles.ingredientInfo}>
                            <span className={styles.ingredientName}>
                              {item.name}
                            </span>
                            <span className={styles.ingredientQuantity}>
                              {item.quantity}
                            </span>
                          </div>
                          {daysRemaining !== null && (
                            <span
                              className={`${styles.expiryBadge} ${
                                daysRemaining <= 2
                                  ? styles.expiryUrgent
                                  : daysRemaining <= 5
                                  ? styles.expiryWarning
                                  : ""
                              }`}
                            >
                              {daysRemaining >= 0
                                ? `D-${daysRemaining}`
                                : `D+${Math.abs(daysRemaining)}`}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* 모든 재료 보기 버튼 (5개 이상일 때만 표시) */}
                  {fridgeItems.length >= 5 && (
                    <button
                      className={styles.viewAll}
                      onClick={handleViewAllIngredients}
                    >
                      모든 재료 보기
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FridgePanelContent;
