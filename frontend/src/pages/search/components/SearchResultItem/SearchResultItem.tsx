import { Clock, Heart } from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import styles from './SearchResultItem.module.css';

export interface SearchResult {
  id: string;
  type: 'recipe' | 'ingredient' | 'post';
  title: string;
  description: string;
  thumbnail?: string;
  category: string;
  likes?: number;
  cookTime?: string;
}

interface SearchResultItemProps {
  result: SearchResult;
  searchQuery: string;
  onClick: () => void;
}

export function SearchResultItem({ result, searchQuery, onClick }: SearchResultItemProps) {
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className={styles.highlight}>{part}</span>
      ) : (
        part
      )
    );
  };

  const getCategoryLabel = (type: string) => {
    switch (type) {
      case 'recipe':
        return '레시피';
      case 'ingredient':
        return '재료';
      case 'post':
        return '게시글';
      default:
        return '';
    }
  };

  return (
    <div className={styles.resultItem} onClick={onClick}>
      {result.thumbnail && (
        <ImageWithFallback
          src={result.thumbnail}
          alt={result.title}
          className={styles.thumbnail}
        />
      )}
      <div className={styles.content}>
        <span className={styles.category}>{getCategoryLabel(result.type)}</span>
        <h3 className={styles.title}>
          {highlightText(result.title, searchQuery)}
        </h3>
        <p className={styles.description}>{result.description}</p>
        <div className={styles.meta}>
          {result.cookTime && (
            <span className={styles.metaItem}>
              <Clock />
              {result.cookTime}
            </span>
          )}
          {result.likes !== undefined && (
            <span className={styles.metaItem}>
              <Heart />
              {result.likes}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
