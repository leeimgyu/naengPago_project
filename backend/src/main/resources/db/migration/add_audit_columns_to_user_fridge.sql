-- ===================================================================
-- user_fridge 테이블에 JPA Auditing 컬럼 추가 (created_at, updated_at)
-- ===================================================================

-- 1. created_at 컬럼 추가 (added_at 데이터를 기반으로)
ALTER TABLE user_fridge
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP;

-- 2. updated_at 컬럼 추가
ALTER TABLE user_fridge
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

-- 3. 기존 added_at 데이터를 created_at으로 복사 (DATE를 TIMESTAMP로 변환)
UPDATE user_fridge
SET created_at = added_at::timestamp
WHERE created_at IS NULL AND added_at IS NOT NULL;

-- 4. created_at이 여전히 NULL인 경우 현재 시간으로 설정
UPDATE user_fridge
SET created_at = CURRENT_TIMESTAMP
WHERE created_at IS NULL;

-- 5. updated_at을 created_at과 동일하게 초기화
UPDATE user_fridge
SET updated_at = created_at
WHERE updated_at IS NULL;

-- 6. created_at NOT NULL 제약조건 추가
ALTER TABLE user_fridge
ALTER COLUMN created_at SET NOT NULL;

-- 7. 변경 사항 확인
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'user_fridge'
  AND column_name IN ('added_at', 'created_at', 'updated_at')
ORDER BY ordinal_position;

COMMENT ON COLUMN user_fridge.created_at IS '생성 일시 (JPA Auditing)';
COMMENT ON COLUMN user_fridge.updated_at IS '수정 일시 (JPA Auditing)';
