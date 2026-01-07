-- 레시피 조회 기록 테이블 생성
-- 사용자별로 어떤 레시피를 언제 조회했는지 기록

CREATE TABLE IF NOT EXISTS recipe_view_history (
    view_history_id BIGSERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    recipe_id BIGINT NOT NULL,
    first_viewed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_viewed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    view_count INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT fk_recipe_view_history_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_recipe_view_history_recipe
        FOREIGN KEY (recipe_id)
        REFERENCES recipes(recipe_id)
        ON DELETE CASCADE,
    CONSTRAINT uq_user_recipe_view
        UNIQUE (user_id, recipe_id)
);

-- 인덱스 생성 (조회 성능 향상)
CREATE INDEX IF NOT EXISTS idx_recipe_view_history_user_id
    ON recipe_view_history(user_id);

CREATE INDEX IF NOT EXISTS idx_recipe_view_history_recipe_id
    ON recipe_view_history(recipe_id);

CREATE INDEX IF NOT EXISTS idx_recipe_view_history_last_viewed_at
    ON recipe_view_history(last_viewed_at DESC);

-- 코멘트 추가
COMMENT ON TABLE recipe_view_history IS '레시피 조회 기록 테이블';
COMMENT ON COLUMN recipe_view_history.view_history_id IS '조회 기록 ID (PK)';
COMMENT ON COLUMN recipe_view_history.user_id IS '사용자 ID (FK)';
COMMENT ON COLUMN recipe_view_history.recipe_id IS '레시피 ID (FK)';
COMMENT ON COLUMN recipe_view_history.first_viewed_at IS '최초 조회 시간';
COMMENT ON COLUMN recipe_view_history.last_viewed_at IS '최근 조회 시간';
COMMENT ON COLUMN recipe_view_history.view_count IS '조회 횟수';
