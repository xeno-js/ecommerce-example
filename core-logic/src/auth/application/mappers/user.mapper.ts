import type { IMapper } from '@xeno-js/core';
import { UserDto } from '../../infrastructure/schemas/user.schema';
import { User, UserProps } from '../../domain/entities/user.entity';

export class UserMapper implements IMapper<User, UserDto> {
    public toEntity(dto: UserDto): User {
        const props: UserProps = {
            name: dto.name,
            email: dto.email,
            tenantId: dto.tenantId,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt,
            lastLoginAt: dto.lastLoginAt,
            deletedAt: dto.deletedAt,
            isDeleted: dto.isDeleted
        };
        return User.fromProps(props, dto.id);
    }

    public toDto(entity: User): UserDto {
        const props = entity.getProps();
        return {
            name: props.name,
            email: props.email,
            tenantId: props.tenantId,
            id: entity.getId().toString(),
            createdAt: props.createdAt,
            isDeleted: props.isDeleted ?? false,
            deletedAt: props.deletedAt,
            updatedAt: props.updatedAt,
            lastLoginAt: props.lastLoginAt
        };
    }

    public toPartialDto(entity: Partial<User>): Partial<UserDto> {
        const props = entity.getProps ? entity.getProps() : {} as UserProps;

        return {
            name: props.name,
            email: props.email,
            tenantId: props.tenantId,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt,
            lastLoginAt: props.lastLoginAt,
            deletedAt: props.deletedAt,
            isDeleted: props.isDeleted
        };
    }
}