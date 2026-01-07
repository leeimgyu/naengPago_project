-- ===================================================================
-- recipe_likes 테이블 생성 (사용자별 레시피 좋아요 관리)
-- ===================================================================

-- 1. recipe_likes 테이블 생성
CREATE TABLE IF NOT EXISTS recipe_likes (
    like_id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    recipe_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_recipe_likes_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_recipe_likes_recipe FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE,
    CONSTRAINT uk_recipe_likes_user_recipe UNIQUE (user_id, recipe_id)
);

-- 2. 컬럼에 대한 설명 추가
COMMENT ON TABLE recipe_likes IS '사용자별 레시피 좋아요 테이블';
COMMENT ON COLUMN recipe_likes.like_id IS '좋아요 고유 ID';
COMMENT ON COLUMN recipe_likes.user_id IS '사용자 ID';
COMMENT ON COLUMN recipe_likes.recipe_id IS '레시피 ID';
COMMENT ON COLUMN recipe_likes.created_at IS '좋아요 생성 일시';

-- 3. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_recipe_likes_user_id ON recipe_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_recipe_likes_recipe_id ON recipe_likes(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_likes_created_at ON recipe_likes(created_at DESC);

-- 4. 변경 사항 확인
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'recipe_likes'
ORDER BY ordinal_position;
