import type { IRepository, Optional, ResultType, UserContext } from "@xeno-js/core";
import type { User } from "../entities/user.entity";

export interface IUserRepository extends IRepository<User> {
    findByEmail(email: string, ctx: UserContext, signal: Optional<AbortSignal>): Promise<ResultType<Optional<User>>>;
    upsert(entity: User, ctx: UserContext, signal: Optional<AbortSignal>,): Promise<ResultType<void>>;
}