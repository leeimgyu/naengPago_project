-- ===================================================================
-- username 컬럼을 nickname으로 변경
-- ===================================================================
-- 작성일: 2025-01-19
-- 목적: username과 nickname 컬럼 통합 (nickname 컬럼은 비어있음)
-- 작업 내용:
--   1. 기존 nickname 컬럼 삭제 (데이터 없음)
--   2. username 컬럼명을 nickname으로 변경
-- ===================================================================

-- 실행 전 확인
-- 1. 현재 컬럼 상태 확인
SELECT
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'users'
  AND column_name IN ('username', 'nickname')
ORDER BY column_name;

-- 2. 데이터 확인 (nickname 컬럼이 비어있는지 확인)
SELECT
    COUNT(*) as total_users,
    COUNT(nickname) as users_with_nickname
FROM users;

-- ===================================================================
-- 실제 마이그레이션 시작
-- ===================================================================

-- Step 1: 기존 nickname 컬럼 삭제 (비어있음)
ALTER TABLE users DROP COLUMN IF EXISTS nickname;

-- Step 2: username 컬럼명을 nickname으로 변경
ALTER TABLE users RENAME COLUMN username TO nickname;

-- ===================================================================
-- 실행 후 검증
-- ===================================================================

-- 1. 변경된 컬럼 확인
SELECT
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'users'
  AND column_name = 'nickname';

-- 예상 결과:
-- column_name | data_type         | character_maximum_length | is_nullable | column_default
-- nickname    | character varying | 50                       | NO          | NULL

-- 2. 데이터 확인 (기존 username 데이터가 nickname으로 이동되었는지 확인)
SELECT
    user_id,
    nickname,
    email,
    full_name
FROM users
ORDER BY user_id
LIMIT 10;

-- 3. nickname이 NULL인 레코드가 없는지 확인 (있으면 안 됨)
SELECT COUNT(*) as null_nicknames
FROM users
WHERE nickname IS NULL;
-- 예상 결과: 0

-- 4. 중복 nickname이 없는지 확인 (UNIQUE 제약 조건)
SELECT
    nickname,
    COUNT(*) as count
FROM users
GROUP BY nickname
HAVING COUNT(*) > 1;
-- 예상 결과: 행 없음 (중복 없음)

-- ===================================================================
-- 마이그레이션 완료
-- ===================================================================
-- 다음 단계: 백엔드 코드에서 username → nickname 변경 필요
