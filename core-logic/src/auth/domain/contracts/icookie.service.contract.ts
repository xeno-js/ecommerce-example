import { Session } from "@xeno-js/core";

export interface ICookieService {
    create(session: Session): string[]
}