import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RecipeRegisterPage.module.css';
import RecipeImageUploader from './components/RecipeImageUploader/RecipeImageUploader';
import RecipeBasicInfo from './components/RecipeBasicInfo/RecipeBasicInfo';
import RecipeIngredients from './components/RecipeIngredients/RecipeIngredients';
import RecipeSteps from './components/RecipeSteps/RecipeSteps';
import RecipeRegisterActions from './components/RecipeRegisterActions/RecipeRegisterActions';
import { createRecipe, type RecipeRequest } from '../../api/recipeApi';

interface Ingredient {
  id: number;
  name: string;
  quantity: string;
  unit: string;
}

interface Step {
  id: number;
  description: string;
  imageUrl: string | null;
}

interface RecipeFormDataType {
  image: string | null;
  title: string;
  description: string;
  cookTime: string;
  difficulty: string;
  servings: string;
  ingredients: Ingredient[];
  steps: Step[];
}

const initialRecipeData: RecipeFormDataType = {
  image: null,
  title: '',
  description: '',
  cookTime: '',
  difficulty: '',
  servings: '',
  ingredients: [{ id: Date.now(), name: '', quantity: '', unit: '' }],
  steps: [{ id: Date.now(), description: '', imageUrl: null }],
};

// 재료 배열을 문자열로 변환
const formatIngredients = (ingredients: Ingredient[]): string => {
  return ingredients
    .filter(ing => ing.name.trim()) // 빈 재료는 제외
    .map(ing => `${ing.name} ${ing.quantity}${ing.unit}`)
    .join(', ');
};

// 프론트엔드 데이터를 백엔드 형식으로 변환
const convertToBackendFormat = (frontendData: RecipeFormDataType): RecipeRequest => {
  // cookTime과 servings는 문자열 그대로 사용
  const cookTime = frontendData.cookTime || undefined;
  const servings = frontendData.servings || undefined;

  const backendData: RecipeRequest = {
    rcpNm: frontendData.title.trim(),
    rcpNaTip: frontendData.description.trim() || undefined, // 빈 문자열이면 undefined로
    rcpWay2: cookTime, // 숫자 문자열 또는 undefined
    rcpPat2: frontendData.difficulty || undefined, // 빈 문자열이면 undefined로
    rcpPartsDtls: formatIngredients(frontendData.ingredients) || undefined, // 빈 문자열이면 undefined로
    attFileNoMain: frontendData.image ?? undefined, // null을 undefined로 변환
    infoWgt: servings, // 숫자 문자열 또는 undefined
  };

  // 조리 단계(manual) 및 이미지(manualImg) 동적 할당
  frontendData.steps.forEach((step, index) => {
    if (index < 20) {
      const stepNumber = String(index + 1).padStart(2, '0');
      if (step.description.trim()) {
        (backendData as any)[`manual${stepNumber}`] = step.description.trim();
      }
      if (step.imageUrl) {
        (backendData as any)[`manualImg${stepNumber}`] = step.imageUrl;
      }
    }
  });

  return backendData;
};

// 입력 데이터 검증
const validateRecipeData = (data: RecipeFormDataType): { isValid: boolean; message: string } => {
  // 제목 검증
  if (!data.title.trim()) {
    return { isValid: false, message: '레시피 제목을 입력해주세요.' };
  }

  if (data.title.trim().length > 200) {
    return { isValid: false, message: '레시피 제목은 200자 이하로 입력해주세요.' };
  }

  // 조리 방법 (cookTime) 검증
  if (!data.cookTime) {
    return { isValid: false, message: '요리 방법을 선택해주세요.' };
  }

  // 요리 종류(difficulty) 검증
  if (!data.difficulty) {
    return { isValid: false, message: '요리 종류를 선택해주세요.' };
  }

  // 인분 검증
  if (!data.servings) {
    return { isValid: false, message: '분량을 선택해주세요.' };
  }

  // 재료 검증
  const validIngredients = data.ingredients.filter(ing => ing.name.trim());
  if (validIngredients.length === 0) {
    return { isValid: false, message: '최소 1개 이상의 재료를 입력해주세요.' };
  }

  // 조리 단계 검증
  const validSteps = data.steps.filter(step => step.description.trim());
  if (validSteps.length === 0) {
    return { isValid: false, message: '최소 1개 이상의 조리 단계를 입력해주세요.' };
  }

  return { isValid: true, message: '' };
};

const RecipeRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [recipeData, setRecipeData] = useState<RecipeFormDataType>(initialRecipeData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRecipeDataChange = <
    K extends keyof RecipeFormDataType,
    V extends RecipeFormDataType[K]
  >(
    key: K,
    value: V
  ) => {
    setRecipeData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleCancel = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  const handleRegister = async () => {
    // 중복 제출 방지
    if (isSubmitting) {
      return;
    }

    // 입력 데이터 검증
    const validation = validateRecipeData(recipeData);
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    try {
      setIsSubmitting(true);

      // 프론트엔드 데이터를 백엔드 형식으로 변환
      const backendData = convertToBackendFormat(recipeData);

      console.log('레시피 등록 요청 데이터:', backendData);

      // API 호출
      const response = await createRecipe(backendData);

      console.log('레시피 등록 성공:', response);

      // 성공 처리
      alert('레시피가 성공적으로 등록되었습니다!');
      navigate('/recipe/all'); // 등록 후 레시피 전체 목록 페이지로 이동
    } catch (error) {
      console.error('레시피 등록 실패:', error);

      if (error instanceof Error) {
        // 인증 에러인 경우 로그인 페이지로 이동
        if (error.message.includes('로그인이 필요') || error.message.includes('인증이 만료')) {
          if (confirm(`${error.message}\n로그인 페이지로 이동하시겠습니까?`)) {
            navigate('/login');
            return;
          }
        }
        alert(`레시피 등록 중 오류가 발생했습니다.\n${error.message}`);
      } else {
        alert('레시피 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <main className={styles.main}>
        <div className={styles.contentWrapper}>
          <div className={styles.header}>
            <h2 className={styles.title}>나만의 레시피 등록하기</h2>
            <p className={styles.subtitle}>
              자신만의 특별한 레시피를 공유하고 사람들과 소통해보세요.
            </p>
          </div>
          <div className={styles.formWrapper}>
            <RecipeImageUploader
              image={recipeData.image}
              onImageChange={(image) => handleRecipeDataChange('image', image)}
            />
            <RecipeBasicInfo
              title={recipeData.title}
              description={recipeData.description}
              cookTime={recipeData.cookTime}
              difficulty={recipeData.difficulty}
              servings={recipeData.servings}
              onTitleChange={(title) => handleRecipeDataChange('title', title)}
              onDescriptionChange={(desc) => handleRecipeDataChange('description', desc)}
              onCookTimeChange={(time) => handleRecipeDataChange('cookTime', time)}
              onDifficultyChange={(diff) => handleRecipeDataChange('difficulty', diff)}
              onServingsChange={(serv) => handleRecipeDataChange('servings', serv)}
            />
            <RecipeIngredients
              ingredients={recipeData.ingredients}
              onIngredientsChange={(ingredients) => handleRecipeDataChange('ingredients', ingredients)}
            />
            <RecipeSteps
              steps={recipeData.steps}
              onStepsChange={(steps) => handleRecipeDataChange('steps', steps)}
            />
            <RecipeRegisterActions
              onCancel={handleCancel}
              onRegister={handleRegister}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecipeRegisterPage;