package com.backend.mappers;

import com.backend.dto.SignUpRequestDTO;
import com.backend.dto.UserSummaryDTO;
import com.backend.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * User 엔티티 <-> DTO 변환 매퍼
 */
@Mapper(componentModel = "spring")
public interface UserMapper {

    /**
     * SignUpRequestDTO -> User 엔티티 변환
     *
     * @param dto SignUpRequestDTO
     * @return User 엔티티
     */
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "passwordHash", source = "password")
    @Mapping(target = "lastLoginAt", ignore = true)
    @Mapping(target = "isActive", constant = "true")
    @Mapping(target = "isDeleted", constant = "false")
    @Mapping(target = "profileImage", ignore = true)
    User toEntity(SignUpRequestDTO dto);

    /**
     * User 엔티티 -> UserSummaryDTO 변환
     *
     * @param user User 엔티티
     * @return UserSummaryDTO
     */
    UserSummaryDTO toSummaryDto(User user);
}
