import { ModalSubmitInteraction } from 'discord.js';

export type IModalHandler = {
    handleModalIds: string[];
    onModalSubmit: (
        interaction: ModalSubmitInteraction,
        modalData?: string
    ) => Promise<void>;
};

export function isModalHandler(handler: unknown): handler is IModalHandler {
    return handler != null && (handler as any).handleModalIds != null;
}
