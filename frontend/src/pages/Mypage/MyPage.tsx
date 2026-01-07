import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { BookOpen, ChefHat, Refrigerator, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { ProfileBanner } from "./components/profile/ProfileBanner";
import { RecipeCard } from "./components/recipe-tab/RecipeCard";
import { CommentCard } from "./components/records-tab/CommentCard";
import { IngredientItem, type Ingredient } from "./components/fridge-tab/IngredientItem";
import { ReceiptDialog } from "./components/dialog/ReceiptDialog";
import { IngredientAddDialog } from "./components/dialog/IngredientAddDialog";
import { FridgeIngredientDialog } from "./components/dialog/FridgeIngredientDialog";
import { IngredientEditDialog } from "./components/dialog/IngredientEditDialog";
import { getAllFridgeItems, addFridgeItem, updateFridgeItem, deleteFridgeItem } from "@/lib/api";
import {
  getAllViewHistories,
  type RecipeView,
} from "../../api/recipeViewApi";
import {
  getLikedRecipesByUser,
  type UnifiedRecipe as Recipe, // 충돌 방지를 위해 별칭 사용
} from "@/api/recipeApi";
import { getCommentsByUserId, type ApiComment } from "@/api/commentApi";
import { getReviewsByUserId, type Review } from "@/api/recipeReviewApi";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

// 이미지 URL 처리 함수 (상대 경로 → 절대 URL 변환)
const getImageUrl = (imageUrl: string): string => {
  // 이미 절대 URL인 경우 (http:// 또는 https://로 시작)
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // 상대 경로인 경우 백엔드 서버 주소 추가
  return `http://localhost:8080${imageUrl}`;
};

// RecipeView를 RecipeCard에서 사용하는 형식으로 변환하는 함수
const formatViewedRecipe = (view: RecipeView) => {
  const now = new Date();
  const viewedDate = new Date(view.viewedAt);
  const diffMs = now.getTime() - viewedDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let viewedAt: string;
  if (diffDays === 0) {
    viewedAt = "오늘";
  } else if (diffDays === 1) {
    viewedAt = "어제";
  } else if (diffDays < 7) {
    viewedAt = `${diffDays}일 전`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    viewedAt = `${weeks}주 전`;
  } else {
    const months = Math.floor(diffDays / 30);
    viewedAt = `${months}개월 전`;
  }

  return {
    id: view.recipeId,
    title: view.recipeTitle,
    image:
      view.recipeImageUrl ||
      "https://images.unsplash.com/photo-1573470571028-a0ca7a723959",
    cookTime: `${view.recipeCookingTime}분`,
    viewedAt,
  };
};

export function MyPage({
  onNavigateToEditProfile,
}: {
  onNavigateToEditProfile?: () => void;
}) {
  const location = useLocation();
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);
  const [isIngredientAddDialogOpen, setIsIngredientAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("viewed");
  const [isLoading, setIsLoading] = useState(false);
  const [viewHistory, setViewHistory] = useState<RecipeView[]>([]);
  const [viewHistoryLoading, setViewHistoryLoading] = useState(false);
  const [likedRecipesList, setLikedRecipesList] = useState<Recipe[]>([]);
  const [likedRecipesLoading, setLikedRecipesLoading] = useState(false);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [userReviewsLoading, setUserReviewsLoading] = useState(false);
  const [userComments, setUserComments] = useState<ApiComment[]>([]);
  const [userCommentsLoading, setUserCommentsLoading] = useState(false);
  const { toast } = useToast();

  // 컴포넌트 마운트 시 DB에서 재료 목록 불러오기
  useEffect(() => {
    const loadIngredients = async () => {
      try {
        setIsLoading(true);
        const response = await getAllFridgeItems();
        if (response.success && response.data) {
          // API 응답 데이터를 Ingredient 타입으로 변환
          const loadedIngredients: Ingredient[] = response.data.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            category: item.category,
            expiryDate: item.expiryDate,
            addedAt: item.addedAt,
          }));
          setIngredients(loadedIngredients);
        }
      } catch (error) {
        console.error("재료 목록 불러오기 실패:", error);
        toast({
          title: "오류",
          description:
            error instanceof Error
              ? error.message
              : "재료 목록을 불러오는데 실패했습니다.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadIngredients();
  }, [toast]);

  // 조회 기록 불러오기
  useEffect(() => {
    const loadViewHistory = async () => {
      if (!user?.userId) return;

      try {
        setViewHistoryLoading(true);
        const history = await getAllViewHistories();
        setViewHistory(history);
      } catch (error) {
        console.error("조회 기록 불러오기 실패:", error);
        toast({
          title: "오류",
          description:
            error instanceof Error
              ? error.message
              : "조회 기록을 불러오는데 실패했습니다.",
          variant: "destructive",
        });
      } finally {
        setViewHistoryLoading(false);
      }
    };

    loadViewHistory();
  }, [user, toast]);

  // 좋아요한 레시피 불러오기
  useEffect(() => {
    const loadLikedRecipes = async () => {
      if (!user?.userId) return;

      try {
        setLikedRecipesLoading(true);
        const recipes = await getLikedRecipesByUser();
        setLikedRecipesList(recipes);
      } catch (error) {
        console.error("좋아요한 레시피 불러오기 실패:", error);
        toast({
          title: "오류",
          description:
            error instanceof Error
              ? error.message
              : "좋아요한 레시피를 불러오는데 실패했습니다.",
          variant: "destructive",
        });
      } finally {
        setLikedRecipesLoading(false);
      }
    };

    loadLikedRecipes();
  }, [user, toast]);

  // 사용자 댓글 불러오기
  useEffect(() => {
    const loadUserComments = async () => {
      if (!user?.userId) {
        console.log("❌ 댓글 조회 실패: user.userId 없음", user);
        return;
      }

      try {
        setUserCommentsLoading(true);
        console.log("📝 댓글 조회 시작 - userId:", user.userId);
        const comments = await getCommentsByUserId(user.userId);
        console.log("✅ 댓글 조회 성공:", comments.length, "개", comments);
        setUserComments(comments);
      } catch (error) {
        console.error("❌ 사용자 댓글 불러오기 실패:", error);
        toast({
          title: "오류",
          description:
            error instanceof Error
              ? error.message
              : "댓글을 불러오는데 실패했습니다.",
          variant: "destructive",
        });
      } finally {
        setUserCommentsLoading(false);
      }
    };

    loadUserComments();
  }, [user, toast]);

  // 사용자 리뷰 불러오기
  useEffect(() => {
    const loadUserReviews = async () => {
      if (!user?.userId) {
        console.log("❌ 리뷰 조회 실패: user.userId 없음", user);
        return;
      }

      try {
        setUserReviewsLoading(true);
        console.log("⭐ 리뷰 조회 시작 - userId:", user.userId);
        const reviews = await getReviewsByUserId(user.userId);
        console.log("✅ 리뷰 조회 성공:", reviews.length, "개", reviews);
        setUserReviews(reviews);
      } catch (error) {
        console.error("❌ 사용자 리뷰 불러오기 실패:", error);
        toast({
          title: "오류",
          description:
            error instanceof Error
              ? error.message
              : "리뷰를 불러오는데 실패했습니다.",
          variant: "destructive",
        });
      } finally {
        setUserReviewsLoading(false);
      }
    };

    loadUserReviews();
  }, [user, toast]);

  // 알림창에서 이동한 경우 해당 탭 활성화
  useEffect(() => {
    const state = location.state as { tab?: string } | null;
    if (state?.tab) {
      console.log('🏠 Opening mypage tab from notification:', state.tab);
      setActiveTab(state.tab);
    }
  }, [location.state]);



  const handleAddIngredient = async (ingredient: {
    name: string;
    quantity: string;
    category: string;
    expiryDate: string;
  }) => {
    try {
      setIsLoading(true);
      const response = await addFridgeItem({
        name: ingredient.name,
        quantity: ingredient.quantity,
        category: ingredient.category,
        expiryDate:
          ingredient.expiryDate && ingredient.expiryDate.trim() !== ""
            ? ingredient.expiryDate
            : undefined,
      });

      if (response.success && response.data) {
        // API 응답 데이터를 Ingredient 타입으로 변환하여 추가
        const newIngredient: Ingredient = {
          id: response.data.id,
          name: response.data.name,
          quantity: response.data.quantity,
          category: response.data.category,
          expiryDate: response.data.expiryDate,
          addedAt: response.data.addedAt,
        };
        setIngredients([...ingredients, newIngredient]);
        toast({
          title: "성공",
          description: "재료가 추가되었습니다.",
        });
      }
    } catch (error) {
      console.error("재료 추가 실패:", error);
      toast({
        title: "오류",
        description:
          error instanceof Error ? error.message : "재료 추가에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteIngredient = async (id: number) => {
    try {
      setIsLoading(true);
      const response = await deleteFridgeItem(id);

      if (response.success) {
        setIngredients(ingredients.filter((ing) => ing.id !== id));
        toast({
          title: "성공",
          description: "재료가 삭제되었습니다.",
        });
      }
    } catch (error) {
      console.error("재료 삭제 실패:", error);
      toast({
        title: "오류",
        description:
          error instanceof Error ? error.message : "재료 삭제에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditIngredient = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setIsEditDialogOpen(true);
  };

  const handleUpdateIngredient = async (updatedIngredient: Ingredient) => {
    try {
      setIsLoading(true);
      const response = await updateFridgeItem(updatedIngredient.id, {
        name: updatedIngredient.name,
        quantity: updatedIngredient.quantity,
        category: updatedIngredient.category,
        expiryDate: updatedIngredient.expiryDate,
      });

      if (response.success && response.data) {
        // API 응답 데이터로 업데이트
        const updated: Ingredient = {
          id: response.data.id,
          name: response.data.name,
          quantity: response.data.quantity,
          category: response.data.category,
          expiryDate: response.data.expiryDate,
          addedAt: response.data.addedAt,
        };
        setIngredients(
          ingredients.map((ing) => (ing.id === updated.id ? updated : ing))
        );
        setEditingIngredient(null);
        setIsEditDialogOpen(false);
        toast({
          title: "성공",
          description: "재료가 수정되었습니다.",
        });
      }
    } catch (error) {
      console.error("재료 수정 실패:", error);
      toast({
        title: "오류",
        description:
          error instanceof Error ? error.message : "재료 수정에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const categorizedIngredients = ingredients.reduce((acc, ing) => {
    if (!acc[ing.category]) {
      acc[ing.category] = [];
    }
    acc[ing.category].push(ing);
    return acc;
  }, {} as Record<string, Ingredient[]>);

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <main className="pt-[70px] pb-20">
        {/* 프로필 배너 */}
        <ProfileBanner
          onNavigateToEditProfile={onNavigateToEditProfile}
          onOpenReceiptDialog={() => setIsReceiptDialogOpen(true)}
          onOpenIngredientDialog={() => setIsIngredientAddDialogOpen(true)}
          viewedRecipesCount={viewHistory.length}
          cookedDishesCount={likedRecipesList.length}
          ingredientsCount={ingredients.length}
          onTabChange={setActiveTab}
        />

        {/* 탭 섹션 */}
        <section className="max-w-[1200px] mx-auto px-8 py-12">
          <Tabs
            value={activeTab}
            defaultValue="viewed"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-white border border-gray-200 h-14">
              <TabsTrigger
                value="viewed"
                className="data-[state=active]:bg-[#3b6c55] h-full"
              >
                <BookOpen
                  className={
                    activeTab === "viewed"
                      ? "w-4 h-4 mr-2 text-white"
                      : "w-4 h-4 mr-2 text-foreground"
                  }
                />
                <span
                  style={{
                    color: activeTab === "viewed" ? "white" : undefined,
                  }}
                >
                  본 레시피
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="cooked"
                className="data-[state=active]:bg-[#3b6c55] h-full"
              >
                <ChefHat
                  className={
                    activeTab === "cooked"
                      ? "w-4 h-4 mr-2 text-white"
                      : "w-4 h-4 mr-2 text-foreground"
                  }
                />
                <span
                  style={{
                    color: activeTab === "cooked" ? "white" : undefined,
                  }}
                >
                  나의 기록
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="fridge"
                className="data-[state=active]:bg-[#3b6c55] h-full"
              >
                <Refrigerator
                  className={
                    activeTab === "fridge"
                      ? "w-4 h-4 mr-2 text-white"
                      : "w-4 h-4 mr-2 text-foreground"
                  }
                />
                <span
                  style={{
                    color: activeTab === "fridge" ? "white" : undefined,
                  }}
                >
                  내 냉장고
                </span>
              </TabsTrigger>
            </TabsList>

            {/* 본 레시피 탭 */}
            <TabsContent value="viewed">
              {viewHistoryLoading ? (
                <div className="flex justify-center py-12">
                  <p>조회 기록을 불러오는 중...</p>
                </div>
              ) : viewHistory.length === 0 ? (
                <div className="flex justify-center py-12">
                  <p className="text-gray-500">
                    아직 조회한 레시피가 없습니다.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {viewHistory.map((history) => {
                    // 시간 차이 계산 함수
                    const getTimeAgo = (dateString: string) => {
                      const now = new Date();
                      const viewDate = new Date(dateString);
                      const diffMs = now.getTime() - viewDate.getTime();
                      const diffMins = Math.floor(diffMs / (1000 * 60));
                      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                      const diffDays = Math.floor(
                        diffMs / (1000 * 60 * 60 * 24)
                      );

                      if (diffMins < 60) return `${diffMins}분 전`;
                      if (diffHours < 24) return `${diffHours}시간 전`;
                      if (diffDays < 7) return `${diffDays}일 전`;
                      return `${Math.floor(diffDays / 7)}주 전`;
                    };

                    return (
                      <RecipeCard
                        key={history.viewId}
                        id={history.recipeId}
                        title={history.recipeTitle}
                        image={getImageUrl(history.recipeImageUrl)}
                        cookTime={history.recipeDifficulty || "일반"}
                        viewedAt={getTimeAgo(history.viewedAt)}
                        showLikeButton={false}
                        source="db"
                      />
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* 나의 기록 탭 */}
            <TabsContent value="cooked">
              <div className="space-y-8">
                {/* 찜한 레시피 */}
                <div>
                  <h2 className="text-[#3b6c55] mb-4">찜한 레시피</h2>
                  {likedRecipesLoading ? (
                    <div className="flex justify-center py-12">
                      <p>찜한 레시피를 불러오는 중...</p>
                    </div>
                  ) : likedRecipesList.length === 0 ? (
                    <div className="flex justify-center py-12">
                      <p className="text-gray-500">
                        아직 찜한 레시피가 없습니다.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {likedRecipesList.map((recipe) => (
                        <RecipeCard
                          key={recipe.id}
                          id={recipe.dbId!}
                          title={recipe.title}
                          image={getImageUrl(recipe.imageUrl)}
                          cookTime={recipe.rcpWay2 || "일반"}
                          viewedAt=""
                          showLikeButton={true}
                          source="db"
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                {/* 내 요리 후기 */}
                <div>
                  <h2 className="text-[#3b6c55] mb-4">내 요리 후기</h2>
                  {userReviewsLoading ? (
                    <div className="flex justify-center py-12">
                      <p>후기를 불러오는 중...</p>
                    </div>
                  ) : userReviews.length === 0 ? (
                    <div className="flex justify-center py-12">
                      <p className="text-gray-500">
                        아직 작성한 요리 후기가 없습니다.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userReviews.map((review) => {
                        // 날짜 포맷 변환 (ISO -> YYYY.MM.DD)
                        const formatDate = (dateString: string) => {
                          const date = new Date(dateString);
                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(
                            2,
                            "0"
                          );
                          const day = String(date.getDate()).padStart(2, "0");
                          return `${year}.${month}.${day}`;
                        };

                        return (
                          <CommentCard
                            key={review.reviewId}
                            id={review.reviewId}
                            recipeTitle={
                              review.recipeTitle || "알 수 없는 레시피"
                            }
                            comment={review.comment}
                            commentedAt={formatDate(review.createdAt)}
                            recipeThumbnail={getImageUrl(review.recipeImageUrl || "")}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-[#3b6c55] mb-4">내 댓글</h2>
                  {userCommentsLoading ? (
                    <div className="flex justify-center py-12">
                      <p>댓글을 불러오는 중...</p>
                    </div>
                  ) : userComments.length === 0 ? (
                    <div className="flex justify-center py-12">
                      <p className="text-gray-500">
                        아직 작성한 댓글이 없습니다.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userComments.map((comment) => {
                        // 날짜 포맷 변환 (ISO -> YYYY.MM.DD)
                        const formatDate = (dateString: string) => {
                          const date = new Date(dateString);
                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(
                            2,
                            "0"
                          );
                          const day = String(date.getDate()).padStart(2, "0");
                          return `${year}.${month}.${day}`;
                        };

                        return (
                          <CommentCard
                            key={comment.commentId}
                            id={comment.commentId}
                            recipeTitle={
                              comment.recipeTitle || "알 수 없는 레시피"
                            }
                            comment={comment.content}
                            commentedAt={formatDate(comment.createdAt)}
                            recipeThumbnail={getImageUrl(comment.recipeImageUrl || "")}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* 내 냉장고 탭 */}
            <TabsContent value="fridge">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-[#3b6c55] mb-2">보유 재료</h2>
                  <p className="text-gray-600">
                    냉장고에 있는 재료를 관리해보세요
                  </p>
                </div>
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="bg-[#3b6c55] hover:bg-[#2a5240] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  재료 추가
                </Button>
              </div>

              {isLoading ? (
                <div className="pb-4 space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                      <CardHeader>
                        <Skeleton className="w-1/4 h-6" />
                        <Skeleton className="w-1/5 h-4" />
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {[...Array(2)].map((_, j) => (
                          <div
                            key={j}
                            className="flex items-center justify-between p-3 border rounded-md"
                          >
                            <div className="flex items-center space-x-4">
                              <Skeleton className="w-8 h-8 rounded-full" />
                              <div>
                                <Skeleton className="w-24 h-5" />
                                <Skeleton className="w-32 h-3 mt-1" />
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Skeleton className="w-8 h-8" />
                              <Skeleton className="w-8 h-8" />
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="pb-4 space-y-6">
                  {Object.entries(categorizedIngredients).map(
                    ([category, items]) => (
                      <Card key={category}>
                        <CardHeader>
                          <CardTitle className="text-[#3b6c55]">
                            {category}
                          </CardTitle>
                          <CardDescription>
                            {items.length}개 재료
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {items.map((ingredient) => (
                              <IngredientItem
                                key={ingredient.id}
                                ingredient={ingredient}
                                onEdit={handleEditIngredient}
                                onDelete={handleDeleteIngredient}
                              />
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </section>
      </main>

      {/* 다이얼로그 */}
      <ReceiptDialog
        open={isReceiptDialogOpen}
        onOpenChange={setIsReceiptDialogOpen}
      />

      <IngredientAddDialog
        open={isIngredientAddDialogOpen}
        onOpenChange={setIsIngredientAddDialogOpen}
        ingredients={ingredients}
        onDeleteIngredient={handleDeleteIngredient}
      />

      <FridgeIngredientDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddIngredient}
      />

      <IngredientEditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        ingredient={editingIngredient}
        onUpdate={handleUpdateIngredient}
        onIngredientChange={setEditingIngredient}
      />
    </div>
  );
}
