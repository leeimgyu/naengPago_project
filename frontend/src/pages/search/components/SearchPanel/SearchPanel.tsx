import { useState } from 'react';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchFilters } from '../SearchFilters/SearchFilters';
import type { SearchCategory } from '../SearchFilters/SearchFilters';
import { RecentSearches } from '../RecentSearches/RecentSearches';
import { SearchResults } from '../SearchResults/SearchResults';
import type { SearchResult } from '../SearchResultItem/SearchResultItem';
import styles from './SearchPanel.module.css';

// Mock 데이터 (SearchPage와 동일)
const mockResults: SearchResult[] = [
  {
    id: '1',
    type: 'recipe',
    title: '김치찌개 레시피',
    description: '맛있는 김치찌개를 만드는 방법입니다. 신김치와 돼지고기를 활용한 깊은 맛의 김치찌개를 소개합니다.',
    thumbnail: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400',
    category: '한식',
    cookTime: '30분',
    likes: 245,
  },
  {
    id: '2',
    type: 'recipe',
    title: '계란말이',
    description: '부드럽고 폭신한 계란말이 만들기. 아침 식사나 도시락 반찬으로 좋은 기본 계란말이 레시피입니다.',
    thumbnail: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400',
    category: '반찬',
    cookTime: '15분',
    likes: 189,
  },
  {
    id: '3',
    type: 'ingredient',
    title: '계란',
    description: '냉장고 식재료 - 유통기한 D-5',
    category: '식재료',
  },
  {
    id: '4',
    type: 'recipe',
    title: '토마토 계란 볶음',
    description: '중국식 토마토 계란 볶음 요리. 새콤달콤한 토마토와 부드러운 계란의 조화가 일품입니다.',
    thumbnail: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400',
    category: '중식',
    cookTime: '20분',
    likes: 156,
  },
];

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchPanel({ isOpen, onClose }: SearchPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SearchCategory>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>(['김치찌개', '계란', '토마토']);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    setHasSearched(true);
    
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s !== searchQuery);
      return [searchQuery, ...filtered].slice(0, 10);
    });

    const results = mockResults.filter(result =>
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setSearchResults(results);
  };

  const handleClear = () => {
    setSearchQuery('');
    setHasSearched(false);
    setSearchResults([]);
  };

  const handleRecentSearchClick = (search: string) => {
    setSearchQuery(search);
    setHasSearched(true);
    
    const results = mockResults.filter(result =>
      result.title.toLowerCase().includes(search.toLowerCase()) ||
      result.description.toLowerCase().includes(search.toLowerCase())
    );
    
    setSearchResults(results);
  };

  const handleRemoveRecentSearch = (search: string) => {
    setRecentSearches(prev => prev.filter(s => s !== search));
  };

  const handleClearAllRecentSearches = () => {
    setRecentSearches([]);
  };

  const handleResultClick = (result: SearchResult) => {
    console.log('Result clicked:', result);
    onClose(); // 패널 닫기
  };

  const filteredResults = searchResults.filter(result => {
    if (activeFilter === 'all') return true;
    return result.type === activeFilter;
  });

  if (!isOpen) return null;

  return (
    <div className={styles.searchPanel} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h1 className={styles.title}>통합검색</h1>
          <p className={styles.subtitle}>냉장고 속 재료로 만들 수 있는 레시피를 찾아보세요</p>
        </div>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
          onClear={handleClear}
        />

        {!hasSearched ? (
          <>
            <RecentSearches
              searches={recentSearches}
              onSearchClick={handleRecentSearchClick}
              onRemove={handleRemoveRecentSearch}
              onClearAll={handleClearAllRecentSearches}
            />
          </>
        ) : (
          <>
            <SearchFilters
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              resultCount={filteredResults.length}
              searchQuery={searchQuery}
            />
            <SearchResults
              results={filteredResults}
              searchQuery={searchQuery}
              onResultClick={handleResultClick}
            />
          </>
        )}
      </div>
    </div>
  );
}
