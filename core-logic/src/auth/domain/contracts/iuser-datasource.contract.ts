import type { IWriteDataSource, Optional, UserContext } from '@xeno-js/core'
import { UserDto } from '../../infrastructure/schemas/user.schema';

export interface IUserDataSource extends IWriteDataSource<UserDto> {
    findByEmail(email: string, ctx: UserContext, signal: Optional<AbortSignal>): Promise<Optional<UserDto>>;
    upsert(dto: UserDto, partialDto: Partial<UserDto>, signal: Optional<AbortSignal>): Promise<void>;
}