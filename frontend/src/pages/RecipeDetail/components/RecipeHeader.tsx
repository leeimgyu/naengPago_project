import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Heart, CookingPot, Utensils, Pencil } from "lucide-react"; // Clock, Users 아이콘 추가
import styles from "./RecipeHeader.module.css";
import { toggleRecipeLike, isRecipeLikedByUser } from "../../../api/recipeApi";
import { useAuth } from "../../../hooks/useAuth";

interface RecipeHeaderProps {
  title: string;
  description: string;
  image: string;
  views: number;
  rcpWay2?: string; // cookingTime -> rcpWay2
  infoWgt?: string; // infoWgt 추가
  initialLikes: number;
  recipeId: number;
  author: string; // author 필드 추가
  nickname?: string; // nickname 필드 추가
}

const BACKEND_URL = "http://localhost:8080"; // 백엔드 서버 URL 정의

export const RecipeHeader: React.FC<RecipeHeaderProps> = ({
  title,
  description,
  image,
  views,
  rcpWay2, // prop 받기
  infoWgt, // infoWgt prop 받기
  initialLikes,
  recipeId,
  author, // author prop 받기
  nickname, // nickname prop 받기
}) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const authorToDisplay = nickname ?? author ?? "운영자";
  // 이미지 URL이 'http'로 시작하면 그대로 사용하고, 그렇지 않으면 백엔드 URL을 앞에 붙여 절대 경로로 만듭니다.
  const fullImageUrl = image
    ? image.startsWith("http")
      ? image
      : `${BACKEND_URL}${image}`
    : "";

  // 컴포넌트 마운트 시 또는 initialLikes 변경 시 likes 상태 업데이트
  useEffect(() => {
    setLikes(initialLikes);
  }, [initialLikes]);

  // 컴포넌트 마운트 시 좋아요 상태 확인
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!isAuthenticated || !user?.userId) return;
      try {
        const liked = await isRecipeLikedByUser(recipeId);
        setIsLiked(liked);
      } catch (err) {
        console.error("좋아요 상태 확인 실패:", err);
        setIsLiked(false);
      }
    };

    checkLikeStatus();
  }, [recipeId, user?.userId, isAuthenticated]);

  const handleLikeClick = async () => {
    if (isLoading) return;

    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    try {
      setIsLoading(true);
      const updatedRecipe = await toggleRecipeLike(recipeId);
      setLikes(updatedRecipe.likeCount);
      setIsLiked(!isLiked);
    } catch (err) {
      console.error("좋아요 처리 실패:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  const goToLoginPage = () => {
    navigate("/login");
  };

  return (
    <>
      <div className={styles.recipeHeader}>
        <div className={styles.recipeHeaderImage}>
          {/* 절대 경로 이미지 URL을 사용하여 이미지를 표시합니다. */}
          <img src={fullImageUrl} alt={title} />
        </div>
        <div className={styles.recipeHeaderContent}>
          <h1 className={styles.recipeTitle}>{title}</h1>
          <p className={styles.recipeDescription}>{description}</p>
          <div className={styles.recipeMeta}>
            <span className={styles.metaItem}>
              <Pencil size={16} />
              <span>{authorToDisplay}</span>
            </span>
             <span>
              {rcpWay2 && (
                <span className={styles.metaItem}>
                  <CookingPot size={16} />
                  <span>{rcpWay2}</span>
                </span>
              )}
            </span>
            <span className={styles.recipeMeta}>{renderInfoWgt(infoWgt)}</span>
            <span className={styles.metaItem}>
              <Eye size={16} />
              <span>조회 {views.toLocaleString()}</span>
            </span>
            <span
              className={`${styles.metaItem} ${styles.heartItem} ${
                isLiked ? styles.liked : ""
              }`}
              onClick={handleLikeClick}
            >
              <Heart size={16} fill={isLiked ? "#ff4d4f" : "none"} />
              <span>{likes.toLocaleString()}</span>
            </span>
          </div>
        </div>
      </div>

      {showLoginModal && (
        <div className={styles.modalBackdrop} onClick={closeLoginModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>로그인 필요</h2>
            <p>좋아요 기능은 로그인 후 이용 가능합니다.</p>
            <div className={styles.modalActions}>
              <button onClick={goToLoginPage} className={styles.loginButton}>
                로그인
              </button>
              <button onClick={closeLoginModal} className={styles.closeButton}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

function renderInfoWgt(infoWgt: string | undefined) {
  if (!infoWgt || infoWgt.toLowerCase() === 'nan') {
    return null;
  }

  // '기타' 또는 '인분'을 포함하는 경우 동일한 아이콘으로 렌더링
  if (infoWgt.includes('인분') || infoWgt === '기타') {
    return (
      <span className={styles.metaItem}>
        <CookingPot size={16} />
        <span>{infoWgt}</span>
      </span>
    );
  }

  const calories = parseFloat(infoWgt);
  if (!isNaN(calories)) {
    return (
      <span className={styles.metaItem}>
        <Utensils size={16} />
        <span>{`${Math.round(calories)} kcal`}</span>
      </span>
    );
  }

  return null;
}
