import { Message } from 'discord.js';
import ICommandType from './ICommandType';
import IUserCommand from './IUserCommand';

import { escapeRegExp } from '../util';

interface CommandCheck {
    userCommand: IUserCommand;
    commandType: ICommandType;
}

const registeredCommandTypes: ICommandType[] = [];

function buildUserCommand(trigger: string, rawMessage: string): IUserCommand {
    const regex = new RegExp(escapeRegExp(trigger), "i");

    const strippedTriggerMsg = rawMessage.replace(regex, "").trim();

    const args = strippedTriggerMsg.split(" ");

    return {
        trigger,
        args
    }      
}

export function registerCommand(commandType: ICommandType): void {

    if(commandType == null) return;

    const commandTypeExists = 
        registeredCommandTypes.some(c => c.trigger.toLowerCase() === commandType.trigger.toLowerCase());

    if(!commandTypeExists) {
        registeredCommandTypes.push(commandType);
    }   
}

export function unregisterCommand(commandTrigger: string): void {
    const index = registeredCommandTypes.findIndex(c => c.trigger === commandTrigger);
    if(index > -1) {
        registeredCommandTypes.splice(index, 1);
    }
}

export function checkForCommand(rawMessage: string): CommandCheck {
    if(rawMessage == null || rawMessage.length < 1) {
        // bad argument
        return null;
    }

    for(const commandType of registeredCommandTypes) {

        let foundMatch = false;
        if(commandType.ignoreCase) {
            foundMatch = rawMessage.toLowerCase().startsWith(commandType.trigger.toLowerCase());
        } else {
            foundMatch = rawMessage.startsWith(commandType.trigger);
        }

        if(foundMatch) {
            const userCommand = buildUserCommand(commandType.trigger, rawMessage);

            return {
                userCommand,
                commandType
            };
        }
    }

    return null;
}

export function handleMessage(message: Message): void {
    const commandCheck = checkForCommand(message.content);

    if(commandCheck) {
        const command = commandCheck.commandType;

        command.execute(message, commandCheck.userCommand);

        if(command.deleteTrigger && message.deletable) {
            message.delete(0);
        }
    }
}