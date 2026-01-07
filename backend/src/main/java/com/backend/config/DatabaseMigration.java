package com.backend.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * 데이터베이스 마이그레이션 실행
 * - user_fridge 테이블에 category, added_at 컬럼 추가
 * - v_user_fridge_expiry 뷰 재생성
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseMigration implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        try {
            log.info("데이터베이스 마이그레이션 시작...");

            // 1. user_fridge 테이블에 category 컬럼이 있는지 확인
            boolean hasCategoryColumn = checkColumnExists("user_fridge", "category");
            boolean hasAddedAtColumn = checkColumnExists("user_fridge", "added_at");

            if (!hasCategoryColumn || !hasAddedAtColumn) {
                log.info("user_fridge 테이블 마이그레이션 필요...");
                executeMigration();
            } else {
                log.info("user_fridge 테이블이 이미 최신 상태입니다.");
            }

            // 2. quantity 컬럼 타입 확인 및 변환
            if (isQuantityNumericType()) {
                log.info("quantity 컬럼 타입 변환 필요 (numeric → VARCHAR)...");
                convertQuantityToVarchar();
            } else {
                log.info("quantity 컬럼 타입이 이미 VARCHAR입니다.");
            }

            // 3. ingredient_id 컬럼 확인 및 삭제
            boolean hasIngredientIdColumn = checkColumnExists("user_fridge", "ingredient_id");
            if (hasIngredientIdColumn) {
                log.info("ingredient_id 컬럼 삭제 필요...");
                removeIngredientIdColumn();
            } else {
                log.info("ingredient_id 컬럼이 이미 삭제되었습니다.");
            }

            // 4. user_fridge 테이블 JPA Auditing 컬럼 확인 및 추가
            boolean hasFridgeCreatedAtColumn = checkColumnExists("user_fridge", "created_at");
            boolean hasFridgeUpdatedAtColumn = checkColumnExists("user_fridge", "updated_at");

            if (!hasFridgeCreatedAtColumn || !hasFridgeUpdatedAtColumn) {
                log.info("user_fridge 테이블 JPA Auditing 컬럼 추가 필요...");
                addAuditingColumnsToUserFridge();
            } else {
                log.info("user_fridge 테이블 JPA Auditing 컬럼이 이미 존재합니다.");
            }

            // 5. users 테이블 JPA Auditing 컬럼 확인 및 추가
            boolean hasUsersCreatedAtColumn = checkColumnExists("users", "created_at");
            boolean hasUsersUpdatedAtColumn = checkColumnExists("users", "updated_at");

            if (!hasUsersCreatedAtColumn || !hasUsersUpdatedAtColumn) {
                log.info("users 테이블 JPA Auditing 컬럼 추가 필요...");
                addAuditingColumnsToUsers();
            } else {
                log.info("users 테이블 JPA Auditing 컬럼이 이미 존재합니다.");
            }

            // 6. user_fridge 테이블 unit 컬럼 NULL 허용으로 변경
            boolean hasUnitColumn = checkColumnExists("user_fridge", "unit");
            if (hasUnitColumn) {
                log.info("user_fridge 테이블 unit 컬럼 NULL 허용으로 변경 필요...");
                makeUnitColumnNullable();
            } else {
                log.info("user_fridge 테이블에 unit 컬럼이 존재하지 않습니다.");
            }

            // 7. user_fridge 테이블 added_at 컬럼 NULL 허용으로 변경 (향후 삭제 예정)
            boolean hasAddedAtColumnForNullable = checkColumnExists("user_fridge", "added_at");
            if (hasAddedAtColumnForNullable) {
                log.info("user_fridge 테이블 added_at 컬럼 NULL 허용으로 변경 필요...");
                makeAddedAtColumnNullable();
            } else {
                log.info("user_fridge 테이블에 added_at 컬럼이 존재하지 않습니다.");
            }

            // 8. recipes 테이블 생성 (존재하지 않을 경우에만)
            boolean hasRecipesTable = checkTableExists("recipes");
            boolean hasRecipeLikesTable = checkTableExists("recipe_likes");

            if (!hasRecipesTable) {
                log.info("recipes 테이블 생성 필요...");
                createRecipesTable();
            } else {
                log.info("recipes 테이블이 이미 존재합니다.");
            }

            if (!hasRecipeLikesTable) {
                log.info("recipe_likes 테이블 생성 필요...");
                createRecipeLikesTable();
            } else {
                log.info("recipe_likes 테이블이 이미 존재합니다.");
            }

            // 9. recipes 테이블 컬럼 타입 확인 및 수정
            fixRecipesTableColumnTypes();

            // 10. recipes 테이블에 user_id 컬럼 추가
            boolean hasRecipeUserIdColumn = checkColumnExists("recipes", "user_id");
            if (!hasRecipeUserIdColumn) {
                log.info("recipes 테이블에 user_id 컬럼 추가 필요...");
                addUserIdToRecipes();
            } else {
                log.info("recipes 테이블에 user_id 컬럼이 이미 존재합니다.");
            }

            // 11. recipes 테이블에 view_count 컬럼 추가
            boolean hasViewCountColumn = checkColumnExists("recipes", "view_count");
            if (!hasViewCountColumn) {
                log.info("recipes 테이블에 view_count 컬럼 추가 필요...");
                addViewCountToRecipes();
            } else {
                log.info("recipes 테이블에 view_count 컬럼이 이미 존재합니다.");
            }

            // 12. recipe_views 테이블 생성 (레시피 조회 이력)
            boolean hasRecipeViewsTable = checkTableExists("recipe_views");
            if (!hasRecipeViewsTable) {
                log.info("recipe_views 테이블 생성 필요...");
                createRecipeViewsTable();
            } else {
                log.info("recipe_views 테이블이 이미 존재합니다.");
            }

            log.info("데이터베이스 마이그레이션 완료!");

        } catch (Exception e) {
            log.error("데이터베이스 마이그레이션 실패: ", e);
            // 마이그레이션 실패해도 애플리케이션은 계속 실행
        }
    }

    /**
     * 테이블 존재 여부 확인
     */
    private boolean checkTableExists(String tableName) {
        try {
            String sql = """
                SELECT EXISTS (
                    SELECT 1
                    FROM information_schema.tables
                    WHERE table_name = ?
                )
                """;
            Boolean exists = jdbcTemplate.queryForObject(sql, Boolean.class, tableName);
            return exists != null && exists;
        } catch (Exception e) {
            log.warn("테이블 존재 여부 확인 실패: {}", tableName, e);
            return false;
        }
    }

    /**
     * 테이블에 특정 컬럼이 존재하는지 확인
     */
    private boolean checkColumnExists(String tableName, String columnName) {
        try {
            String sql = """
                SELECT EXISTS (
                    SELECT 1
                    FROM information_schema.columns
                    WHERE table_name = ?
                    AND column_name = ?
                )
                """;
            Boolean exists = jdbcTemplate.queryForObject(sql, Boolean.class, tableName, columnName);
            return exists != null && exists;
        } catch (Exception e) {
            log.warn("컬럼 존재 여부 확인 실패: {}.{}", tableName, columnName, e);
            return false;
        }
    }

    /**
     * 마이그레이션 SQL 실행
     */
    private void executeMigration() {
        try {
            log.info("Step 1: 기존 view 삭제...");
            jdbcTemplate.execute("DROP VIEW IF EXISTS v_user_fridge_expiry CASCADE");

            log.info("Step 2: category 컬럼 추가...");
            jdbcTemplate.execute("""
                ALTER TABLE user_fridge
                ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT '기타' NOT NULL
                """);

            log.info("Step 3: added_at 컬럼 추가...");
            jdbcTemplate.execute("""
                ALTER TABLE user_fridge
                ADD COLUMN IF NOT EXISTS added_at DATE DEFAULT CURRENT_DATE NOT NULL
                """);

            log.info("Step 4: 기존 데이터 업데이트...");
            jdbcTemplate.execute("""
                UPDATE user_fridge
                SET added_at = CURRENT_DATE
                WHERE added_at IS NULL
                """);

            log.info("Step 5: v_user_fridge_expiry 뷰 재생성...");
            jdbcTemplate.execute("""
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
                    END
                """);

            log.info("Step 6: 컬럼 코멘트 추가...");
            jdbcTemplate.execute("""
                COMMENT ON COLUMN user_fridge.category IS
                '재료 카테고리 (채소, 과일/곡류, 정육/계란, 수산/해산물, 유제품/가공식품, 양념/소스/오일, 김치/반찬/기타)'
                """);
            jdbcTemplate.execute("""
                COMMENT ON COLUMN user_fridge.added_at IS '재료 추가 날짜'
                """);

            log.info("마이그레이션 성공!");

        } catch (Exception e) {
            log.error("마이그레이션 실행 중 오류 발생: ", e);
            throw new RuntimeException("데이터베이스 마이그레이션 실패", e);
        }
    }

    /**
     * quantity 컬럼이 numeric 타입인지 확인
     */
    private boolean isQuantityNumericType() {
        try {
            String sql = """
                SELECT data_type
                FROM information_schema.columns
                WHERE table_name = 'user_fridge'
                AND column_name = 'quantity'
                """;
            String dataType = jdbcTemplate.queryForObject(sql, String.class);
            return "numeric".equalsIgnoreCase(dataType);
        } catch (Exception e) {
            log.warn("quantity 컬럼 타입 확인 실패", e);
            return false;
        }
    }

    /**
     * ingredient_id 컬럼 삭제
     */
    private void removeIngredientIdColumn() {
        try {
            log.info("Step 1: 기존 view 삭제...");
            jdbcTemplate.execute("DROP VIEW IF EXISTS v_user_fridge_expiry CASCADE");

            log.info("Step 2: ingredient_id 컬럼에 대한 외래 키 제약 조건 확인 및 삭제...");
            String foreignKeysSql = """
                SELECT conname
                FROM pg_constraint
                WHERE conrelid = 'user_fridge'::regclass
                AND contype = 'f'
                AND conkey @> ARRAY[(SELECT attnum FROM pg_attribute WHERE attrelid = 'user_fridge'::regclass AND attname = 'ingredient_id')]
                """;

            try {
                List<String> foreignKeys = jdbcTemplate.queryForList(foreignKeysSql, String.class);
                for (String fkName : foreignKeys) {
                    log.info("  - 외래 키 제약 조건 삭제: {}", fkName);
                    jdbcTemplate.execute("ALTER TABLE user_fridge DROP CONSTRAINT IF EXISTS " + fkName);
                }
            } catch (Exception e) {
                log.warn("외래 키 제약 조건 확인 중 오류 (무시하고 계속): {}", e.getMessage());
            }

            log.info("Step 3: ingredient_id 컬럼 삭제...");
            jdbcTemplate.execute("ALTER TABLE user_fridge DROP COLUMN IF EXISTS ingredient_id");

            log.info("Step 4: v_user_fridge_expiry 뷰 재생성...");
            jdbcTemplate.execute("""
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
                    END
                """);

            log.info("ingredient_id 컬럼 삭제 성공!");

        } catch (Exception e) {
            log.error("ingredient_id 컬럼 삭제 중 오류 발생: ", e);
            throw new RuntimeException("ingredient_id 컬럼 삭제 실패", e);
        }
    }

    /**
     * quantity 컬럼을 VARCHAR(50)으로 변환
     */
    private void convertQuantityToVarchar() {
        try {
            log.info("Step 1: 기존 view 삭제...");
            jdbcTemplate.execute("DROP VIEW IF EXISTS v_user_fridge_expiry CASCADE");

            log.info("Step 2: quantity 컬럼 관련 제약 조건 확인 및 삭제...");
            // quantity 컬럼에 대한 CHECK 제약 조건 조회
            String checkConstraintsSql = """
                SELECT conname
                FROM pg_constraint
                WHERE conrelid = 'user_fridge'::regclass
                AND contype = 'c'
                AND conkey @> ARRAY[(SELECT attnum FROM pg_attribute WHERE attrelid = 'user_fridge'::regclass AND attname = 'quantity')]
                """;

            try {
                List<String> constraints = jdbcTemplate.queryForList(checkConstraintsSql, String.class);
                for (String constraintName : constraints) {
                    log.info("  - CHECK 제약 조건 삭제: {}", constraintName);
                    jdbcTemplate.execute("ALTER TABLE user_fridge DROP CONSTRAINT " + constraintName);
                }
            } catch (Exception e) {
                log.warn("제약 조건 확인 중 오류 (무시하고 계속): {}", e.getMessage());
            }

            log.info("Step 3: quantity 컬럼 타입 변환 (numeric → VARCHAR)...");
            jdbcTemplate.execute("""
                ALTER TABLE user_fridge
                ALTER COLUMN quantity TYPE VARCHAR(50) USING quantity::text
                """);

            log.info("Step 4: v_user_fridge_expiry 뷰 재생성...");
            jdbcTemplate.execute("""
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
                    END
                """);

            log.info("quantity 컬럼 타입 변환 성공!");

        } catch (Exception e) {
            log.error("quantity 컬럼 타입 변환 중 오류 발생: ", e);
            throw new RuntimeException("quantity 컬럼 타입 변환 실패", e);
        }
    }

    /**
     * user_fridge 테이블에 JPA Auditing 컬럼 추가 (created_at, updated_at)
     */
    private void addAuditingColumnsToUserFridge() {
        try {
            log.info("Step 1: created_at 컬럼 추가...");
            jdbcTemplate.execute("""
                ALTER TABLE user_fridge
                ADD COLUMN IF NOT EXISTS created_at TIMESTAMP
                """);

            log.info("Step 2: updated_at 컬럼 추가...");
            jdbcTemplate.execute("""
                ALTER TABLE user_fridge
                ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP
                """);

            log.info("Step 3: 기존 added_at 데이터를 created_at으로 복사...");
            jdbcTemplate.execute("""
                UPDATE user_fridge
                SET created_at = added_at::timestamp
                WHERE created_at IS NULL AND added_at IS NOT NULL
                """);

            log.info("Step 4: created_at이 NULL인 경우 현재 시간으로 설정...");
            jdbcTemplate.execute("""
                UPDATE user_fridge
                SET created_at = CURRENT_TIMESTAMP
                WHERE created_at IS NULL
                """);

            log.info("Step 5: updated_at을 created_at과 동일하게 초기화...");
            jdbcTemplate.execute("""
                UPDATE user_fridge
                SET updated_at = created_at
                WHERE updated_at IS NULL
                """);

            log.info("Step 6: created_at NOT NULL 제약조건 추가...");
            jdbcTemplate.execute("""
                ALTER TABLE user_fridge
                ALTER COLUMN created_at SET NOT NULL
                """);

            log.info("Step 7: 컬럼 코멘트 추가...");
            jdbcTemplate.execute("""
                COMMENT ON COLUMN user_fridge.created_at IS '생성 일시 (JPA Auditing)'
                """);
            jdbcTemplate.execute("""
                COMMENT ON COLUMN user_fridge.updated_at IS '수정 일시 (JPA Auditing)'
                """);

            log.info("user_fridge 테이블 JPA Auditing 컬럼 추가 성공!");

        } catch (Exception e) {
            log.error("user_fridge 테이블 JPA Auditing 컬럼 추가 중 오류 발생: ", e);
            throw new RuntimeException("user_fridge 테이블 JPA Auditing 컬럼 추가 실패", e);
        }
    }

    /**
     * users 테이블에 JPA Auditing 컬럼 추가 (created_at, updated_at)
     */
    private void addAuditingColumnsToUsers() {
        try {
            log.info("Step 1: created_at 컬럼 추가...");
            jdbcTemplate.execute("""
                ALTER TABLE users
                ADD COLUMN IF NOT EXISTS created_at TIMESTAMP
                """);

            log.info("Step 2: updated_at 컬럼 추가...");
            jdbcTemplate.execute("""
                ALTER TABLE users
                ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP
                """);

            log.info("Step 3: created_at이 NULL인 경우 현재 시간으로 설정...");
            jdbcTemplate.execute("""
                UPDATE users
                SET created_at = CURRENT_TIMESTAMP
                WHERE created_at IS NULL
                """);

            log.info("Step 4: updated_at을 created_at과 동일하게 초기화...");
            jdbcTemplate.execute("""
                UPDATE users
                SET updated_at = created_at
                WHERE updated_at IS NULL
                """);

            log.info("Step 5: created_at NOT NULL 제약조건 추가...");
            jdbcTemplate.execute("""
                ALTER TABLE users
                ALTER COLUMN created_at SET NOT NULL
                """);

            log.info("Step 6: 컬럼 코멘트 추가...");
            jdbcTemplate.execute("""
                COMMENT ON COLUMN users.created_at IS '생성 일시 (JPA Auditing)'
                """);
            jdbcTemplate.execute("""
                COMMENT ON COLUMN users.updated_at IS '수정 일시 (JPA Auditing)'
                """);

            log.info("users 테이블 JPA Auditing 컬럼 추가 성공!");

        } catch (Exception e) {
            log.error("users 테이블 JPA Auditing 컬럼 추가 중 오류 발생: ", e);
            throw new RuntimeException("users 테이블 JPA Auditing 컬럼 추가 실패", e);
        }
    }

    /**
     * user_fridge 테이블의 unit 컬럼을 NULL 허용으로 변경
     */
    private void makeUnitColumnNullable() {
        try {
            log.info("Step 1: unit 컬럼 NOT NULL 제약조건 제거...");
            jdbcTemplate.execute("""
                ALTER TABLE user_fridge
                ALTER COLUMN unit DROP NOT NULL
                """);

            log.info("Step 2: 컬럼 코멘트 업데이트...");
            jdbcTemplate.execute("""
                COMMENT ON COLUMN user_fridge.unit IS '단위 (선택 사항)'
                """);

            log.info("user_fridge 테이블 unit 컬럼 NULL 허용 변경 성공!");

        } catch (Exception e) {
            log.error("user_fridge 테이블 unit 컬럼 변경 중 오류 발생: ", e);
            throw new RuntimeException("user_fridge 테이블 unit 컬럼 변경 실패", e);
        }
    }

    /**
     * user_fridge 테이블의 added_at 컬럼을 NULL 허용으로 변경
     * (created_at으로 대체되었으므로 향후 삭제 예정)
     */
    private void makeAddedAtColumnNullable() {
        try {
            log.info("Step 1: added_at 컬럼 NOT NULL 제약조건 제거...");
            jdbcTemplate.execute("""
                ALTER TABLE user_fridge
                ALTER COLUMN added_at DROP NOT NULL
                """);

            log.info("Step 2: 컬럼 코멘트 업데이트...");
            jdbcTemplate.execute("""
                COMMENT ON COLUMN user_fridge.added_at IS '추가 일시 (deprecated - created_at 사용 권장)'
                """);

            log.info("user_fridge 테이블 added_at 컬럼 NULL 허용 변경 성공!");

        } catch (Exception e) {
            log.error("user_fridge 테이블 added_at 컬럼 변경 중 오류 발생: ", e);
            throw new RuntimeException("user_fridge 테이블 added_at 컬럼 변경 실패", e);
        }
    }

    /**
     * recipes 테이블 생성
     */
    private void createRecipesTable() {
        try {
            log.info("Step 1: recipes 테이블 생성...");
            jdbcTemplate.execute("""
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
                )
                """);

            log.info("Step 2: 인덱스 생성...");
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_recipes_title ON recipes(title)");
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_recipes_difficulty ON recipes(difficulty)");
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_recipes_like_count ON recipes(like_count DESC)");
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at DESC)");

            log.info("Step 3: 샘플 데이터 삽입...");
            jdbcTemplate.execute("""
                INSERT INTO recipes (title, description, ingredients, instructions, cooking_time, difficulty, servings, image_url, like_count)
                VALUES
                ('김치볶음밥', '간단하고 맛있는 김치볶음밥',
                 '밥 1공기, 김치 1/2컵, 햄 50g, 식용유 2큰술, 참기름 1작은술, 김가루 약간',
                 '1. 김치와 햄을 잘게 썰어주세요.
2. 달군 팬에 식용유를 두르고 김치를 볶아주세요.
3. 햄을 넣고 함께 볶아주세요.
4. 밥을 넣고 잘 섞어가며 볶아주세요.
5. 참기름을 넣고 마무리합니다.
6. 그릇에 담고 김가루를 뿌려 완성합니다.',
                 15, '쉬움', 1, 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26', 0)
                ON CONFLICT DO NOTHING
                """);

            jdbcTemplate.execute("""
                INSERT INTO recipes (title, description, ingredients, instructions, cooking_time, difficulty, servings, image_url, like_count)
                VALUES
                ('된장찌개', '구수한 된장찌개',
                 '된장 2큰술, 두부 1/2모, 애호박 1/4개, 양파 1/4개, 대파 1/2대, 물 2컵',
                 '1. 애호박과 양파, 두부를 먹기 좋은 크기로 썰어주세요.
2. 냄비에 물을 붓고 된장을 풀어주세요.
3. 애호박과 양파를 넣고 끓여주세요.
4. 두부를 넣고 5분 정도 더 끓여주세요.
5. 대파를 넣고 한소끔 끓이면 완성입니다.',
                 20, '쉬움', 2, 'https://images.unsplash.com/photo-1602253057119-b4cda04a0368', 0)
                ON CONFLICT DO NOTHING
                """);

            jdbcTemplate.execute("""
                INSERT INTO recipes (title, description, ingredients, instructions, cooking_time, difficulty, servings, image_url, like_count)
                VALUES
                ('불고기', '달콤한 양념의 불고기',
                 '소고기 300g, 간장 3큰술, 설탕 1.5큰술, 다진 마늘 1큰술, 참기름 1큰술, 배 1/4개, 양파 1/2개, 대파 1/2대',
                 '1. 배를 갈아서 즙을 내주세요.
2. 간장, 설탕, 다진 마늘, 참기름, 배즙을 섞어 양념장을 만듭니다.
3. 소고기를 얇게 썰어 양념장에 재워주세요 (30분).
4. 양파와 대파를 썰어주세요.
5. 달군 팬에 양념한 고기를 볶아주세요.
6. 양파와 대파를 넣고 함께 볶아 완성합니다.',
                 40, '보통', 3, 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143', 0)
                ON CONFLICT DO NOTHING
                """);

            log.info("recipes 테이블 생성 성공!");

        } catch (Exception e) {
            log.error("recipes 테이블 생성 중 오류 발생: ", e);
            throw new RuntimeException("recipes 테이블 생성 실패", e);
        }
    }

    /**
     * recipe_likes 테이블 생성
     */
    private void createRecipeLikesTable() {
        try {
            log.info("Step 1: recipe_likes 테이블 생성...");
            jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS recipe_likes (
                    like_id SERIAL PRIMARY KEY,
                    user_id INTEGER NOT NULL,
                    recipe_id BIGINT NOT NULL,
                    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                    CONSTRAINT fk_recipe_likes_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                    CONSTRAINT fk_recipe_likes_recipe FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE,
                    CONSTRAINT uk_recipe_likes_user_recipe UNIQUE (user_id, recipe_id)
                )
                """);

            log.info("Step 2: 인덱스 생성...");
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_recipe_likes_user_id ON recipe_likes(user_id)");
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_recipe_likes_recipe_id ON recipe_likes(recipe_id)");
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_recipe_likes_created_at ON recipe_likes(created_at DESC)");

            log.info("recipe_likes 테이블 생성 성공!");

        } catch (Exception e) {
            log.error("recipe_likes 테이블 생성 중 오류 발생: ", e);
            throw new RuntimeException("recipe_likes 테이블 생성 실패", e);
        }
    }

    /**
     * recipes 테이블 컬럼 타입 수정 (VARCHAR → TEXT)
     */
    private void fixRecipesTableColumnTypes() {
        try {
            log.info("recipes 테이블 컬럼 타입 확인 중...");

            // image_url, instructions, description 컬럼 타입 확인
            String checkColumnTypeSql = """
                SELECT column_name, data_type, character_maximum_length
                FROM information_schema.columns
                WHERE table_name = 'recipes'
                AND column_name IN ('image_url', 'instructions', 'description')
                ORDER BY column_name
                """;

            List<String> columnsToFix = jdbcTemplate.query(checkColumnTypeSql, (rs, rowNum) -> {
                String columnName = rs.getString("column_name");
                String dataType = rs.getString("data_type");
                Integer maxLength = rs.getInt("character_maximum_length");

                log.info("  - {}: {} ({})", columnName, dataType, maxLength != 0 ? maxLength : "unlimited");

                // VARCHAR 타입이면 TEXT로 변경 필요
                if ("character varying".equals(dataType)) {
                    return columnName;
                }
                return null;
            }).stream().filter(col -> col != null).toList();

            if (!columnsToFix.isEmpty()) {
                log.info("변경 필요한 컬럼: {}", columnsToFix);

                for (String columnName : columnsToFix) {
                    log.info("  - {} 컬럼을 TEXT로 변경 중...", columnName);
                    jdbcTemplate.execute(String.format(
                        "ALTER TABLE recipes ALTER COLUMN %s TYPE TEXT", columnName
                    ));
                }

                log.info("recipes 테이블 컬럼 타입 수정 완료!");
            } else {
                log.info("recipes 테이블 컬럼 타입이 이미 올바릅니다.");
            }

        } catch (Exception e) {
            log.error("recipes 테이블 컬럼 타입 수정 중 오류 발생: ", e);
            // 실패해도 계속 진행 (이미 TEXT 타입일 수 있음)
        }
    }

    /**
     * recipes 테이블에 user_id 컬럼 추가
     */
    private void addUserIdToRecipes() {
        try {
            log.info("Step 1: recipes 테이블에 user_id 컬럼 추가...");
            jdbcTemplate.execute("""
                ALTER TABLE recipes
                ADD COLUMN user_id INTEGER
                """);

            log.info("Step 2: 외래 키 제약 조건 추가...");
            jdbcTemplate.execute("""
                ALTER TABLE recipes
                ADD CONSTRAINT fk_recipes_user
                FOREIGN KEY (user_id) REFERENCES users(user_id)
                ON DELETE SET NULL
                """);

            log.info("Step 3: 인덱스 생성...");
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON recipes(user_id)");

            log.info("Step 4: 컬럼 코멘트 추가...");
            jdbcTemplate.execute("""
                COMMENT ON COLUMN recipes.user_id IS '레시피 작성자 (users 테이블 참조)'
                """);

            log.info("recipes 테이블 user_id 컬럼 추가 완료!");

        } catch (Exception e) {
            log.error("recipes 테이블 user_id 컬럼 추가 중 오류 발생: ", e);
            throw new RuntimeException("recipes 테이블 user_id 컬럼 추가 실패", e);
        }
    }

    /**
     * recipes 테이블에 view_count 컬럼 추가
     */
    private void addViewCountToRecipes() {
        try {
            log.info("Step 1: recipes 테이블에 view_count 컬럼 추가...");
            jdbcTemplate.execute("""
                ALTER TABLE recipes
                ADD COLUMN view_count INT NOT NULL DEFAULT 0
                """);

            log.info("Step 2: 기존 레시피의 조회수 초기화...");
            jdbcTemplate.execute("""
                UPDATE recipes
                SET view_count = 0
                WHERE view_count IS NULL
                """);

            log.info("Step 3: CHECK 제약 조건 추가...");
            jdbcTemplate.execute("""
                ALTER TABLE recipes
                ADD CONSTRAINT chk_view_count CHECK (view_count >= 0)
                """);

            log.info("Step 4: 인덱스 생성...");
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_recipes_view_count ON recipes(view_count DESC)");

            log.info("Step 5: 컬럼 코멘트 추가...");
            jdbcTemplate.execute("""
                COMMENT ON COLUMN recipes.view_count IS '레시피 조회수'
                """);

            log.info("recipes 테이블 view_count 컬럼 추가 완료!");

        } catch (Exception e) {
            log.error("recipes 테이블 view_count 컬럼 추가 중 오류 발생: ", e);
            throw new RuntimeException("recipes 테이블 view_count 컬럼 추가 실패", e);
        }
    }

    /**
     * recipe_views 테이블 생성 (레시피 조회 이력)
     */
    private void createRecipeViewsTable() {
        try {
            log.info("Step 1: recipe_views 테이블 생성...");
            jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS recipe_views (
                    view_id SERIAL PRIMARY KEY,
                    user_id INTEGER NOT NULL,
                    recipe_id INTEGER NOT NULL,
                    viewed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP,

                    CONSTRAINT fk_recipe_views_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                    CONSTRAINT fk_recipe_views_recipe FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE
                )
                """);

            log.info("Step 2: 인덱스 생성...");
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_recipe_views_user_viewed ON recipe_views(user_id, viewed_at DESC)");
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_recipe_views_recipe ON recipe_views(recipe_id)");
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_recipe_views_viewed_at ON recipe_views(viewed_at DESC)");

            log.info("Step 3: 컬럼 코멘트 추가...");
            jdbcTemplate.execute("""
                COMMENT ON TABLE recipe_views IS '레시피 조회 이력 테이블'
                """);
            jdbcTemplate.execute("""
                COMMENT ON COLUMN recipe_views.view_id IS '조회 이력 고유 ID'
                """);
            jdbcTemplate.execute("""
                COMMENT ON COLUMN recipe_views.user_id IS '조회한 사용자 ID'
                """);
            jdbcTemplate.execute("""
                COMMENT ON COLUMN recipe_views.recipe_id IS '조회된 레시피 ID'
                """);
            jdbcTemplate.execute("""
                COMMENT ON COLUMN recipe_views.viewed_at IS '조회 일시'
                """);
            jdbcTemplate.execute("""
                COMMENT ON COLUMN recipe_views.created_at IS '생성 일시'
                """);
            jdbcTemplate.execute("""
                COMMENT ON COLUMN recipe_views.updated_at IS '수정 일시'
                """);

            log.info("recipe_views 테이블 생성 완료!");

        } catch (Exception e) {
            log.error("recipe_views 테이블 생성 중 오류 발생: ", e);
            throw new RuntimeException("recipe_views 테이블 생성 실패", e);
        }
    }
}
