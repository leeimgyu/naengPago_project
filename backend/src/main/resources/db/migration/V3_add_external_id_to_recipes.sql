-- 레시피 테이블에 외부 API ID를 저장할 컬럼 추가
ALTER TABLE recipes
ADD COLUMN external_id VARCHAR(255);

-- external_id 컬럼에 중복된 값이 없도록 UNIQUE 제약 조건 추가
ALTER TABLE recipes
ADD CONSTRAINT uk_external_id UNIQUE (external_id);
