import { Client, Interaction, Message } from 'discord.js';
import { ICommandType, IUserCommand } from '../models/command';

interface ICommandCheck {
    userCommand: IUserCommand;
    commandType: ICommandType;
}

const registeredCommandTypes: ICommandType[] = [];

export function registerCommand(commandType: ICommandType): void {
    if (commandType == null) return;

    const commandTriggerExists = registeredCommandTypes.some(c =>
        c.triggers.some(t =>
            commandType.triggers.some(
                ct => ct.toLowerCase() === t.toLowerCase()
            )
        )
    );

    if (!commandTriggerExists) {
        registeredCommandTypes.push(commandType);
    }
}

export function unregisterCommand(commandTrigger: string): void {
    const index = registeredCommandTypes.findIndex(c =>
        c.triggers.some(t => t.toLowerCase() === commandTrigger.toLowerCase())
    );
    if (index > -1) {
        registeredCommandTypes.splice(index, 1);
    }
}

export function getRegisteredApplicationCommands(): ICommandType[] {
    return registeredCommandTypes.filter(
        c => c.applicationCommands?.length > 0
    );
}

function checkForApplicationCommand(commandName: string): ICommandType {
    return registeredCommandTypes.find(c =>
        c.applicationCommands?.some(ac => ac.config.name === commandName)
    );
}

function checkForCommand(rawMessage: string): ICommandCheck {
    if (rawMessage == null || rawMessage.length < 1) {
        return null;
    }

    // trim whitespace, then split message by space
    const tokens = rawMessage.trim().split(/ +/);

    // get first token to test as a command trigger
    const trigger = tokens[0];

    // find matching command type
    const commandType = registeredCommandTypes.find(ct =>
        ct.triggers.some(t => t.toLowerCase() === trigger.toLowerCase())
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
            message.delete();
        }
    }
}

export function handleInteraction(
    interaction: Interaction,
    discordClient: Client
): void {
    if (!(interaction.isContextMenu() || interaction.isCommand())) {
        return;
    }

    const command = checkForApplicationCommand(interaction.commandName);

    if (!command) return;

    command.handleInteraction(interaction, discordClient);
}
