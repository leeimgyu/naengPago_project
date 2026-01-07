import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { RecipeHeader } from "./components/RecipeHeader";
import { CookingSteps, type CookingStep } from "./components/CookingSteps";
import {
  IngredientsSection,
  type Ingredient,
} from "./components/IngredientsSection";
import { ViewControls } from "./components/ViewControls";
import { ReviewSection } from "../../components/review/ReviewSection";
import { CommentSection } from "../../components/comment/CommentSection";
import { TabSelector } from "../../components/layout/TabSelector";
import styles from "./RecipeDetailPage.module.css";
import { getCommentsByRecipeId, type ApiComment } from "../../api/commentApi";
import {
  getRecipeById,
  type UnifiedRecipe,
  deleteRecipe,
} from "../../api/recipeApi";
import { recordRecipeView } from "../../api/recipeViewApi";
import {
  addReview,
  getReviewsByRecipeId,
  updateReview,
  deleteReview,
  type Review,
} from "../../api/recipeReviewApi";
import { getFridgeIngredientNames } from "../../api/fridgeApi"; // 새로운 API 함수 임포트
import { useAuth } from "../../hooks/useAuth";

type ViewMode = "large" | "small" | "list";
type TabType = "review" | "comment";

export function RecipeDetailPage() {
  const { user, isAuthenticated } = useAuth();
  // id만 useParams로 가져오고 rcpNm은 제거합니다.
  const { id } = useParams<{ id?: string }>();
  const effectRan = useRef<string | null>(null); // 마지막으로 로드한 레시피 ID 저장

  // 통합 레시피 상태
  const [unifiedRecipe, setUnifiedRecipe] = useState<UnifiedRecipe | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("large");
  const [activeTab, setActiveTab] = useState<TabType>("review");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [comments, setComments] = useState<ApiComment[]>([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(true);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [userHasCommented, setUserHasCommented] = useState(false);

  // 냉장고 재료 이름 상태
  const [fridgeIngredientNames, setFridgeIngredientNames] = useState<
    Set<string>
  >(new Set());

  // 냉장고 재료 가져오기
  useEffect(() => {
    if (isAuthenticated) {
      // isAuthenticated만 확인
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("sessionToken");
      if (token) {
        getFridgeIngredientNames(token)
          .then((names) => setFridgeIngredientNames(new Set(names)))
          .catch((err) => console.error("냉장고 재료 불러오기 실패:", err));
      } else {
        setFridgeIngredientNames(new Set()); // 토큰이 없으면 비움
      }
    } else {
      setFridgeIngredientNames(new Set()); // 인증되지 않았을 경우 비움
    }
  }, [isAuthenticated]); // isAuthenticated에만 의존

  useEffect(() => {
    if (user && reviews.length > 0) {
      const hasReviewed = reviews.some(
        (review) => review.userId === user.userId
      );
      setUserHasReviewed(hasReviewed);
    } else {
      setUserHasReviewed(false);
    }
  }, [reviews, user]);

  useEffect(() => {
    if (user && comments.length > 0) {
      const hasCommented = comments.some(
        (comment) => comment.userId === user.userId
      );
      setUserHasCommented(hasCommented);
    } else {
      setUserHasCommented(false);
    }
  }, [comments, user]);

  const navigate = useNavigate();

  // 백엔드에서 레시피, 리뷰, 댓글 데이터 가져오기
  useEffect(() => {
    // StrictMode에서 두 번째 렌더링 시 API 중복 호출을 방지합니다.
    if (effectRan.current === id && process.env.NODE_ENV === "development") {
      return; // 같은 ID면 중복 호출 방지
    }

    const fetchData = async () => {
      setLoading(true);
      setReviewLoading(true);
      setCommentLoading(true);
      setError(null);
      setReviewError(null);
      setCommentError(null);

      let fetchedRecipe: UnifiedRecipe | null = null;

      try {
        if (!id) {
          throw new Error("레시피 ID가 없습니다.");
        }

        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) {
          throw new Error("유효하지 않은 레시피 ID입니다.");
        }
        fetchedRecipe = await getRecipeById(numericId);

        setUnifiedRecipe(fetchedRecipe);

        // 조회 기록 저장 (로그인한 사용자만)
        if (isAuthenticated && fetchedRecipe.dbId) {
          try {
            await recordRecipeView(fetchedRecipe.dbId);
            console.log("조회 기록 저장 완료:", fetchedRecipe.dbId);
          } catch (error) {
            // 조회 기록 저장 실패는 사용자 경험에 영향을 주지 않으므로 로그만 남김
            console.error("조회 기록 저장 실패:", error);
          }
        }

        // 레시피 ID (dbId)가 존재하면 리뷰와 댓글을 가져옵니다.
        if (fetchedRecipe.dbId) {
          // Promise.all을 사용하여 리뷰와 댓글을 병렬로 가져옵니다.
          const [reviewData, commentData] = await Promise.all([
            getReviewsByRecipeId(fetchedRecipe.dbId),
            getCommentsByRecipeId(fetchedRecipe.dbId),
          ]);
          setReviews(reviewData);
          setComments(commentData);
        } else {
          // dbId가 없으면 리뷰와 댓글을 비워둡니다.
          setReviews([]);
          setComments([]);
        }
      } catch (err: any) {
        console.error("데이터 로딩 실패:", err);
        setError(err.message || "데이터를 불러오는데 실패했습니다");
      } finally {
        setLoading(false);
        setReviewLoading(false);
        setCommentLoading(false);
      }
    };

    fetchData();

    // effect가 실행되었음을 기록하기 위해 클린업 함수에서 플래그를 설정합니다.
    return () => {
      effectRan.current = id || null; // 현재 로드한 레시피 ID 저장
    };
  }, [id]);

  // ingredients 문자열을 Ingredient[] 로 파싱 (두 번째 코드 유지)
  const parseIngredients = (ingredientsStr: string): Ingredient[] => {
    // 입력된 재료 문자열이 없으면 빈 배열 반환
    if (!ingredientsStr) return [];

    // 1. 전처리: 다양한 종류의 헤더/메타데이터를 먼저 제거하거나 쉼표로 바꿉니다.
    const cleanedStr = ingredientsStr
      .replace(/[>:]/g, ",") // '주재료 >', '•양념장 :' 같은 경우를 위해 > 와 : 를 쉼표로 변경
      .replace(/·/g, ",") // '·' 기호도 쉼표로 변경
      .replace(/^\[[\s\S]+?\]/g, "") // "[1인분]조선부추..." 와 같이 맨 앞에 오는 대괄호 헤더 제거
      .trim();

    // 2. 쉼표(,)와 줄바꿈(\n) 문자를 기준으로 재료 구문들을 분리합니다.
    return cleanedStr
      .split(/[,\n]/)
      .map((p) => p.trim()) // 각 구문의 앞뒤 공백 제거
      .filter((p) => {
        if (!p) return false; // 빈 문자열 필터링
        // 3. 헤더 형식 ((...)) 필터링: 소괄호로만 감싸진 구문은 헤더로 간주하여 제외합니다. (예: (반죽재료))
        const isHeader = p.startsWith("(") && p.endsWith(")");
        return !isHeader;
      })
      .map((phrase) => {
        // 4. 필터링된 각 구문에서 이름과 수량/단위 파싱
        let name = phrase;
        let amount = "";

        // 괄호가 포함된 수량 처리 (예: "명태포(40g)")
        const parenIndex = phrase.indexOf("(");
        if (parenIndex > 0) {
          name = phrase.substring(0, parenIndex).trim();
          amount = phrase.substring(parenIndex).trim();
        } else {
          // 이름과 수량을 분리하는 정규식 사용 (예: "돼지고기 300g")
          const match = phrase.match(/^([\s\S]+?)\s+([\d./].*)$/);
          if (match) {
            name = match[1].trim();
            amount = match[2].trim();
          }
        }
        return { name, amount };
      })
      .filter((item) => item.name); // 이름이 없는 최종 항목은 필터링
  };

  const ingredients = unifiedRecipe
    ? parseIngredients(unifiedRecipe.ingredients)
    : [];

  // 백엔드에서 받은 새로운 cookingSteps 배열을 프론트엔드 형식에 맞게 변환
  const cookingSteps: CookingStep[] =
    unifiedRecipe?.cookingSteps?.map((step) => ({
      id: step.step,
      title: `단계 ${step.step}`, // title은 자동으로 생성
      description: step.description,
      image: step.imageUrl || unifiedRecipe?.imageUrl || "", // 단계별 이미지가 없으면 레시피 대표 이미지 사용
    })) || [];

  const handleAddReview = async ({
    rating,
    content,
  }: {
    rating: number;
    content: string;
  }) => {
    if (!isAuthenticated || !user) {
      setReviewError("리뷰를 작성하려면 로그인이 필요합니다.");
      return;
    }

    // reviewCommentId를 사용합니다.
    const currentRecipeDbId = unifiedRecipe?.dbId;
    if (!currentRecipeDbId) {
      setReviewError("레시피 ID가 없어 리뷰를 추가할 수 없습니다.");
      return;
    }
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setReviewError(null);

      const newReviewData = {
        recipeId: currentRecipeDbId, // dbId 사용 (Integer 타입)
        userId: user.userId,
        rating: rating,
        comment: content,
      };

      const savedReview = await addReview(newReviewData);
      setReviews([savedReview, ...reviews]);
    } catch (err) {
      console.error("리뷰 추가 실패:", err);
      setReviewError(
        err instanceof Error ? err.message : "리뷰를 추가하는데 실패했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateReview = async (
    reviewId: number,
    data: { rating: number; content: string }
  ) => {
    try {
      const updatedReview = await updateReview(reviewId, {
        rating: data.rating,
        comment: data.content,
      });
      setReviews(
        reviews.map((r) => (r.reviewId === reviewId ? updatedReview : r))
      );
    } catch (err) {
      console.error("리뷰 수정 실패:", err);
      setReviewError(
        err instanceof Error ? err.message : "리뷰 수정에 실패했습니다."
      );
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    try {
      await deleteReview(reviewId);
      setReviews(reviews.filter((r) => r.reviewId !== reviewId));
    } catch (err) {
      console.error("리뷰 삭제 실패:", err);
      setReviewError(
        err instanceof Error ? err.message : "리뷰 삭제에 실패했습니다."
      );
    }
  };

  const handleEditClick = () => {
    // dbId는 이미 number 타입
    if (unifiedRecipe && unifiedRecipe.dbId) {
      navigate(`/recipe/edit/${unifiedRecipe.dbId}`);
    } else {
      alert("레시피를 수정할 수 없습니다. 유효한 레시피 ID가 없습니다.");
    }
  };

  const handleDeleteClick = async () => {
    if (!unifiedRecipe || !unifiedRecipe.dbId) {
      alert("레시피를 삭제할 수 없습니다. 유효한 레시피 ID가 없습니다.");
      return;
    }

    if (
      window.confirm(
        "정말로 이 레시피를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      try {
        await deleteRecipe(unifiedRecipe.dbId);
        alert("레시피가 성공적으로 삭제되었습니다.");
        navigate("/recipe/all"); // 올바른 레시피 목록 페이지 경로로 수정
      } catch (err) {
        console.error("레시피 삭제 실패:", err);
        alert(
          err instanceof Error ? err.message : "레시피 삭제에 실패했습니다."
        );
      }
    }
  };

  // 로딩 중
  if (loading) {
    return (
      <div className={styles.app}>
        <div className={styles.appContainer}>
          <div style={{ padding: "40px", textAlign: "center" }}>
            레시피를 불러오는 중...
          </div>
        </div>
      </div>
    );
  }

  // 에러 발생
  if (error || !unifiedRecipe) {
    return (
      <div className={styles.app}>
        <div className={styles.appContainer}>
          <button className={styles.backButton} onClick={() => navigate(-1)}>
            <ArrowLeft />
          </button>
          <div style={{ padding: "40px", textAlign: "center", color: "red" }}>
            {error || "레시피를 찾을 수 없습니다"}
          </div>
        </div>
      </div>
    );
  }

  const displayRecipeId = unifiedRecipe.dbId || parseInt(unifiedRecipe.id, 10);

  // 수정 및 삭제 권한 확인 로직
  let canEditOrDelete = false;
  if (isAuthenticated && user && unifiedRecipe) {
    // 시나리오 1: OpenAPI 레시피 또는 작성자 정보가 없는 레시피
    if (unifiedRecipe.userId === null || unifiedRecipe.userId === undefined) {
      // TO-DO: 실제 관리자 역할(role) 확인 로직 구현 필요.
      // 현재는 ID가 84인 사용자를 관리자로 가정합니다.
      if (user.userId === 84) {
        canEditOrDelete = true;
      }
    } else {
      // 로그인한 사용자가 레시피의 작성자인지 확인
      if (user.userId == unifiedRecipe.userId) {
        canEditOrDelete = true;
      }
    }
  }

  return (
    <div className={styles.app}>
      <div className={styles.appContainer}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <ArrowLeft />
        </button>
        <RecipeHeader
          title={unifiedRecipe.title}
          description={unifiedRecipe.description}
          image={unifiedRecipe.imageUrl}
          views={unifiedRecipe.viewCount || 0}
          rcpWay2={unifiedRecipe.rcpWay2}
          infoWgt={unifiedRecipe.infoWgt}
          initialLikes={unifiedRecipe.likeCount}
          recipeId={displayRecipeId}
          author={unifiedRecipe.author || ""}
          nickname={unifiedRecipe.nickname}
        />

        <div className={styles.viewControlsWrapper}>
          <ViewControls currentView={viewMode} onViewChange={setViewMode} />
        </div>

        <div className={styles.recipeContent}>
          <div className={styles.cookingStepsWrapper}>
            <CookingSteps steps={cookingSteps} viewMode={viewMode} />
          </div>
          {/* 수정 및 삭제 버튼 컨테이너 */}
          {canEditOrDelete && (
            <div className={styles.actionButtons}>
              <button className={styles.editButton} onClick={handleEditClick}>
                수정
              </button>
              <button
                className={`${styles.editButton} ${styles.deleteButton}`}
                onClick={handleDeleteClick}
              >
                삭제
              </button>
            </div>
          )}

          <div className={styles.ingredientsWrapper}>
            <IngredientsSection
              ingredients={ingredients}
              fridgeIngredientNames={fridgeIngredientNames}
            />
          </div>
        </div>

        <div className={styles.interactionSection}>
          <TabSelector
            activeTab={activeTab}
            onTabChange={setActiveTab}
            reviewCount={reviews.length}
            commentCount={comments.length}
          />

          {activeTab === "review" && (
            <div>
              {reviewLoading && (
                <p style={{ textAlign: "center", padding: "20px" }}>
                  리뷰를 불러오는 중...
                </p>
              )}
              {reviewError && (
                <p
                  style={{ color: "red", textAlign: "center", padding: "20px" }}
                >
                  {reviewError}
                </p>
              )}
              {!reviewLoading && !reviewError && (
                <ReviewSection
                  reviews={reviews}
                  onAddReview={handleAddReview}
                  currentUser={user}
                  onUpdate={handleUpdateReview}
                  onDelete={handleDeleteReview}
                  userHasReviewed={userHasReviewed}
                />
              )}
            </div>
          )}
          {activeTab === "comment" && displayRecipeId && (
            <CommentSection
              recipeId={displayRecipeId}
              currentUser={user}
              comments={comments}
              loading={commentLoading}
              error={commentError}
              setComments={setComments}
              userHasCommented={userHasCommented}
            />
          )}
        </div>
      </div>
    </div>
  );
}
