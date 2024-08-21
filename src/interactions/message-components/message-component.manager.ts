import { Interaction, InteractionType } from 'discord.js';
import { IInteractionManager } from '../interaction-manager.interface';
import { IMessageComponentHandler } from './message-component-handler.interface';

class MessageComponentManager implements IInteractionManager {
    private handlers: IMessageComponentHandler[] = [];

    interactionTypes = [InteractionType.MessageComponent];

    loadHandlers() {}

    registerHandler(handler: IMessageComponentHandler) {
        this.handlers.push(handler);
    }

    async handleInteraction(interaction: Interaction): Promise<void> {
        if (!interaction.isMessageComponent()) {
            return;
        }

        const handler = this.handlers.find((h) =>
            h.handleMessageComponentIds.includes(interaction.customId)
        );

        if (!handler) {
            return;
        }

        await handler.onMessageComponentInteraction(interaction);
    }
}

export const messageComponentManager = new MessageComponentManager();
