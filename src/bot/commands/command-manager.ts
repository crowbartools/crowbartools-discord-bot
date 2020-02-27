import { Message } from 'discord.js';
import { ICommandType, IUserCommand } from '../models/command';

interface ICommandCheck {
    userCommand: IUserCommand;
    commandType: ICommandType;
}

const registeredCommandTypes: ICommandType[] = [];

export function registerCommand(commandType: ICommandType): void {
    if (commandType == null) return;

    const commandTypeExists = registeredCommandTypes.some(
        c => c.trigger.toLowerCase() === commandType.trigger.toLowerCase()
    );

    if (!commandTypeExists) {
        registeredCommandTypes.push(commandType);
    }
}

export function unregisterCommand(commandTrigger: string): void {
    const index = registeredCommandTypes.findIndex(c => c.trigger === commandTrigger);
    if (index > -1) {
        registeredCommandTypes.splice(index, 1);
    }
}

function checkForCommand(rawMessage: string): ICommandCheck {
    if (rawMessage == null || rawMessage.length < 1) {
        return null;
    }

    // trim whitespace, then split message by space
    const tokens = rawMessage.trim().split(' ');

    // get first token to test as a command trigger
    const trigger = tokens[0];

    // find matching command type
    const commandType = registeredCommandTypes.find(
        ct => (ct.ignoreCase && trigger.toLowerCase() === ct.trigger.toLowerCase()) || trigger === ct.trigger
    );

    if (commandType != null) {
        tokens.shift();
        return {
            commandType,
            userCommand: {
                trigger,
                args: tokens,
            },
        };
    }

    return null;
}

export function handleMessage(message: Message): void {
    const commandCheck = checkForCommand(message.content);

    if (commandCheck) {
        const command = commandCheck.commandType;

        command.execute(message, commandCheck.userCommand);

        if (command.deleteTrigger && message.deletable) {
            message.delete(0);
        }
    }
}
