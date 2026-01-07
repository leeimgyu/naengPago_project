-- ===================================================================
-- recipes 테이블 생성 (좋아요 기능 포함)
-- ===================================================================

-- 1. recipes 테이블 생성
CREATE TABLE IF NOT EXISTS recipes (
    recipe_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    cooking_time INTEGER,
    difficulty VARCHAR(20),
    servings INTEGER DEFAULT 1,
    image_url TEXT,
    like_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,

    CONSTRAINT chk_difficulty CHECK (difficulty IN ('쉬움', '보통', '어려움')),
    CONSTRAINT chk_cooking_time CHECK (cooking_time > 0),
    CONSTRAINT chk_servings CHECK (servings > 0),
    CONSTRAINT chk_like_count CHECK (like_count >= 0)
);

-- 2. 컬럼에 대한 설명 추가
COMMENT ON TABLE recipes IS '레시피 정보 테이블';
COMMENT ON COLUMN recipes.recipe_id IS '레시피 고유 ID';
COMMENT ON COLUMN recipes.title IS '레시피 제목';
COMMENT ON COLUMN recipes.description IS '레시피 설명';
COMMENT ON COLUMN recipes.ingredients IS '재료 목록 (JSON 또는 텍스트 형식)';
COMMENT ON COLUMN recipes.instructions IS '조리 방법';
COMMENT ON COLUMN recipes.cooking_time IS '조리 시간 (분 단위)';
COMMENT ON COLUMN recipes.difficulty IS '난이도 (쉬움, 보통, 어려움)';
COMMENT ON COLUMN recipes.servings IS '인분';
COMMENT ON COLUMN recipes.image_url IS '레시피 이미지 URL';
COMMENT ON COLUMN recipes.like_count IS '레시피 좋아요 수';
COMMENT ON COLUMN recipes.created_at IS '생성 일시';
COMMENT ON COLUMN recipes.updated_at IS '수정 일시';

-- 3. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_recipes_title ON recipes(title);
CREATE INDEX IF NOT EXISTS idx_recipes_difficulty ON recipes(difficulty);
CREATE INDEX IF NOT EXISTS idx_recipes_like_count ON recipes(like_count DESC);
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at DESC);

-- 4. 샘플 데이터 삽입 (테스트용)
INSERT INTO recipes (title, description, ingredients, instructions, cooking_time, difficulty, servings, image_url, like_count)
VALUES
('김치볶음밥', '간단하고 맛있는 김치볶음밥',
 '밥 1공기, 김치 1/2컵, 햄 50g, 식용유 2큰술, 참기름 1작은술, 김가루 약간',
 '1. 김치와 햄을 잘게 썰어주세요.\n2. 달군 팬에 식용유를 두르고 김치를 볶아주세요.\n3. 햄을 넣고 함께 볶아주세요.\n4. 밥을 넣고 잘 섞어가며 볶아주세요.\n5. 참기름을 넣고 마무리합니다.\n6. 그릇에 담고 김가루를 뿌려 완성합니다.',
 15, '쉬움', 1, 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26', 0),

('된장찌개', '구수한 된장찌개',
 '된장 2큰술, 두부 1/2모, 애호박 1/4개, 양파 1/4개, 대파 1/2대, 물 2컵',
 '1. 애호박과 양파, 두부를 먹기 좋은 크기로 썰어주세요.\n2. 냄비에 물을 붓고 된장을 풀어주세요.\n3. 애호박과 양파를 넣고 끓여주세요.\n4. 두부를 넣고 5분 정도 더 끓여주세요.\n5. 대파를 넣고 한소끔 끓이면 완성입니다.',
 20, '쉬움', 2, 'https://images.unsplash.com/photo-1602253057119-b4cda04a0368', 0),

('불고기', '달콤한 양념의 불고기',
 '소고기 300g, 간장 3큰술, 설탕 1.5큰술, 다진 마늘 1큰술, 참기름 1큰술, 배 1/4개, 양파 1/2개, 대파 1/2대',
 '1. 배를 갈아서 즙을 내주세요.\n2. 간장, 설탕, 다진 마늘, 참기름, 배즙을 섞어 양념장을 만듭니다.\n3. 소고기를 얇게 썰어 양념장에 재워주세요 (30분).\n4. 양파와 대파를 썰어주세요.\n5. 달군 팬에 양념한 고기를 볶아주세요.\n6. 양파와 대파를 넣고 함께 볶아 완성합니다.',
 40, '보통', 3, 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143', 0);

-- 5. 변경 사항 확인
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'recipes'
ORDER BY ordinal_position;

-- 6. 생성된 데이터 확인
SELECT recipe_id, title, difficulty, cooking_time, servings, like_count
FROM recipes;
