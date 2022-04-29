import { Client, Interaction } from 'discord.js';
import { ICommandType, IUserCommand } from '../models/command';
import { Client as InteractionClient } from 'discord-slash-commands-client';
import { ModalSubmitInteraction } from 'discord-modals';

interface ICommandCheck {
    userCommand: IUserCommand;
    commandType: ICommandType;
}

const registeredCommandTypes: ICommandType[] = [];

export function registerCommand(commandType: ICommandType): void {
    if (commandType == null) return;

    registeredCommandTypes.push(commandType);
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

export function handleModalSubmit(interaction: ModalSubmitInteraction): void {
    registeredCommandTypes
        .filter(c => c.modalSubmitListeners != null)
        .forEach(c => {
            const listeners = Object.entries(c.modalSubmitListeners);
            listeners.forEach(([modalId, callback]) => {
                if (modalId === interaction.customId) {
                    callback(interaction);
                }
            });
        });
}

export function handleInteraction(
    interaction: Interaction,
    discordClient: Client,
    interactionClient: InteractionClient
): void {
    if (!(interaction.isContextMenu() || interaction.isCommand())) {
        return;
    }

    const command = checkForApplicationCommand(interaction.commandName);

    if (!command) return;

    command.handleInteraction(interaction, discordClient, interactionClient);
}
