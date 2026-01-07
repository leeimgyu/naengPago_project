import styles from './RecipePagination.module.css';

interface RecipePaginationProps {
  currentPage: number; // 0-indexed from parent
  totalPages: number;
  onPageChange: (page: number) => void; // Expects 0-indexed page
}

const PAGE_GROUP_SIZE = 5;

const RecipePagination = ({ currentPage, totalPages, onPageChange }: RecipePaginationProps) => {
  // Convert 0-indexed currentPage to 1-indexed for UI logic
  const uiCurrentPage = currentPage + 1;

  const startPage = Math.floor((uiCurrentPage - 1) / PAGE_GROUP_SIZE) * PAGE_GROUP_SIZE + 1;
  const endPage = Math.min(startPage + PAGE_GROUP_SIZE - 1, totalPages);

  const renderPageButtons = () => {
    const buttons = [];
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`${styles['page-btn']} ${uiCurrentPage === i ? styles.active : ''}`}
          onClick={() => onPageChange(i - 1)} // Convert back to 0-indexed for parent
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  const handlePrevGroup = () => {
    const prevGroupPage = startPage - 1;
    if (prevGroupPage > 0) {
      onPageChange(prevGroupPage - 1); // Convert back to 0-indexed
    }
  };

  const handleNextGroup = () => {
    const nextGroupPage = endPage + 1;
    if (nextGroupPage <= totalPages) {
      onPageChange(nextGroupPage - 1); // Convert back to 0-indexed
    }
  };

  return (
    <div className={styles.pagination}>
      <button
        className={`${styles['page-btn']} ${styles.arrow}`}
        onClick={handlePrevGroup}
        disabled={startPage === 1}
      >
        ‹
      </button>
      {renderPageButtons()}
      <button
        className={`${styles['page-btn']} ${styles.arrow}`}
        onClick={handleNextGroup}
        disabled={endPage >= totalPages}
      >
        ›
      </button>
    </div>
  );
};

export default RecipePagination;
