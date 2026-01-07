
import { SearchX } from 'lucide-react';
import { SearchResultItem, type SearchResult } from '../SearchResultItem/SearchResultItem';
import styles from './SearchResults.module.css';

interface SearchResultsProps {
  results: SearchResult[];
  searchQuery: string;
  onResultClick: (result: SearchResult) => void;
}

export function SearchResults({ results, searchQuery, onResultClick }: SearchResultsProps) {
  if (results.length === 0 && searchQuery) {
    return (
      <div className={styles.results}>
        <div className={styles.empty}>
          <SearchX className={styles.emptyIcon} />
          <h3>검색 결과가 없습니다</h3>
          <p>
            다른 검색어를 입력하시거나<br />
            철자를 확인해 주세요
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.results}>
      <div className={styles.resultsList}>
        {results.map((result) => (
          <SearchResultItem
            key={result.id}
            result={result}
            searchQuery={searchQuery}
            onClick={() => onResultClick(result)}
          />
        ))}
      </div>
    </div>
  );
}
