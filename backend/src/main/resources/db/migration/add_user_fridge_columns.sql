-- ===================================================================
-- user_fridge 테이블에 category, added_at 컬럼 추가
-- ===================================================================

-- 1. 기존 view가 있다면 임시 삭제 (스키마 변경을 위해)
DROP VIEW IF EXISTS v_user_fridge_expiry CASCADE;

-- 2. user_fridge 테이블에 필요한 컬럼 추가
ALTER TABLE user_fridge
ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT '기타' NOT NULL;

ALTER TABLE user_fridge
ADD COLUMN IF NOT EXISTS added_at DATE DEFAULT CURRENT_DATE NOT NULL;

-- 3. 기존 데이터에 대한 업데이트 (added_at가 NULL인 경우)
UPDATE user_fridge
SET added_at = CURRENT_DATE
WHERE added_at IS NULL;

-- 4. v_user_fridge_expiry 뷰 재생성 (만약 기존에 있었다면)
-- 유통기한이 임박한 재료를 보여주는 뷰
CREATE OR REPLACE VIEW v_user_fridge_expiry AS
SELECT
    f.fridge_id,
    f.user_id,
    f.name,
    f.quantity,
    f.category,
    f.expiry_date,
    f.added_at,
    CASE
        WHEN f.expiry_date IS NULL THEN NULL
        WHEN f.expiry_date < CURRENT_DATE THEN '만료됨'
        WHEN f.expiry_date = CURRENT_DATE THEN '오늘'
        WHEN f.expiry_date <= CURRENT_DATE + INTERVAL '3 days' THEN '임박'
        ELSE '안전'
    END AS expiry_status,
    CASE
        WHEN f.expiry_date IS NULL THEN NULL
        ELSE (f.expiry_date - CURRENT_DATE)
    END AS days_until_expiry
FROM user_fridge f
ORDER BY
    CASE
        WHEN f.expiry_date IS NULL THEN 999999
        ELSE (f.expiry_date - CURRENT_DATE)
    END;

-- 5. 변경 사항 확인
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'user_fridge'
  AND column_name IN ('category', 'added_at')
ORDER BY ordinal_position;

COMMENT ON COLUMN user_fridge.category IS '재료 카테고리 (채소, 과일/곡류, 정육/계란, 수산/해산물, 유제품/가공식품, 양념/소스/오일, 김치/반찬/기타)';
COMMENT ON COLUMN user_fridge.added_at IS '재료 추가 날짜';
