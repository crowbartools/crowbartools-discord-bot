import {
    ApplicationOptions,
    ApplicationCommandPermissions,
} from 'discord-slash-commands-client';
import { Interaction, Message } from 'discord.js';

export interface ICommandType {
    triggers: string[];
    description: string;
    deleteTrigger: boolean;
    execute(message: Message, userCommand: IUserCommand): void;
    supportsSlashCommands?: boolean;
    slashCommandConfig?: ApplicationOptions;
    slashCommandPermissions?: ApplicationCommandPermissions[];
    handleInteraction?(interaction: Interaction): void;
}

export interface IUserCommand {
    trigger: string;
    args: string[];
}
