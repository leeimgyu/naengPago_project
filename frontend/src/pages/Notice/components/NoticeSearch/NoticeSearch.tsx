
import styles from './NoticeSearch.module.css';

interface NoticeSearchProps {
  totalCount: number;
  searchCategory: '제목' | '내용' | '제목+내용' | '구분';
  setSearchCategory: (category: '제목' | '내용' | '제목+내용' | '구분') => void;
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
}

function NoticeSearch({ totalCount, searchCategory, setSearchCategory, searchKeyword, setSearchKeyword }: NoticeSearchProps) {
  const handleSearch = () => {
    // 검색 로직은 NoticePage에서 처리되므로 여기서는 상태만 업데이트
    // NoticePage의 useEffect가 searchKeyword 변경을 감지하여 필터링
  };

  return (
    <div className={styles.boardControls}>
      <div className={styles.totalCount}>
        전체 <strong>{totalCount}</strong>건
      </div>
      <div className={styles.searchArea}>
        <select
          className={styles.searchSelect}
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value as '제목' | '내용' | '제목+내용' | '구분')}
        >
          <option value="제목+내용">제목+내용</option>
          <option value="제목">제목</option>
          <option value="내용">내용</option>
          <option value="구분">구분</option>
        </select>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="검색어를 입력하세요"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <button className={styles.searchBtn} onClick={handleSearch}>검색</button>
      </div>
    </div>
  );
}

export default NoticeSearch;
