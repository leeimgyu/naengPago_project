-- 프로필 수정 기능을 위한 컬럼 추가
-- 실행 방법: PostgreSQL에서 이 스크립트를 실행하세요

-- 1. nickname 컬럼 추가 (이미 있으면 무시)
ALTER TABLE users ADD COLUMN IF NOT EXISTS nickname VARCHAR(50);

-- 2. address 컬럼 추가 (이미 있으면 무시)
ALTER TABLE users ADD COLUMN IF NOT EXISTS address VARCHAR(500);

-- 3. 결과 확인
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'users'
  AND column_name IN ('nickname', 'address');

-- 4. 기존 사용자 데이터 확인
SELECT user_id, username, email, full_name, nickname, phone, address, profile_image
FROM users
LIMIT 5;
