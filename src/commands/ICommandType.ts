import { Message } from 'discord.js';
import IUserCommand from './IUserCommand';

export default interface ICommandType {
    trigger: string;
    description: string;
    deleteTrigger: boolean;
    ignoreCase: boolean;
    execute(message: Message, userCommand: IUserCommand): void;
}
