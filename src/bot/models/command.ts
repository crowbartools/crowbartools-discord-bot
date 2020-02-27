import { Message } from 'discord.js';

export interface ICommandType {
    triggers: string[];
    description: string;
    deleteTrigger: boolean;
    execute(message: Message, userCommand: IUserCommand): void;
}

export interface IUserCommand {
    trigger: string;
    args: string[];
}
