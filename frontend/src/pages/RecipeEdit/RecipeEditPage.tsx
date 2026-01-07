import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './RecipeEditPage.module.css';
import RecipeImageUploader from '../RecipeRegister/components/RecipeImageUploader/RecipeImageUploader';
import RecipeBasicInfo from './components/RecipeBasicInfo/RecipeBasicInfo'; // Corrected path
import RecipeIngredients from '../RecipeRegister/components/RecipeIngredients/RecipeIngredients';
import RecipeSteps from '../RecipeRegister/components/RecipeSteps/RecipeSteps';
import RecipeEditActions from './components/RecipeEditActions/RecipeEditActions';
import { getRecipeById, updateRecipe, type UnifiedRecipe, type RecipeRequest } from '../../api/recipeApi';

// 폼 컴포넌트들이 사용하는 데이터 타입 정의
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
  rcpWay2: string; // Renamed from cookTime
  rcpPat2: string; // Renamed from difficulty
  servings: string;
  ingredients: Ingredient[];
  steps: Step[];
}

// API 응답(UnifiedRecipe)을 폼 데이터(RecipeFormDataType)로 변환하는 함수
const convertApiToFormData = (apiData: UnifiedRecipe): RecipeFormDataType => {
  const parseIngredients = (ingredientsStr: string): Ingredient[] => {
    if (!ingredientsStr) return [{ id: Date.now(), name: '', quantity: '', unit: '' }];
    return ingredientsStr.split(',').map((ing, index) => {
      const parts = ing.trim().match(/^([\S\s]+?)\s+([\d.]+)\s*(\S*)$/) || [];
      return {
        id: Date.now() + index,
        name: parts[1] || ing.trim(),
        quantity: parts[2] || '',
        unit: parts[3] || '',
      };
    });
  };

  const parsedIngredients = parseIngredients(apiData.ingredients);

  // servings 데이터 정규화 로직 개선
  let servingsValue = (apiData.infoWgt || '').trim();
  const servingsNum = parseInt(servingsValue, 10);

  if (servingsValue.includes('인분')) {
    // "N인분" 형식은 그대로 사용
  } else if (servingsValue === '기타') {
    // "기타"는 그대로 사용
  } else if (!isNaN(servingsNum) && String(servingsNum) === servingsValue && servingsNum >= 1 && servingsNum < 10) {
    // 숫자 값(1-9)은 "N인분"으로 변환
    servingsValue = `${servingsNum}인분`;
  } else {
    // 그 외의 경우 (예: 칼로리 값)는 빈 문자열로 처리하여 드롭다운에 매칭되지 않도록 함
    servingsValue = '';
  }

  return {
    image: apiData.imageUrl,
    title: apiData.title,
    description: apiData.description,
    rcpWay2: apiData.rcpWay2 || '', 
    rcpPat2: apiData.rcpPat2 || '', 
    servings: servingsValue, // 정규화된 값 사용
    ingredients: parsedIngredients.length > 0 ? parsedIngredients : [{ id: Date.now(), name: '', quantity: '', unit: '' }],
    steps: apiData.cookingSteps?.map(step => ({
      id: step.step,
      description: step.description,
      imageUrl: step.imageUrl || null,
    })) || [{ id: Date.now(), description: '', imageUrl: null }],
  };
};

// 폼 데이터(RecipeFormDataType)를 API 요청(RecipeRequest) 형식으로 변환하는 함수
const convertToBackendFormat = (frontendData: RecipeFormDataType): RecipeRequest => {
  const formatIngredients = (ingredients: Ingredient[]): string => {
    return ingredients
      .filter(ing => ing.name.trim())
      .map(ing => `${ing.name} ${ing.quantity}${ing.unit}`)
      .join(', ');
  };
  
  const backendData: RecipeRequest = {
    rcpNm: frontendData.title.trim(),
    rcpNaTip: frontendData.description.trim() || undefined,
    rcpWay2: frontendData.rcpWay2, // Uses rcpWay2
    rcpPat2: frontendData.rcpPat2 || undefined, // Uses rcpPat2
    rcpPartsDtls: formatIngredients(frontendData.ingredients) || undefined,
    attFileNoMain: frontendData.image ?? undefined,
    infoWgt: frontendData.servings || undefined,
  };

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


const RecipeEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [recipeData, setRecipeData] = useState<RecipeFormDataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipeData = async () => {
      if (!id) {
        setError("레시피 ID가 제공되지 않았습니다.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const numericId = parseInt(id, 10);
        const apiData = await getRecipeById(numericId);
        const formData = convertApiToFormData(apiData);
        setRecipeData(formData);
      } catch (err) {
        console.error("레시피 데이터 로딩 실패:", err);
        setError("레시피 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeData();
  }, [id]);

  const handleRecipeDataChange = <
    K extends keyof RecipeFormDataType,
    V extends RecipeFormDataType[K]
  >(
    key: K,
    value: V
  ) => {
    setRecipeData((prevData) => {
      if (!prevData) return null;
      return {
        ...prevData,
        [key]: value,
      };
    });
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSave = async () => {
    if (!id || !recipeData) {
      alert("수정할 레시피 정보가 올바르지 않습니다.");
      return;
    }

    try {
      const backendData = convertToBackendFormat(recipeData);
      await updateRecipe(parseInt(id, 10), backendData);
      alert('레시피가 성공적으로 수정되었습니다!');
      navigate(`/recipe/${id}`);
    } catch (err) {
      console.error(`레시피 (ID: ${id}) 수정 실패:`, err);
      alert("레시피 수정에 실패했습니다.");
    }
  };

  if (loading) {
    return <div className={styles.pageContainer}>로딩 중...</div>;
  }
  
  if (error) {
    return <div className={styles.pageContainer}>{error}</div>;
  }

  if (!recipeData) {
    return <div className={styles.pageContainer}>레시피 데이터를 찾을 수 없습니다.</div>;
  }
  
  return (
    <div className={styles.pageContainer}>
      <main className={styles.main}>
        <div className={styles.contentWrapper}>
          <div className={styles.header}>
            <h2 className={styles.title}>레시피 수정하기</h2>
            <p className={styles.subtitle}>
              레시피 정보를 수정하고 저장하세요.
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
              rcpWay2={recipeData.rcpWay2}
              rcpPat2={recipeData.rcpPat2}
              servings={recipeData.servings}
              onTitleChange={(title) => handleRecipeDataChange('title', title)}
              onDescriptionChange={(desc) => handleRecipeDataChange('description', desc)}
              onRcpWay2Change={(way2) => handleRecipeDataChange('rcpWay2', way2)}
              onRcpPat2Change={(pat2) => handleRecipeDataChange('rcpPat2', pat2)}
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
            <RecipeEditActions
              onCancel={handleCancel}
              onSave={handleSave}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecipeEditPage;