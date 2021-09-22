import {
    ApplicationOptions,
    ApplicationCommandPermissions,
} from 'discord-slash-commands-client';
import { Client, Interaction, Message } from 'discord.js';

export interface ICommandType {
    triggers: string[];
    description: string;
    deleteTrigger: boolean;
    execute(message: Message, userCommand: IUserCommand): void;
    applicationCommands?: Array<{
        config: ApplicationOptions;
        permissions?: ApplicationCommandPermissions[];
    }>;
    handleInteraction?(interaction: Interaction, discordClient: Client): void;
}

export interface IUserCommand {
    trigger: string;
    args: string[];
}
