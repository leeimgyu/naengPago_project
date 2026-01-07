-- recipes 테이블의 기본 키(rcp_seq)를 생성하기 위한 시퀀스를 생성합니다.
-- @SequenceGenerator가 이 시퀀스를 사용하여 ID를 가져오므로, 이 시퀀스가 데이터베이스에 존재해야 합니다.
CREATE SEQUENCE IF NOT EXISTS recipes_rcp_seq_seq;
