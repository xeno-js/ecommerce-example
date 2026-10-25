import { Command } from "@xeno-js/core";

export class LoginCommand extends Command<{url:string}> {
    constructor(public readonly provider: string) {
        super('LOGIN')
    }
}