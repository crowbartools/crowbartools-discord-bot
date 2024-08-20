import {
    Interaction,
    InteractionType,
    ModalSubmitInteraction,
} from 'discord.js';
import { submitIssueModalHandler } from './handlers/submit-issue-modal';
import { IModalHandler } from './modal-handler.interface';
import { IInteractionManager } from '../interaction-manager.interface';
import { parseModalId } from '../../helpers/modal-id-parser';

class ModalManager implements IInteractionManager {
    private handlers: IModalHandler[] = [];

    interactionTypes = [InteractionType.ModalSubmit];

    loadHandlers() {
        const handlers: IModalHandler[] = [submitIssueModalHandler];

        for (const handler of handlers) {
            this.handlers.push(handler);
        }
    }

    registerHandler(handler: IModalHandler) {
        this.handlers.push(handler);
    }

    async handleInteraction(interaction: Interaction) {
        if (interaction.isModalSubmit()) {
            const { id, data } = parseModalId(interaction.customId);
            const handler = this.handlers.find((h) =>
                h.handleModalIds.includes(id)
            );

            if (!handler) {
                throw new Error(`No handler found for modal ID: ${id}`);
            }

            await handler.onModalSubmit(interaction, data);
        }
    }
}

export const modalManager = new ModalManager();
