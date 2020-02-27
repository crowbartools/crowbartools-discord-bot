import { Message } from 'discord.js';

export interface ICommandType {
    trigger: string;
    description: string;
    deleteTrigger: boolean;
    ignoreCase: boolean;
    execute(message: Message, userCommand: IUserCommand): void;
}

export interface IUserCommand {
    trigger: string;
    args: string[];
}
