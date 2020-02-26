import { Message } from 'discord.js';
import ICommandType from './ICommandType';
import IUserCommand from './IUserCommand';

import { escapeRegExp } from '../util';

const commandTypes:ICommandType[] = [];

export default class CommandManager {

    static registerCommand(commandType: ICommandType) {

        if(commandType == null) return;

        let commandTypeExists = 
            commandTypes.some(c => c.trigger.toLowerCase() === commandType.trigger.toLowerCase());

        if(!commandTypeExists) {
            commandTypes.push(commandType);
        }   
    }

    static unregisterCommand(commandTrigger: string) {
        let index = commandTypes.findIndex(c => c.trigger === commandTrigger);
        if(index > -1) {
            commandTypes.splice(index, 1);
        }
    }

    static checkForCommand(rawMessage: string) {
        if(rawMessage == null || rawMessage.length < 1) {
            // bad argument
            return null;
        }

        for(let commandType of commandTypes) {

            let foundMatch = false;
            if(commandType.ignoreCase) {
                foundMatch = rawMessage.toLowerCase().startsWith(commandType.trigger.toLowerCase());
            } else {
                foundMatch = rawMessage.startsWith(commandType.trigger);
            }

            if(foundMatch) {
                let userCommand = buildUserCommand(commandType.trigger, rawMessage);

                return {
                    userCommand,
                    commandType
                };
            }
        }

        return null;
    }

    static handleMessage(message: Message) {
        let commandCheck = this.checkForCommand(message.content);

        if(commandCheck) {
            let command = commandCheck.commandType;

            command.execute(message, commandCheck.userCommand);

            if(command.deleteTrigger && message.deletable) {
                message.delete(0);
                console.log("Deleted cmd!");
            }
        }
    }
}

function buildUserCommand(trigger: string, rawMessage: string): IUserCommand {
    let regex = new RegExp(escapeRegExp(trigger), "i");

    let strippedTriggerMsg = rawMessage.replace(regex, "").trim();

    let args = strippedTriggerMsg.split(" ");

    return {
        trigger,
        args
    }      
}