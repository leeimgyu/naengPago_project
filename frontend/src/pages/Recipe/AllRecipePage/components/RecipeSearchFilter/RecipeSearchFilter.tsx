import { useState, useEffect } from 'react';
import styles from './RecipeSearchFilter.module.css';

const FILTER_TABS = ['전체', '밥', '국&찌개', '후식', '반찬', '일품', '기타'];
const INGREDIENT_TAGS = [
  '닭고기', '소고기', '돼지고기', '해산물', '달걀', '두부', '버섯', '브로콜리',
  '당근', '양파', '감자', '고구마'
];

interface RecipeSearchFilterProps {
  onSearch: (keyword: string) => void;
  onCategoryChange: (category: string) => void;
  initialCategory: string;
}

const RecipeSearchFilter = ({ onSearch, onCategoryChange, initialCategory }: RecipeSearchFilterProps) => {
  const [activeTab, setActiveTab] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState('');

  // 부모 컴포넌트에서 카테고리 변경 시 activeTab 업데이트
  useEffect(() => {
    setActiveTab(initialCategory);
  }, [initialCategory]);

  const handleCategoryClick = (tab: string) => {
    setActiveTab(tab);
    onCategoryChange(tab);
    // 카테고리 변경 시 검색어도 초기화 (선택적)
    setSearchTerm('');
    onSearch('');
  };

  const handleIngredientClick = (ingredient: string) => {
    setSearchTerm(ingredient);
    onSearch(ingredient);
  };

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={styles['search-section']}>
      <div className={styles['search-box']}>
        <input
          type="text"
          className={styles['search-input']}
          placeholder="레시피 이름이나 재료를 검색해보세요 (예: 비빔밥, 닭가슴살, 브로콜리)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className={styles['search-btn']} onClick={handleSearch}>검색</button>
      </div>

      <div className={styles['filter-tabs']}>
        {FILTER_TABS.map(tab => (
          <div
            key={tab}
            className={`${styles['filter-tab']} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => handleCategoryClick(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      <div className={styles['ingredient-filter']}>
        <h3>🥬 주요 재료로 검색</h3>
        <div className={styles['ingredient-tags']}>
          {INGREDIENT_TAGS.map(tag => (
            <div
              key={tag}
              className={`${styles['ingredient-tag']}`} 
              onClick={() => handleIngredientClick(tag)}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeSearchFilter;
