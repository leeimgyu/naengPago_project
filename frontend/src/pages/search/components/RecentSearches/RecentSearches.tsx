
import { Clock, X } from 'lucide-react';
import styles from './RecentSearches.module.css';

interface RecentSearchesProps {
  searches: string[];
  onSearchClick: (search: string) => void;
  onRemove: (search: string) => void;
  onClearAll: () => void;
}

export function RecentSearches({ searches, onSearchClick, onRemove, onClearAll }: RecentSearchesProps) {
  const popularSearches = ['김치찌개', '된장국', '계란', '우유', '닭가슴살', '토마토'];

  return (
    <>
      {searches.length > 0 && (
        <div className={styles.recentSearches}>
          <div className={styles.header}>
            <h3>최근 검색어</h3>
            <button className={styles.clearAll} onClick={onClearAll}>
              전체 삭제
            </button>
          </div>
          <div className={styles.searchList}>
            {searches.map((search, index) => (
              <div
                key={index}
                className={styles.searchItem}
                onClick={() => onSearchClick(search)}
              >
                <Clock className={styles.searchIcon} />
                <span className={styles.searchText}>{search}</span>
                <button
                  className={styles.removeButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(search);
                  }}
                  aria-label="Remove search"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className={styles.popularSearches}>
        <h3>인기 검색어</h3>
        <div className={styles.popularTags}>
          {popularSearches.map((tag, index) => (
            <button
              key={index}
              className={styles.popularTag}
              onClick={() => onSearchClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
