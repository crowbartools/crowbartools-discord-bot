import {
    CommandType,
    ICommandHandler,
    MessageContextMenuCommandHandler,
    SlashCommandHandler,
} from './command-handler.interface';

import { submitFeatureSlashCommand } from './handlers/submit-feature-slash';
import { submitBugSlashCommand } from './handlers/submit-bug-slash';
import { modalManager } from '../modals/modal-manager';
import { isModalHandler } from '../modals/modal-handler.interface';
import { IInteractionManager } from '../interaction-manager.interface';
import { Interaction, InteractionType } from 'discord.js';
import { submitBugContextMenuCommand } from './handlers/submit-bug-context';
import { submitFeatureContextMenuCommand } from './handlers/submit-feature-context';
import { lookupIssueSlashCommand } from './handlers/lookup-issue-slash';
import { saySlashCommand } from './handlers/say-slash';
import { sendToQuestionsContextMenuCommand } from './handlers/send-to-questions-context';
import { sendToIssuesContextMenuCommand } from './handlers/send-to-issues-context';
import { randomFeaturedSlashCommand } from './handlers/random-featured-slash';
import { docsSlashCommand } from './handlers/docs/docs-slash';
import { infoSlashCommand } from './handlers/info/info-slash';
import { backupRequestCommand } from './handlers/backup-request';

class CommandManager implements IInteractionManager {
    private handlers: ICommandHandler[] = [];

    interactionTypes = [
        InteractionType.ApplicationCommand,
        InteractionType.ApplicationCommandAutocomplete,
    ];

    loadHandlers() {
        const commandsToRegister: ICommandHandler[] = [
            submitFeatureSlashCommand,
            submitFeatureContextMenuCommand,
            submitBugSlashCommand,
            submitBugContextMenuCommand,
            lookupIssueSlashCommand,
            saySlashCommand,
            sendToIssuesContextMenuCommand,
            sendToQuestionsContextMenuCommand,
            randomFeaturedSlashCommand,
            docsSlashCommand,
            infoSlashCommand,
            backupRequestCommand,
        ];

        for (const handler of commandsToRegister) {
            this.handlers.push(handler);
            if (isModalHandler(handler)) {
                modalManager.registerHandler(handler);
            }
        }
    }

    getRegisteredCommandHandlers() {
        return this.handlers;
    }

    async handleInteraction(interaction: Interaction) {
        if (interaction.isChatInputCommand()) {
            const command = this.getCommandByNameAndType(
                interaction.commandName,
                CommandType.SlashCommand
            );

            if (!command) {
                throw new Error(
                    `No handler found for command: ${interaction.commandName}`
                );
            }

            await command.onTrigger(interaction);
        } else if (interaction.isAutocomplete()) {
            const command = this.getCommandByNameAndType(
                interaction.commandName,
                CommandType.SlashCommand
            );

            if (!command) {
                throw new Error(
                    `No handler found for command: ${interaction.commandName}`
                );
            }

            if (command.onAutocomplete) {
                await command.onAutocomplete(interaction);
            }
        } else if (interaction.isMessageContextMenuCommand()) {
            const command = this.getCommandByNameAndType(
                interaction.commandName,
                CommandType.MessageContextMenuCommand
            );

            if (!command) {
                throw new Error(
                    `No handler found for command: ${interaction.commandName}`
                );
            }

            await command.onTrigger(interaction);
        }
    }

    private getCommandByNameAndType<T extends CommandType>(
        commandName: string,
        type: T
    ): T extends CommandType.SlashCommand
        ? SlashCommandHandler | null
        : MessageContextMenuCommandHandler | null {
        return this.handlers.find(
            (c) => c.config.name === commandName && c.type === type
        ) as T extends CommandType.SlashCommand
            ? SlashCommandHandler
            : MessageContextMenuCommandHandler;
    }
}

export const commandManager = new CommandManager();
