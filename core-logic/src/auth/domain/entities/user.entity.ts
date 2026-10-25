import { Entity, Guards, Nullable } from '@xeno-js/core'

export interface UserProps {
    name: string
    email: string
    tenantId: Nullable<string>
    createdAt: Nullable<Date>
    updatedAt: Nullable<Date>
    lastLoginAt: Nullable<Date>
    deletedAt: Nullable<Date>
    isDeleted: boolean
}

export class User extends Entity<UserProps> {
    private constructor(props: UserProps, id?: string) {
        super(props, id)
    }

    isInactive(): boolean {
        return this.getProps().isDeleted || Guards.isDefined(this.getProps().deletedAt)
    }

    updateLastLogin(user: User): User {
        return new User({ ...user.getProps(), lastLoginAt: new Date() }, user.getId().toString())
    }

    static fromProps(props: UserProps, id?: string): User {
        return new User(props, id);
    }

    static create(props: { userId?: string; name: string; email: string; tenantId: Nullable<string> }): User {
        const now = new Date()
        const newUserProps: UserProps = {
            name: props.name,
            email: props.email,
            tenantId: props.tenantId,
            createdAt: now,
            updatedAt: now,
            lastLoginAt: now,
            deletedAt: null,
            isDeleted: false
        };
        return new User(newUserProps, props.userId);
    }
}
