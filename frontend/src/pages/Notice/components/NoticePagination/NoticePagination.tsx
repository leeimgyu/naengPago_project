
import styles from './NoticePagination.module.css';

interface NoticePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function NoticePagination({ currentPage, totalPages, onPageChange }: NoticePaginationProps) {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className={styles.pagination}>
      <button
        className={styles.pageBtn}
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        ‹‹
      </button>
      <button
        className={styles.pageBtn}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ‹
      </button>
      {pageNumbers.map(number => (
        <button
          key={number}
          className={`${styles.pageBtn} ${number === currentPage ? styles.active : ''}`}
          onClick={() => onPageChange(number)}
        >
          {number}
        </button>
      ))}
      <button
        className={styles.pageBtn}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        ›
      </button>
      <button
        className={styles.pageBtn}
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        ››
      </button>
    </div>
  );
}

export default NoticePagination;
