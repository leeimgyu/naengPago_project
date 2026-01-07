import React from 'react';
import { Search, X } from 'lucide-react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

export function SearchBar({ value, onChange, onSearch, onClear }: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className={styles.searchBar}>
      <div className={styles.searchBarInner}>
        <form className={styles.searchForm} onSubmit={handleSubmit}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="레시피, 재료, 게시글 검색..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            autoFocus
          />
          {value && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={onClear}
              aria-label="Clear search"
            >
              <X size={20} />
            </button>
          )}
          <button type="submit" className={styles.searchButton}>
            검색
          </button>
        </form>
      </div>
    </div>
  );
}
