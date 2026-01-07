
import styles from './SearchFilters.module.css';

export type SearchCategory = 'all' | 'recipe' | 'ingredient' | 'post';

interface SearchFiltersProps {
  activeFilter: SearchCategory;
  onFilterChange: (filter: SearchCategory) => void;
  resultCount: number;
  searchQuery: string;
}

export function SearchFilters({ activeFilter, onFilterChange, resultCount, searchQuery }: SearchFiltersProps) {
  const filters: { id: SearchCategory; label: string }[] = [
    { id: 'all', label: '전체' },
    { id: 'recipe', label: '레시피' },
    { id: 'ingredient', label: '재료' },
    { id: 'post', label: '게시글' },
  ];

  return (
    <div className={styles.filters}>
      <div className={styles.filterTabs}>
        {filters.map((filter) => (
          <button
            key={filter.id}
            className={`${styles.filterTab} ${activeFilter === filter.id ? styles.active : ''}`}
            onClick={() => onFilterChange(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>
      {searchQuery && (
        <div className={styles.resultCount}>
          '<span>{searchQuery}</span>' 검색 결과 <span>{resultCount}</span>개
        </div>
      )}
    </div>
  );
}
