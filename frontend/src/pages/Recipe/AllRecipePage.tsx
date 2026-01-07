import { useState, useEffect } from 'react';
import RecipeHero from './AllRecipePage/components/RecipeHero/RecipeHero';
import RecipeSearchFilter from './AllRecipePage/components/RecipeSearchFilter/RecipeSearchFilter';
import RecipeGrid from './AllRecipePage/components/RecipeGrid/RecipeGrid';
import { searchRecipes, type UnifiedRecipe, type Page } from '../../api/recipeApi';

const AllRecipePage = () => {
  const [recipes, setRecipes] = useState<UnifiedRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // 검색 파라미터 상태
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    rcpPat2: '', // 카테고리 필터
  });

  useEffect(() => {
    const fetchAndSetRecipes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result: Page<UnifiedRecipe> = await searchRecipes({
          keyword: searchParams.keyword,
          rcpPat2: searchParams.rcpPat2,
          page: currentPage,
          size: 12, // 한 페이지에 12개씩
        });
        setRecipes(result.content);
        setTotalPages(result.totalPages);
        setTotalElements(result.totalElements);
      } catch (err) {
        setError(err instanceof Error ? err.message : '레시피를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndSetRecipes();
  }, [searchParams, currentPage]);

  const handleSearch = (keyword: string) => {
    setCurrentPage(0); // 검색 시 첫 페이지로 리셋
    setSearchParams(prev => ({ ...prev, keyword }));
  };

  const handleCategoryChange = (category: string) => {
    setCurrentPage(0); // 카테고리 변경 시 첫 페이지로 리셋
    // '전체' 탭은 rcpPat2 값을 비워 모든 카테고리를 검색하도록 함
    setSearchParams(prev => ({ ...prev, rcpPat2: category === '전체' ? '' : category }));
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <RecipeHero />
      <RecipeSearchFilter 
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
        initialCategory={searchParams.rcpPat2 || '전체'}
      />
      <RecipeGrid 
        recipes={recipes}
        isLoading={isLoading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalElements={totalElements}
      />
    </div>
  );
};

export default AllRecipePage;
