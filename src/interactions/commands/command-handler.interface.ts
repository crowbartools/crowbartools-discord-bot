import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    ContextMenuCommandBuilder,
    MessageContextMenuCommandInteraction,
    SlashCommandBuilder,
    SlashCommandOptionsOnlyBuilder,
} from 'discord.js';
import { IModalHandler } from '../modals/modal-handler.interface';
import { IMessageComponentHandler } from '../message-components/message-component-handler.interface';

export enum CommandType {
    SlashCommand = 'slash-command',
    MessageContextMenuCommand = 'message-context-menu',
}

type ModalOptions = IModalHandler | { handleModalIds?: undefined };

type MessageComponentOptions =
    | IMessageComponentHandler
    | { handleMessageComponentIds?: undefined };

export type SlashCommandHandler = {
    type: CommandType.SlashCommand;
    config: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    onTrigger: (interaction: ChatInputCommandInteraction) => Promise<void>;
    onAutocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
} & ModalOptions &
    MessageComponentOptions;

export type MessageContextMenuCommandHandler = {
    type: CommandType.MessageContextMenuCommand;
    config: ContextMenuCommandBuilder;
    onTrigger: (
        interaction: MessageContextMenuCommandInteraction
    ) => Promise<void>;
} & ModalOptions &
    MessageComponentOptions;

export type ICommandHandler =
    | SlashCommandHandler
    | MessageContextMenuCommandHandler;
