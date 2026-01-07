-- ===================================================================
-- recipe_views 테이블 생성 (레시피 조회 이력)
-- ===================================================================

-- 1. recipe_views 테이블 생성
CREATE TABLE IF NOT EXISTS recipe_views (
    view_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    recipe_id INTEGER NOT NULL,
    viewed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,

    CONSTRAINT fk_recipe_views_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_recipe_views_recipe FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE
);

-- 2. 컬럼에 대한 설명 추가
COMMENT ON TABLE recipe_views IS '레시피 조회 이력 테이블';
COMMENT ON COLUMN recipe_views.view_id IS '조회 이력 고유 ID';
COMMENT ON COLUMN recipe_views.user_id IS '조회한 사용자 ID';
COMMENT ON COLUMN recipe_views.recipe_id IS '조회된 레시피 ID';
COMMENT ON COLUMN recipe_views.viewed_at IS '조회 일시';
COMMENT ON COLUMN recipe_views.created_at IS '생성 일시';
COMMENT ON COLUMN recipe_views.updated_at IS '수정 일시';

-- 3. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_recipe_views_user_viewed ON recipe_views(user_id, viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_recipe_views_recipe ON recipe_views(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_views_viewed_at ON recipe_views(viewed_at DESC);

-- 4. 중복 조회 방지를 위한 유니크 인덱스 (같은 사용자가 같은 레시피를 조회한 경우, 최신 조회 시간만 유지)
-- 참고: 동일 사용자가 동일 레시피를 여러 번 조회할 수 있으므로 유니크 제약은 추가하지 않음

-- 5. 변경 사항 확인
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'recipe_views'
ORDER BY ordinal_position;
