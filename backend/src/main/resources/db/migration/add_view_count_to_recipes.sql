-- 레시피 테이블에 조회수 컬럼 추가
ALTER TABLE recipes ADD COLUMN view_count INT NOT NULL DEFAULT 0;

-- 기존 레시피의 조회수 초기화 (0으로)
UPDATE recipes SET view_count = 0 WHERE view_count IS NULL;
