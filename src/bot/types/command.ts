import { ModalSubmitInteraction } from 'discord-modals';
import {
    ApplicationOptions,
    ApplicationCommandPermissions,
} from 'discord-slash-commands-client';
import { Client, Interaction } from 'discord.js';
import { Client as InteractionClient } from 'discord-slash-commands-client';

export interface ICommandType {
    applicationCommands?: Array<{
        config: ApplicationOptions;
        permissions?: ApplicationCommandPermissions[];
    }>;
    handleInteraction?(
        interaction: Interaction,
        discordClient: Client,
        interactionClient: InteractionClient
    ): void;
    modalSubmitListeners?: Record<
        string,
        (interaction: ModalSubmitInteraction) => void
    >;
}

export interface IUserCommand {
    trigger: string;
    args: string[];
}
