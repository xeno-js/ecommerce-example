import { AppError, Guards, Result } from '@xeno-js/core';
import type { Optional, ResultType, UserContext } from '@xeno-js/core';
import { Repository } from '@xeno-js/core';
import { User } from '../../domain/entities/user.entity';
import { UserDto } from '../schemas/user.schema';
import { IUserDataSource } from '../../domain/contracts/iuser-datasource.contract';
import { UserMapper } from '../../application/mappers/user.mapper';
import { IUserRepository } from '../../domain/contracts';

export class UserRepository extends Repository<User, UserDto> implements IUserRepository {
    constructor(
        private readonly _userDataSource: IUserDataSource,
        private readonly _userMapper: UserMapper,
    ) {
        super(_userDataSource, _userMapper);
    }

    public async findByEmail(
        email: string,
        ctx: UserContext,
        signal: Optional<AbortSignal>,
    ): Promise<ResultType<Optional<User>>> {
        AppError.throwIfAborted(signal, 'UserRepository.findByEmail');

        const resultDto = await this._userDataSource.findByEmail(email, ctx, signal);
        if (!Guards.isDefined(resultDto)) {
            return Result.ok();
        }

        const entity = this._userMapper.toEntity(resultDto);
        return Result.ok(entity);
    }

    public async upsert(
        entity: User,
        ctx: UserContext,
        signal: Optional<AbortSignal>,
    ): Promise<ResultType<void>> {
        AppError.throwIfAborted(signal, 'UserRepository.upsert');

        const fullDto = this._userMapper.toDto(entity);

        const partialDto = this._userMapper.toPartialDto(entity);
        const { createdAt, id, ...safeUpdateData } = partialDto;

        await this._userDataSource.upsert(
            {
                ...fullDto,
                createdAt: fullDto.createdAt ?? new Date(),
            },
            safeUpdateData,
            signal,
        );

        return Result.ok();
    }
}