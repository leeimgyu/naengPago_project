-- OAuth 소셜 로그인 필드 추가
-- provider: OAuth 제공자 (google, kakao, naver 등)
-- provider_id: OAuth 제공자의 사용자 고유 ID

ALTER TABLE users
ADD COLUMN IF NOT EXISTS provider VARCHAR(50),
ADD COLUMN IF NOT EXISTS provider_id VARCHAR(255);

-- provider와 provider_id 조합에 대한 인덱스 추가 (조회 성능 향상)
CREATE INDEX IF NOT EXISTS idx_users_provider_provider_id
ON users(provider, provider_id)
WHERE provider IS NOT NULL AND provider_id IS NOT NULL;

-- provider와 provider_id 조합은 unique해야 함
-- (동일한 Google 계정으로 여러 번 가입 방지)
ALTER TABLE users
ADD CONSTRAINT unique_provider_provider_id
UNIQUE (provider, provider_id);
